from machine import Pin, PWM
import time
motor = PWM(Pin(16))
motor.freq(1000)
motor.duty_u16(45000)  
time.sleep(2)
motor.duty_u16(0)