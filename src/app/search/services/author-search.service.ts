import { inject, Injectable } from '@angular/core';
import { map, Observable, of, shareReplay } from 'rxjs';
import { PoetryApiService } from '@app/shared/services/poetry-api.service';
import { TypeaheadAuthorResult, TypeaheadResultKind } from '@app/shared/models/typeahead-result.model';

@Injectable()
export class AuthorSearchService {
  private readonly poetryApiService = inject(PoetryApiService);

  private readonly authors$: Observable<string[]> = this.poetryApiService.getAuthors().pipe(
    map((response) => response.authors),
    shareReplay(1),
  );

  private readonly cache = new Map<string, string[] | Observable<string[]>>();

  constructor() {
    // might as well cache the authors immediately.
    this.authors$.subscribe();
  }

  search(term: string, limit: number): Observable<string[]> {
    const key = `${term}:${limit}`;
    const stored = this.cache.get(key);
    if (stored instanceof Array) return of(stored);
    if (stored !== undefined) return stored;

    const normalized = term.toLowerCase().trim();
    const result$ = this.authors$.pipe(
      map((authors) => {
        const { startsWith, contains } = authors.reduce<{ startsWith: string[]; contains: string[] }>(
          (acc, a) => {
            const lower = a.toLowerCase();
            if (lower.startsWith(normalized)) acc.startsWith.push(a);
            else if (lower.includes(normalized)) acc.contains.push(a);
            return acc;
          },
          { startsWith: [], contains: [] },
        );
        const results = [...startsWith, ...contains].slice(0, limit);
        this.cache.set(key, results);
        return results;
      }),
    );
    this.cache.set(key, result$);
    return result$;
  }
}
