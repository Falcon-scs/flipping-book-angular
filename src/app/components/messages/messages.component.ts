import { Component, OnInit, Input, Output, EventEmitter, HostListener, OnDestroy } from '@angular/core';
import { MainService } from '../../services/main/main.service';
import { MessageService } from '../../services/message/message.service';
import { TimelineService } from '../../services/timeline/timeline.service';
import { Subject } from 'rxjs/Subject';
import { takeUntil, debounceTime } from 'rxjs/operators';
@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, OnDestroy {

  @Input() opened;
  @Output() openedChanged: EventEmitter<boolean> = new EventEmitter();
  @Output() approved: EventEmitter<boolean> = new EventEmitter();
  @Output() unread: EventEmitter<number> = new EventEmitter();

  revision: number;
  message = '';
  timeline: any[];

  resizingWindow = false;
  private endResizing = new Subject<void>();
  private destroyed = new Subject<void>();


  constructor(
    private mainService: MainService,
    private messageService: MessageService,
    private timelineService: TimelineService
  ) {
    this.endResizing.pipe(
      takeUntil(this.destroyed),
      debounceTime(200)
    ).subscribe(() => this.resizingWindow = false);
  }

  ngOnInit() {
    this.mainService.reload().subscribe(
      (res) => {
        this.revision = res.revision;
      }
    );
    this.loadTimeline();
  }

  ngOnDestroy() {
    this.destroyed.next();
  }

  getMessageThumb(item: any): string {
    return (item.content.type === 0 ? this.mainService.pagesUrl : this.mainService.photosUrl) + item.content.thumbnail;
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.resizingWindow = true;
    this.endResizing.next();
  }

  closeMessageBox() {
    this.opened = false;
    this.openedChanged.emit(this.opened);
  }

  onApprove() {
    this.opened = false;
    this.openedChanged.emit(this.opened);
    this.approved.emit(true);
  }

  sendMessage() {
    if (this.message.length === 0) { return; }
    this.messageService.sendChange(this.message).subscribe(
      (res) => {
        this.message = '';
        this.loadTimeline();
        console.log('Message has been sent.');
        console.log(res);
      },
      (err) => {
        console.log('Message Send Error.');
      }
    );
  }

  loadTimeline() {
    this.timelineService.getData().subscribe(
      (res) => {
        this.timeline = res;
        console.log('this.timeline', this.timeline);
        this.calcUnreadMessages();
        // const reload = setTimeout(() => this.loadTimeline(), 10000);
      },
      (err) => {
        console.log('Get Timeline Error');
      }
    );
  }

  changeDate(date) {
    return date;
  }

  calcUnreadMessages() {
    let count = 0;
    if (this.timeline.length > 0) {
      this.timeline.forEach(element => {
        if (element.readBy.length === 0) { count++; }
      });
    }
    this.unread.emit(count);
  }

}
