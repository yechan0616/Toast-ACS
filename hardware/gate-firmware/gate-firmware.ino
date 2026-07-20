#include <ArduinoJson.h>

#include "config.h"

#ifndef USE_WIFI
#define USE_WIFI 0
#endif
#ifndef WIFI_SSID_FALLBACK
#define WIFI_SSID_FALLBACK ""
#endif
#ifndef WIFI_PASS_FALLBACK
#define WIFI_PASS_FALLBACK ""
#endif

#if USE_WIFI
#include <HTTPClient.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
const unsigned long WIFI_CONNECT_TIMEOUT_MS = 15000;
#endif

const int PIN_TRIG = D5;
const int PIN_ECHO = D6;
const int PIN_UNO_TX = D9;

const unsigned long POLL_INTERVAL_MS = 700;
const unsigned long OPEN_DURATION_MS = 3000;
const unsigned long SAFETY_HOLD_MAX_MS = 7000;
const unsigned long PRESENCE_FRESH_MS = 1500;
const unsigned long LINK_INTERVAL_MS = 100;
const float PRESENCE_THRESHOLD_CM = 80.0;

HardwareSerial unoLink(1);

unsigned long lastPollAt = 0;
unsigned long lastLinkAt = 0;
unsigned long openUntil = 0;
unsigned long openHardLimit = 0;
unsigned long lastPresenceAt = 0;
bool alarmActive = false;
bool doorOpenState = false;
String rxLine;

void setup() {
  Serial.begin(115200);
  pinMode(PIN_TRIG, OUTPUT);
  pinMode(PIN_ECHO, INPUT);

  unoLink.begin(9600, SERIAL_8N1, -1, PIN_UNO_TX);

#if USE_WIFI
  connectWifi();
#else
  Serial.println("# Toast ACS gate — USB 모드, 브리지 연결 대기");
#endif
}

#if USE_WIFI
bool tryConnect(const char* ssid, const char* pass, unsigned long timeoutMs) {
  if (ssid == nullptr || ssid[0] == '\0') return false;
  Serial.printf("\nWiFi 연결 시도: %s", ssid);
  WiFi.begin(ssid, pass);
  unsigned long start = millis();
  while (WiFi.status() != WL_CONNECTED) {
    if (millis() - start > timeoutMs) {
      WiFi.disconnect();
      return false;
    }
    delay(300);
    Serial.print(".");
  }
  return true;
}

void connectWifi() {
  while (WiFi.status() != WL_CONNECTED) {
    if (tryConnect(WIFI_SSID, WIFI_PASS, WIFI_CONNECT_TIMEOUT_MS)) break;
    if (tryConnect(WIFI_SSID_FALLBACK, WIFI_PASS_FALLBACK, WIFI_CONNECT_TIMEOUT_MS)) break;
    Serial.println("\nWiFi 연결 실패 — 잠시 후 재시도");
    delay(1000);
  }
  Serial.printf("\nWiFi connected: %s\n", WiFi.localIP().toString().c_str());
}
#endif

float readDistanceCm() {
  digitalWrite(PIN_TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(PIN_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(PIN_TRIG, LOW);
  long duration = pulseIn(PIN_ECHO, HIGH, 25000);
  if (duration == 0) return -1;
  return duration * 0.0343f / 2.0f;
}

int readPassedCount() {
  // TODO: HuskyLens를 UART(D10/D11 재할당)로 연결해 실제 통과 인원을 반환해요
  return 0;
}

void handleResponse(const String& payload) {
  JsonDocument res;
  if (deserializeJson(res, payload) != DeserializationError::Ok) return;
  if (res["open"] | false) {
    openUntil = millis() + OPEN_DURATION_MS;
    openHardLimit = openUntil + SAFETY_HOLD_MAX_MS;
  }
  alarmActive = res["alarm"] | false;
}

String buildPollBody() {
  float distance = readDistanceCm();
  bool ultrasonic = distance > 0 && distance < PRESENCE_THRESHOLD_CM;
  if (ultrasonic) lastPresenceAt = millis();

  JsonDocument req;
  req["ultrasonic"] = ultrasonic;
  req["passedCount"] = readPassedCount();
  String body;
  serializeJson(req, body);
  return body;
}

bool computeDoorOpen() {
  unsigned long now = millis();
  if (now < openUntil) return true;
  bool presenceFresh = lastPresenceAt != 0 && now - lastPresenceAt < PRESENCE_FRESH_MS;
  return doorOpenState && presenceFresh && now < openHardLimit;
}

void broadcastLink() {
  if (millis() - lastLinkAt < LINK_INTERVAL_MS) return;
  lastLinkAt = millis();
  doorOpenState = computeDoorOpen();
  unoLink.printf("S%d%d\n", doorOpenState ? 1 : 0, alarmActive ? 1 : 0);
}

#if USE_WIFI
void sendPoll() {
  HTTPClient http;
  WiFiClientSecure secure;
  // TODO: 시연 뒤에는 setInsecure 대신 인증서 핀닝을 적용해요
  secure.setInsecure();

  String url = String(API_BASE) + "/api/gate/poll";
  bool https = url.startsWith("https");
  if (https ? http.begin(secure, url) : http.begin(url)) {
    http.addHeader("Content-Type", "application/json");
    http.addHeader("X-Gate-Key", GATE_KEY);
    http.setTimeout(2000);

    int status = http.POST(buildPollBody());
    if (status == 200) {
      handleResponse(http.getString());
    } else {
      Serial.printf("poll failed: %d\n", status);
    }
    http.end();
  }
}
#else
void sendPoll() {
  Serial.println(buildPollBody());
}

void pumpTransport() {
  while (Serial.available()) {
    char c = (char)Serial.read();
    if (c == '\n') {
      rxLine.trim();
      if (rxLine.length() > 0) handleResponse(rxLine);
      rxLine = "";
    } else if (rxLine.length() < 512) {
      rxLine += c;
    }
  }
}
#endif

void loop() {
#if USE_WIFI
  if (WiFi.status() != WL_CONNECTED) {
    connectWifi();
    return;
  }
#endif
  if (millis() - lastPollAt >= POLL_INTERVAL_MS) {
    lastPollAt = millis();
    sendPoll();
  }
#if !USE_WIFI
  pumpTransport();
#endif
  broadcastLink();
  delay(20);
}
