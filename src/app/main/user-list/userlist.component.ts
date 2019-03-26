import { Component, OnInit } from '@angular/core';
import { UserNameService } from '../../shared/services/user-name.service'
import { SyncService } from '../../shared/services/sync.service'
import { MainComponent } from '../main.component'
import { faCoffee } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit {
  username: string;
  public userList = [];
  faCoffee = faCoffee;

  constructor(
    private userNameService: UserNameService,
    private syncService: SyncService,
    public mainComponent: MainComponent
  ) { }

  ngOnInit() {
    this.userNameService.getRandomUserName().subscribe(res => {
      this.username = res['name'] + " " + res['surname'];
      console.log("username set");
    });

setTimeout(() => {
  console.log("sending username");
  console.log(this.username);
   this.syncService.addUserName(this.username);
}, 1000);

   


    this.syncService.getRoom().subscribe(res => {
      this.userList = res['users'];
      console.log('rooming');
    });



  }

}
