import { Pipe, PipeTransform, ɵConsole } from '@angular/core';
import * as moment from 'moment';
import { stringify } from 'querystring';

@Pipe({
  name: 'videoPublished'
})

export class VideoPublishedPipe implements PipeTransform {
  transform(value: any, args?: any[]): any {
    var published = moment(new Date(<Date>value).toString()).fromNow();
    published = published.replace("a ", "1 ");
    published = published.replace("an ", "1 ");
    return published;
  }
}
