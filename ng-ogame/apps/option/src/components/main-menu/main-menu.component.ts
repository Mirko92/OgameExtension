import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'og-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.less']
})
export class MainMenuComponent implements OnInit {

  isActive: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  toggleMenu() {
    this.isActive = !this.isActive;
    document.body.classList.toggle('menu_active');
  }

}
