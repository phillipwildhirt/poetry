import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoemComponent } from './poem.component';

describe('Poem', () => {
  let component: PoemComponent;
  let fixture: ComponentFixture<PoemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PoemComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
