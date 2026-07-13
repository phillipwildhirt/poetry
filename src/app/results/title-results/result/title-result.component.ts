import { Component, input } from '@angular/core';
import { NgbHighlight } from '@ng-bootstrap/ng-bootstrap';
import { TypeaheadTitleResult } from '@app/shared/models/typeahead-result.model';
import { ListInteractionStateDirective } from '@app/shared/directives/list-interaction-state.directive';
import { SetContextMenuLinkDirective } from '@app/shared/directives/set-context-menu-link.directive';

@Component({
  selector: 'app-title-result',
  imports: [NgbHighlight, ListInteractionStateDirective, SetContextMenuLinkDirective],
  template: `
    <a>
      <div appListInteractionStateDirective
           [appSetContextMenuLink]="'/poem/' + result().author + '/' + result().title">
        <div class="d-block text-truncate mw-100 title"><ngb-highlight [result]="result().title" [term]="term()" /></div>
        @if (result().line) {
          <div class="small opacity-75 poem">{{ result().line }}</div>
        } @else {
          <div class="small opacity-75 author">{{ result().author }}</div>
        }
      </div>
    </a>
  `,
})
export class TitleResultComponent {
  readonly result = input.required<TypeaheadTitleResult>();
  readonly term = input.required<string>();
}
