import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from './../../../environments/environment';
import { AuthService } from './../auth/auth.service';
import { tap } from 'rxjs/operators';


@Injectable()
export class MessageService {

  private apiUrl = environment.apiUrl;
  private proof_id = environment.proof_id;
  private token: string;

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) {
    this.token = authService.token;
  }

  public sendChange(message: string) {
    const url = `${this.apiUrl}` + this.proof_id + '/timeline';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': this.token
      })
    };
      return this.http.post(url, {'type': 0, 'content': message}, httpOptions)
      .pipe(
        tap((res: any) => {
          return res;
        })
      );
  }


}
