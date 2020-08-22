import * as cdk from '@aws-cdk/core';
import * as ddb from '@aws-cdk/aws-dynamodb';
import * as sns from '@aws-cdk/aws-sns';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import { NotificationHandlerLambda } from './lambda/notification-handler-lambda';
import { ConfigurationUpdatedHandlerLambda } from './lambda/configuration-updated-handler-lambda';
import { UpdateConfigurationLambda } from './lambda/update-configuration-lambda';

// This secret must be setup in the account prior to deployment
const SECRET_ARN = "arn:aws:secretsmanager:us-east-1:746598098477:secret:EmailPhoneSecret-K7sFkY";

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const configurationTable = new ddb.Table(this, "ConfigurationTable", {
      partitionKey: {
        name: "phoneNumber",
        type: ddb.AttributeType.STRING
      },
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
      stream: ddb.StreamViewType.NEW_AND_OLD_IMAGES
    });

    const notificationTopic = new sns.Topic(this, "NotificationTopic", {
      topicName: "NotificationTopic"
    });

    const emailPhoneSecret = secretsmanager.Secret.fromSecretAttributes(this, "EmailPhoneSecret", {
      secretArn: SECRET_ARN
    });
    const emailSubscription = new sns.Subscription(this, "EmailSubscription", {
      protocol: sns.SubscriptionProtocol.EMAIL,
      endpoint: emailPhoneSecret.secretValueFromJson("email").toString(),
      topic: notificationTopic
    });

    const notificationLambda = new NotificationHandlerLambda(this, "NotificationHandler", {
      configurationTable,
      notificationTopic
    });

    const updateConfigurationLambda = new UpdateConfigurationLambda(this, "UpdateConfiguration", {
      configurationTable
    });

    const configurationUpdatedLambda = new ConfigurationUpdatedHandlerLambda(this, "ConfigurationUpdatedHandler", {
      configurationTable,
      notificationTopic
    });

  }
}
