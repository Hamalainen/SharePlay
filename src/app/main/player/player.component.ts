import { Component, OnInit, AfterContentInit } from '@angular/core';
import { YoutubePlayerService } from '../../shared/services/youtube-player.service';
import { SyncService } from '../../shared/services/sync.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})

export class PlayerComponent implements AfterContentInit {

  constructor(
    private youtubePlayer: YoutubePlayerService,
    private syncService: SyncService
  ) { }

  ngAfterContentInit() {

    let doc = window.document;
    let playerApi = doc.createElement('script');
    playerApi.type = 'text/javascript';
    playerApi.src = 'https://www.youtube.com/iframe_api';
    doc.body.appendChild(playerApi);
    this.youtubePlayer.createPlayer();

    this.syncService.playingVideo().subscribe(res => {
      this.youtubePlayer.playVideo(res['id'], res['snippet']['title'])
    });

    this.syncService.playerState().subscribe(res => {
      var video = res['currentVideo'];
      var time = res['currentTime'];
      switch (res['playerState']) {
        case 1:
          this.youtubePlayer.playPausedVideo(video, time);
          break;
        case 2:
          this.youtubePlayer.pausePlayingVideo(video, time);
          break;
      }
    });
  }

}
