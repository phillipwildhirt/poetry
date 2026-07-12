import { Component } from '@angular/core';
import { SkeletonComponent } from '@app/shared/skeleton/skeleton.component';
import { skeletonHeight, smallSkeletonHeight } from '@app/shared/constants/skeleton.constants';

@Component({
  selector: 'app-line-skeleton',
  imports: [
    SkeletonComponent
  ],
  template: `
    <div class="d-flex flex-column gap-2">
      <div class="d-flex gap-2">
        <app-skeleton width="30px" [height]="smallSkeletonHeight"/>
        <app-skeleton width="70px" [height]="smallSkeletonHeight"/>
        <app-skeleton width="50px" [height]="smallSkeletonHeight"/>
        <app-skeleton width="70px" [height]="smallSkeletonHeight"/><span class="small opacity-75"> — </span><app-skeleton width="60px" [height]="smallSkeletonHeight"/>
        <app-skeleton width="100px" [height]="smallSkeletonHeight"/>
      </div>
      <div class="d-flex gap-2">
        <app-skeleton width="40px" [height]="skeletonHeight"/>
        <app-skeleton width="125px" [height]="skeletonHeight"/>
        <app-skeleton width="70px" [height]="skeletonHeight"/>
        <app-skeleton width="50px" [height]="skeletonHeight"/>
        <app-skeleton width="75px" [height]="skeletonHeight"/>
      </div>
    </div>`,
})
export class LineSkeletonComponent {
  protected readonly skeletonHeight = skeletonHeight;
  protected readonly smallSkeletonHeight = smallSkeletonHeight;
}
