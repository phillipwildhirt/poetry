import { concat, connect, Observable, ObservableInput, of, OperatorFunction, Subscription, take } from 'rxjs';
import { catchError, delay, map, retry, takeUntil } from 'rxjs/operators';
import { isDevMode } from '@angular/core';

export const delayUntil = <T>(
  notifier: Observable<any>
): OperatorFunction<T, T> => {
  return source =>
    source.pipe(
      connect(published => {
        const delayed = new Observable<T>(subscriber => {
          let buffering = true;
          const buffer: T[] = [];
          const subscription = new Subscription();
          subscription.add(
            notifier.subscribe({
              next: () => {
                buffer.forEach(value => subscriber.next(value));
                subscriber.complete();
              },
              error: error => subscriber.error(error),
              complete: () => {
                buffering = false;
                buffer.length = 0;
              }
            })
          );
          subscription.add(
            published.subscribe({
              next: value => buffering && buffer.push(value),
              error: error => subscriber.error(error)
            })
          );
          subscription.add(() => {
            buffer.length = 0;
          });
          return subscription;
        });
        return concat(delayed, published);
      })
    );
};

export const asyncDelay = (delayTime: number = 0, func: () => void) => of([]).pipe(delay(delayTime)).subscribe(func);
export const asyncDelayTakeUntil = (delayTime: number = 0, notifier: ObservableInput<any>, func: () => void) => of([]).pipe(delay(delayTime), takeUntil(notifier)).subscribe(func);
export const asyncDelayUntil = (obs: Observable<any>, func: () => void) => of([]).pipe(delayUntil(obs)).subscribe(func);

/**
 Pass in a function that may return true
 will retry any number of times after any amount of delay.
 If the retry count is exhausted the observable will return false.
 * @param ready Function, () => returns boolean;
 * @param count Number, (optional) default is 20;
 * @param delay Number, (optional) default is 1ms;
 * @return Observable<boolean>
 */

export const delayUntilReady = (ready: () => (boolean | undefined | null), count: number = 20, delay: number = 1): Observable<boolean> => {
  return of(0).pipe(
    map(() => {
      if (count === 0)
        return ready() === true;
      else if (ready())
        return true;
      else { throw 'Timed out before ready(). Try increasing count or delay.'; }}),
    take(1),
    retry( {count, delay}),
    catchError(err => {
      if (isDevMode()) {
        console.error(err, ready, count, delay);
      }
      return of(false);
    }));
};
