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

  it('searchBySection() should navigate to ["search", "author"] for author section label', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    (component as any).searchBySection(TypeaheadSectionLabel.author);
    expect(navigateSpy).toHaveBeenCalledWith(['search', TypeaheadResultKind.author]);
  });

  it('searchBySection() should navigate to ["search", "title"] for title section label', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    (component as any).searchBySection(TypeaheadSectionLabel.title);
    expect(navigateSpy).toHaveBeenCalledWith(['search', TypeaheadResultKind.title]);
  });

  it('searchBySection() should navigate to ["search", "line"] for line section label', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    (component as any).searchBySection(TypeaheadSectionLabel.line);
    expect(navigateSpy).toHaveBeenCalledWith(['search', TypeaheadResultKind.line]);
  });

  it('resultClick() with an author result should call setExactAuthor() and navigate to ["search", "author"]', () => {
    const spy = vi.spyOn(searchTermService, 'setExactAuthor');
    const navigateSpy = vi.spyOn(router, 'navigate');
    (component as any).resultClick({ kind: TypeaheadResultKind.author, name: 'Keats' });
    expect(spy).toHaveBeenCalledWith('Keats');
    expect(navigateSpy).toHaveBeenCalledWith(['search', 'author']);
  });

  it('resultClick() with a title result should navigate to ["./poem", author, title]', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    (component as any).resultClick({ kind: TypeaheadResultKind.title, title: 'Ode to Autumn', author: 'Keats' });
    expect(navigateSpy).toHaveBeenCalledWith(['./poem', 'Keats', 'Ode to Autumn']);
  });

  it('resultClick() with a line result should navigate to ["./poem", author, title]', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    (component as any).resultClick({ kind: TypeaheadResultKind.line, title: 'Ode to Autumn', author: 'Keats', line: 'Season of mists' });
    expect(navigateSpy).toHaveBeenCalledWith(['./poem', 'Keats', 'Ode to Autumn']);
  });
});
