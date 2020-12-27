import { Directive, ElementRef, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[ogStickyClass]'
})
export class StickyClassDirective {
  @Input("ogStickyClass") className: string;

  observer: IntersectionObserver;

  constructor(el: ElementRef) {
    el.nativeElement.style.top = '-1px';
    this.observer = new IntersectionObserver(
      ([e]) => {
        el.nativeElement.classList.toggle(this.className, e.intersectionRatio < 1);
      },
      {
        threshold: 1
      }
    );

    this.observer.observe(el.nativeElement);
  }

}
