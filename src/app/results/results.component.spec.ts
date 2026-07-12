import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResultsComponent } from './results.component';
import { provideRouter, Router, ROUTER_OUTLET_DATA } from '@angular/router';
import { SearchTermService } from '@app/shared/services/search-term.service';
import { signal } from '@angular/core';
import { TypeaheadResultKind, TypeaheadSectionLabel } from '@app/shared/models/typeahead-result.model';
import { vi } from 'vitest';

describe('Results', () => {
  let component: ResultsComponent;
  let fixture: ComponentFixture<ResultsComponent>;
  let router: Router;
  let searchTermService: SearchTermService;

  const dataSignal = signal<{ results: any[]; term: string }>({ results: [], term: '' });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultsComponent],
      providers: [
        provideRouter([]),
        { provide: ROUTER_OUTLET_DATA, useValue: dataSignal },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResultsComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    searchTermService = TestBed.inject(SearchTermService);
    await fixture.whenStable();
  });

  it('searchBySection() should navigate to "author" for author section label', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    (component as any).searchBySection(TypeaheadSectionLabel.author);
    expect(navigateSpy).toHaveBeenCalledWith([TypeaheadResultKind.author]);
  });

  it('searchBySection() should navigate to "title" for title section label', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    (component as any).searchBySection(TypeaheadSectionLabel.title);
    expect(navigateSpy).toHaveBeenCalledWith([TypeaheadResultKind.title]);
  });

  it('searchBySection() should navigate to "line" for line section label', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    (component as any).searchBySection(TypeaheadSectionLabel.line);
    expect(navigateSpy).toHaveBeenCalledWith([TypeaheadResultKind.line]);
  });

  it('resultClick() with an author result should set search term and navigate to "author"', () => {
    const nextSpy = vi.spyOn(searchTermService.set$, 'next');
    const navigateSpy = vi.spyOn(router, 'navigate');
    (component as any).resultClick({ kind: TypeaheadResultKind.author, name: 'Keats' });
    expect(nextSpy).toHaveBeenCalledWith('Keats');
    expect(navigateSpy).toHaveBeenCalledWith(['author']);
  });

  it('resultClick() with a non-author result should not navigate', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    (component as any).resultClick({ kind: TypeaheadResultKind.title, title: 'Ode', author: 'Keats' });
    expect(navigateSpy).not.toHaveBeenCalled();
  });
});
