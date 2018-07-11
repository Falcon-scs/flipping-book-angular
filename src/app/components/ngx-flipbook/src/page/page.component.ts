import { Component, Input, HostBinding } from '@angular/core';
import { Page } from '../interfaces';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngx-flipbook-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent {

  @Input() page: Page;
  @Input() width: number;
  @Input() height: number;
  @Input() rotation: number;

  @HostBinding('style.left') get hostLeft() { return this.width + 'px'; }
  @HostBinding('style.transform') get hostRotation() { return `rotateY(${this.rotation}deg)`; }

  constructor() { }

}
