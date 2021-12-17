/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ChoosereportsComponent } from './choosereports.component';

describe('ChoosereportsComponent', () => {
  let component: ChoosereportsComponent;
  let fixture: ComponentFixture<ChoosereportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChoosereportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoosereportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
