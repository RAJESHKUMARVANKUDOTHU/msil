import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSettingShiftComponent } from './edit-setting-shift.component';

describe('EditSettingShiftComponent', () => {
  let component: EditSettingShiftComponent;
  let fixture: ComponentFixture<EditSettingShiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSettingShiftComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSettingShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
