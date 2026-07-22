#include <Adafruit_NeoPixel.h>
#include <ArduinoJson.h>
#include <U8g2lib.h>
#include <Wire.h>

#include "config.h"

#ifndef USE_WIFI
#define USE_WIFI 0
#endif
#ifndef USE_OLED
#define USE_OLED 1
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

const int PIN_SEAT_LED = D2;
const int PIN_OLED_OUT_SCL = D3;
const int PIN_OLED_OUT_SDA = D4;
const int PIN_TRIG_IN = D5;
const int PIN_ECHO_IN = D6;
const int PIN_TRIG_OUT = D7;
const int PIN_ECHO_OUT = D8;
const int PIN_UNO_TX = D9;
const int SEAT_LED_COUNT = 16;

const unsigned long POLL_INTERVAL_MS = 700;
const unsigned long OPEN_DURATION_MS = 3000;
const unsigned long DENY_DURATION_MS = 2500;
const unsigned long SAFETY_HOLD_MAX_MS = 7000;
const unsigned long PRESENCE_FRESH_MS = 1500;
const unsigned long LINK_INTERVAL_MS = 100;
const float PRESENCE_THRESHOLD_CM = 80.0;

HardwareSerial unoLink(1);

#if USE_OLED
U8G2_SSD1306_128X64_NONAME_F_HW_I2C oledIn(U8G2_R0);
U8G2_SSD1306_128X64_NONAME_F_SW_I2C oledOut(U8G2_R0, PIN_OLED_OUT_SCL, PIN_OLED_OUT_SDA, U8X8_PIN_NONE);
#endif

Adafruit_NeoPixel seatLeds(SEAT_LED_COUNT, PIN_SEAT_LED, NEO_GRB + NEO_KHZ800);

struct GateSide {
  unsigned long openUntil = 0;
  unsigned long openHardLimit = 0;
  unsigned long lastPresenceAt = 0;
  unsigned long denyUntil = 0;
  bool doorOpenState = false;
  String denyText;
};

GateSide gateIn;
GateSide gateOut;

unsigned long lastPollAt = 0;
unsigned long lastLinkAt = 0;
bool alarmActive = false;
String rxLine;
String seatText;
String seatMask;

#if USE_OLED
enum OledView { VIEW_IDLE, VIEW_OPEN, VIEW_ALARM, VIEW_DENY };
OledView shownViewIn = VIEW_IDLE;
OledView shownViewOut = VIEW_IDLE;
String shownSeat;
String shownGridMask;
String shownDenyIn;
String shownDenyOut;
#endif

void setup() {
  Serial.begin(115200);
  pinMode(PIN_TRIG_IN, OUTPUT);
  pinMode(PIN_ECHO_IN, INPUT);
  pinMode(PIN_TRIG_OUT, OUTPUT);
  pinMode(PIN_ECHO_OUT, INPUT);

  unoLink.begin(9600, SERIAL_8N1, -1, PIN_UNO_TX);

  seatLeds.begin();
  seatLeds.clear();
  seatLeds.show();

#if USE_OLED
  oledIn.begin();
  oledIn.enableUTF8Print();
  oledOut.begin();
  oledOut.enableUTF8Print();
  drawInIdle();
  drawOutIdle();
#endif

#if USE_WIFI
  connectWifi();
#else
  Serial.println("# Toast ACS gate — USB 모드, 브리지 연결 대기");
#endif
}

#if USE_OLED
void drawCentered(U8G2& oled, const char* text, int y) {
  int width = oled.getUTF8Width(text);
  oled.drawUTF8((128 - width) / 2, y, text);
}

void drawSeatGrid(U8G2& oled, int top) {
  const int cell = 12;
  const int gap = 2;
  int left = (128 - (8 * cell + 7 * gap)) / 2;
  for (int i = 0; i < 16; i++) {
    int x = left + (i % 8) * (cell + gap);
    int y = top + (i / 8) * (cell + gap);
    bool taken = i < (int)seatMask.length() && seatMask[i] == '1';
    if (taken) oled.drawBox(x, y, cell, cell);
    else oled.drawFrame(x, y, cell, cell);
  }
}

void drawInIdle() {
  oledIn.clearBuffer();
  oledIn.setFont(u8g2_font_unifont_t_korean2);
  drawCentered(oledIn, "좌석 현황", 14);
  drawSeatGrid(oledIn, 22);
  oledIn.sendBuffer();
}

void drawInOpen() {
  oledIn.clearBuffer();
  oledIn.setFont(u8g2_font_unifont_t_korean2);
  if (seatText.length() == 0) {
    drawCentered(oledIn, "통과 승인", 38);
  } else {
    drawCentered(oledIn, "입장 승인", 24);
    String line = "좌석 " + seatText;
    drawCentered(oledIn, line.c_str(), 50);
  }
  oledIn.sendBuffer();
}

void drawOutIdle() {
  oledOut.clearBuffer();
  oledOut.setFont(u8g2_font_unifont_t_korean2);
  drawCentered(oledOut, "TOAST ACS", 28);
  drawCentered(oledOut, "퇴장 게이트", 50);
  oledOut.sendBuffer();
}

void drawOutOpen() {
  oledOut.clearBuffer();
  oledOut.setFont(u8g2_font_unifont_t_korean2);
  drawCentered(oledOut, "통과 승인", 24);
  drawCentered(oledOut, "안녕히 가세요", 50);
  oledOut.sendBuffer();
}

void drawAlarm(U8G2& oled) {
  oled.clearBuffer();
  oled.setFont(u8g2_font_unifont_t_korean2);
  drawCentered(oled, "접근 거부", 28);
  drawCentered(oled, "관리자 확인 필요", 50);
  oled.sendBuffer();
}

void drawDeny(U8G2& oled, const String& reason) {
  oled.clearBuffer();
  oled.setFont(u8g2_font_unifont_t_korean2);
  drawCentered(oled, "공격 차단", 24);
  drawCentered(oled, reason.c_str(), 50);
  oled.sendBuffer();
}

OledView viewFor(const GateSide& gate) {
  if (alarmActive) return VIEW_ALARM;
  if (millis() < gate.denyUntil) return VIEW_DENY;
  if (millis() < gate.openUntil) return VIEW_OPEN;
  return VIEW_IDLE;
}

void updateOled() {
  OledView viewIn = viewFor(gateIn);
  bool inStale = viewIn != shownViewIn
      || (viewIn == VIEW_OPEN && seatText != shownSeat)
      || (viewIn == VIEW_DENY && gateIn.denyText != shownDenyIn)
      || (viewIn == VIEW_IDLE && seatMask != shownGridMask);
  if (inStale) {
    shownViewIn = viewIn;
    shownSeat = seatText;
    shownDenyIn = gateIn.denyText;
    shownGridMask = seatMask;
    if (viewIn == VIEW_ALARM) drawAlarm(oledIn);
    else if (viewIn == VIEW_DENY) drawDeny(oledIn, gateIn.denyText);
    else if (viewIn == VIEW_OPEN) drawInOpen();
    else drawInIdle();
  }

  OledView viewOut = viewFor(gateOut);
  bool outStale = viewOut != shownViewOut
      || (viewOut == VIEW_DENY && gateOut.denyText != shownDenyOut);
  if (outStale) {
    shownViewOut = viewOut;
    shownDenyOut = gateOut.denyText;
    if (viewOut == VIEW_ALARM) drawAlarm(oledOut);
    else if (viewOut == VIEW_DENY) drawDeny(oledOut, gateOut.denyText);
    else if (viewOut == VIEW_OPEN) drawOutOpen();
    else drawOutIdle();
  }
}
#endif

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

float readDistanceCm(int trigPin, int echoPin) {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  long duration = pulseIn(echoPin, HIGH, 25000);
  if (duration == 0) return -1;
  return duration * 0.0343f / 2.0f;
}

bool senseGate(int trigPin, int echoPin, GateSide& gate) {
  float distance = readDistanceCm(trigPin, echoPin);
  bool present = distance > 0 && distance < PRESENCE_THRESHOLD_CM;
  if (present) gate.lastPresenceAt = millis();
  return present;
}

void applySeatMask(const String& mask) {
  if (mask == seatMask) return;
  seatMask = mask;
  for (int i = 0; i < SEAT_LED_COUNT; i++) {
    bool taken = i < (int)mask.length() && mask[i] == '1';
    seatLeds.setPixelColor(i, taken ? seatLeds.Color(200, 60, 0) : 0);
  }
  seatLeds.show();
}

void handleResponse(const String& payload) {
  JsonDocument res;
  if (deserializeJson(res, payload) != DeserializationError::Ok) return;
  unsigned long now = millis();
  if (res["openIn"] | false) {
    gateIn.openUntil = now + OPEN_DURATION_MS;
    gateIn.openHardLimit = gateIn.openUntil + SAFETY_HOLD_MAX_MS;
    seatText = String(res["seat"] | "");
  }
  if (res["openOut"] | false) {
    gateOut.openUntil = now + OPEN_DURATION_MS;
    gateOut.openHardLimit = gateOut.openUntil + SAFETY_HOLD_MAX_MS;
  }
  const char* denyIn = res["denyIn"] | "";
  if (denyIn[0] != '\0') {
    gateIn.denyText = denyIn;
    gateIn.denyUntil = now + DENY_DURATION_MS;
  }
  const char* denyOut = res["denyOut"] | "";
  if (denyOut[0] != '\0') {
    gateOut.denyText = denyOut;
    gateOut.denyUntil = now + DENY_DURATION_MS;
  }
  alarmActive = res["alarm"] | false;
  applySeatMask(String(res["seats"] | ""));
}

String buildPollBody() {
  bool ultrasonicIn = senseGate(PIN_TRIG_IN, PIN_ECHO_IN, gateIn);
  bool ultrasonicOut = senseGate(PIN_TRIG_OUT, PIN_ECHO_OUT, gateOut);

  JsonDocument req;
  req["ultrasonicIn"] = ultrasonicIn;
  req["ultrasonicOut"] = ultrasonicOut;
  req["passedCount"] = 0;
  String body;
  serializeJson(req, body);
  return body;
}

bool computeDoorOpen(const GateSide& gate) {
  unsigned long now = millis();
  if (now < gate.openUntil) return true;
  bool presenceFresh = gate.lastPresenceAt != 0 && now - gate.lastPresenceAt < PRESENCE_FRESH_MS;
  return gate.doorOpenState && presenceFresh && now < gate.openHardLimit;
}

void broadcastLink() {
  if (millis() - lastLinkAt < LINK_INTERVAL_MS) return;
  lastLinkAt = millis();
  gateIn.doorOpenState = computeDoorOpen(gateIn);
  gateOut.doorOpenState = computeDoorOpen(gateOut);
  unoLink.printf("S%d%d%d\n",
      gateIn.doorOpenState ? 1 : 0,
      gateOut.doorOpenState ? 1 : 0,
      alarmActive ? 1 : 0);
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
#if USE_OLED
  updateOled();
#endif
  delay(20);
}
