import { Injectable, Output, EventEmitter, OnInit, AfterContentInit, HostListener } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NotificationService } from './notification.service';
import { BrowserNotificationService } from './browser-notification.service';
import { SyncService } from './sync.service';
import { isFunction } from 'util';

let _window: any = window;

@Injectable()
export class YoutubePlayerService implements AfterContentInit {
  public yt_player;


  @Output() videoChangeEvent: EventEmitter<any> = new EventEmitter(true);

  constructor(
    public notificationService: NotificationService,
    public browserNotification: BrowserNotificationService,
    private syncService: SyncService
  ) { }

  ngAfterContentInit() {
  }


  createPlayer(): void {
    let interval = setInterval(() => {
      if ((typeof _window.YT !== 'undefined') && _window.YT && _window.YT.Player) {
        this.yt_player = new _window.YT.Player('yt-player', {
          width:  (window.innerHeight/1.65)*1.777,
          height: (window.innerHeight/1.65),
          playerVars: {
            iv_load_policy: '3',
            rel: '0'
          },
          events: {
            
            onStateChange: (ev) => {
              console.log(ev.data);
              this.onChangeSync(ev);
            }
          }
        });
        clearInterval(interval);
      }
    }, 100);
  }

  onChangeSync(ev: any) {
    const state = ev.data;
   if(state == 0){
      this.videoChangeEvent.emit(true);
   }
    var time = this.yt_player.getCurrentTime();
    var video = this.yt_player.getVideoData()['video_id'];
    this.syncService.playerEvent(ev, video, time);
  }

  pausePlayingVideo(time?: any): void {
    if (time != null) {
      this.yt_player.seekTo(time);
    }
    this.yt_player.pauseVideo();
  }

  playPausedVideo(time?: any): void {
    if (time != null) {
      this.yt_player.seekTo(time);
    }
    this.yt_player.playVideo();
  }

  getCurrentVideo(): string {
    return this.yt_player.getVideoData()['video_id'];
  }

  resizePlayer(height: number, width: number) {
    width = (height/1.65)*1.777;
    height = height/1.65;

    console.log("width: " + width + ", height: " + height);
    this.yt_player.setSize(width, height);
  }

  loadVideo(video: any) {
    this.yt_player.loadVideoById(video['id']);
    this.yt_player.pauseVideo();
  }

  getShuffled(index: number, max: number): number {
    if (max < 2) {
      return;
    }

    let i = Math.floor(Math.random() * max);
    return i !== index ? i : this.getShuffled(index, max);
  }

  getRealTime() {
    var video = this.yt_player.getVideoData()['video_id'];
    var time = this.yt_player.getCurrentTime();
    var state = this.yt_player.getPlayerState();
    return { time: time, video: video, state: state };
  }

}
