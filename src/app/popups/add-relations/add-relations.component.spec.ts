import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRelationsComponent } from './add-relations.component';

describe('AddRelationsComponent', () => {
  let component: AddRelationsComponent;
  let fixture: ComponentFixture<AddRelationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRelationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRelationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
