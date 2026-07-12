import { Component, input } from '@angular/core';
import { TypeaheadAuthorResult } from '@app/shared/models/typeahead-result.model';
import { NgbHighlight } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-author-result',
  imports: [NgbHighlight],
  template: `
    <i class="bi bi-person-fill me-2"></i><span class="author"><ngb-highlight [result]="result().name" [term]="term()" /></span>
  `,
})
export class AuthorResultComponent {
  readonly result = input.required<TypeaheadAuthorResult>();
  readonly term = input.required<string>();
}
