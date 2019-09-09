import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class IpLookupService {
  constructor(private http: HttpClient) { }

  ipLookUp(ip){
    return this.http.get('http://ip-api.com/json/' + ip + '?fields=16510975&lang=en');
  }
}