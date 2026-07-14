import { Component, inject, Signal } from '@angular/core';
import { isLine, isSkeleton, TypeaheadLineResult, TypeaheadSkeletonResult } from '@app/shared/models/typeahead-result.model';
import { Router, ROUTER_OUTLET_DATA } from '@angular/router';
import { LineResultComponent } from '@app/results/line-results/result/line-result.component';
import { ListInteractionStateDirective } from '@app/shared/directives/list-interaction-state.directive';
import { ListKeyboardNavDirective } from '@app/shared/directives/list-keyboard-nav.directive';
import { LineSkeletonComponent } from '@app/results/line-results/result/line-skeleton.component';
import { ResultsEmptyStateComponent } from '../results-empty-state.component';

@Component({
  selector: 'app-line-results',
  templateUrl: './line-results.component.html',
  imports: [
    ListInteractionStateDirective,
    ListKeyboardNavDirective,
    LineResultComponent,
    LineSkeletonComponent,
    ResultsEmptyStateComponent
  ],
  host: {
    class: 'flex-grow-1 minw-0 w-100 px-4 overflow-auto',
  },
})
export class LineResultsComponent {
  private readonly router = inject(Router);
  readonly data = inject<Signal<{ results: (TypeaheadLineResult | TypeaheadSkeletonResult)[]; term: string } | undefined>>(ROUTER_OUTLET_DATA);

  readonly isSkeleton = isSkeleton;
  readonly isLine = isLine;

  protected openPoem(result: TypeaheadLineResult): void {
    this.router.navigate(['poem', result.author, result.title]);
  }
}
