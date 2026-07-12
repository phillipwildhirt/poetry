import { Component, input } from '@angular/core';
import { NgbHighlight } from '@ng-bootstrap/ng-bootstrap';
import { TypeaheadTitleResult } from '@app/shared/models/typeahead-result.model';

@Component({
  selector: 'app-title-result',
  imports: [NgbHighlight],
  template: `
    <div class="">
      <div class="d-block text-truncate mw-100 title"><ngb-highlight [result]="result().title" [term]="term()" /></div>
      @if (result().line) {
        <div class="small opacity-75 poem">{{ result().line }}</div>
      } @else {
        <div class="small opacity-75 author">{{ result().author }}</div>
      }
    </div>
  `,
})
export class TitleResultComponent {
  readonly result = input.required<TypeaheadTitleResult>();
  readonly term = input.required<string>();
}
