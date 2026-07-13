import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PoemComponent } from './poem.component';
import { provideRouter, Router } from '@angular/router';
import { SearchTermService } from '@app/shared/services/search-term.service';
import { PoetryApiService } from '@app/shared/services/poetry-api.service';
import { of } from 'rxjs';
import { vi } from 'vitest';

describe('PoemComponent', () => {
  let component: PoemComponent;
  let fixture: ComponentFixture<PoemComponent>;
  let router: Router;
  let searchTermService: SearchTermService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoemComponent],
      providers: [
        provideRouter([]),
        {
          provide: PoetryApiService,
          useValue: {
            getPoem: () => of(undefined),
            getAuthors: () => of([]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PoemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('author', 'Keats');
    fixture.componentRef.setInput('title', 'Ode to Autumn');
    router = TestBed.inject(Router);
    searchTermService = TestBed.inject(SearchTermService);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    await fixture.whenStable();
  });

  it('searchAuthor() should call setExactAuthor() and overrideIndex()', () => {
    const setExactAuthorSpy = vi.spyOn(searchTermService, 'setExactAuthor');
    const overrideSpy = vi.spyOn(searchTermService, 'overrideIndex');
    (component as any).searchAuthor('Keats');
    expect(overrideSpy).toHaveBeenCalled();
    expect(setExactAuthorSpy).toHaveBeenCalledWith('Keats');
  });

  it('searchAuthor() should navigate to ["search", "author"]', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    (component as any).searchAuthor('Keats');
    expect(navigateSpy).toHaveBeenCalledWith(['search', 'author']);
  });

  it('backToSearch() should navigate to ["search"] when referrer is not same origin', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    vi.spyOn(searchTermService, 'overrideIndex');
    Object.defineProperty(document, 'referrer', { value: 'https://external.com', configurable: true });
    (component as any).backToSearch();
    expect(navigateSpy).toHaveBeenCalledWith(['search']);
  });
});
