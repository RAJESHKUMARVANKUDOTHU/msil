import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiclewisereportComponent } from './vehiclewisereport.component';

describe('VehiclewisereportComponent', () => {
  let component: VehiclewisereportComponent;
  let fixture: ComponentFixture<VehiclewisereportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehiclewisereportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehiclewisereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
