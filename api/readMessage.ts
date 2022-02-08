const aws = require('aws-sdk');

const handler = async function (event: any, context: any) {
  const dynamodb = new aws.DynamoDB();

  console.log(event)

  event.Records.forEach(async (record: any) => {
    try {
      const params = {
        TableName: process.env.DYNAMODB_TABLE_NAME,
        Key: {
          "id": {
            S: `${Math.random()}`
          }
        },
        UpdateExpression: "set body = :x",
        ExpressionAttributeValues: {
          ":x": {
            "S": record.body
          },
        }
      }
  
      console.log('Table', process.env.DYNAMODB_TABLE_NAME)
      console.log('Attempting put', params)
  
      const res = await dynamodb.updateItem(params).promise();

      console.log(res)

      return {
        statusCode: 200,
        body: res
      }
    } catch (e) {
      console.error(e)
      return {
        statusCOde: 400,
        body: e
      }
    }
  })
}

export {
  handler
}