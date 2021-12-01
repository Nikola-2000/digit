import {Component, Directive, Inject, Input, OnInit} from '@angular/core'
import { Pipe, PipeTransform } from '@angular/core';
import { SelectControlValueAccessor } from '@angular/forms';
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeScript, SafeStyle, SafeUrl } from '@angular/platform-browser';

import { SafePipe } from 'safe-pipe/lib/safe-pipe.pipe';


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
export class AppComponent extends MyPipe{

  public lat;
  public lng;
  public checked = true;
  txt = "Hello";
  title = 'digit';

  constructor(public override sanitizer: DomSanitizer){
    super(sanitizer);
  }
  
  ngOnInit(): void {
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

