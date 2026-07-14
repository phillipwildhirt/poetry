import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PoemComponent } from './poem.component';
import { Location } from '@angular/common';
import { provideRouter, Router } from '@angular/router';
import { SearchTermService } from '@app/shared/services/search-term.service';
import { PoetryApiService } from '@app/shared/services/poetry-api.service';
import { DarkModeService } from '@app/shared/services/dark-mode.service';
import { of } from 'rxjs';
import { vi } from 'vitest';

describe('PoemComponent', () => {
  let component: PoemComponent;
  let fixture: ComponentFixture<PoemComponent>;
  let router: Router;
  let location: Location;
  let searchTermService: SearchTermService;

  beforeEach(async () => {
    // matchMedia is not available in jsdom
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockReturnValue({ matches: false }),
    });

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
        {
          provide: DarkModeService,
          useValue: {
            isInDarkMode$: of(false),
            updateDarkMode: vi.fn(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PoemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('author', 'Keats');
    fixture.componentRef.setInput('title', 'Ode to Autumn');
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    searchTermService = TestBed.inject(SearchTermService);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);
    await fixture.whenStable();
  });

  // --- searchAuthor() ---

  it('searchAuthor() should call overrideIndex() and setExactAuthor()', () => {
    const overrideSpy = vi.spyOn(searchTermService, 'overrideIndex');
    const setExactAuthorSpy = vi.spyOn(searchTermService, 'setExactAuthor');
    (component as any).searchAuthor('Keats');
    expect(overrideSpy).toHaveBeenCalled();
    expect(setExactAuthorSpy).toHaveBeenCalledWith('Keats');
  });

  it('searchAuthor() should navigate to ["search", "author"]', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    (component as any).searchAuthor('Keats');
    expect(navigateSpy).toHaveBeenCalledWith(['search', 'author']);
  });

  // --- backToSearch() ---

  it('backToSearch() should call overrideIndex()', () => {
    const overrideSpy = vi.spyOn(searchTermService, 'overrideIndex');
    Object.defineProperty(document, 'referrer', { value: 'https://external.com', configurable: true });
    (component as any).backToSearch();
    expect(overrideSpy).toHaveBeenCalled();
  });

  it('backToSearch() should call setTerm() with lastTerm when not in exact-author mode (lastTerm === lastNonExactAuthorTerm)', () => {
    const setTermSpy = vi.spyOn(searchTermService, 'setTerm');
    searchTermService.lastTerm.set('death');
    searchTermService.lastNonExactAuthorTerm.set('death');
    Object.defineProperty(document, 'referrer', { value: 'https://external.com', configurable: true });
    (component as any).backToSearch();
    expect(setTermSpy).toHaveBeenCalledWith('death');
  });

  it('backToSearch() should call setExactAuthor() when lastTerm !== lastNonExactAuthorTerm (exact-author mode)', () => {
    const setExactAuthorSpy = vi.spyOn(searchTermService, 'setExactAuthor');
    searchTermService.lastTerm.set('Keats');
    searchTermService.lastNonExactAuthorTerm.set('death');
    Object.defineProperty(document, 'referrer', { value: 'https://external.com', configurable: true });
    (component as any).backToSearch();
    expect(setExactAuthorSpy).toHaveBeenCalledWith('Keats');
  });

  it('backToSearch() should navigate to ["search"] when referrer is not same origin', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    Object.defineProperty(document, 'referrer', { value: 'https://external.com', configurable: true });
    (component as any).backToSearch();
    expect(navigateSpy).toHaveBeenCalledWith(['search']);
  });

  it('backToSearch() should call location.back() when referrer is same origin', () => {
    const backSpy = vi.spyOn(location, 'back');
    Object.defineProperty(document, 'referrer', { value: window.location.origin + '/search', configurable: true });
    (component as any).backToSearch();
    expect(backSpy).toHaveBeenCalled();
  });
});
