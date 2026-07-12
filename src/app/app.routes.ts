import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'search', loadComponent: () => import('./search/search.component').then((c) => c.SearchComponent), children: [
      { path: 'results', loadComponent: () => import('./results/results.component').then((c) => c.ResultsComponent) },
      { path: 'author', loadComponent: () => import('./results/author-results/author-results.component').then((c) => c.AuthorResultsComponent) },
      { path: 'title', loadComponent: () => import('./results/title-results/title-results.component').then((c) => c.TitleResultsComponent) },
      { path: 'line', loadComponent: () => import('./results/line-results/line-results.component').then((c) => c.LineResultsComponent) },
    ],
  },
  { path: 'poem/:author/:title', loadComponent: () => import('./poem/poem.component').then((c) => c.PoemComponent) },
  { path: '**', redirectTo: 'search' },
];
