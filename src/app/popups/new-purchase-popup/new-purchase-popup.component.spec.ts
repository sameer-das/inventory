import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPurchasePopupComponent } from './new-purchase-popup.component';

describe('NewPurchasePopupComponent', () => {
  let component: NewPurchasePopupComponent;
  let fixture: ComponentFixture<NewPurchasePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPurchasePopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewPurchasePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
