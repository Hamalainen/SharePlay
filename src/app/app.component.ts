import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'SharePlay';

  @HostListener('scroll', ['$event']) private onScroll($event:Event):void {
    console.log("scrolllllinngg");
  };
  
}
