import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { UserNameService } from '../../shared/services/user-name.service';
import { SyncService } from '../../shared/services/sync.service';
import { MainComponent } from '../main.component';
import { IpLookupService } from '../../shared/services/ip-lookup.service';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit {
  username: string;
  public userList = [];

  constructor(
    private userNameService: UserNameService,
    private syncService: SyncService,
    private ipLookupService: IpLookupService,
    public mainComponent: MainComponent
  ) { }

  ngOnInit() {
      this.userNameService.getRandomUserName().subscribe(res => {
      this.username = res['name'] + " " + res['surname'];
      this.syncService.addUserName(res['name'] + " " + res['surname']);
    });

    this.ipLookupService.ipLookUp('ip').subscribe(res =>{
      console.log(res);
    });


    
    this.syncService.getRoom().subscribe(res => {
      this.userList = res['users'];
    });
  }
}
