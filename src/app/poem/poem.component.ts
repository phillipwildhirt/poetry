import { Component, inject, input, Signal } from '@angular/core';
import { PoetryApiService } from '@app/shared/services/poetry-api.service';
import { Poem } from '@app/shared/models/poetrydb.models';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, combineLatest, map, of, switchMap, take } from 'rxjs';
import { ButtonIconWithTextComponent } from '@app/shared/button-icon/button-icon-with-text.component';
import { SkeletonComponent } from '@app/shared/skeleton/skeleton.component';
import { FormatFeature, FormatterPipe } from '@app/poem/formatter.pipe';
import { AsyncPipe, Location } from '@angular/common';
import { Router } from '@angular/router';
import { SearchTermService } from '@app/shared/services/search-term.service';
import { ScrollDirective, ScrollPositionY } from '../shared/directives/scroll.directive';
import { delay, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-poem',
  templateUrl: './poem.component.html',
  styleUrl: './poem.component.scss',
  imports: [
    FormatterPipe,
    AsyncPipe,
    ScrollDirective,
    ButtonIconWithTextComponent,
    SkeletonComponent
  ],
  preserveWhitespaces: false,
})
export class PoemComponent {
  private readonly poetryApiService = inject(PoetryApiService);
  private readonly location = inject(Location);
  private readonly router = inject(Router);
  private readonly searchTermService = inject(SearchTermService);

  readonly author = input.required<string>();
  readonly title = input.required<string>();
  readonly poem: Signal<Poem | undefined> = toSignal(
    combineLatest([
      toObservable<string>(this.author),
      toObservable<string>(this.title)
    ]).pipe(
      switchMap( ([author, title])  => this.poetryApiService.getPoem(author, title))
    )
  );

  readonly contentChanged$ = toObservable(this.poem).pipe(map(() => void 0));
  private readonly _scrollState$ = new BehaviorSubject<ScrollPositionY>('top');
  readonly scrollState$ = this._scrollState$.pipe(distinctUntilChanged());

  protected readonly FormatFeature = FormatFeature;

  constructor() {
    this.poetryApiService.getAuthors().subscribe();
  }

  public setShadowState(event: ScrollPositionY): void {
    const eventObs = of(event);
    eventObs.pipe(take(1), delay(1)).subscribe(v => this._scrollState$.next(v));
  }

  protected backToSearch(): void {
    this.searchTermService.overrideIndex();
    const referrerIsSameOrigin = document.referrer.startsWith(window.location.origin);
    if (referrerIsSameOrigin) {
      this.location.back();
    } else {
      this.router.navigate(['search']);
    }
  }

  protected searchAuthor(author: string): void {
    this.searchTermService.overrideIndex();
    this.searchTermService.setExactAuthor(author);
    this.router.navigate(['search', 'author']);
  }
}
