import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OgamePlanetComponent } from './ogame-planet.component';

describe('OgamePlanetComponent', () => {
  let component: OgamePlanetComponent;
  let fixture: ComponentFixture<OgamePlanetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OgamePlanetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OgamePlanetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
