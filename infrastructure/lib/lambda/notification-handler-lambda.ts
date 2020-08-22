import * as cdk from '@aws-cdk/core';
import * as ddb from '@aws-cdk/aws-dynamodb';
import * as sns from '@aws-cdk/aws-sns';
import { NotificationLambda } from './notification-lambda';

export interface NotificationHandlerLambdaProps {
    readonly configurationTable: ddb.Table;
    readonly notificationTopic: sns.Topic;
}
export class NotificationHandlerLambda extends NotificationLambda {
  constructor(scope: cdk.Construct, id: string, props: NotificationHandlerLambdaProps) {
    super(scope, id, {
        handler: "index.notificationHandler",
        environment: {
            "CONFIGURATION_TABLE_NAME": props.configurationTable.tableName,
            "TOPIC_ARN": props.notificationTopic.topicArn
        },
    });

    props.configurationTable.grantReadData(this);
    props.notificationTopic.grantPublish(this);

    // const notificationLambdaTarget = new targets.LambdaFunction(this);

    // const cloudwatchEventTrigger = new events.Rule(this, "CloudWatchEventTrigger", {
    //   ruleName: "NotificationHandlerSchedule",
    //   schedule: events.Schedule.cron({
    //     minute: "0/1"
    //   }),
    //   targets: [notificationLambdaTarget]
    // });

  }
}
