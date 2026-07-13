import { Component, inject, Signal } from '@angular/core';
import { Router, ROUTER_OUTLET_DATA } from '@angular/router';
import { SearchTermService } from '@app/shared/services/search-term.service';
import { AuthorResultComponent } from '@app/results/author-results/result/author-result.component';
import {
  isAuthor,
  isSkeleton,
  isTitle,
  TypeaheadAuthorResult,
  TypeaheadSkeletonResult,
  TypeaheadTitleResult,
} from '@app/shared/models/typeahead-result.model';
import { ListInteractionStateDirective } from '@app/shared/directives/list-interaction-state.directive';
import { ListKeyboardNavDirective } from '@app/shared/directives/list-keyboard-nav.directive';
import { TitleResultComponent } from '@app/results/title-results/result/title-result.component';
import { TitleSkeletonComponent } from '@app/results/title-results/result/title-skeleton.component';
import { ResultsEmptyStateComponent } from '../results-empty-state.component';

@Component({
  selector   : 'app-author-results',
  templateUrl: './author-results.component.html',
  styleUrl   : './author-results.component.scss',
  imports: [
    ListInteractionStateDirective,
    ListKeyboardNavDirective,
    AuthorResultComponent,
    TitleResultComponent,
    TitleSkeletonComponent,
    ResultsEmptyStateComponent,
  ],
  host: {
    class: 'flex-grow-1 minw-0 w-100 px-4 overflow-auto',
  },
})
export class AuthorResultsComponent {
  private readonly router = inject(Router);
  private readonly searchTermService = inject(SearchTermService);
  readonly data = inject<Signal<| { results: (TypeaheadAuthorResult | TypeaheadSkeletonResult)[] | (TypeaheadTitleResult | TypeaheadSkeletonResult)[]; term: string; } | undefined>>(ROUTER_OUTLET_DATA);

  readonly isSkeleton = isSkeleton;
  readonly isAuthor = isAuthor;
  readonly isTitle = isTitle;

  protected authorClick(result: TypeaheadAuthorResult): void {
    this.searchTermService.setExactAuthor(result.name);
    this.router.navigate(['search', 'author']);
  }

  protected openPoem(result: TypeaheadTitleResult): void {
    this.router.navigate(['poem', result.author, result.title]);
  }

}
