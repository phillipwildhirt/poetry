import { Component, inject, input, OnInit } from '@angular/core';
import { PoetryApiService } from '@app/shared/services/poetry-api.service';

@Component({
  selector: 'app-poem',
  templateUrl: './poem.component.html',
  styleUrl: './poem.component.scss',
  imports: [],
})
export class PoemComponent implements OnInit {
  readonly author = input.required<string>();
  readonly title = input.required<string>();
  private readonly poetryApiService = inject(PoetryApiService);

  ngOnInit(): void {
    this.poetryApiService.getPoem(this.author(), this.title()).subscribe((poem) => {
      console.log(poem)
    })
  }
}
