import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TitleResultsComponent } from './title-results.component';
import { ROUTER_OUTLET_DATA } from '@angular/router';
import { signal } from '@angular/core';
import { TypeaheadResultKind } from '@app/shared/models/typeahead-result.model';
import { vi } from 'vitest';

describe('TitleResultsComponent', () => {
  let component: TitleResultsComponent;
  let fixture: ComponentFixture<TitleResultsComponent>;

  const dataSignal = signal<{ results: any[]; term: string } | undefined>(undefined);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TitleResultsComponent],
      providers: [
        { provide: ROUTER_OUTLET_DATA, useValue: dataSignal },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TitleResultsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loading should be true when data is undefined', () => {
    dataSignal.set(undefined);
    fixture.detectChanges();
    expect(component.loading()).toBeTruthy();
  });

  it('loading should be false when data is defined', () => {
    dataSignal.set({ results: [{ kind: TypeaheadResultKind.title, title: 'Ode', author: 'Keats' }], term: 'ode' });
    fixture.detectChanges();
    expect(component.loading()).toBeFalsy();
  });

  it('skeletonRows should have 8 entries', () => {
    expect(component.skeletonRows.length).toBe(8);
  });

  it('should expose results from data signal', () => {
    const results = [{ kind: TypeaheadResultKind.title, title: 'Ode', author: 'Keats' }];
    dataSignal.set({ results, term: 'ode' });
    fixture.detectChanges();
    expect(component.data()?.results).toEqual(results);
  });
});

