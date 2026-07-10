import { inject, Injectable } from '@angular/core';
import { catchError, combineLatestWith, map, Observable, of, shareReplay, startWith, switchMap, tap } from 'rxjs';
import { PoetryApiService } from '@app/shared/services/poetry-api.service';
import { PoemTitleAuthor } from '@app/shared/models/poetrydb.models';
import { TypeaheadResult, TypeaheadResultKind, TypeaheadSkeletonResult } from '@app/shared/models/typeahead-result.model';

@Injectable()
export class SearchService {
  private readonly poetryApiService = inject(PoetryApiService);

  readonly authors$: Observable<string[]> = this.poetryApiService.getAuthors().pipe(
    map((response) => response.authors),
    shareReplay(1),
  );

  readonly storedTitleSearches = new Map<string, PoemTitleAuthor[] | Observable<PoemTitleAuthor[]>>();

  public autoSuggestTitles(term: string): Observable<PoemTitleAuthor[]> {
    let stored = this.storedTitleSearches.get(term);
    if (stored instanceof Array) return of(stored);
    if (stored === undefined) {
      stored = this.poetryApiService.searchTitles(term).pipe(
        map(response => Array.isArray(response) ? response : []),  // guard against { status: 404, reason: '...' } body
        tap((v) => this.storedTitleSearches.set(term, v)),
        catchError(() => of([])),  // guard against actual HTTP errors
      );
      this.storedTitleSearches.set(term, stored);
    }
    return stored;
  }

  readonly typeahead = (source$: Observable<string>): Observable<TypeaheadResult[]> => {
    // Emit the term to both branches simultaneously
    return source$.pipe(
      combineLatestWith(this.authors$),
      switchMap(([term, authors]) => {
        const normalizedTerm = term.toLowerCase().trim();

        // Synchronously filter authors — startsWith first, then contains
        const { startsWith, contains } = authors.reduce<{ startsWith: string[]; contains: string[] }>(
          (acc, a) => {
            const lower = a.toLowerCase();
            if (lower.startsWith(normalizedTerm)) acc.startsWith.push(a);
            else if (lower.includes(normalizedTerm)) acc.contains.push(a);
            return acc;
          },
          { startsWith: [], contains: [] }
        );
        const filteredAuthors: TypeaheadResult[] = [...startsWith, ...contains]
          .slice(0, 5)
          .map((name, i) => ({
            kind: TypeaheadResultKind.author,
            name,
            ...(i === 0 ? { sectionLabel: 'Authors' } : {}),
          }) satisfies TypeaheadResult);

        // Titles branch: show skeletons immediately, replace with results when ready
        const skeletons: TypeaheadSkeletonResult[] = Array.from({ length: 5 }, (_, i) => ({
          kind: TypeaheadResultKind.skeleton,
          ...(i === 0 ? { sectionLabel: 'Poems' } : {}),
        }));

        const titleResults$: Observable<TypeaheadResult[]> = !normalizedTerm
          ? of([])
          : this.autoSuggestTitles(term).pipe(
              map((titles) =>
                titles
                  .filter((t) => t.title.toLowerCase().includes(normalizedTerm))
                  .slice(0, 5)
                  .map((t, i) => ({
                    kind: TypeaheadResultKind.title,
                    title: t.title,
                    author: t.author,
                    ...(i === 0 ? { sectionLabel: 'Poems' } : {}),
                  }) satisfies TypeaheadResult)
              ),
              startWith(skeletons),
            );

        // Combine both branches — no divider items, just labelled first items
        return titleResults$.pipe(
          map((titleResults) => [
            ...filteredAuthors,
            ...titleResults,
          ]),
        );
      })
    );
  };
}
