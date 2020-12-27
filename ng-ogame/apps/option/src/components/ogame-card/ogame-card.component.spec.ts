import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OgameCardComponent } from './ogame-card.component';

describe('OgameCardComponent', () => {
  let component: OgameCardComponent;
  let fixture: ComponentFixture<OgameCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OgameCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OgameCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
