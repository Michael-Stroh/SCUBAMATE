import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FlashCardComponent } from '../app/components/flash-card/flash-card.component';

//api
import { HttpClientModule } from '@angular/common/http';


//services 
import { accountService } from './service/account.service';
import { diveService } from './service/dive.service';
import { weatherService } from './service/weather.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';


@NgModule({
  declarations: [
    AppComponent,
    FlashCardComponent],
  entryComponents: [],
  imports: [BrowserModule,
            IonicModule.forRoot(), 
            AppRoutingModule,
            HttpClientModule],
  providers: [
    StatusBar,
    SplashScreen,
    accountService,
    diveService,
    weatherService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Geolocation
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
