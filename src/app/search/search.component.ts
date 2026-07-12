import { Component, inject, input, ViewEncapsulation } from '@angular/core';
import { SearchService } from '@app/search/services/search.service';
import { AppState, TypeaheadResultKind } from '@app/shared/models/typeahead-result.model';
import { TitleSearchService } from '@app/search/services/title-search.service';
import { LineSearchService } from '@app/search/services/line-search.service';
import { merge, startWith, Subject, switchMap, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AuthorSearchService } from '@app/search/services/author-search.service';
import { outputFromObservable, takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { SearchTermService } from '@app/shared/services/search-term.service';


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
  private readonly searchTermService = inject(SearchTermService);
  readonly state = input<AppState>('search');
  readonly form = new FormControl<string>('', { nonNullable: true });
  readonly focus$ = new Subject<string>();

  private readonly source$ = merge(this.form.valueChanges, this.focus$);

  constructor() {
    this.searchTermService.set$.pipe(takeUntilDestroyed()).subscribe((term) => {
      this.form.setValue(term, { emitEvent: false });
    });

    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      if (this.state() === 'exact-author') {
        this.searchTermService.reset$.next();
      }
    });
  }
  readonly data = outputFromObservable(
    toObservable(this.state).pipe(
      tap((state) => console.log(`Searching in ${state} state`)),
      switchMap((state, index) => {
        const trigger$ = index === 0 ? this.source$ : this.source$.pipe(startWith(this.form.value));
        return this.searchService.typeahead(trigger$, state).pipe(
          map((results) => ({ results, term: this.form.value })),
          tap((event) => console.log(event)),
        );
      })
    ),
  );
  protected readonly TypeaheadResultKind = TypeaheadResultKind;
}
