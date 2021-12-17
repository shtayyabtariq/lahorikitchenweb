/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FilteroptionselectComponent } from './filteroptionselect.component';

describe('FilteroptionselectComponent', () => {
  let component: FilteroptionselectComponent;
  let fixture: ComponentFixture<FilteroptionselectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilteroptionselectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilteroptionselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
