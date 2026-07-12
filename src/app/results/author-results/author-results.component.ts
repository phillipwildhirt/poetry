import { Component, computed, inject, Signal } from '@angular/core';
import { Router, ROUTER_OUTLET_DATA } from '@angular/router';
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
  host: {
    class: 'flex-grow-1 minw-0 w-100 px-4 overflow-auto',
  },
})
export class AuthorResultsComponent {
  private readonly router = inject(Router);
  private readonly searchTermService = inject(SearchTermService);
  readonly data = inject<Signal<| { results: TypeaheadAuthorResult[] | TypeaheadTitleResult[]; term: string; } | undefined>>(ROUTER_OUTLET_DATA);
  readonly skeletonRows = Array.from({ length: 8 });
  readonly loading = computed(() => this.data() === undefined);

  protected isAuthorResults = isAuthorResults;
  protected isTitleResults = isTitleResults;

  protected authorClick(result: TypeaheadAuthorResult): void {
    this.searchTermService.set$.next(result.name);
  }

  protected openPoem(result: TypeaheadTitleResult): void {
    this.router.navigate(['poem', result.author, result.title]);
  }
}
