import { TestBed, ComponentFixture } from '@angular/core/testing';
import { SearchComponent } from './search.component';
import { provideRouter, Router } from '@angular/router';
import { SearchTermService } from '@app/shared/services/search-term.service';
import { TypeaheadResultKind } from '@app/shared/models/typeahead-result.model';
import { vi } from 'vitest';

describe('SearchComponent', () => {
  let fixture: ComponentFixture<SearchComponent>;
  let component: SearchComponent;
  let router: Router;
  let searchTermService: SearchTermService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    searchTermService = TestBed.inject(SearchTermService);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    await fixture.whenStable();
  });

  it('should have initial state of "search"', () => {
    expect(component.state()).toBe('search');
  });

  it('hero should be true when data is undefined', () => {
    expect(component.hero()).toBe(true);
  });

  it('hero should be false when data is set', () => {
    component.onSearchData({
      results: [{ kind: TypeaheadResultKind.title, title: 'Ode', author: 'Keats' }],
      term: 'ode',
    });
    expect(component.hero()).toBe(false);
  });

  it('onSearchData() should set data and navigate to ["search", "results"] when no exact author match', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    component.onSearchData({
      results: [{ kind: TypeaheadResultKind.author, name: 'Keats' }],
      term: 'kea',
    });
    expect(component.data()?.term).toBe('kea');
    expect(navigateSpy).toHaveBeenCalledWith(['search', 'results']);
  });

  it('onSearchData() should call setExactAuthor() when exact author match found', () => {
    const spy = vi.spyOn(searchTermService, 'setExactAuthor');
    component.onSearchData({
      results: [{ kind: TypeaheadResultKind.author, name: 'Keats' }],
      term: 'Keats',
    });
    expect(spy).toHaveBeenCalledWith('Keats');
  });

  it('onSearchData() with exact author match should NOT update data signal', () => {
    component.onSearchData({
      results: [{ kind: TypeaheadResultKind.author, name: 'Keats' }],
      term: 'Keats',
    });
    expect(component.data()).toBeUndefined();
  });

  it('back() should navigate to ["search", "results"]', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    (component as any).back();
    expect(navigateSpy).toHaveBeenCalledWith(['search', 'results']);
  });

  it('back() in exact-author state should call setTerm() with lastNonExactAuthorTerm', () => {
    const spy = vi.spyOn(searchTermService, 'setTerm');
    searchTermService.setExactAuthor('Keats');
    fixture.detectChanges();
    (component as any).back();
    expect(spy).toHaveBeenCalledWith(searchTermService.lastNonExactAuthorTerm());
  });

  it('resetAll() should clear data signal and navigate to ["search"]', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    component.onSearchData({
      results: [{ kind: TypeaheadResultKind.title, title: 'Ode', author: 'Keats' }],
      term: 'ode',
    });
    (component as any).resetAll();
    expect(component.data()).toBeUndefined();
    expect(navigateSpy).toHaveBeenCalledWith(['search']);
  });

  it('resetAll() should call setTerm("") to clear the search term', () => {
    const spy = vi.spyOn(searchTermService, 'setTerm');
    (component as any).resetAll();
    expect(spy).toHaveBeenCalledWith('');
  });
});
