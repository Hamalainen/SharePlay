import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserNameService {
  constructor(private http: HttpClient) { }

  getRandomUserName(){
      return this.http.get('https://uinames.com/api/?region=finland');
  }
}