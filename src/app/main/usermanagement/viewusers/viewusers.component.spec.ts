/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ViewusersComponent } from './viewusers.component';

describe('ViewusersComponent', () => {
  let component: ViewusersComponent;
  let fixture: ComponentFixture<ViewusersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewusersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewusersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
