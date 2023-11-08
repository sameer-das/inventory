import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListStockBrandWiseComponent } from './list-stock-brand-wise.component';

describe('ListStockBrandWiseComponent', () => {
  let component: ListStockBrandWiseComponent;
  let fixture: ComponentFixture<ListStockBrandWiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListStockBrandWiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListStockBrandWiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
