import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthorResultsComponent } from './author-results.component';
import { ROUTER_OUTLET_DATA } from '@angular/router';
import { SearchTermService } from '@app/shared/services/search-term.service';
import { signal } from '@angular/core';
import { TypeaheadResultKind } from '@app/shared/models/typeahead-result.model';
import { vi } from 'vitest';

describe('AuthorResultsComponent', () => {
  let component: AuthorResultsComponent;
  let fixture: ComponentFixture<AuthorResultsComponent>;
  let searchTermService: SearchTermService;

  const dataSignal = signal<{ results: any[]; term: string } | undefined>(undefined);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorResultsComponent],
      providers: [
        { provide: ROUTER_OUTLET_DATA, useValue: dataSignal },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthorResultsComponent);
    component = fixture.componentInstance;
    searchTermService = TestBed.inject(SearchTermService);
    await fixture.whenStable();
  });

  it('loading should be true when data is undefined', () => {
    dataSignal.set(undefined);
    fixture.detectChanges();
    expect(component.loading()).toBeTruthy();
  });

  it('loading should be false when data is defined', () => {
    dataSignal.set({ results: [], term: 'keats' });
    fixture.detectChanges();
    expect(component.loading()).toBeFalsy();
  });

  it('skeletonRows should have 8 entries', () => {
    expect(component.skeletonRows.length).toBe(8);
  });

  it('authorClick() should call searchTermService.set$.next with the author name', () => {
    const nextSpy = vi.spyOn(searchTermService.set$, 'next');
    (component as any).authorClick({ kind: TypeaheadResultKind.author, name: 'Keats' });
    expect(nextSpy).toHaveBeenCalledWith('Keats');
  });
});
