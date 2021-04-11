import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpeditionConfigurationComponent } from './expedition-configuration.component';

describe('ExpeditionConfigurationComponent', () => {
  let component: ExpeditionConfigurationComponent;
  let fixture: ComponentFixture<ExpeditionConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpeditionConfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpeditionConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
