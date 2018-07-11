import { Component, ElementRef, HostListener, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { Router } from '@angular/router';
import { TweenLite } from 'gsap';
import { debounceTime, map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { ApproveComponent } from '../../components/approve/approve.component';
import { Book } from '../../components/ngx-flipbook';
import { BookComponent } from '../../components/ngx-flipbook/src/book/book.component';
import { NgxFlipbookService } from '../../components/ngx-flipbook/src/ngx-flipbook.service';
import { RequestChangesComponent } from '../../components/request-changes/request-changes.component';
import { ProofConfig } from '../../interfaces/proofing';
import { AuthService } from '../../services/auth/auth.service';
import { ContentService } from '../../services/content/content.service';
import { MainService } from '../../services/main/main.service';
import { MessagesComponent } from '../../components/messages/messages.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  @ViewChild('flipbook') flipbook: BookComponent;
  @ViewChild('messages') messages: MessagesComponent;

  config: ProofConfig;
  initialized = false;

  unreadMessages: number;
  messageboxOpened = false;
  resizingWindow = false;

  private endResizing = new Subject<void>();
  private destroyed = new Subject<void>();

  constructor(
    private elr: ElementRef,
    private authService: AuthService,
    private mainService: MainService,
    private contentService: ContentService,
    private router: Router,
    private dialog: MatDialog,
    public flipService: NgxFlipbookService
  ) {
    if (!authService.isLoggedIn) {
      this.router.navigate(['/login']);
    }

    this.config = this.mainService.config;

    this.endResizing.pipe(
      takeUntil(this.destroyed),
      debounceTime(200)
    ).subscribe(() => this.resizingWindow = false);
  }

  ngOnInit() {
    if (this.flipService.book) {
      this.initialized = true;
      this.onWindowResize();
    } else {
      this.contentService.getContent()
        .pipe(
          map(data => {
            const book: Book = {
              width: this.config.width,
              height: this.config.height,
              zoom: 1,
              startPageType: data.config.startPageType,
              endPageType: data.config.endPageType,
              pages: []
            };

            data.pages
              .sort((a, b) => a.thumbnail < b.thumbnail ? -1 : 1)
              .forEach((p, index) => {
                p.index = index;
                p.pages.forEach(fileName => book.pages.push( data.config.url + '/' + fileName));
              });

            console.log(book);
            return book;
          })
        )
        .subscribe(
          (res) => {
            this.flipService.book = res;
            this.onWindowResize();
            this.initialized = true;
          },
          (err) => {
            console.log('Get Content Error.', err);
            this.router.navigate(['/error']);
          }
        );
    }
  }

  ngOnDestroy() {
    this.destroyed.next();
  }

  @HostListener('window:resize')
  onWindowResize() {
    if (!this.flipService.book) { return; }

    const boundsWidth = this.elr.nativeElement.getBoundingClientRect().width * .8 * (this.messageboxOpened ? .66 : 1);
    const boundsHeight = this.elr.nativeElement.getBoundingClientRect().height * .7;

    this.flipService.book.zoom = Math.min(boundsWidth / this.flipService.book.width, boundsHeight / this.flipService.book.height);

    this.resizingWindow = true;
    this.endResizing.next();
  }

  fullscreen() {
    this.router.navigate(['/fullscreen']);
  }

  showThumbnails() {
    this.router.navigate(['/thumb']);
  }

  reload() {
    // todo: reset flip-book
    this.authService.logout();
  }

  showMessages(value: boolean) {

    const boundsWidth = this.elr.nativeElement.getBoundingClientRect().width * .8 * (value ? .66 : 1);
    const boundsHeight = this.elr.nativeElement.getBoundingClientRect().height * .7;
    const zoom = Math.min(boundsWidth / this.flipService.book.width, boundsHeight / this.flipService.book.height);

    this.messageboxOpened = value;

    TweenLite.to(this.flipService.book, 0.4, {zoom: zoom, onUpdate: () => this.flipbook.update()});
  }



  requestChanges() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = 600;
    dialogConfig.data = this.contentService.content.pages[1];

    const dialogRef = this.dialog.open(RequestChangesComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.messages.timeline.push(result);
        this.messageboxOpened = true;
      }
    });
  }

  requestApprove() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = 600;
    // dialogConfig.data = this.contentService.content.pages[1];

    const dialogRef = this.dialog.open(ApproveComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // TODO: add to timeline and open chat
      }
    });
  }
}
