import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, shareReplay, tap } from 'rxjs';
import { PoetryApiService } from '@app/shared/services/poetry-api.service';
import { PoemTitleAuthor } from '@app/shared/models/poetrydb.models';

@Injectable()
export class TitleSearchService {
  private readonly poetryApiService = inject(PoetryApiService);

  private readonly cache = new Map<string, PoemTitleAuthor[] | Observable<PoemTitleAuthor[]>>();

  search(term: string, limit = 10): Observable<PoemTitleAuthor[]> {
    const key = `${term}:${limit}`;
    const stored = this.cache.get(key);
    if (stored instanceof Array) return of(stored);
    if (stored !== undefined) return stored;

    const result$ = this.poetryApiService.searchTitles(term, limit).pipe(
      map(response => Array.isArray(response) ? response : []),
      tap(v => this.cache.set(key, v)),
      catchError(() => of([])),
      shareReplay(1),
    );
    this.cache.set(key, result$);
    return result$;
  }
}
