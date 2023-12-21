/// <reference types="@types/googlemaps" />
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Loader } from '@googlemaps/js-api-loader';
import { Observable, switchMap } from 'rxjs';
import { PostsService } from 'src/app/shared/services/posts.service';
import { Place, PlaceType } from '../shared/interfaces';

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.scss']
})
export class PostPageComponent implements OnInit {

  form!: FormGroup;
  place$!: Observable<Place>;
  place!: Place;

  map!: google.maps.Map;
  loader = new Loader({
    apiKey: '',
    version: "weekly",
    libraries: ["places", "geometry"]
  })

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService
  ) { }

  ngOnInit() {
    this.place$ = this.route.params.pipe(switchMap((params: Params) => {
      return this.postsService.getByID(params['id']);
    }))

    this.route.params.pipe(
      switchMap((params: Params) => {
        return this.postsService.getByID(params['id']);
      })
    ).subscribe((place: Place) => {
      this.place = place;
      this.loader.load().then(() => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: this.place.address }, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK) {
            const location = {
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng()
            };
            const mapElement = document.getElementById('map');
            if (mapElement) {
              this.map = new google.maps.Map(mapElement, {
                center: location,
                zoom: 15
              });
            }
            const marker = new google.maps.Marker({
              position: location,
              map: this.map
            })
          } else {
            console.error('Geocode was not successful for the following reason: ' + status);
            alert('Адресу не знайдено');
          }
        });
      })
      this.form = new FormGroup({
         comment: new FormControl(null, Validators.required)
      });
    });
  }

  submit() {
    this.place.comments.push(this.form.value.comment);
    this.postsService.update({
      ...this.place,
      comments: this.place.comments
    }).subscribe(() => {
      this.form.reset();
      location.reload();
    });
  }

  whatPlaceType(keyValue: string): string {
    return PlaceType[keyValue as keyof typeof PlaceType];
  }
}
