import { Injectable } from '@angular/core';

import { Socket } from 'ngx-socket-io';

import { YoutubeClip } from '../models/youtubeclip';
import { PlayList } from '../models/playlist';

@Injectable({
  providedIn: 'root'
})
export class SyncService {
   currentPlayList = this.socket.fromEvent<PlayList>('playlist');
//   documents = this.socket.fromEvent<string[]>('documents');

  constructor(private socket: Socket) { }

  getDocument(id: string) {
    this.socket.emit('getDoc', id);
  }

  newDocument() {
    this.socket.emit('addDoc', { id: this.docId(), doc: '' });
  }

  getPlaylist(playlist: PlayList) {
      console.log("get playlist");
    this.socket.emit('getPlayList', playlist);
  }

  private docId() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }
}
