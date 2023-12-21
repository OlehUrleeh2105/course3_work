import { Component, Input, OnInit } from '@angular/core';
import { Place, PlaceType } from '../../interfaces';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  @Input() place!: Place

  constructor() { }

  ngOnInit(): void {
  }

  whatPlaceType(keyValue: string): string {
    return PlaceType[keyValue as keyof typeof PlaceType];
  }

}
