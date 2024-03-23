const { PubSub } = require('@google-cloud/pubsub');
const  { topic } = require('../config/vars');
const { logger } = require('../config/logger');

const pubsub = new PubSub();


// Publish the message to the topic
exports.publishMessage = async (messageData) => {
  try {
    const dataBuffer = Buffer.from(JSON.stringify(messageData));
    const messageId = await pubsub.topic(topic).publish(dataBuffer);
    logger.info(`Message ${messageId} published to topic ${topic}`);
  } catch (error) {
    logger.error('Error publishing message:', error);
    throw new Error('failed sending the verification link!');
  }
}

