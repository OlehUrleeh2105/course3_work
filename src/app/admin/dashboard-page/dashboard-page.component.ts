import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Place, PlaceType } from 'src/app/shared/interfaces';
import { PostsService } from 'src/app/shared/services/posts.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, OnDestroy {

  posts: Place[] = [];
  pSub!: Subscription;
  dSub!: Subscription;
  searchStr = '';
  searchStrName = '';
  placeTypes:{key: string, value: PlaceType}[] = [];
  placeType = '';
  hasGen = false;
  hasInt = false;
  hasElNow = false;
  isVerify = false;

  constructor(private postsService: PostsService) { }

  ngOnInit() {
    this.pSub = this.postsService.getAll().subscribe(posts => {
      this.posts = posts;
    });

    for (const value in PlaceType) {
      if (isNaN(Number(value))) {
        this.placeTypes.push({key: value, value: PlaceType[value as keyof typeof PlaceType]});
      }
    }
  }

  remove(id?: string) {
    this.dSub = this.postsService.remove(id!).subscribe(() => {
      this.posts = this.posts.filter(post => post.id !== id);
    })
  }

  whatPlaceType(keyValue: string): string {
    return PlaceType[keyValue as keyof typeof PlaceType];
  }

  ngOnDestroy() {
    if (this.pSub) {
      this.pSub.unsubscribe();
    }
    if (this.dSub) {
      this.dSub.unsubscribe();
    }
  }

}
