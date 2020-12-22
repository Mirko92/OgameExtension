import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ShipComponent } from './ship.component';

describe('ShipComponent', () => {
  let component: ShipComponent;
  let fixture: ComponentFixture<ShipComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
