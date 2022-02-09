const aws = require('aws-sdk');
const sqs = new aws.SQS();

const handler = async function (event: any, context: any) {

  const now = (new Date()).toISOString();
  const message = `Messaged created at ${now}`

  const params = {
    QueueUrl: process.env.SQS_URL,
    MessageBody: message
  };

  await sqs.sendMessage(params).promise();

  return {
    statusCode: 200,
    body: message
  }
}

export {
  handler
}