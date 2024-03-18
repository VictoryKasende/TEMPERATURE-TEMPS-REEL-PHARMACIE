# boot.py -- run on boot-up
import network, utime
import secrets
from machine import Pin
import dht

try:
  import usocket as socket
except:
  import socket
  
import esp
esp.osdebug(None)

import gc
gc.collect()

def do_connect():
    import network
    sta_if = network.WLAN(network.STA_IF)
    if not sta_if.isconnected():
        print('connecting to network...')
        sta_if.active(True)
        sta_if.connect(secrets.SSID, secrets.SSID_PASSWORD)
        while not sta_if.isconnected():
            pass
    print('Connected! Network config:', sta_if.ifconfig())
    
print("Connecting to your wifi...")
do_connect()
sensor = dht.DHT11(Pin(14))

