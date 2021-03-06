import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { weatherService } from '../service/weather.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {ConnectionService} from 'ng-connection-service';
import { Location } from '@angular/common';

export interface Dive{
  FirstName : string ;
  LastName : string ;
  DiveSite : string ;
  DiveType : string;
  DiveDate : string ;
}

@Component({
  selector: 'app-weather',
  templateUrl: './weather.page.html',
  styleUrls: ['./weather.page.scss'],
})
export class WeatherPage implements OnInit {

  Key = {
    key: null,
    city: null,
    province: null
  };
  Coordinates = {
    Latitude: null,
    Longitude: null
  };
  Weather = {
    Date: null,
    Min: null,
    Max: null,
    Day: null,
    Night: null,
    Desc: null
  };

  //Internet Connectivity check
  isConnected = true;  
  noInternetConnection: boolean;
  tempDate: Date;
  weatherDate: string;

  loginLabel:string ;
  constructor(private router: Router, private _weatherService: weatherService,private geolocation: Geolocation, private connectionService: ConnectionService, private location: Location) {
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
    this.loginLabel ="Login";
    if(!localStorage.getItem("accessToken"))
    {
      this.loginLabel = "Login";
    }else{
      this.loginLabel = "Log Out";
    }

    this.geolocation.getCurrentPosition().then((resp) => {
      this.Coordinates.Latitude = resp.coords.latitude;
      this.Coordinates.Longitude = resp.coords.longitude;

      this._weatherService.getLocationKey(this.Coordinates).subscribe(res => {
        this.Key.key = res.Key;
        this.Key.city = res.LocalizedName;
        this.Key.province = res.AdministrativeArea.LocalizedName;
  
        this._weatherService.getLogWeather(this.Key).subscribe(res => {
          this.Weather.Date = res.DailyForecasts[0].Date;
          this.Weather.Min = res.DailyForecasts[0].Temperature.Minimum.Value + " " +res.DailyForecasts[0].Temperature.Minimum.Unit;
          this.Weather.Max = res.DailyForecasts[0].Temperature.Maximum.Value + " " + res.DailyForecasts[0].Temperature.Maximum.Unit;
          this.Weather.Day = res.DailyForecasts[0].Day.IconPhrase;
          this.Weather.Night = res.DailyForecasts[0].Night.IconPhrase;
          this.Weather.Desc = res.Headline.Text;

          this.tempDate = new Date();
          var dd = String(this.tempDate.getDate()).padStart(2, '0');
          var mm = String(this.tempDate.getMonth() + 1).padStart(2, '0'); 
          var yyyy = this.tempDate.getFullYear();
          var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thurday", "Friday", "Saturday"];
          var day = days[this.tempDate.getDay()];

          this.weatherDate =   day + ", " + dd + "/" + mm + "/" + yyyy;
          document.getElementById("Date").innerText = this.weatherDate;
          document.getElementById("WeatherDesc").innerText = this.Weather.Desc;
          document.getElementById("City").innerText = this.Key.city;
          document.getElementById("Coordinates").innerText = this.Coordinates.Latitude + ", " + this.Coordinates.Longitude;
          document.getElementById("MinTemp").innerText += " " + this.Weather.Min;
          document.getElementById("MaxTemp").innerText += " " + this.Weather.Max;
          document.getElementById("Day").innerText += " " + this.Weather.Day;
          document.getElementById("Night").innerText += " " + this.Weather.Night;

      });
      });

     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }

  ionViewWillEnter(){
    if(!localStorage.getItem("accessToken"))
    {
      this.loginLabel = "Login";
    }else{
      this.loginLabel = "Log Out";
    }
  }

  loginClick(){
    if(localStorage.getItem("accessToken"))
    {
      localStorage.removeItem("accessToken");
      this.router.navigate(['']);
    }else{
      this.router.navigate(['login']);
    }
  }
}
