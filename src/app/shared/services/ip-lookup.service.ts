import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as $ from 'jquery';
import { IP2LOC_API_KEY } from '../constants'


@Injectable()
export class IpLookupService {
  constructor(private http: HttpClient) { }
  ipLookUp() {
    return this.http.get(`https://api.ip2loc.com/${IP2LOC_API_KEY}/detect`);
  }
}
