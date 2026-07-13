import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AnimationStateService {
  readonly isAnimating = signal<boolean>(false);

  setAnimating(value: boolean): void {
    this.isAnimating.set(value);
  }
}
