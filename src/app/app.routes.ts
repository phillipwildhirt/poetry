import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'search', loadComponent: () => import('./results/results.component').then((c) => c.ResultsComponent) },
  { path: 'author', loadComponent: () => import('./results/author-results/author-results.component').then((c) => c.AuthorResultsComponent) },
  { path: 'title', loadComponent: () => import('./results/title-results/title-results.component').then((c) => c.TitleResultsComponent) },
  { path: 'line', loadComponent: () => import('./results/line-results/line-results.component').then((c) => c.LineResultsComponent) },
];
