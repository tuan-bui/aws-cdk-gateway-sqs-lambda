import { HttpApi, HttpMethod } from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration, HttpUrlIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { CfnOutput, Stack, StackProps, aws_lambda_event_sources, aws_lambda, aws_rds, aws_dynamodb ,aws_apigateway, aws_sqs, Duration, aws_lambda_nodejs, aws_apigatewayv2 } from 'aws-cdk-lib';
import { Effect, Policy, PolicyStatement, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import * as path from 'path';

export interface ApiGatewayStackProps extends StackProps {
  apiName: string
  endpointType: aws_apigateway.EndpointType
}

export class CdkApiGatewayStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiGatewayStackProps) {
    super(scope, id, props);

    const queue = new aws_sqs.Queue(this, 'Queue', {
      encryption: aws_sqs.QueueEncryption.UNENCRYPTED,
    });

    const table = new aws_dynamodb.Table(this, 'Table', {
      partitionKey: {
        name: 'id',
        type: aws_dynamodb.AttributeType.STRING
      }
    })

    const readMessageFunction = new aws_lambda.Function(
      this,
      'ReadMessageFunction', {
        runtime: aws_lambda.Runtime.NODEJS_14_X,
        handler: 'readMessage.handler',
        code: aws_lambda.Code.fromAsset(path.join(__dirname, '..', 'api')),
        memorySize: 512,
        environment: {
          SQS_URL: queue.queueUrl,
          DYNAMODB_TABLE_NAME: table.tableName
        }
      }
    );

    readMessageFunction.addEventSource(new aws_lambda_event_sources.SqsEventSource(queue, {
      batchSize: 10
    }))


    const httpApi = new HttpApi(this, 'Api')

    // const createMessage = new aws_lambda_nodejs.NodejsFunction(this, 'CreateMessageFunction', {
    //   entry: path.join(__dirname, '..', 'api', `createMessage.ts`),
    //   handler: 'handler'
    // })

    const createMessageFunction = new aws_lambda.Function(
      this,
      'CreateMessageFunction', {
        runtime: aws_lambda.Runtime.NODEJS_14_X,
        handler: 'createMessage.handler',
        code: aws_lambda.Code.fromAsset(path.join(__dirname, '..', 'api')),
        environment: {
          SQS_URL: queue.queueUrl
        },
        memorySize: 512
      }
    );

    httpApi.addRoutes({
      path: '/createMessage',
      methods: [ HttpMethod.GET ],
      integration: new HttpLambdaIntegration('CreateMessage', createMessageFunction),
    });

    queue.grantSendMessages(createMessageFunction)
    queue.grantConsumeMessages(readMessageFunction)
    
    table.grantReadWriteData(readMessageFunction)

    new CfnOutput(this, 'QueueUrl', {
      value: queue.queueUrl
    })
    new CfnOutput(this, 'ApiUrl', {
      value: httpApi.apiEndpoint
    })
    new CfnOutput(this, 'TableName', {
      value: table.tableName
    })
  }
}
