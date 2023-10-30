import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemStockDetailsComponent } from './item-stock-details.component';

describe('ItemStockDetailsComponent', () => {
  let component: ItemStockDetailsComponent;
  let fixture: ComponentFixture<ItemStockDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemStockDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemStockDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
