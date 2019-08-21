import { Injectable, Output, EventEmitter, OnInit, AfterContentInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NotificationService } from './notification.service';
import { BrowserNotificationService } from './browser-notification.service';
import { SyncService } from './sync.service';
import { isFunction } from 'util';

let _window: any = window;

@Injectable()
export class YoutubePlayerService implements AfterContentInit {
  public yt_player;
  private currentVideoId: string;

  @Output() videoChangeEvent: EventEmitter<any> = new EventEmitter(true);
  @Output() playPauseEvent: EventEmitter<any> = new EventEmitter(true);
  @Output() currentVideoText: EventEmitter<any> = new EventEmitter(true);

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
          width: '1000',
          height: '568',
          playerVars: {
            iv_load_policy: '3',
            rel: '0'
          },
          events: {
            onStateChange: (ev) => {
              this.onPlayerStateChange(ev);
              this.onChangeSync(ev);
            }
          }
        });
        clearInterval(interval);
      }
    }, 100);
  }

  onChangeSync(ev: any) {
    var time = this.yt_player.getCurrentTime();
    var video = this.yt_player.getVideoData()['video_id'];

    this.syncService.playerEvent(ev, video, time);
  }


  onPlayerStateChange(event: any) {
    const state = event.data;
    switch (state) {
      case 0:
        this.videoChangeEvent.emit(true);
        this.playPauseEvent.emit('pause');
        break;
      case 1:
        this.playPauseEvent.emit('play');
        break;
      case 2:
        this.playPauseEvent.emit('pause');
        break;
    }
  }

  // playVideo(videoId: string, videoText?: string): void {
  //   if (!this.yt_player) {
  //     console.error('Player not ready.');
  //     return;
  //   }
  //   this.yt_player.loadVideoById(videoId);
  //   this.currentVideoId = videoId;
  //   this.currentVideoText.emit(videoText);
  //   this.browserNotification.show(videoText);
  // }

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

  resizePlayer(width: number, height: number) {
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
