import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSettingInfoComponent } from './admin-setting-info.component';

describe('AdminSettingInfoComponent', () => {
  let component: AdminSettingInfoComponent;
  let fixture: ComponentFixture<AdminSettingInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminSettingInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSettingInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
