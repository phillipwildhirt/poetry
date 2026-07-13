import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TitleResultsComponent } from './title-results.component';
import { provideRouter, Router, ROUTER_OUTLET_DATA } from '@angular/router';
import { signal } from '@angular/core';
import { TypeaheadResultKind } from '@app/shared/models/typeahead-result.model';
import { vi } from 'vitest';

describe('TitleResultsComponent', () => {
  let component: TitleResultsComponent;
  let fixture: ComponentFixture<TitleResultsComponent>;
  let router: Router;

  const dataSignal = signal<{ results: any[]; term: string } | undefined>(undefined);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TitleResultsComponent],
      providers: [
        provideRouter([]),
        { provide: ROUTER_OUTLET_DATA, useValue: dataSignal },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TitleResultsComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    await fixture.whenStable();
  });

  it('openPoem() should navigate to ["poem", author, title]', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    (component as any).openPoem({ kind: TypeaheadResultKind.title, title: 'Ode to Autumn', author: 'Keats' });
    expect(navigateSpy).toHaveBeenCalledWith(['poem', 'Keats', 'Ode to Autumn']);
  });
});

