import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { AuthenticationService, AuthenticationState, LanguageState, LoginAdfs, LogoutAdfs } from 'libs/core/src';
import { Observable } from 'rxjs';
import { Plant } from 'src/app/all-models/plant.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  @Select(LanguageState.getLangs) langs$: Observable<any[]>;
  @Select(LanguageState.getCurrentLang) currentLang$: Observable<string>;
  @Select(AuthenticationState.plants) plants$: Observable<Plant[]>;

  isAuthenticated = false;
  isLoading;
  constructor(
    private store: Store,
    private router: Router,
    private authService: AuthenticationService
  ) { }

  ngOnInit() {
    this.authService.isAuthenticated$.subscribe(
      state => (this.isAuthenticated = state)
    );
  }

  login() {
    this.loginAdfs();
  }
  logout() {
    this.logoutAdfs();
  }
  home() {
    this.router.navigate[`/home`];
  }

  /**
     * Login Adfs user
     */
  loginAdfs = () => this.store.dispatch(new LoginAdfs());

  /**
   * Logout Adfs user
   */
  logoutAdfs = () => this.store.dispatch(new LogoutAdfs());
  // this.loginAdfs();
  // (credential){

  // }  loginAdfs = () => this.store.dispatch(new LoginAdfs());


}
