import { Component, computed, inject, Signal } from '@angular/core';
import { TypeaheadTitleResult } from '@app/shared/models/typeahead-result.model';
import { Router, ROUTER_OUTLET_DATA } from '@angular/router';
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
  host: {
    class: 'flex-grow-1 minw-0 w-100 px-4 overflow-auto',
  },
})
export class TitleResultsComponent {
  private readonly router = inject(Router);
  readonly data = inject<Signal<{ results: TypeaheadTitleResult[]; term: string } | undefined>>(ROUTER_OUTLET_DATA);
  readonly skeletonRows = Array.from({ length: 8 });
  readonly loading = computed(() => this.data() === undefined);

  protected openPoem(result: TypeaheadTitleResult): void {
    this.router.navigate(['poem', result.author, result.title]);
  }
}
