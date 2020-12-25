import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OgameSpeedComponent } from './ogame-speed.component';

describe('OgameSpeedComponent', () => {
  let component: OgameSpeedComponent;
  let fixture: ComponentFixture<OgameSpeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OgameSpeedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OgameSpeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
