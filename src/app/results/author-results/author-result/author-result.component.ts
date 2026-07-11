import { Component, input } from '@angular/core';
import { TypeaheadAuthorResult } from '@app/shared/models/typeahead-result.model';
import { NgbHighlight } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-author-result',
  templateUrl: './author-result.component.html',
  styleUrl: './author-result.component.scss',
  imports: [NgbHighlight],
})
export class AuthorResultComponent {
  readonly result = input.required<TypeaheadAuthorResult>();
  readonly term = input.required<string>();
}
