import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { UserNameService } from '../../shared/services/user-name.service';
import { SyncService } from '../../shared/services/sync.service';
import { MainComponent } from '../main.component';
import { IpLookupService } from '../../shared/services/ip-lookup.service';
import { HttpClient } from '@angular/common/http';
import { XHRConnection } from '@angular/http';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit {
  username: string;
  ip: string;
  zip: string;
  city: string;
  public userList = [];

  constructor(
    private userNameService: UserNameService,
    private syncService: SyncService,
    private ipLookupService: IpLookupService,
    public mainComponent: MainComponent,
    private http: HttpClient
  ) { }

  ngOnInit() {
      this.ipLookupService.ipLookUp().subscribe(res => {
        this.ip = res['connection']['ip'];
        this.zip = res['location']['country']['zip_code'];
        this.city = res['location']['city'];
        this.syncService.addLocation(this.ip, this.zip,  this.city);

        this.userNameService.getRandomUserName(res['location']['country']['name']).subscribe(res => {
          this.username = res['name'] + " " + res['surname'];
          this.syncService.addUserName(res['name'] + " " + res['surname']);
        });
      });

    this.syncService.getRoom().subscribe(res => {
      this.userList = res['users'];
    })
  }
}
