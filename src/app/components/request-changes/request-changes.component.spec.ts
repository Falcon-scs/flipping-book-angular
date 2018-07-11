/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RequestChangesComponent } from './request-changes.component';

describe('RequestChangesComponent', () => {
  let component: RequestChangesComponent;
  let fixture: ComponentFixture<RequestChangesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestChangesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestChangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
