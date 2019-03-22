import { Component, OnInit } from '@angular/core';
import { UserNameService } from '../../shared/services/user-name.service'
import { SyncService } from '../../shared/services/sync.service'

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit{
  public username = "";
  public userList = [];

  constructor(
    private userNameService: UserNameService,
    private syncService: SyncService
  ) { }

    ngOnInit(){
      this.syncService.getRoom().subscribe(res =>{
        this.userList = res['users'];
      });
    }

  public createUser() {
    this.userNameService.getRandomUserName().subscribe(res => {
      this.username = res['name'] + " " + res['surname'];
    });
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

}
