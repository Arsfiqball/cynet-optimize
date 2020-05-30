const cluster = require('cluster')
const aedes = require('aedes')
const net = require('net')
const aedesPersistenceMongoDB = require('aedes-persistence-mongodb')
const mqemitterMongoDB = require('mqemitter-mongodb')
const logging = require('aedes-logging')

const PORT = 1883
const HOST = 'localhost'
const MONGO_URL = 'mongodb://127.0.0.1/cynet-optimize-test'
const USE_LOGGING = false
const LOG_MESSAGE = false

function createBroker () {
  const broker = aedes({
    id: 'BROKER_' + cluster.worker.id,
    mq: mqemitterMongoDB({
      url: MONGO_URL
    }),
    persistence: aedesPersistenceMongoDB({
      url: MONGO_URL,
      ttl: {
        packets: 300,
        subscriptions: 300,
      }
    })
  })

  const server = net.createServer(broker.handle)
  server.listen(PORT, HOST)

  if (USE_LOGGING) {
    logging({
      instance: broker,
      server: server,
      messages: LOG_MESSAGE,
      pinoOptions: {
        prettyPrint: true
      }
    })
  }
}

if (cluster.isMaster) {
  const numWorkers = require('os').cpus().length

  for (let i = 0; i < numWorkers; i++) {
    cluster.fork()
  }

  cluster.on('online', function (worker) {
    console.log(`Worker ${worker.process.pid} is online`)
  })

  cluster.on('exit', function (worker, code, signal) {
    console.log(`Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`)
    console.log('Starting a new worker')
    cluster.fork()
  })
} else {
  createBroker()
}
