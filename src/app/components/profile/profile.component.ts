import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../interfaces/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: User;
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    // console.log(this.authService.user);
    this.user = this.authService.user;
  }
  logout() {
    this.authService.logout();
  }
  zoom_page() {
    this.router.navigate(['/fullscreen']);
  }
}
