import { inject, Injectable } from '@angular/core';
import { catchError, combineLatest, map, Observable, of, startWith, switchMap, take, tap } from 'rxjs';
import { AppState, TypeaheadResult, TypeaheadResultKind, TypeaheadSectionLabel, TypeaheadSkeletonResult } from '@app/shared/models/typeahead-result.model';
import { PoetryApiService } from '@app/shared/services/poetry-api.service';
import { TitleSearchService } from '@app/search/services/title-search.service';
import { LineSearchService } from '@app/search/services/line-search.service';
import { AuthorSearchService } from './author-search.service';

export const SECTION_LIMIT: Record<AppState, number> = {
  search: 5,
  author: 100,
  title: 100,
  line: 100,
  'exact-author': 100,
  poem: 1,
};

@Injectable()
export class SearchService {
  private readonly poetryApiService = inject(PoetryApiService);
  private readonly titleSearchService = inject(TitleSearchService);
  private readonly lineSearchService = inject(LineSearchService);
  private readonly authorSearchService = inject(AuthorSearchService);

  private readonly skeletons = (count: number, label: TypeaheadSectionLabel): TypeaheadSkeletonResult[] =>
    Array.from({ length: count }, (_, i) => ({
      kind: TypeaheadResultKind.skeleton,
      ...(i === 0 ? { sectionLabel: label } : {}),
    }));

  readonly typeahead = (source$: Observable<string>, state: AppState): Observable<TypeaheadResult[]> => {
    source$.pipe(take(1)).subscribe((term) => console.log(term, state));
    const limit = SECTION_LIMIT[state];

    // Title-only: no authors, loading state handled by component, emit results when ready
    if (state === TypeaheadResultKind.title) {
      return source$.pipe(
        switchMap((term) => {
          const normalizedTerm = term.toLowerCase().trim();
          return this.titleSearchService.search(term, limit).pipe(
            map((titles) =>
              titles
                .filter((t) => t.title.toLowerCase().includes(normalizedTerm))
                // .slice(0, limit)
                .map(
                  (t, i) =>
                    ({
                      kind: TypeaheadResultKind.title,
                      title: t.title,
                      author: t.author,
                      ...(i === 0 ? { sectionLabel: TypeaheadSectionLabel.title } : {}),
                    }) satisfies TypeaheadResult,
                ),
            ),
            catchError(() => of([])),
          );
        }),
      );
    }

    // Line-only: no authors, loading state handled by component, emit results when ready
    if (state === TypeaheadResultKind.line) {
      return source$.pipe(
        switchMap((term) => {
          const normalizedTerm = term.toLowerCase().trim();
          if (!normalizedTerm) return of([]);
          return this.lineSearchService.search(term, limit).pipe(
            map((poems) =>
              poems /*.slice(0, limit)*/
                .map(
                  (poem, i) =>
                    ({
                      kind: TypeaheadResultKind.line,
                      title: poem.title,
                      author: poem.author,
                      //todo don't like this
                      line: poem.lines.find((l) => l.toLowerCase().includes(normalizedTerm)) ?? '',
                      ...(i === 0 ? { sectionLabel: TypeaheadSectionLabel.line } : {}),
                    }) satisfies TypeaheadResult,
                ),
            ),
            catchError(() => of([])),
          );
        }),
      );
    }

    if (state === 'exact-author') {
      return source$.pipe(
        switchMap((author) =>
          this.poetryApiService.getAuthorTitles(author).pipe(
            map((titles) =>
              titles.map(
                (t, i) =>
                  ({
                    kind: TypeaheadResultKind.title,
                    title: t.title,
                    author,
                    ...(i === 0 ? { sectionLabel: TypeaheadSectionLabel.title } : {}),
                  }) satisfies TypeaheadResult,
              ),
            ),
            catchError(() => of([])),
          ),
        ),
      );
    }

    if (state === TypeaheadResultKind.author) {
      return source$.pipe(
        switchMap((term) => {
          return this.authorSearchService.search(term, limit).pipe(
            map((authors) =>
              authors.map(
                (author, i) =>
                  ({
                    kind: TypeaheadResultKind.author,
                    name: author,
                    ...(i === 0 ? { sectionLabel: TypeaheadSectionLabel.author } : {}),
                  }) satisfies TypeaheadResult,
              ),
            ),
            catchError(() => of([])),
          );
        }),
      );
    }

    // search state: emit as soon as each section resolves; unresolved sections show 5 skeletons

    return source$.pipe(
      switchMap((term) => {
        const normalizedTerm = term.toLowerCase().trim();

        const authors$ = this.authorSearchService.search(term, limit).pipe(
          map((authors) =>
            authors.map(
              (author, i) =>
                ({
                  kind: TypeaheadResultKind.author,
                  name: author,
                  ...(i === 0 ? { sectionLabel: TypeaheadSectionLabel.author } : {}),
                }) satisfies TypeaheadResult,
            ),
          ),
          catchError(() => of([] as TypeaheadResult[])),
          startWith(null),
        );

        const titles$ = normalizedTerm
          ? this.titleSearchService.search(term, limit).pipe(
              map((titles) =>
                titles
                  .filter((t) => t.title.toLowerCase().includes(normalizedTerm))
                  .map(
                    (t, i) =>
                      ({
                        kind: TypeaheadResultKind.title,
                        title: t.title,
                        author: t.author,
                        ...(i === 0 ? { sectionLabel: TypeaheadSectionLabel.title } : {}),
                      }) satisfies TypeaheadResult,
                  ),
              ),
              catchError(() => of([] as TypeaheadResult[])),
              startWith(null),
            )
          : of([]);

        const lines$ = normalizedTerm
          ? this.lineSearchService.search(term, limit).pipe(
              map((poems) =>
                poems.map(
                  (poem, i) =>
                    ({
                      kind: TypeaheadResultKind.line,
                      title: poem.title,
                      author: poem.author,
                      line: poem.lines.find((l) => l.toLowerCase().includes(normalizedTerm)) ?? '',
                      ...(i === 0 ? { sectionLabel: TypeaheadSectionLabel.line } : {}),
                    }) satisfies TypeaheadResult,
                ),
              ),
              catchError(() => of([] as TypeaheadResult[])),
              startWith(null),
            )
          : of([]);

        return combineLatest([authors$, titles$, lines$]).pipe(
          tap((v) => console.log(v)),

          map(([authors, titles, lines]) => [
            ...(authors ?? this.skeletons(limit, TypeaheadSectionLabel.author)),
            ...(titles ?? this.skeletons(limit, TypeaheadSectionLabel.title)),
            ...(lines ?? this.skeletons(limit, TypeaheadSectionLabel.line)),
          ]),
          tap((v) => console.log(v)),
        );
      }),
    );
  };
}
