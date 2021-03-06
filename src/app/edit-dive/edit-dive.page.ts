import { Component, OnInit } from '@angular/core';
import { diveService } from '../service/dive.service';
import { Router } from '@angular/router';
import { accountService } from '../service/account.service';
import { GlobalService } from "../global.service";
import {ConnectionService} from 'ng-connection-service';
import { Location } from '@angular/common';

//forms
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AlertController } from '@ionic/angular';

export interface DiveLog{
  DiveID : string; 
  AccessToken: string ; 
  Approved: boolean;
  DiveDate: string;
  TimeIn: string;
  TimeOut: string;
  Visibility:string;
  Depth: string;
  Buddy:string;
  DiveTypeLink: string;
  AirTemp: number;
  SurfaceTemp: number;
  BottomTemp: number;
  DiveSite: string;
  Description: string ;
  InstructorLink: "Aaf485cf3-7e5c-4f3e-9c24-1694983820f2" ;
  Weather: [] ;
  DivePublicStatus: boolean;
  DiveImage: string;
}

export interface EditDiveLog{
  DiveID: string;
  AccessToken: string;
  Buddy: string;
  InstructorLink: [];
  Description: string;
  DivePublicStatus: boolean;
}


@Component({
  selector: 'app-edit-dive',
  templateUrl: './edit-dive.page.html',
  styleUrls: ['./edit-dive.page.scss']
})
export class EditDivePage implements OnInit {

   /*********************************************
                Global Variables
  *********************************************/
  showLoading: Boolean;
  showUser : Boolean = false;
  DiveTypeLst: [];
  DiveSiteLst: [];
  BuddyLst:[];
  loginLabel: string;
  CurrentDive: DiveLog ;
  accountType : string;

  //Form Groups
  diveForm;
  diveObj: EditDiveLog;

  //Internet connectivity check
  isConnected = true;  
  noInternetConnection: boolean;

  /********************************************/


  constructor(public _globalService: GlobalService, private _accountService : accountService , private router: Router, private _diveService: diveService, public formBuilder: FormBuilder, public alertController : AlertController, private connectionService: ConnectionService, private location: Location) { 

     //Dive Form
     this.diveObj ={
        DiveID: localStorage.getItem("DiveID"), 
        AccessToken: localStorage.getItem("accessToken"),
        Buddy: "",
        InstructorLink: [],
        Description: "",
        DivePublicStatus: false
    }

    this.diveForm = formBuilder.group({
      Buddy: ['', Validators.required],
      Description:  ['', Validators.required],
      DivePublicStatus: []
    }); 

    this.connectionService.monitor().subscribe(isConnected => {  
      this.isConnected = isConnected;  
      if (this.isConnected) {  
        this.noInternetConnection=false;
      }  
      else {  
        this.noInternetConnection=true;
        this.router.navigate(['no-internet']);
      }  
    });

  }

  ngOnInit() {  
    this.showUser = false;
    this.showLoading = true;
    this.loginLabel ="Login";
      if(!localStorage.getItem("accessToken"))
      {
        this.loginLabel = "Login";
      }else{
        this.loginLabel = "Log Out";
        this.accountType = this._globalService.accountRole; 
      }
     

    this.getDiveInfo();
  }

  ionViewWillEnter(){
    if(!localStorage.getItem("accessToken"))
    {
      this.loginLabel = "Login";
    }else{
      this.loginLabel = "Log Out";
      this.accountType = this._globalService.accountRole; 
    }
    
  }

  loginClick(){
    if(localStorage.getItem("accessToken"))
    {
      localStorage.removeItem("accessToken");
      this.accountType = "*Diver";
      this.router.navigate(['home']);
    }else{
      this.router.navigate(['login']);
    }
  }

  onSubmit(desc : String , bud: String , pub: string ,   event : Event)
  {
    if(bud == ""){
      bud = "-";
    }
    console.log("Pub: "+ pub );

    
      var reqBody = {
        DiveID: localStorage.getItem("DiveID"),
        AccessToken: localStorage.getItem("accessToken"),
        Buddy: bud,
        InstructorLink: "-",
        Description: desc,
        DivePublicStatus: pub
      }
      console.log(reqBody);

      this.showLoading = true;

      this._diveService.updateDive(reqBody).subscribe(res=>{
        this.showLoading = false;
        localStorage.removeItem("DiveID");
        this.router.navigate(["/my-dives"]);
      } , err =>{

        if(err.error){
          this.presentGeneralErrorAlert(err.error);
        }
  
      });


  }

  buddyListFinder(eventValue: string){

    if(eventValue.length >= 3)
    {
        this.showLoading = true;
        this._accountService.lookAheadBuddy(eventValue).subscribe(
          data => {
            console.log(eventValue);
              console.log(data);
              this.BuddyLst = data.ReturnedList ; 
              this.showLoading = false;
          }
        ); //end Buddy req
    }

  }

  getDiveInfo(){
    this.showLoading = true;

    var reqBody = {
      AccessToken: localStorage.getItem("accessToken"),
      DiveID: localStorage.getItem("DiveID")
    }

    console.log(reqBody);
    this._diveService.getIndividualDive(reqBody).subscribe( res =>{
        this.CurrentDive = res ;
        this.showLoading = false;
        this.showUser = true;

        this.diveObj.Buddy = this.CurrentDive.Buddy;
        this.diveObj.Description = this.CurrentDive.Description;
        this.diveObj.DivePublicStatus = this.CurrentDive.DivePublicStatus;
    }, err =>{

      if(err.error){
        this.presentGeneralErrorAlert(err.error);
        this.router.navigate(["/my-dives"]);
      }

    });


  }

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'errorAlert',
      header: 'Invalid Update',
      message: 'Please provide all required information to complete the update',
      buttons: ['OK']
    });
  
    await alert.present();
  }

  async presentSuccessAlert() {
    const alert = await this.alertController.create({
      cssClass: 'errorAlert',
      header: 'Dive Log Updated',
      message: 'Successfully updated dive log',
      buttons: ['OK']
    });
  
    await alert.present();
  }

  async presentGeneralErrorAlert(msg : string) {
    const alert = await this.alertController.create({
      cssClass: 'errorAlert',
      header: 'An error occured',
      message: msg,
      buttons: ['OK']
    });
  
    await alert.present();
  }

  UpdateDiveSubmit(){

    if(!this.diveForm.valid){
      this.presentAlert();
    }else{

      console.log(this.diveObj);

      this.showLoading = true;

      this._diveService.updateDive(this.diveObj).subscribe(res=>{
        this.showLoading = false;
        localStorage.removeItem("DiveID");
        this.presentSuccessAlert();
        this.router.navigate(["/my-dives"]);
      } );

    }

  }

  viewDiveSite(DS : string){
    localStorage.setItem("ViewDiveSite", DS) ;
    this.router.navigate(['dive-site-information']);
  }

}
