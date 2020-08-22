import * as cdk from '@aws-cdk/core';
import * as ddb from '@aws-cdk/aws-dynamodb';
import * as sns from '@aws-cdk/aws-sns';
import * as lambdaEventSources from '@aws-cdk/aws-lambda-event-sources';
import * as targets from '@aws-cdk/aws-events-targets';
import * as pinpoint from '@aws-cdk/aws-pinpoint';
import { NotificationLambda } from './notification-lambda';

export interface UpdateConfigurationLambdaProps {
    readonly configurationTable: ddb.Table;
}
export class UpdateConfigurationLambda extends NotificationLambda {
  constructor(scope: cdk.Construct, id: string, props: UpdateConfigurationLambdaProps) {
    super(scope, id, {
        handler: "index.updateConfigurationHandler",
        environment: {
            "CONFIGURATION_TABLE_NAME": props.configurationTable.tableName
        }
    });

    props.configurationTable.grantFullAccess(this);

    const updateConfigurationTopic = new sns.Topic(this, "UpdateConfigTopic", {
        topicName: "UpdateNotificationConfigurationTopic"
    });
    // SNS Event Source Not Working...
    // this.addEventSource(new lambdaEventSources.SnsEventSource(updateConfigurationTopic));

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
