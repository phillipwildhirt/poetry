import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  Renderer2,
} from '@angular/core';
import {
  addClassesWithRenderer,
  removeClassesWithRenderer,
} from '@app/shared/utilities/add-classes-with-renderer.function';

@Directive({
  selector: '[appListInteractionStateDirective]',
})
export class ListInteractionStateDirective {
  private readonly host = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  @HostListener('mouseenter') addActive(): void {
    addClassesWithRenderer(this.renderer, this.host.nativeElement, ['active']);
  }
  @HostListener('mouseleave') removeActive(): void {
    removeClassesWithRenderer(this.renderer, this.host.nativeElement, ['active']);
  }
}
