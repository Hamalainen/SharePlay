import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { YoutubeApiService } from '../../shared/services/youtube-api.service';
import { YoutubePlayerService } from '../../shared/services/youtube-player.service';
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-video-search',
  templateUrl: './video-search.component.html',
  styleUrls: ['./video-search.component.css']
})
export class VideoSearchComponent {

  @Output() videosUpdated = new EventEmitter();
  @Input() loadingInProgress;

  private last_search: string;

  public searchForm = this.fb.group({
    query: ['', Validators.required]
  });

  constructor(
    public fb: FormBuilder,
    private youtubeService: YoutubeApiService,
    private youtubePlayer: YoutubePlayerService,
    private notificationService: NotificationService
  ) {
    this.youtubePlayer.videoLoadedEvent.subscribe(event => event ? this.searchRelated() : false);

    this.youtubeService.searchVideos('')
      .then(data => {
        this.videosUpdated.emit(data);
      })
  }

  doSearch(event): void {
    if (this.loadingInProgress ||
      (this.last_search && this.last_search === this.searchForm.value.query)) {
      return;
    }

    this.videosUpdated.emit([]);
    this.last_search = this.searchForm.value.query;

    this.youtubeService.searchVideos(this.last_search)
      .then(data => {
        if (data.length < 1) {
          this.notificationService.showNotification('No matches found.');
        }
        this.videosUpdated.emit(data);
      })
  }
  searchRelated(): void {
    this.youtubeService.getRelated(this.youtubePlayer.getCurrentVideo())
      .then(data => {
        if (data.length < 1) {
          this.notificationService.showNotification('No matches found.');
        }
        this.videosUpdated.emit(data);
      });
  }
}
