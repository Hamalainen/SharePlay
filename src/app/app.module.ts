import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { YoutubePlayerModule } from 'ngx-youtube-player';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {PlayerComponent} from './main/player/player.component'


@NgModule({
  declarations: [
    AppComponent,
    PlayerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    YoutubePlayerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
