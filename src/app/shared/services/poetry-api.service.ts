import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { AuthorListResponse, Poem, PoemTitleAuthor } from '@app/shared/models/poetrydb.models';

const BASE_URL = 'https://poetrydb.org';

@Injectable({ providedIn: 'root' })
export class PoetryApiService {
  private readonly http = inject(HttpClient);

  getAuthors(): Observable<AuthorListResponse> {
    return this.http.get<AuthorListResponse>(`${BASE_URL}/author`).pipe(
      map((res) => ('status' in res && res.status === 404 ? {authors: []} : res))
    );
  }

  searchTitles(term: string): Observable<PoemTitleAuthor[]> {
    return this.http.get<PoemTitleAuthor[]>(`${BASE_URL}/title,poemcount/${term};10/title,author`).pipe(
      map(res => 'status' in res && res.status === 404 ? [] : res)
    );
  }

  // authorSearch(term: string): Observable<Poem[]> {
  //   return this.http.get<Poem[]>(`${BASE_URL}/author/${term}`);
  // }

  // titleSearch(term: string): Observable<Poem[]> {
  //   return this.http.get<Poem[]>(`${BASE_URL}/title/${term}`);
  // }
}
