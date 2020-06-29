'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});

exports.handler = async (event, context) => {
    const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});

    //properly formatted response
    let statusCode =0;
    let body = JSON.parse(event.body); 
    const ItemType = body.ItemType; //Instructors and Divers or just instructors  (A/ AI)
    const UserEntry = body.UserEntry; //Letters entered by user so far 
    
    let responseBody = "";

    const params = {
        TableName: 'Scubamate',
        FilterExpression: 'begins_with(#itemT , :itemT) AND #pub = :pub AND (contains(#em , :em) OR contains(#fn , :fn) OR contains(#ln , :ln))',
        ExpressionAttributeNames: {
            '#itemT' : 'ItemType',
            '#em': 'Email',
            '#fn': 'FirstName',
            '#ln': 'LastName',
            '#pub': 'PublicStatus',
        },
        ExpressionAttributeValues: {
            ':itemT' : ItemType,
            ':em': UserEntry,
            ':fn': UserEntry,
            ':ln': UserEntry,
            ':pub': true,
        },
    };

    try{
        const data = await documentClient.scan(params).promise();
        var tmp = [];
        data.Items.forEach(function(item) {
            tmp.push(item.FirstName+ " "+ item.LastName+" ("+item.Email+")");
        });
        if(tmp.length == 0){
            responseBody = "No Results Found For: "+UserEntry +", will be stored as text.";
            statusCode = 404;
        }
        else{
            var returnList = [];
            returnList.push({ReturnedList: tmp});
            responseBody = returnList[0];
            statusCode = 200;
        }
        
    }catch(err){
        responseBody = "Unable to get data for "+UserEntry+" "+err;
        statusCode = 403;
    }

    const response = {
        statusCode: statusCode,
        headers: {
            "Content-Type" : "application/json",
            "access-control-allow-origin" : "*"
        },
        body : JSON.stringify(responseBody),
        isBase64Encoded: false
    }

    return response;
}