import { AnimationCallbackEvent } from '@angular/core';
import { from, merge, Subject, SubjectLike } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export class AnimationUtilities {
  static onShowHideAnimation($event: AnimationCallbackEvent, subject: SubjectLike<boolean>, unsub$: Subject<void>): void {
    const animations = $event.target.getAnimations();
    if (animations.length) {
      subject.next(false);
      merge(...animations.map(animation => from(animation.finished))).pipe(
        takeUntil(unsub$)
      ).subscribe({
        complete: () => {
          subject.next(true);
          $event.animationComplete();
        }
      });
    }
  }

  static onAnimationDone($event: AnimationCallbackEvent, callback: Function, unsub$: Subject<void>): void {
    const animations = $event.target.getAnimations();
    if (animations.length) {
      merge(...animations.map(animation => from(animation.finished))).pipe(
        takeUntil(unsub$)
      ).subscribe({
        complete: () => {
          callback();
          $event.animationComplete();
        }
      });
    } else {
      callback();
      $event.animationComplete();
      // currently angular will not remove the element if there is no animations and the (animate.leave) event fired.
      $event.target.remove();
    }
  }
}
