import { Component, OnInit, AfterContentInit,  } from '@angular/core';
import { YoutubePlayerService } from '../../shared/services/youtube-player.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})

export class PlayerComponent implements AfterContentInit {

  constructor(
    private youtubePlayer: YoutubePlayerService
  ) { }

  ngAfterContentInit() {
    let doc = window.document;
    let playerApi = doc.createElement('script');
    playerApi.type = 'text/javascript';
    playerApi.src = 'https://www.youtube.com/iframe_api';
    doc.body.appendChild(playerApi);
    this.youtubePlayer.createPlayer();
  }

}
