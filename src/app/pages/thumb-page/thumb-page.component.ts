import { Component, OnInit } from '@angular/core';
import { ContentService } from '../../services/content/content.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-thumb-page',
  templateUrl: './thumb-page.component.html',
  styleUrls: ['./thumb-page.component.scss']
})
export class ThumbPageComponent implements OnInit {

  thumbs: any = [];

  private content: any;

  constructor(
    private contentService: ContentService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.content = this.contentService.content;
    if (this.content) {
      this.setImages();
    } else {
      this.contentService.getContent().subscribe(
        (res) => {
          this.content = res;
          this.setImages();
        }, (err) => {
          console.log('getContent error', err);
        }
      );
    }
  }

  setImages() {
    this.content.pages.forEach(element => {
      const image_url = this.content.config.url + '/' + element.thumbnail;
      this.thumbs.push(image_url);
    });
  }

  close() {
    this.router.navigate(['/home']);
  }

}
