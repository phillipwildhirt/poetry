import { Component, computed, inject, Signal, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { AppState, TypeaheadAuthorResult, TypeaheadResult, TypeaheadResultKind } from '@app/shared/models/typeahead-result.model';
import { SearchComponent } from '@app/search/search.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, merge, startWith } from 'rxjs';
import { ButtonIconComponent } from '@app/shared/button-icon/button-icon.component';
import { SearchTermService } from '@app/shared/services/search-term.service';

const SECTION_MODES = [
  TypeaheadResultKind.author,
  TypeaheadResultKind.title,
  TypeaheadResultKind.line,
] as const satisfies AppState[];

function urlToMode(url: string): AppState {
  if (url.startsWith('/poem')) return 'poem';
  const match = SECTION_MODES.find(m => url.startsWith(`/${m}`));
  return match ?? 'search';
}

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [RouterOutlet, SearchComponent, ButtonIconComponent],
})
export class App {
  private readonly router = inject(Router);
  private readonly searchTermService = inject(SearchTermService);
  protected readonly title = signal('Poetry');
  readonly data = signal<{ results: TypeaheadResult[]; term: string } | undefined>(undefined);
  readonly hero = computed<boolean>(() => this.data() === undefined);

  readonly state: Signal<AppState> = toSignal(
    merge(
      this.router.events.pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        map((e): AppState => urlToMode(e.urlAfterRedirects)),
      ),
      this.searchTermService.set$.pipe(
        map((term): AppState => term ? 'exact-author' : urlToMode(this.router.url)),
      ),
      this.searchTermService.reset$.pipe(
        map((): AppState => urlToMode(this.router.url)),
      ),
    ).pipe(startWith('search' as AppState)),
    { initialValue: 'search' as AppState },
  );

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
      this.router.navigate(['search']);
    }
  }

  protected back(): void {
    if (this.state() === 'exact-author') {
      this.searchTermService.set$.next('');
    }
    this.router.navigate(['..']);
  }

  protected resetAll(): void {
    this.data.set(undefined);
    this.router.navigate(['..']);
  }
}
