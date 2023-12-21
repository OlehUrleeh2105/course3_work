/// <reference types="@types/googlemaps" />
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Loader } from '@googlemaps/js-api-loader';
import { Place, PlaceType } from 'src/app/shared/interfaces';
import { PostsService } from 'src/app/shared/services/posts.service';

@Component({
  selector: 'app-create-page',
  templateUrl: './create-page.component.html',
  styleUrls: ['./create-page.component.scss']
})
export class CreatePageComponent implements OnInit {

  form!: FormGroup;
  placeTypes:{key: string, value: PlaceType}[] = [];

  isPlace = false;
  map!: google.maps.Map;
  loader = new Loader({
    apiKey: '',
    version: "weekly",
    libraries: ["places", "geometry"]
  });

  constructor(private postsService: PostsService) { }

  ngOnInit() {
    this.formReset();

    for (const value in PlaceType) {
      if (isNaN(Number(value))) {
        this.placeTypes.push({key: value, value: PlaceType[value as keyof typeof PlaceType]});
      }
    }

    this.loader.load().then(() => {
      const location = {
        lat: 0,
        lng: 0
      };
      const mapElement = document.getElementById('map');
      if (mapElement) {
        this.map = new google.maps.Map(mapElement, {
          center: location,
          zoom: 1
        });
      }
    })
  }

  formReset() {
    this.form = new FormGroup({
      title: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),
      hasGenerator: new FormControl(false),
      hasInternet: new FormControl(false),
      placeType: new FormControl(null, Validators.required),
      hasElectricityNow: new FormControl(true),
      description: new FormControl('')
    });
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
    if (this.form.invalid) {
      return;
    }

    const place: Place = {
      title: this.form.value.title,
      address: this.form.value.address,
      placeType: this.form.value.placeType,
      hasGenerator: this.form.value.hasGenerator,
      hasInternet: this.form.value.hasInternet,
      hasElectricityNow: this.form.value.hasElectricityNow,
      description: this.form.value.description,
      verify: true,
      comments: ['']
    }

    this.postsService.create(place).subscribe(() => {
      this.formReset();
    })
  }
}
