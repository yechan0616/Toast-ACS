#include <Servo.h>
#include <SoftwareSerial.h>

const int PIN_LINK_RX = 2;
const int PIN_LINK_TX = 3;
const int PIN_SERVO_IN = 13;
const int PIN_SERVO_OUT = 12;

const int SERVO_CLOSE_DEG = 0;
const int SERVO_OPEN_DEG = 90;
const unsigned long SERVO_MOVE_MS = 500;
const unsigned long LINK_TIMEOUT_MS = 1500;

struct Flap {
  Servo servo;
  int pin;
  int openDeg;
  int closeDeg;
  bool commanded;
  bool doorOpen;
  bool moving;
  bool moveTarget;
  unsigned long moveUntil;
};

Flap flapIn;
Flap flapOut;
SoftwareSerial link(PIN_LINK_RX, PIN_LINK_TX);

unsigned long lastMsgAt = 0;
String line;

void setup() {
  Serial.begin(115200);
  link.begin(9600);

  flapIn.pin = PIN_SERVO_IN;
  flapIn.openDeg = SERVO_OPEN_DEG;
  flapIn.closeDeg = SERVO_CLOSE_DEG;
  flapOut.pin = PIN_SERVO_OUT;
  flapOut.openDeg = SERVO_OPEN_DEG;
  flapOut.closeDeg = SERVO_CLOSE_DEG;

  startMove(flapIn, false);
  startMove(flapOut, false);

  Serial.println("uno-actuator 시작 — 입장 서보 D13 · 퇴장 서보 D12, 0도=닫힘 / 90도=열림");
}

void handleLine(const String& msg) {
  if (msg.length() < 4 || msg[0] != 'S') return;
  flapIn.commanded = msg[1] == '1';
  flapOut.commanded = msg[2] == '1';
  lastMsgAt = millis();
}

void startMove(Flap& flap, bool opening) {
  flap.moveTarget = opening;
  flap.servo.attach(flap.pin);
  flap.servo.write(opening ? flap.openDeg : flap.closeDeg);
  flap.moveUntil = millis() + SERVO_MOVE_MS;
  flap.moving = true;
}

void finishMove(Flap& flap) {
  flap.servo.detach();
  flap.doorOpen = flap.moveTarget;
  flap.moving = false;
}

void updateFlap(Flap& flap) {
  if (flap.moving) {
    if (millis() >= flap.moveUntil) finishMove(flap);
    return;
  }
  if (flap.commanded != flap.doorOpen) startMove(flap, flap.commanded);
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
    flapIn.commanded = false;
    flapOut.commanded = false;
  }

  updateFlap(flapIn);
  updateFlap(flapOut);
}
