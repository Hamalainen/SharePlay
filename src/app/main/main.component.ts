import { Component, AfterViewInit, OnInit, ViewChild, AfterViewChecked, HostListener } from '@angular/core';
import { YoutubeApiService } from '../shared/services/youtube-api.service';
import { YoutubePlayerService } from '../shared/services/youtube-player.service';
import { PlaylistStoreService } from '../shared/services/playlist-store.service';
import { NotificationService } from '../shared/services/notification.service';
import { SyncService } from '../shared/services/sync.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements AfterViewInit, OnInit {
  public videoList = [];
  public videoPlaylist = [];
  public loadingInProgress = false;
  public playlistToggle = false;
  public playlistNames = false;
  public repeat = false;
  public shuffle = false;
  public playlistElement: any;
  private pageLoadingFinished = false;
  private roomId = null;
  public numberOfUsers = 4;

  constructor(
    private youtubeService: YoutubeApiService,
    private youtubePlayer: YoutubePlayerService,
    private playlistService: PlaylistStoreService,
    private notificationService: NotificationService,
    private syncService: SyncService,
    private route: ActivatedRoute

  ) {
    this.youtubePlayer.videoChangeEvent.subscribe(event => event ? this.playRelated() : false);
  }

  ngOnInit() {
    this.syncService.getRoom().subscribe(res => {
      this.youtubeService.getVideos(res['playlist']).then(res => {
        this.videoPlaylist = res;
      });
    });
  }

  ngAfterViewInit() {
    this.route.params.subscribe(params => {
      this.roomId = params['room'];
      if (this.roomId == null) {
        window.location.href = window.location.href + this.newRoomId();
      }
      else {
        this.syncService.joinroom(this.roomId, '');

      }
    });

    this.playlistElement = document.getElementById('playlist');

  }

  playRelated() {
    let current = this.youtubePlayer.getCurrentVideo();
    let inPlaylist;
    var newVideo;

    this.videoPlaylist.forEach((video, index) => {
      if (video.id === current) {
        inPlaylist = index;
      }
    });
    if (inPlaylist == this.videoPlaylist.length - 1) {
      // this.videoList[0];
      for (var video of this.videoList) {
        newVideo = this.youtubeService.getVideos([video]);
        if (!this.videoPlaylist.some((e) => e.id === newVideo.id)) {
          this.syncService.playRelated(newVideo);
          break;
        }
      }
    }
  }

  playFirstInPlaylist(): void {
    if (this.videoPlaylist[0]) {
      this.playlistElement.scrollTop = 0;
      this.syncService.playVideo(this.videoPlaylist[0].id);
    }
  }

  handleSearchVideo(videos: Array<any>): void {
    this.videoList = videos;
  }

  checkAddToPlaylist(video: any) {
    if (!this.videoPlaylist.some((e) => e.id === video.id)) {
      this.videoPlaylist.push(video);

      let inPlaylist = this.videoPlaylist.length - 1;

      setTimeout(() => {
        let topPos = document.getElementById(this.videoPlaylist[inPlaylist].id).offsetTop;
        this.playlistElement.scrollTop = topPos - 100;
      });
      return true;
    } else {
      return false;
    }

  }

  onScroll(): void {
    var element = document.getElementById("searchlist");
    let atBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
    if (atBottom) {
      this.searchMore();
    }
  }
  searchMore(): void {
    if (this.loadingInProgress || this.pageLoadingFinished || this.videoList.length < 1) {
      return;
    }

    this.loadingInProgress = true;
    this.youtubeService.searchNext()
      .then(data => {
        this.loadingInProgress = false;
        if (data.length < 1 || data.status === 400) {
          setTimeout(() => {
            this.pageLoadingFinished = true;
            setTimeout(() => {
              this.pageLoadingFinished = false;
            }, 10000);
          })
          return;
        }
        data.forEach((val) => {
          this.videoList.push(val);
        });
      }).catch(error => {
        this.loadingInProgress = false;
      })
  }

  private newRoomId() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.youtubePlayer.resizePlayer(window.innerHeight, window.innerWidth);
  }

}
