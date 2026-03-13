"""
Single-motor test for Node-RED integration.
Subscribes to the same MQTT topic as the full haptic setup.
Use this to verify Node-RED → MQTT → wearable is working before testing all 9 motors.
"""

import network
import time
import json
from machine import Pin, PWM
from umqtt.simple import MQTTClient

# ============ CONFIGURATION ============

WIFI_SSID = "Iaac-Wifi"
WIFI_PASSWORD = "EnterIaac22@"

MQTT_BROKER = "broker.hivemq.com"
MQTT_PORT = 1883
MQTT_TOPIC = b"multisense/stock/data"
MQTT_CLIENT_ID = b"multisense_motortest"  # Different ID so both can run on same broker

# Single motor for testing
MOTOR_PIN = 16

# Non-blocking motor timing (avoid sleep in MQTT callback)
motor_off_at = 0
pending_duty = 0

# ============ SETUP ============

print("MOTOR TEST - Single motor, Node-RED integration check")
print("=" * 50)

motor = PWM(Pin(MOTOR_PIN))
motor.freq(1000)
motor.duty_u16(0)
print(f"Motor on GPIO {MOTOR_PIN}")

# Connect WiFi
print(f"\nConnecting to WiFi: {WIFI_SSID}...")
wlan = network.WLAN(network.STA_IF)
wlan.active(True)
wlan.connect(WIFI_SSID, WIFI_PASSWORD)

timeout = 20
while not wlan.isconnected() and timeout > 0:
    print(".", end="")
    time.sleep(0.5)
    timeout -= 0.5

if not wlan.isconnected():
    print("\nWiFi failed!")
    raise SystemExit

print(f"\nWiFi OK: {wlan.ifconfig()[0]}")

# ============ MQTT CALLBACK ============

def mqtt_callback(topic, msg):
    """When Node-RED publishes, buzz the single motor (non-blocking)"""
    global motor_off_at, pending_duty
    try:
        raw = msg.decode()
        data = json.loads(raw)

        intensity = data.get("intensity", 0)
        direction = data.get("direction", "neutral")
        pattern = data.get("pattern", "pulse_all")
        price = data.get("price", 0)
        change = data.get("change", 0)

        print("\n--- USER CHOICES (UI -> Node-RED -> here) ---")
        print(f"  Pattern:   {pattern}")
        print(f"  Intensity: {intensity}%  (slider 1-10)")
        print(f"  Direction: {direction}  (stock up/down)")
        print(f"  Raw JSON:  {raw}")
        print("---------------------------------------------")

        duty = int((intensity / 100) * 65535)
        duty = min(65535, max(26214, duty))  # Min 40% - below that motor often doesn't buzz

        print(f"  -> Duty:  {duty}  (Motor ON)")
        motor.duty_u16(duty)
        pending_duty = duty
        motor_off_at = time.ticks_add(time.ticks_ms(), 3000)  # Off in 3 sec

    except Exception as e:
        print(f"Error: {e}")

# Connect MQTT
print(f"\nConnecting to MQTT: {MQTT_BROKER}...")
client = MQTTClient(MQTT_CLIENT_ID, MQTT_BROKER, port=MQTT_PORT)
client.set_callback(mqtt_callback)

try:
    client.connect()
    print("MQTT OK!")
except Exception as e:
    print(f"MQTT failed: {e}")
    raise SystemExit

client.subscribe(MQTT_TOPIC)
print(f"Subscribed to: {MQTT_TOPIC.decode()}")

print("\n" + "=" * 50)
print("READY - Waiting for Node-RED messages")
print("  1. React app: enter ticker, click Activate")
print("  2. Or click Test Pattern in the rule section")
print("  3. Motor should buzz when data arrives")
print("=" * 50 + "\n")

# ============ MAIN LOOP ============

try:
    while True:
        client.check_msg()
        if pending_duty > 0 and time.ticks_diff(motor_off_at, time.ticks_ms()) <= 0:
            motor.duty_u16(0)
            pending_duty = 0
            print("  Motor OFF")
        time.sleep(0.1)

except KeyboardInterrupt:
    print("\nStopping...")
    motor.duty_u16(0)
    client.disconnect()
    print("Done")
