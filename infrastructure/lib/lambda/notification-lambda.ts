import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import path = require('path');

export interface NotificationLambdaProps extends Omit<lambda.FunctionProps, "code" | "runtime" | "timeout" | "functionName" | "tracing"> {}
export class NotificationLambda extends lambda.Function {
  constructor(scope: cdk.Construct, id: string, props: NotificationLambdaProps) {
    super(scope, id, {
      code: lambda.Code.fromAsset(path.join(__dirname, '../../../lambda')),
      runtime: lambda.Runtime.NODEJS_12_X,
      timeout: cdk.Duration.seconds(300),
      functionName: id,
      tracing: lambda.Tracing.ACTIVE,
      ...props
    });
  }
}
