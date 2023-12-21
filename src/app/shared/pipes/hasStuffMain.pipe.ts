import { Pipe, PipeTransform } from "@angular/core";
import { Place } from "src/app/shared/interfaces";

@Pipe({
  name: 'hasStuffMain'
})
export class HasStuffMainPipe implements PipeTransform {
  transform(posts: Place[], search: boolean[]) {
    if (search.every(val => val == false)) {
      return posts;
    }
    return posts.filter(post => {
      return (search[0] ? post.hasGenerator : true) &&
      (search[1] ? post.hasInternet : true) &&
      (search[2] ? post.hasElectricityNow : true) &&
      (search[3] ? post.verify : true);
    })
  }
}
