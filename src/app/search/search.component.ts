import { Component, computed, effect, inject, Signal, signal } from '@angular/core';
import { AnimationStateService } from '@app/shared/animations/animation-state.service';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { AppState, TypeaheadAuthorResult, TypeaheadResult, TypeaheadResultKind } from '@app/shared/models/typeahead-result.model';
import { SearchBarComponent } from '@app/search/search-bar/search-bar.component';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { filter, map, merge, pairwise, startWith } from 'rxjs';
import { SearchTermService } from '@app/shared/services/search-term.service';
import { distinctUntilChanged } from 'rxjs/operators';
import { ButtonIconWithTextComponent } from '../shared/button-icon/button-icon-with-text.component';

const SECTION_STATES = [
  TypeaheadResultKind.author,
  TypeaheadResultKind.title,
  TypeaheadResultKind.line,
] as const satisfies AppState[];

const stateNotSpecificMode = (state: AppState): boolean => state !== TypeaheadResultKind.author && state !== TypeaheadResultKind.title && state !== TypeaheadResultKind.line && state !== 'exact-author';

const urlToState = (url: string): AppState => {
  if (url.startsWith('/search/author')) return TypeaheadResultKind.author;
  if (url.startsWith('/search/title')) return TypeaheadResultKind.title;
  if (url.startsWith('/search/line')) return TypeaheadResultKind.line;
  return 'search';
};

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  imports: [RouterOutlet, SearchBarComponent, ButtonIconWithTextComponent],
})
export class SearchComponent {
  private readonly router = inject(Router);
  private readonly searchTermService = inject(SearchTermService);
  private readonly animationState = inject(AnimationStateService);
  readonly data = signal<{ results: TypeaheadResult[]; term: string } | undefined>(undefined);
  readonly hero = computed<boolean>(() => this.data() === undefined);

  private heroTransitionTimer: ReturnType<typeof setTimeout> | undefined;
  constructor() {
    effect(() => {
      if (!this.hero()) {
        clearTimeout(this.heroTransitionTimer);
        this.animationState.setAnimating(true);
        this.heroTransitionTimer = setTimeout(
          () => this.animationState.setAnimating(false),
          700,
        );
      }
    });
  }

  readonly state: Signal<AppState> = toSignal(
    merge(
      this.router.events.pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        map((e): AppState => urlToState(e.urlAfterRedirects)),
      ),
      this.searchTermService.term$.pipe(
        map(({ exactAuthor }): AppState => exactAuthor ? 'exact-author' : urlToState(this.router.url)),
      ),
      this.searchTermService.reset$.pipe(
        map((): AppState => urlToState(this.router.url)),
      ),
    ).pipe(startWith('search' as AppState)),
    { initialValue: 'search' as AppState },
  );

  readonly previousStateNotSpecificMode: Signal<boolean | undefined> = toSignal(
    toObservable(this.state).pipe(
      distinctUntilChanged(),
      pairwise(),
      map(([prev]) => prev),
      map(stateNotSpecificMode)
    ),
  );

  readonly stateNotSpecificMode = computed(() => stateNotSpecificMode(this.state()));

  onSearchData(event: { results: TypeaheadResult[]; term: string }): void {
    const exactAuthor = event.results.find((r): r is TypeaheadAuthorResult =>
      r.kind === TypeaheadResultKind.author && r.name.toLowerCase() === event.term.toLowerCase(),
    );

    if (exactAuthor) {
      this.searchTermService.setExactAuthor(exactAuthor.name);
      return;
    }

    this.data.set(event);
    if (this.state() === 'search') {
      this.router.navigate(['search', 'results']);
    }
  }

  protected back(): void {
    if (this.state() === 'exact-author') {
      this.searchTermService.setTerm(this.searchTermService.lastNonExactAuthorTerm());
    }
    this.router.navigate(['search', 'results']);
  }

  protected resetAll(): void {
    this.searchTermService.setTerm('');
    this.data.set(undefined);
    this.router.navigate(['search']);
  }
}
