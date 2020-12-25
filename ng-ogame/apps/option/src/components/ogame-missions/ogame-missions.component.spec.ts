import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OgameMissionsComponent } from './ogame-missions.component';

describe('OgameMissionsComponent', () => {
  let component: OgameMissionsComponent;
  let fixture: ComponentFixture<OgameMissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OgameMissionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OgameMissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
