import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

export type DarkMode = 'dark' | 'light' | 'system';

@Injectable({providedIn: 'root'})
export class DarkModeService {

  readonly darkMode$ = new BehaviorSubject<DarkMode>('system');
  readonly isInDarkMode$ = this.darkMode$.pipe(map(v => {
      switch (v) {
        case 'dark':
          return true;
        case 'light':
          return false;
        case 'system':
        default:
          const prefersDarkScheme: MediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
          return prefersDarkScheme.matches;
      }
    })
  );

  public updateDarkMode(darkMode: DarkMode): void {
    this.darkMode$.next(darkMode);
  }
}
