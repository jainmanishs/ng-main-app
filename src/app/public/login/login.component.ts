import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { Store } from '@ngxs/store';
import { AuthenticationService } from 'libs/core/src';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private store:Store,
    private authService:AuthenticationService
    ) { }
  isAuthenticated = false;
  ngOnInit() {
     this.authService.isAuthenticated$.subscribe(
      state => (this.isAuthenticated = state)
    );
  }
  
  login(){
    this.authService.loginAdfs();
  }


  // this.loginAdfs();
  // (credential){

  // }  loginAdfs = () => this.store.dispatch(new LoginAdfs());


}
