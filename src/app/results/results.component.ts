import { Component, inject, Signal } from '@angular/core';
import {
  isAuthor,
  isLine,
  isSkeleton,
  isTitle,
  sectionLabelRouteMap,
  TypeaheadResult,
  TypeaheadSectionLabel,
} from '@app/shared/models/typeahead-result.model';
import { AuthorResultComponent } from '@app/results/author-results/result/author-result.component';
import { LineResultComponent } from '@app/results/line-results/result/line-result.component';
import { TitleResultComponent } from '@app/results/title-results/result/title-result.component';
import { Router, ROUTER_OUTLET_DATA } from '@angular/router';
import { ListInteractionStateDirective } from '@app/shared/directives/list-interaction-state.directive';
import { ListKeyboardNavDirective } from '@app/shared/directives/list-keyboard-nav.directive';
import { SearchTermService } from '@app/shared/services/search-term.service';
import { isEmpty } from 'lodash-es';
import { TitleSkeletonComponent } from '@app/results/title-results/result/title-skeleton.component';
import { ResultsEmptyStateComponent } from './results-empty-state.component';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss',
  imports: [
    ListInteractionStateDirective,
    ListKeyboardNavDirective,
    AuthorResultComponent,
    LineResultComponent,
    TitleResultComponent,
    TitleSkeletonComponent,
    ResultsEmptyStateComponent
  ],
  host: {
    class: 'flex-grow-1 minw-0 w-100 px-4 overflow-y-scroll',
  }
})
export class ResultsComponent {
  private readonly router = inject(Router);
  private readonly searchTermService = inject(SearchTermService);
  readonly data = inject<Signal<{ results: TypeaheadResult[]; term: string }>>(ROUTER_OUTLET_DATA,);

  readonly isAuthor = isAuthor;
  readonly isTitle = isTitle;
  readonly isLine = isLine;
  readonly isSkeleton = isSkeleton;
  protected readonly isEmpty = isEmpty;

  protected searchBySection(sectionLabel: TypeaheadSectionLabel): void {
    const path = sectionLabelRouteMap[sectionLabel];
    if (path)
      this.router.navigate(['search', path]);
  }

  protected resultClick(result: TypeaheadResult): void {
    if (isAuthor(result)) {
      this.searchTermService.setExactAuthor(result.name);
      this.router.navigate(['search', 'author']);
    } else if ('title' in result) {
      this.router.navigate(['./poem', result.author, result.title]);
    }
  }
}
