import { Component, inject, input, ViewEncapsulation } from '@angular/core';
import { SearchService } from '@app/search/services/search.service';
import { SearchMode } from '@app/shared/models/typeahead-result.model';
import { TitleSearchService } from '@app/search/services/title-search.service';
import { LineSearchService } from '@app/search/services/line-search.service';
import { merge, skip, startWith, Subject, switchMap, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AuthorSearchService } from '@app/search/services/author-search.service';
import { outputFromObservable, toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  imports: [ReactiveFormsModule],
  providers: [SearchService, AuthorSearchService, TitleSearchService, LineSearchService],
  encapsulation: ViewEncapsulation.None,
})
export class SearchComponent {
  private readonly searchService = inject(SearchService);
  readonly mode = input<SearchMode>('search');
  readonly form = new FormControl<string>('', { nonNullable: true });
  readonly focus$ = new Subject<string>();

  private readonly source$ = merge(this.form.valueChanges, this.focus$);
  private readonly modeChange$ = toObservable(this.mode).pipe(skip(1));
  readonly data = outputFromObservable(
    toObservable(this.mode).pipe(
      tap((mode) => console.log(`Searching in ${mode} mode`)),
      switchMap((mode, index) => {
        const trigger$ = index === 0 ? this.source$ : this.source$.pipe(startWith(this.form.value));
        return this.searchService.typeahead(trigger$, mode).pipe(
          map((results) => ({ results, term: this.form.value })),
          tap((event) => console.log(event)),
        );
      })
    ),
  );
}
