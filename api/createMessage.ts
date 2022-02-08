const aws = require('aws-sdk');
const sqs = new aws.SQS();

const handler = async function (event: any, context: any) {

  const params = {
    QueueUrl: process.env.SQS_URL,
    MessageBody: `${Math.random()}`
  };

  await sqs.sendMessage(params).promise();

  return {
    statusCode: 200,
    body: `Successfully pushed message!!`
  }
}

export {
  handler
}