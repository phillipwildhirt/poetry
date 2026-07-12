import { Component } from '@angular/core';
import { SkeletonComponent } from '@app/shared/skeleton/skeleton.component';
import { skeletonHeight } from '@app/shared/constants/skeleton.constants';

@Component({
  selector: 'app-author-skeleton',
  imports: [
    SkeletonComponent
  ],
  template: `
    <div class="d-flex gap-2">
      <app-skeleton width="80px" [height]="skeletonHeight"/>
      <app-skeleton width="125px" [height]="skeletonHeight"/>
    </div>
  `,
})
export class AuthorSkeletonComponent {
  protected readonly skeletonHeight = skeletonHeight;
}
