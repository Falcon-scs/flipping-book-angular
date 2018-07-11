import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThumbPageComponent } from './thumb-page.component';

describe('ThumbPageComponent', () => {
  let component: ThumbPageComponent;
  let fixture: ComponentFixture<ThumbPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThumbPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThumbPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
