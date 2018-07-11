import { Injectable } from '@angular/core';
import { User } from '../../interfaces/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from './../../../environments/environment';

import { tap } from 'rxjs/operators';

@Injectable()
export class AuthService {

  public isLoggedIn: boolean;
  public user: User;
  public token: string;

  private apiUrl = environment.apiUrl;
  private proof_id = environment.proof_id;

  constructor(private http: HttpClient, private router: Router) {
    this.token = localStorage.getItem('token');
    this.user = JSON.parse(localStorage.getItem('user'));
    this.isLoggedIn = this.token && this.token !== '';
  }

  public getUser(email: string, pin: string) {
    const url = `${this.apiUrl}` + this.proof_id + '/login';
    const httpOptions = {
      headers: new HttpHeaders({
       'Content-Type': 'application/x-www-form-urlencoded'
      })
    };

    return this.http.post(url, { 'email': email, 'pin': pin }, httpOptions)
      .pipe(
        tap((res: { token: string, name: string, email: string, avatar: string }) => {
          this.token = res.token;
          console.log(res.token);
          this.user = res;
          if (this.token.length) {
            this.isLoggedIn = true;
            localStorage.setItem('token', this.token);
            localStorage.setItem('user', JSON.stringify(this.user));
          } else {
            this.isLoggedIn = false;
            localStorage.setItem('token', '');
          }
          return this.token;
        })
      );
  }

  public logout() {
    this.isLoggedIn = false;
    localStorage.setItem('token', '');
    this.router.navigate(['/login']);
  }

}
