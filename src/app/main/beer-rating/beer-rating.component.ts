import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-beer-rating',
  templateUrl: './beer-rating.component.html',
  styleUrls: ['./beer-rating.component.css']
})
export class BeerRatingComponent implements OnInit {

  public ramisImage;
  constructor(private http: HttpClient) {
    console.log('vad händer?');
  
    this.getImageFromService();

    setInterval(() => {
      this.getImageFromService();
    }, 1000 * 5)



  }

  ngOnInit() {
  }



  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.ramisImage = reader.result;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  getImageFromService() {
    this.getImage(`https://www.ramundberget.se/webbkamera/ramis.jpg`).subscribe(data => {
      this.createImageFromBlob(data);
    }, error => {
      console.log(error);
    });
  }

  getImage(imageUrl: string): Observable<Blob> {
    return this.http.get(imageUrl, { responseType: 'blob' });
  }
}
