import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetConfigurationComponent } from './fleet-configuration.component';

describe('FleetConfigurationComponent', () => {
  let component: FleetConfigurationComponent;
  let fixture: ComponentFixture<FleetConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FleetConfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
