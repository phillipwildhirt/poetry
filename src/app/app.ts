import { Component, inject, Signal, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SearchMode, TypeaheadResult, TypeaheadResultKind, TypeaheadSearchKind } from '@app/shared/models/typeahead-result.model';
import { SearchComponent } from '@app/search/search.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';

const SECTION_MODES = [
  TypeaheadResultKind.author,
  TypeaheadResultKind.title,
  TypeaheadResultKind.line,
] as const satisfies SearchMode[];

function isSectionMode(url: string): url is TypeaheadSearchKind {
  return SECTION_MODES.some(m => url.startsWith(`/${m}`));
}

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [RouterOutlet, SearchComponent],
})
export class App {
  private readonly router = inject(Router);
  protected readonly title = signal('Poetry');
  readonly data = signal<{ results: TypeaheadResult[]; term: string } | undefined>(undefined);

  readonly mode: Signal<SearchMode> = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e): SearchMode => (isSectionMode(e.urlAfterRedirects) ? SECTION_MODES.find((m) => e.urlAfterRedirects.startsWith(`/${m}`))! : ('search' as SearchMode))),
      startWith('search' as SearchMode),
    ),
    { initialValue: 'search' as SearchMode },
  );

  onSearchData(event: { results: TypeaheadResult[]; term: string }): void {
    this.data.set(event);
    if (this.mode() === 'search') {
      this.router.navigate(['search'], { queryParams: { q: event.term } });
    }
  }
}
