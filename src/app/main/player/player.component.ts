import { Component, OnInit } from '@angular/core';
import { YoutubePlayerService } from '../../shared/services/youtube-player.service';
import { SyncService } from '../../shared/services/sync.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})

export class PlayerComponent implements OnInit {

  constructor(
    private youtubePlayer: YoutubePlayerService,
    private syncService: SyncService
  ) { }

  ngOnInit() {

    let doc = window.document;
    let playerApi = doc.createElement('script');
    playerApi.type = 'text/javascript';
    playerApi.src = 'https://www.youtube.com/iframe_api';
    doc.body.appendChild(playerApi);
    this.youtubePlayer.createPlayer();

    this.syncService.getRoom().subscribe(res => {
      this.youtubePlayer.yt_player.loadVideoById(res['currentVideo']);
      var video = res['currentVideo'];
      var time = res['currentTime'];

      console.log('time: ' + time);
      console.log('video: ' + video);

      switch (res['playerState']) {
        case 1:
          this.youtubePlayer.playPausedVideo(video, time);
          break;
        case 2:
          this.youtubePlayer.pausePlayingVideo(video, time);
          break;
        }

    });


    this.syncService.playingVideo().subscribe(res => {
      console.log("playing video " + res['id']);
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

    setInterval(() => {
      this.syncService.sendRealTime(this.youtubePlayer.getRealTime());
    }, 500);

    setTimeout(() => {
      this.youtubePlayer.playVideo('XnQk9kLWf3E', 'hahaha');
    },1000);
  }

  
}
