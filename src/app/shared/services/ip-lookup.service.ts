import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as $ from 'jquery';


@Injectable()
export class IpLookupService {
  private apiKey = 'g7Gaaya0PWf5L2bfEHq4uKzWct7uwKiv';
  constructor(private http: HttpClient) { }
  ipLookUp() {
    $.ajax("https://api.ip2loc.com/" + this.apiKey + "/detect")
      .then(
        function success(response) {
          console.log('User\'s Location Data is ', response);
        },

        function fail(data, status) {
          console.log('Request failed.  Returned status of',
            status);
        }
      );
  }
}
