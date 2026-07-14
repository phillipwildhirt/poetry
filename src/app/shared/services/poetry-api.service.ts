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
      map((res) => ('status' in res && res.status === 404 ? { authors: [] } : res))
    );
  }

  searchTitles(term: string, limit = 10): Observable<PoemTitleAuthor[]> {
    return this.http.get<PoemTitleAuthor[]>(`${BASE_URL}/title,poemcount/${term};${limit}/title,author`).pipe(
      map((res) => (Array.isArray(res) ? res : []))
    );
  }

  getAuthorTitles(author: string): Observable<PoemTitleAuthor[]> {
    return this.http.get<Poem[]>(`${BASE_URL}/author,poemcount/${author};100/title,author`).pipe(
      map((res) => (Array.isArray(res) ? res : [])),
    );
  }

  searchLines(term: string, limit = 10): Observable<Poem[]> {
    return this.http.get<Poem[]>(`${BASE_URL}/lines,poemcount/${term};${limit}/title,author,lines`).pipe(
      map((res) => (Array.isArray(res) ? res : []))
    );
  }

  getPoem(author: string, title: string): Observable<Poem> {
    return this.http.get<Poem[]>(`${BASE_URL}/author,title/${author};${title}`).pipe(map(res => res[0]));
  }
}
