import { Component, inject, ViewEncapsulation } from '@angular/core';
import { SearchService } from '@app/search/search.service';
import { NgbHighlight, NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { SkeletonComponent } from '@app/shared/skeleton/skeleton.component';
import { merge, Observable, Subject } from 'rxjs';
import { TypeaheadAuthorResult, TypeaheadResult, TypeaheadResultKind, TypeaheadSkeletonResult, TypeaheadTitleResult } from '@app/shared/models/typeahead-result.model';

export interface TypeaheadResultContext {
  result: TypeaheadResult;
  term: string;
}

@Component({
  selector: 'app-search',
  imports: [NgbTypeahead, SkeletonComponent, NgbHighlight],
  templateUrl: './search.html',
  styleUrl: './search.scss',
  providers: [SearchService],
  encapsulation: ViewEncapsulation.None,
})
export class Search {
  private readonly searchService = inject(SearchService);

  readonly focus$ = new Subject<string>();

  protected typeahead = (source$: Observable<string>) => this.searchService.typeahead(merge(source$, this.focus$));

  static ngTemplateContextGuard(_dir: Search, ctx: unknown): ctx is TypeaheadResultContext {
    return true;
  }

  isAuthor(result: TypeaheadResult): result is TypeaheadAuthorResult {
    return result && result.kind === TypeaheadResultKind.author;
  }

  isTitle(result: TypeaheadResult): result is TypeaheadTitleResult {
    return result && result.kind === TypeaheadResultKind.title;
  }

  isSkeleton(result: TypeaheadResult): result is TypeaheadSkeletonResult {
    return result && result.kind === TypeaheadResultKind.skeleton;
  }
}
