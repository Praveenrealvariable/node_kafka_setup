const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'],
})

const producerFunc = async()=>{

const producer = kafka.producer()
await producer.connect()
 const sendFunc = await producer.send({
  topic: 'test-topic',
  messages: [
    { value: 'Hello KafkaJS user!' },
  ],
})


console.log("sender sending msgs in half sec")
//await producer.disconnect()


}

setInterval(producerFunc, 500)

const consumerFunc = async()=>{

const consumer = kafka.consumer({ groupId: 'test-group' })

await consumer.connect()
await consumer.subscribe({ topic: 'test-topic', fromBeginning: true })

await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    console.log("receiver receiving msges in half sec")
    console.log({
      value: message.value.toString(),
    })
  },
})

}

consumerFunc()

