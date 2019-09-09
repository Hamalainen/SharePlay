import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as $ from 'jquery';


@Injectable()
export class IpLookupService {
  private apiKey = 'g7Gaaya0PWf5L2bfEHq4uKzWct7uwKiv';
  constructor(private http: HttpClient) { }
  ipLookUp() {
    return this.http.get("https://api.ip2loc.com/" + this.apiKey + "/detect");
  }
}
