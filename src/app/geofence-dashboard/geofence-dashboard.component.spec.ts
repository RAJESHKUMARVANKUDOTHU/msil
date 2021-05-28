import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeofenceDashboardComponent } from './geofence-dashboard.component';

describe('GeofenceDashboardComponent', () => {
  let component: GeofenceDashboardComponent;
  let fixture: ComponentFixture<GeofenceDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeofenceDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeofenceDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
