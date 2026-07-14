import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, Renderer2, SimpleChanges, TemplateRef, ViewChild, inject } from '@angular/core';
import { BehaviorSubject, of, Subject, timer } from 'rxjs';
import { catchError, filter, map, retry, switchMap, takeUntil, takeWhile, throwIfEmpty } from 'rxjs/operators';
import { ComponentState } from '@app/shared/enums/component-state.enum';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { AsyncPipe, NgTemplateOutlet, SlicePipe } from '@angular/common';
import { coerceNumberProperty, NumberInput } from '@angular/cdk/coercion';
import { asyncDelay } from '@app/shared/utilities/async-delay';

@Component({
  selector: 'app-button-icon-with-text',
  imports: [
    NgbTooltip,
    NgTemplateOutlet,
    SlicePipe,
    AsyncPipe
  ],
  template: `
    <a #aRef
       (contextmenu)="onRightClick(aRef)"
       [ngbTooltip]="isTemplate(disabledTooltip) ? disabledTipContent : disabledTooltip"
       [openDelay]="delay"
       container="body"
       [disableTooltip]="!disabled || !hasDisabledTooltip"
       triggers="hover">
      <ng-template #disabledTipContent>
        <ng-template [ngTemplateOutlet]="getTemplateRef(tooltip)" [ngTemplateOutletContext]="getTemplateRef(tooltip)"/>
      </ng-template>
      <button #btn
              [class]="'text-nowrap btn-ic btn-ic-text d-flex justify-content-center align-items-center '
                     + (color.length ? ' btn-ic-' + color : ' ')
                     + (isTogglerBtn ? ' btn-ic-tog-' + colorToggled : ' ')
                     + _size
                     + ((toggled !== undefined && (mdToggle$ | async)) ? ' tog' : ' ')
                     + (forceState === ComponentState.hover ? ' hover' : forceState === ComponentState.pressed ? ' active focus' : ' ')
                     + (customClass.length > 0 ? ' ' + customClass : ' ')"
              (mousedown)="mdToggle$.next(!mdToggle$.value)"
              [disabled]="disabled"
              [ngbTooltip]="tooltip"
              [attr.ngbAutofocus]="autofocus ? '' : null"
              [openDelay]="delay"
              [disableTooltip]="!hasTooltip"
              [container]="'body'"
              triggers="hover">
        @switch (typeOfToggle()) {
          @case ('boolean') {
            <i [class]="((toggled) || (mdToggle$ | async)) && isTogglerBtn
                      ? (iconToggled | slice: 0 : 2) + ' ' + iconToggled
                      : (icon | slice: 0 : 2) + ' ' + icon"></i>
          }
          @case ('undefined') {
            <i [class]="((toggled) || (mdToggle$ | async)) && isTogglerBtn
                      ? (iconToggled | slice: 0 : 2) + ' ' + iconToggled
                      : (icon | slice: 0 : 2) + ' ' + icon"></i>
          }
          @default {
            <i [class]="((returnToggledAsBehaviorSubject() | async) || (mdToggle$ | async)) && isTogglerBtn
                      ? (iconToggled | slice: 0 : 2) + ' ' + iconToggled
                      : (icon | slice: 0 : 2) + ' ' + icon"></i>
          }
        }
        @if (text.length > 0) {<span class="ps-1 smaller fst-italic">{{ text }}</span>}
      </button>
    </a>
    <ng-template #tipContent>
      <ng-template [ngTemplateOutlet]="getTemplateRef(tooltip)" [ngTemplateOutletContext]="getTemplateRef(tooltip)" />
    </ng-template>
  `
})
export class ButtonIconWithTextComponent implements OnInit, OnChanges, OnDestroy {
  renderer = inject(Renderer2);

  // --- ButtonIconComponent inputs ---

  /** Required icon classname from bootstrap icons, e.g. 'bi-search' */
  @Input({ required: true }) icon = '';

  /** Required theme-color for resting state, e.g. 'secondary', 'primary' */
  @Input({ required: true }) color = '';

  /** Optional size modifier for the inner icon: 'sm' | 'lg' */
  @Input() size: 'sm' | 'lg' | '' = '';

  /** Optional hover tooltip text or TemplateRef */
  @Input() tooltip: string | TemplateRef<any> | undefined;

  /** Optional tooltip shown when the button is disabled */
  @Input() disabledTooltip: string | TemplateRef<any> | null | undefined;

  /** Optional delay (ms) before opening the tooltip on hover */
  @Input()
  get delay(): number { return this._delay; }
  set delay(value: NumberInput) { this._delay = coerceNumberProperty(value); }
  private _delay = 800;

  /** Disable the button */
  @Input() disabled: boolean | undefined;

  /** Set ngbAutofocus when inside a modal */
  @Input() autofocus: boolean | undefined;

  /** Optional href used when the user right-clicks the button */
  @Input() contextMenuLink: string | undefined;

  /** Force a visual state on the button */
  @Input() forceState: ComponentState | undefined;

  @Input() customClass = '';

  // --- ButtonIconToggleComponent inputs ---

  /** Optional icon class for the toggled state */
  @Input() iconToggled = '';

  /** Optional theme-color for the toggled state */
  @Input() colorToggled = '';

  /**
   * Optional toggle value. When provided the button becomes a toggle button.
   * Accepts a boolean or a BehaviorSubject<boolean>.
   */
  @Input() toggled: boolean | BehaviorSubject<boolean> | undefined;

  // --- ButtonIconWithTextComponent inputs ---

  /** Text displayed next to the icon */
  @Input({ required: true }) text!: string;

  // --- Internal state ---

  @ViewChild('btn') btn: ElementRef | undefined;

  mdToggle$ = new BehaviorSubject<boolean>(false);
  isTogglerBtn = false;
  hasTooltip = false;
  hasDisabledTooltip = false;
  ComponentState = ComponentState;

  _size = '';

  readonly unsub$ = new Subject<void>();

  ngOnInit(): void {
    if (this.disabled === undefined) {
      this.disabled = false;
    }

    if (this.size.length > 0) {
      this._size = ' btn-ic-' + this.size;
    }

    this.hasTooltip = !(this.tooltip === undefined || '');
    this.hasDisabledTooltip = !(this.disabledTooltip === undefined || this.disabledTooltip === null || '');

    if (this.toggled !== undefined) {
      this.isTogglerBtn = true;

      if (typeof this.toggled === 'boolean') {
        this.mdToggle$.next(this.toggled);
        this.mdToggle$.pipe(
          takeUntil(this.unsub$),
          filter(t => !t && this.toggled as boolean),
          switchMap(() =>
            of(true).pipe(
              map(() => this.toggled as boolean),
              takeWhile(v => !v),
              throwIfEmpty(),
              retry({
                delay: (e, i) => {
                  if (i + 1 > 30) throw (this.toggled as boolean);
                  else return timer(50);
                }
              })
            )
          ),
          catchError(() => of(this.toggled as boolean))
        ).subscribe(v => {
          if (!v && this.btn) {
            this.btn.nativeElement.blur();
          }
        });
      } else {
        this.toggled.pipe(takeUntil(this.unsub$)).subscribe(this.mdToggle$);
        this.mdToggle$.pipe(
          takeUntil(this.unsub$),
          filter(t => !t && (this.toggled as BehaviorSubject<boolean>).value),
          switchMap(() =>
            of(true).pipe(
              map(() => (this.toggled as BehaviorSubject<boolean>).value),
              takeWhile(v => !v),
              throwIfEmpty(),
              retry({
                delay: (e, i) => {
                  if (i + 1 > 30) throw (this.toggled as boolean);
                  else return timer(50);
                }
              })
            )
          ),
          catchError(() => of((this.toggled as BehaviorSubject<boolean>).value))
        ).subscribe(v => {
          if (!v && this.btn) {
            this.btn.nativeElement.blur();
          }
        });
      }
    }

    if (this.forceState) {
      // forceState is reflected via template bindings; nothing extra needed here
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['toggled'] !== undefined) {
      const change = changes['toggled'];
      if (!change.firstChange && change.currentValue !== undefined && change.currentValue !== change.previousValue) {
        if (change.currentValue && !this.mdToggle$.value || !change.currentValue && this.mdToggle$.value) {
          this.mdToggle$.next(!this.mdToggle$.value);
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.unsub$.next();
    this.unsub$.complete();
  }

  onRightClick(element: HTMLAnchorElement): void {
    if (this.contextMenuLink) {
      if (this.contextMenuLink[0] !== '/') {
        this.contextMenuLink = '/' + this.contextMenuLink;
      }
      this.renderer.setAttribute(element, 'href', this.contextMenuLink);
      asyncDelay(10, () => this.renderer.removeAttribute(element, 'href'));
    }
  }

  isTemplate(tooltip: any): boolean {
    return tooltip instanceof TemplateRef;
  }

  getTemplateRef(tooltip: string | TemplateRef<any> | null | undefined): TemplateRef<any> {
    return tooltip as TemplateRef<any>;
  }

  typeOfToggle(): string {
    return typeof this.toggled;
  }

  returnToggledAsBehaviorSubject(): BehaviorSubject<boolean> {
    return this.toggled as BehaviorSubject<boolean>;
  }
}
