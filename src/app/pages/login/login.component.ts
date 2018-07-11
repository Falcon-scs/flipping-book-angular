import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth/auth.service';
import { MainService } from '../../services/main/main.service';

import { environment } from '../../../environments/environment';
import { ProofConfig } from '../../interfaces/proofing';
import { FormGroup, FormControl, Validators, PatternValidator, ValidatorFn, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {



  config: ProofConfig;
  email = '';
  pin = '';
  token = '';
  background_img = '';
  error = '';

  loginForm: FormGroup;

  private storageUrl = environment.storageUrl;
  private proof_id = environment.proof_id;

  constructor(
    private authService: AuthService,
    private mainService: MainService,
    private router: Router
  ) {
    this.config = mainService.config;
  }

  ngOnInit() {
    if (this.mainService.config) {
      this.background_img = this.storageUrl + this.proof_id + '/photos/' + this.mainService.config.coverPhoto.sizes[0].fileName;

      this.loginForm = new FormGroup({
        // tslint:disable-next-line
        email: new FormControl('', [Validators.required, patternValidator(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
        pin: new FormControl('', [Validators.required, lengthValidator(4)])
      });
    } else {
      this.router.navigate(['/error']);
    }
  }



  login() {
    if (this.loginForm.valid) {
      this.loginForm.controls['email'].setErrors(null);
      this.loginForm.controls['pin'].setErrors(null);

      this.authService.getUser(this.loginForm.value.email, this.loginForm.value.pin).subscribe(
        (res) => {
          this.token = res.token;
          if (this.token === '') {
            this.error = 'Invalid credentials';
          } else {
            this.router.navigate(['/home']);
          }
        },
        (err) => {
          this.error = 'Invalid credentials';
        }
      );
    }
  }

  clearError() {
    this.error = '';
  }

}

export function patternValidator(regexp: RegExp): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    const value = control.value;
    if (value === '') {
      return null;
    }
    return !regexp.test(value) ? { 'patternInvalid': { regexp } } : null;
  };
}

export function lengthValidator(length: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    const value = control.value;
    if (value === '') {
      return null;
    }
    return value.length !== length ? { 'lengthInvalid': length } : null;
  };
}
