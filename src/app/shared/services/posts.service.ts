import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { FbCreateResponse, Place } from "../interfaces";
import { environment } from "src/environments/environment";

@Injectable({providedIn: 'root'})
export class PostsService {
  constructor(private http: HttpClient) {}

  create(place: Place): Observable<Place> {
    return this.http.post(`${environment.fbDbUrl}/posts.json`, place)
    .pipe(map((response: FbCreateResponse | any) => {
      return {
        ...place,
        id: response.name
      }
    }))
  }

  getAll(): Observable<Place[]> {
    return this.http.get(`${environment.fbDbUrl}/posts.json`)
    .pipe(map((response: {[key: string]: any}) => {
      return Object.keys(response).map(key => ({
        ...response[key],
        id: key,
        date: new Date(response[key].date)
      }))
    }))
  }

  getByID(id: string): Observable<Place> {
    return this.http.get<Place>(`${environment.fbDbUrl}/posts/${id}.json`)
    .pipe(map((place: Place) => {
      return {
        ...place,
        id
      }
    }))
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.fbDbUrl}/posts/${id}.json`);
  }

  update(place: Place): Observable<Place> {
    return this.http.patch<Place>(`${environment.fbDbUrl}/posts/${place.id}.json`, place);
  }
}
