import { inject, Injectable } from '@angular/core';
import { catchError, combineLatest, map, merge, Observable, of, startWith, switchMap } from 'rxjs';
import { AppState, TypeaheadResult, TypeaheadResultKind, TypeaheadSectionLabel, TypeaheadSkeletonResult } from '@app/shared/models/typeahead-result.model';
import { PoetryApiService } from '@app/shared/services/poetry-api.service';
import { TitleSearchService } from '@app/search/services/title-search.service';
import { LineSearchService } from '@app/search/services/line-search.service';
import { AuthorSearchService } from './author-search.service';
import { isEmpty } from 'lodash-es';
import { delay } from 'rxjs/operators';

export const SECTION_LIMIT: Record<AppState, number> = {
  search        : 5,
  author        : 100,
  title         : 100,
  line          : 100,
  'exact-author': 100,
  poem          : 1,
};

@Injectable()
export class SearchService {
  private readonly poetryApiService = inject(PoetryApiService);
  private readonly titleSearchService = inject(TitleSearchService);
  private readonly lineSearchService = inject(LineSearchService);
  private readonly authorSearchService = inject(AuthorSearchService);

  private readonly skeletons = (count: number, label: TypeaheadSectionLabel | '' = ''): TypeaheadSkeletonResult[] =>
    Array.from({ length: count }, (_, i) => ({
      kind: TypeaheadResultKind.skeleton,
      ...(i === 0 && !isEmpty(label) ? { sectionLabel: label } : {}),
    }));

  readonly typeahead = (source$: Observable<string>, state: AppState): Observable<TypeaheadResult[]> => {
    const limit = SECTION_LIMIT[state];

    // Title-only: no authors, loading state handled by component, emit results when ready
    if (state === TypeaheadResultKind.title) {
      return source$.pipe(
        switchMap((term) => {
          const normalizedTerm = term.toLowerCase().trim();
          const cached = this.titleSearchService.isCached(term, limit);
          const search$ = cached
            ? this.titleSearchService.search(term, limit)
            : of(term).pipe(delay(500), switchMap(t => this.titleSearchService.search(t, limit)));
          return merge(of(null), search$.pipe(
            map((titles) => titles.filter((t) => t.title.toLowerCase().includes(normalizedTerm))/*.slice(0, limit) */.map((t, i) => ({
                  kind  : TypeaheadResultKind.title,
                  title : t.title,
                  author: t.author,
                  ...(i === 0 ? { sectionLabel: TypeaheadSectionLabel.title } : {}),
                }) satisfies TypeaheadResult,
              ),
            ),
            catchError(() => of([])),
          ));
        }),
        map(titles => titles ?? this.skeletons(limit)),
      );
    }

    // Line-only: no authors, loading state handled by component, emit results when ready
    if (state === TypeaheadResultKind.line) {
      return source$.pipe(
        switchMap((term) => {
          const normalizedTerm = term.toLowerCase().trim();
          if (!normalizedTerm) return of([]);
          const cached = this.lineSearchService.isCached(term, limit);
          const search$ = cached
            ? this.lineSearchService.search(term, limit)
            : of(term).pipe(delay(500), switchMap(t => this.lineSearchService.search(t, limit)));
          return merge(of(null), search$.pipe(
            map((poems) => poems /*.slice(0, limit)*/.map((poem, i) => ({
                  kind  : TypeaheadResultKind.line,
                  title : poem.title,
                  author: poem.author,
                  //todo don't like this
                  line: poem.lines.find((l) => l.toLowerCase().includes(normalizedTerm)) ?? '',
                  ...(i === 0 ? { sectionLabel: TypeaheadSectionLabel.line } : {}),
                }) satisfies TypeaheadResult,
              ),
            ),
            catchError(() => of([])),
          ));
        }),
        map(lines => lines ?? this.skeletons(limit)),
      );
    }

    if (state === 'exact-author') {
      return source$.pipe(
        switchMap((author) => {
          return this.poetryApiService.getAuthorTitles(author).pipe(
            map((titles) => titles.map((t, i) => ({
                  kind : TypeaheadResultKind.title,
                  title: t.title,
                  author,
                  ...(i === 0 ? { sectionLabel: TypeaheadSectionLabel.title } : {}),
                }) satisfies TypeaheadResult,
              ),
            ),
            catchError(() => of([])),
            startWith(null),
          );
        }),
        map(titles => titles ?? this.skeletons(limit)),
      );
    }

    if (state === TypeaheadResultKind.author) {
      return source$.pipe(
        switchMap((term) => {
          return this.authorSearchService.search(term, limit).pipe(
            map((authors) =>
              authors.map((author, i) => ({
                  kind: TypeaheadResultKind.author,
                  name: author,
                  ...(i === 0 ? { sectionLabel: TypeaheadSectionLabel.author } : {}),
                }) satisfies TypeaheadResult,
              ),
            ),
            catchError(() => of([])),
            startWith(null),
          );
        }),
        map(authors => authors ?? this.skeletons(limit)),
      );
    }

    // search state: emit as soon as each section resolves; unresolved sections show 5 skeletons

    return source$.pipe(
      switchMap((term) => {
        const normalizedTerm = term.toLowerCase().trim();

        const authors$ = this.authorSearchService.search(term, limit).pipe(
          map((authors) => authors.map((author, i) => ({
            kind: TypeaheadResultKind.author,
            name: author,
            ...(i === 0
                ? { sectionLabel: TypeaheadSectionLabel.author }
                : i === 4
                  ? { more: TypeaheadSectionLabel.author }
                  : {}),
          }) satisfies TypeaheadResult)),
          catchError(() => of([] as TypeaheadResult[])),
          startWith(null),
        );

        const titles$ = normalizedTerm
                        ? merge(of(null), (this.titleSearchService.isCached(term, limit)
                            ? this.titleSearchService.search(term, limit)
                            : of(term).pipe(delay(500), switchMap(t => this.titleSearchService.search(t, limit)))
                          ).pipe(
                            map((titles) => titles.filter((t) => t.title.toLowerCase().includes(normalizedTerm)).map((t, i) => ({
                              kind  : TypeaheadResultKind.title,
                              title : t.title,
                              author: t.author,
                              ...(i === 0
                                  ? { sectionLabel: TypeaheadSectionLabel.title }
                                  : i === 4
                                    ? { more: TypeaheadSectionLabel.title }
                                    : {}),
                            }) satisfies TypeaheadResult)),
                            catchError(() => of([] as TypeaheadResult[])),
                          ))
                        : of([]);

        const lines$ = normalizedTerm
                       ? merge(of(null), (this.lineSearchService.isCached(term, limit)
                           ? this.lineSearchService.search(term, limit)
                           : of(term).pipe(delay(500), switchMap(t => this.lineSearchService.search(t, limit)))
                         ).pipe(
                           map((poems) => poems.map((poem, i) => ({
                             kind  : TypeaheadResultKind.line,
                             title : poem.title,
                             author: poem.author,
                             line  : poem.lines.find((l) => l.toLowerCase().includes(normalizedTerm)) ?? '',
                             ...(i === 0
                                 ? { sectionLabel: TypeaheadSectionLabel.line }
                                 : i === 4
                                   ? { more: TypeaheadSectionLabel.line }
                                   : {}),
                           }) satisfies TypeaheadResult)),
                           catchError(() => of([] as TypeaheadResult[])),
                         ))
                       : of([]);

        return combineLatest([authors$, titles$, lines$]).pipe(
          map(([authors, titles, lines]) => [
            ...(authors ?? this.skeletons(limit, TypeaheadSectionLabel.author)),
            ...(titles ?? this.skeletons(limit, TypeaheadSectionLabel.title)),
            ...(lines ?? this.skeletons(limit, TypeaheadSectionLabel.line)),
          ])
        );
      }),
    );
  };
}
