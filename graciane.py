from microdot import Microdot, Response
from dht_module import DHTModule

app = Microdot()
dht_sensor = DHTModule(2)

@app.route('/temperature')
def get_temperature(request):
    temp = dht_sensor.temperature()
    data = {'temperature': temp}
    return Response(data)

@app.route('/humidity')
def get_humidite(request):
    pass

if __name__ == 'Main':
    app.run(debug=True)
