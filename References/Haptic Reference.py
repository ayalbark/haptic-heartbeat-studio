"""
Haptic Reference - 9 motors, 3 patterns based on stock direction.
Patterns: Rising (up), Falling (down), All together.
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
MQTT_CLIENT_ID = b"multisense_pico"

# 9 motors in 3x3 grid: 1 at top-left, 9 at bottom-right
# Motor 1 → pin 11, Motor 2 → pin 12, ... Motor 9 → pin 19
MOTOR_PINS = [11, 12, 13, 14, 15, 16, 17, 18, 19]

# Wave sequences: motor indices (0=1, 8=9) for Rising (bottom→top) and Falling (top→bottom)
# Row 0 (top): 1,2,3 | Row 1 (mid): 4,5,6 | Row 2 (bottom): 7,8,9
RISING_ORDER = [6, 7, 8, 3, 4, 5, 0, 1, 2]   # bottom row first (7,8,9 → 4,5,6 → 1,2,3)
FALLING_ORDER = [0, 1, 2, 3, 4, 5, 6, 7, 8]  # top row first (1,2,3 → 4,5,6 → 7,8,9)
WAVE_MS = 80   # ms per motor in wave
BUZZ_MS = 2500  # sustain all motors after wave

# ============ SETUP ============

print("MULTISENSE - 9 motors, 3 patterns")
print("=" * 40)

motors = []
for i, pin in enumerate(MOTOR_PINS):
    m = PWM(Pin(pin))
    m.freq(1000)
    m.duty_u16(0)
    motors.append(m)
    print(f"  Motor {i+1} on GPIO {pin}")

def all_off():
    for m in motors:
        m.duty_u16(0)

def play_wave(motor_indices, duty, ms_per_motor=WAVE_MS):
    """Play a wave through the given motor indices."""
    for i in motor_indices:
        motors[i].duty_u16(duty)
        time.sleep_ms(ms_per_motor)
    for m in motors:
        m.duty_u16(duty)  # all on

def play_pattern(pattern, direction, duty):
    """Play rising, falling, or all-together pattern."""
    if pattern == "pulse_all":
        for m in motors:
            m.duty_u16(duty)
        return
    # rising/falling: stock direction picks wave (up=rising, down=falling)
    if direction == "up":
        play_wave(RISING_ORDER, duty)
    else:
        play_wave(FALLING_ORDER, duty)

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
    try:
        data = json.loads(msg.decode())
        intensity = data.get("intensity", 0)
        direction = data.get("direction", "neutral")
        pattern = data.get("pattern", "pulse_all")
        price = data.get("price", 0)
        change = data.get("change", 0)

        duty = int((intensity / 100) * 65535)
        duty = min(65535, max(26214, duty))  # Min 40% - below that motor often doesn't buzz

        arrow = "up" if direction == "up" else "down"
        print("\n--- USER CHOICES (from UI -> Node-RED -> here) ---")
        print(f"  Pattern:  {pattern}  (Rising/Falling = direction-aware, pulse_all = simple buzz)")
        print(f"  Intensity: {intensity}%  (from slider 1-10)")
        print(f"  Stock:    {arrow}  (from price change)")
        print(f"  -> Duty:  {duty}  (PWM)")
        print("----------------------------------------")

        play_pattern(pattern, direction, duty)
        time.sleep_ms(BUZZ_MS)
        all_off()

    except Exception as e:
        print(f"Error: {e}")
        all_off()

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
print("\nPatterns: Rising (up), Falling (down), All together")
print("=" * 40 + "\n")

# ============ MAIN LOOP ============

try:
    while True:
        client.check_msg()
        time.sleep(0.1)

except KeyboardInterrupt:
    print("\nStopping...")
    all_off()
    client.disconnect()
    print("Done")
