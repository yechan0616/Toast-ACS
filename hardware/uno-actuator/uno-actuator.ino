#include <Servo.h>
#include <SoftwareSerial.h>

const int PIN_LINK_RX = 2;
const int PIN_LINK_TX = 3;
const int PIN_LED_NG = 4;
const int PIN_LED_OK = 5;
const int PIN_BUZZER = 6;
const int PIN_RELAY = 7;
const int PIN_SERVO = 9;

const int SERVO_STOP_DEG = 90;
const int SERVO_OPEN_SPIN_DEG = 0;
const int SERVO_CLOSE_SPIN_DEG = 180;
const unsigned long SERVO_SPIN_MS = 400;
const unsigned long LINK_TIMEOUT_MS = 1500;

Servo servo;
SoftwareSerial link(PIN_LINK_RX, PIN_LINK_TX);

bool gateOpen = false;
bool alarmActive = false;
bool doorOpen = false;
bool spinning = false;
bool spinTarget = false;
unsigned long spinUntil = 0;
unsigned long lastMsgAt = 0;
String line;

void setup() {
  Serial.begin(115200);
  link.begin(9600);
  pinMode(PIN_RELAY, OUTPUT);
  pinMode(PIN_LED_OK, OUTPUT);
  pinMode(PIN_LED_NG, OUTPUT);
  pinMode(PIN_BUZZER, OUTPUT);
  Serial.println("uno-actuator 시작 — 연속회전 서보 모드, 부팅 전 차단바를 닫힘 위치로 맞춰 두세요");
}

void handleLine(const String& msg) {
  if (msg.length() < 3 || msg[0] != 'S') return;
  gateOpen = msg[1] == '1';
  alarmActive = msg[2] == '1';
  lastMsgAt = millis();
}

void updateServo() {
  if (spinning) {
    if (millis() >= spinUntil) {
      servo.write(SERVO_STOP_DEG);
      servo.detach();
      doorOpen = spinTarget;
      spinning = false;
    }
    return;
  }
  if (gateOpen != doorOpen) {
    spinTarget = gateOpen;
    servo.attach(PIN_SERVO);
    servo.write(spinTarget ? SERVO_OPEN_SPIN_DEG : SERVO_CLOSE_SPIN_DEG);
    spinUntil = millis() + SERVO_SPIN_MS;
    spinning = true;
  }
}

void loop() {
  while (link.available()) {
    char c = (char)link.read();
    if (c == '\n') {
      line.trim();
      handleLine(line);
      line = "";
    } else if (line.length() < 16) {
      line += c;
    }
  }

  if (lastMsgAt != 0 && millis() - lastMsgAt > LINK_TIMEOUT_MS) {
    gateOpen = false;
    alarmActive = false;
  }

  updateServo();

  digitalWrite(PIN_RELAY, gateOpen ? HIGH : LOW);
  digitalWrite(PIN_LED_OK, gateOpen ? HIGH : LOW);
  digitalWrite(PIN_LED_NG, alarmActive ? HIGH : LOW);
  digitalWrite(PIN_BUZZER, alarmActive ? HIGH : LOW);
}
