/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BankbalancereportComponent } from './bankbalancereport.component';

describe('BankbalancereportComponent', () => {
  let component: BankbalancereportComponent;
  let fixture: ComponentFixture<BankbalancereportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankbalancereportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankbalancereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
