/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SalesplanComponent } from './salesplan.component';

describe('SalesplanComponent', () => {
  let component: SalesplanComponent;
  let fixture: ComponentFixture<SalesplanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesplanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
