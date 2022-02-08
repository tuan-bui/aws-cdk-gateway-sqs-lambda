const aws = require('aws-sdk');
const dynamodb = new aws.DynamoDB();

const handler = async function (event: any, context: any) {
  event.Records.forEach(async (record: any) => {
    try {
      const params = {
        TableName: process.env.DYNAMODB_TABLE_NAME,
        Item: {
          "id": {
            S: record.messageId
          },
          "body": {
            S: record.body
          }
        }
      }
  
      console.log('Attempting put', params)
  
      const res = await dynamodb.putItem(params).promise();
      
      console.log(res)
    } catch (e) {
      console.error(e)
    }
  })
}

export {
  handler
}