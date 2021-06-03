import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageGatewayComponent } from './manage-gateway.component';

describe('ManageGatewayComponent', () => {
  let component: ManageGatewayComponent;
  let fixture: ComponentFixture<ManageGatewayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageGatewayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageGatewayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
