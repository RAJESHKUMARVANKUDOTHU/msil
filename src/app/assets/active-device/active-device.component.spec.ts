import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveDeviceComponent } from './active-device.component';

describe('ActiveDeviceComponent', () => {
  let component: ActiveDeviceComponent;
  let fixture: ComponentFixture<ActiveDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActiveDeviceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
