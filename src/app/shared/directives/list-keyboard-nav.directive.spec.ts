import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ListKeyboardNavDirective } from './list-keyboard-nav.directive';

@Component({
  template: `
    <div appListKeyboardNav role="listbox">
      <button role="option" id="btn0">Item 0</button>
      <button role="option" id="btn1">Item 1</button>
      <button role="option" id="btn2">Item 2</button>
    </div>
  `,
  imports: [ListKeyboardNavDirective],
})
class TestHostComponent {}

const keydown = (key: string): KeyboardEvent =>
  new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });

describe('ListKeyboardNavDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let list: DebugElement;
  let buttons: HTMLElement[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    list = fixture.debugElement.query(By.directive(ListKeyboardNavDirective));
    buttons = Array.from(
      (list.nativeElement as HTMLElement).querySelectorAll<HTMLElement>('button[role="option"]')
    );
  });

  it('should create an instance', () => {
    const directive = list.injector.get(ListKeyboardNavDirective);
    expect(directive).toBeTruthy();
  });

  describe('ArrowDown', () => {
    it('should move focus to the next item', () => {
      buttons[0].focus();
      list.nativeElement.dispatchEvent(keydown('ArrowDown'));
      expect(document.activeElement).toBe(buttons[1]);
    });

    it('should add "active" class to the newly focused item', () => {
      buttons[0].focus();
      list.nativeElement.dispatchEvent(keydown('ArrowDown'));
      fixture.detectChanges();
      expect(buttons[1].classList).toContain('active');
    });

    it('should remove "active" class from the previously focused item', () => {
      buttons[0].focus();
      buttons[0].classList.add('active');
      list.nativeElement.dispatchEvent(keydown('ArrowDown'));
      fixture.detectChanges();
      expect(buttons[0].classList).not.toContain('active');
    });

    it('should not move focus past the last item', () => {
      buttons[2].focus();
      list.nativeElement.dispatchEvent(keydown('ArrowDown'));
      expect(document.activeElement).toBe(buttons[2]);
    });

    it('should call preventDefault', () => {
      buttons[0].focus();
      const event = keydown('ArrowDown');
      vi.spyOn(event, 'preventDefault');
      list.nativeElement.dispatchEvent(event);
      expect(event.preventDefault).toHaveBeenCalled();
    });
  });

  describe('ArrowUp', () => {
    it('should move focus to the previous item', () => {
      buttons[2].focus();
      list.nativeElement.dispatchEvent(keydown('ArrowUp'));
      expect(document.activeElement).toBe(buttons[1]);
    });

    it('should add "active" class to the newly focused item', () => {
      buttons[2].focus();
      list.nativeElement.dispatchEvent(keydown('ArrowUp'));
      fixture.detectChanges();
      expect(buttons[1].classList).toContain('active');
    });

    it('should remove "active" class from the previously focused item', () => {
      buttons[2].focus();
      buttons[2].classList.add('active');
      list.nativeElement.dispatchEvent(keydown('ArrowUp'));
      fixture.detectChanges();
      expect(buttons[2].classList).not.toContain('active');
    });

    it('should not move focus before the first item', () => {
      buttons[0].focus();
      list.nativeElement.dispatchEvent(keydown('ArrowUp'));
      expect(document.activeElement).toBe(buttons[0]);
    });

    it('should call preventDefault', () => {
      buttons[1].focus();
      const event = keydown('ArrowUp');
      vi.spyOn(event, 'preventDefault');
      list.nativeElement.dispatchEvent(event);
      expect(event.preventDefault).toHaveBeenCalled();
    });
  });

  describe('Home', () => {
    it('should move focus to the first item', () => {
      buttons[2].focus();
      list.nativeElement.dispatchEvent(keydown('Home'));
      expect(document.activeElement).toBe(buttons[0]);
    });

    it('should add "active" class to the first item', () => {
      buttons[2].focus();
      list.nativeElement.dispatchEvent(keydown('Home'));
      fixture.detectChanges();
      expect(buttons[0].classList).toContain('active');
    });

    it('should call preventDefault', () => {
      buttons[2].focus();
      const event = keydown('Home');
      vi.spyOn(event, 'preventDefault');
      list.nativeElement.dispatchEvent(event);
      expect(event.preventDefault).toHaveBeenCalled();
    });
  });

  describe('End', () => {
    it('should move focus to the last item', () => {
      buttons[0].focus();
      list.nativeElement.dispatchEvent(keydown('End'));
      expect(document.activeElement).toBe(buttons[2]);
    });

    it('should add "active" class to the last item', () => {
      buttons[0].focus();
      list.nativeElement.dispatchEvent(keydown('End'));
      fixture.detectChanges();
      expect(buttons[2].classList).toContain('active');
    });

    it('should call preventDefault', () => {
      buttons[0].focus();
      const event = keydown('End');
      vi.spyOn(event, 'preventDefault');
      list.nativeElement.dispatchEvent(event);
      expect(event.preventDefault).toHaveBeenCalled();
    });
  });

  describe('unhandled keys', () => {
    it('should not move focus on Tab', () => {
      buttons[0].focus();
      list.nativeElement.dispatchEvent(keydown('Tab'));
      expect(document.activeElement).toBe(buttons[0]);
    });

    it('should not move focus on Enter', () => {
      buttons[0].focus();
      list.nativeElement.dispatchEvent(keydown('Enter'));
      expect(document.activeElement).toBe(buttons[0]);
    });
  });

  describe('focusout', () => {
    it('should remove "active" from all items when focus leaves the list', () => {
      buttons[1].focus();
      buttons[1].classList.add('active');
      // Simulate focusout with relatedTarget outside the list
      const focusOutEvent = new FocusEvent('focusout', {
        bubbles: true,
        relatedTarget: document.body,
      });
      list.nativeElement.dispatchEvent(focusOutEvent);
      fixture.detectChanges();
      buttons.forEach(btn => expect(btn.classList).not.toContain('active'));
    });

    it('should NOT remove "active" when focus moves between items within the list', () => {
      buttons[0].focus();
      buttons[0].classList.add('active');
      // relatedTarget is still inside the list
      const focusOutEvent = new FocusEvent('focusout', {
        bubbles: true,
        relatedTarget: buttons[1],
      });
      list.nativeElement.dispatchEvent(focusOutEvent);
      fixture.detectChanges();
      expect(buttons[0].classList).toContain('active');
    });
  });
});
