import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { AuthService } from './../auth/auth.service';
import { tap } from 'rxjs/operators';


@Injectable()
export class ApproveService {

  private apiUrl = environment.apiUrl;
  private proof_id = environment.proof_id;
  private token: string;

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) { 
    this.token = authService.token;
  }

  public sendApprove() {
    const url = `${this.apiUrl}` + this.proof_id + '';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': this.token
      })
    };
      return this.http.post(url, {'status': 1}, httpOptions)
      .pipe(
        tap((res: any) => {
          return res;
        })
      );
  }

}
