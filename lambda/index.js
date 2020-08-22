var AWSXRay = require('aws-xray-sdk');
var AWS = AWSXRay.captureAWS(require('aws-sdk'));
AWS.config.update({region: process.env.AWS_REGION});

var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
var sns = new AWS.SNS({apiVersion: '2010-03-31'});
exports.notificationHandler = async (event, context) => {
    try {
        console.log(JSON.stringify(event));
        let results = await dynamodb.scan({
            TableName: process.env.CONFIGURATION_TABLE_NAME
        }).promise();
        console.log(JSON.stringify(results));
        return respond(event);
    } catch (err) {
        console.log(err);
        return error(err);
    }
};

exports.updateConfigurationHandler = async (event, context) => {
    try {
        console.log(JSON.stringify(event));
        return respond(event);
    } catch (err) {
        console.log(err);
        return error(err);
    }
};

exports.handleUpdateConfiguration = async (event, context) => {
    try {
        console.log(JSON.stringify(event));
        let records = event.Records;
        for (let i = 0; i < records.length; i++){
            let record = records[i];
            let publishParams = {
                Message: "Your notification configuration has changed from " + JSON.stringify(record.dynamodb.OldImage) + " to " + JSON.stringify(record.dynamodb.NewImage),
                Subject: "Notication Configuration Updated",
                TopicArn: process.env.TOPIC_ARN
            };            
            console.log("Publishing to notification topic with params " + JSON.stringify(publishParams));
            await sns.publish(publishParams).promise();
        }
        return respond(event);
    } catch (err) {
        console.log(err);
        return error(err);
    }
};

function respond(responseData){
    return {
        'statusCode': 200,
        'body': JSON.stringify({
            'data': responseData
        }),
        'headers': {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*"
        }
    };
}

function error(message){
    console.log(message);
    return {
        'statusCode': 500,
        'body': JSON.stringify({
            'err': message
        }),
        'headers': {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Methods": "*"
        }
    };
}