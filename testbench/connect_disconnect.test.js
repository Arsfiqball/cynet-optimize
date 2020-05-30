const mqtt = require('mqtt')
const fs = require('fs')

const client = mqtt.connect({
  port: 8883,
  host: 'localhost',
  protocol: 'mqtts',
  clientId: 'Client_0',
  // connectTimeout: 3 * 1000,
  // reconnectPeriod: 0,
  ca: [fs.readFileSync('tls_ca_cert.pem')]
})

client.on('connect', function () {
  console.log('connected')
  client.end()
})

client.on('error', function (error) {
  console.error(error)
})

client.on('close', function (error) {
  console.log('closed')
})
