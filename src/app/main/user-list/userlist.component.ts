import { Component, OnInit } from '@angular/core';
import { UserNameService } from '../../shared/services/user-name.service'
import { SyncService } from '../../shared/services/sync.service'

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
    private syncService: SyncService
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

  public createUser() {
    // this.userNameService.getRandomUserName().subscribe(res => {
    //   this.username = res['name'] + " " + res['surname'];
    //   console.log(this.username);
    // });
  }

  public getUserName() {
    return this.username;
  }

  public getUsers() {
    return this.userList;
  }

  public getNumberofUsers() {
    console.log(this.userList.length);
    return this.userList.length;
  }
  public getUserName2() {
    console.log('username: ' + this.username);
  }

}
