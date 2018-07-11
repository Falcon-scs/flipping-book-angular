import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgxFlipbookService } from '../../components/ngx-flipbook/src/ngx-flipbook.service';
import { MainService } from '../../services/main/main.service';


@Component({
  selector: 'app-fullscreen',
  templateUrl: './fullscreen.component.html',
  styleUrls: ['./fullscreen.component.scss']
})
export class FullscreenComponent implements OnInit {

  title: string;

  constructor(
    private router: Router,
    private elr: ElementRef,
    private mainService: MainService,
    public flipService: NgxFlipbookService
  ) {
    this.title = mainService.config.name;
  }

  ngOnInit() {
    if (!this.flipService.book) {
      this.exit();
    }
    this.onWindowResize();
  }

  @HostListener('window:resize')
  onWindowResize() {
    if (!this.flipService.book) { return; }

    const boundsWidth = this.elr.nativeElement.getBoundingClientRect().width * .9;
    const boundsHeight = this.elr.nativeElement.getBoundingClientRect().height * .8;

    this.flipService.book.zoom = Math.min(boundsWidth / this.flipService.book.width, boundsHeight / this.flipService.book.height);
  }

  exit() {
    this.router.navigate(['/home']);
  }
}
