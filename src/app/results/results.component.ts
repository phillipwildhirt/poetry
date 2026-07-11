import { Component, inject, Signal } from '@angular/core';
import {
  TypeaheadAuthorResult,
  TypeaheadLineResult,
  TypeaheadResult,
  TypeaheadResultKind,
  TypeaheadSearchKind,
  TypeaheadSectionLabel,
  TypeaheadSkeletonResult,
  TypeaheadTitleResult,
} from '@app/shared/models/typeahead-result.model';
import { SkeletonComponent } from '@app/shared/skeleton/skeleton.component';
import { AuthorResultComponent } from '@app/results/author-results/author-result/author-result.component';
import { LineResultComponent } from '@app/results/line-results/line-result/line-result.component';
import { TitleResultComponent } from '@app/results/title-results/title-result/title-result.component';
import { Router, ROUTER_OUTLET_DATA } from '@angular/router';
import { ListInteractionStateDirective } from '@app/shared/directives/list-interaction-state.directive';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss',
  imports: [
    ListInteractionStateDirective,
    SkeletonComponent,
    AuthorResultComponent,
    LineResultComponent,
    TitleResultComponent
  ],
  host: {
    class: 'flex-grow-1 minw-0 w-100 p-4 overflow-auto',
  },
})
export class ResultsComponent {
  private readonly router = inject(Router);
  readonly data =
    inject<Signal<{ results: TypeaheadResult[]; term: string }>>(
      ROUTER_OUTLET_DATA,
    );

  isAuthor(result: TypeaheadResult): result is TypeaheadAuthorResult {
    return result && result.kind === TypeaheadResultKind.author;
  }

  isTitle(result: TypeaheadResult): result is TypeaheadTitleResult {
    return result && result.kind === TypeaheadResultKind.title;
  }

  isLine(result: TypeaheadResult): result is TypeaheadLineResult {
    return result && result.kind === TypeaheadResultKind.line;
  }

  isSkeleton(result: TypeaheadResult): result is TypeaheadSkeletonResult {
    return result && result.kind === TypeaheadResultKind.skeleton;
  }

  protected searchBySection(sectionLabel: TypeaheadSectionLabel): void {
    const term = this.data()?.term;
    const routeMap: Partial<
      Record<TypeaheadSectionLabel, TypeaheadSearchKind>
    > = {
      [TypeaheadSectionLabel.author]: TypeaheadResultKind.author,
      [TypeaheadSectionLabel.title]: TypeaheadResultKind.title,
      [TypeaheadSectionLabel.line]: TypeaheadResultKind.line,
    };
    const path = routeMap[sectionLabel];
    if (path) {
      this.router.navigate([path], { queryParams: { q: term } });
    }
  }
}
