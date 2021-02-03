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

      uni.planets = [...u.planets]
        ?.sort((x, y) => x.type - y.type)
        .reduce((acc, item) => {
          if (item.type === PlanetType.MOON) {
            const found = acc.find(x => this.idForPlanetNoType(x, u.code) === this.idForPlanetNoType(item, u.code));

            if (found?.type === PlanetType.PLANET) {
              found.moon = item;
            }
          } else {
            acc.push(item)
          }

          return acc;
        }, []);

      result.push(uni);
    });

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