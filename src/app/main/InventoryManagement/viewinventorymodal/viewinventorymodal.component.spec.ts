/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ViewinventorymodalComponent } from './viewinventorymodal.component';

describe('ViewinventorymodalComponent', () => {
  let component: ViewinventorymodalComponent;
  let fixture: ComponentFixture<ViewinventorymodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewinventorymodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewinventorymodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
