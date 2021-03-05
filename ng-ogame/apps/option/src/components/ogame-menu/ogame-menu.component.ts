import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { OgamePlanet, OgameStorage, PlanetType } from 'model/OgameStorage';
import { nextTick } from 'process';

@Component({
  selector: 'og-menu',
  templateUrl: './ogame-menu.component.html',
  styleUrls: ['./ogame-menu.component.less']
})
export class OgameMenuComponent implements OnInit, OnChanges {

  @Input() storage: OgameStorage;

  observer: IntersectionObserver;

  currentElement: string;

  get menuItems() {
    const result = [];

    this.storage.ogameData.forEach(u => {
      const uni = { ...u };

      const moons = uni.planets.filter(p => p.type === PlanetType.MOON);

      uni.planets = uni.planets
        .filter(p => p.type === PlanetType.PLANET)
        .map(p => ({
          ...p,
          moon: moons.find(m => this.idForPlanetNoType(m, u.code) === this.idForPlanetNoType(p, u.code))
        }));

      result.push(uni);
    });

    console.debug("re", result);
    return result;
  }

  get targets() {
    const r: any = this.storage?.ogameData
      .map(uni => (uni.planets.map(x => `#${this.idForPlanet(x, uni.code)}`)));
    return r.flat();
  }

  ngOnInit() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.currentElement = entry.target.getAttribute('id');
          }
        });
      },
      {
        root: null,//document.querySelector('html'),
        rootMargin: '0px',
        threshold: 1
      }
    );

  }

  ngOnChanges() {
    nextTick(() => {
      this.targets.forEach(selector => {
        const el = document.querySelector(selector);
        el && this.observer.observe(el);
      })
    });
  }

  idForPlanet(p: OgamePlanet, uni: string) {
    return `${uni}_${p.galaxy}_${p.system}_${p.position}_${p.type}`;
  }
  idForPlanetNoType(p: OgamePlanet, uni: string) {
    return `${uni}_${p.galaxy}_${p.system}_${p.position}`;
  }
}