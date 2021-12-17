/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TrialbalancereportComponent } from './trialbalancereport.component';

describe('TrialbalancereportComponent', () => {
  let component: TrialbalancereportComponent;
  let fixture: ComponentFixture<TrialbalancereportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrialbalancereportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrialbalancereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
