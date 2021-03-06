import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient,  HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';


@Injectable()
export class accountService
{
    constructor(private httpClient : HttpClient , private router: Router){}


    insertUserDiver(postData): Observable<any>{
        //console.log(postData);

      const options = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
            })
          };


         var response = this.httpClient.post('https://8shtmsbbn8.execute-api.af-south-1.amazonaws.com/UserAccountFull/user',
                           postData, options );
        


          return response;
         
    
      }

      insertUserInstructor(postData): Observable<any>{
        //console.log(postData);

      const options = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
            })
          };


          var response = this.httpClient.post('https://8shtmsbbn8.execute-api.af-south-1.amazonaws.com/UserAccountFull/addinstructor', postData, options );
        
          return response;
         
    
      }


    logUser(postData): Observable<any>{
    
   const options = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }) 
        };
      
        return this.httpClient.post('https://8shtmsbbn8.execute-api.af-south-1.amazonaws.com/UserAccountFull/login', postData, options );

      }


    getUser(): Observable<any>{
      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }) 
      };

      let lS =  localStorage.getItem("accessToken");
     // console.log(lS);
      var PostData = {
        "AccessToken" : lS
      }
      return this.httpClient.post('https://8shtmsbbn8.execute-api.af-south-1.amazonaws.com/UserAccountFull/getuser', PostData, options );
 
    }

    editUser(PostData): Observable<any>{
      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }) 
      };


      return this.httpClient.post('https://8shtmsbbn8.execute-api.af-south-1.amazonaws.com/getUser/edituser', PostData, options );
 
    }

    lookAheadBuddy(entry : String): Observable<any>{

      const options = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          })
        };

      var  body= {
          "ItemType" : "A" ,
          "UserEntry" : entry
        } ;


       return this.httpClient.post('https://8shtmsbbn8.execute-api.af-south-1.amazonaws.com/getUser/lookbuddy',body, options);
    }

    lookAheadInstructor(entry : String): Observable<any>{

      const options = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          })
        };

      var  body= {
          "ItemType" : "I" ,
          "UserEntry" : entry
        } ;

       return this.httpClient.post('https://8shtmsbbn8.execute-api.af-south-1.amazonaws.com/getUser/lookbuddy',body, options);
    }

    getQualifications(entry : String): Observable<any>{

      const options = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          })
        };

      var  body= {
          "ItemType" : "C" ,
          "UserEntry" : entry
        } ;

       return this.httpClient.post('https://b8uk84do1j.execute-api.af-south-1.amazonaws.com/DiveTypesAndSitesAdded/divelist',body, options);
    }

    getSpecializations(entry : String): Observable<any>{

      const options = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          })
        };

      var  body= {
          "ItemType" : "S" ,
          "UserEntry" : entry
        } ;

       return this.httpClient.post('https://b8uk84do1j.execute-api.af-south-1.amazonaws.com/DiveTypesAndSitesAdded/divelist',body, options);
    }

    sendValidationEmail(newUserEmail : string): Observable<any>{
      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        })
      };

      var postData ={
        Email : newUserEmail
      }
     return  this.httpClient.post('https://10n4obqtkh.execute-api.af-south-1.amazonaws.com/email/emailsender', postData, options );
   
    }

    confirmEmailValidation(newUserEmail : string): Observable<any>{
      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        })
      };

      var postData ={
        Email : newUserEmail
      }
     return  this.httpClient.post('https://10n4obqtkh.execute-api.af-south-1.amazonaws.com/email/emailresponder', postData, options );
   
    }

    upgradeToInstructor(postData): Observable<any>{
      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        })
      };

  
     // console.log(postData);

     return  this.httpClient.post('https://8shtmsbbn8.execute-api.af-south-1.amazonaws.com/UserAccountFull/upgradeaccount', postData, options );
   
    }

    getCustomChecklist(): Observable<any>{
      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }) 
      };

      var PostData = {
        "AccessToken" : localStorage.getItem("accessToken")
      }
      return this.httpClient.post('https://a8dptkt6md.execute-api.af-south-1.amazonaws.com/ChecklistPen/getcustomchecklist', PostData, options );
 
    }

    storeCustomChecklist(PostData): Observable<any>{
      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }) 
      };

      
      return this.httpClient.post('https://a8dptkt6md.execute-api.af-south-1.amazonaws.com/ChecklistPen/putcustomchecklist', PostData, options );
 
    }


    updateNewPassword(PostData): Observable<any>{
      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }) 
      };

      
      return this.httpClient.post('https://8shtmsbbn8.execute-api.af-south-1.amazonaws.com/UserAccountFull/changepassword', PostData, options );
 
    }

    addDiveCenter(PostData): Observable<any>{
      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }) 
      };

      
      return this.httpClient.post('https://ek9bagk0i6.execute-api.af-south-1.amazonaws.com/DiveCentre/upgradedivecentre', PostData, options );
 
    }

    addUsertoDiveCenter(PostData): Observable<any>{
      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }) 
      };
      return this.httpClient.post('https://ek9bagk0i6.execute-api.af-south-1.amazonaws.com/DiveCentre/updatedivecentre', PostData, options );
 
    }

    getUnverifiedInstructors(): Observable<any>{
      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }) 
      };

      var PostData = {
        "AccessToken" : localStorage.getItem("accessToken")
      }
      
      return this.httpClient.post('https://ek9bagk0i6.execute-api.af-south-1.amazonaws.com/LatestAPI/getunverifiedinstructors', PostData, options );
 
    }

    verifyInstructor(PostData): Observable<any>{
      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }) 
      };

      
      return this.httpClient.post('https://ek9bagk0i6.execute-api.af-south-1.amazonaws.com/LatestAPI/verifyinstructor', PostData, options );
 
    }


    deleteAccount(PostData): Observable<any>{
      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }) 
      };

      
      return this.httpClient.post('https://8shtmsbbn8.execute-api.af-south-1.amazonaws.com/UserAccountFull/deleteaccount', PostData, options );
 
    }

    receiveNewPassword(PostData): Observable<any>{
      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }) 
      };

      
      return this.httpClient.post('https://10n4obqtkh.execute-api.af-south-1.amazonaws.com/email/updatepassword', PostData, options );
 
    }

    sendRelatedEmail(PostData): Observable<any>{
      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }) 
      };

      
      return this.httpClient.post('https://10n4obqtkh.execute-api.af-south-1.amazonaws.com/email/emailsender', PostData, options );
 
    }
  

}