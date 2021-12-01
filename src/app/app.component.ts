import {AfterViewInit, Component, Directive, Inject, Input, OnInit} from '@angular/core'
import {GoogleMap, GoogleMapsModule} from '@angular/google-maps';
import { ViewChild } from '@angular/core';


import { Pipe, PipeTransform } from '@angular/core';
import { SelectControlValueAccessor } from '@angular/forms';
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeScript, SafeStyle, SafeUrl } from '@angular/platform-browser';

import { SafePipe } from 'safe-pipe/lib/safe-pipe.pipe';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
declare var google: any;

@Pipe({
  name: 'safe',
})
export class MyPipe implements PipeTransform{

  constructor(public sanitizer: DomSanitizer) {
    this.sanitizer = sanitizer;
  }

  transform(url){
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
}



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent extends MyPipe implements OnInit, GoogleMapsModule{

  public lat;
  public lng;
  private http!: HttpClient;
  zoom = 0;
  public center!: google.maps.LatLngLiteral;

  //map: any;
  //@ViewChild('map') mapElement: any;

  map: any;
  @ViewChild('map') mapElement: any;
  //@ViewChild(GoogleMap, { static: false })
  //map!: GoogleMap;
  markers_coordinates = [
    { lat: 22.33159, lng: 105.63233 },
    { lat: 7.92658, lng: -12.05228 },
    { lat: 48.75606, lng: -118.859 },
    { lat: 5.19334, lng: -67.03352 },
    { lat: 12.09407, lng: 26.31618 },
    { lat: 47.92393, lng: 78.58339 }
  ];
  markers: any[] = [];

  title = 'digit';

  constructor(public override sanitizer: DomSanitizer){
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
    for(var i = 0; i < this.markers_coordinates.length + 1; i++){
    this.markers.push({
      position: {
        lat: this.markers_coordinates[i].lat,
        lng: this.markers_coordinates[i].lng,
      },
      label: {
        color: 'red',
        text: 'Marker label ' + (i),
      },
      title: 'Marker title ' + (i),
      options: { animation: google.maps.Animation.BOUNCE },
    })
  }
  }



  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition(position => {this.lat=position.coords.latitude});
    navigator.geolocation.getCurrentPosition(position => {this.lng=position.coords.longitude});

    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: 0,
        lng: 0,
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


  getDistance(origin_lat: number, origin_lng: number, destination_lat: number, destination_lng: number): void{

    const matrix = new google.maps.DistanceMatrixService();

    matrix.getDistanceMatrix({
      origins: [new google.maps.LatLng(origin_lat, origin_lng)],
      destinations: [new google.maps.LatLng(destination_lat, destination_lng)],
      travelMode: google.maps.TravelMode.DRIVING,
    }, function(response, status){
        if(status == 'OK'){
          alert(response.rows[0].elements);
        }else{
          alert("Ne e OK" + response.rows[0].elements);
        }
    });
  }

  getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2-lon1);
    var a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d;
  }

  deg2rad(deg) {
    return deg * (Math.PI/180)
  }

  getURL(){
    navigator.geolocation.getCurrentPosition(position => {this.lat=position.coords.latitude});
    navigator.geolocation.getCurrentPosition(position => {this.lng=position.coords.longitude});
    //return this.transform("https://maps.google.com/maps?q=" + this.lat.toString() + "," + this.lng.toString() + "&hl=es;z=14&amp;output=embed")
    return this.sanitizer.bypassSecurityTrustResourceUrl("https://maps.google.com/maps?q=" + this.lat.toString() + "," + this.lng.toString() + "&hl=es;z=14&amp;&output=embed");

  }


  getDistanceMatrixAPIUrl(){
    navigator.geolocation.getCurrentPosition(position => {this.lat=position.coords.latitude});
    navigator.geolocation.getCurrentPosition(position => {this.lng=position.coords.longitude});
    return this.sanitizer.bypassSecurityTrustResourceUrl("https://maps.googleapis.com/maps/api/json?&origins=" + this.lat.toString() + "," + this.lng.toString() + "&destinations=" + this.markers[0].position.lat + "," + this.markers[0].position.lng + "&key=AIzaSyB5_Ynj-cWpIg3qE1JDFSTyQlZa52yP__M")
  }


}

