import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorResults } from './author-results';

describe('AuthorResults', () => {
  let component: AuthorResults;
  let fixture: ComponentFixture<AuthorResults>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorResults],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthorResults);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
