import { Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { ComponentState } from '@app/shared/enums/component-state.enum';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { NgTemplateOutlet, SlicePipe } from '@angular/common';
import { coerceNumberProperty, NumberInput } from '@angular/cdk/coercion';
import { asyncDelay } from '@app/shared/utilities/async-delay';

@Component({
  selector: 'app-button-icon',
  imports: [
    NgbTooltip,
    NgTemplateOutlet,
    SlicePipe
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
              [class]="getBtnIcClasses(color)
                     + _size
                     + (forceState === ComponentState.hover
                        ? ' hover'
                        : forceState === ComponentState.pressed
                          ? ' active focus'
                          : forceState === ComponentState.active
                            ? ' active'
                            : ' ')
                     + (customClass.length > 0 ? ' ' + customClass : ' ')"
              [disabled]="disabled"
              [ngbTooltip]="isTemplate(tooltip) ? tipContent : tooltip"
              #mine="ngbTooltip"
              container="body"
              [attr.ngbAutofocus]="autofocus ? '' : null"
              [openDelay]="delay"
              [disableTooltip]="!hasTooltip"
              triggers="hover">
        <i [class]="(icon | slice: 0 : 2) + ' ' + icon"></i>
      </button>
    </a>
    <ng-template #tipContent>
      <ng-template [ngTemplateOutlet]="getTemplateRef(tooltip)" [ngTemplateOutletContext]="getTemplateRef(tooltip)" />
    </ng-template>
  `
})
export class ButtonIconComponent implements OnInit, OnDestroy {
  renderer = inject(Renderer2);

  /**
   * Required Icon classname from bootstrap icons or addichenal icons
   * i.e. 'bi-badge-exclamation'
   * @param string - icon class string
   */
  @Input({required: true}) icon = '';

  /**
   * Required theme-color for resting state of the icon
   * i.e. 'secondary', 'primary'
   * @param string - theme color string
   */
  @Input({required: true}) color = '';

  /**
   * Optional bootstrap size string for changing the size of the inner icon, not the btn size.
   * i.e. 'sm', 'lg'
   * @param string
   */
  @Input() size: 'sm' | 'lg' | '' = '';

  /**
   * Optional value for a hover over tooltip.
   * i.e. 'Click me', 'Delete item'
   * @param string
   */
  @Input() tooltip: string | TemplateRef<any> | undefined;

  /**
   * Optional value for a hover over tooltip.
   * i.e. 'Click me', 'Delete item'
   * @param string
   */
  @Input() disabledTooltip: string | TemplateRef<any> | null | undefined;

  /**
   * Optional delay time for opening the tooltip on hover, in milliseconds.
   * @param number
   */
  @Input()
  get delay(): number { return this._delay; }
  set delay(value: NumberInput) {
    this._delay = coerceNumberProperty(value);
  }
  private _delay: number = 800;

  @ViewChild('mine') public ngbTooltip!: NgbTooltip;

  /**
   * Optional type for disabling button.
   * @param string
   */
  @Input() disabled: boolean | undefined;

  /**
   * Optional value for the ngbAutofocus attribute if in a modal.
   * @param boolean
   */
  @Input() autofocus: boolean | undefined;

  /**
   * Optional href to be added if the user right-clicks the button
   * @param string
   */
  @Input() contextMenuLink: string | undefined;

  /**
   * Optional state to be added to force the button to display if needed
   * @param ComponentState
   */
  @Input() forceState: ComponentState | undefined;

  @Input() customClass = '';

  hasTooltip = false;
  hasDisabledTooltip = false;
  ComponentState = ComponentState;
  @ViewChild('btn') btn: ElementRef | undefined;

  _size: string = '';

  public readonly unsub$ = new Subject<void>();

  ngOnInit(): void {
    if (this.disabled === undefined)
      this.disabled = false;

    if (this.size.length > 0) {
      this._size = ' btn-ic-' + this.size;
    }

    this.hasTooltip = !(this.tooltip === undefined || '');
    this.hasDisabledTooltip = !(this.disabledTooltip === undefined || this.disabledTooltip === null || '');
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

  getBtnIcClasses(color: string): string {
    return ' btn-ic ' + (color.length ? ' btn-ic-' + color : ' ');
  }

  isTemplate(tooltip: any): boolean {
    return tooltip instanceof TemplateRef;
  }

  getTemplateRef(tooltip: string | TemplateRef<any> | null | undefined) {
    return tooltip as TemplateRef<any>;
  }

  close(animation: boolean) {
    this.ngbTooltip.close(animation);
  }
}
