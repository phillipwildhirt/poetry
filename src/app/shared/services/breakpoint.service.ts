import { inject, Injectable, isDevMode } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map, Observable, of } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

export enum Breakpoint {
  none = 'none',
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  xl = 'xl',
  xxl = 'xxl',
  xxxl = 'xxxl',
}

@Injectable({
  providedIn: 'root'
})
export class BreakpointService {
  breakpointObs$ = inject(BreakpointObserver);
  public static breakpointValues: {[k in Breakpoint]: number} = {
    none: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1400,
    xxxl: 1600,
  };
  private breakpoints: {[k in Breakpoint]: Observable<boolean>};

  constructor() {
    this.breakpoints = {
      none: this.breakpointObs$.observe(`(min-width: ${BreakpointService.breakpointValues.none}px)`).pipe(map(bps => bps.matches)),
      sm: this.breakpointObs$.observe(`(min-width: ${BreakpointService.breakpointValues.sm}px)`).pipe(map(bps => bps.matches)),
      md: this.breakpointObs$.observe(`(min-width: ${BreakpointService.breakpointValues.md}px)`).pipe(map(bps => bps.matches)),
      lg: this.breakpointObs$.observe(`(min-width: ${BreakpointService.breakpointValues.lg}px)`).pipe(map(bps => bps.matches)),
      xl: this.breakpointObs$.observe(`(min-width: ${BreakpointService.breakpointValues.xl}px)`).pipe(map(bps => bps.matches)),
      xxl: this.breakpointObs$.observe(`(min-width: ${BreakpointService.breakpointValues.xxl}px)`).pipe(map(bps => bps.matches)),
      xxxl: this.breakpointObs$.observe(`(min-width: ${BreakpointService.breakpointValues.xxxl}px)`).pipe(map(bps => bps.matches)),
    };
    if (isDevMode()) {
      this.noneOnly.pipe(filter(v => v)).subscribe(() => console.log('in breakpoint - none'));
      this.smOnly.pipe(filter(v => v)).subscribe(() => console.log('in breakpoint - sm'));
      this.mdOnly.pipe(filter(v => v)).subscribe(() => console.log('in breakpoint - md'));
      this.lgOnly.pipe(filter(v => v)).subscribe(() => console.log('in breakpoint - lg'));
      this.xlOnly.pipe(filter(v => v)).subscribe(() => console.log('in breakpoint - xl'));
      this.xxlOnly.pipe(filter(v => v)).subscribe(() => console.log('in breakpoint - xxl'));
      this.xxxl.pipe(filter(v => v)).subscribe(() => console.log('in breakpoint - xxxl'));
    }
  }

  public get none(): Observable<boolean> {
    return this.breakpoints.none;
  }
  public get sm(): Observable<boolean> {
    return this.breakpoints.sm;
  }
  public get md(): Observable<boolean> {
    return this.breakpoints.md;
  }
  public get lg(): Observable<boolean> {
    return this.breakpoints.lg;
  }
  public get xl(): Observable<boolean> {
    return this.breakpoints.xl;
  }
  public get xxl(): Observable<boolean> {
    return this.breakpoints.xxl;
  }
  public get xxxl(): Observable<boolean> {
    return this.breakpoints.xxxl;
  }

  public get noneOnly(): Observable<boolean> {
    return this.breakpoints.none.pipe(switchMap(v => {
      if (v)
        return this.breakpoints.sm.pipe(map(v => !v));
      return of(v);
    }));
  }
  public get smOnly(): Observable<boolean> {
    return this.breakpoints.sm.pipe(switchMap(v => {
      if (v)
        return this.breakpoints.md.pipe(map(v => !v));
      return of(v);
    }));
  }
  public get mdOnly(): Observable<boolean> {
    return this.breakpoints.md.pipe(switchMap(v => {
      if (v)
        return this.breakpoints.lg.pipe(map(v => !v));
      return of(v);
    }));
  }
  public get lgOnly(): Observable<boolean> {
    return this.breakpoints.lg.pipe(switchMap(v => {
      if (v)
        return this.breakpoints.xl.pipe(map(v => !v));
      return of(v);
    }));
  }
  public get xlOnly(): Observable<boolean> {
    return this.breakpoints.xl.pipe(switchMap(v => {
      if (v)
        return this.breakpoints.xxl.pipe(map(v => !v));
      return of(v);
    }));
  }
  public get xxlOnly(): Observable<boolean> {
    return this.breakpoints.xxl.pipe(switchMap(v => {
      if (v)
        return this.breakpoints.xxxl.pipe(map(v => !v));
      return of(v);
    }));
  }
}
