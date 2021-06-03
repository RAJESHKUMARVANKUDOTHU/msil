import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCoinComponent } from './manage-coin.component';

describe('ManageCoinComponent', () => {
  let component: ManageCoinComponent;
  let fixture: ComponentFixture<ManageCoinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageCoinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
