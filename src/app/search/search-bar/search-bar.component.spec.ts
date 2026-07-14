import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchBarComponent } from './search-bar.component';
import { SearchService } from '@app/search/services/search.service';
import { SearchTermService } from '@app/shared/services/search-term.service';
import { provideRouter } from '@angular/router';
import { ComponentRef } from '@angular/core';
import { NEVER } from 'rxjs';
import { vi } from 'vitest';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;
  let componentRef: ComponentRef<SearchBarComponent>;
  let searchTermService: SearchTermService;

  beforeEach(async () => {
    // SearchBarComponent declares `providers: [SearchService]` in @Component, which creates
    // a component-level injector that bypasses TestBed providers entirely.
    // overrideComponent replaces that providers array before compilation so no HTTP calls are made.
    await TestBed.configureTestingModule({
      imports: [SearchBarComponent],
      providers: [provideRouter([])],
    })
    .overrideComponent(SearchBarComponent, {
      set: { providers: [{ provide: SearchService, useValue: { typeahead: () => NEVER } }] },
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchBarComponent);
    componentRef = fixture.componentRef;
    component = fixture.componentInstance;
    searchTermService = TestBed.inject(SearchTermService);
    await fixture.whenStable();
  });

  // --- initial state ---

  it('should have empty form value by default', () => {
    expect(component.form.value).toBe('');
  });

  // --- term$ subscription: form value ---

  it('should update form value when searchTermService emits a non-exact term', async () => {
    searchTermService.setTerm('Keats');
    await fixture.whenStable();
    expect(component.form.value).toBe('Keats');
  });

  it('should update form value when searchTermService emits an exact author', async () => {
    searchTermService.setExactAuthor('Keats');
    await fixture.whenStable();
    expect(component.form.value).toBe('Keats');
  });

  // --- term$ subscription: signal side-effects ---

  it('setTerm() should update lastNonExactAuthorTerm signal', async () => {
    searchTermService.setTerm('death');
    await fixture.whenStable();
    expect(searchTermService.lastNonExactAuthorTerm()).toBe('death');
  });

  it('setExactAuthor() should NOT update lastNonExactAuthorTerm signal', async () => {
    searchTermService.lastNonExactAuthorTerm.set('death');
    searchTermService.setExactAuthor('Keats');
    await fixture.whenStable();
    expect(searchTermService.lastNonExactAuthorTerm()).toBe('death');
  });

  it('setTerm() should update lastTerm signal', async () => {
    searchTermService.setTerm('autumn');
    await fixture.whenStable();
    expect(searchTermService.lastTerm()).toBe('autumn');
  });

  // --- form.valueChanges subscription ---

  it('form value change should update lastTerm signal', () => {
    component.form.setValue('ode');
    expect(searchTermService.lastTerm()).toBe('ode');
  });

  it('form value change in exact-author state should call reset$.next()', () => {
    componentRef.setInput('state', 'exact-author');
    const resetSpy = vi.spyOn(searchTermService.reset$, 'next');
    component.form.setValue('something');
    expect(resetSpy).toHaveBeenCalled();
  });

  it('form value change in search state should NOT call reset$.next()', () => {
    componentRef.setInput('state', 'search');
    const resetSpy = vi.spyOn(searchTermService.reset$, 'next');
    component.form.setValue('something');
    expect(resetSpy).not.toHaveBeenCalled();
  });

  it('form value change in search state should update lastNonExactAuthorTerm', () => {
    componentRef.setInput('state', 'search');
    component.form.setValue('season');
    expect(searchTermService.lastNonExactAuthorTerm()).toBe('season');
  });

  it('form value change in exact-author state should NOT update lastNonExactAuthorTerm', () => {
    searchTermService.lastNonExactAuthorTerm.set('death');
    componentRef.setInput('state', 'exact-author');
    component.form.setValue('something');
    expect(searchTermService.lastNonExactAuthorTerm()).toBe('death');
  });
});
