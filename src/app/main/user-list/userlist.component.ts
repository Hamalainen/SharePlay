import { Component, OnInit } from '@angular/core';
import { UserNameService } from '../../shared/services/user-name.service'

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit {

  constructor(
    private userNameService: UserNameService
  ) { }
  private username = '';

  ngOnInit() {
    this.userNameService.getRandomUserName().subscribe(res => {
      this.username = res['name'] + " " + res['surname'];
      console.log(this.username);
    });
  }

  getUserName(){
    return this.username;
  }

}
