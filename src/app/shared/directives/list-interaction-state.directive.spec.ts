import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ListInteractionStateDirective } from './list-interaction-state.directive';

@Component({
  template: '<div appListInteractionStateDirective>test</div>',
  imports: [ListInteractionStateDirective],
})
class TestHostComponent {}

describe('ListInteractionStateDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let el: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    el = fixture.debugElement.query(By.directive(ListInteractionStateDirective));
  });

  it('should create an instance', () => {
    const directive = el.injector.get(ListInteractionStateDirective);
    expect(directive).toBeTruthy();
  });

  it('should add "active" class on mouseenter', () => {
    el.triggerEventHandler('mouseenter', null);
    fixture.detectChanges();
    expect((el.nativeElement as HTMLElement).classList).toContain('active');
  });

  it('should remove "active" class on mouseleave', () => {
    el.triggerEventHandler('mouseenter', null);
    fixture.detectChanges();
    el.triggerEventHandler('mouseleave', null);
    fixture.detectChanges();
    expect((el.nativeElement as HTMLElement).classList).not.toContain('active');
  });

  it('should not have "active" class initially', () => {
    expect((el.nativeElement as HTMLElement).classList).not.toContain('active');
  });

  it('should remain active if mouseenter fires multiple times without mouseleave', () => {
    el.triggerEventHandler('mouseenter', null);
    el.triggerEventHandler('mouseenter', null);
    fixture.detectChanges();
    expect((el.nativeElement as HTMLElement).classList).toContain('active');
  });

  it('should not throw on mouseleave without prior mouseenter', () => {
    expect(() => {
      el.triggerEventHandler('mouseleave', null);
      fixture.detectChanges();
    }).not.toThrow();
  });
});
