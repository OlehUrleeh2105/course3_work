/// <reference types="@types/googlemaps" />
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Loader } from '@googlemaps/js-api-loader';
import { switchMap } from 'rxjs';
import { AuthService } from '../admin/shared/services/auth.service';
import { Place } from '../shared/interfaces';
import { PostsService } from '../shared/services/posts.service';

@Component({
  selector: 'app-for-all',
  templateUrl: './for-all.component.html',
  styleUrls: ['./for-all.component.scss']
})
export class ForAllComponent implements OnInit {

  userLocation = { lat: 0, lng: 0 };
  map!: google.maps.Map;
  loader = new Loader({
    apiKey: '',
    version: "weekly",
    libraries: ["places", "geometry"]
  })

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService,
    public auth: AuthService
  ) { }

  ngOnInit() {
    this.loader.load().then(() => {
      navigator.geolocation.getCurrentPosition(position => {
        this.userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        const mapEl = document.getElementById('map');
        if (mapEl) {
          this.map = new google.maps.Map(mapEl, {
            center: this.userLocation,
            zoom: 13
          });
        }
      });
      this.route.params.pipe(
        switchMap((params: Params) => {
          return this.postsService.getAll();
        })
      ).subscribe((places: Place[]) => {
        places.forEach((place, index) => {
          setTimeout(() => {
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ address: place.address }, (results, status) => {
              if (status === google.maps.GeocoderStatus.OK) {
                const location = {
                  lat: results[0].geometry.location.lat(),
                  lng: results[0].geometry.location.lng()
                };
                const marker = new google.maps.Marker({
                  position: location,
                  map: this.map
                })
              }
            });
          }, index * 300)
        });
      });
    })
  }
}
