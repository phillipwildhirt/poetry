import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineResults } from './line-results';

describe('LineResults', () => {
  let component: LineResults;
  let fixture: ComponentFixture<LineResults>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineResults],
    }).compileComponents();

    fixture = TestBed.createComponent(LineResults);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
