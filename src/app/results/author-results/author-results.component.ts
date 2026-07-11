import { Component, computed, inject, Signal } from '@angular/core';
import { ROUTER_OUTLET_DATA } from '@angular/router';
import { AuthorResultComponent } from '@app/results/author-results/author-result/author-result.component';
import { TypeaheadAuthorResult } from '@app/shared/models/typeahead-result.model';
import { SkeletonComponent } from '@app/shared/skeleton/skeleton.component';
import { ListInteractionStateDirective } from '@app/shared/directives/list-interaction-state.directive';

@Component({
  selector: 'app-author-results',
  templateUrl: './author-results.component.html',
  styleUrl: './author-results.component.scss',
  imports: [
    AuthorResultComponent,
    SkeletonComponent,
    ListInteractionStateDirective,
  ],
})
export class AuthorResultsComponent {
  readonly data =
    inject<
      Signal<{ results: TypeaheadAuthorResult[]; term: string } | undefined>
    >(ROUTER_OUTLET_DATA);
  readonly skeletonRows = Array.from({ length: 8 });
  readonly loading = computed(() => this.data() === undefined);
}
