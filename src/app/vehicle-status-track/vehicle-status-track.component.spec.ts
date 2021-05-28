import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleStatusTrackComponent } from './vehicle-status-track.component';

describe('VehicleStatusTrackComponent', () => {
  let component: VehicleStatusTrackComponent;
  let fixture: ComponentFixture<VehicleStatusTrackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleStatusTrackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleStatusTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
