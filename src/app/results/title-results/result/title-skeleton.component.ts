import { Component } from '@angular/core';
import { SkeletonComponent } from '@app/shared/skeleton/skeleton.component';
import { skeletonHeight, smallSkeletonHeight } from '@app/shared/constants/skeleton.constants';

@Component({
  selector: 'app-title-skeleton',
  imports: [
    SkeletonComponent
  ],
  template: `
    <div class="d-flex flex-column gap-2">
      <div class="d-flex gap-2">
        <app-skeleton width="100px" [height]="skeletonHeight"/>
        <app-skeleton width="70px" [height]="skeletonHeight"/>
        <app-skeleton width="150px" [height]="skeletonHeight"/>
        <app-skeleton width="70px" [height]="skeletonHeight"/>
      </div>
      <div class="d-flex gap-2">
        <app-skeleton width="80px" [height]="smallSkeletonHeight"/>
        <app-skeleton width="125px" [height]="smallSkeletonHeight"/>
      </div>
    </div>
  `
})
export class TitleSkeletonComponent {
  protected readonly skeletonHeight = skeletonHeight;
  protected readonly smallSkeletonHeight = smallSkeletonHeight;
}
