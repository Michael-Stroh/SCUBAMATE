import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { diveService } from '../service/dive.service';

export interface Dive{
  Buddy : string;
  TimeIn: string;
  TimeOut: string;
  DiveDate: string ;
  Weather: string[] ; 
}

@Component({
  selector: 'app-my-dives',
  templateUrl: './my-dives.page.html',
  styleUrls: ['./my-dives.page.scss'],
})
export class MyDivesPage implements OnInit {
//{Location: "Here" , DateOf: "07/03/2019", Weather: "Sunny 70% Visibility", TimeIn: "10:00", TimeOut:"10:45", Buddy: "Gerorge Flint"} 
   diveLst: Dive[] ;
  loginLabel:string ;
  constructor(private router: Router, private _diveService: diveService) {}
  
  ngOnInit() {
    this.loginLabel ="Login";
    if(!localStorage.getItem("accessToken"))
    {
      this.loginLabel = "Login";
    }else{
      this.loginLabel = "Sign Out";
    }

    console.log("Do a Private search:");
      //get private dives
      if(localStorage.getItem("accessToken") != null)
      {
        this._diveService.getPrivateDive().subscribe( res =>{
          console.log(res);
          console.log(res.Items);

            this.diveLst = res.Items;
        })
         
      }else{
        this.diveLst = [];
      }
      


  }

  ionViewWillEnter(){
    if(!localStorage.getItem("accessToken"))
    {
      this.loginLabel = "Login";
    }else{
      this.loginLabel = "Sign Out";
    }

    console.log("Do a Private search:");
    //get private dives
    if(localStorage.getItem("accessToken") != null)
    {
      this._diveService.getPrivateDive().subscribe( res =>{
        console.log(res);
        console.log(res.Items);

          this.diveLst = res.Items;
      })
       
    }else{
      this.diveLst = [];
    }
    
  }

  loginClick(){
    if(localStorage.getItem("accessToken"))
    {
      localStorage.removeItem("accessToken");
      this.router.navigate(['home']);
    }else{
      this.router.navigate(['login']);
    }
  }

}
