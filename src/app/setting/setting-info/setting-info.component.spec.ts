import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingInfoComponent } from './setting-info.component';

describe('SettingInfoComponent', () => {
  let component: SettingInfoComponent;
  let fixture: ComponentFixture<SettingInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
