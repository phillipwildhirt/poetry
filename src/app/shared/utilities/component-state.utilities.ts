import { delay, filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { ComponentState } from '../enums/component-state.enum';
import { BehaviorSubject, of, Subject } from 'rxjs';

export class ComponentStateUtilities {
  public static SetAnimationStateOnComponentState(componentState$: BehaviorSubject<ComponentState>, animationState$: BehaviorSubject<ComponentState>, unsubscribe$: Subject<void>) {
    componentState$.pipe(
      takeUntil(unsubscribe$),
      switchMap(v => {
        switch (v) {
          case ComponentState.hover:
            return of(v).pipe(delay(1500));
          case ComponentState.focus:
            return of(v);
          case ComponentState.normal:
            return of(v);
          default:
            return of(null);
        }
      }),
      filter(v => v !== null),
      map(v => v as ComponentState),
    ).subscribe((v: ComponentState) => animationState$.next(v));
  }

  public static SetAnimationStateOnAllComponentState(componentState$: BehaviorSubject<ComponentState[]>,
                                                     animationState$: BehaviorSubject<ComponentState>,
                                                     unsubscribe$: Subject<void>,
                                                     priorityState: ComponentState  = ComponentState.hover,
                                                     hoverDelay: number | undefined = undefined) {
    componentState$.pipe(
      switchMap(v => {
        const s = this.getComponentState(v, priorityState);
        if (s === ComponentState.hover) {
          if (hoverDelay) return of(s).pipe(delay(hoverDelay));
          else return of(s);
        } else {
          return of(s);
        }
      }),
      takeUntil(unsubscribe$),
    ).subscribe((v: ComponentState) => animationState$.next(v));
  }

  public static getComponentState(componentStates: ComponentState[], priorityState: ComponentState = ComponentState.hover): ComponentState {
    switch (priorityState) {
      case ComponentState.focus:
        switch (true) {
          case componentStates.includes(ComponentState.focus):
            return ComponentState.focus;
          case componentStates.includes(ComponentState.active):
            return ComponentState.active;
          case componentStates.every(s => s === ComponentState.hover):
            return ComponentState.hover;
          default:
            return ComponentState.normal;
        }
      case ComponentState.pressed:
        switch (true) {
          case componentStates.includes(ComponentState.pressed):
            return ComponentState.pressed;
          case componentStates.includes(ComponentState.active):
            return ComponentState.active;
          case componentStates.includes(ComponentState.focus):
            return ComponentState.focus;
          case componentStates.every(s => s === ComponentState.hover):
            return ComponentState.hover;
          default:
            return ComponentState.normal;
        }
      default:
        switch (true) {
          case componentStates.includes(ComponentState.hover):
            return ComponentState.hover;
          case componentStates.includes(ComponentState.active):
            return ComponentState.active;
          case componentStates.includes(ComponentState.focus):
            return ComponentState.focus;
          default:
            return ComponentState.normal;
        }
    }
  }

  /** Useful for console logs */
  public static getEnum(s: ComponentState): string {
    switch (s) {
      case ComponentState.active: return 'active';
      case ComponentState.focus: return 'focus';
      case ComponentState.normal: return 'normal';
      case ComponentState.pressed: return 'pressed';
      case ComponentState.hover: return 'hover';
    }
  }
}
