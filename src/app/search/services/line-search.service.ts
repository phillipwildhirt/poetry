import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, shareReplay, tap } from 'rxjs';
import { PoetryApiService } from '@app/shared/services/poetry-api.service';
import { Poem } from '@app/shared/models/poetrydb.models';

@Injectable({providedIn: 'root'  })
export class LineSearchService {
  private readonly poetryApiService = inject(PoetryApiService);

  private readonly cache = new Map<string, Poem[] | Observable<Poem[]>>();

  search(term: string, limit = 10): Observable<Poem[]> {
    const key = `${term}:${limit}`;
    const stored = this.cache.get(key);
    if (stored instanceof Array) return of(stored);
    if (stored !== undefined) return stored;

    const result$ = this.poetryApiService.searchLines(term, limit).pipe(
      map(response => Array.isArray(response) ? response : []),
      tap(v => this.cache.set(key, v)),
      catchError(() => of([])),
      shareReplay(1),
    );
    this.cache.set(key, result$);
    return result$;
  }
}
