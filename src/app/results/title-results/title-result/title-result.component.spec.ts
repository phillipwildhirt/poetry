import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleResult } from './title-result';

describe('TitleResult', () => {
  let component: TitleResult;
  let fixture: ComponentFixture<TitleResult>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TitleResult],
    }).compileComponents();

    fixture = TestBed.createComponent(TitleResult);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
