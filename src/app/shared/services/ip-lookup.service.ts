import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as $ from 'jquery';


@Injectable()
export class IpLookupService {
  constructor(private http: HttpClient) { }

  ipLookUp() {
    $.ajax('//ip-api.com/json')
      .then(
        function success(response) {
          console.log('User\'s Location Data is ', response);
          console.log('User\'s Country', response.country);
        },

        function fail(data, status) {
          console.log('Request failed.  Returned status of',
            status);
        }
      );
  }
}
