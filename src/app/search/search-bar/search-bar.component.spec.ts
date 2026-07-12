import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchBarComponent } from './search-bar.component';
import { SearchTermService } from '@app/shared/services/search-term.service';
import { provideRouter } from '@angular/router';
import { ComponentRef } from '@angular/core';
import { vi } from 'vitest';

describe('Search', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;
  let componentRef: ComponentRef<SearchBarComponent>;
  let searchTermService: SearchTermService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBarComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBarComponent);
    componentRef = fixture.componentRef;
    component = fixture.componentInstance;
    searchTermService = TestBed.inject(SearchTermService);
    await fixture.whenStable();
  });

  it('should update form value when searchTermService.set$ emits', () => {
    searchTermService.set$.next('Keats');
    expect(component.form.value).toBe('Keats');
  });

  it('should call searchTermService.reset$.next() when form changes in exact-author state', () => {
    componentRef.setInput('state', 'exact-author');
    const resetSpy = vi.spyOn(searchTermService.reset$, 'next');
    component.form.setValue('something');
    expect(resetSpy).toHaveBeenCalled();
  });

  it('should NOT call searchTermService.reset$.next() when form changes in search state', () => {
    componentRef.setInput('state', 'search');
    const resetSpy = vi.spyOn(searchTermService.reset$, 'next');
    component.form.setValue('something');
    expect(resetSpy).not.toHaveBeenCalled();
  });

  it('should have empty form value by default', () => {
    expect(component.form.value).toBe('');
  });
});
