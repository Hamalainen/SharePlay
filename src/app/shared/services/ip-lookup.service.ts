import { Injectable } from '@angular/core';
import * as $ from 'jquery';


@Injectable()
export class IpLookupService {
  private apiKey = 'g7Gaaya0PWf5L2bfEHq4uKzWct7uwKiv';
  constructor() { }
  ipLookUp() {
    $.ajax("https://api.ip2loc.com/" + this.apiKey + "/detect")
      .then(
        function success(response) {
          return response;
        },

        function fail(data, status) {
          console.log('Request failed.  Returned status of',
            status);
        }
      );
  }
}
