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
    await fixture.whenStable();
  });

  it('should have initial state of "search"', () => {
    expect(component.state()).toBe('search');
  });

  it('onSearchData() should set data and navigate to "search" when no exact author match', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    component.onSearchData({
      results: [{ kind: TypeaheadResultKind.author, name: 'Keats' }],
      term: 'kea',
    });
    expect(component.data()?.term).toBe('kea');
    expect(navigateSpy).toHaveBeenCalledWith(['search']);
  });

  it('onSearchData() should call searchTermService.set$.next() when exact author match found', () => {
    const nextSpy = vi.spyOn(searchTermService.set$, 'next');
    component.onSearchData({
      results: [{ kind: TypeaheadResultKind.author, name: 'Keats' }],
      term: 'Keats',
    });
    expect(nextSpy).toHaveBeenCalledWith('Keats');
  });

  it('onSearchData() with exact author match should NOT update data signal', () => {
    component.onSearchData({
      results: [{ kind: TypeaheadResultKind.author, name: 'Keats' }],
      term: 'Keats',
    });
    expect(component.data()).toBeUndefined();
  });

  it('back() should navigate to "search"', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    (component as any).back();
    expect(navigateSpy).toHaveBeenCalledWith(['search']);
  });

  it('back() should call searchTermService.set$.next("") when state is "exact-author"', () => {
    const nextSpy = vi.spyOn(searchTermService.set$, 'next');
    searchTermService.set$.next('Keats');
    fixture.detectChanges();
    (component as any).back();
    expect(nextSpy).toHaveBeenCalledWith('');
  });

  it('resetAll() should clear data signal and navigate to "search"', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    component.onSearchData({
      results: [{ kind: TypeaheadResultKind.title, title: 'Ode', author: 'Keats' }],
      term: 'ode',
    });
    (component as any).resetAll();
    expect(component.data()).toBeUndefined();
    expect(navigateSpy).toHaveBeenCalledWith(['search']);
  });
});
