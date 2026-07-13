import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { BehaviorSubject, of, timer } from 'rxjs';
import { catchError, filter, map, retry, switchMap, takeUntil, takeWhile, throwIfEmpty } from 'rxjs/operators';
import { ButtonIconComponent } from '@app/shared/button-icon/button-icon.component';
import { AsyncPipe, NgTemplateOutlet, SlicePipe } from '@angular/common';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-button-icon-toggle',
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
        <ng-template [ngTemplateOutlet]="getTemplateRef(disabledTooltip)" [ngTemplateOutletContext]="getTemplateRef(disabledTooltip)"/>
      </ng-template>
      <button #btn
              [class]="'btn-ic '
                     + (color.length ? ' btn-ic-' + color : ' ')
                     + (isTogglerBtn ? ' btn-ic-tog-' + colorToggled : ' ')
                     + _size
                     + ((toggled !== undefined && (mdToggle$ | async)) ? ' tog' : ' ')
                     + (forceState === ComponentState.hover ? ' hover' : forceState === ComponentState.pressed ? ' active focus' : ' ')
                     + (customClass.length > 0 ? ' ' + customClass : ' ')"
              (mouseup)="mdToggle$.next(!mdToggle$.value)"
              [disabled]="disabled"
              [ngbTooltip]="isTemplate(tooltip) ? tipContent : tooltip"
              [attr.ngbAutofocus]="autofocus ? '' : null"
              [openDelay]="delay"
              [disableTooltip]="!hasTooltip"
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
      </button>
    </a>
    <ng-template #tipContent>
      <ng-template [ngTemplateOutlet]="getTemplateRef(tooltip)" [ngTemplateOutletContext]="getTemplateRef(tooltip)" />
    </ng-template>
  `
})
export class ButtonIconToggleComponent extends ButtonIconComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * Optional second Icon classname if the btn will be a TOGGLE icon btn
   * @param string - icon class string
   */
  @Input() iconToggled = '';

  /**
   * Optional second theme-color for the toggled on/true state of a TOGGLE icon btn
   * i.e. 'secondary', 'primary'
   * @important If color and colorToggled are the same, based on contrast ratio, the 'active' color is black or white. This essentially creates a btn-ic-toggle that only changes icons.
   * @param string - theme color string
   */
  @Input() colorToggled = '';

  /**
   * Optional value that, if specified, will transform it to a TOGGLE icon btn.
   * The Value itself will indicate if the button is toggled (``true``) or not toggled (``false``)
   * @param boolean
   */
  @Input() toggled: boolean | BehaviorSubject<boolean> | undefined;

  mdToggle$ = new BehaviorSubject<boolean>(false);
  isTogglerBtn = false;

  constructor() {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();

    if (this.toggled !== undefined) {
      this.isTogglerBtn = true;
      if (typeof this.toggled === 'boolean') {
        this.mdToggle$.next(this.toggled);
        // Repeatedly checks input "toggled" value until it updates to false, and then blurs the btn.
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
                  if (i + 1 > 30)
                    throw (this.toggled as boolean);
                  else
                    return timer(50);
                }
              }))
          ),
          catchError(() => of(this.toggled as boolean))
        ).subscribe(v => {
          if (!v && this.btn) {
            this.btn.nativeElement.blur();
          }
        });
      } else {
        // mdToggle.next(toggled.value);
        // Repeatedly checks input "toggled" value until it updates to false, and then blurs the btn.
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
                  if (i + 1 > 30)
                    throw (this.toggled as boolean);
                  else
                    return timer(50);
                }
              }))
          ),
          catchError(() => of((this.toggled as BehaviorSubject<boolean>).value))
        ).subscribe(v => {
          if (!v && this.btn) {
            this.btn.nativeElement.blur();
          }
        });
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // allows for programmatic changing of this.toggled without a mouse interaction.
    if (changes) {
      if (changes['toggled'] !== undefined) {
        if (!changes['toggled'].firstChange && changes['toggled'].currentValue !== undefined && changes['toggled'].currentValue !== changes['toggled'].previousValue) {
          if (changes['toggled'].currentValue && !this.mdToggle$.value || !changes['toggled'].currentValue && this.mdToggle$.value)
            this.mdToggle$.next(!this.mdToggle$.value);
        }
      }
    }
  }

  typeOfToggle(): string {
    return typeof this.toggled;
  }

  returnToggledAsBehaviorSubject(): BehaviorSubject<boolean> {
    return this.toggled as BehaviorSubject<boolean>;
  }
}
