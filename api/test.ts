const aws = require('aws-sdk');

const handler = async function () {
  const dynamodb = new aws.DynamoDB();

  try {
    const params = {
      TableName: `TestCdkApiGatewayStack-TableCD117FA1-11E93JWPN1XMS`,
      Key: {
        "id": {
          S: `${Math.random()}`
        }
      },
      UpdateExpression: "set body = :x",
      ExpressionAttributeValues: {
        ":x": {
          "S": "test"
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
}

handler()