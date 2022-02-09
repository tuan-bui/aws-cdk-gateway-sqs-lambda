const aws = require('aws-sdk');

const handler = async function () {
  const dynamodb = new aws.DynamoDB();

  try {
    const params = {
      TableName: `TestCdkApiGatewaySqsLambdaStack-TableCD117FA1-1CGZOY088HSI3`,
      // Item: {
      //   'primaryId': {
      //     N: `${Math.ceil(Math.random() * 1000000)}`,
      //   },
      //   'body': {
      //     S: "Test"
      //   }
      // }
    }

    console.log('Table', process.env.DYNAMODB_TABLE_NAME)
    console.log('Attempting put', params)

    // const res = await dynamodb.putItem(params).promise();
    const res = await dynamodb.scan(params).promise();

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