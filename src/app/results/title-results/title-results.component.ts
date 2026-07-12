import { Component, inject, Signal } from '@angular/core';
import { isSkeleton, isTitle, TypeaheadTitleResult, TypeaheadSkeletonResult } from '@app/shared/models/typeahead-result.model';
import { Router, ROUTER_OUTLET_DATA } from '@angular/router';
import { TitleResultComponent } from '@app/results/title-results/result/title-result.component';
import { ListInteractionStateDirective } from '@app/shared/directives/list-interaction-state.directive';
import { TitleSkeletonComponent } from '@app/results/title-results/result/title-skeleton.component';

@Component({
  selector: 'app-title-results',
  templateUrl: './title-results.component.html',
  styleUrl: './title-results.component.scss',
  imports: [
    ListInteractionStateDirective,
    TitleResultComponent,
    TitleSkeletonComponent
  ],
  host: {
    class: 'flex-grow-1 minw-0 w-100 px-4 overflow-auto',
  },
})
export class TitleResultsComponent {
  private readonly router = inject(Router);
  readonly data = inject<Signal<{ results: (TypeaheadTitleResult | TypeaheadSkeletonResult)[]; term: string } | undefined>>(ROUTER_OUTLET_DATA);

  readonly isSkeleton = isSkeleton;
  readonly isTitle = isTitle;

  protected openPoem(result: TypeaheadTitleResult): void {
    this.router.navigate(['poem', result.author, result.title]);
  }
}
