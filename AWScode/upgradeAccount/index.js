'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});
const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});

exports.handler = async (event, context, callback) => {

    let responseBody = "";
    let statusCode =0;

//Adding new instructor
    let body = JSON.parse(event.body);
    
    const InstructorNumber = body.InstructorNumber;
    const DiveCentre = body.DiveCentre;
    const AccessToken = body.AccessToken;
    
    function compareDates(t,e)
    {
        console.log(t.getFullYear());
        if(t.getFullYear()<e.getFullYear())
        {   
            return false;
        }else if(t.getFullYear()>e.getFullYear())
        {
            return true;
        }

        if(t.getMonth()<e.getMonth())
        {
            return false;
        }else if(t.getMonth()>e.getMonth())
        {
            return true;
        }

        if(t.getDate()<e.getDate())
        {
            return false;
        }else if(t.getDate()>e.getDate())
        {
            return true;
        }

        if(t.getHours()<e.getHours())
        {
            return false;
        }else if(t.getHours()>e.getHours())
        {
            return true;
        }

        if(t.getMinutes()<e.getMinutes())
        {
            return false;
        }else if(t.getMinutes()>e.getMinutes())
        {
            return true;
        }

        if(t.getSeconds()<e.getSeconds())
        {
            return false;
        }else if(t.getSeconds()>e.getSeconds())
        {
            return true;
        }

        if(t.getMilliseconds()<e.getMilliseconds())
        {
            return false;
        }else if(t.getMilliseconds()>e.getMilliseconds())
        {
            return true;
        }

        return true;
    }

    //Verify AccessToken 
    const guid = AccessToken.substring(0,36);
    const params = {
        TableName: "Scubamate",
        Key: {
            "AccountGuid": guid
        }
    }

    try {     
        const data = await documentClient.get(params).promise();
        
        if( data.Item.Expires) // check if it's undefined
        {
            const expiryDate = new Date(data.Item.Expires);
            const today = new Date();
            console.log("Compare: " + today + " and " + expiryDate  + " " + compareDates(today,expiryDate));
            if(compareDates(today,expiryDate))
            {
                statusCode = 403;
                responseBody = "Access Token Expired!";
            }
                
        }
            
        console.log("status is now: " + statusCode) ;

    } catch (error) {
        console.error(error);
        statusCode = 403;
        responseBody = "Invalid Access Token ";
    }
    

    //Only proceed if access token is valid
    if(statusCode==0){
        
        const AccountType = "Instructor";

        const params = {
            TableName: "Scubamate",
            Key: {
                'AccountGuid' : guid,
            },
            UpdateExpression: 'set AccountType = :a, InstructorNumber = :i, DiveCentre = :d',
            ExpressionAttributeValues: {
                ':a' : AccountType,
                ':i' : InstructorNumber,
                ':d': DiveCentre,
            }
        }
        try{
            const data = await documentClient.update(params).promise();
            responseBody = "Successfully upgraded account!";
            statusCode = 201;
        }catch(err){
            responseBody = "Unable to upgrade account."+ err +" ";
            statusCode = 403;
        } 
    }

    const response = {
        statusCode: statusCode,
        headers: {
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Methods" : "OPTIONS,POST,GET",
            "Access-Control-Allow-Credentials" : true,
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(responseBody),
        isBase64Encoded: false
    }
    return response;
    
}


