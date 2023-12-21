import { Pipe, PipeTransform } from "@angular/core";
import { Place } from "src/app/shared/interfaces";
import { transliterate } from 'transliteration';

@Pipe({
  name: 'searchNameMain'
})
export class SearchNameMainPipe implements PipeTransform {
  transform(posts: Place[], search = ''): Place[] {
    if (!search.trim()) {
      return posts;
    }
    const searchTerm = transliterate(search).toLocaleLowerCase();
    return posts.filter(post => {
      const postName = transliterate(post.title).toLocaleLowerCase();
      return postName.includes(searchTerm);
    });
  }
}
