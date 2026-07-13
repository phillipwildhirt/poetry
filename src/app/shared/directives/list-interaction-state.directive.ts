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
import { AnimationStateService } from '@app/shared/animations/animation-state.service';

@Directive({
  selector: '[appListInteractionStateDirective]',
})
export class ListInteractionStateDirective {
  private readonly host = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly animationState = inject(AnimationStateService);

  @HostListener('mouseenter') addActive(): void {
    if (this.animationState.isAnimating()) return;
    addClassesWithRenderer(this.renderer, this.host.nativeElement, ['active']);
  }

  @HostListener('mouseleave') removeActive(): void {
    if (this.animationState.isAnimating()) return;
    removeClassesWithRenderer(this.renderer, this.host.nativeElement, ['active']);
  }
}
