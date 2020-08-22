var AWSXRay = require('aws-xray-sdk');
var AWS = AWSXRay.captureAWS(require('aws-sdk'));
AWS.config.update({region: process.env.AWS_REGION});

exports.notificationHandler = async (event, context) => {
    try {
        console.log(JSON.stringify(event));
        return respond(event);
    } catch (err) {
        console.log(err);
        return error(err);
    }
};

exports.updateConfiguration = async (event, context) => {
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