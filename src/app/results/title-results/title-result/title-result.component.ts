import { Component, input } from '@angular/core';
import { NgbHighlight } from '@ng-bootstrap/ng-bootstrap';
import { TypeaheadTitleResult } from '@app/shared/models/typeahead-result.model';

@Component({
  selector: 'app-title-result',
  templateUrl: './title-result.component.html',
  styleUrl: './title-result.component.scss',
  imports: [NgbHighlight],
})
export class TitleResultComponent {
  readonly result = input.required<TypeaheadTitleResult>();
  readonly term = input.required<string>();
}
