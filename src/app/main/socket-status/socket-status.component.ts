import { Component, OnInit } from '@angular/core';
import { SyncService } from '../../shared/services/sync.service';

@Component({
  selector: 'app-socket-status',
  templateUrl: './socket-status.component.html',
  styleUrls: ['./socket-status.component.css']
})
export class SocketStatusComponent implements OnInit {

  constructor(
    private syncService: SyncService
    ) { }

  ngOnInit() {
    var el = document.getElementById('server-time');
    var rl = document.getElementById('room-list');

    setInterval(() => 
    this.syncService.getrooms(),1000);
    
    this.syncService.Rooms().subscribe(res => {
      var rooms = JSON.parse(<string>res);
      rl.innerHTML = '';
      for (var room of rooms) {
        if (room.id != null) {
          if (window.location.hostname === 'localhost') {
            rl.innerHTML += '<li>rum</li><br>' +
              '<li><a target="_blank" href="http://' + window.location.hostname + ':4200/' + room.id + '">' + window.location.hostname + ':4200/' + room.id + '</a><ul>' +
              'playlist:' + '<br>' +
              this.videoData(room) +
              'currentVideo: ' + room.currentVideo + '<br>' +
              'playerState: ' + room.playerState + '<br>' +
              'currentTime: ' + room.currentTime + '<br>' +
              'users: ' + '<br>' +
              this.userData(room) +
              '</ul></li><br>';
          }
          else {
            rl.innerHTML += '<li>rum</li><br>' +
              '<li><a target="_blank" href="https://hamalainen.herokuapp.com/' + room.id + '">' + 'https://hamalainen.herokuapp.com/' + room.id + '</a><ul>' +
              'playlist:' + '<br>' +
              this.videoData(room) +
              'currentVideo: ' + room.currentVideo + '<br>' +
              'playerState: ' + room.playerState + '<br>' +
              'currentTime: ' + room.currentTime + '<br>' +
              'users: ' + '<br>' +
              this.userData(room) +
              '</ul></li><br>';
          }
        }
      }
    });
  }
   
    videoData(room) {
      var videostr = '';
      for (var video of room.playlist) {
        videostr += '&nbsp {video: ' + video + '},<br>';
      }
      return videostr;
    }

    userData(room) {
      var userstr = '';
      for (var user of room.users) {
        userstr +=
          '&nbsp {userName: ' + user.userName + '<br>' +
          '&nbsp socketId: ' + user.socketId + '<br>' +
          '&nbsp ip: ' + user.ip + '<br>' +
          '&nbsp zip: ' + user.zip + '<br>' +
          '&nbsp city: ' + user.city + '<br>' +
          '&nbsp master: ' + user.master + '},<br>';
      }
      return userstr;
    }
}
