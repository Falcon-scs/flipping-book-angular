import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, Input, HostBinding, OnDestroy } from '@angular/core';
import { TweenLite, TimelineLite, Power2 } from 'gsap';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { tap, takeUntil } from 'rxjs/operators';
import { Book, Page } from '../interfaces';
import { NgxFlipbookService } from '../ngx-flipbook.service';
import { Subject } from 'rxjs/Subject';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngx-flipbook',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookComponent implements OnInit, OnDestroy {

  @Input() model: Book;

  @HostBinding('style.width.px') get hostWidth() { this.cdr.detectChanges(); return this.model.width * this.model.zoom; }
  @HostBinding('style.height.px') get hostHeight() { return this.model.height * this.model.zoom; }
  @HostBinding('style.perspective.px') get hostPerspective() { return this.model.width * this.model.zoom * 2; }

  currentIndex = 0;
  pages: Page[];

  get reversedPages() {
    return this.pages.slice().reverse();
  }


  private destroyed = new Subject<void>();
  private flipTimeLine: TimelineLite;

  private render = () => { this.cdr.detectChanges(); };

  private sortBook = (index) => {
    this.currentIndex = index;

    this.pages.sort((a, b) => {
      const diffa = Math.abs(a.index - this.currentIndex) + (a.rotation === -180 ? 1 : 0);
      const diffb = Math.abs(b.index - this.currentIndex);

      return diffa - diffb;
    });

    this.render();
  }

  private setPageAtTop = (page) => {
    this.pages.unshift(this.pages.splice(this.pages.indexOf(page), 1)[0]);
  }


  constructor(private service: NgxFlipbookService, private cdr: ChangeDetectorRef, private elr: ElementRef) {
    cdr.detach();

    service.prev.pipe(takeUntil(this.destroyed)).subscribe(() => this.navigate(-1));
    service.next.pipe(takeUntil(this.destroyed)).subscribe(() => this.navigate(1));
    service.play.pipe(takeUntil(this.destroyed)).subscribe(() => this.play());
    service.pause.pipe(takeUntil(this.destroyed)).subscribe(() => this.pause());
  }

  ngOnInit() {
    if (this.model && this.model.pages.length > 1) {
      // TODO: Implement startPageType / endPageType
      this.pages = [];
      this.pages.push({index: 0, lock: true, front: null, back: this.model.pages[0], rotation: -180});

      for (let i = 1; i < this.model.pages.length - 2; i += 2) {
        this.pages.push({index: this.pages.length, front: this.model.pages[i], back: this.model.pages[i + 1], rotation: 0});
      }

      this.pages.push({index: this.pages.length, lock: true, front: this.model.pages[this.pages.length], back: null, rotation: 0});

      this.sortBook(1);
    }
  }

  ngOnDestroy() {
    this.destroyed.next();
  }

  update() {
    this.render();
  }

  onPageDown(event: MouseEvent, page: Page) {
    if (TweenLite.getTweensOf(page, true).length > 0) { return; }

    if (page.lock) {
      this.flipTimeLine = new TimelineLite();
      this.flipTimeLine.add(TweenLite.to(page, 0.3,
        {
          rotation: page.rotation < -90 ? -175 : -5,
          ease: Power2.easeOut,
          onUpdate: this.render
        })
      );
      this.flipTimeLine.add(TweenLite.to(page, 0.2,
        {
          rotation: page.rotation < -90 ? -180 : 0,
          ease: Power2.easeOut,
          onUpdate: this.render
        })
      );

      return;
    }

    const startX = event.pageX;
    const startY = event.pageY;
    let hasMoved = false;

    const mouseUpEvt = fromEvent<MouseEvent>(document, 'mouseup')
      .pipe(
        tap(() => {
          this.flipTimeLine = new TimelineLite();

          if (!hasMoved) {
            this.flipTimeLine.add(TweenLite.to(page, 1,
              {
                rotation: page.rotation < -90 ? 0 : -180,
                ease: Power2.easeOut,
                onStart: this.setPageAtTop,
                onStartParams: [page],
                onUpdate: this.render,
                onComplete: this.sortBook,
                onCompleteParams: [page.rotation < -90 ? page.index - 1 : page.index]
              }));
          } else {
            this.flipTimeLine.add(TweenLite.to(page, 1,
              {
                rotation: page.rotation < -90 ? -180 : 0,
                ease: Power2.easeOut,
                onUpdate: this.render,
                onComplete: this.sortBook,
                onCompleteParams: [page.rotation < -90 ? page.index : page.index - 1]
              }));
          }
        })
      );

    fromEvent<MouseEvent>(document, 'mousemove')
      .pipe(
        takeUntil(mouseUpEvt)
      )
      .subscribe(movEvt => {
        const movEvent = movEvt as MouseEvent;
        const bookBounds = this.elr.nativeElement.getBoundingClientRect();

        hasMoved = startX !== movEvent.pageX || startY !== movEvent.pageY;

        this.setPageAtTop(page);

        if (movEvent.pageX < bookBounds.left) {
          page.rotation = -180;
        } else if (movEvent.pageX > bookBounds.left + bookBounds.width) {
          page.rotation = 0;
        } else {
          page.rotation = -180 + ((movEvent.pageX - bookBounds.left) / bookBounds.width) * 180;
        }

        this.render();
      });
  }

  navigate(direction: number) {

    if (this.currentIndex === 0 || this.currentIndex === this.pages.length) { return; }

    const pageIndex = direction === 1 ? this.currentIndex : this.currentIndex - 1;
    const page = this.pages.find(p => p.index === pageIndex);

    if (page === undefined || page.lock || TweenLite.getTweensOf(page, true).length > 0) { return; }

    if (direction === 1 && page.rotation === -180) { return; }
    if (direction === -1 && page.rotation === 0) { return; }

    this.flipTimeLine = new TimelineLite();
    this.flipTimeLine.add(TweenLite.to(page, 1,
        {
          rotation: direction === 1 ? -180 : 0,
          ease: Power2.easeOut,
          onStart: this.setPageAtTop,
          onStartParams: [page],
          onUpdate: this.render,
          onComplete: this.sortBook,
          onCompleteParams: [this.currentIndex + direction]
        }
      ));
  }

  play() {
    if (this.flipTimeLine && this.flipTimeLine.totalDuration() > this.flipTimeLine.time()) {
      this.flipTimeLine.resume(null, false);
    } else {
      this.flipTimeLine = new TimelineLite();

      this.pages.forEach((page, index) => {
        if (page.rotation === 0 && !page.lock) {
          this.flipTimeLine.add(TweenLite.to(page, 1,
            {
              delay: index === this.currentIndex ? 0 : 2.5,
              rotation: -180,
              ease: Power2.easeOut,
              onStart: this.setPageAtTop,
              onStartParams: [page],
              onUpdate: this.render,
              onComplete: this.sortBook,
              onCompleteParams: [page.index + 1]
            }
          ));
        }
      });
    }
  }

  pause() {
    if (this.flipTimeLine) {
      const tweens = this.flipTimeLine.getChildren(true, true, true, this.flipTimeLine.time());
      if (tweens.length > 0) {
        this.flipTimeLine.addPause(tweens[0].startTime());
      }
    }
  }

}
