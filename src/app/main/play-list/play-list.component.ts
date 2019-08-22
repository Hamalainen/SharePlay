import { Component, Input, OnInit, OnChanges, AfterViewChecked } from '@angular/core';
import { YoutubePlayerService } from '../../shared/services/youtube-player.service';
import { identifierModuleUrl } from '@angular/compiler';
import { constructDependencies } from '@angular/core/src/di/reflective_provider';
import { Subscription } from 'rxjs';
import { SyncService } from 'src/app/shared/services/sync.service';
import { startWith } from 'rxjs/operators';
import { PlayList } from 'src/app/shared/models/playlist';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-play-list',
  templateUrl: './play-list.component.html',
  styleUrls: ['./play-list.component.css']
})
export class PlayListComponent implements OnInit {
  @Input() playlistToggle;
  @Input() videoPlaylist;
  @Input() playlistNames;
  @Input() repeat;
  @Input() shuffle;
  playlist: PlayList;

  constructor(
    private youtubePlayer: YoutubePlayerService,
    private syncService: SyncService,
    private socket: Socket
  ) {
    this.youtubePlayer.videoChangeEvent.subscribe(event => event ? this.playNextVideo() : false);
  }


  ngOnInit(){

    this.videoPlaylist = [];

    this.syncService.getRemovedVideo().subscribe(res =>{
      this.videoPlaylist.splice(this.videoPlaylist.indexOf(res), 1);
      if(this.youtubePlayer.getCurrentVideo() === res["id"]){
        this.youtubePlayer.pausePlayingVideo();
      }
    });
  }

  play(id: string): void {
    this.videoPlaylist.forEach((video) => {
      if (video.id === id) {
        this.syncService.playVideo(video);
      }
    });
  }

  currentPlaying(id: string): boolean {
    return this.youtubePlayer.getCurrentVideo() === id;
  }

  removeFromPlaylist(video: Object): void {
    this.videoPlaylist.splice(this.videoPlaylist.indexOf(video), 1);
    if(this.youtubePlayer.getCurrentVideo() === video["id"]){
      this.youtubePlayer.pausePlayingVideo();
    }
    this.syncService.removeFromPlaylist(video);
  }

  getPlayList(){
    return this.videoPlaylist;
  }
  playNextVideo(): void {
    let current = this.youtubePlayer.getCurrentVideo();
    let inPlaylist;

    this.videoPlaylist.forEach((video, index) => {
      if (video.id === current) {
        inPlaylist = index;
      }
    });

    if (inPlaylist !== undefined) {
      let topPos = document.getElementById(this.videoPlaylist[inPlaylist].id).offsetTop;
      let playlistEl = document.getElementById('playlist');
        if (this.repeat && this.videoPlaylist.length - 1 === inPlaylist) {
          this.play(this.videoPlaylist[0].id);
          playlistEl.scrollTop = 0;
        } else {
          this.play(this.videoPlaylist[inPlaylist + 1].id);
          playlistEl.scrollTop = topPos - 100;
        }
    }
  }
}
