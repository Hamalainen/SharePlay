import { Injectable } from '@angular/core';
import { Component, OnInit, AfterContentInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';

import { YoutubeClip } from '../models/youtubeclip';
import { PlayList } from '../models/playlist';
import { Observable } from 'rxjs';
import { YoutubeApiService } from './youtube-api.service';
import { PlaylistStoreService } from './playlist-store.service';
import { subscribeOn } from 'rxjs/operators';
import { PlayListComponent } from 'src/app/main/play-list/play-list.component';
import { VideoListComponent } from 'src/app/main/video-list/video-list.component';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SyncService {
  private roomId = null;

  constructor(
    private socket: Socket,
    private youtubeApiService: YoutubeApiService,
    private playlistStoreService: PlaylistStoreService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  sendRealTime(realtime: any) {
    this.socket.emit('realTime',
      {
        roomId: this.roomId,
        currentVideo: realtime.video,
        currentTime: realtime.time,
        currentState: realtime.state
      });
  }

  getRoom() {
    return this.socket.fromEvent('room');
  }

  getAddedVideo() {
    return this.socket.fromEvent('added');
  }

  getRemovedVideo() {
    return this.socket.fromEvent('removed');
  }

  playingVideo() {
    return this.socket.fromEvent('playing');
  }

  playerState() {
    return this.socket.fromEvent('playerState');
  }

  playVideo(video: any) {
    this.socket.emit('play',
      {
        video: video,
        roomId: this.roomId
      });
  }

  removeFromPlaylist(video: any) {
    this.socket.emit('removedFromPlaylist',
      {
        video: video,
        roomId: this.roomId
      });
  }

  joinroom(roomId: string, userName: any) {
    this.roomId = roomId;
    this.socket.emit('joinroom', 
    {
      roomId: this.roomId,
      userName: userName
    });
  }

  addedToPlaylist(video: any) {
    this.socket.emit('addedToPlaylist',
      {
        video: video,
        roomId: this.roomId
      });
  }

  playerEvent(event: any, video: any, currentTime: any) {
    this.socket.emit('playerEvent',
      {
        event: event,
        roomId: this.roomId,
        video: video,
        currentTime: currentTime
      });
  }
}
