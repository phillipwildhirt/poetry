import { Component, inject, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DarkModeService } from '@app/shared/services/dark-mode.service';
import { Title } from '@angular/platform-browser';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [RouterOutlet],
})
export class App {
  private readonly darkModeService = inject(DarkModeService);
  private readonly titleService = inject(Title);
  private readonly renderer = inject(Renderer2);

  constructor() {
    this.titleService.setTitle('Versearch - Explore timeless poetry');

    this.darkModeService.isInDarkMode$.pipe(takeUntilDestroyed()).subscribe(v => {
      if (v)
        this.renderer.setAttribute(document.body, 'data-bs-theme', 'dark');
      else
        this.renderer.setAttribute(document.body, 'data-bs-theme', 'light');
    });
  }
}
