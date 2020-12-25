import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OgameMenuComponent } from './ogame-menu.component';

describe('OgameMenuComponent', () => {
  let component: OgameMenuComponent;
  let fixture: ComponentFixture<OgameMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OgameMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OgameMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
