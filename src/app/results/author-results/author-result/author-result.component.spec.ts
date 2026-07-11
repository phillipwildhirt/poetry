import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorResult } from './author-result';

describe('AuthorResult', () => {
  let component: AuthorResult;
  let fixture: ComponentFixture<AuthorResult>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorResult],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthorResult);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
