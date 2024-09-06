import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StripepaymentPage } from './stripepayment.page';

describe('StripepaymentPage', () => {
  let component: StripepaymentPage;
  let fixture: ComponentFixture<StripepaymentPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StripepaymentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
