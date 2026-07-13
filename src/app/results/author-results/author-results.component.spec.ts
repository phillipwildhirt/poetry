import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthorResultsComponent } from './author-results.component';
import { provideRouter, Router, ROUTER_OUTLET_DATA } from '@angular/router';
import { SearchTermService } from '@app/shared/services/search-term.service';
import { signal } from '@angular/core';
import { TypeaheadResultKind } from '@app/shared/models/typeahead-result.model';
import { vi } from 'vitest';

describe('AuthorResultsComponent', () => {
  let component: AuthorResultsComponent;
  let fixture: ComponentFixture<AuthorResultsComponent>;
  let searchTermService: SearchTermService;
  let router: Router;

  const dataSignal = signal<{ results: any[]; term: string } | undefined>(undefined);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorResultsComponent],
      providers: [
        provideRouter([]),
        { provide: ROUTER_OUTLET_DATA, useValue: dataSignal },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthorResultsComponent);
    component = fixture.componentInstance;
    searchTermService = TestBed.inject(SearchTermService);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    await fixture.whenStable();
  });

  it('authorClick() should call setExactAuthor() with the author name', () => {
    const spy = vi.spyOn(searchTermService, 'setExactAuthor');
    (component as any).authorClick({ kind: TypeaheadResultKind.author, name: 'Keats' });
    expect(spy).toHaveBeenCalledWith('Keats');
  });

  it('authorClick() should navigate to ["search", "author"]', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    (component as any).authorClick({ kind: TypeaheadResultKind.author, name: 'Keats' });
    expect(navigateSpy).toHaveBeenCalledWith(['search', 'author']);
  });

  it('openPoem() should navigate to ["poem", author, title]', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    (component as any).openPoem({ kind: TypeaheadResultKind.title, title: 'Ode to Autumn', author: 'Keats' });
    expect(navigateSpy).toHaveBeenCalledWith(['poem', 'Keats', 'Ode to Autumn']);
  });
});
