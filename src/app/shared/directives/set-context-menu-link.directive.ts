import { Directive, ElementRef, HostListener, Input, Renderer2, inject } from '@angular/core';
import { asyncDelay } from '@app/shared/utilities/async-delay';

@Directive({
  selector: '[appSetContextMenuLink]',
  standalone: true,
})
export class SetContextMenuLinkDirective {
  private element = inject(ElementRef);
  private renderer = inject(Renderer2);

  @Input('appSetContextMenuLink') link: string | undefined | null;
  @Input() disabled: boolean = false;

  @HostListener('contextmenu')
  onRightClick(): void {
    if (!this.disabled) {
      if (this.link) {
        if (this.link[0] !== '/') {
          this.link = '/' + this.link;
        }
        this.renderer.setAttribute(this.renderer.parentNode(this.element.nativeElement), 'href', this.link);
        asyncDelay(10, () => this.renderer.removeAttribute(this.renderer.parentNode(this.element.nativeElement), 'href'));
      }
    }
  }

  constructor() {
    const element = this.element;
    const renderer = this.renderer;

    if (renderer.parentNode(element.nativeElement).tagName !== 'A') {
      console.error('The parent element of any element using SetContextMenuLink Directive must be an \'<a>\' Anchor Tag for the context menu to work correctly.');
    }
  }
}
