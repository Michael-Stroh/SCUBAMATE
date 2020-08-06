'use strict'
const AWS = require('aws-sdk');
AWS.config.update({region: "af-south-1"});

exports.handler = async (event, context, callback) => {
    
    const body = JSON.parse(event.body);
    const AccessToken = body.AccessToken;
    const AccountGuid = body.AccountGuid;
    const LogoPhoto = body.LogoPhoto;
    const Coords = body.Coords;
    const Description = body.Description;
    const Name = body.Name;
    const Courses = body.Courses;
    const Instructors = body.Instructors;
    const DiveSites = body.DiveSites;

    
    const GuidSize = 36;
    const guid = AccessToken.substring(0,GuidSize);
    
    /* Verify AccessToken  */
    function compareDates(t,e){
        let returnBool;
        if(t.getFullYear()!=e.getFullYear()){
            (t.getFullYear()>e.getFullYear())?returnBool=true:returnBool=false;
        }   
        else if(t.getMonth()!=e.getMonth()){
            (t.getMonth()>e.getMonth())?returnBool=true:returnBool=false;
        }
        else if(t.getDate()!=e.getDate()){
            (t.getDate()>e.getDate())?returnBool=true:returnBool=false;
        }
        else if(t.getHours()!=e.getHours()){
            (t.getHours()>e.getHours())?returnBool=true:returnBool=false;
        }
        else if(t.getMinutes()!=e.getMinutes()){
            (t.getMinutes()>e.getMinutes())?returnBool=true:returnBool=false;
        }
        else if(t.getSeconds()!=e.getSeconds()){
            (t.getSeconds()>e.getSeconds())?returnBool=true:returnBool=false;
        }
        else if(t.getMilliseconds()!=e.getMilliseconds()){
            (t.getMilliseconds()>e.getMilliseconds())?returnBool=true:returnBool=false;
        }
        else{
            returnBool = true;
        }
        return returnBool;
    }

    let responseBody;
    const undef = 0;
    let statusCode = undef;
    const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});

    try {     
        const params = {
            TableName: "Scubamate",
            Key: {
                "AccountGuid": guid
            }
        };
        const data = await documentClient.get(params).promise();
        
        if((data.Item.AccessToken).toString().trim() != AccessToken ){
            statusCode = 403;
            responseBody = "Invalid Access Token" ;
        }
        else if( compareDates(new Date(),new Date(data.Item.Expires)) ){
            responseBody = "Access Token Expired!";
            statusCode = 403;
        }
        else if(data.Item.AccountType != "SuperAdmin"){
            statusCode = 403;
            responseBody = "Account doesn't have correct privileges";
        }
        else{
            /*First check to see if centre exists */        
            const cparams = {
                TableName: "Scubamate",
                Key: {
                    "AccountGuid": AccountGuid
                }
            };
            const data = await documentClient.get(cparams).promise();
            if(typeof data.Item === 'undefined'){
                statusCode = 403;
                responseBody = "Account doesn't exist ";
            }
            else{
                /*Upgrade dive centre account to admin*/
                const typeParams = {
                    TableName: "Scubamate",
                    Key:{
                        "AccountGuid": AccountGuid
                    },
                    UpdateExpression: "set AccountType = :type ",
                    // ConditionExpression: "AccountType != 'SuperAdmin' ",
                    ExpressionAttributeValues:{
                        ":type": "Admin"
                    },
                    ReturnValues:"UPDATED_NEW"
                };
                
                try{
                    const d = await documentClient.update(typeParams).promise();
                }catch(err){
                    responseBody =  "Account doesn't exist " + err;
                    statusCode = 403;
                }
            }
           

            /*Add new dive centre*/
            if(statusCode == undef)
            {
                /* data:image/png;base64, is send at the front of ProfilePhoto thus find the first , */
                const startContentType = LogoPhoto.indexOf(":")+1;
                const endContentType = LogoPhoto.indexOf(";");
                const contentType = LogoPhoto.substring(startContentType, endContentType);
            
                const startExt = contentType.indexOf("/")+1;
                const extension = contentType.substring(startExt, contentType.length);
            
                const startIndex = LogoPhoto.indexOf(",")+1;
                
                const encodedImage = LogoPhoto.substring(startIndex, LogoPhoto.length);
                const decodedImage = Buffer.from(encodedImage.replace(/^data:image\/\w+;base64,/, ""),'base64');
          
                const filePath = "logophoto" + Name + "."+extension;
            
                let logoLink ="https://imagedatabase-scubamate.s3.af-south-1.amazonaws.com/"+filePath;
        
                const paramsImage = {
                  "Body": decodedImage,
                  "Bucket": "imagedatabase-scubamate",
                  "Key": filePath,
                  "ContentEncoding": 'base64',
                  "ContentType" : contentType
                };
            
                const s3 = new AWS.S3({apiVersion: '2006-03-01'});
                s3.putObject(paramsImage, function(err, data){
                    if(err) {
                        /* Default image if image upload fails */
                        logoLink ="https://imagedatabase-scubamate.s3.af-south-1.amazonaws.com/defaultlogo.png";
                    }
               });
            
                const documentClient = new AWS.DynamoDB.DocumentClient({region: "af-south-1"});
                const ItemType = "DC-"+Name.toLowerCase();
                const params = {
                    TableName: "DiveInfo",
                    Item: {
                        ItemType : ItemType,
                        Coords : Coords,
                        Description : Description,
                        LogoPhoto : logoLink,
                        Name : Name,
                        AccountGuid : AccountGuid,
                        Courses: Courses,
                        Instructors: Instructors,
                        DiveSites: DiveSites
                    }
                };
        
                try{
                    const data = await documentClient.put(params).promise();
                    responseBody = "Successfully added Dive Center!";
                    statusCode = 201;
                }catch(err){
                    responseBody = "Unable to create account";
                    statusCode = 403;
                }
            }
        }            
    } catch (err) {
        statusCode = 403;
        responseBody = "Invalid Access Token (for upgrade)" + err ;
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
    };
    return response;
    
};

/*
{
    "AccessToken" : "d1d7391d-c035-28ab-0193-68a7d263d4be112edcec2f52db363e338c1969a2c4dad5f933433c4284638a18e8c1612a4e9b3d",
    "AccountGuid" : "3105aa3a-f05e-74bd-8209-489b2ed744e8",
    "LogoPhoto" : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAAENUlEQVRoge3ZeahVVRTH8Y9TmjappVnaQEiDFWGURZNIEfVHZSEVRkRWGCVF2ESDSPNAg9UfUfmHDZChQUWSRoGVUVpRpGT1pDmprLBy6KmvP9Y+7Pvue0/ffV7v0XhfuHDP2ufu89tn773W2uvSTTfd/B84CtOxAL9gHdbj1TJF1cIIIbalg88X5UnrPIfiRyH4bzyB83CamJEWnFOauk7SH8uE2NexT0Xb08m+oARdNXOHEPsxdqqwH42NaMaoEnTVxP5YIwZyQoW9B95L9hkl6KqZF7XezBPEIC5KtlUYXJq6TnIiNuEfNMkDWixv/CtLU9dJeuJDIfZ29MHFWCEP6HP0LktgZ7lEiP1WeK2Cw8QstWBsw1XVyC74SYg9v6ptbrLPbrSornC3ELtIbOyCccm+Bgc0XlZtHIi1Ij4cU2HvhU/FQKaXoKtmXhJin6myX5Xs32NAo0V1RD+cidu0jgEnC7GrMazCPgi/pbYLG6SxQ4ZgEl4WSV/hQu9L7T3xUbLdVPXbGcn+jtZ7pmEcgZvxvljzhfiNWJq+L0/3Xpqum9C3oo9RIpfaiNENUZ0Yg0e0DlyFp3kFl2FvEchWpbZj8XP6fm5Vf/OT/al6ijxSeIzHMBVDK9p6YGaV+HUizT5L66BW8Jy8gVvwVlX72cn+p1iaW01PPCxH1Mq3PDHdc7mcxN2VBtEsNmp7DBIvpOhrg3hRBX3xVWq7rh6DINZ5Ifxxkag9Lwa2QXibeVpH4jfS9cSKfg7B9ViYflf5Uu6seuaNcsbbpx6D2FlMbQvOqGq7RT6dFWfpC1Lb1en6bTyIL6uE/4s3cY0IgpUMEy64vWd2mTGpw2XttPUXs7IeU9J9KzFNzokqP7/jBTHYPTbzzDnp/tfqMoLE8anTpe209Rf7oFms6c+0Fd+Eh0Se1JmU+wp5g1fP1FYxQA5gY6vaillYhMlidjaJ5XQtRtb4rPFyRWSbRPAiG/1LHHImCI/TnOxz5YA3pQv99xAOpOjvga2X3D698ay2y2aDSCsKD3RDF/oeJWaw6HNaHfRukXHC/c7G/bhVeJ9aBQwRJ8CFcmxaKXu8hnK6vJ7v3cK9vXGSCJRLtM67VouXM3CbKd0MY+Va06Md3LOf8EBz5DhUfNaKgDlJHGtL4Tg5WM2U0+p+OFXMzhJt05kmPCkcxa6NldyW0fhDCJslcjA4GN9pLXy1OHtMtp2drw/Hr3IFo1eyH4Qf5KB5D05Rp/yo3oyUyzPz5IPPCPncMV8sr+2W/fCNtmKH42v5CLrdFATaY7hcc31XFjtU/r9ikRI9T2cYLM7TLaJ8X4gdIg/iA+xWiroaKP4JWozdk21POcP9RElBrFaKYsCIdD1Q/GNUVMH3KklXzRTn5fHYVy7xLxdVkB2GqdpmuyuEA9ih6CXS8hWiMjJLnUoy3XTTTfn8B2YzXIOXs2bCAAAAAElFTkSuQmCC",
    "Coords" : "-26.146567,29.157852",
    "Description" : "test centre",
    "Name" : "test dive centre",
    "Courses" : ["testcourse"],
    "Instructors" :["hdfjd"],
    "DiveSites" :["testsite"]
}
 */

