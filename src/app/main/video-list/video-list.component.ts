import { Component, Input, Output, EventEmitter } from '@angular/core';
import { YoutubePlayerService } from '../../shared/services/youtube-player.service';
import { PlaylistStoreService } from '../../shared/services/playlist-store.service';
import { SyncService } from '../../shared/services/sync.service';
import { timeout, delay } from 'q';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.css']
})
export class VideoListComponent {
  @Input() videoList;
  @Input() loadingInProgress;

  @Output() videoPlaylist = new EventEmitter();

  constructor(
    private youtubePlayer: YoutubePlayerService,
    private playlistService: PlaylistStoreService,
    private syncService: SyncService,
    private socket: Socket
    ) {

      socket.on('updateplaylist', function(video){
        console.log('videolist update');
        this.videoPlaylist.emit(video);
    });
     }

    play(video: any): void {
      this.addToPlaylist(video);
      this.youtubePlayer.playVideo(video.id, video.snippet.title);
    }
  
    addToPlaylist(video: any): void {
      this.videoPlaylist.emit(video);
      this.syncService.addedToPlaylist(video);
      
    }

    playing(): void{
      console.log(this.isPlaying());
    }

    isPlaying(): boolean{
      var list = new Array(this.playlistService.retrieveStorage()["playlists"]["0"]);
      if(list["0"] === undefined){
        return false;
      }
      else{
        return true;
      }
    }
  }