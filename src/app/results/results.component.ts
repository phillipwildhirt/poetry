import { Component, inject, Signal } from '@angular/core';
import {
  isAuthor,
  isLine,
  isSkeleton,
  isTitle, TypeaheadAuthorResult,
  TypeaheadResult,
  TypeaheadResultKind,
  TypeaheadSearchKind,
  TypeaheadSectionLabel,
} from '@app/shared/models/typeahead-result.model';
import { SkeletonComponent } from '@app/shared/skeleton/skeleton.component';
import { AuthorResultComponent } from '@app/results/author-results/author-result/author-result.component';
import { LineResultComponent } from '@app/results/line-results/line-result/line-result.component';
import { TitleResultComponent } from '@app/results/title-results/title-result/title-result.component';
import { Router, ROUTER_OUTLET_DATA } from '@angular/router';
import { ListInteractionStateDirective } from '@app/shared/directives/list-interaction-state.directive';
import { SearchTermService } from '@app/shared/services/search-term.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss',
  imports: [
    ListInteractionStateDirective,
    SkeletonComponent,
    AuthorResultComponent,
    LineResultComponent,
    TitleResultComponent,
  ],
  host: {
    class: 'flex-grow-1 minw-0 w-100 px-4 overflow-auto',
  },
})
export class ResultsComponent {
  private readonly router = inject(Router);
  private readonly searchTermService = inject(SearchTermService);
  readonly data = inject<Signal<{ results: TypeaheadResult[]; term: string }>>(ROUTER_OUTLET_DATA,);

  readonly isAuthor = isAuthor;
  readonly isTitle = isTitle;
  readonly isLine = isLine;
  readonly isSkeleton = isSkeleton;

  protected searchBySection(sectionLabel: TypeaheadSectionLabel): void {
    const routeMap: Partial<
      Record<TypeaheadSectionLabel, TypeaheadSearchKind>
    > = {
      [TypeaheadSectionLabel.author]: TypeaheadResultKind.author,
      [TypeaheadSectionLabel.title]: TypeaheadResultKind.title,
      [TypeaheadSectionLabel.line]: TypeaheadResultKind.line,
    };
    const path = routeMap[sectionLabel];
    if (path) {
      this.router.navigate([path]);
    }
  }

  protected resultClick(result: TypeaheadResult): void {
    if (isAuthor(result)) {
      this.searchTermService.set$.next(result.name);
      this.router.navigate(['author']);
    }
  }
}
