from machine import Pin
import machine
import time
import dht
import ujson

try:
  import usocket as socket
except:
  import socket
  
ventilateur = Pin(12, Pin.OUT)
ventilateur.off()

def read_sensor():
    temp = humid = 0
    try:
        sensor.measure()
        temp = sensor.temperature()
        humid = sensor.humidity()
        if (isinstance(temp, float) and isinstance(humid, float)) or (isinstance(temp, int) and isinstance(humid, int)):
            return temp, humid
        else:
            return {'error': 'Invalid sensor readings'}
    except OSError as e:
        return {'error': 'Failed to read sensor'}

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind(('', 80))
s.listen(5)

while True:
    conn, addr = s.accept()
    request = conn.recv(1024)
    request = str(request)  
        
    if 'GET /read_sensor' in request:
        try: 
            sensor_readings = read_sensor()
        
            if sensor_readings[0] > 30:
                ventilateur.on()
            else:
                ventilateur.off()
        except:
            machine.reset()
            time.sleep(2)
            
        response = ujson.dumps(sensor_readings)
        conn.send('HTTP/1.1 200 OK\n')
        conn.send('Content-Type: application/json\n')
        conn.send('Access-Control-Allow-Origin: *\n')  
        conn.send('Connection: close\n\n')
        conn.sendall(response)
    else:
        conn.send('HTTP/1.1 404 Not Found\n')  
    conn.close()         