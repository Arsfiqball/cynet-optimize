const mqtt = require('mqtt')

const port = 1883
const host = 'localhost'
const protocol = 'mqtt'
const clientId = 'Client_0'

const client = mqtt.connect({ port, host, protocol, clientId })

client.on('connect', function () {
  setTimeout(() => {
    client.end()
  }, 500)
})

client.on('error', function (error) {
  console.error(error)
})
