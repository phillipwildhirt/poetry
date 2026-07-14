import { Component, Input } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';
import { LengthUnit } from '../models/length-unit.type';

@Component({
  selector: 'app-skeleton',
  templateUrl: './skeleton.component.html',
  standalone: true,
  imports: [
    NgStyle,
    NgClass
  ]
})
export class SkeletonComponent {
  @Input({ required: true }) width!: `${number}${LengthUnit}`;
  @Input() height: `${number}${LengthUnit}` = '1.25rem';
  //If True, puts blank space in html but does not show the Skeleton UI.
  @Input() turnOffSkeletonEffect = false;
}
