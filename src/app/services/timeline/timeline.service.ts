import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { AuthService } from './../auth/auth.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class TimelineService {

  public timelines: any;
  private apiUrl = environment.apiUrl;
  private proof_id = environment.proof_id;
  private token: string;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.token = authService.token;
  }

  public getData() {
    const url = `${this.apiUrl}` + this.proof_id + '/timeline';
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.token
      })
    };

    return this.http.get<any[]>(url, httpOptions)
      .pipe(
        tap((res) => {
          this.timelines = res;
          return res;
        })
      );
  }

}
