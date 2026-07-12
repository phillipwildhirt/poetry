import { Component, computed, inject, Signal } from '@angular/core';
import { ROUTER_OUTLET_DATA } from '@angular/router';
import { SearchTermService } from '@app/shared/services/search-term.service';
import { AuthorResultComponent } from '@app/results/author-results/author-result/author-result.component';
import {
  isAuthorResults,
  isTitleResults,
  TypeaheadAuthorResult,
  TypeaheadTitleResult,
} from '@app/shared/models/typeahead-result.model';
import { SkeletonComponent } from '@app/shared/skeleton/skeleton.component';
import { ListInteractionStateDirective } from '@app/shared/directives/list-interaction-state.directive';
import { TitleResultComponent } from '@app/results/title-results/title-result/title-result.component';

@Component({
  selector   : 'app-author-results',
  templateUrl: './author-results.component.html',
  styleUrl   : './author-results.component.scss',
  imports    : [
    ListInteractionStateDirective,
    AuthorResultComponent,
    SkeletonComponent,
    TitleResultComponent,
  ],
})
export class AuthorResultsComponent {
  readonly data = inject<Signal<| { results: TypeaheadAuthorResult[] | TypeaheadTitleResult[]; term: string; } | undefined>>(ROUTER_OUTLET_DATA);
  readonly skeletonRows = Array.from({ length: 8 });
  readonly loading = computed(() => this.data() === undefined);

  protected isAuthorResults = isAuthorResults;
  protected isTitleResults = isTitleResults;

  private readonly searchTermService = inject(SearchTermService);

  protected authorClick(result: TypeaheadAuthorResult): void {
    this.searchTermService.set$.next(result.name);
  }

  protected titleClick(result: TypeaheadTitleResult): void {
  }
}
