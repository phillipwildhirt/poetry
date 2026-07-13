import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject, timer } from 'rxjs';

export interface SearchTermEvent {
  term: string;
  exactAuthor: boolean;
}

@Injectable({ providedIn: 'root' })
export class SearchTermService {
  readonly term$ = new ReplaySubject<SearchTermEvent>(1);
  readonly reset$ = new Subject<void>();
  readonly lastTerm = signal<string>('');
  readonly lastNonExactAuthorTerm = signal<string>('');

  private readonly _overrideIndex$ = new BehaviorSubject<boolean>(false);
  readonly shouldOverrideIndex$ = this._overrideIndex$.asObservable();

  setTerm(term: string): void {
    this.term$.next({ term, exactAuthor: false });
  }

  setExactAuthor(author: string): void {
    this.term$.next({ term: author, exactAuthor: true });
  }

  overrideIndex(): void {
    this._overrideIndex$.next(true);
    timer(300).subscribe(() => this._overrideIndex$.next(false));
  }
}
