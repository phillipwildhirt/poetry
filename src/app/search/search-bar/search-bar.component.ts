import { Component, computed, inject, input, ViewEncapsulation } from '@angular/core';
import { SearchService } from '@app/search/services/search.service';
import { AppState, kindSectionLabelMap, TypeaheadResultKind, typeaheadSectionLabelSingular } from '@app/shared/models/typeahead-result.model';
import { merge, startWith, Subject, switchMap, withLatestFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { outputFromObservable, takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { SearchTermService } from '@app/shared/services/search-term.service';


@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  imports: [ReactiveFormsModule],
  providers: [SearchService],
  encapsulation: ViewEncapsulation.None,
})
export class SearchBarComponent {
  private readonly searchService = inject(SearchService);
  private readonly searchTermService = inject(SearchTermService);
  readonly state = input<AppState>('search');
  readonly form = new FormControl<string>('', { nonNullable: true });
  readonly focus$ = new Subject<string>();
  private readonly source$ = merge(this.form.valueChanges, this.focus$);

  protected readonly kindSectionLabelMap = kindSectionLabelMap;
  protected readonly typeaheadSectionLabelSingular = typeaheadSectionLabelSingular;

  readonly searchLabel = computed<string>(() => {
    switch (this.state()) {
      case TypeaheadResultKind.author: return 'Search by author';
      case TypeaheadResultKind.title:  return 'Search by title';
      case TypeaheadResultKind.line:   return 'Search by poem text';
      default:                         return 'Search by author, title, or poem text';
    }
  });

  constructor() {
    this.searchTermService.term$.pipe(takeUntilDestroyed()).subscribe(({ term, exactAuthor }) => {
      this.form.setValue(term, { emitEvent: false });
      this.searchTermService.lastTerm.set(term);
      if (!exactAuthor) {
        this.searchTermService.lastNonExactAuthorTerm.set(term);
      }
    });

    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe((term) => {
      this.searchTermService.lastTerm.set(term);
      if (this.state() === 'exact-author') {
        this.searchTermService.reset$.next();
      } else {
        this.searchTermService.lastNonExactAuthorTerm.set(term);
      }
    });
  }
  readonly data = outputFromObservable(
    toObservable(this.state).pipe(
      withLatestFrom(this.searchTermService.shouldOverrideIndex$),
      switchMap(([state, shouldOverride], index) => {
        const trigger$ = (index === 0 && !shouldOverride) ? this.source$ : this.source$.pipe(startWith(this.form.value));
        return this.searchService.typeahead(trigger$, state).pipe(
          map((results) => ({ results, term: this.form.value })),
        );
      })
    ),
  );
}
