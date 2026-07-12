import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SearchTermService {
  readonly set$ = new Subject<string>();
  readonly reset$ = new Subject<void>();
}
