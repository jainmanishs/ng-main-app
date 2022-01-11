import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthenticationService, LoginAdfs, LogoutAdfs } from 'libs/core/src';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {
  userName:string = null;
  constructor(
    private store: Store,
    private router: Router,
    private authService: AuthenticationService
  ) { }
 

  ngOnInit() {
  
    this.userName=this.authService.getUserName();
  }

  
  logout() {
    this.logoutAdfs();
  }
 



  /**
   * Logout Adfs user
   */
  logoutAdfs = () => this.store.dispatch(new LogoutAdfs());

}
