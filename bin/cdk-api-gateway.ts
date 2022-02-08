#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkApiGatewayStack } from '../lib/cdk-api-gateway-stack';
import { EndpointType } from "aws-cdk-lib/aws-apigateway";

const app = new cdk.App();
new CdkApiGatewayStack(app, 'TestCdkApiGatewayStack', {
  apiName: 'Test',
  endpointType: EndpointType.EDGE,
});