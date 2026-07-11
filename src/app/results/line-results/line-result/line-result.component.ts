import { Component, input } from '@angular/core';
import { NgbHighlight } from '@ng-bootstrap/ng-bootstrap';
import { TypeaheadLineResult } from '@app/shared/models/typeahead-result.model';

@Component({
  selector: 'app-line-result',
  templateUrl: './line-result.component.html',
  styleUrl: './line-result.component.scss',
  imports: [NgbHighlight],
})
export class LineResultComponent {
  readonly result = input.required<TypeaheadLineResult>();
  readonly term = input.required<string>();
}
