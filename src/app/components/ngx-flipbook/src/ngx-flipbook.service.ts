import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Book } from './interfaces';

@Injectable()
export class NgxFlipbookService {

  prev = new Subject<void>();
  play = new Subject<void>();
  pause = new Subject<void>();
  next = new Subject<void>();

  book: Book;

  constructor() { }

}
