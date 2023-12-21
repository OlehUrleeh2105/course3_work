import { Component, OnInit } from '@angular/core';
import { PostsService } from '../shared/services/posts.service';
import { Observable } from 'rxjs';
import { Place, PlaceType } from '../shared/interfaces';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  posts$!: Observable<Place[]>;
  searchStr = '';
  searchStrName = '';
  placeTypes:{key: string, value: PlaceType}[] = [];
  placeType = '';
  hasGen = false;
  hasInt = false;
  hasElNow = false;
  isVerify = false;

  constructor( private postsService: PostsService) { }

  ngOnInit(): void {
    this.posts$ = this.postsService.getAll();

    for (const value in PlaceType) {
      if (isNaN(Number(value))) {
        this.placeTypes.push({key: value, value: PlaceType[value as keyof typeof PlaceType]});
      }
    }
  }

}
