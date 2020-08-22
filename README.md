# Notifications

I'm forgetful and between iPhone calendars, Outlook calendars, alarms, etc, I still find myself forgetting recurring or one-time events. I made this to send me text messages and emails for events that I deem significant because I respond better to sms and email and text to forget less over other types of notifications. 

## Architecture

This project primarily uses Lambda, Pinpoint, Dynamo, and SNS. A configuration is stored in a Dynamo Table representing the events of significance. Once a day, a CloudWatch event triggers a Lambda function to scan the table and notify appropriately by pushing an event to an SNS topic to notify me via email, sms, or both. I have an enabled Pinpoint application to let me quickly configure my table via an SMS message to trigger a configuration Lambda and an additional Lambda to confirm changes to the configuration. It is currently built to support a single person's notifications rather than an application that would support more than one user.

Some Diagram

## Dev

### Prereqs

### Email and Phone Number Config
This project relies on a value being stored in AWS Secrets manager in order to obfuscate your email and phone number. This must be added to secrets manager in the following format and then update the email and phone arn constant in the infrastructure stack.

### Deployment

This project is made up of a CDK project and a number of Lambda functions. To build and deploy, perform the following.

```
$ cd infrastructure
$ npm install
$ npm run build
$ cdk deploy
```

### Testing

In the lambda directory, you can find event samples for the lambda functions