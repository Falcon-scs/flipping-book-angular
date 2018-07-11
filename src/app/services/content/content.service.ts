import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { AuthService } from './../auth/auth.service';
import { tap } from 'rxjs/operators';
import { ProofProject } from '../../interfaces/proofing';

@Injectable()
export class ContentService {

  public content: ProofProject;
  private apiUrl = environment.apiUrl;
  private proof_id = environment.proof_id;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  public getContent() {
    const url = this.apiUrl + this.proof_id + '/content';
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': this.authService.token
      })
    };

    return this.http.get<ProofProject>(url, httpOptions)
      .pipe(
        tap((res) => {
          this.content = res;
          return res;
        })
      );
  }
}
