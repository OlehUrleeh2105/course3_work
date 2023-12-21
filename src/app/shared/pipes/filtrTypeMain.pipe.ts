import { Pipe, PipeTransform } from "@angular/core";
import { Place } from "src/app/shared/interfaces";

@Pipe({
  name: 'searchTypeMain'
})
export class SearchTypeMainPipe implements PipeTransform {
  transform(posts: Place[], search = ''): Place[] {
    if (!search.trim()) {
      return posts;
    }
    return posts.filter(post => {
      return post.placeType.includes(search);
    });
  }
}
