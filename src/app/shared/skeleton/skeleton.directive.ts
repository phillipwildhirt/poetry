import { AfterViewInit, Directive, ElementRef, inject, Input, OnChanges, OnDestroy, Renderer2, SimpleChanges } from '@angular/core';
import { isObservable, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { createElementWithRenderer } from '../utilities/add-classes-with-renderer.function';



@Directive({
  selector: '[appSkeleton]',
  standalone: true
})
export class SkeletonDirective implements AfterViewInit, OnChanges, OnDestroy {
  private readonly unsub$ = new Subject<void>();
  @Input({alias: 'appSkeleton', required: true}) loading!: Observable<boolean> | boolean;
  private readonly renderer = inject(Renderer2);
  private readonly host = inject(ElementRef);
  private skeleton: Element | undefined;

  constructor() {}

  ngAfterViewInit(): void {
    if (this.host && isObservable(this.loading)) {
      this.loading.pipe(takeUntil(this.unsub$), distinctUntilChanged()).subscribe(loading => {
        if (loading) this.addSkeleton();
        else this.removeSkeleton();
      });
    }
  }

  ngOnChanges(simpleChanges: SimpleChanges): void {
    if (this.host && !isObservable(this.loading) && simpleChanges['loading']) {
      if (simpleChanges['loading'].isFirstChange() || simpleChanges['loading'].currentValue !== simpleChanges['loading'].previousValue) {
        if (this.loading) this.addSkeleton();
        else this.removeSkeleton();
      }
    }
  }

  ngOnDestroy(): void {
    this.unsub$.next();
    this.unsub$.complete();
  }

  addSkeleton(): void {
    this.skeleton = undefined;
    this.skeleton = createElementWithRenderer(this.renderer, 'div', {height: '100%', width: '100%'},['skeleton']);
    this.renderer.appendChild(this.host.nativeElement, this.skeleton);
  }

  removeSkeleton(): void {
    if (this.skeleton) {
      this.renderer.removeChild(this.host.nativeElement, this.skeleton);
    }
  }

}
