import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BookComponent } from './book/book.component';
import { PageComponent } from './page/page.component';
import { NgxFlipbookService } from './ngx-flipbook.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    BookComponent,
    PageComponent
  ],
  providers: [
    NgxFlipbookService
  ],
  exports: [
    BookComponent
  ]
})
export class NgxFlipBookModule { }
