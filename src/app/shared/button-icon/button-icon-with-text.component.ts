import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ButtonIconToggleComponent } from '@app/shared/button-icon/button-icon-toggle.component';
import { AsyncPipe, NgTemplateOutlet, SlicePipe } from '@angular/common';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

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
export class ButtonIconWithTextComponent extends ButtonIconToggleComponent implements OnInit, OnDestroy {
  /**
   * Text to be displayed next to icon.
   * @type {string}
   */
  @Input({required: true}) text!: string;

  constructor() {
    super();
  }

}
