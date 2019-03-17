import { Injectable } from '@angular/core';
import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';

import { YoutubeClip } from '../models/youtubeclip';
import { PlayList } from '../models/playlist';
import { Observable } from 'rxjs';
import { YoutubeApiService } from './youtube-api.service';
import { PlaylistStoreService } from './playlist-store.service';
import { subscribeOn } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SyncService {
  currentPlayList = this.socket.fromEvent<PlayList>('playlist');
  //   documents = this.socket.fromEvent<string[]>('documents');

  constructor(
    private socket: Socket,
    private youtubeApiService: YoutubeApiService,
    private playlistStoreService: PlaylistStoreService
  ) {
    // socket.on('addedToPlaylist', function(video){
    //   var videos = [];
    //   videos.push(video.id);
    //    this.add(videos);
    //   socket.emit("updatePlayList", video);
    // });
   }
   ngAfterViewInit(){
    this.socket.on('addedToPlaylist', function(video){
      var videos = [];
      videos.push(video.id);
       this.add(videos);
      this.socket.emit("updatePlayList", video);
    });
   }



  getRoom(id: string) {
    this.socket.emit('getDoc', id);
  }

  newRoom() {
    this.socket.emit('addDoc', { id: this.docId(), doc: '' });
  }

  addedToPlaylist(video: any){
    this.socket.emit('addedToPlaylist', video);
  }

  getPlaylist() {
    this.socket.fromEvent('playlist').subscribe(res => {
      var videos = res['playlist'];
      this.add(videos);
      console.log("på init")
    });
  }

  private docId() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }
  
  private add(videos): void{
    this.youtubeApiService.getVideos(videos).then(res => {
      for (let i = 0; i < res.length; i++) {
        this.playlistStoreService.addToPlaylist(res[i]);
      }
    });
  }
}
