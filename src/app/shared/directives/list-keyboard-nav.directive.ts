import { Directive, ElementRef, HostListener, inject, Renderer2 } from '@angular/core';
import {
  addClassesWithRenderer,
  removeClassesWithRenderer,
} from '@app/shared/utilities/add-classes-with-renderer.function';

/**
 * Provides ARIA-compliant keyboard navigation for a `role="listbox"` container.
 * Apply to the element that wraps `role="option"` buttons.
 *
 * Arrow keys are listened to at the document level so they work even when
 * focus is outside the list (e.g. user clicked on a non-interactive area).
 * The first arrow key press focuses the first item; subsequent presses move
 * through the list.
 *
 * Supported keys:
 *  - ArrowDown / ArrowUp  — move focus between options
 *  - Home                 — focus first option
 *  - End                  — focus last option
 */
@Directive({
  selector: '[appListKeyboardNav]',
})
export class ListKeyboardNavDirective {
  private readonly renderer = inject(Renderer2);
  private readonly el = inject(ElementRef<HTMLElement>);

  private get list(): HTMLElement { return this.el.nativeElement; }

  private getItems(): HTMLElement[] {
    return Array.from(this.list.querySelectorAll<HTMLElement>('button[role="option"]'));
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;

    const items = this.getItems();
    if (!items.length) return;

    const current = document.activeElement as HTMLElement;
    const idx = items.indexOf(current);

    // If focus is inside a different interactive element (input, another list etc.)
    // don't hijack — only act when focus is on the list, an item, or nowhere special.
    const focusIsElsewhere = current !== document.body
      && !this.list.contains(current)
      && (current.tagName === 'INPUT' || current.tagName === 'TEXTAREA' || current.isContentEditable);
    if (focusIsElsewhere) return;

    event.preventDefault();
    let next: HTMLElement | undefined;

    switch (event.key) {
      case 'ArrowDown': next = items[Math.min(idx + 1, items.length - 1)]; break;
      case 'ArrowUp':   next = items[Math.max(idx - 1, 0)];                break;
      case 'Home':      next = items[0];                                    break;
      case 'End':       next = items[items.length - 1];                    break;
    }

    if (!next) return;

    if (idx !== -1 && items[idx] !== next) {
      removeClassesWithRenderer(this.renderer, items[idx], ['active']);
    }
    next.focus();
    addClassesWithRenderer(this.renderer, next, ['active']);
  }

  @HostListener('focusin', ['$event'])
  onFocusIn(event: FocusEvent): void {
    // If focus landed on the container itself (not a child), redirect to first item.
    if (event.target === this.list) {
      const first = this.getItems()[0];
      if (first) {
        first.focus();
        addClassesWithRenderer(this.renderer, first, ['active']);
      }
    }
  }

  @HostListener('focusout', ['$event'])
  onFocusOut(event: FocusEvent): void {
    const relatedTarget = event.relatedTarget as HTMLElement | null;
    if (!this.list.contains(relatedTarget)) {
      this.getItems().forEach(item => removeClassesWithRenderer(this.renderer, item, ['active']));
    }
  }
}
