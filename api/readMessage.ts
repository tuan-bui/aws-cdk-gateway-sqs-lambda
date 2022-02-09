const aws = require('aws-sdk');

const handler = async function (event: any, context: any) {
  const dynamodb = new aws.DynamoDB()

  console.log(event)

  for (const record of event.Records) {
    try {
      const params = {
        TableName: process.env.DYNAMODB_TABLE_NAME,
        Item: {
          'primaryId': {
            N: `${Math.ceil(Math.random() * 100000000)}`,
          },
          'body': {
            S: record.body
          }
        }
      }
  
      const res = await dynamodb.putItem(params).promise();

      return {
        statusCode: 200,
        body: res
      }
    } catch (e) {
      console.error(e)
      return {
        statusCode: 400,
        body: e
      }
    }
  }

  return {
    statusCode: 200,
    body: 'none'
  } 
}

export {
  handler
}