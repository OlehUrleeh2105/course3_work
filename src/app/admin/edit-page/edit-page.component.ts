/// <reference types="@types/googlemaps" />
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Loader } from '@googlemaps/js-api-loader';
import { Subscription, switchMap } from 'rxjs';
import { Place, PlaceType } from 'src/app/shared/interfaces';
import { PostsService } from '../../shared/services/posts.service';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit, OnDestroy {

  form!: FormGroup;
  placeTypes:{key: string, value: PlaceType}[] = [];
  submitted = false;
  uSub!: Subscription;
  place!: Place;

  isPlace = false;
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
    for (const value in PlaceType) {
      if (isNaN(Number(value))) {
        this.placeTypes.push({key: value, value: PlaceType[value as keyof typeof PlaceType]});
      }
    }

    this.route.params.pipe(
      switchMap((params: Params) => {
        return this.postsService.getByID(params['id']);
      })
    ).subscribe((place: Place) => {
      this.place = place;
      this.form = new FormGroup({
        title: new FormControl(place.title, Validators.required),
        address: new FormControl(place.address, Validators.required),
        hasGenerator: new FormControl(place.hasGenerator),
        hasInternet: new FormControl(place.hasInternet),
        placeType: new FormControl(place.placeType),
        hasElectricityNow: new FormControl(place.hasElectricityNow),
        description: new FormControl(place.description),
        verify: new FormControl(place.verify)
      })
      this.findPlace();
    });
  }

  ngOnDestroy() {
    if (this.uSub) {
      this.uSub.unsubscribe();
    }
  }

  remove(i: number) {
    this.place.comments.splice(i, 1);
    this.postsService.update({
      ...this.place,
      comments: this.place.comments
    }).subscribe();
  }

  findPlace() {
    this.loader.load().then(() => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: this.form.value.address }, (results, status) => {
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
          this.isPlace = true;
        } else {
          console.error('Geocode was not successful for the following reason: ' + status);
          alert('Адресу не знайдено');
          this.isPlace = false;
        }
      });
    })
  }

  submit() {
    if(this.form.invalid) {
      return;
    }

    this.submitted = true;

    this.uSub = this.postsService.update({
      ...this.place,
      title: this.form.value.title,
      address: this.form.value.address,
      hasGenerator: this.form.value.hasGenerator,
      hasInternet: this.form.value.hasInternet,
      placeType: this.form.value.placeType,
      hasElectricityNow: this.form.value.hasElectricityNow,
      description: this.form.value.description,
      verify: this.form.value.verify
    }).subscribe(() => {
      this.submitted = false;
    });
  }
}
