import * as cdk from '@aws-cdk/core';
import * as ddb from '@aws-cdk/aws-dynamodb';
import * as sns from '@aws-cdk/aws-sns';
import * as targets from '@aws-cdk/aws-events-targets';
import * as events from '@aws-cdk/aws-events';
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

    const notificationLambdaTarget = new targets.LambdaFunction(this);
    new events.Rule(this, "CloudWatchEventTrigger", {
      ruleName: "NotificationHandlerSchedule",
      schedule: events.Schedule.cron({
        minute: "0",
        hour: "14",
        day: "1/1"
      }),
      description: "CloudWatch rule to run daily to send applicable notifications",
      targets: [notificationLambdaTarget]
    });

  }
}
