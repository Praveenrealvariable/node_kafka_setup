const { Kafka } = require('kafkajs')
const express = require('express')
const app = express()


function connectToKafka() {
  const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092'],
  })
  return kafka
}
async function producerFunc() {
  try{
    return new Promise(async (resolve, reject) => {
      let kafkaProducer = connectToKafka()
      const producer = kafkaProducer.producer()
      await producer.connect().then(() => {console.log('kafka Producer connected')})
      .catch(e => {throw new Error('Could not connect producer')});
      await producer.send({
        topic: 'test-topic',
        messages: [
          { value: 'Hello KafkaJS user this is message from Producer !' },
        ],
      })
      //await producer.disconnect()
      let consumerResult = await consumerFunc()
      resolve(consumerResult)
    })
  }catch(error){
    console.log('error', error)
   const err = new Error('Oops! Something went wrong in Producer.');   
   err.statusCode = 500; 
   throw err;
  }

}
async function consumerFunc() {
  try{
    return new Promise(async (resolve, reject) => {
      connectToKafka()
      let kafkaConsumer = connectToKafka()
      const consumer = kafkaConsumer.consumer({ groupId: 'test-group' })
      await consumer.connect().then(() => {console.log('kafka consumer connected')})
      .catch(e => {throw new Error('Could not connect consumer')});
      await consumer.subscribe({ topic: 'test-topic', fromBeginning: true })
      await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          // console.log({value: message.value.toString()})
          resolve({ value: message.value.toString() })
        },
      })
    })
  }catch(error){
    console.log(error)
    const err = new Error('Oops! Something went wrong in consumer.');   
    err.statusCode = 500; 
    throw err;
  }

}

app.get('/kafka', async (req, res, next) => {
  try{
    connectToKafka()
    let result = await producerFunc()
    res.status(200).json({status:true,data:result})
  }catch(error){
    next(error)    
  }
})

app.get('/', function(req, res, next) {
  Promise.resolve().then(() => {
      const rand = Math.random()
      if (rand < 0.5) {
        const err = new Error(`Oops! Something went wrong ${String.fromCodePoint(0x1F602)}.`);
        err.statusCode = 400;
        throw err;
      }
      res.status(200).json({status:true,data:'Hello, World!'});
    })
    .catch((err) => {
      console.log('err', err)
      next(err);
    });
});


// Error handler middleware function
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong';

  res.status(statusCode).json({
    errorStatus:true,
    statusCode: statusCode,
    message: message,
  });
});

app.listen(3000, () => {
  console.log('app listening on port 3000!')
})

