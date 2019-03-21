import { Component, Input, Output, EventEmitter, AfterViewChecked, OnInit, AfterViewInit } from '@angular/core';
import { YoutubePlayerService } from '../../shared/services/youtube-player.service';
import { PlaylistStoreService } from '../../shared/services/playlist-store.service';
import { YoutubeApiService } from '../../shared/services/youtube-api.service';
import { SyncService } from '../../shared/services/sync.service';
import { MainComponent } from '../main.component';


@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.css']
})
export class VideoListComponent implements OnInit, AfterViewInit {
  @Input() videoList;
  @Input() loadingInProgress;
  @Output() videoPlaylist = new EventEmitter();

  constructor(
    private youtubePlayer: YoutubePlayerService,
    private syncService: SyncService,
    private youtubeApiService: YoutubeApiService,
    private mainComponent: MainComponent
  ) {
  }

  ngOnInit() {
    this.syncService.getAddedVideo().subscribe(res => {
      this.videoPlaylist.emit(res);
    });
  }

  ngAfterViewInit() {

  }

  play(video: any): void {
    this.addToPlaylist(video);
    this.youtubePlayer.playVideo(video.id, video.snippet.title);
    this.syncService.playVideo(video);
  }

  addToPlaylist(video: any): void {
    this.videoPlaylist.emit(video);
    this.syncService.addedToPlaylist(video);
  }

}