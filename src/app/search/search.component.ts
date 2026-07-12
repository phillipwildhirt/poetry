import { Component, computed, inject, Signal, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { AppState, TypeaheadAuthorResult, TypeaheadResult, TypeaheadResultKind } from '@app/shared/models/typeahead-result.model';
import { SearchBarComponent } from '@app/search/search-bar/search-bar.component';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { filter, map, merge, pairwise, startWith } from 'rxjs';
import { ButtonIconComponent } from '@app/shared/button-icon/button-icon.component';
import { SearchTermService } from '@app/shared/services/search-term.service';
import { distinctUntilChanged } from 'rxjs/operators';

const SECTION_STATES = [
  TypeaheadResultKind.author,
  TypeaheadResultKind.title,
  TypeaheadResultKind.line,
] as const satisfies AppState[];

const stateNotSpecificMode = (state: AppState): boolean => state !== TypeaheadResultKind.author && state !== TypeaheadResultKind.title && state !== TypeaheadResultKind.line;

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
  imports: [RouterOutlet, SearchBarComponent, ButtonIconComponent],
})
export class SearchComponent {
  private readonly router = inject(Router);
  private readonly searchTermService = inject(SearchTermService);
  readonly data = signal<{ results: TypeaheadResult[]; term: string } | undefined>(undefined);
  readonly hero = computed<boolean>(() => this.data() === undefined);

  readonly state: Signal<AppState> = toSignal(
    merge(
      this.router.events.pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        map((e): AppState => urlToState(e.urlAfterRedirects)),
      ),
      this.searchTermService.set$.pipe(
        map((term): AppState => term ? 'exact-author' : urlToState(this.router.url)),
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
      this.searchTermService.set$.next(exactAuthor.name);
      return;
    }

    this.data.set(event);
    if (this.state() === 'search') {
      this.router.navigate(['search', 'results']);
    }
  }

  protected back(): void {
    if (this.state() === 'exact-author') {
      this.searchTermService.set$.next('');
    }
    this.router.navigate(['search', 'results']);
  }

  protected resetAll(): void {
    this.searchTermService.set$.next('');
    this.data.set(undefined);
    this.router.navigate(['search']);
  }
}
