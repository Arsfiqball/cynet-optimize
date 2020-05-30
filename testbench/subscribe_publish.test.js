const mqtt = require('mqtt')
const fs = require('fs')

const port = 8883
const host = 'localhost'
const protocol = 'mqtts'
const ca = [fs.readFileSync('tls_ca_cert.pem')]

const subscriber = mqtt.connect({ port, host, protocol, ca, clientId: 'Subscriber_0' })
const publisher = mqtt.connect({ port, host, protocol, ca, clientId: 'Publisher_0' })

subscriber.subscribe('messages')

subscriber.on('message', function (topic, message) {
  console.log(topic, message.toString())
})

publisher.on('connect', function () {
  const promises = []

  function publishMessage (i) {
    return new Promise ((resolve, reject) => {
      publisher.publish('messages', Buffer.from('RANDOMTEXT' + i), () => resolve())
    })
  }

  const state = { counter: 0 }

  // Send message each .5s
  const intervalID = setInterval(() => {
    promises.push(publishMessage(state.counter))
    state.counter++
  }, 500)

  // Stop after 20 messages
  setTimeout(() => {
    clearInterval(intervalID)

    // Disconnect publisher and then the subscriber
    Promise.all(promises).then(() => {
      publisher.end(() => {
        subscriber.end()
      })
    })
  }, 500 * 20 + 25) // +25 to ensure last message is sent
})

subscriber.on('error', function (error) {
  console.error('subscriber', error)
})

publisher.on('error', function (error) {
  console.error('publisher', error)
})
