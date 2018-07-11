import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { AuthService } from './../auth/auth.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class ChangeService {

  private apiUrl = environment.apiUrl;
  private proof_id = environment.proof_id;

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) { }

  sendChange(request: any) {
    const url = this.apiUrl + this.proof_id + '/timeline';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': this.authService.token
      })
    };
      return this.http.post(url, {'type': 1, 'content': request}, httpOptions)
      .pipe(
        tap((res: any) => {
          return res;
        })
      );
  }

}
