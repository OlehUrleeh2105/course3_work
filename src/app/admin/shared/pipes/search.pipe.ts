import { Pipe, PipeTransform } from "@angular/core";
import { Place } from "src/app/shared/interfaces";
import { transliterate } from 'transliteration';

@Pipe({
  name: 'searchPlace'
})
export class SearchPipe implements PipeTransform {
  transform(posts: Place[], search = ''): Place[] {
    if (!search.trim()) {
      return posts;
    }
    const searchTerm = transliterate(search).toLocaleLowerCase();
    return posts.filter(post => {
      const postAddress = transliterate(post.address).toLocaleLowerCase();
      return postAddress.includes(searchTerm);
    });
  }
}
