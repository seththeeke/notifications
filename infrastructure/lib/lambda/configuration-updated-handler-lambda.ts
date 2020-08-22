import * as cdk from '@aws-cdk/core';
import * as ddb from '@aws-cdk/aws-dynamodb';
import * as sns from '@aws-cdk/aws-sns';
import * as lambdaEventSources from '@aws-cdk/aws-lambda-event-sources';
import { NotificationLambda } from './notification-lambda';
import { StartingPosition } from '@aws-cdk/aws-lambda';

export interface ConfigurationUpdatedHandlerLambdaProps {
    readonly configurationTable: ddb.Table;
    readonly notificationTopic: sns.Topic;
}
export class ConfigurationUpdatedHandlerLambda extends NotificationLambda {
  constructor(scope: cdk.Construct, id: string, props: ConfigurationUpdatedHandlerLambdaProps) {
    super(scope, id, {
        handler: "index.handleUpdateConfiguration",
        environment: {
          "TOPIC_ARN": props.notificationTopic.topicArn
        }
    });

    props.configurationTable.grantStreamRead(this);
    props.notificationTopic.grantPublish(this);

    this.addEventSource(new lambdaEventSources.DynamoEventSource(props.configurationTable, {
      batchSize: 1,
      startingPosition: StartingPosition.LATEST,
      bisectBatchOnError: true
    }));

  }
}
