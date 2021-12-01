import { AfterViewInit, Component, Directive, Inject, Input, OnInit } from '@angular/core'
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { ViewChild } from '@angular/core';


import { Pipe, PipeTransform } from '@angular/core';
import { SelectControlValueAccessor } from '@angular/forms';
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeScript, SafeStyle, SafeUrl } from '@angular/platform-browser';

import { SafePipe } from 'safe-pipe/lib/safe-pipe.pipe';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { TransitionCheckState } from '@angular/material/checkbox';
declare var google: any;

@Pipe({
  name: 'safe',
})
export class MyPipe implements PipeTransform {

  constructor(public sanitizer: DomSanitizer) {
    this.sanitizer = sanitizer;
  }

  transform(url) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
}



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent extends MyPipe implements OnInit, GoogleMapsModule {

  public lat;
  public lng;
  private http!: HttpClient;
  zoom = 14;
  public center!: google.maps.LatLngLiteral;

  //map: any;
  //@ViewChild('map') mapElement: any;

  map: any;
  @ViewChild('map') mapElement: any;
  //@ViewChild(GoogleMap, { static: false })
  //map!: GoogleMap;
  markers_coordinates = [
    { lat: 42.002619, lng: 21.406634, name: "Kanta1" },
    { lat: 42.002867, lng: 21.405255, name: "Kanta2" },
    { lat: 41.865263, lng: 21.937186, name: "Kanta3" },
    { lat: 42.005239, lng: 21.410855, name: "Kanta3" },
    { lat: 42.006981, lng: 21.412211, name: "Kanta4" },
    { lat: 42.003185, lng: 21.3317412, name: "Стакло" },
    { lat: 42.0072291, lng: 21.332638, name: "Стакло" },
    { lat: 42.0058601, lng: 21.3505605, name: "Стакло" },
    { lat: 42.006534, lng: 21.3549359, name: "Стакло" },
    { lat: 42.0088306, lng: 21.3531533, name: "Стакло" },
    { lat: 42.0097048, lng: 21.3604459, name: "Стакло" },
    { lat: 42.0068278, lng: 21.3614696, name: "Стакло" },
    { lat: 42.0061279, lng: 21.3653616, name: "Стакло" },
    { lat: 42.0080118, lng: 21.3656498, name: "Стакло" },
    { lat: 42.007663, lng: 21.3714756, name: "Стакло" },
    { lat: 42.0027558, lng: 21.3718041, name: "Стакло" },
    { lat: 42.0178783, lng: 21.3564162, name: "Стакло" },
    { lat: 42.0192049, lng: 21.3551878, name: "Стакло" },
    { lat: 42.0205895, lng: 21.3533778, name: "Стакло" },
    { lat: 42.0209671, lng: 21.351952, name: "Стакло" },
    { lat: 42.0500839, lng: 21.3633732, name: "Стакло" },
    { lat: 42.0256286, lng: 21.3799761, name: "Стакло" },
    { lat: 42.0256735, lng: 21.3800217, name: "Стакло" },
    { lat: 42.0060225, lng: 21.3833249, name: "Стакло" },
    { lat: 42.0046576, lng: 21.3828762, name: "Стакло" },
    { lat: 42.0015786, lng: 21.3836405, name: "Стакло" },
    { lat: 42.0092748, lng: 21.3847974, name: "Стакло" },
    { lat: 42.0056945, lng: 21.3866579, name: "Стакло" },
    { lat: 42.0039897, lng: 21.3878195, name: "Стакло" },
    { lat: 42.0053231, lng: 21.3895135, name: "Стакло" },
    { lat: 42.0060161, lng: 21.3898348, name: "Стакло" },
    { lat: 42.0062211, lng: 21.3915699, name: "Стакло" },
    { lat: 42.0017263, lng: 21.3898524, name: "Стакло" },
    { lat: 41.9995258, lng: 21.3915382, name: "Стакло" },
    { lat: 41.9974343, lng: 21.3922196, name: "Стакло" },
    { lat: 42.0033278, lng: 21.3947149, name: "Стакло" },
    { lat: 42.0044959, lng: 21.3954958, name: "Стакло" },
    { lat: 42.0056907, lng: 21.3962591, name: "Стакло" },
    { lat: 42.0063465, lng: 21.3954163, name: "Стакло" },
    { lat: 42.0068376, lng: 21.3947045, name: "Стакло" },
    { lat: 41.4433875, lng: 22.6400007, name: "Стакло" },
    { lat: 41.4433639, lng: 22.6399893, name: "Стакло" },
    { lat: 41.4433327, lng: 22.6399839, name: "Стакло" },
    { lat: 41.4436608, lng: 22.6405894, name: "Стакло" },
    { lat: 41.445655, lng: 22.6409224, name: "Стакло" },
    { lat: 41.4430115, lng: 22.641137, name: "Стакло" },
    { lat: 41.4434828, lng: 22.6417565, name: "Стакло" },
    { lat: 41.4441591, lng: 22.6421895, name: "Стакло" },
    { lat: 41.9851101, lng: 21.4381565, name: "Стакло" },
    { lat: 41.9844232, lng: 21.4386809, name: "Стакло" },
    { lat: 41.9849167, lng: 21.4399509, name: "Стакло" },
    { lat: 41.9817124, lng: 21.4403548, name: "Стакло" },
    { lat: 41.980917, lng: 21.4428841, name: "Стакло" },
    { lat: 41.9782172, lng: 21.4403748, name: "Стакло" },
    { lat: 42.0056945, lng: 21.3866579, name: "Стакло" },
    { lat: 41.1993534, lng: 22.571417, name: "Стакло" },






  ];
  markers: any[] = [];
  title = 'digit';

  constructor(public override sanitizer: DomSanitizer) {
    super(sanitizer);

  }

  /*ngAfterViewInit(): void {
    navigator.geolocation.getCurrentPosition(position => {this.lat=position.coords.latitude});
    navigator.geolocation.getCurrentPosition(position => {this.lng=position.coords.longitude});

    const mapProperties = {
      center: new google.maps.LatLng(this.lat, this.lng),
      zoom: 2,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapProperties);

    this.markers_coordinates.forEach(location => {
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(location.lat,location.lng),
        map: this.map
      });

      this.markers.push(marker);

    });

  }*/

  addMarker() {
    for (var i = 0; i < this.markers_coordinates.length + 1; i++) {
      this.markers.push({
        position: {
          lat: this.markers_coordinates[i].lat,
          lng: this.markers_coordinates[i].lng,
        },
        label: {
          color: 'red',
          text: 'Marker label ' + (i),
        },
        title: this.markers_coordinates[i].name,
        options: { animation: google.maps.Animation.BOUNCE },
      })

    }
  }



  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition(position => { this.lat = position.coords.latitude });
    navigator.geolocation.getCurrentPosition(position => { this.lng = position.coords.longitude });

    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: 41.99646,
        lng: 21.43141
      }
    })
    this.addMarker();

  }

  /*getDistanceMatrix(sendQuery): Observable<any> {
    navigator.geolocation.getCurrentPosition(position => {this.lat=position.coords.latitude});
    navigator.geolocation.getCurrentPosition(position => {this.lng=position.coords.longitude});
      console.log( this.http.get('https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=' + this.lat.toString() + ',' + this.lng.toString() + '&destinations=' + this.markers_coordinates[0].lat.toString() + ',' + this.markers_coordinates[0].lng.toString() + '&key=apikey'));
      return this.http.get('https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=' + this.lat.toString() + ',' + this.lng.toString() + '&destinations=' + this.markers_coordinates[0].lat.toString() + ',' + this.markers_coordinates[0].lng.toString() + '&key=apikey').map((response: Response) => {
        return response.json();
      })


  }*/

  shortestDistance() {
    var index;
    var min = 600000;
    navigator.geolocation.getCurrentPosition(position => { this.lat = position.coords.latitude });
    navigator.geolocation.getCurrentPosition(position => { this.lng = position.coords.longitude });
    for (var i = 0; i < this.markers.length; i++) {
      if (this.getDistanceFromLatLonInKm(this.lat, this.lng, this.markers[i].position.lat, this.markers[i].position.lng) < min) {
        index = i;
        min = this.getDistanceFromLatLonInKm(this.lat, this.lng, this.markers[i].position.lat, this.markers[i].position.lng);
      }
    }
    min = min*1000;
    var str = this.markers_coordinates[index].name + " " + min;
    return str;
  }

  getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180)
  }


}

