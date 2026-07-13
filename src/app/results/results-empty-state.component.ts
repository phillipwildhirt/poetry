import { Component, inject, input } from '@angular/core';
import { isEmpty } from 'lodash-es';
import { TypeaheadResult } from '@app/shared/models/typeahead-result.model';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-results-empty-state',
  template: `
      <div class="text-center py-8" role="status" aria-live="polite">
        @if (isEmpty(data().term)) {
          <div class="h5 text-danger"><i class="bi-emoji-frown-fill pe-2" aria-hidden="true"></i>The&nbsp;verse has gone&nbsp;silent.</div>
          <div class="text-body-secondary">Our connection to the Verse Vault seems to have been severed—even the muse has no&nbsp;words.</div>
        } @else {
          <div class="h5 text-body-secondary pb-1"><i class="bi-search pe-2" aria-hidden="true"></i>No&nbsp;{{ isAuthorRoute() ? 'authors' : 'poems' }} answered the&nbsp;call.</div>
          <div class="text-body-secondary fst-italic">"{{ data().term }}" echoes unanswered through the poetry&nbsp;vault. Try a different search&nbsp;term.</div>
        }
      </div>
  `,
})
export class ResultsEmptyStateComponent {
  private readonly router = inject(Router);

  readonly data = input.required<{ results: (TypeaheadResult)[]; term: string }>();
  protected readonly isEmpty = isEmpty;

  protected readonly isAuthorRoute = toSignal(
    this.router.events.pipe(map(() => this.router.url.includes('/author'))),
    { initialValue: this.router.url.includes('/author') }
  );
}
