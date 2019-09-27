import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { YoutubeApiService } from '../../shared/services/youtube-api.service';
import { YoutubePlayerService } from '../../shared/services/youtube-player.service';
import { NotificationService } from '../../shared/services/notification.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-video-search',
  templateUrl: './video-search.component.html',
  styleUrls: ['./video-search.component.css']
})
export class VideoSearchComponent{

  @Output() videosUpdated = new EventEmitter();
  @Input() loadingInProgress;

  public searchForm = this.fb.group({
    query: ['', Validators.required]
  });

  constructor(
    public fb: FormBuilder,
    private youtubeService: YoutubeApiService,
    private youtubePlayer: YoutubePlayerService,
    private notificationService: NotificationService,

  ) {
    this.youtubePlayer.videoLoadedEvent.subscribe(event => event ? this.searchRelated() : false);

    this.youtubeService.searchVideos('')
      .then(data => {
        this.videosUpdated.emit(data);
      });

    this.searchForm.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(() => {
        return this.youtubeService.searchVideos(this.searchForm.value.query)
          .then(data => {
            this.videosUpdated.emit([]);
            if (data.length < 1) {
              this.youtubeService.searchVideos(this.searchForm.value.query, true)
                .then(data => {
                  if (data.length < 1) {
                    this.notificationService.showNotification('No matches found.');
                  }
                  this.videosUpdated.emit(data);
                })
            }
            this.videosUpdated.emit(data);
          })
      })
    ).subscribe(data => {
      console.log(data);
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
