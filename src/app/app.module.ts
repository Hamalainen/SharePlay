import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Services
import { YoutubeApiService } from './shared/services/youtube-api.service';
import { YoutubePlayerService } from './shared/services/youtube-player.service';
import { PlaylistStoreService } from './shared/services/playlist-store.service';
import { NotificationService } from './shared/services/notification.service';
import { BrowserNotificationService } from './shared/services/browser-notification.service';
import { UserNameService } from './shared/services/user-name.service';
//Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlayerComponent } from './main/player/player.component';
import { MainComponent } from './main//main.component'
// Pipes
import { VideoDurationPipe } from './shared/pipes/video-duration.pipe';
import { VideoLikesViewsPipe } from './shared/pipes/video-likes-views.pipe';
import { VideoNamePipe } from './shared/pipes/video-name.pipe';
import { VideoPublishedPipe } from './shared/pipes/video-published';
import { LazyScrollDirective } from './shared/directives/lazy-scroll/lazy-scroll.directive';
import { VideoListComponent } from './main/video-list/video-list.component';
import { VideoSearchComponent } from './main/video-search/video-search.component';
import { PlayListComponent } from './main/play-list/play-list.component';
import { SocketIoModule, SocketIoConfig, Socket } from 'ngx-socket-io';
import { UserlistComponent } from './main/user-list/userlist.component';
import { environment } from '../environments/environment'

//  const socketUrl = window.location.href.includes('localhost') ? 'http://localhost:3000/' : 'https://hamalainen-server.herokuapp.com:50300/';

//dev url
// const socketUrl = 'http://localhost:3000/';

const socketUrl = environment.socketUrl;

console.log(socketUrl);

//prod url
// const socketUrl = 'https://hamalainen-server.herokuapp.com/';

const config: SocketIoConfig = { url: socketUrl, options: {} };
 
// console.log("searching socket at: " + socketUrl);
// console.log("client location: " + window.location.href);

@NgModule({
  declarations: [
    AppComponent,
    PlayerComponent,
    MainComponent,

    VideoDurationPipe,
    VideoLikesViewsPipe,
    VideoNamePipe,
    VideoPublishedPipe,
    LazyScrollDirective,
    VideoListComponent,
    VideoSearchComponent,
    PlayListComponent,
    UserlistComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SocketIoModule.forRoot(config),
    HttpClientModule
  ],
  providers: [
    YoutubeApiService,
    YoutubePlayerService,
    PlaylistStoreService,
    NotificationService,
    BrowserNotificationService,
    VideoNamePipe,
    VideoDurationPipe,
    VideoPublishedPipe,
    VideoListComponent,
    PlayListComponent,
    UserNameService,
    UserlistComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
