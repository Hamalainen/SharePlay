import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { YoutubeApiService } from '../../shared/services/youtube-api.service';
import { YoutubePlayerService } from '../../shared/services/youtube-player.service';
import { NotificationService } from '../../shared/services/notification.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { promise } from 'protractor';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { PartialObserver, Subject, of } from 'rxjs';

@Component({
  selector: 'app-video-search',
  templateUrl: './video-search.component.html',
  styleUrls: ['./video-search.component.css']
})
export class VideoSearchComponent {

  @Output() videosUpdated = new EventEmitter();
  @Input() loadingInProgress;

  private last_search: string;
 
  private 

  public searchForm = this.fb.group({
    query: ['', Validators.required]
  });

  private subscription;

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
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(() => {
        return this.youtubeService.searchVideos(this.searchForm.value.query)
          .then(data => {
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


  // doSearch(event): void {
  //   if (this.loadingInProgress ||
  //     (this.last_search && this.last_search === this.searchForm.value.query)) {
  //     return;
  //   }

  //   this.videosUpdated.emit([]);
  //   this.last_search = this.searchForm.value.query;



  //   this.youtubeService.searchVideos(this.last_search)

  //     .then(data => {
  //       if (data.length < 1) {
  //         this.youtubeService.searchVideos(this.last_search, true)
  //           .then(data => {
  //             if (data.length < 1) {
  //               this.notificationService.showNotification('No matches found.');
  //             }
  //             this.videosUpdated.emit(data);
  //           })

  //       }
  //       this.videosUpdated.emit(data);
  //     })
  // }
  // doSearch(event): void {

  //   if (this.loadingInProgress ||
  //     (this.last_search && this.last_search === this.searchForm.value.query)) {
  //     return;
  //   }

  //   this.videosUpdated.emit([]);
  //   this.last_search = this.searchForm.value.query;



  //   this.subscription = this.youtubeService.search(this.last_search)
  //     .pipe(
  //       debounceTime(800),
  //       distinctUntilChanged(),
  //       switchMap(this.searchForm.value.query => )
  //     )
  //     .subscribe(data => {
  //       data.then(data => {
  //         if (data.length < 1) {
  //           this.youtubeService.search(this.last_search, true)
  //             .subscribe(data => {
  //               data.then(data => {
  //                 if (data.length < 1) {
  //                   this.notificationService.showNotification('No matches found.');
  //                 }
  //                 this.videosUpdated.emit(data);
  //               })
  //             })
  //         }
  //         this.videosUpdated.emit(data);
  //       })

  //       // if (data.length < 1) {
  //       //   this.youtubeService.search(this.last_search, true)
  //       //     .subscribe(data => {
  //       //       // if (data.length < 1) {
  //       //       //   this.notificationService.showNotification('No matches found.');
  //       //       // }
  //       //       this.videosUpdated.emit(data);
  //       //     })

  //       // }

  //     })
  // }
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
