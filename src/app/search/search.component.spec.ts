import { TestBed, ComponentFixture } from '@angular/core/testing';
import { SearchComponent } from './search.component';
import { SearchBarComponent } from '@app/search/search-bar/search-bar.component';
import { SearchService } from '@app/search/services/search.service';
import { provideRouter, Router } from '@angular/router';
import { SearchTermService } from '@app/shared/services/search-term.service';
import { TypeaheadResultKind } from '@app/shared/models/typeahead-result.model';
import { NEVER } from 'rxjs';
import { vi } from 'vitest';

describe('SearchComponent', () => {
  let fixture: ComponentFixture<SearchComponent>;
  let component: SearchComponent;
  let router: Router;
  let searchTermService: SearchTermService;

  beforeEach(async () => {
    // SearchComponent's template renders <app-search-bar>, which declares
    // `providers: [SearchService]` at component level. Override it before
    // compilation so the real SearchService (and its HTTP calls) are never created.
    await TestBed.configureTestingModule({
      imports: [SearchComponent],
      providers: [provideRouter([])],
    })
    .overrideComponent(SearchBarComponent, {
      set: { providers: [{ provide: SearchService, useValue: { typeahead: () => NEVER } }] },
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    searchTermService = TestBed.inject(SearchTermService);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    await fixture.whenStable();
  });

  // --- initial state ---

  it('should have initial state of "search"', () => {
    expect(component.state()).toBe('search');
  });

  it('hero should be true when data is undefined', () => {
    expect(component.hero()).toBe(true);
  });

  // --- hero signal ---

  it('hero should be false when data is set via onSearchData()', () => {
    component.onSearchData({
      results: [{ kind: TypeaheadResultKind.title, title: 'Ode', author: 'Keats' }],
      term: 'ode',
    });
    expect(component.hero()).toBe(false);
  });

  // --- onSearchData() ---

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

  it('onSearchData() should NOT navigate when state is not "search"', async () => {
    // Drive state to 'exact-author' via term$, then verify no navigation on data update
    searchTermService.setExactAuthor('Keats');
    await fixture.whenStable();
    const navigateSpy = vi.spyOn(router, 'navigate');
    component.onSearchData({
      results: [{ kind: TypeaheadResultKind.title, title: 'Ode', author: 'Keats' }],
      term: 'ode',
    });
    expect(navigateSpy).not.toHaveBeenCalledWith(['search', 'results']);
  });

  // --- back() ---

  it('back() should navigate to ["search", "results"]', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    (component as any).back();
    expect(navigateSpy).toHaveBeenCalledWith(['search', 'results']);
  });

  it('back() in exact-author state should call setTerm() with lastNonExactAuthorTerm', async () => {
    const spy = vi.spyOn(searchTermService, 'setTerm');
    searchTermService.lastNonExactAuthorTerm.set('death');
    searchTermService.setExactAuthor('Keats');
    await fixture.whenStable();
    const expectedTerm = searchTermService.lastNonExactAuthorTerm();
    (component as any).back();
    expect(spy).toHaveBeenCalledWith(expectedTerm);
  });

  it('back() in non-exact-author state should NOT call setTerm()', () => {
    const spy = vi.spyOn(searchTermService, 'setTerm');
    (component as any).back();
    expect(spy).not.toHaveBeenCalled();
  });

  // --- resetAll() ---

  it('resetAll() should clear data signal', () => {
    component.onSearchData({
      results: [{ kind: TypeaheadResultKind.title, title: 'Ode', author: 'Keats' }],
      term: 'ode',
    });
    (component as any).resetAll();
    expect(component.data()).toBeUndefined();
  });

  it('resetAll() should navigate to ["search"]', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    (component as any).resetAll();
    expect(navigateSpy).toHaveBeenCalledWith(['search']);
  });

  it('resetAll() should call setTerm("") to clear the search term', () => {
    const spy = vi.spyOn(searchTermService, 'setTerm');
    (component as any).resetAll();
    expect(spy).toHaveBeenCalledWith('');
  });
});
