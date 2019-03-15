import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Services
import { YoutubeApiService } from './shared/services/youtube-api.service';
import { YoutubePlayerService } from './shared/services/youtube-player.service';
import { PlaylistStoreService } from './shared/services/playlist-store.service';
import { NotificationService } from './shared/services/notification.service';
import { BrowserNotificationService } from './shared/services/browser-notification.service';
//Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlayerComponent } from './main/player/player.component';
import { MainComponent } from './main//main.component'
// Pipes
import { VideoDurationPipe } from './shared/pipes/video-duration.pipe';
import { VideoLikesViewsPipe } from './shared/pipes/video-likes-views.pipe';
import { VideoNamePipe } from './shared/pipes/video-name.pipe';
import { LazyScrollDirective } from './shared/directives/lazy-scroll/lazy-scroll.directive';
import { VideoListComponent } from './main/video-list/video-list.component';
import { VideoSearchComponent } from './main/video-search/video-search.component';
import { PlayListComponent } from './main/play-list/play-list.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

const config: SocketIoConfig = { url: window.location.href + ':' + window.location.port+1 || '3000', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    PlayerComponent,
    MainComponent,

    VideoDurationPipe,
    VideoLikesViewsPipe,
    VideoNamePipe,
    LazyScrollDirective,
    VideoListComponent,
    VideoSearchComponent,
    PlayListComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [
    YoutubeApiService,
    YoutubePlayerService,
    PlaylistStoreService,
    NotificationService,
    BrowserNotificationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
