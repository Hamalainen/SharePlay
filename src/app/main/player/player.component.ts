import { Component, OnInit } from '@angular/core';
import { PlayerIndex } from '@angular/core/src/render3/interfaces/player';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  player: YT.Player;
  id: string = 'qDuKsiwS5xw';

  savePlayer(player) {
    this.player = player;
    console.log('player instance', player);
  }
  onStateChange(event) {
    console.log(this.player.getVideoUrl.toString);
    console.log("spellista "+this.player.loadPlaylist);
    if(this.player.getPlaylist == null){
      console.log("laddar lista");
      this.player.loadPlaylist;
    }
    if(event.data == 0){
      this.player.nextVideo;
      this.player.playVideo;
      console.log("spelar")
    }
    console.log('player state', event.data);
  }

}
