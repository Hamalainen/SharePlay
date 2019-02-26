import { Component } from '@angular/core';
import { PlayerIndex } from '@angular/core/src/render3/interfaces/player';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'SharePlay';


  player: YT.Player;
  private id: string = 'qDuKsiwS5xw';

  savePlayer(player) {
    this.player = player;
    console.log('player instance', player);
  }
  onStateChange(event) {
    console.log(this.player.getVideoUrl.toString);
    console.log("spellista "+this.player.getPlaylist);
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
