import { afterNextRender, AfterRenderRef, AfterViewInit, Directive, ElementRef, EventEmitter, HostListener, inject, InjectionToken, Injector, Input, OnDestroy, OnInit, Output, runInInjectionContext } from '@angular/core';
import { ScrollXY } from '@app/shared/models/scroll-x-y.model';
import { Observable, of, Subject, timer } from 'rxjs';
import { delay, exhaustMap, mergeMap, retry, switchMap, takeUntil } from 'rxjs/operators';


export type ScrollPositionY = 'top' | 'middle' | 'bottom' | 'none';
export type ScrollPositionX = 'left' | 'middle' | 'right' | 'none';
export type ScrollRequest = 'positionX' | 'positionY' | 'stats' | 'positionYFlipped';


interface ScrollEmitter {
  scrollStats: EventEmitter<ScrollXY>;
  scrollYPosition: EventEmitter<ScrollPositionY>;
  scrollYPositionFlipped: EventEmitter<ScrollPositionY>;
  scrollXPosition: EventEmitter<ScrollPositionX>;
  request: ScrollRequest[];
  renderRef: AfterRenderRef;
}
const ScrollEmitterToken = new InjectionToken<ScrollEmitter>('SCROLL_EMITTER');


@Directive({
  selector: '[appScroll]',
  standalone: true,
  providers: [{provide: ScrollEmitterToken, useValue: {
    scrollStats: new EventEmitter<ScrollXY>(),
    scrollYPosition: new EventEmitter<ScrollPositionY>(),
    scrollYPositionFlipped: new EventEmitter<ScrollPositionY>(),
    scrollXPosition: new EventEmitter<ScrollPositionX>(),
    request: ['positionX', 'positionY', 'stats'],
  }}]
})
export class ScrollDirective implements OnInit, AfterViewInit, OnDestroy {
  readonly injector = inject(Injector);
  readonly el = inject(ElementRef);
  readonly scrollEmitter = inject(ScrollEmitterToken);
  /** Returns the scroll stats for the element on Scroll events.
   * Only returned if Input 'request' is set to 'stats' or not specified.
   * Helps save on resources
   * @returns EventEmitter<ScrollXY>
   *   ScrollXY:
   *      x: horizontal scroll position;
   *      y: vertical scroll position;
   *      w: width of scrolling container;
   *      h: height of scrolling container;
   *      scrollW: total width of scrollable area;
   *      scrollH: total height of scrollable area; */
  @Output() scrollStats = this.scrollEmitter.scrollStats;

  /** Returns the Vertical Scroll status, top, middle, bottom, none.
   * Only returned if Input 'request' is set to 'positionY' or not specified.
   * @returns string
   *    'top' | 'middle' | 'bottom' | 'none' */
  @Output() scrollYPosition = this.scrollEmitter.scrollYPosition;
  // scrollYPosition = output<ScrollPositionY>();

  /** Returns the Vertical Scroll status reversed flex (flex-direction: column-reverse;) for scroll-, top, middle, bottom, none.
   * Only returned if Input 'request' includes to 'positionYFlipped'.
   * @returns string
   *    'top' | 'middle' | 'bottom' | 'none' */
  @Output() scrollYPositionFlipped = this.scrollEmitter.scrollYPositionFlipped;

  /** Returns the Horizontal Scroll status, left, middle, right, none.
   * Only returned if Input 'request' is set to 'positionX' or not specified.
   * @returns string
   *    'left' | 'middle' | 'right' | 'none' */
  @Output() scrollXPosition = this.scrollEmitter.scrollXPosition;

  /** Specify what you want to be returned by the directive in order to save system resources.
   * Optional. Default will do all calculations.
   * @param ScrollRequest[]
   *    'positionX' | 'positionY' | 'positionYFlipped' | 'stats' */
  @Input() request: ScrollRequest[] = ['positionX', 'positionY', 'stats'];

  @Input() contentChanged$: Observable<void> | undefined;

  private readonly unsub$ = new Subject<void>();

  constructor() {
    this.scrollEmitter.renderRef = afterNextRender({ earlyRead: () => runInInjectionContext(this.injector, this.readDom), write: this.emitToDom });
  }

  @HostListener('scroll')
  onScroll(): {x: ScrollPositionX | '', y: ScrollPositionY | ''} {
    return runInInjectionContext(this.injector, () => this.emitToDom(this.readDom()));
  }

  ngOnInit(): void {
    this.scrollEmitter.scrollStats = this.scrollStats;
    this.scrollEmitter.scrollXPosition = this.scrollXPosition;
    this.scrollEmitter.scrollYPosition = this.scrollYPosition;
    this.scrollEmitter.scrollYPositionFlipped = this.scrollYPositionFlipped;
    this.scrollEmitter.request = this.request;
  }

  ngAfterViewInit(): void {
    if (this.contentChanged$) {
      this.contentChanged$.pipe(
        takeUntil(this.unsub$),
        delay(30),
        switchMap(() => {
          let count = {count: 0};
          return timer(0).pipe(
            exhaustMap(() => {
              let v = this.onScroll();
              if ((v.x !== 'none' && v.x !== '') || (v.y !== 'none' && v.y !== '')) {
                return of(v);
              } else {
                switch (true) {
                  case count.count < 3:
                    count.count++;
                    return timer(200).pipe(mergeMap(() => {throw new Error('retry please');}));
                  case count.count > 6:
                    return of(v);
                  default:
                    count.count++;
                    return timer(600).pipe(mergeMap(() => {throw new Error('retry please');}));
                }
              }
            }),
            retry());
        })
      ).subscribe(() => {});
    }
  }

  ngOnDestroy(): void {
    this.unsub$.next();
    this.unsub$.complete();
  }

  readDom(): {stats: ScrollXY, xPos: ScrollPositionX, yPos: ScrollPositionY, yPosFlipped: ScrollPositionY, scrollEmitter: ScrollEmitter} {
    const scrollEmitter = inject(ScrollEmitterToken);
    const el = inject(ElementRef);
    const containerEl = el.nativeElement;
    const scrollXY = { x: containerEl.scrollLeft, y: containerEl.scrollTop };
    const elWH = { w: containerEl.getBoundingClientRect().width, h: containerEl.getBoundingClientRect().height };
    const positionX: ScrollPositionX =
            scrollXY.x < 1 && elWH.w + 1 > containerEl.scrollWidth
            ? 'none'
            : scrollXY.x + elWH.w > containerEl.scrollWidth - 1
              ? 'right'
              : scrollXY.x < 1
                ? 'left'
                : 'middle';
    const positionY: ScrollPositionY =
            scrollXY.y < 1 && elWH.h + 1 > containerEl.scrollHeight
            ? 'none'
            : scrollXY.y + elWH.h > containerEl.scrollHeight - 1
              ? 'bottom'
              : scrollXY.y < 1
                ? 'top'
                : 'middle';
    const positionYFlipped: ScrollPositionY =
            scrollXY.y < 1 && elWH.h + 1 > containerEl.scrollHeight
            ? 'none'
            : scrollXY.y < 0 && (scrollXY.y * -1) + elWH.h < containerEl.scrollHeight - 1
              ? 'middle'
              : scrollXY.y <= 0 && (scrollXY.y * -1) + elWH.h < containerEl.scrollHeight - 1
                ? 'top'
                : 'bottom';
    return {
      stats: new ScrollXY(
        scrollXY.x,
        scrollXY.y,
        elWH.w,
        elWH.h,
        containerEl.scrollWidth,
        containerEl.scrollHeight),
      xPos: positionX,
      yPos: positionY,
      yPosFlipped: positionYFlipped,
      scrollEmitter,
    };
  }

  emitToDom(arg: {stats: ScrollXY, xPos: ScrollPositionX, yPos: ScrollPositionY, yPosFlipped: ScrollPositionY, scrollEmitter: ScrollEmitter}): {x: ScrollPositionX, y: ScrollPositionY} {
    if (arg.scrollEmitter.request.includes('stats')) {
      arg.scrollEmitter.scrollStats.emit(arg.stats);
    }
    if (arg.scrollEmitter.request.includes('positionX')) {
      arg.scrollEmitter.scrollXPosition.emit(arg.xPos);
    }
    if (arg.scrollEmitter.request.includes('positionY')) {
      arg.scrollEmitter.scrollYPosition.emit(arg.yPos);
    }
    if (arg.scrollEmitter.request.includes('positionYFlipped')) {
      arg.scrollEmitter.scrollYPositionFlipped.emit(arg.yPosFlipped);
    }
    if (arg.scrollEmitter.renderRef)
      arg.scrollEmitter.renderRef.destroy();
    return {x: arg.xPos, y: arg.yPos};
  }
}
