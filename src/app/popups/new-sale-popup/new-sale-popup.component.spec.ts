import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSalePopupComponent } from './new-sale-popup.component';

describe('NewSalePopupComponent', () => {
  let component: NewSalePopupComponent;
  let fixture: ComponentFixture<NewSalePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewSalePopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewSalePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
