import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleResults } from './title-results';

describe('TitleResults', () => {
  let component: TitleResults;
  let fixture: ComponentFixture<TitleResults>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TitleResults],
    }).compileComponents();

    fixture = TestBed.createComponent(TitleResults);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
