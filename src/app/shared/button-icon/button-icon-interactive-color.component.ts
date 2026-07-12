import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ComponentState } from '../enums/component-state.enum';
import { ButtonIconComponent } from '@app/shared/button-icon/button-icon.component';
import { ComponentStateUtilities } from '../utilities/component-state.utilities';
import { AsyncPipe, NgTemplateOutlet, SlicePipe } from '@angular/common';
import { ComponentStateDirective } from '@app/shared/directives/component-state.directive';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-button-icon-interactive-color',
  imports: [
    NgbTooltip,
    NgTemplateOutlet,
    AsyncPipe,
    SlicePipe,
    ComponentStateDirective
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
              [id]="generatedId"
              [class]="_size
                     + ((componentState$ | async) !== ComponentState.normal
                           && (componentState$ | async) !== ComponentState.focus
                         ? getBtnIcInteractiveClasses()
                         : getBtnIcClasses(color))
                     + (customClass.length > 0 ? ' ' + customClass : ' ')"
              (appComponentState)="componentState$.next(ComponentStateUtilities.getComponentState($event, ComponentState.pressed))"
              [applyState]="false"
              [disabled]="disabled"
              [ngbTooltip]="tooltip"
              [attr.ngbAutofocus]="autofocus ? '' : null"
              [openDelay]="delay"
              [disableTooltip]="!hasTooltip"
              [container]="'body'"
              triggers="hover">
        <i [class]="(icon | slice: 0 : 2) + ' ' + icon"></i>
      </button>
    </a>
    <ng-template #tipContent>{{ tooltip }}</ng-template>
  `
})
export class ButtonIconInteractiveColorComponent extends ButtonIconComponent implements OnInit, OnDestroy {
  /**
   * If the base color will be different when the user interacts, input an optional theme-color here
   * i.e. 'secondary', 'dpsblue'
   * @param string - theme color string
   */
  @Input() interactionColor = '';

  ComponentStateUtilities = ComponentStateUtilities;

  generatedId = '';

  readonly componentState$ = new BehaviorSubject<ComponentState>(ComponentState.normal);

  constructor() {
    super();
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this.generatedId = 'icTogInt' + Math.floor(Math.random() * 10000000000);

    if (this.forceState)
      this.componentState$.next(this.forceState);
  }

  getBtnIcInteractiveClasses(): string {
    return this.interactionColor.length ? this.getBtnIcClasses(this.interactionColor) : '';
  }
}
