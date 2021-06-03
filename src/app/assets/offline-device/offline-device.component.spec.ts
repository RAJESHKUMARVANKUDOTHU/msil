import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineDeviceComponent } from './offline-device.component';

describe('OfflineDeviceComponent', () => {
  let component: OfflineDeviceComponent;
  let fixture: ComponentFixture<OfflineDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfflineDeviceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
