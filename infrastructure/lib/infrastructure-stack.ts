import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as ddb from '@aws-cdk/aws-dynamodb';
import * as events from '@aws-cdk/aws-events';
import * as targets from '@aws-cdk/aws-events-targets';
import * as pinpoint from '@aws-cdk/aws-pinpoint';
import path = require('path');

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const configurationTable = new ddb.Table(this, "ConfigurationTable", {
      partitionKey: {
        name: "phoneNumber",
        type: ddb.AttributeType.STRING
      },
      billingMode: ddb.BillingMode.PAY_PER_REQUEST
    });

    const notificationLambda = new lambda.Function(this, "NotificationLambda", {
      code: lambda.Code.fromAsset(path.join(__dirname, '../../lambda')),
      handler: "index.notificationHandler",
      runtime: lambda.Runtime.NODEJS_12_X,
      timeout: cdk.Duration.seconds(300),
      environment: {
        "CONFIGURATION_TABLE_NAME": configurationTable.tableName
      }
    });

    configurationTable.grantReadData(notificationLambda);

    const notificationLambdaTarget = new targets.LambdaFunction(notificationLambda);

    const cloudwatchEventTrigger = new events.Rule(this, "CloudWatchEventTrigger", {
      ruleName: "NotificationHandlerSchedule",
      schedule: events.Schedule.cron({
        minute: "0/1"
      }),
      targets: [notificationLambdaTarget]
    });

    const updateConfigurationLambda = new lambda.Function(this, "UpdateConfigurationLambda", {
      code: lambda.Code.fromAsset(path.join(__dirname, '../../lambda')),
      handler: "index.updateConfigurationHandler",
      runtime: lambda.Runtime.NODEJS_12_X,
      timeout: cdk.Duration.seconds(300),
      environment: {
        "CONFIGURATION_TABLE_NAME": configurationTable.tableName
      }
    });

    configurationTable.grantFullAccess(updateConfigurationLambda);

    // Need to Request Short Code before Pinpoint will work
    // const pinpointApp = new pinpoint.CfnApp(this, "PinpointApp", {
    //   name: "Notifications"
    // });

    // const smsChannel = new pinpoint.CfnSMSChannel(this, "NotificationsSMSChannel", {
    //   applicationId: pinpointApp.ref,
    //   enabled: true
    // });

  }
}
