import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineResult } from './line-result';

describe('LineResult', () => {
  let component: LineResult;
  let fixture: ComponentFixture<LineResult>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineResult],
    }).compileComponents();

    fixture = TestBed.createComponent(LineResult);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
