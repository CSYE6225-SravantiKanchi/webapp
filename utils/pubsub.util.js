const { PubSub } = require('@google-cloud/pubsub');
const  { topic, projectId } = require('../config/vars');
const { logger } = require('../config/logger');

const pubsub = new PubSub({projectId});


// Publish the message to the topic
exports.publishMessage = async (messageData) => {
  try {
    console.log(topic);
    const dataBuffer = Buffer.from(JSON.stringify(messageData));
    const messageId = await pubsub.topic(topic).publish(dataBuffer);
    logger.info(`Message ${messageId} published to topic ${topic}`);
  } catch (error) {
    logger.error('Error publishing message:', error);
    throw new Error('failed sending the verification link!');
  }
}

