import { Component, computed, inject, Signal } from '@angular/core';
import { TypeaheadLineResult } from '@app/shared/models/typeahead-result.model';
import { ROUTER_OUTLET_DATA } from '@angular/router';
import { SkeletonComponent } from '@app/shared/skeleton/skeleton.component';
import { LineResultComponent } from '@app/results/line-results/line-result/line-result.component';
import { ListInteractionStateDirective } from '@app/shared/directives/list-interaction-state.directive';

@Component({
  selector: 'app-line-results',
  templateUrl: './line-results.component.html',
  styleUrl: './line-results.component.scss',
  imports: [
    SkeletonComponent,
    LineResultComponent,
    ListInteractionStateDirective,
  ],
})
export class LineResultsComponent {
  readonly data = inject<Signal<{ results: TypeaheadLineResult[]; term: string } | undefined>>(ROUTER_OUTLET_DATA);
  readonly skeletonRows = Array.from({ length: 8 });
  readonly loading = computed(() => this.data() === undefined);
}
