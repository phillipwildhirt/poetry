import { Component, computed, inject, Signal } from '@angular/core';
import { TypeaheadTitleResult } from '@app/shared/models/typeahead-result.model';
import { ROUTER_OUTLET_DATA } from '@angular/router';
import { SkeletonComponent } from '@app/shared/skeleton/skeleton.component';
import { TitleResultComponent } from '@app/results/title-results/title-result/title-result.component';
import { ListInteractionStateDirective } from '@app/shared/directives/list-interaction-state.directive';

@Component({
  selector: 'app-title-results',
  templateUrl: './title-results.component.html',
  styleUrl: './title-results.component.scss',
  imports: [
    ListInteractionStateDirective,
    SkeletonComponent,
    TitleResultComponent
  ],
})
export class TitleResultsComponent {
  readonly data = inject<Signal<{ results: TypeaheadTitleResult[]; term: string } | undefined>>(ROUTER_OUTLET_DATA);
  readonly skeletonRows = Array.from({ length: 8 });
  readonly loading = computed(() => this.data() === undefined);
}
