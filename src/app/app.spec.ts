import { TestBed, ComponentFixture } from '@angular/core/testing';
import { App } from './app';
import { provideRouter, Router } from '@angular/router';
import { SearchTermService } from '@app/shared/services/search-term.service';
import { TypeaheadResultKind } from '@app/shared/models/typeahead-result.model';
import { vi } from 'vitest';

describe('App', () => {
  let fixture: ComponentFixture<App>;
  let app: App;
  let router: Router;
  let searchTermService: SearchTermService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    app = fixture.componentInstance;
    router = TestBed.inject(Router);
    searchTermService = TestBed.inject(SearchTermService);
    await fixture.whenStable();
  });

  it('should have initial state of "search"', () => {
    expect(app.state()).toBe('search');
  });

  it('onSearchData() should set data and navigate to "search" when no exact author match', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    app.onSearchData({
      results: [{ kind: TypeaheadResultKind.author, name: 'Keats' }],
      term: 'kea',
    });
    expect(app.data()?.term).toBe('kea');
    expect(navigateSpy).toHaveBeenCalledWith(['search']);
  });

  it('onSearchData() should call searchTermService.set$.next() when exact author match found', () => {
    const nextSpy = vi.spyOn(searchTermService.set$, 'next');
    app.onSearchData({
      results: [{ kind: TypeaheadResultKind.author, name: 'Keats' }],
      term: 'Keats',
    });
    expect(nextSpy).toHaveBeenCalledWith('Keats');
  });

  it('onSearchData() with exact author match should NOT update data signal', () => {
    app.onSearchData({
      results: [{ kind: TypeaheadResultKind.author, name: 'Keats' }],
      term: 'Keats',
    });
    expect(app.data()).toBeUndefined();
  });

  it('back() should navigate to ".."', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    (app as any).back();
    expect(navigateSpy).toHaveBeenCalledWith(['..']);
  });

  it('back() should call searchTermService.set$.next("") when state is "exact-author"', () => {
    const nextSpy = vi.spyOn(searchTermService.set$, 'next');
    searchTermService.set$.next('Keats');
    fixture.detectChanges();
    (app as any).back();
    expect(nextSpy).toHaveBeenCalledWith('');
  });

  it('resetAll() should clear data signal and navigate to ".."', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    app.onSearchData({
      results: [{ kind: TypeaheadResultKind.title, title: 'Ode', author: 'Keats' }],
      term: 'ode',
    });
    (app as any).resetAll();
    expect(app.data()).toBeUndefined();
    expect(navigateSpy).toHaveBeenCalledWith(['..']);
  });
});
