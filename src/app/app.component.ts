import {AfterViewInit, Component, Directive, Inject, Input, OnInit} from '@angular/core'
import {GoogleMap, GoogleMapsModule} from '@angular/google-maps';
import { ViewChild } from '@angular/core';

import { Pipe, PipeTransform } from '@angular/core';
import { SelectControlValueAccessor } from '@angular/forms';
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeScript, SafeStyle, SafeUrl } from '@angular/platform-browser';

import { SafePipe } from 'safe-pipe/lib/safe-pipe.pipe';
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
export class AppComponent extends MyPipe implements OnInit, GoogleMapsModule, AfterViewInit{

  public lat;
  public lng;
  public center!: google.maps.LatLngLiteral;
  map: any;
  @ViewChild('map') mapElement: any;
  markers = [
    { lat: 22.33159, lng: 105.63233 },
    { lat: 7.92658, lng: -12.05228 },
    { lat: 48.75606, lng: -118.859 },
    { lat: 5.19334, lng: -67.03352 },
    { lat: 12.09407, lng: 26.31618 },
    { lat: 47.92393, lng: 78.58339 }
  ];
  public checked = true;
  txt = "Hello";
  title = 'digit';

  constructor(public override sanitizer: DomSanitizer){
    super(sanitizer);

  }

  ngAfterViewInit(): void {
    
    const mapProperties = {
      center: new google.maps.LatLng(this.lat, this.lng),
      zoom: 2,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapProperties);

    this.markers.forEach(location => {
      var marker = new google.maps.Marker({
        position: new google.maps.LatLngLiteral(location.lat,location.lng),
        map: this.map
      });
    });
    
  }



  /*addMarker() {
    this.markers.push({
      position: {
        lat: navigator.geolocation.getCurrentPosition(this.get_latitude),
        lng: navigator.geolocation.getCurrentPosition(this.get_longitude),
      },
      label: {
        color: 'red',
        text: 'Marker label ' + (this.markers.length + 1),
      },
      title: 'Marker title ' + (this.markers.length + 1),
      options: { animation: google.maps.Animation.BOUNCE },
    })
  }*/
  
  

  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition(position => {this.lat=position.coords.latitude});
    navigator.geolocation.getCurrentPosition(position => {this.lng=position.coords.longitude});

    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
    })
    //this.addMarker();
    this.getUserLocation();
  }

  



  promena($event){
    console.log("event", $event);
    console.log(this.checked);

    if(this.txt == "Hello"){
      this.txt="Goodbye";
    }else{
      this.txt = "Hello";
    }


  }


  getUserLocation() {
    if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
      });
      
      
    }else {
      alert("You did not allow location")

    }
  }
 
  getURL(){
    navigator.geolocation.getCurrentPosition(position => {this.lat=position.coords.latitude});
    navigator.geolocation.getCurrentPosition(position => {this.lng=position.coords.longitude});
    //return this.transform("https://maps.google.com/maps?q=" + this.lat.toString() + "," + this.lng.toString() + "&hl=es;z=14&amp;output=embed")
    return this.sanitizer.bypassSecurityTrustResourceUrl("https://maps.google.com/maps?q=" + this.lat.toString() + "," + this.lng.toString() + "&hl=es;z=14&amp;&output=embed");
    
  }

}

