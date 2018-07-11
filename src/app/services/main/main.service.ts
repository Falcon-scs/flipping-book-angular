import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from './../../../environments/environment';
import { tap } from 'rxjs/operators';
import { ProofConfig } from '../../interfaces/proofing';

@Injectable()
export class MainService {

  config: ProofConfig;
  pagesUrl: string;
  photosUrl: string;

  private apiUrl = environment.apiUrl;
  private proof_id = environment.proof_id;

  constructor(private http: HttpClient) { }

  load() {
    return new Promise((resolve, reject) => {
      this.http
        .get<ProofConfig>(this.apiUrl + this.proof_id)
        .subscribe(response => {
          this.config = response;
          this.pagesUrl = response.url + '/';
          this.photosUrl = response.url.substring(0, response.url.length - 5) + '/photos/';
          resolve(true);
        });
    });
  }

  reload() {
    return this.http.get<ProofConfig>(this.apiUrl + this.proof_id)
      .pipe(
        tap((res) => this.config = res)
      );
  }
}
