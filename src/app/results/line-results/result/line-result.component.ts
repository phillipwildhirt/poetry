import { Component, input } from '@angular/core';
import { NgbHighlight } from '@ng-bootstrap/ng-bootstrap';
import { TypeaheadLineResult } from '@app/shared/models/typeahead-result.model';
import { SetContextMenuLinkDirective } from '@app/shared/directives/set-context-menu-link.directive';

@Component({
  selector: 'app-line-result',
  imports: [NgbHighlight, SetContextMenuLinkDirective],
  template: `
    <a>
      <div [appSetContextMenuLink]="'/poem/' + result().author + '/' + result().title">
        <div class="d-block text-truncate mw-100 opacity-75 mb-1 small"><span class="title">{{ result().title }}</span> — <span class="author">{{ result().author }}</span></div>
        <div class="d-block text-truncate mw-100 poem"><ngb-highlight [result]="result().line" [term]="term()" /></div>
      </div>
    </a>
  `,
})
export class LineResultComponent {
  readonly result = input.required<TypeaheadLineResult>();
  readonly term = input.required<string>();
}
