import { AfterViewInit, Component, Directive, Inject, Input, OnInit } from '@angular/core'
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { ViewChild } from '@angular/core';


import { Pipe, PipeTransform } from '@angular/core';
import { SelectControlValueAccessor } from '@angular/forms';
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeScript, SafeStyle, SafeUrl } from '@angular/platform-browser';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { TransitionCheckState } from '@angular/material/checkbox';
import { MatOptionSelectionChange } from '@angular/material/core';


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
  public selectedOption!: string;
  public printedOption!: string;
  public counter;
  public distance_route;
  public lat;
  public lng;
  public new_center!: google.maps.LatLngLiteral;
  private http!: HttpClient;
  public start;
  public end;
  zoom = 16;
  public center!: google.maps.LatLngLiteral;
  source_directions!:any;
  destination_directions!:any;

  directions_service!: google.maps.DirectionsService;
  directions_render!: google.maps.DirectionsRenderer;
  map!: google.maps.Map;
  options_map: google.maps.MapOptions = {
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    scrollwheel: true,
    disableDefaultUI: false,
    disableDoubleClickZoom: true,
    zoom: this.zoom
  }
  //map: any;
  //@ViewChild('map') mapElement: any;

  //map: any;
  //@ViewChild('map') mapElement: any;
  //@ViewChild(GoogleMap, { static: false })
  //map!: GoogleMap;
  markers_coordinates = [
    { lng: 21.3317412, lat: 42.003185, name: "Staklo" },
    { lng: 21.332638, lat: 42.0072291, name: "Staklo" },
    { lng: 21.3505605, lat: 42.0058601, name: "Staklo" },
    { lng: 21.3549359, lat: 42.006534, name: "Staklo" },
    { lng: 21.3531533, lat: 42.0088306, name: "Staklo" },
    { lng: 21.3578657, lat: 42.006539, name: "Staklo" },
    { lng: 21.3604459, lat: 42.0097048, name: "Staklo" },
    { lng: 21.3614696, lat: 42.0068278, name: "Staklo" },
    { lng: 21.3630266, lat: 42.0038615, name: "Staklo" },
    { lng: 21.3653616, lat: 42.0061279, name: "Staklo" },
    { lng: 21.3656498, lat: 42.0080118, name: "Staklo" },
    { lng: 21.3714756, lat: 42.007663, name: "Staklo" },
    { lng: 21.3718041, lat: 42.0027558, name: "Staklo" },
    { lng: 21.3564162, lat: 42.0178783, name: "Staklo" },
    { lng: 21.3551878, lat: 42.0192049, name: "Staklo" },
    { lng: 21.3533778, lat: 42.0205895, name: "Staklo" },
    { lng: 21.351952, lat: 42.0209671, name: "Staklo" },
    { lng: 21.3633732, lat: 42.0500839, name: "Staklo" },
    { lng: 21.3799761, lat: 42.0256286, name: "Staklo" },
    { lng: 21.3800217, lat: 42.0256735, name: "Staklo" },
    { lng: 21.3833249, lat: 42.0060225, name: "Staklo" },
    { lng: 21.3828762, lat: 42.0046576, name: "Staklo" },
    { lng: 21.3836405, lat: 42.0015786, name: "Staklo" },
    { lng: 21.3847974, lat: 42.0092748, name: "Staklo" },
    { lng: 21.3866579, lat: 42.0056945, name: "Staklo" },
    { lng: 21.3878195, lat: 42.0039897, name: "Staklo" },
    { lng: 21.3895135, lat: 42.0053231, name: "Staklo" },
    { lng: 21.3898348, lat: 42.0060161, name: "Staklo" },
    { lng: 21.3915699, lat: 42.0062211, name: "Staklo" },
    { lng: 21.3898524, lat: 42.0017263, name: "Staklo" },
    { lng: 21.3915382, lat: 41.9995258, name: "Staklo" },
    { lng: 21.3922196, lat: 41.9974343, name: "Staklo" },
    { lng: 21.3947149, lat: 42.0033278, name: "Staklo" },
    { lng: 21.3954958, lat: 42.0044959, name: "Staklo" },
    { lng: 21.3962591, lat: 42.0056907, name: "Staklo" },
    { lng: 21.3954163, lat: 42.0063465, name: "Staklo" },
    { lng: 21.3947045, lat: 42.0068376, name: "Staklo" },
    { lng: 21.398715, lat: 42.0042135, name: "Staklo" },
    { lng: 21.4008917, lat: 42.0057235, name: "Staklo" },
    { lng: 21.3954252, lat: 41.9947036, name: "Staklo" },
    { lng: 21.3997577, lat: 41.9965267, name: "Staklo" },
    { lng: 21.4006764, lat: 41.9998804, name: "Staklo" },
    { lng: 21.4029248, lat: 41.9993942, name: "Staklo" },
    { lng: 21.403989, lat: 41.9979041, name: "Staklo" },
    { lng: 21.4032367, lat: 41.9958611, name: "Staklo" },
    { lng: 21.4060007, lat: 42.0058963, name: "Staklo" },
    { lng: 21.4057302, lat: 41.9964967, name: "Staklo" },
    { lng: 21.4059555, lat: 41.9997558, name: "Staklo" },
    { lng: 21.4073846, lat: 42.0016338, name: "Staklo" },
    { lng: 21.4079334, lat: 42.0025418, name: "Staklo" },
    { lng: 21.4075727, lat: 41.9954414, name: "Staklo" },
    { lng: 21.4100285, lat: 42.0052216, name: "Staklo" },
    { lng: 21.4105342, lat: 42.0033396, name: "Staklo" },
    { lng: 21.4117835, lat: 42.0006992, name: "Staklo" },
    { lng: 21.4150858, lat: 42.0033262, name: "Staklo" },
    { lng: 21.4163129, lat: 42.004796, name: "Staklo" },
    { lng: 21.4105019, lat: 41.9934505, name: "Staklo" },
    { lng: 21.4110825, lat: 41.9907573, name: "Staklo" },
    { lng: 21.4118983, lat: 41.9934918, name: "Staklo" },
    { lng: 21.4126954, lat: 41.9947222, name: "Staklo" },
    { lng: 21.4142667, lat: 41.9951242, name: "Staklo" },
    { lng: 21.4148611, lat: 41.9923118, name: "Staklo" },
    { lng: 21.4156073, lat: 41.9942442, name: "Staklo" },
    { lng: 21.416892, lat: 41.9927821, name: "Staklo" },
    { lng: 21.4173044, lat: 41.9941629, name: "Staklo" },
    { lng: 21.4161332, lat: 41.9983088, name: "Staklo" },
    { lng: 21.4156253, lat: 42.0002919, name: "Staklo" },
    { lng: 21.4188682, lat: 41.9993285, name: "Staklo" },
    { lng: 21.4193621, lat: 42.0024517, name: "Staklo" },
    { lng: 21.4192826, lat: 41.9939234, name: "Staklo" },
    { lng: 21.4207642, lat: 41.9959683, name: "Staklo" },
    { lng: 21.4187762, lat: 41.9957917, name: "Staklo" },
    { lng: 21.4219615, lat: 41.9948176, name: "Staklo" },
    { lng: 21.4216634, lat: 41.9932274, name: "Staklo" },
    { lng: 21.4224716, lat: 41.9979484, name: "Staklo" },
    { lng: 21.4244645, lat: 41.9982125, name: "Staklo" },
    { lng: 21.4228413, lat: 42.0004396, name: "Staklo" },
    { lng: 21.423468, lat: 42.0025899, name: "Staklo" },
    { lng: 21.4262292, lat: 41.9958647, name: "Staklo" },
    { lng: 21.4269709, lat: 41.9959324, name: "Staklo" },
    { lng: 21.4262774, lat: 41.9928513, name: "Staklo" },
    { lng: 21.4281671, lat: 41.9930709, name: "Staklo" },
    { lng: 21.4285447, lat: 41.9997731, name: "Staklo" },
    { lng: 21.4212874, lat: 41.9827469, name: "Staklo" },
    { lng: 21.422617, lat: 41.9822564, name: "Staklo" },
    { lng: 21.4100617, lat: 42.0361049, name: "Staklo" },
    { lng: 21.4374047, lat: 41.9919859, name: "Staklo" },
    { lng: 21.4421926, lat: 41.9918199, name: "Staklo" },
    { lng: 21.4338048, lat: 41.9850892, name: "Staklo" },
    { lng: 21.4381565, lat: 41.9851101, name: "Staklo" },
    { lng: 21.4386809, lat: 41.9844232, name: "Staklo" },
    { lng: 21.4399509, lat: 41.9849167, name: "Staklo" },
    { lng: 21.4403548, lat: 41.9817124, name: "Staklo" },
    { lng: 21.4428841, lat: 41.980917, name: "Staklo" },
    { lng: 21.4403748, lat: 41.9782172, name: "Staklo" },
    { lng: 21.4384706, lat: 41.9758102, name: "Staklo" },
    { lng: 21.4430171, lat: 41.9787883, name: "Staklo" },
    { lng: 21.4430111, lat: 41.9766349, name: "Staklo" },
    { lng: 21.4464308, lat: 41.9804675, name: "Staklo" },
    { lng: 21.4457656, lat: 41.9796363, name: "Staklo" },
    { lng: 21.4461223, lat: 41.9774292, name: "Staklo" },
    { lng: 21.4447035, lat: 41.9754962, name: "Staklo" },
    { lng: 21.441559, lat: 41.9732144, name: "Staklo" },
    { lng: 21.442724, lat: 41.9722848, name: "Staklo" },
    { lng: 21.4543346, lat: 41.9760775, name: "Staklo" },
    { lng: 21.4477296, lat: 41.9889819, name: "Staklo" },
    { lng: 21.4499273, lat: 41.9917115, name: "Staklo" },
    { lng: 21.4502261, lat: 41.9878239, name: "Staklo" },
    { lng: 21.4485045, lat: 41.9858346, name: "Staklo" },
    { lng: 21.4513438, lat: 41.9846117, name: "Staklo" },
    { lng: 21.454877, lat: 41.9896254, name: "Staklo" },
    { lng: 21.4563908, lat: 41.9879236, name: "Staklo" },
    { lng: 21.4588864, lat: 41.9879488, name: "Staklo" },
    { lng: 21.4599933, lat: 41.9871941, name: "Staklo" },
    { lng: 21.4594718, lat: 41.9892758, name: "Staklo" },
    { lng: 21.4592025, lat: 41.9903373, name: "Staklo" },
    { lng: 21.460813, lat: 41.9856645, name: "Staklo" },
    { lng: 21.4629802, lat: 41.9884027, name: "Staklo" },
    { lng: 21.4642972, lat: 41.9909998, name: "Staklo" },
    { lng: 21.4654992, lat: 41.9920016, name: "Staklo" },
    { lng: 21.4644079, lat: 41.9857023, name: "Staklo" },
    { lng: 21.4660728, lat: 41.9862702, name: "Staklo" },
    { lng: 21.4659533, lat: 41.9844142, name: "Staklo" },
    { lng: 21.4683736, lat: 41.9850761, name: "Staklo" },
    { lng: 21.4702437, lat: 41.9826515, name: "Staklo" },
    { lng: 21.470552, lat: 41.981289, name: "Staklo" },
    { lng: 21.4742544, lat: 41.9823748, name: "Staklo" },
    { lng: 21.4760431, lat: 41.9800709, name: "Staklo" },
    { lng: 21.4750911, lat: 41.9792009, name: "Staklo" },
    { lng: 21.4740581, lat: 41.9868306, name: "Staklo" },
    { lng: 21.4776542, lat: 41.987779, name: "Staklo" },
    { lng: 21.4715244, lat: 41.9741725, name: "Staklo" },
    { lng: 21.4728037, lat: 41.9732529, name: "Staklo" },
    { lng: 21.4792765, lat: 41.9856167, name: "Staklo" },
    { lng: 21.4813487, lat: 41.9861288, name: "Staklo" },
    { lng: 21.4818212, lat: 41.9835294, name: "Staklo" },
    { lng: 21.4808479, lat: 41.9808317, name: "Staklo" },
    { lng: 21.4839551, lat: 41.9848756, name: "Staklo" },
    { lng: 21.4869795, lat: 41.9694836, name: "Staklo" },
    { lng: 21.5110101, lat: 41.9402096, name: "Staklo" },
    { lng: 21.5128116, lat: 41.943506, name: "Staklo" },
    { lng: 21.512288, lat: 41.9365586, name: "Staklo" },
    { lng: 21.5151629, lat: 41.9387221, name: "Staklo" },
    { lng: 21.5173297, lat: 41.9419714, name: "Staklo" },
    { lng: 21.5181499, lat: 41.9387272, name: "Staklo" },
    { lng: 21.5220622, lat: 41.9403648, name: "Staklo" },
    { lng: 21.5242677, lat: 41.9316359, name: "Staklo" },
    { lng: 21.4618982, lat: 42.0029611, name: "Staklo" },
    { lng: 21.4639228, lat: 42.0024634, name: "Staklo" },
    { lng: 21.4659075, lat: 42.0042859, name: "Staklo" },
    { lng: 21.4613511, lat: 42.0109428, name: "Staklo" },
    { lng: 21.4592305, lat: 42.0113254, name: "Staklo" },
    { lng: 21.4564684, lat: 42.0149675, name: "Staklo" },
    { lng: 21.4520576, lat: 42.0155312, name: "Staklo" },
    { lng: 21.5116038, lat: 41.9951347, name: "Staklo" },
    { lng: 21.4925918, lat: 42.003549, name: "Staklo" },
    { lng: 21.4934016, lat: 41.998024, name: "Staklo" },
    { lng: 21.4962323, lat: 41.9970208, name: "Staklo" },
    { lng: 21.5011854, lat: 42.0054575, name: "Staklo" },
    { lng: 21.5033391, lat: 42.0026286, name: "Staklo" },
    { lng: 21.5074692, lat: 41.9928375, name: "Staklo" },
    { lng: 21.5090812, lat: 41.9951256, name: "Staklo" },
    { lng: 21.510225, lat: 41.9968212, name: "Staklo" },
    { lng: 21.5095509, lat: 42.0113513, name: "Staklo" },
    { lng: 21.5156994, lat: 42.0280129, name: "Staklo" },
    { lng: 21.444746, lat: 42.0140617, name: "Staklo" },
    { lng: 21.4402319, lat: 42.0134458, name: "Staklo" },
    { lng: 21.4345608, lat: 42.0159586, name: "Staklo" },
    { lng: 21.4344388, lat: 42.0177136, name: "Staklo" },
    { lng: 21.4327484, lat: 42.0176646, name: "Staklo" },
    { lng: 21.4320876, lat: 42.0204, name: "Staklo" },
    { lng: 21.4343187, lat: 42.0201984, name: "Staklo" },
    { lng: 21.4341972, lat: 42.0227259, name: "Staklo" },
    { lng: 21.4387307, lat: 42.0217833, name: "Staklo" },
    { lng: 21.4387042, lat: 42.0233454, name: "Staklo" },
    { lng: 21.4368603, lat: 42.0246318, name: "Staklo" },
    { lng: 21.4418445, lat: 42.0232869, name: "Staklo" },
    { lng: 21.4450455, lat: 42.0314408, name: "Staklo" },
    { lng: 21.4535386, lat: 42.0289318, name: "Staklo" },
    { lng: 21.4475749, lat: 42.0389612, name: "Staklo" },
    { lng: 21.449884, lat: 42.0485301, name: "Staklo" },
    { lng: 21.4505162, lat: 42.0517074, name: "Staklo" },
    { lng: 21.4500692, lat: 42.0585917, name: "Staklo" },
    { lng: 21.4510844, lat: 42.0591752, name: "Staklo" },
    { lng: 21.4501032, lat: 42.0597039, name: "Staklo" },
    { lng: 21.4512052, lat: 42.0608955, name: "Staklo" },
    { lng: 21.4511515, lat: 42.0619832, name: "Staklo" },
    { lng: 21.4513221, lat: 42.0624698, name: "Staklo" },
    { lng: 21.4482384, lat: 42.0737324, name: "Staklo" },
    { lng: 21.6811256, lat: 42.1246364, name: "Staklo" },
    { lng: 21.6986668, lat: 42.1287007, name: "Staklo" },
    { lng: 21.6987821, lat: 42.1286908, name: "Staklo" },
    { lng: 21.7052437, lat: 42.1319968, name: "Staklo" },
    { lng: 21.7071616, lat: 42.1309434, name: "Staklo" },
    { lng: 21.7098342, lat: 42.1306285, name: "Staklo" },
    { lng: 21.7036646, lat: 42.1378373, name: "Staklo" },
    { lng: 21.7095038, lat: 42.1377896, name: "Staklo" },
    { lng: 21.7220267, lat: 42.1394137, name: "Staklo" },
    { lng: 21.7247765, lat: 42.1392878, name: "Staklo" },
    { lng: 21.7212592, lat: 42.1344572, name: "Staklo" },
    { lng: 21.7260658, lat: 42.1324211, name: "Staklo" },
    { lng: 21.7282969, lat: 42.1313164, name: "Staklo" },
    { lng: 21.723848, lat: 42.1247499, name: "Staklo" },
    { lng: 21.7306583, lat: 42.1202593, name: "Staklo" },
    { lng: 21.7302027, lat: 42.1183155, name: "Staklo" },
    { lng: 21.7330466, lat: 42.1222772, name: "Staklo" },
    { lng: 21.7109467, lat: 42.168462, name: "Staklo" },
    { lng: 21.6905405, lat: 42.1859857, name: "Staklo" },
    { lng: 21.7147125, lat: 42.2113677, name: "Staklo" },
    { lng: 21.7435883, lat: 42.1621488, name: "Staklo" },
    { lng: 21.7518408, lat: 42.1631494, name: "Staklo" },
    { lng: 21.8514286, lat: 42.2767642, name: "Staklo" },
    { lng: 22.1677694, lat: 42.0055565, name: "Staklo" },
    { lng: 22.1798085, lat: 42.0019855, name: "Staklo" },
    { lng: 22.1808294, lat: 41.9984545, name: "Staklo" },
    { lng: 22.1801047, lat: 41.9973912, name: "Staklo" },
    { lng: 22.18061, lat: 41.9964573, name: "Staklo" },
    { lng: 22.1820343, lat: 41.9959736, name: "Staklo" },
    { lng: 22.1838021, lat: 41.9954946, name: "Staklo" },
    { lng: 22.1839414, lat: 41.997196, name: "Staklo" },
    { lng: 22.1881645, lat: 41.990859, name: "Staklo" },
    { lng: 21.7793336, lat: 41.7721585, name: "Staklo" },
    { lng: 21.7682825, lat: 41.7286866, name: "Staklo" },
    { lng: 21.7698724, lat: 41.7276156, name: "Staklo" },
    { lng: 21.7844183, lat: 41.725446, name: "Staklo" },
    { lng: 21.7882321, lat: 41.722572, name: "Staklo" },
    { lng: 21.7879623, lat: 41.7190483, name: "Staklo" },
    { lng: 21.7875576, lat: 41.7150843, name: "Staklo" },
    { lng: 21.7862385, lat: 41.7151429, name: "Staklo" },
    { lng: 21.7840883, lat: 41.7160574, name: "Staklo" },
    { lng: 21.78335, lat: 41.7157581, name: "Staklo" },
    { lng: 21.7848073, lat: 41.7167264, name: "Staklo" },
    { lng: 21.7831109, lat: 41.7175001, name: "Staklo" },
    { lng: 21.778001, lat: 41.7174968, name: "Staklo" },
    { lng: 21.7771373, lat: 41.7185432, name: "Staklo" },
    { lng: 21.7774751, lat: 41.7188271, name: "Staklo" },
    { lng: 21.77623, lat: 41.7172742, name: "Staklo" },
    { lng: 21.774107, lat: 41.7164056, name: "Staklo" },
    { lng: 21.7728863, lat: 41.7159695, name: "Staklo" },
    { lng: 21.7721272, lat: 41.7163819, name: "Staklo" },
    { lng: 21.7712716, lat: 41.715489, name: "Staklo" },
    { lng: 21.7692457, lat: 41.718125, name: "Staklo" },
    { lng: 21.7678462, lat: 41.7179408, name: "Staklo" },
    { lng: 21.7667189, lat: 41.7173403, name: "Staklo" },
    { lng: 21.7656622, lat: 41.7147457, name: "Staklo" },
    { lng: 21.7671046, lat: 41.714996, name: "Staklo" },
    { lng: 21.7651574, lat: 41.7186993, name: "Staklo" },
    { lng: 21.7645511, lat: 41.7169155, name: "Staklo" },
    { lng: 21.7645216, lat: 41.7158804, name: "Staklo" },
    { lng: 21.7628825, lat: 41.7179338, name: "Staklo" },
    { lng: 21.761945, lat: 41.7173201, name: "Staklo" },
    { lng: 21.7694153, lat: 41.7122663, name: "Staklo" },
    { lng: 21.7640454, lat: 41.7117657, name: "Staklo" },
    { lng: 21.7630262, lat: 41.7105643, name: "Staklo" },
    { lng: 21.7618246, lat: 41.7112852, name: "Staklo" },
    { lng: 21.7594687, lat: 41.7063093, name: "Staklo" },
    { lng: 21.7595706, lat: 41.7057847, name: "Staklo" },
    { lng: 21.7586126, lat: 41.7026101, name: "Staklo" },
    { lng: 21.7578509, lat: 41.7025059, name: "Staklo" },
    { lng: 21.7545929, lat: 41.6990837, name: "Staklo" },
    { lng: 22.3998849, lat: 41.9096385, name: "Staklo" },
    { lng: 22.4024973, lat: 41.9098142, name: "Staklo" },
    { lng: 22.4045892, lat: 41.9146324, name: "Staklo" },
    { lng: 22.408575, lat: 41.9140624, name: "Staklo" },
    { lng: 22.4086681, lat: 41.9154031, name: "Staklo" },
    { lng: 22.4119632, lat: 41.9153569, name: "Staklo" },
    { lng: 22.4122422, lat: 41.9136204, name: "Staklo" },
    { lng: 22.4100453, lat: 41.9192956, name: "Staklo" },
    { lng: 22.4112735, lat: 41.9210669, name: "Staklo" },
    { lng: 22.4108041, lat: 41.9217824, name: "Staklo" },
    { lng: 22.4142967, lat: 41.9151145, name: "Staklo" },
    { lng: 22.4160938, lat: 41.9130416, name: "Staklo" },
    { lng: 22.4295667, lat: 41.9148739, name: "Staklo" },
    { lng: 22.5000246, lat: 41.8865822, name: "Staklo" },
    { lng: 22.5016286, lat: 41.8871373, name: "Staklo" },
    { lng: 22.5046438, lat: 41.8813011, name: "Staklo" },
    { lng: 22.5062913, lat: 41.8838887, name: "Staklo" },
    { lng: 22.5079748, lat: 41.885356, name: "Staklo" },
    { lng: 22.5107049, lat: 41.881128, name: "Staklo" },
    { lng: 22.5133903, lat: 41.886339, name: "Staklo" },
    { lng: 22.5168671, lat: 41.8823356, name: "Staklo" },
    { lng: 22.1358541, lat: 41.7738171, name: "Staklo" },
    { lng: 22.141174, lat: 41.7728885, name: "Staklo" },
    { lng: 22.1788687, lat: 41.7474925, name: "Staklo" },
    { lng: 22.1850806, lat: 41.7601775, name: "Staklo" },
    { lng: 22.1832527, lat: 41.7360969, name: "Staklo" },
    { lng: 22.2035858, lat: 41.7815247, name: "Staklo" },
    { lng: 22.1896664, lat: 41.7410774, name: "Staklo" },
    { lng: 22.19049, lat: 41.746577, name: "Staklo" },
    { lng: 22.1906168, lat: 41.7503872, name: "Staklo" },
    { lng: 22.1942285, lat: 41.7384275, name: "Staklo" },
    { lng: 22.1921325, lat: 41.7395278, name: "Staklo" },
    { lng: 22.1936391, lat: 41.7427086, name: "Staklo" },
    { lng: 22.1924615, lat: 41.7455382, name: "Staklo" },
    { lng: 22.1922402, lat: 41.746854, name: "Staklo" },
    { lng: 22.1954641, lat: 41.7445604, name: "Staklo" },
    { lng: 22.1961239, lat: 41.7452408, name: "Staklo" },
    { lng: 22.1961375, lat: 41.7458614, name: "Staklo" },
    { lng: 22.1983583, lat: 41.7443253, name: "Staklo" },
    { lng: 22.1978299, lat: 41.7439991, name: "Staklo" },
    { lng: 22.1985817, lat: 41.7420277, name: "Staklo" },
    { lng: 22.1989935, lat: 41.74937, name: "Staklo" },
    { lng: 22.199307, lat: 41.7502132, name: "Staklo" },
    { lng: 22.2000848, lat: 41.7499731, name: "Staklo" },
    { lng: 22.20178, lat: 41.7489651, name: "Staklo" },
    { lng: 22.2093853, lat: 41.7514061, name: "Staklo" },
    { lng: 22.2025262, lat: 41.7383561, name: "Staklo" },
    { lng: 22.202106, lat: 41.7344773, name: "Staklo" },
    { lng: 22.2048261, lat: 41.7592741, name: "Staklo" },
    { lng: 22.1999479, lat: 41.7623689, name: "Staklo" },
    { lng: 22.1965202, lat: 41.7521409, name: "Staklo" },
    { lng: 22.1949497, lat: 41.7535306, name: "Staklo" },
    { lng: 22.2405293, lat: 41.6364904, name: "Staklo" },
    { lng: 22.6434019, lat: 41.4545172, name: "Staklo" },
    { lng: 22.6433697, lat: 41.4547222, name: "Staklo" },
    { lng: 22.6446253, lat: 41.4536335, name: "Staklo" },
    { lng: 22.6451787, lat: 41.4530085, name: "Staklo" },
    { lng: 22.633408, lat: 41.4437863, name: "Staklo" },
    { lng: 22.6340518, lat: 41.4413225, name: "Staklo" },
    { lng: 22.6363433, lat: 41.4397478, name: "Staklo" },
    { lng: 22.6365162, lat: 41.4383886, name: "Staklo" },
    { lng: 22.6363515, lat: 41.4451099, name: "Staklo" },
    { lng: 22.6385456, lat: 41.4418607, name: "Staklo" },
    { lng: 22.6386604, lat: 41.4414325, name: "Staklo" },
    { lng: 22.640018, lat: 41.4414551, name: "Staklo" },
    { lng: 22.6400174, lat: 41.4434036, name: "Staklo" },
    { lng: 22.6400007, lat: 41.4433875, name: "Staklo" },
    { lng: 22.6399893, lat: 41.4433639, name: "Staklo" },
    { lng: 22.6399839, lat: 41.4433327, name: "Staklo" },
    { lng: 22.6405894, lat: 41.4436608, name: "Staklo" },
    { lng: 22.6409224, lat: 41.445655, name: "Staklo" },
    { lng: 22.641137, lat: 41.4430115, name: "Staklo" },
    { lng: 22.6417565, lat: 41.4434828, name: "Staklo" },
    { lng: 22.6421895, lat: 41.4441591, name: "Staklo" },
    { lng: 22.6430707, lat: 41.4433798, name: "Staklo" },
    { lng: 22.6439117, lat: 41.4428478, name: "Staklo" },
    { lng: 22.643104, lat: 41.4423627, name: "Staklo" },
    { lng: 22.642243, lat: 41.4416891, name: "Staklo" },
    { lng: 22.6440108, lat: 41.440783, name: "Staklo" },
    { lng: 22.6450649, lat: 41.4412998, name: "Staklo" },
    { lng: 22.6446683, lat: 41.4396864, name: "Staklo" },
    { lng: 22.6449835, lat: 41.4389112, name: "Staklo" },
    { lng: 22.6460897, lat: 41.4418004, name: "Staklo" },
    { lng: 22.646956, lat: 41.4407335, name: "Staklo" },
    { lng: 22.6473234, lat: 41.440257, name: "Staklo" },
    { lng: 22.6473127, lat: 41.4390284, name: "Staklo" },
    { lng: 22.6410992, lat: 41.4387056, name: "Staklo" },
    { lng: 22.6409892, lat: 41.4375695, name: "Staklo" },
    { lng: 22.6399104, lat: 41.436325, name: "Staklo" },
    { lng: 22.6429653, lat: 41.439141, name: "Staklo" },
    { lng: 22.6431864, lat: 41.4362042, name: "Staklo" },
    { lng: 22.648993, lat: 41.4401126, name: "Staklo" },
    { lng: 22.6501759, lat: 41.4363927, name: "Staklo" },
    { lng: 22.6495332, lat: 41.4354797, name: "Staklo" },
    { lng: 22.6480273, lat: 41.4337438, name: "Staklo" },
    { lng: 22.6509938, lat: 41.4324568, name: "Staklo" },
    { lng: 22.6508436, lat: 41.4318757, name: "Staklo" },
    { lng: 22.6480145, lat: 41.4300296, name: "Staklo" },
    { lng: 22.6496902, lat: 41.429696, name: "Staklo" },
    { lng: 22.6500603, lat: 41.4285859, name: "Staklo" },
    { lng: 22.6520327, lat: 41.4133869, name: "Staklo" },
    { lng: 21.5351844, lat: 41.3495567, name: "Staklo" },
    { lng: 21.5365904, lat: 41.3508304, name: "Staklo" },
    { lng: 21.5380385, lat: 41.3478889, name: "Staklo" },
    { lng: 21.5392107, lat: 41.3507256, name: "Staklo" },
    { lng: 21.5396828, lat: 41.3503169, name: "Staklo" },
    { lng: 21.5431589, lat: 41.352093, name: "Staklo" },
    { lng: 21.5437204, lat: 41.3530822, name: "Staklo" },
    { lng: 21.5415327, lat: 41.3541049, name: "Staklo" },
    { lng: 21.5419141, lat: 41.3450317, name: "Staklo" },
    { lng: 21.5413646, lat: 41.343676, name: "Staklo" },
    { lng: 21.540551, lat: 41.3367068, name: "Staklo" },
    { lng: 21.540897, lat: 41.3368155, name: "Staklo" },
    { lng: 21.5445466, lat: 41.3352473, name: "Staklo" },
    { lng: 21.5455269, lat: 41.3426886, name: "Staklo" },
    { lng: 21.5477126, lat: 41.3425758, name: "Staklo" },
    { lng: 21.5481149, lat: 41.3427982, name: "Staklo" },
    { lng: 21.5484379, lat: 41.3437475, name: "Staklo" },
    { lng: 21.5498898, lat: 41.3455026, name: "Staklo" },
    { lng: 21.5509054, lat: 41.3447495, name: "Staklo" },
    { lng: 21.5519974, lat: 41.3425434, name: "Staklo" },
    { lng: 21.5553609, lat: 41.3328324, name: "Staklo" },
    { lng: 21.5553529, lat: 41.3327579, name: "Staklo" },
    { lng: 21.5558487, lat: 41.3416816, name: "Staklo" },
    { lng: 21.5570098, lat: 41.3420632, name: "Staklo" },
    { lng: 21.5530839, lat: 41.3447863, name: "Staklo" },
    { lng: 21.5546583, lat: 41.3441872, name: "Staklo" },
    { lng: 21.555261, lat: 41.345184, name: "Staklo" },
    { lng: 21.5560656, lat: 41.3447873, name: "Staklo" },
    { lng: 21.553578, lat: 41.3464956, name: "Staklo" },
    { lng: 21.5515425, lat: 41.3482853, name: "Staklo" },
    { lng: 21.5493276, lat: 41.3413716, name: "Staklo" },
    { lng: 21.5493303, lat: 41.3412266, name: "Staklo" },
    { lng: 21.5508173, lat: 41.3394722, name: "Staklo" },
    { lng: 21.5620525, lat: 41.341046, name: "Staklo" },
    { lng: 21.5605255, lat: 41.3434882, name: "Staklo" },
    { lng: 21.5643232, lat: 41.3425482, name: "Staklo" },
    { lng: 21.5646277, lat: 41.3408951, name: "Staklo" },
    { lng: 21.5683238, lat: 41.3400221, name: "Staklo" },
    { lng: 21.5563331, lat: 41.3473087, name: "Staklo" },
    { lng: 21.5634201, lat: 41.3447616, name: "Staklo" },
    { lng: 21.5620734, lat: 41.346019, name: "Staklo" },
    { lng: 21.5603527, lat: 41.3470508, name: "Staklo" },
    { lng: 21.5606068, lat: 41.3481874, name: "Staklo" },
    { lng: 21.5613002, lat: 41.349865, name: "Staklo" },
    { lng: 21.5614042, lat: 41.3527894, name: "Staklo" },
    { lng: 21.5587426, lat: 41.3547711, name: "Staklo" },
    { lng: 21.5621654, lat: 41.3557899, name: "Staklo" },
    { lng: 21.5645467, lat: 41.3479151, name: "Staklo" },
    { lng: 21.5648119, lat: 41.3455443, name: "Staklo" },
    { lng: 21.566943, lat: 41.3444011, name: "Staklo" },
    { lng: 21.5681084, lat: 41.3456545, name: "Staklo" },
    { lng: 21.5714741, lat: 41.3508381, name: "Staklo" },
    { lng: 21.2260916, lat: 41.0358711, name: "Staklo" },
    { lng: 21.2558159, lat: 41.0431302, name: "Staklo" },
    { lng: 21.2627084, lat: 41.0342201, name: "Staklo" },
    { lng: 21.2702743, lat: 41.0405795, name: "Staklo" },
    { lng: 21.2942775, lat: 41.0373501, name: "Staklo" },
    { lng: 21.3105862, lat: 41.0332622, name: "Staklo" },
    { lng: 21.3107759, lat: 41.0314559, name: "Staklo" },
    { lng: 21.3113056, lat: 41.0291317, name: "Staklo" },
    { lng: 21.3097124, lat: 41.0272558, name: "Staklo" },
    { lng: 21.3081996, lat: 41.0264889, name: "Staklo" },
    { lng: 21.3096077, lat: 41.0238677, name: "Staklo" },
    { lng: 21.3121719, lat: 41.0230159, name: "Staklo" },
    { lng: 21.3122271, lat: 41.0238692, name: "Staklo" },
    { lng: 21.3114895, lat: 41.0252736, name: "Staklo" },
    { lng: 21.3134173, lat: 41.0257496, name: "Staklo" },
    { lng: 21.3137817, lat: 41.0300279, name: "Staklo" },
    { lng: 21.3144362, lat: 41.0298094, name: "Staklo" },
    { lng: 21.3146687, lat: 41.0293933, name: "Staklo" },
    { lng: 21.3163403, lat: 41.0283033, name: "Staklo" },
    { lng: 21.316643, lat: 41.025271, name: "Staklo" },
    { lng: 21.3172913, lat: 41.0242091, name: "Staklo" },
    { lng: 21.3197916, lat: 41.0211264, name: "Staklo" },
    { lng: 21.3212416, lat: 41.0245941, name: "Staklo" },
    { lng: 21.3237706, lat: 41.0244392, name: "Staklo" },
    { lng: 21.3288625, lat: 41.0230186, name: "Staklo" },
    { lng: 21.3305013, lat: 41.0227626, name: "Staklo" },
    { lng: 21.3287096, lat: 41.0250415, name: "Staklo" },
    { lng: 21.3344925, lat: 41.0227213, name: "Staklo" },
    { lng: 21.3333364, lat: 41.025681, name: "Staklo" },
    { lng: 21.335161, lat: 41.0276695, name: "Staklo" },
    { lng: 21.3370095, lat: 41.0232742, name: "Staklo" },
    { lng: 21.3393095, lat: 41.023255, name: "Staklo" },
    { lng: 21.3478338, lat: 41.0134917, name: "Staklo" },
    { lng: 21.3462218, lat: 41.0130627, name: "Staklo" },
    { lng: 21.3459404, lat: 41.0047097, name: "Staklo" },
    { lng: 21.3255205, lat: 41.0318121, name: "Staklo" },
    { lng: 21.3353886, lat: 41.0305911, name: "Staklo" },
    { lng: 21.3375002, lat: 41.0334641, name: "Staklo" },
    { lng: 21.3391264, lat: 41.0345632, name: "Staklo" },
    { lng: 21.3391551, lat: 41.0355369, name: "Staklo" },
    { lng: 21.3421181, lat: 41.0334216, name: "Staklo" },
    { lng: 21.3442086, lat: 41.0348461, name: "Staklo" },
    { lng: 21.3447948, lat: 41.0361529, name: "Staklo" },
    { lng: 21.3462817, lat: 41.0367631, name: "Staklo" },
    { lng: 21.3466701, lat: 41.0345416, name: "Staklo" },
    { lng: 21.3449035, lat: 41.0286684, name: "Staklo" },
    { lng: 21.3439191, lat: 41.0276766, name: "Staklo" },
    { lng: 21.3433536, lat: 41.0267094, name: "Staklo" },
    { lng: 21.345048, lat: 41.0267519, name: "Staklo" },
    { lng: 21.3468669, lat: 41.0441774, name: "Staklo" },
    { lng: 21.3469795, lat: 41.0469568, name: "Staklo" },
    { lng: 21.3474194, lat: 41.0472683, name: "Staklo" },
    { lng: 21.4134838, lat: 42.0016323, name: "Staklo" },
    { lng: 21.4099269, lat: 41.9957187, name: "Staklo" },
    { lng: 21.4175781, lat: 41.9946204, name: "Staklo" },
    { lng: 21.4223964, lat: 41.996872, name: "Staklo" },
    { lng: 21.4061087, lat: 41.9980378, name: "Staklo" },
    { lng: 21.4202102, lat: 41.9968557, name: "Staklo" },
    { lng: 21.4121742, lat: 41.9974789, name: "Staklo" },
    { lng: 21.3970088, lat: 41.9968634, name: "Staklo" },
    { lng: 21.3805478, lat: 42.0032273, name: "Staklo" },
    { lng: 21.3742265, lat: 42.0031597, name: "Staklo" },
    { lng: 21.3848635, lat: 41.9991325, name: "Staklo" },
    { lng: 21.3875323, lat: 41.9986541, name: "Staklo" },
    { lng: 21.396782, lat: 41.9953799, name: "Staklo" },
    { lng: 21.3980476, lat: 41.9981141, name: "Staklo" },
    { lng: 21.3789896, lat: 41.9985119, name: "Staklo" },
    { lng: 21.354525, lat: 42.0047736, name: "Staklo" },
    { lng: 21.3611291, lat: 42.0023134, name: "Staklo" },
    { lng: 21.341896, lat: 42.0050617, name: "Staklo" },
    { lng: 21.3429263, lat: 42.0065476, name: "Staklo" },
    { lng: 21.3482285, lat: 42.0087571, name: "Staklo" },
    { lng: 22.1767754, lat: 42.0778503, name: "Staklo" },
    { lng: 22.1802716, lat: 42.0771455, name: "Staklo" },
    { lng: 22.181582, lat: 42.0777337, name: "Staklo" },
    { lng: 22.0914688, lat: 41.4850615, name: "Staklo" },
    { lng: 22.0823212, lat: 41.4824672, name: "Staklo" },
    { lng: 22.0925107, lat: 41.4935863, name: "Staklo" },
    { lng: 22.0902332, lat: 41.4828274, name: "Staklo" },
    { lng: 22.079053, lat: 41.4828956, name: "Staklo" },
    { lng: 22.0872067, lat: 41.477218, name: "Staklo" },
    { lng: 22.0909475, lat: 41.4833268, name: "Staklo" },
    { lng: 22.0915361, lat: 41.4830455, name: "Staklo" },
    { lng: 22.0914503, lat: 41.4834192, name: "Staklo" },
    { lng: 22.1060563, lat: 41.4948721, name: "Staklo" },
    { lng: 21.392618, lat: 42.0014417, name: "Staklo" },
    { lng: 21.3984005, lat: 42.0006886, name: "Staklo" },
    { lng: 21.4024259, lat: 42.000262, name: "Staklo" },
    { lng: 21.3892492, lat: 41.9991029, name: "Staklo" },
    { lng: 21.3895442, lat: 42.0005455, name: "Staklo" },
    { lng: 21.363155, lat: 42.0026714, name: "Staklo" },
    { lng: 21.5227256, lat: 41.9369673, name: "Staklo" },
    { lng: 21.5228047, lat: 41.9369474, name: "Staklo" },
    { lng: 21.5199773, lat: 41.9378689, name: "Staklo" },
    { lng: 21.5175445, lat: 41.9379332, name: "Staklo" },
    { lng: 21.5137892, lat: 41.9400552, name: "Staklo" },
    { lng: 21.5110015, lat: 41.9406866, name: "Staklo" },
    { lng: 21.5180664, lat: 41.9429251, name: "Staklo" },
    { lng: 21.5210275, lat: 41.9325861, name: "Staklo" },
    { lng: 21.5216841, lat: 41.932249, name: "Staklo" },
    { lng: 21.5135941, lat: 41.9361569, name: "Staklo" },
    { lng: 21.4084311, lat: 41.9756259, name: "Staklo" },
    { lng: 22.4631655, lat: 41.6326206, name: "Staklo" },
    { lng: 22.4744958, lat: 41.6325804, name: "Staklo" },
    { lng: 22.4600062, lat: 41.6474446, name: "Staklo" },
    { lng: 22.4824463, lat: 41.6305193, name: "Staklo" },
    { lng: 22.4598642, lat: 41.6353951, name: "Staklo" },
    { lng: 22.4669797, lat: 41.6345216, name: "Staklo" },
    { lng: 22.4780039, lat: 41.6320056, name: "Staklo" },
    { lng: 22.4702736, lat: 41.6357723, name: "Staklo" },
    { lng: 22.4690469, lat: 41.6385097, name: "Staklo" },
    { lng: 22.4657244, lat: 41.6347081, name: "Staklo" },
    { lng: 22.4580871, lat: 41.6460695, name: "Staklo" },
    { lng: 22.4599997, lat: 41.6411316, name: "Staklo" },
    { lng: 22.4622015, lat: 41.6374172, name: "Staklo" },
    { lng: 22.5720566, lat: 41.202811, name: "Staklo" },
    { lng: 22.571417, lat: 41.1993534, name: "Staklo" },
    { lng: 22.5782878, lat: 41.1552158, name: "Staklo" },
    { lng: 22.577502, lat: 41.2034582, name: "Staklo" },
    { lng: 22.5754798, lat: 41.2029174, name: "Staklo" },
    { lng: 21.4173228, lat: 41.9972713, name: "Staklo" },
    { lng: 22.5613687, lat: 41.3185688, name: "Staklo" },
    { lng: 22.4755557, lat: 41.3321233, name: "Staklo" },
    { lng: 22.5634516, lat: 41.3174453, name: "Staklo" },
    { lng: 22.5598221, lat: 41.3184625, name: "Staklo" },
    { lng: 22.3374981, lat: 42.2076948, name: "Staklo" },
    { lng: 22.336181, lat: 42.2049001, name: "Staklo" },
    { lng: 22.3354094, lat: 42.202221, name: "Staklo" },
    { lng: 22.3316351, lat: 42.2003386, name: "Staklo" },
    { lng: 22.3103169, lat: 42.191926, name: "Staklo" },
    { lng: 22.8827975, lat: 41.7630776, name: "Staklo" },
    { lng: 22.8869193, lat: 41.7619736, name: "Staklo" },
    { lng: 22.8836493, lat: 41.7617715, name: "Staklo" },
    { lng: 22.8873318, lat: 41.7617788, name: "Staklo" },
    { lng: 22.8920451, lat: 41.7608016, name: "Staklo" },
    { lng: 22.8865088, lat: 41.7608438, name: "Staklo" },
    { lng: 22.8871445, lat: 41.7620953, name: "Staklo" },
    { lng: 22.8854327, lat: 41.7623243, name: "Staklo" },
    { lng: 22.8931793, lat: 41.7626751, name: "Staklo" },
    { lng: 22.8524044, lat: 41.7034913, name: "Staklo" },
    { lng: 22.8536546, lat: 41.7065645, name: "Staklo" },
    { lng: 22.8465644, lat: 41.7067722, name: "Staklo" },
    { lng: 22.8575687, lat: 41.707156, name: "Staklo" },
    { lng: 22.8549527, lat: 41.7122027, name: "Staklo" },
    { lng: 22.8518567, lat: 41.7091818, name: "Staklo" },
    { lng: 22.8529858, lat: 41.7051534, name: "Staklo" },
    { lng: 22.8551224, lat: 41.7066226, name: "Staklo" },
    { lng: 22.8565118, lat: 41.7076299, name: "Staklo" },
    { lng: 22.8544077, lat: 41.7089278, name: "Staklo" },
    { lng: 22.8596958, lat: 41.700547, name: "Staklo" },
    { lng: 22.4905139, lat: 41.1715018, name: "Staklo" },
    { lng: 22.4941574, lat: 41.1584265, name: "Staklo" },
    { lng: 22.4962112, lat: 41.1623846, name: "Staklo" },
    { lng: 22.5046524, lat: 41.1650255, name: "Staklo" },
    { lng: 22.5225342, lat: 41.1476317, name: "Staklo" },
    { lng: 22.5052052, lat: 41.1407917, name: "Staklo" },
    { lng: 22.4986486, lat: 41.1481056, name: "Staklo" },
    { lng: 22.5030671, lat: 41.1399561, name: "Staklo" },
    { lng: 22.4349486, lat: 41.3080451, name: "Staklo" },
    { lng: 22.4707075, lat: 41.2581478, name: "Staklo" },
    { lng: 22.709143, lat: 41.2134422, name: "Staklo" },
    { lng: 22.7220519, lat: 41.1868766, name: "Staklo" },
    { lng: 22.7231727, lat: 41.1837953, name: "Staklo" },
    { lng: 22.7229433, lat: 41.1833063, name: "Staklo" },
    { lng: 22.7229688, lat: 41.1832695, name: "Staklo" },
    { lng: 22.7240058, lat: 41.1807395, name: "Staklo" },
    { lng: 22.7428427, lat: 41.1725004, name: "Staklo" },
    { lng: 22.7427408, lat: 41.1723591, name: "Staklo" },
    { lng: 21.9306815, lat: 41.8660938, name: "Staklo" },
    { lng: 21.9371932, lat: 41.8652707, name: "Staklo" },
    { lng: 21.9419065, lat: 41.8649361, name: "Staklo" },
    { lng: 21.9410727, lat: 41.8696299, name: "Staklo" },
    { lng: 21.9454605, lat: 41.8630589, name: "Staklo" },
    { lng: 21.9455195, lat: 41.8630509, name: "Staklo" },
    { lng: 20.9470034, lat: 41.9360033, name: "Staklo" },
    { lng: 20.9789783, lat: 41.8935679, name: "Staklo" },
    { lng: 21.0186091, lat: 41.9063556, name: "Staklo" },
    { lng: 21.0146105, lat: 41.9286768, name: "Staklo" },
    { lng: 21.0133552, lat: 41.9321728, name: "Staklo" },
    { lng: 21.0218829, lat: 41.8957526, name: "Staklo" },
    { lng: 20.9630567, lat: 41.9063409, name: "Staklo" },
    { lng: 20.9820741, lat: 41.9676095, name: "Staklo" },
    { lng: 21.1087542, lat: 42.1053583, name: "Staklo" },
    { lng: 21.1114713, lat: 42.1077939, name: "Staklo" },
    { lng: 21.031432, lat: 42.0604497, name: "Staklo" },
    { lng: 21.0772007, lat: 42.1016948, name: "Staklo" },
    { lng: 21.078433, lat: 42.1056134, name: "Staklo" },
    { lng: 21.0548696, lat: 42.0799091, name: "Staklo" },
    { lng: 21.0539147, lat: 42.078191, name: "Staklo" },
    { lng: 21.0533541, lat: 42.0772752, name: "Staklo" },
    { lng: 21.0417945, lat: 42.0686217, name: "Staklo" },
    { lng: 21.0427408, lat: 42.0692841, name: "Staklo" },
    { lng: 20.9792155, lat: 42.0079643, name: "Staklo" },
    { lng: 20.9783211, lat: 42.0081168, name: "Staklo" },
    { lng: 20.97744, lat: 42.0084079, name: "Staklo" },
    { lng: 20.9614679, lat: 41.9940475, name: "Staklo" },
    { lng: 20.9721995, lat: 42.0073238, name: "Staklo" },
    { lng: 20.9727211, lat: 42.0080999, name: "Staklo" },
    { lng: 20.973534, lat: 42.0083186, name: "Staklo" },
    { lng: 20.9742528, lat: 42.0083984, name: "Staklo" },
    { lng: 20.9752613, lat: 42.0077168, name: "Staklo" },
    { lng: 20.9763557, lat: 42.0077486, name: "Staklo" },
    { lng: 20.9602668, lat: 41.9912769, name: "Staklo" },
    { lng: 20.9607711, lat: 41.9936452, name: "Staklo" },
    { lng: 20.9609902, lat: 41.9970484, name: "Staklo" },
    { lng: 21.4498049, lat: 41.9901203, name: "Staklo" },
    { lng: 21.4520074, lat: 41.9887006, name: "Staklo" },
    { lng: 21.4565843, lat: 41.9893022, name: "Staklo" },
    { lng: 21.4534974, lat: 41.9866185, name: "Staklo" },
    { lng: 21.4515866, lat: 41.985273, name: "Staklo" },
    { lng: 21.4538074, lat: 41.9844512, name: "Staklo" },
    { lng: 21.456115, lat: 41.9863006, name: "Staklo" },
    { lng: 21.4569237, lat: 41.9856429, name: "Staklo" },
    { lng: 21.4590494, lat: 41.9840528, name: "Staklo" },
    { lng: 21.4613355, lat: 41.9889739, name: "Staklo" },
    { lng: 21.4634315, lat: 41.991948, name: "Staklo" },
    { lng: 21.4678448, lat: 41.9914882, name: "Staklo" },
    { lng: 21.47105, lat: 41.9902801, name: "Staklo" },
    { lng: 21.4673932, lat: 41.9873243, name: "Staklo" },
    { lng: 21.4682381, lat: 41.9868299, name: "Staklo" },
    { lng: 21.4728051, lat: 41.989366, name: "Staklo" },
    { lng: 21.4731715, lat: 41.9882689, name: "Staklo" },
    { lng: 21.4724371, lat: 41.987519, name: "Staklo" },
    { lng: 21.471907, lat: 41.9848175, name: "Staklo" },
    { lng: 21.4737444, lat: 41.9852704, name: "Staklo" },
    { lng: 21.4756086, lat: 41.9829775, name: "Staklo" },
    { lng: 21.4766791, lat: 41.9823767, name: "Staklo" },
    { lng: 21.4838701, lat: 41.9823876, name: "Staklo" },
    { lng: 21.4728753, lat: 41.9788845, name: "Staklo" },
    { lng: 21.4724524, lat: 41.9754523, name: "Staklo" },
    { lng: 21.4787028, lat: 41.9744374, name: "Staklo" },
    { lng: 21.4869148, lat: 41.9743941, name: "Staklo" },
    { lng: 21.4569488, lat: 42.0163019, name: "Staklo" },
    { lng: 21.4604601, lat: 42.0143885, name: "Staklo" },
    { lng: 21.4581201, lat: 42.0125717, name: "Staklo" },
    { lng: 21.4633532, lat: 42.005085, name: "Staklo" },
    { lng: 21.460937, lat: 42.0033377, name: "Staklo" },
    { lng: 21.4607759, lat: 42.0018423, name: "Staklo" },
    { lng: 21.4676047, lat: 42.0031196, name: "Staklo" },
    { lng: 21.4884065, lat: 42.0004229, name: "Staklo" },
    { lng: 21.4886694, lat: 42.0008794, name: "Staklo" },
    { lng: 21.4934271, lat: 41.9984643, name: "Staklo" },
    { lng: 21.493618, lat: 41.9992028, name: "Staklo" },
    { lng: 21.4951862, lat: 42.0028969, name: "Staklo" },
    { lng: 21.4988652, lat: 42.0046666, name: "Staklo" },
    { lng: 21.5009392, lat: 42.0061689, name: "Staklo" },
    { lng: 21.5002668, lat: 42.0076149, name: "Staklo" },
    { lng: 21.504366, lat: 42.006641, name: "Staklo" },
    { lng: 21.5057299, lat: 42.0040539, name: "Staklo" },
    { lng: 21.5062768, lat: 42.0029473, name: "Staklo" },
    { lng: 21.500107, lat: 41.9958259, name: "Staklo" },
    { lng: 21.5049807, lat: 41.9949199, name: "Staklo" },
    { lng: 21.5078332, lat: 41.9966768, name: "Staklo" },
    { lng: 21.5086889, lat: 41.9937458, name: "Staklo" },
    { lng: 21.5104887, lat: 41.9949376, name: "Staklo" },
    { lng: 21.5264592, lat: 41.9816728, name: "Staklo" },
    { lng: 21.3989258, lat: 42.0049811, name: "Staklo" },
    { lng: 21.396165, lat: 41.9987725, name: "Staklo" },
    { lng: 21.5123402, lat: 42.0162997, name: "Staklo" },
    { lng: 21.5056207, lat: 42.0101823, name: "Staklo" },
    { lng: 21.5091923, lat: 42.0111034, name: "Staklo" },
    { lng: 21.5098363, lat: 42.0105659, name: "Staklo" },
    { lng: 21.5110405, lat: 42.0093673, name: "Staklo" },
    { lng: 21.5177847, lat: 42.0058299, name: "Staklo" },
    { lng: 21.4599188, lat: 41.9808784, name: "Staklo" },
    { lng: 21.4643835, lat: 41.9800805, name: "Staklo" },
    { lng: 20.8989183, lat: 41.7950482, name: "Staklo" },
    { lng: 20.9072752, lat: 41.8081456, name: "Staklo" },
    { lng: 20.9080679, lat: 41.7955825, name: "Staklo" },
    { lng: 20.9094305, lat: 41.7958944, name: "Staklo" },
    { lng: 20.9150148, lat: 41.7962904, name: "Staklo" },
    { lng: 20.9090115, lat: 41.7972547, name: "Staklo" },
    { lng: 20.8838185, lat: 41.801574, name: "Staklo" },
    { lng: 20.8837245, lat: 41.8058547, name: "Staklo" },
    { lng: 20.9040557, lat: 41.8029097, name: "Staklo" },
    { lng: 20.9047852, lat: 41.801954, name: "Staklo" },
    { lng: 20.9027038, lat: 41.8037015, name: "Staklo" },
    { lng: 20.9045867, lat: 41.8035335, name: "Staklo" },
    { lng: 20.9154938, lat: 41.7954086, name: "Staklo" },
    { lng: 20.9167974, lat: 41.7938924, name: "Staklo" },
    { lng: 20.916903, lat: 41.7957192, name: "Staklo" },
    { lng: 20.9170093, lat: 41.7979681, name: "Staklo" },
    { lng: 20.913509, lat: 41.8028248, name: "Staklo" },
    { lng: 20.9081338, lat: 41.7903696, name: "Staklo" },
    { lng: 20.9070502, lat: 41.7887737, name: "Staklo" },
    { lng: 20.9112345, lat: 41.7893856, name: "Staklo" },
    { lng: 20.9091102, lat: 41.7887537, name: "Staklo" },
    { lng: 20.9128814, lat: 41.7894216, name: "Staklo" },
    { lng: 20.9148286, lat: 41.7889777, name: "Staklo" },
    { lng: 20.9150266, lat: 41.8000601, name: "Staklo" },
    { lng: 20.9135353, lat: 41.8015926, name: "Staklo" },
    { lng: 20.9025145, lat: 41.7904209, name: "Staklo" },
    { lng: 20.9074047, lat: 41.7903676, name: "Staklo" },
    { lng: 21.2025391, lat: 41.2280108, name: "Staklo" },
    { lng: 21.2036119, lat: 41.219173, name: "Staklo" },
    { lng: 21.2029843, lat: 41.2201828, name: "Staklo" },
    { lng: 21.2460729, lat: 41.373699, name: "Staklo" },
    { lng: 21.2484907, lat: 41.3636384, name: "Staklo" },
    { lng: 21.2533053, lat: 41.3646127, name: "Staklo" },
    { lng: 21.2485175, lat: 41.3679885, name: "Staklo" },
    { lng: 21.2493302, lat: 41.3684012, name: "Staklo" },
    { lng: 21.0089237, lat: 41.0894917, name: "Staklo" },
    { lng: 21.0113722, lat: 41.0976963, name: "Staklo" },
    { lng: 21.0112587, lat: 41.0929077, name: "Staklo" },
    { lng: 21.014031, lat: 41.085491, name: "Staklo" },
    { lng: 21.0098682, lat: 41.085115, name: "Staklo" },
    { lng: 21.0100506, lat: 41.0839909, name: "Staklo" },
    { lng: 21.0093103, lat: 41.0828022, name: "Staklo" },
    { lng: 21.0135262, lat: 41.0883953, name: "Staklo" },
    { lng: 21.0139365, lat: 41.0891799, name: "Staklo" },
    { lng: 21.0134832, lat: 41.0899733, name: "Staklo" },
    { lng: 21.5134478, lat: 42.0276437, name: "Staklo" },
    { lng: 21.2165655, lat: 41.507051, name: "Staklo" },
    { lng: 21.2164836, lat: 41.5117806, name: "Staklo" },
    { lng: 21.2193195, lat: 41.5073954, name: "Staklo" },
    { lng: 20.7571664, lat: 41.7014623, name: "Staklo" },
    { lng: 20.8044965, lat: 41.6949423, name: "Staklo" },
    { lng: 20.7348251, lat: 41.6577059, name: "Staklo" },
    { lng: 20.7344747, lat: 41.6586844, name: "Staklo" },
    { lng: 20.7357734, lat: 41.6509542, name: "Staklo" },
    { lng: 22.0103337, lat: 41.4404307, name: "Staklo" },
    { lng: 22.0191577, lat: 41.4342457, name: "Staklo" },
    { lng: 22.0188855, lat: 41.4391539, name: "Staklo" },
    { lng: 22.0225281, lat: 41.4352324, name: "Staklo" },
    { lng: 22.0161929, lat: 41.4293219, name: "Staklo" },
    { lng: 22.0128853, lat: 41.4331718, name: "Staklo" },
    { lng: 22.0167198, lat: 41.4318976, name: "Staklo" },
    { lng: 22.015525, lat: 41.4384988, name: "Staklo" },
    { lng: 22.010395, lat: 41.4415162, name: "Staklo" },
    { lng: 22.0109663, lat: 41.4376379, name: "Staklo" },
    { lng: 22.0026009, lat: 41.4328633, name: "Staklo" },
    { lng: 22.0072304, lat: 41.4407665, name: "Staklo" },
    { lng: 20.6471182, lat: 41.138103, name: "Staklo" },
    { lng: 20.6743294, lat: 41.1740271, name: "Staklo" },
    { lng: 20.6704233, lat: 41.1765725, name: "Staklo" },
    { lng: 20.6668884, lat: 41.1752719, name: "Staklo" },
    { lng: 20.6719805, lat: 41.1769964, name: "Staklo" },
    { lng: 20.6811228, lat: 41.1729476, name: "Staklo" },
    { lng: 20.6812059, lat: 41.1729789, name: "Staklo" },
    { lng: 20.6678635, lat: 41.1718783, name: "Staklo" },
    { lng: 20.6679386, lat: 41.1718904, name: "Staklo" },
    { lng: 20.6680097, lat: 41.1719005, name: "Staklo" },
    { lng: 20.6680861, lat: 41.1719116, name: "Staklo" },
    { lng: 20.6674196, lat: 41.1720842, name: "Staklo" },
    { lng: 20.6733471, lat: 41.1744483, name: "Staklo" },
    { lng: 20.6686146, lat: 41.1732699, name: "Staklo" },
    { lng: 20.6876192, lat: 41.1744923, name: "Staklo" },
    { lng: 20.6872089, lat: 41.1736265, name: "Staklo" },
    { lng: 20.6704676, lat: 41.1741589, name: "Staklo" },
    { lng: 20.6746272, lat: 41.1740105, name: "Staklo" },
    { lng: 20.6660085, lat: 41.1728919, name: "Staklo" },
    { lng: 20.6769411, lat: 41.1816212, name: "Staklo" },
    { lng: 20.6872096, lat: 41.178067, name: "Staklo" },
    { lng: 20.6878855, lat: 41.1776512, name: "Staklo" },
    { lng: 20.6822851, lat: 41.1822665, name: "Staklo" },
    { lng: 20.6846695, lat: 41.1779186, name: "Staklo" },
    { lng: 20.6825428, lat: 41.1753444, name: "Staklo" },
    { lng: 20.6827762, lat: 41.175944, name: "Staklo" },
    { lng: 20.683664, lat: 41.1758088, name: "Staklo" },
    { lng: 20.6851043, lat: 41.1755362, name: "Staklo" },
    { lng: 20.6476131, lat: 41.1429576, name: "Staklo" },
    { lng: 20.6476882, lat: 41.1430384, name: "Staklo" },
    { lng: 20.6748061, lat: 41.1778932, name: "Staklo" },
    { lng: 20.6833215, lat: 41.1729871, name: "Staklo" },
    { lng: 20.6896861, lat: 41.1772205, name: "Staklo" },
    { lng: 20.6508518, lat: 41.1450094, name: "Staklo" },
    { lng: 20.9504167, lat: 41.5123215, name: "Staklo" },
    { lng: 20.9594162, lat: 41.5091015, name: "Staklo" },
    { lng: 20.9631429, lat: 41.5124908, name: "Staklo" },
    { lng: 20.963507, lat: 41.5128492, name: "Staklo" },
    { lng: 20.9621223, lat: 41.5101692, name: "Staklo" },
    { lng: 20.9574708, lat: 41.5182175, name: "Staklo" },
    { lng: 20.9610552, lat: 41.5129109, name: "Staklo" },
    { lng: 20.961201, lat: 41.5193452, name: "Staklo" },
    { lng: 20.9551277, lat: 41.510353, name: "Staklo" },
    { lng: 20.9565001, lat: 41.50852, name: "Staklo" },
    { lng: 20.9577314, lat: 41.5126374, name: "Staklo" },
    { lng: 20.9586897, lat: 41.5112919, name: "Staklo" },
    { lng: 20.9543213, lat: 41.5065074, name: "Staklo" },
    { lng: 20.9546203, lat: 41.5079498, name: "Staklo" },
    { lng: 20.9533905, lat: 41.507015, name: "Staklo" },
    { lng: 20.9532604, lat: 41.5104735, name: "Staklo" },
    { lng: 20.953674, lat: 41.5116911, name: "Staklo" },
    { lng: 20.7765281, lat: 41.1235375, name: "Staklo" },
    { lng: 20.7801652, lat: 41.124402, name: "Staklo" },
    { lng: 20.7830907, lat: 41.1231925, name: "Staklo" },
    { lng: 20.8179882, lat: 41.1123791, name: "Staklo" },
    { lng: 20.7820232, lat: 41.1214193, name: "Staklo" },
    { lng: 20.8010793, lat: 41.11523, name: "Staklo" },
    { lng: 20.7927058, lat: 41.1194973, name: "Staklo" },
    { lng: 20.7901646, lat: 41.1222549, name: "Staklo" },
    { lng: 20.8021713, lat: 41.1134155, name: "Staklo" },
    { lng: 20.8043168, lat: 41.1117192, name: "Staklo" },
    { lng: 20.8096777, lat: 41.1059189, name: "Staklo" },
    { lng: 20.8158063, lat: 41.1129791, name: "Staklo" },
    { lng: 20.8165734, lat: 41.1134924, name: "Staklo" },
    { lng: 20.8077186, lat: 41.1114852, name: "Staklo" },
    { lng: 20.8097846, lat: 41.1119722, name: "Staklo" },
    { lng: 20.8058314, lat: 41.1086231, name: "Staklo" },
    { lng: 20.812123, lat: 41.1083571, name: "Staklo" },
    { lng: 20.800126, lat: 41.1129806, name: "Staklo" },
    { lng: 20.8024967, lat: 41.1188539, name: "Staklo" },
    { lng: 20.8073795, lat: 41.1029945, name: "Staklo" },
    { lng: 20.8136542, lat: 41.1132841, name: "Staklo" },
    { lng: 20.8057767, lat: 41.1108486, name: "Staklo" },
    { lng: 20.8065077, lat: 41.1148519, name: "Staklo" },
    { lng: 20.8067626, lat: 41.1174869, name: "Staklo" },
    { lng: 20.8067787, lat: 41.1173778, name: "Staklo" },
    { lng: 20.8106989, lat: 41.1280845, name: "Staklo" },
    { lng: 20.8142535, lat: 41.1177382, name: "Staklo" },
    { lng: 20.8101171, lat: 41.1167439, name: "Staklo" },
    { lng: 20.8086827, lat: 41.1215239, name: "Staklo" },
    { lng: 20.7911674, lat: 41.1235196, name: "Staklo" },
    { lng: 20.8121006, lat: 41.123553, name: "Staklo" },
    { lng: 20.812765, lat: 41.1163964, name: "Staklo" },
    { lng: 20.9752217, lat: 42.0099323, name: "Staklo" },
    { lng: 20.9834608, lat: 42.0049413, name: "Staklo" },
    { lng: 20.979266, lat: 42.010135, name: "Staklo" },
    { lng: 20.9859823, lat: 42.0047179, name: "Staklo" },
    { lng: 20.9808588, lat: 42.0110622, name: "Staklo" },
    { lng: 20.9799391, lat: 42.0089511, name: "Staklo" },
    { lng: 20.9689748, lat: 42.011467, name: "Staklo" },
    { lng: 20.9632806, lat: 41.9937427, name: "Staklo" },
    { lng: 20.9719548, lat: 42.010649, name: "Staklo" },
    { lng: 20.9712599, lat: 42.0136203, name: "Staklo" },
    { lng: 20.9743372, lat: 42.0009718, name: "Staklo" },
    { lng: 20.9762646, lat: 42.0026483, name: "Staklo" },
    { lng: 20.9597713, lat: 41.9897569, name: "Staklo" },
    { lng: 20.9669546, lat: 41.9978378, name: "Staklo" },
    { lng: 20.9840151, lat: 42.0080621, name: "Staklo" },
    { lng: 20.9808205, lat: 42.0144886, name: "Staklo" },
    { lng: 20.9743463, lat: 42.006571, name: "Staklo" },
    { lng: 20.9781042, lat: 42.0032148, name: "Staklo" },
    { lng: 20.9798599, lat: 42.0023908, name: "Staklo" },
    { lng: 21.3317104, lat: 42.0031182, name: "Plastika/limenki" },
    { lng: 21.350539, lat: 42.0057873, name: "Plastika/limenki" },
    { lng: 21.355011, lat: 42.006533, name: "Plastika/limenki" },
    { lng: 21.3632028, lat: 42.0502103, name: "Plastika/limenki" },
    { lng: 21.3834724, lat: 42.0059807, name: "Plastika/limenki" },
    { lng: 21.4007968, lat: 42.0089819, name: "Plastika/limenki" },
    { lng: 21.4003488, lat: 42.0089715, name: "Plastika/limenki" },
    { lng: 21.3898357, lat: 42.0016518, name: "Plastika/limenki" },
    { lng: 21.3915583, lat: 41.9995916, name: "Plastika/limenki" },
    { lng: 21.3922163, lat: 41.9975075, name: "Plastika/limenki" },
    { lng: 21.3947927, lat: 42.0033139, name: "Plastika/limenki" },
    { lng: 21.3955978, lat: 42.0044759, name: "Plastika/limenki" },
    { lng: 21.3956943, lat: 42.004456, name: "Plastika/limenki" },
    { lng: 21.3954976, lat: 41.9946757, name: "Plastika/limenki" },
    { lng: 21.3966861, lat: 41.9953923, name: "Plastika/limenki" },
    { lng: 21.3996343, lat: 41.9965526, name: "Plastika/limenki" },
    { lng: 21.4006576, lat: 41.9998066, name: "Plastika/limenki" },
    { lng: 21.4030428, lat: 41.9993762, name: "Plastika/limenki" },
    { lng: 21.4027478, lat: 41.9979989, name: "Plastika/limenki" },
    { lng: 21.4040011, lat: 41.9979564, name: "Plastika/limenki" },
    { lng: 21.406041, lat: 42.0058405, name: "Plastika/limenki" },
    { lng: 21.4056927, lat: 41.996397, name: "Plastika/limenki" },
    { lng: 21.4074892, lat: 42.0012889, name: "Plastika/limenki" },
    { lng: 21.4079441, lat: 42.0025917, name: "Plastika/limenki" },
    { lng: 21.4101103, lat: 42.0052047, name: "Plastika/limenki" },
    { lng: 21.4135352, lat: 42.001737, name: "Plastika/limenki" },
    { lng: 21.4162405, lat: 42.0047163, name: "Plastika/limenki" },
    { lng: 21.4111616, lat: 41.9907144, name: "Plastika/limenki" },
    { lng: 21.4126082, lat: 41.9947371, name: "Plastika/limenki" },
    { lng: 21.4148517, lat: 41.992248, name: "Plastika/limenki" },
    { lng: 21.4168196, lat: 41.992793, name: "Plastika/limenki" },
    { lng: 21.4173547, lat: 41.9941574, name: "Plastika/limenki" },
    { lng: 21.4178045, lat: 41.9998625, name: "Plastika/limenki" },
    { lng: 21.4208527, lat: 41.9959693, name: "Plastika/limenki" },
    { lng: 21.4224086, lat: 41.9979454, name: "Plastika/limenki" },
    { lng: 21.4234304, lat: 42.0025491, name: "Plastika/limenki" },
    { lng: 21.424267, lat: 41.9953092, name: "Plastika/limenki" },
    { lng: 21.4281255, lat: 41.9930923, name: "Plastika/limenki" },
    { lng: 21.4279537, lat: 41.9919689, name: "Plastika/limenki" },
    { lng: 21.4225446, lat: 41.9823601, name: "Plastika/limenki" },
    { lng: 21.4100623, lat: 42.0360139, name: "Plastika/limenki" },
    { lng: 21.435964, lat: 41.9912648, name: "Plastika/limenki" },
    { lng: 21.4382979, lat: 41.9920418, name: "Plastika/limenki" },
    { lng: 21.4343731, lat: 41.9842035, name: "Plastika/limenki" },
    { lng: 21.4351522, lat: 41.9818376, name: "Plastika/limenki" },
    { lng: 21.4386192, lat: 41.9844113, name: "Plastika/limenki" },
    { lng: 21.4398329, lat: 41.9849526, name: "Plastika/limenki" },
    { lng: 21.4400755, lat: 41.9823992, name: "Plastika/limenki" },
    { lng: 21.4409216, lat: 41.9805312, name: "Plastika/limenki" },
    { lng: 21.4403104, lat: 41.9783248, name: "Plastika/limenki" },
    { lng: 21.4384921, lat: 41.9757454, name: "Plastika/limenki" },
    { lng: 21.4431405, lat: 41.9788681, name: "Plastika/limenki" },
    { lng: 21.4429307, lat: 41.9767905, name: "Plastika/limenki" },
    { lng: 21.4462886, lat: 41.9805253, name: "Plastika/limenki" },
    { lng: 21.4461827, lat: 41.9773375, name: "Plastika/limenki" },
    { lng: 21.4446109, lat: 41.9754912, name: "Plastika/limenki" },
    { lng: 21.4462049, lat: 41.9752103, name: "Plastika/limenki" },
    { lng: 21.4462076, lat: 41.9745941, name: "Plastika/limenki" },
    { lng: 21.441488, lat: 41.9731925, name: "Plastika/limenki" },
    { lng: 21.4544231, lat: 41.9760257, name: "Plastika/limenki" },
    { lng: 21.4535068, lat: 41.9894459, name: "Plastika/limenki" },
    { lng: 21.3999117, lat: 42.0089751, name: "Plastika/limenki" },
    { lng: 21.4600363, lat: 41.9871737, name: "Plastika/limenki" },
    { lng: 21.4595791, lat: 41.9892558, name: "Plastika/limenki" },
    { lng: 21.4596864, lat: 41.9892219, name: "Plastika/limenki" },
    { lng: 21.4590901, lat: 41.9840683, name: "Plastika/limenki" },
    { lng: 21.4645259, lat: 41.9856425, name: "Plastika/limenki" },
    { lng: 21.4674296, lat: 41.9858876, name: "Plastika/limenki" },
    { lng: 21.4706057, lat: 41.9812511, name: "Plastika/limenki" },
    { lng: 21.4840222, lat: 41.9848776, name: "Plastika/limenki" },
    { lng: 21.4607045, lat: 42.0018377, name: "Plastika/limenki" },
    { lng: 21.4618526, lat: 42.0030767, name: "Plastika/limenki" },
    { lng: 21.4618821, lat: 42.0030229, name: "Plastika/limenki" },
    { lng: 21.4633288, lat: 42.0023838, name: "Plastika/limenki" },
    { lng: 21.4647877, lat: 42.0039471, name: "Plastika/limenki" },
    { lng: 21.4659698, lat: 42.0041597, name: "Plastika/limenki" },
    { lng: 21.4675309, lat: 42.0031178, name: "Plastika/limenki" },
    { lng: 21.4616006, lat: 42.010614, name: "Plastika/limenki" },
    { lng: 21.4580656, lat: 42.012624, name: "Plastika/limenki" },
    { lng: 21.4520931, lat: 42.0156234, name: "Plastika/limenki" },
    { lng: 21.4438237, lat: 42.0091826, name: "Plastika/limenki" },
    { lng: 21.4374585, lat: 42.0132136, name: "Plastika/limenki" },
    { lng: 21.4326668, lat: 42.0181457, name: "Plastika/limenki" },
    { lng: 21.4437563, lat: 42.0151374, name: "Plastika/limenki" },
    { lng: 21.4386127, lat: 42.0218012, name: "Plastika/limenki" },
    { lng: 21.4386829, lat: 42.0234334, name: "Plastika/limenki" },
    { lng: 21.4419343, lat: 42.0232918, name: "Plastika/limenki" },
    { lng: 21.3503104, lat: 42.0777601, name: "Plastika/limenki" },
    { lng: 21.6869685, lat: 42.1292587, name: "Plastika/limenki" },
    { lng: 21.6989055, lat: 42.1286748, name: "Plastika/limenki" },
    { lng: 21.7099951, lat: 42.130716, name: "Plastika/limenki" },
    { lng: 21.7095783, lat: 42.1337741, name: "Plastika/limenki" },
    { lng: 21.7097532, lat: 42.1376782, name: "Plastika/limenki" },
    { lng: 21.7163228, lat: 42.1292444, name: "Plastika/limenki" },
    { lng: 21.7164172, lat: 42.1355991, name: "Plastika/limenki" },
    { lng: 21.7219637, lat: 42.1394356, name: "Plastika/limenki" },
    { lng: 21.7212861, lat: 42.1344741, name: "Plastika/limenki" },
    { lng: 21.7261972, lat: 42.1324609, name: "Plastika/limenki" },
    { lng: 21.7236656, lat: 42.124547, name: "Plastika/limenki" },
    { lng: 21.7330922, lat: 42.1221917, name: "Plastika/limenki" },
    { lng: 21.7325684, lat: 42.1170169, name: "Plastika/limenki" },
    { lng: 21.6909804, lat: 42.1862878, name: "Plastika/limenki" },
    { lng: 21.7146911, lat: 42.211177, name: "Plastika/limenki" },
    { lng: 21.7435158, lat: 42.1621389, name: "Plastika/limenki" },
    { lng: 21.7519079, lat: 42.1631623, name: "Plastika/limenki" },
    { lng: 21.8515064, lat: 42.2769111, name: "Plastika/limenki" },
    { lng: 21.7580352, lat: 41.7723138, name: "Plastika/limenki" },
    { lng: 21.7875308, lat: 41.7150152, name: "Plastika/limenki" },
    { lng: 21.7797708, lat: 41.7179875, name: "Plastika/limenki" },
    { lng: 21.7780801, lat: 41.7175058, name: "Plastika/limenki" },
    { lng: 21.7721728, lat: 41.7163959, name: "Plastika/limenki" },
    { lng: 21.7727996, lat: 41.7174794, name: "Plastika/limenki" },
    { lng: 21.7665687, lat: 41.7173723, name: "Plastika/limenki" },
    { lng: 21.7651842, lat: 41.7177724, name: "Plastika/limenki" },
    { lng: 22.1790752, lat: 41.7468501, name: "Plastika/limenki" },
    { lng: 22.1838311, lat: 41.7703371, name: "Plastika/limenki" },
    { lng: 22.1862405, lat: 41.7688268, name: "Plastika/limenki" },
    { lng: 22.1852013, lat: 41.7600794, name: "Plastika/limenki" },
    { lng: 22.185835, lat: 41.7816049, name: "Plastika/limenki" },
    { lng: 22.2036314, lat: 41.7816227, name: "Plastika/limenki" },
    { lng: 22.1897415, lat: 41.7411575, name: "Plastika/limenki" },
    { lng: 22.1905865, lat: 41.746565, name: "Plastika/limenki" },
    { lng: 22.1921516, lat: 41.7363126, name: "Plastika/limenki" },
    { lng: 22.1941927, lat: 41.7364307, name: "Plastika/limenki" },
    { lng: 22.1942889, lat: 41.7384315, name: "Plastika/limenki" },
    { lng: 22.1924281, lat: 41.7426356, name: "Plastika/limenki" },
    { lng: 22.1937089, lat: 41.7427487, name: "Plastika/limenki" },
    { lng: 22.1922926, lat: 41.7447357, name: "Plastika/limenki" },
    { lng: 22.1924508, lat: 41.7454701, name: "Plastika/limenki" },
    { lng: 22.1985629, lat: 41.7419036, name: "Plastika/limenki" },
    { lng: 22.19931, lat: 41.7495301, name: "Plastika/limenki" },
    { lng: 22.2006306, lat: 41.7500822, name: "Plastika/limenki" },
    { lng: 22.2018832, lat: 41.7504444, name: "Plastika/limenki" },
    { lng: 22.2031265, lat: 41.7488851, name: "Plastika/limenki" },
    { lng: 22.2092941, lat: 41.7514562, name: "Plastika/limenki" },
    { lng: 22.19941, lat: 41.7400815, name: "Plastika/limenki" },
    { lng: 22.200491, lat: 41.7404958, name: "Plastika/limenki" },
    { lng: 22.2029245, lat: 41.7373437, name: "Plastika/limenki" },
    { lng: 22.2021623, lat: 41.7344132, name: "Plastika/limenki" },
    { lng: 22.1996553, lat: 41.73218, name: "Plastika/limenki" },
    { lng: 22.2040199, lat: 41.7586012, name: "Plastika/limenki" },
    { lng: 22.2000203, lat: 41.7623569, name: "Plastika/limenki" },
    { lng: 22.6433483, lat: 41.4548609, name: "Plastika/limenki" },
    { lng: 22.644746, lat: 41.4535752, name: "Plastika/limenki" },
    { lng: 22.6333463, lat: 41.443726, name: "Plastika/limenki" },
    { lng: 22.631729, lat: 41.444311, name: "Plastika/limenki" },
    { lng: 22.6328609, lat: 41.4452319, name: "Plastika/limenki" },
    { lng: 22.6341564, lat: 41.441405, name: "Plastika/limenki" },
    { lng: 22.6366423, lat: 41.438469, name: "Plastika/limenki" },
    { lng: 22.6400878, lat: 41.4414431, name: "Plastika/limenki" },
    { lng: 22.6430513, lat: 41.4433431, name: "Plastika/limenki" },
    { lng: 22.6422216, lat: 41.4400456, name: "Plastika/limenki" },
    { lng: 21.507515, lat: 41.3710845, name: "Plastika/limenki" },
    { lng: 21.5070001, lat: 41.3723888, name: "Plastika/limenki" },
    { lng: 21.5079764, lat: 41.3747881, name: "Plastika/limenki" },
    { lng: 21.5325894, lat: 41.357743, name: "Plastika/limenki" },
    { lng: 21.5352165, lat: 41.3496956, name: "Plastika/limenki" },
    { lng: 21.5367487, lat: 41.3508184, name: "Plastika/limenki" },
    { lng: 21.5393502, lat: 41.3507256, name: "Plastika/limenki" },
    { lng: 21.5419026, lat: 41.3512627, name: "Plastika/limenki" },
    { lng: 21.5455511, lat: 41.3427993, name: "Plastika/limenki" },
    { lng: 21.5474524, lat: 41.3428758, name: "Plastika/limenki" },
    { lng: 21.5476911, lat: 41.3424912, name: "Plastika/limenki" },
    { lng: 21.5481981, lat: 41.3428244, name: "Plastika/limenki" },
    { lng: 21.554265, lat: 41.3337512, name: "Plastika/limenki" },
    { lng: 21.557265, lat: 41.3380248, name: "Plastika/limenki" },
    { lng: 21.5563584, lat: 41.3367106, name: "Plastika/limenki" },
    { lng: 21.5591897, lat: 41.3362999, name: "Plastika/limenki" },
    { lng: 21.555783, lat: 41.3416584, name: "Plastika/limenki" },
    { lng: 21.5326265, lat: 41.341331, name: "Plastika/limenki" },
    { lng: 21.550769, lat: 41.3394208, name: "Plastika/limenki" },
    { lng: 21.5643782, lat: 41.3425885, name: "Plastika/limenki" },
    { lng: 21.562005, lat: 41.3460785, name: "Plastika/limenki" },
    { lng: 21.5602843, lat: 41.3470156, name: "Plastika/limenki" },
    { lng: 21.5620536, lat: 41.3471978, name: "Plastika/limenki" },
    { lng: 21.5612747, lat: 41.3498428, name: "Plastika/limenki" },
    { lng: 21.5610072, lat: 41.3503988, name: "Plastika/limenki" },
    { lng: 21.5607122, lat: 41.3534437, name: "Plastika/limenki" },
    { lng: 21.5622968, lat: 41.3557113, name: "Plastika/limenki" },
    { lng: 21.5647823, lat: 41.3523045, name: "Plastika/limenki" },
    { lng: 21.5644877, lat: 41.3479524, name: "Plastika/limenki" },
    { lng: 21.5649809, lat: 41.3455926, name: "Plastika/limenki" },
    { lng: 21.5682237, lat: 41.3457995, name: "Plastika/limenki" },
    { lng: 21.5712192, lat: 41.3505481, name: "Plastika/limenki" },
    { lng: 21.1548726, lat: 41.0844196, name: "Plastika/limenki" },
    { lng: 21.3099645, lat: 41.0272315, name: "Plastika/limenki" },
    { lng: 21.3089426, lat: 41.024903, name: "Plastika/limenki" },
    { lng: 21.3121762, lat: 41.0237093, name: "Plastika/limenki" },
    { lng: 21.3222492, lat: 41.0255168, name: "Plastika/limenki" },
    { lng: 21.3270562, lat: 41.0237926, name: "Plastika/limenki" },
    { lng: 21.3316666, lat: 41.0215269, name: "Plastika/limenki" },
    { lng: 21.3390706, lat: 41.0356178, name: "Plastika/limenki" },
    { lng: 21.3467492, lat: 41.0345456, name: "Plastika/limenki" },
    { lng: 21.3477618, lat: 41.0342047, name: "Plastika/limenki" },
    { lng: 21.3438628, lat: 41.0275491, name: "Plastika/limenki" },
    { lng: 21.3418718, lat: 41.0530634, name: "Plastika/limenki" },
    { lng: 21.264933, lat: 41.0302777, name: "Plastika/limenki" },
    { lng: 21.3290504, lat: 41.0738292, name: "Plastika/limenki" },
    { lng: 21.3314073, lat: 40.9965733, name: "Plastika/limenki" },
    { lng: 21.4295393, lat: 40.9271962, name: "Plastika/limenki" },
    { lng: 21.4084955, lat: 41.9756425, name: "Plastika/limenki" },
    { lng: 22.4942272, lat: 41.1583416, name: "Plastika/limenki" },
    { lng: 22.4946724, lat: 41.158065, name: "Plastika/limenki" },
    { lng: 22.5096103, lat: 41.1467209, name: "Plastika/limenki" },
    { lng: 22.7143267, lat: 41.1938454, name: "Plastika/limenki" },
    { lng: 21.3990143, lat: 42.0049711, name: "Plastika/limenki" },
    { lng: 21.3959853, lat: 41.9988124, name: "Plastika/limenki" },
    { lng: 21.4564466, lat: 41.9879036, name: "Plastika/limenki" },
    { lng: 21.4489665, lat: 41.9885701, name: "Plastika/limenki" },
    { lng: 21.4216112, lat: 41.9932341, name: "Plastika/limenki" },
    { lng: 21.4177243, lat: 41.9940911, name: "Plastika/limenki" },
    { lng: 21.4060661, lat: 41.9977439, name: "Plastika/limenki" },
    { lng: 21.4031599, lat: 41.9958624, name: "Plastika/limenki" },
    { lng: 21.3847549, lat: 42.0092057, name: "Plastika/limenki" },
    { lng: 21.4280207, lat: 41.9947207, name: "Plastika/limenki" },
    { lng: 21.5001578, lat: 41.995807, name: "Plastika/limenki" },
    { lng: 21.3914883, lat: 42.0062261, name: "Plastika/limenki" },
    { lng: 21.4440349, lat: 41.974395, name: "Plastika/limenki" },
    { lng: 21.4355077, lat: 41.9900493, name: "Plastika/limenki" },
    { lng: 21.427745, lat: 41.9964711, name: "Plastika/limenki" },
    { lng: 22.0104352, lat: 41.4418379, name: "Plastika/limenki" },
    { lng: 22.0097619, lat: 41.4397377, name: "Plastika/limenki" },
    { lng: 22.0098241, lat: 41.4389451, name: "Plastika/limenki" },
    { lng: 22.0185461, lat: 41.4180699, name: "Plastika/limenki" },
    { lng: 20.7765576, lat: 41.1234819, name: "Plastika/limenki" },
    { lng: 21.3632712, lat: 42.0501665, name: "Hartija/kompozit" },
    { lng: 21.4056149, lat: 41.9963193, name: "Hartija/kompozit" },
    { lng: 21.4162753, lat: 42.0047562, name: "Hartija/kompozit" },
    { lng: 21.3992111, lat: 42.0089874, name: "Hartija/kompozit" },
    { lng: 21.4358272, lat: 41.991199, name: "Hartija/kompozit" },
    { lng: 21.4429763, lat: 41.9767177, name: "Hartija/kompozit" },
    { lng: 21.4674229, lat: 41.9858158, name: "Hartija/kompozit" },
    { lng: 21.4706647, lat: 41.9812152, name: "Hartija/kompozit" },
    { lng: 21.4619344, lat: 42.0028904, name: "Hartija/kompozit" },
    { lng: 21.452126, lat: 42.0156343, name: "Hartija/kompozit" },
    { lng: 21.6809807, lat: 42.1244892, name: "Hartija/kompozit" },
    { lng: 21.6808091, lat: 42.1243937, name: "Hartija/kompozit" },
    { lng: 21.6870409, lat: 42.1292686, name: "Hartija/kompozit" },
    { lng: 21.7099307, lat: 42.1306285, name: "Hartija/kompozit" },
    { lng: 21.7096909, lat: 42.1337363, name: "Hartija/kompozit" },
    { lng: 21.7096218, lat: 42.1377498, name: "Hartija/kompozit" },
    { lng: 21.7161967, lat: 42.1291987, name: "Hartija/kompozit" },
    { lng: 21.7164936, lat: 42.1355812, name: "Hartija/kompozit" },
    { lng: 21.7169736, lat: 42.1388617, name: "Hartija/kompozit" },
    { lng: 21.7213122, lat: 42.1344891, name: "Hartija/kompozit" },
    { lng: 21.7271601, lat: 42.1323094, name: "Hartija/kompozit" },
    { lng: 21.7234993, lat: 42.1243481, name: "Hartija/kompozit" },
    { lng: 21.7307267, lat: 42.1203011, name: "Hartija/kompozit" },
    { lng: 21.7331485, lat: 42.1220982, name: "Hartija/kompozit" },
    { lng: 21.7324665, lat: 42.1170288, name: "Hartija/kompozit" },
    { lng: 21.691313, lat: 42.1864945, name: "Hartija/kompozit" },
    { lng: 21.714675, lat: 42.2109744, name: "Hartija/kompozit" },
    { lng: 21.7519736, lat: 42.1631772, name: "Hartija/kompozit" },
    { lng: 21.8515037, lat: 42.2770838, name: "Hartija/kompozit" },
    { lng: 21.7578797, lat: 41.7724178, name: "Hartija/kompozit" },
    { lng: 21.7728653, lat: 41.7175044, name: "Hartija/kompozit" },
    { lng: 21.4085653, lat: 41.9756729, name: "Hartija/kompozit" },
    { lng: 22.5116752, lat: 41.1399052, name: "Hartija/kompozit" },
    { lng: 22.4938083, lat: 41.1429182, name: "Hartija/kompozit" },
    { lng: 22.4960599, lat: 41.1449935, name: "Hartija/kompozit" },
    { lng: 21.3991001, lat: 42.0049512, name: "Hartija/kompozit" },
    { lng: 21.3960712, lat: 41.9987825, name: "Hartija/kompozit" },
    { lng: 21.456515, lat: 41.9878767, name: "Hartija/kompozit" },
    { lng: 21.448903, lat: 41.9885356, name: "Hartija/kompozit" },
    { lng: 21.4215589, lat: 41.9932451, name: "Hartija/kompozit" },
    { lng: 21.4176787, lat: 41.9941041, name: "Hartija/kompozit" },
    { lng: 21.4060607, lat: 41.9977185, name: "Hartija/kompozit" },
    { lng: 21.4032022, lat: 41.9958614, name: "Hartija/kompozit" },
    { lng: 21.3847267, lat: 42.0091449, name: "Hartija/kompozit" },
    { lng: 21.4280227, lat: 41.9947501, name: "Hartija/kompozit" },
    { lng: 21.5002047, lat: 41.99579, name: "Hartija/kompozit" },
    { lng: 21.3913971, lat: 42.0062341, name: "Hartija/kompozit" },
    { lng: 21.4440644, lat: 41.9743192, name: "Hartija/kompozit" },
    { lng: 21.4354876, lat: 41.9900912, name: "Hartija/kompozit" },
    { lng: 21.4277181, lat: 41.9965548, name: "Hartija/kompozit" },
    { lng: 22.0164459, lat: 41.4214141, name: "Hartija/kompozit" },
    { lng: 22.0189928, lat: 41.4391418, name: "Hartija/kompozit" },
    { lng: 22.0161675, lat: 41.4293782, name: "Hartija/kompozit" },
    { lng: 22.0104218, lat: 41.4417494, name: "Hartija/kompozit" },
    { lng: 22.0072546, lat: 41.440859, name: "Hartija/kompozit" },
    { lng: 22.0185058, lat: 41.4181785, name: "Hartija/kompozit" }
  ];
  markers: any[] = [];
  title = 'RecycleNearMe';

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
  text!:string;
  onChange($event){
    var index;
    var min = 600000;
    navigator.geolocation.getCurrentPosition(position => { this.lat = position.coords.latitude });
    navigator.geolocation.getCurrentPosition(position => { this.lng = position.coords.longitude });
    for (var i = 0; i < this.markers.length; i++) {
      if (this.getDistanceFromLatLonInKm(this.lat, this.lng, this.markers[i].position.lat, this.markers[i].position.lng) < min) {
        if(this.markers[i].name ==  $event.target.options[$event.target.options.selectedIndex].text){
        index = i;
        min = this.getDistanceFromLatLonInKm(this.lat, this.lng, this.markers[i].position.lat, this.markers[i].position.lng);
        }
      }
    }
    min = min * 1000;
    var str = "Тип: " + this.markers_coordinates[index].name + " Оддалеченост: " + min;
    this.text = str;
  }


  addMarker() {
    //console.log(lat_temp);
    //console.log(lng_temp);
    //console.log(this.markers_coordinates[this.markers_coordinates.length - 1]);
    for (var i = 0; i < this.markers_coordinates.length + 1; i++) {
      //console.log(this.markers_coordinates[i].name);
      var icon;
      if(this.markers_coordinates[i].name == "Staklo"){
        icon = {
          url: "/assets/recycle_red.png", // url
          scaledSize: new google.maps.Size(50, 50), // scaled size
          origin: new google.maps.Point(0,0), // origin
          anchor: new google.maps.Point(0, 0) // anchor
        };
      }else if(this.markers_coordinates[i].name == "Hartija/kompozit"){
        icon = {
          url: "/assets/recycle_blue.png", // url
          scaledSize: new google.maps.Size(50, 50), // scaled size
          origin: new google.maps.Point(0,0), // origin
          anchor: new google.maps.Point(0, 0) // anchor
        };
      }else if(this.markers_coordinates[i].name == "Plastika/limenki"){
        icon = {
          url: "/assets/recycle_yellow.png", // url
          scaledSize: new google.maps.Size(50, 50), // scaled size
          origin: new google.maps.Point(0,0), // origin
          anchor: new google.maps.Point(0, 0) // anchor
        };

      }else if(this.markers_coordinates[i].name == "MyPosition"){
        icon = {
          scaledSize: new google.maps.Size(50, 50), // scaled size
          origin: new google.maps.Point(0,0), // origin
          anchor: new google.maps.Point(0, 0) // anchor
        };

      }
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
        options: { animation: google.maps.Animation.DROP, icon: icon },
      })

    }

  }
  setMarker(){
    navigator.geolocation.getCurrentPosition((position) => {
      var marker_temp = new google.maps.Marker({
        position: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
        options: {animation: google.maps.Animation.BOUNCE}
      })

      marker_temp.setMap(this.map);
    })

  }
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
    min = min * 1000;
    var str = "Тип: " + this.markers_coordinates[index].name + " Оддалеченост: " + min;
    return str;
  }

  shortestDistanceContainerLat(){
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
    min = min * 1000;
    var str = "Тип: " + this.markers_coordinates[index].name + " Оддалеченост: " + min;
    return this.markers_coordinates[index].lat;

  }
  shortestDistanceContainerLng(){
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
    min = min * 1000;
    var str = "Тип: " + this.markers_coordinates[index].name + " Оддалеченост: " + min;
    return this.markers_coordinates[index].lng;

  }
  setRoutePolyline(type_container){


    navigator.geolocation.getCurrentPosition((position)=>{
      var index;
      var min = 2000000000;

      for (var i = 0; i < this.markers_coordinates.length; i++) {
        if(this.markers_coordinates[i].name == type_container){
          if (this.getDistanceFromLatLonInKm(position.coords.latitude, position.coords.longitude, this.markers_coordinates[i].lat, this.markers_coordinates[i].lng) < min) {
            index = i;
            min = this.getDistanceFromLatLonInKm(position.coords.latitude, position.coords.longitude, this.markers_coordinates[i].lat, this.markers_coordinates[i].lng);
          }
        }

      }
      var start_1 = {
        lat:position.coords.latitude,
        lng:position.coords.longitude,
      }
      var end_1={
        lat: this.markers_coordinates[index].lat,
        lng: this.markers_coordinates[index].lng,
      }

      console.log("Start: " + start_1.lat);
      console.log("End: " + end_1.lat);

      let request = {
        origin: start_1,
        destination: end_1,
        travelMode: google.maps.TravelMode.WALKING
      }

      this.directions_service.route(request, (response,status) => {
          this.directions_render.setOptions({
            suppressPolylines: false,
            map: this.map
          });

          if(status == google.maps.DirectionsStatus.OK){
            this.directions_render.setDirections(response);
          }
      })
    })

  }

   msg!:string;
   clickEvent(){
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
    min = min * 1000;
    var str = "Тип: " + this.markers_coordinates[index].name + " Оддалеченост: " + min;
    this.msg=str;
    return this.msg;
  }

  ngOnInit(): void {
    this.markers_coordinates = [
      { lng: 21.3317412, lat: 42.003185, name: "Staklo" },
      { lng: 21.332638, lat: 42.0072291, name: "Staklo" },
      { lng: 21.3505605, lat: 42.0058601, name: "Staklo" },
      { lng: 21.3549359, lat: 42.006534, name: "Staklo" },
      { lng: 21.3531533, lat: 42.0088306, name: "Staklo" },
      { lng: 21.3578657, lat: 42.006539, name: "Staklo" },
      { lng: 21.3604459, lat: 42.0097048, name: "Staklo" },
      { lng: 21.3614696, lat: 42.0068278, name: "Staklo" },
      { lng: 21.3630266, lat: 42.0038615, name: "Staklo" },
      { lng: 21.3653616, lat: 42.0061279, name: "Staklo" },
      { lng: 21.3656498, lat: 42.0080118, name: "Staklo" },
      { lng: 21.3714756, lat: 42.007663, name: "Staklo" },
      { lng: 21.3718041, lat: 42.0027558, name: "Staklo" },
      { lng: 21.3564162, lat: 42.0178783, name: "Staklo" },
      { lng: 21.3551878, lat: 42.0192049, name: "Staklo" },
      { lng: 21.3533778, lat: 42.0205895, name: "Staklo" },
      { lng: 21.351952, lat: 42.0209671, name: "Staklo" },
      { lng: 21.3633732, lat: 42.0500839, name: "Staklo" },
      { lng: 21.3799761, lat: 42.0256286, name: "Staklo" },
      { lng: 21.3800217, lat: 42.0256735, name: "Staklo" },
      { lng: 21.3833249, lat: 42.0060225, name: "Staklo" },
      { lng: 21.3828762, lat: 42.0046576, name: "Staklo" },
      { lng: 21.3836405, lat: 42.0015786, name: "Staklo" },
      { lng: 21.3847974, lat: 42.0092748, name: "Staklo" },
      { lng: 21.3866579, lat: 42.0056945, name: "Staklo" },
      { lng: 21.3878195, lat: 42.0039897, name: "Staklo" },
      { lng: 21.3895135, lat: 42.0053231, name: "Staklo" },
      { lng: 21.3898348, lat: 42.0060161, name: "Staklo" },
      { lng: 21.3915699, lat: 42.0062211, name: "Staklo" },
      { lng: 21.3898524, lat: 42.0017263, name: "Staklo" },
      { lng: 21.3915382, lat: 41.9995258, name: "Staklo" },
      { lng: 21.3922196, lat: 41.9974343, name: "Staklo" },
      { lng: 21.3947149, lat: 42.0033278, name: "Staklo" },
      { lng: 21.3954958, lat: 42.0044959, name: "Staklo" },
      { lng: 21.3962591, lat: 42.0056907, name: "Staklo" },
      { lng: 21.3954163, lat: 42.0063465, name: "Staklo" },
      { lng: 21.3947045, lat: 42.0068376, name: "Staklo" },
      { lng: 21.398715, lat: 42.0042135, name: "Staklo" },
      { lng: 21.4008917, lat: 42.0057235, name: "Staklo" },
      { lng: 21.3954252, lat: 41.9947036, name: "Staklo" },
      { lng: 21.3997577, lat: 41.9965267, name: "Staklo" },
      { lng: 21.4006764, lat: 41.9998804, name: "Staklo" },
      { lng: 21.4029248, lat: 41.9993942, name: "Staklo" },
      { lng: 21.403989, lat: 41.9979041, name: "Staklo" },
      { lng: 21.4032367, lat: 41.9958611, name: "Staklo" },
      { lng: 21.4060007, lat: 42.0058963, name: "Staklo" },
      { lng: 21.4057302, lat: 41.9964967, name: "Staklo" },
      { lng: 21.4059555, lat: 41.9997558, name: "Staklo" },
      { lng: 21.4073846, lat: 42.0016338, name: "Staklo" },
      { lng: 21.4079334, lat: 42.0025418, name: "Staklo" },
      { lng: 21.4075727, lat: 41.9954414, name: "Staklo" },
      { lng: 21.4100285, lat: 42.0052216, name: "Staklo" },
      { lng: 21.4105342, lat: 42.0033396, name: "Staklo" },
      { lng: 21.4117835, lat: 42.0006992, name: "Staklo" },
      { lng: 21.4150858, lat: 42.0033262, name: "Staklo" },
      { lng: 21.4163129, lat: 42.004796, name: "Staklo" },
      { lng: 21.4105019, lat: 41.9934505, name: "Staklo" },
      { lng: 21.4110825, lat: 41.9907573, name: "Staklo" },
      { lng: 21.4118983, lat: 41.9934918, name: "Staklo" },
      { lng: 21.4126954, lat: 41.9947222, name: "Staklo" },
      { lng: 21.4142667, lat: 41.9951242, name: "Staklo" },
      { lng: 21.4148611, lat: 41.9923118, name: "Staklo" },
      { lng: 21.4156073, lat: 41.9942442, name: "Staklo" },
      { lng: 21.416892, lat: 41.9927821, name: "Staklo" },
      { lng: 21.4173044, lat: 41.9941629, name: "Staklo" },
      { lng: 21.4161332, lat: 41.9983088, name: "Staklo" },
      { lng: 21.4156253, lat: 42.0002919, name: "Staklo" },
      { lng: 21.4188682, lat: 41.9993285, name: "Staklo" },
      { lng: 21.4193621, lat: 42.0024517, name: "Staklo" },
      { lng: 21.4192826, lat: 41.9939234, name: "Staklo" },
      { lng: 21.4207642, lat: 41.9959683, name: "Staklo" },
      { lng: 21.4187762, lat: 41.9957917, name: "Staklo" },
      { lng: 21.4219615, lat: 41.9948176, name: "Staklo" },
      { lng: 21.4216634, lat: 41.9932274, name: "Staklo" },
      { lng: 21.4224716, lat: 41.9979484, name: "Staklo" },
      { lng: 21.4244645, lat: 41.9982125, name: "Staklo" },
      { lng: 21.4228413, lat: 42.0004396, name: "Staklo" },
      { lng: 21.423468, lat: 42.0025899, name: "Staklo" },
      { lng: 21.4262292, lat: 41.9958647, name: "Staklo" },
      { lng: 21.4269709, lat: 41.9959324, name: "Staklo" },
      { lng: 21.4262774, lat: 41.9928513, name: "Staklo" },
      { lng: 21.4281671, lat: 41.9930709, name: "Staklo" },
      { lng: 21.4285447, lat: 41.9997731, name: "Staklo" },
      { lng: 21.4212874, lat: 41.9827469, name: "Staklo" },
      { lng: 21.422617, lat: 41.9822564, name: "Staklo" },
      { lng: 21.4100617, lat: 42.0361049, name: "Staklo" },
      { lng: 21.4374047, lat: 41.9919859, name: "Staklo" },
      { lng: 21.4421926, lat: 41.9918199, name: "Staklo" },
      { lng: 21.4338048, lat: 41.9850892, name: "Staklo" },
      { lng: 21.4381565, lat: 41.9851101, name: "Staklo" },
      { lng: 21.4386809, lat: 41.9844232, name: "Staklo" },
      { lng: 21.4399509, lat: 41.9849167, name: "Staklo" },
      { lng: 21.4403548, lat: 41.9817124, name: "Staklo" },
      { lng: 21.4428841, lat: 41.980917, name: "Staklo" },
      { lng: 21.4403748, lat: 41.9782172, name: "Staklo" },
      { lng: 21.4384706, lat: 41.9758102, name: "Staklo" },
      { lng: 21.4430171, lat: 41.9787883, name: "Staklo" },
      { lng: 21.4430111, lat: 41.9766349, name: "Staklo" },
      { lng: 21.4464308, lat: 41.9804675, name: "Staklo" },
      { lng: 21.4457656, lat: 41.9796363, name: "Staklo" },
      { lng: 21.4461223, lat: 41.9774292, name: "Staklo" },
      { lng: 21.4447035, lat: 41.9754962, name: "Staklo" },
      { lng: 21.441559, lat: 41.9732144, name: "Staklo" },
      { lng: 21.442724, lat: 41.9722848, name: "Staklo" },
      { lng: 21.4543346, lat: 41.9760775, name: "Staklo" },
      { lng: 21.4477296, lat: 41.9889819, name: "Staklo" },
      { lng: 21.4499273, lat: 41.9917115, name: "Staklo" },
      { lng: 21.4502261, lat: 41.9878239, name: "Staklo" },
      { lng: 21.4485045, lat: 41.9858346, name: "Staklo" },
      { lng: 21.4513438, lat: 41.9846117, name: "Staklo" },
      { lng: 21.454877, lat: 41.9896254, name: "Staklo" },
      { lng: 21.4563908, lat: 41.9879236, name: "Staklo" },
      { lng: 21.4588864, lat: 41.9879488, name: "Staklo" },
      { lng: 21.4599933, lat: 41.9871941, name: "Staklo" },
      { lng: 21.4594718, lat: 41.9892758, name: "Staklo" },
      { lng: 21.4592025, lat: 41.9903373, name: "Staklo" },
      { lng: 21.460813, lat: 41.9856645, name: "Staklo" },
      { lng: 21.4629802, lat: 41.9884027, name: "Staklo" },
      { lng: 21.4642972, lat: 41.9909998, name: "Staklo" },
      { lng: 21.4654992, lat: 41.9920016, name: "Staklo" },
      { lng: 21.4644079, lat: 41.9857023, name: "Staklo" },
      { lng: 21.4660728, lat: 41.9862702, name: "Staklo" },
      { lng: 21.4659533, lat: 41.9844142, name: "Staklo" },
      { lng: 21.4683736, lat: 41.9850761, name: "Staklo" },
      { lng: 21.4702437, lat: 41.9826515, name: "Staklo" },
      { lng: 21.470552, lat: 41.981289, name: "Staklo" },
      { lng: 21.4742544, lat: 41.9823748, name: "Staklo" },
      { lng: 21.4760431, lat: 41.9800709, name: "Staklo" },
      { lng: 21.4750911, lat: 41.9792009, name: "Staklo" },
      { lng: 21.4740581, lat: 41.9868306, name: "Staklo" },
      { lng: 21.4776542, lat: 41.987779, name: "Staklo" },
      { lng: 21.4715244, lat: 41.9741725, name: "Staklo" },
      { lng: 21.4728037, lat: 41.9732529, name: "Staklo" },
      { lng: 21.4792765, lat: 41.9856167, name: "Staklo" },
      { lng: 21.4813487, lat: 41.9861288, name: "Staklo" },
      { lng: 21.4818212, lat: 41.9835294, name: "Staklo" },
      { lng: 21.4808479, lat: 41.9808317, name: "Staklo" },
      { lng: 21.4839551, lat: 41.9848756, name: "Staklo" },
      { lng: 21.4869795, lat: 41.9694836, name: "Staklo" },
      { lng: 21.5110101, lat: 41.9402096, name: "Staklo" },
      { lng: 21.5128116, lat: 41.943506, name: "Staklo" },
      { lng: 21.512288, lat: 41.9365586, name: "Staklo" },
      { lng: 21.5151629, lat: 41.9387221, name: "Staklo" },
      { lng: 21.5173297, lat: 41.9419714, name: "Staklo" },
      { lng: 21.5181499, lat: 41.9387272, name: "Staklo" },
      { lng: 21.5220622, lat: 41.9403648, name: "Staklo" },
      { lng: 21.5242677, lat: 41.9316359, name: "Staklo" },
      { lng: 21.4618982, lat: 42.0029611, name: "Staklo" },
      { lng: 21.4639228, lat: 42.0024634, name: "Staklo" },
      { lng: 21.4659075, lat: 42.0042859, name: "Staklo" },
      { lng: 21.4613511, lat: 42.0109428, name: "Staklo" },
      { lng: 21.4592305, lat: 42.0113254, name: "Staklo" },
      { lng: 21.4564684, lat: 42.0149675, name: "Staklo" },
      { lng: 21.4520576, lat: 42.0155312, name: "Staklo" },
      { lng: 21.5116038, lat: 41.9951347, name: "Staklo" },
      { lng: 21.4925918, lat: 42.003549, name: "Staklo" },
      { lng: 21.4934016, lat: 41.998024, name: "Staklo" },
      { lng: 21.4962323, lat: 41.9970208, name: "Staklo" },
      { lng: 21.5011854, lat: 42.0054575, name: "Staklo" },
      { lng: 21.5033391, lat: 42.0026286, name: "Staklo" },
      { lng: 21.5074692, lat: 41.9928375, name: "Staklo" },
      { lng: 21.5090812, lat: 41.9951256, name: "Staklo" },
      { lng: 21.510225, lat: 41.9968212, name: "Staklo" },
      { lng: 21.5095509, lat: 42.0113513, name: "Staklo" },
      { lng: 21.5156994, lat: 42.0280129, name: "Staklo" },
      { lng: 21.444746, lat: 42.0140617, name: "Staklo" },
      { lng: 21.4402319, lat: 42.0134458, name: "Staklo" },
      { lng: 21.4345608, lat: 42.0159586, name: "Staklo" },
      { lng: 21.4344388, lat: 42.0177136, name: "Staklo" },
      { lng: 21.4327484, lat: 42.0176646, name: "Staklo" },
      { lng: 21.4320876, lat: 42.0204, name: "Staklo" },
      { lng: 21.4343187, lat: 42.0201984, name: "Staklo" },
      { lng: 21.4341972, lat: 42.0227259, name: "Staklo" },
      { lng: 21.4387307, lat: 42.0217833, name: "Staklo" },
      { lng: 21.4387042, lat: 42.0233454, name: "Staklo" },
      { lng: 21.4368603, lat: 42.0246318, name: "Staklo" },
      { lng: 21.4418445, lat: 42.0232869, name: "Staklo" },
      { lng: 21.4450455, lat: 42.0314408, name: "Staklo" },
      { lng: 21.4535386, lat: 42.0289318, name: "Staklo" },
      { lng: 21.4475749, lat: 42.0389612, name: "Staklo" },
      { lng: 21.449884, lat: 42.0485301, name: "Staklo" },
      { lng: 21.4505162, lat: 42.0517074, name: "Staklo" },
      { lng: 21.4500692, lat: 42.0585917, name: "Staklo" },
      { lng: 21.4510844, lat: 42.0591752, name: "Staklo" },
      { lng: 21.4501032, lat: 42.0597039, name: "Staklo" },
      { lng: 21.4512052, lat: 42.0608955, name: "Staklo" },
      { lng: 21.4511515, lat: 42.0619832, name: "Staklo" },
      { lng: 21.4513221, lat: 42.0624698, name: "Staklo" },
      { lng: 21.4482384, lat: 42.0737324, name: "Staklo" },
      { lng: 21.6811256, lat: 42.1246364, name: "Staklo" },
      { lng: 21.6986668, lat: 42.1287007, name: "Staklo" },
      { lng: 21.6987821, lat: 42.1286908, name: "Staklo" },
      { lng: 21.7052437, lat: 42.1319968, name: "Staklo" },
      { lng: 21.7071616, lat: 42.1309434, name: "Staklo" },
      { lng: 21.7098342, lat: 42.1306285, name: "Staklo" },
      { lng: 21.7036646, lat: 42.1378373, name: "Staklo" },
      { lng: 21.7095038, lat: 42.1377896, name: "Staklo" },
      { lng: 21.7220267, lat: 42.1394137, name: "Staklo" },
      { lng: 21.7247765, lat: 42.1392878, name: "Staklo" },
      { lng: 21.7212592, lat: 42.1344572, name: "Staklo" },
      { lng: 21.7260658, lat: 42.1324211, name: "Staklo" },
      { lng: 21.7282969, lat: 42.1313164, name: "Staklo" },
      { lng: 21.723848, lat: 42.1247499, name: "Staklo" },
      { lng: 21.7306583, lat: 42.1202593, name: "Staklo" },
      { lng: 21.7302027, lat: 42.1183155, name: "Staklo" },
      { lng: 21.7330466, lat: 42.1222772, name: "Staklo" },
      { lng: 21.7109467, lat: 42.168462, name: "Staklo" },
      { lng: 21.6905405, lat: 42.1859857, name: "Staklo" },
      { lng: 21.7147125, lat: 42.2113677, name: "Staklo" },
      { lng: 21.7435883, lat: 42.1621488, name: "Staklo" },
      { lng: 21.7518408, lat: 42.1631494, name: "Staklo" },
      { lng: 21.8514286, lat: 42.2767642, name: "Staklo" },
      { lng: 22.1677694, lat: 42.0055565, name: "Staklo" },
      { lng: 22.1798085, lat: 42.0019855, name: "Staklo" },
      { lng: 22.1808294, lat: 41.9984545, name: "Staklo" },
      { lng: 22.1801047, lat: 41.9973912, name: "Staklo" },
      { lng: 22.18061, lat: 41.9964573, name: "Staklo" },
      { lng: 22.1820343, lat: 41.9959736, name: "Staklo" },
      { lng: 22.1838021, lat: 41.9954946, name: "Staklo" },
      { lng: 22.1839414, lat: 41.997196, name: "Staklo" },
      { lng: 22.1881645, lat: 41.990859, name: "Staklo" },
      { lng: 21.7793336, lat: 41.7721585, name: "Staklo" },
      { lng: 21.7682825, lat: 41.7286866, name: "Staklo" },
      { lng: 21.7698724, lat: 41.7276156, name: "Staklo" },
      { lng: 21.7844183, lat: 41.725446, name: "Staklo" },
      { lng: 21.7882321, lat: 41.722572, name: "Staklo" },
      { lng: 21.7879623, lat: 41.7190483, name: "Staklo" },
      { lng: 21.7875576, lat: 41.7150843, name: "Staklo" },
      { lng: 21.7862385, lat: 41.7151429, name: "Staklo" },
      { lng: 21.7840883, lat: 41.7160574, name: "Staklo" },
      { lng: 21.78335, lat: 41.7157581, name: "Staklo" },
      { lng: 21.7848073, lat: 41.7167264, name: "Staklo" },
      { lng: 21.7831109, lat: 41.7175001, name: "Staklo" },
      { lng: 21.778001, lat: 41.7174968, name: "Staklo" },
      { lng: 21.7771373, lat: 41.7185432, name: "Staklo" },
      { lng: 21.7774751, lat: 41.7188271, name: "Staklo" },
      { lng: 21.77623, lat: 41.7172742, name: "Staklo" },
      { lng: 21.774107, lat: 41.7164056, name: "Staklo" },
      { lng: 21.7728863, lat: 41.7159695, name: "Staklo" },
      { lng: 21.7721272, lat: 41.7163819, name: "Staklo" },
      { lng: 21.7712716, lat: 41.715489, name: "Staklo" },
      { lng: 21.7692457, lat: 41.718125, name: "Staklo" },
      { lng: 21.7678462, lat: 41.7179408, name: "Staklo" },
      { lng: 21.7667189, lat: 41.7173403, name: "Staklo" },
      { lng: 21.7656622, lat: 41.7147457, name: "Staklo" },
      { lng: 21.7671046, lat: 41.714996, name: "Staklo" },
      { lng: 21.7651574, lat: 41.7186993, name: "Staklo" },
      { lng: 21.7645511, lat: 41.7169155, name: "Staklo" },
      { lng: 21.7645216, lat: 41.7158804, name: "Staklo" },
      { lng: 21.7628825, lat: 41.7179338, name: "Staklo" },
      { lng: 21.761945, lat: 41.7173201, name: "Staklo" },
      { lng: 21.7694153, lat: 41.7122663, name: "Staklo" },
      { lng: 21.7640454, lat: 41.7117657, name: "Staklo" },
      { lng: 21.7630262, lat: 41.7105643, name: "Staklo" },
      { lng: 21.7618246, lat: 41.7112852, name: "Staklo" },
      { lng: 21.7594687, lat: 41.7063093, name: "Staklo" },
      { lng: 21.7595706, lat: 41.7057847, name: "Staklo" },
      { lng: 21.7586126, lat: 41.7026101, name: "Staklo" },
      { lng: 21.7578509, lat: 41.7025059, name: "Staklo" },
      { lng: 21.7545929, lat: 41.6990837, name: "Staklo" },
      { lng: 22.3998849, lat: 41.9096385, name: "Staklo" },
      { lng: 22.4024973, lat: 41.9098142, name: "Staklo" },
      { lng: 22.4045892, lat: 41.9146324, name: "Staklo" },
      { lng: 22.408575, lat: 41.9140624, name: "Staklo" },
      { lng: 22.4086681, lat: 41.9154031, name: "Staklo" },
      { lng: 22.4119632, lat: 41.9153569, name: "Staklo" },
      { lng: 22.4122422, lat: 41.9136204, name: "Staklo" },
      { lng: 22.4100453, lat: 41.9192956, name: "Staklo" },
      { lng: 22.4112735, lat: 41.9210669, name: "Staklo" },
      { lng: 22.4108041, lat: 41.9217824, name: "Staklo" },
      { lng: 22.4142967, lat: 41.9151145, name: "Staklo" },
      { lng: 22.4160938, lat: 41.9130416, name: "Staklo" },
      { lng: 22.4295667, lat: 41.9148739, name: "Staklo" },
      { lng: 22.5000246, lat: 41.8865822, name: "Staklo" },
      { lng: 22.5016286, lat: 41.8871373, name: "Staklo" },
      { lng: 22.5046438, lat: 41.8813011, name: "Staklo" },
      { lng: 22.5062913, lat: 41.8838887, name: "Staklo" },
      { lng: 22.5079748, lat: 41.885356, name: "Staklo" },
      { lng: 22.5107049, lat: 41.881128, name: "Staklo" },
      { lng: 22.5133903, lat: 41.886339, name: "Staklo" },
      { lng: 22.5168671, lat: 41.8823356, name: "Staklo" },
      { lng: 22.1358541, lat: 41.7738171, name: "Staklo" },
      { lng: 22.141174, lat: 41.7728885, name: "Staklo" },
      { lng: 22.1788687, lat: 41.7474925, name: "Staklo" },
      { lng: 22.1850806, lat: 41.7601775, name: "Staklo" },
      { lng: 22.1832527, lat: 41.7360969, name: "Staklo" },
      { lng: 22.2035858, lat: 41.7815247, name: "Staklo" },
      { lng: 22.1896664, lat: 41.7410774, name: "Staklo" },
      { lng: 22.19049, lat: 41.746577, name: "Staklo" },
      { lng: 22.1906168, lat: 41.7503872, name: "Staklo" },
      { lng: 22.1942285, lat: 41.7384275, name: "Staklo" },
      { lng: 22.1921325, lat: 41.7395278, name: "Staklo" },
      { lng: 22.1936391, lat: 41.7427086, name: "Staklo" },
      { lng: 22.1924615, lat: 41.7455382, name: "Staklo" },
      { lng: 22.1922402, lat: 41.746854, name: "Staklo" },
      { lng: 22.1954641, lat: 41.7445604, name: "Staklo" },
      { lng: 22.1961239, lat: 41.7452408, name: "Staklo" },
      { lng: 22.1961375, lat: 41.7458614, name: "Staklo" },
      { lng: 22.1983583, lat: 41.7443253, name: "Staklo" },
      { lng: 22.1978299, lat: 41.7439991, name: "Staklo" },
      { lng: 22.1985817, lat: 41.7420277, name: "Staklo" },
      { lng: 22.1989935, lat: 41.74937, name: "Staklo" },
      { lng: 22.199307, lat: 41.7502132, name: "Staklo" },
      { lng: 22.2000848, lat: 41.7499731, name: "Staklo" },
      { lng: 22.20178, lat: 41.7489651, name: "Staklo" },
      { lng: 22.2093853, lat: 41.7514061, name: "Staklo" },
      { lng: 22.2025262, lat: 41.7383561, name: "Staklo" },
      { lng: 22.202106, lat: 41.7344773, name: "Staklo" },
      { lng: 22.2048261, lat: 41.7592741, name: "Staklo" },
      { lng: 22.1999479, lat: 41.7623689, name: "Staklo" },
      { lng: 22.1965202, lat: 41.7521409, name: "Staklo" },
      { lng: 22.1949497, lat: 41.7535306, name: "Staklo" },
      { lng: 22.2405293, lat: 41.6364904, name: "Staklo" },
      { lng: 22.6434019, lat: 41.4545172, name: "Staklo" },
      { lng: 22.6433697, lat: 41.4547222, name: "Staklo" },
      { lng: 22.6446253, lat: 41.4536335, name: "Staklo" },
      { lng: 22.6451787, lat: 41.4530085, name: "Staklo" },
      { lng: 22.633408, lat: 41.4437863, name: "Staklo" },
      { lng: 22.6340518, lat: 41.4413225, name: "Staklo" },
      { lng: 22.6363433, lat: 41.4397478, name: "Staklo" },
      { lng: 22.6365162, lat: 41.4383886, name: "Staklo" },
      { lng: 22.6363515, lat: 41.4451099, name: "Staklo" },
      { lng: 22.6385456, lat: 41.4418607, name: "Staklo" },
      { lng: 22.6386604, lat: 41.4414325, name: "Staklo" },
      { lng: 22.640018, lat: 41.4414551, name: "Staklo" },
      { lng: 22.6400174, lat: 41.4434036, name: "Staklo" },
      { lng: 22.6400007, lat: 41.4433875, name: "Staklo" },
      { lng: 22.6399893, lat: 41.4433639, name: "Staklo" },
      { lng: 22.6399839, lat: 41.4433327, name: "Staklo" },
      { lng: 22.6405894, lat: 41.4436608, name: "Staklo" },
      { lng: 22.6409224, lat: 41.445655, name: "Staklo" },
      { lng: 22.641137, lat: 41.4430115, name: "Staklo" },
      { lng: 22.6417565, lat: 41.4434828, name: "Staklo" },
      { lng: 22.6421895, lat: 41.4441591, name: "Staklo" },
      { lng: 22.6430707, lat: 41.4433798, name: "Staklo" },
      { lng: 22.6439117, lat: 41.4428478, name: "Staklo" },
      { lng: 22.643104, lat: 41.4423627, name: "Staklo" },
      { lng: 22.642243, lat: 41.4416891, name: "Staklo" },
      { lng: 22.6440108, lat: 41.440783, name: "Staklo" },
      { lng: 22.6450649, lat: 41.4412998, name: "Staklo" },
      { lng: 22.6446683, lat: 41.4396864, name: "Staklo" },
      { lng: 22.6449835, lat: 41.4389112, name: "Staklo" },
      { lng: 22.6460897, lat: 41.4418004, name: "Staklo" },
      { lng: 22.646956, lat: 41.4407335, name: "Staklo" },
      { lng: 22.6473234, lat: 41.440257, name: "Staklo" },
      { lng: 22.6473127, lat: 41.4390284, name: "Staklo" },
      { lng: 22.6410992, lat: 41.4387056, name: "Staklo" },
      { lng: 22.6409892, lat: 41.4375695, name: "Staklo" },
      { lng: 22.6399104, lat: 41.436325, name: "Staklo" },
      { lng: 22.6429653, lat: 41.439141, name: "Staklo" },
      { lng: 22.6431864, lat: 41.4362042, name: "Staklo" },
      { lng: 22.648993, lat: 41.4401126, name: "Staklo" },
      { lng: 22.6501759, lat: 41.4363927, name: "Staklo" },
      { lng: 22.6495332, lat: 41.4354797, name: "Staklo" },
      { lng: 22.6480273, lat: 41.4337438, name: "Staklo" },
      { lng: 22.6509938, lat: 41.4324568, name: "Staklo" },
      { lng: 22.6508436, lat: 41.4318757, name: "Staklo" },
      { lng: 22.6480145, lat: 41.4300296, name: "Staklo" },
      { lng: 22.6496902, lat: 41.429696, name: "Staklo" },
      { lng: 22.6500603, lat: 41.4285859, name: "Staklo" },
      { lng: 22.6520327, lat: 41.4133869, name: "Staklo" },
      { lng: 21.5351844, lat: 41.3495567, name: "Staklo" },
      { lng: 21.5365904, lat: 41.3508304, name: "Staklo" },
      { lng: 21.5380385, lat: 41.3478889, name: "Staklo" },
      { lng: 21.5392107, lat: 41.3507256, name: "Staklo" },
      { lng: 21.5396828, lat: 41.3503169, name: "Staklo" },
      { lng: 21.5431589, lat: 41.352093, name: "Staklo" },
      { lng: 21.5437204, lat: 41.3530822, name: "Staklo" },
      { lng: 21.5415327, lat: 41.3541049, name: "Staklo" },
      { lng: 21.5419141, lat: 41.3450317, name: "Staklo" },
      { lng: 21.5413646, lat: 41.343676, name: "Staklo" },
      { lng: 21.540551, lat: 41.3367068, name: "Staklo" },
      { lng: 21.540897, lat: 41.3368155, name: "Staklo" },
      { lng: 21.5445466, lat: 41.3352473, name: "Staklo" },
      { lng: 21.5455269, lat: 41.3426886, name: "Staklo" },
      { lng: 21.5477126, lat: 41.3425758, name: "Staklo" },
      { lng: 21.5481149, lat: 41.3427982, name: "Staklo" },
      { lng: 21.5484379, lat: 41.3437475, name: "Staklo" },
      { lng: 21.5498898, lat: 41.3455026, name: "Staklo" },
      { lng: 21.5509054, lat: 41.3447495, name: "Staklo" },
      { lng: 21.5519974, lat: 41.3425434, name: "Staklo" },
      { lng: 21.5553609, lat: 41.3328324, name: "Staklo" },
      { lng: 21.5553529, lat: 41.3327579, name: "Staklo" },
      { lng: 21.5558487, lat: 41.3416816, name: "Staklo" },
      { lng: 21.5570098, lat: 41.3420632, name: "Staklo" },
      { lng: 21.5530839, lat: 41.3447863, name: "Staklo" },
      { lng: 21.5546583, lat: 41.3441872, name: "Staklo" },
      { lng: 21.555261, lat: 41.345184, name: "Staklo" },
      { lng: 21.5560656, lat: 41.3447873, name: "Staklo" },
      { lng: 21.553578, lat: 41.3464956, name: "Staklo" },
      { lng: 21.5515425, lat: 41.3482853, name: "Staklo" },
      { lng: 21.5493276, lat: 41.3413716, name: "Staklo" },
      { lng: 21.5493303, lat: 41.3412266, name: "Staklo" },
      { lng: 21.5508173, lat: 41.3394722, name: "Staklo" },
      { lng: 21.5620525, lat: 41.341046, name: "Staklo" },
      { lng: 21.5605255, lat: 41.3434882, name: "Staklo" },
      { lng: 21.5643232, lat: 41.3425482, name: "Staklo" },
      { lng: 21.5646277, lat: 41.3408951, name: "Staklo" },
      { lng: 21.5683238, lat: 41.3400221, name: "Staklo" },
      { lng: 21.5563331, lat: 41.3473087, name: "Staklo" },
      { lng: 21.5634201, lat: 41.3447616, name: "Staklo" },
      { lng: 21.5620734, lat: 41.346019, name: "Staklo" },
      { lng: 21.5603527, lat: 41.3470508, name: "Staklo" },
      { lng: 21.5606068, lat: 41.3481874, name: "Staklo" },
      { lng: 21.5613002, lat: 41.349865, name: "Staklo" },
      { lng: 21.5614042, lat: 41.3527894, name: "Staklo" },
      { lng: 21.5587426, lat: 41.3547711, name: "Staklo" },
      { lng: 21.5621654, lat: 41.3557899, name: "Staklo" },
      { lng: 21.5645467, lat: 41.3479151, name: "Staklo" },
      { lng: 21.5648119, lat: 41.3455443, name: "Staklo" },
      { lng: 21.566943, lat: 41.3444011, name: "Staklo" },
      { lng: 21.5681084, lat: 41.3456545, name: "Staklo" },
      { lng: 21.5714741, lat: 41.3508381, name: "Staklo" },
      { lng: 21.2260916, lat: 41.0358711, name: "Staklo" },
      { lng: 21.2558159, lat: 41.0431302, name: "Staklo" },
      { lng: 21.2627084, lat: 41.0342201, name: "Staklo" },
      { lng: 21.2702743, lat: 41.0405795, name: "Staklo" },
      { lng: 21.2942775, lat: 41.0373501, name: "Staklo" },
      { lng: 21.3105862, lat: 41.0332622, name: "Staklo" },
      { lng: 21.3107759, lat: 41.0314559, name: "Staklo" },
      { lng: 21.3113056, lat: 41.0291317, name: "Staklo" },
      { lng: 21.3097124, lat: 41.0272558, name: "Staklo" },
      { lng: 21.3081996, lat: 41.0264889, name: "Staklo" },
      { lng: 21.3096077, lat: 41.0238677, name: "Staklo" },
      { lng: 21.3121719, lat: 41.0230159, name: "Staklo" },
      { lng: 21.3122271, lat: 41.0238692, name: "Staklo" },
      { lng: 21.3114895, lat: 41.0252736, name: "Staklo" },
      { lng: 21.3134173, lat: 41.0257496, name: "Staklo" },
      { lng: 21.3137817, lat: 41.0300279, name: "Staklo" },
      { lng: 21.3144362, lat: 41.0298094, name: "Staklo" },
      { lng: 21.3146687, lat: 41.0293933, name: "Staklo" },
      { lng: 21.3163403, lat: 41.0283033, name: "Staklo" },
      { lng: 21.316643, lat: 41.025271, name: "Staklo" },
      { lng: 21.3172913, lat: 41.0242091, name: "Staklo" },
      { lng: 21.3197916, lat: 41.0211264, name: "Staklo" },
      { lng: 21.3212416, lat: 41.0245941, name: "Staklo" },
      { lng: 21.3237706, lat: 41.0244392, name: "Staklo" },
      { lng: 21.3288625, lat: 41.0230186, name: "Staklo" },
      { lng: 21.3305013, lat: 41.0227626, name: "Staklo" },
      { lng: 21.3287096, lat: 41.0250415, name: "Staklo" },
      { lng: 21.3344925, lat: 41.0227213, name: "Staklo" },
      { lng: 21.3333364, lat: 41.025681, name: "Staklo" },
      { lng: 21.335161, lat: 41.0276695, name: "Staklo" },
      { lng: 21.3370095, lat: 41.0232742, name: "Staklo" },
      { lng: 21.3393095, lat: 41.023255, name: "Staklo" },
      { lng: 21.3478338, lat: 41.0134917, name: "Staklo" },
      { lng: 21.3462218, lat: 41.0130627, name: "Staklo" },
      { lng: 21.3459404, lat: 41.0047097, name: "Staklo" },
      { lng: 21.3255205, lat: 41.0318121, name: "Staklo" },
      { lng: 21.3353886, lat: 41.0305911, name: "Staklo" },
      { lng: 21.3375002, lat: 41.0334641, name: "Staklo" },
      { lng: 21.3391264, lat: 41.0345632, name: "Staklo" },
      { lng: 21.3391551, lat: 41.0355369, name: "Staklo" },
      { lng: 21.3421181, lat: 41.0334216, name: "Staklo" },
      { lng: 21.3442086, lat: 41.0348461, name: "Staklo" },
      { lng: 21.3447948, lat: 41.0361529, name: "Staklo" },
      { lng: 21.3462817, lat: 41.0367631, name: "Staklo" },
      { lng: 21.3466701, lat: 41.0345416, name: "Staklo" },
      { lng: 21.3449035, lat: 41.0286684, name: "Staklo" },
      { lng: 21.3439191, lat: 41.0276766, name: "Staklo" },
      { lng: 21.3433536, lat: 41.0267094, name: "Staklo" },
      { lng: 21.345048, lat: 41.0267519, name: "Staklo" },
      { lng: 21.3468669, lat: 41.0441774, name: "Staklo" },
      { lng: 21.3469795, lat: 41.0469568, name: "Staklo" },
      { lng: 21.3474194, lat: 41.0472683, name: "Staklo" },
      { lng: 21.4134838, lat: 42.0016323, name: "Staklo" },
      { lng: 21.4099269, lat: 41.9957187, name: "Staklo" },
      { lng: 21.4175781, lat: 41.9946204, name: "Staklo" },
      { lng: 21.4223964, lat: 41.996872, name: "Staklo" },
      { lng: 21.4061087, lat: 41.9980378, name: "Staklo" },
      { lng: 21.4202102, lat: 41.9968557, name: "Staklo" },
      { lng: 21.4121742, lat: 41.9974789, name: "Staklo" },
      { lng: 21.3970088, lat: 41.9968634, name: "Staklo" },
      { lng: 21.3805478, lat: 42.0032273, name: "Staklo" },
      { lng: 21.3742265, lat: 42.0031597, name: "Staklo" },
      { lng: 21.3848635, lat: 41.9991325, name: "Staklo" },
      { lng: 21.3875323, lat: 41.9986541, name: "Staklo" },
      { lng: 21.396782, lat: 41.9953799, name: "Staklo" },
      { lng: 21.3980476, lat: 41.9981141, name: "Staklo" },
      { lng: 21.3789896, lat: 41.9985119, name: "Staklo" },
      { lng: 21.354525, lat: 42.0047736, name: "Staklo" },
      { lng: 21.3611291, lat: 42.0023134, name: "Staklo" },
      { lng: 21.341896, lat: 42.0050617, name: "Staklo" },
      { lng: 21.3429263, lat: 42.0065476, name: "Staklo" },
      { lng: 21.3482285, lat: 42.0087571, name: "Staklo" },
      { lng: 22.1767754, lat: 42.0778503, name: "Staklo" },
      { lng: 22.1802716, lat: 42.0771455, name: "Staklo" },
      { lng: 22.181582, lat: 42.0777337, name: "Staklo" },
      { lng: 22.0914688, lat: 41.4850615, name: "Staklo" },
      { lng: 22.0823212, lat: 41.4824672, name: "Staklo" },
      { lng: 22.0925107, lat: 41.4935863, name: "Staklo" },
      { lng: 22.0902332, lat: 41.4828274, name: "Staklo" },
      { lng: 22.079053, lat: 41.4828956, name: "Staklo" },
      { lng: 22.0872067, lat: 41.477218, name: "Staklo" },
      { lng: 22.0909475, lat: 41.4833268, name: "Staklo" },
      { lng: 22.0915361, lat: 41.4830455, name: "Staklo" },
      { lng: 22.0914503, lat: 41.4834192, name: "Staklo" },
      { lng: 22.1060563, lat: 41.4948721, name: "Staklo" },
      { lng: 21.392618, lat: 42.0014417, name: "Staklo" },
      { lng: 21.3984005, lat: 42.0006886, name: "Staklo" },
      { lng: 21.4024259, lat: 42.000262, name: "Staklo" },
      { lng: 21.3892492, lat: 41.9991029, name: "Staklo" },
      { lng: 21.3895442, lat: 42.0005455, name: "Staklo" },
      { lng: 21.363155, lat: 42.0026714, name: "Staklo" },
      { lng: 21.5227256, lat: 41.9369673, name: "Staklo" },
      { lng: 21.5228047, lat: 41.9369474, name: "Staklo" },
      { lng: 21.5199773, lat: 41.9378689, name: "Staklo" },
      { lng: 21.5175445, lat: 41.9379332, name: "Staklo" },
      { lng: 21.5137892, lat: 41.9400552, name: "Staklo" },
      { lng: 21.5110015, lat: 41.9406866, name: "Staklo" },
      { lng: 21.5180664, lat: 41.9429251, name: "Staklo" },
      { lng: 21.5210275, lat: 41.9325861, name: "Staklo" },
      { lng: 21.5216841, lat: 41.932249, name: "Staklo" },
      { lng: 21.5135941, lat: 41.9361569, name: "Staklo" },
      { lng: 21.4084311, lat: 41.9756259, name: "Staklo" },
      { lng: 22.4631655, lat: 41.6326206, name: "Staklo" },
      { lng: 22.4744958, lat: 41.6325804, name: "Staklo" },
      { lng: 22.4600062, lat: 41.6474446, name: "Staklo" },
      { lng: 22.4824463, lat: 41.6305193, name: "Staklo" },
      { lng: 22.4598642, lat: 41.6353951, name: "Staklo" },
      { lng: 22.4669797, lat: 41.6345216, name: "Staklo" },
      { lng: 22.4780039, lat: 41.6320056, name: "Staklo" },
      { lng: 22.4702736, lat: 41.6357723, name: "Staklo" },
      { lng: 22.4690469, lat: 41.6385097, name: "Staklo" },
      { lng: 22.4657244, lat: 41.6347081, name: "Staklo" },
      { lng: 22.4580871, lat: 41.6460695, name: "Staklo" },
      { lng: 22.4599997, lat: 41.6411316, name: "Staklo" },
      { lng: 22.4622015, lat: 41.6374172, name: "Staklo" },
      { lng: 22.5720566, lat: 41.202811, name: "Staklo" },
      { lng: 22.571417, lat: 41.1993534, name: "Staklo" },
      { lng: 22.5782878, lat: 41.1552158, name: "Staklo" },
      { lng: 22.577502, lat: 41.2034582, name: "Staklo" },
      { lng: 22.5754798, lat: 41.2029174, name: "Staklo" },
      { lng: 21.4173228, lat: 41.9972713, name: "Staklo" },
      { lng: 22.5613687, lat: 41.3185688, name: "Staklo" },
      { lng: 22.4755557, lat: 41.3321233, name: "Staklo" },
      { lng: 22.5634516, lat: 41.3174453, name: "Staklo" },
      { lng: 22.5598221, lat: 41.3184625, name: "Staklo" },
      { lng: 22.3374981, lat: 42.2076948, name: "Staklo" },
      { lng: 22.336181, lat: 42.2049001, name: "Staklo" },
      { lng: 22.3354094, lat: 42.202221, name: "Staklo" },
      { lng: 22.3316351, lat: 42.2003386, name: "Staklo" },
      { lng: 22.3103169, lat: 42.191926, name: "Staklo" },
      { lng: 22.8827975, lat: 41.7630776, name: "Staklo" },
      { lng: 22.8869193, lat: 41.7619736, name: "Staklo" },
      { lng: 22.8836493, lat: 41.7617715, name: "Staklo" },
      { lng: 22.8873318, lat: 41.7617788, name: "Staklo" },
      { lng: 22.8920451, lat: 41.7608016, name: "Staklo" },
      { lng: 22.8865088, lat: 41.7608438, name: "Staklo" },
      { lng: 22.8871445, lat: 41.7620953, name: "Staklo" },
      { lng: 22.8854327, lat: 41.7623243, name: "Staklo" },
      { lng: 22.8931793, lat: 41.7626751, name: "Staklo" },
      { lng: 22.8524044, lat: 41.7034913, name: "Staklo" },
      { lng: 22.8536546, lat: 41.7065645, name: "Staklo" },
      { lng: 22.8465644, lat: 41.7067722, name: "Staklo" },
      { lng: 22.8575687, lat: 41.707156, name: "Staklo" },
      { lng: 22.8549527, lat: 41.7122027, name: "Staklo" },
      { lng: 22.8518567, lat: 41.7091818, name: "Staklo" },
      { lng: 22.8529858, lat: 41.7051534, name: "Staklo" },
      { lng: 22.8551224, lat: 41.7066226, name: "Staklo" },
      { lng: 22.8565118, lat: 41.7076299, name: "Staklo" },
      { lng: 22.8544077, lat: 41.7089278, name: "Staklo" },
      { lng: 22.8596958, lat: 41.700547, name: "Staklo" },
      { lng: 22.4905139, lat: 41.1715018, name: "Staklo" },
      { lng: 22.4941574, lat: 41.1584265, name: "Staklo" },
      { lng: 22.4962112, lat: 41.1623846, name: "Staklo" },
      { lng: 22.5046524, lat: 41.1650255, name: "Staklo" },
      { lng: 22.5225342, lat: 41.1476317, name: "Staklo" },
      { lng: 22.5052052, lat: 41.1407917, name: "Staklo" },
      { lng: 22.4986486, lat: 41.1481056, name: "Staklo" },
      { lng: 22.5030671, lat: 41.1399561, name: "Staklo" },
      { lng: 22.4349486, lat: 41.3080451, name: "Staklo" },
      { lng: 22.4707075, lat: 41.2581478, name: "Staklo" },
      { lng: 22.709143, lat: 41.2134422, name: "Staklo" },
      { lng: 22.7220519, lat: 41.1868766, name: "Staklo" },
      { lng: 22.7231727, lat: 41.1837953, name: "Staklo" },
      { lng: 22.7229433, lat: 41.1833063, name: "Staklo" },
      { lng: 22.7229688, lat: 41.1832695, name: "Staklo" },
      { lng: 22.7240058, lat: 41.1807395, name: "Staklo" },
      { lng: 22.7428427, lat: 41.1725004, name: "Staklo" },
      { lng: 22.7427408, lat: 41.1723591, name: "Staklo" },
      { lng: 21.9306815, lat: 41.8660938, name: "Staklo" },
      { lng: 21.9371932, lat: 41.8652707, name: "Staklo" },
      { lng: 21.9419065, lat: 41.8649361, name: "Staklo" },
      { lng: 21.9410727, lat: 41.8696299, name: "Staklo" },
      { lng: 21.9454605, lat: 41.8630589, name: "Staklo" },
      { lng: 21.9455195, lat: 41.8630509, name: "Staklo" },
      { lng: 20.9470034, lat: 41.9360033, name: "Staklo" },
      { lng: 20.9789783, lat: 41.8935679, name: "Staklo" },
      { lng: 21.0186091, lat: 41.9063556, name: "Staklo" },
      { lng: 21.0146105, lat: 41.9286768, name: "Staklo" },
      { lng: 21.0133552, lat: 41.9321728, name: "Staklo" },
      { lng: 21.0218829, lat: 41.8957526, name: "Staklo" },
      { lng: 20.9630567, lat: 41.9063409, name: "Staklo" },
      { lng: 20.9820741, lat: 41.9676095, name: "Staklo" },
      { lng: 21.1087542, lat: 42.1053583, name: "Staklo" },
      { lng: 21.1114713, lat: 42.1077939, name: "Staklo" },
      { lng: 21.031432, lat: 42.0604497, name: "Staklo" },
      { lng: 21.0772007, lat: 42.1016948, name: "Staklo" },
      { lng: 21.078433, lat: 42.1056134, name: "Staklo" },
      { lng: 21.0548696, lat: 42.0799091, name: "Staklo" },
      { lng: 21.0539147, lat: 42.078191, name: "Staklo" },
      { lng: 21.0533541, lat: 42.0772752, name: "Staklo" },
      { lng: 21.0417945, lat: 42.0686217, name: "Staklo" },
      { lng: 21.0427408, lat: 42.0692841, name: "Staklo" },
      { lng: 20.9792155, lat: 42.0079643, name: "Staklo" },
      { lng: 20.9783211, lat: 42.0081168, name: "Staklo" },
      { lng: 20.97744, lat: 42.0084079, name: "Staklo" },
      { lng: 20.9614679, lat: 41.9940475, name: "Staklo" },
      { lng: 20.9721995, lat: 42.0073238, name: "Staklo" },
      { lng: 20.9727211, lat: 42.0080999, name: "Staklo" },
      { lng: 20.973534, lat: 42.0083186, name: "Staklo" },
      { lng: 20.9742528, lat: 42.0083984, name: "Staklo" },
      { lng: 20.9752613, lat: 42.0077168, name: "Staklo" },
      { lng: 20.9763557, lat: 42.0077486, name: "Staklo" },
      { lng: 20.9602668, lat: 41.9912769, name: "Staklo" },
      { lng: 20.9607711, lat: 41.9936452, name: "Staklo" },
      { lng: 20.9609902, lat: 41.9970484, name: "Staklo" },
      { lng: 21.4498049, lat: 41.9901203, name: "Staklo" },
      { lng: 21.4520074, lat: 41.9887006, name: "Staklo" },
      { lng: 21.4565843, lat: 41.9893022, name: "Staklo" },
      { lng: 21.4534974, lat: 41.9866185, name: "Staklo" },
      { lng: 21.4515866, lat: 41.985273, name: "Staklo" },
      { lng: 21.4538074, lat: 41.9844512, name: "Staklo" },
      { lng: 21.456115, lat: 41.9863006, name: "Staklo" },
      { lng: 21.4569237, lat: 41.9856429, name: "Staklo" },
      { lng: 21.4590494, lat: 41.9840528, name: "Staklo" },
      { lng: 21.4613355, lat: 41.9889739, name: "Staklo" },
      { lng: 21.4634315, lat: 41.991948, name: "Staklo" },
      { lng: 21.4678448, lat: 41.9914882, name: "Staklo" },
      { lng: 21.47105, lat: 41.9902801, name: "Staklo" },
      { lng: 21.4673932, lat: 41.9873243, name: "Staklo" },
      { lng: 21.4682381, lat: 41.9868299, name: "Staklo" },
      { lng: 21.4728051, lat: 41.989366, name: "Staklo" },
      { lng: 21.4731715, lat: 41.9882689, name: "Staklo" },
      { lng: 21.4724371, lat: 41.987519, name: "Staklo" },
      { lng: 21.471907, lat: 41.9848175, name: "Staklo" },
      { lng: 21.4737444, lat: 41.9852704, name: "Staklo" },
      { lng: 21.4756086, lat: 41.9829775, name: "Staklo" },
      { lng: 21.4766791, lat: 41.9823767, name: "Staklo" },
      { lng: 21.4838701, lat: 41.9823876, name: "Staklo" },
      { lng: 21.4728753, lat: 41.9788845, name: "Staklo" },
      { lng: 21.4724524, lat: 41.9754523, name: "Staklo" },
      { lng: 21.4787028, lat: 41.9744374, name: "Staklo" },
      { lng: 21.4869148, lat: 41.9743941, name: "Staklo" },
      { lng: 21.4569488, lat: 42.0163019, name: "Staklo" },
      { lng: 21.4604601, lat: 42.0143885, name: "Staklo" },
      { lng: 21.4581201, lat: 42.0125717, name: "Staklo" },
      { lng: 21.4633532, lat: 42.005085, name: "Staklo" },
      { lng: 21.460937, lat: 42.0033377, name: "Staklo" },
      { lng: 21.4607759, lat: 42.0018423, name: "Staklo" },
      { lng: 21.4676047, lat: 42.0031196, name: "Staklo" },
      { lng: 21.4884065, lat: 42.0004229, name: "Staklo" },
      { lng: 21.4886694, lat: 42.0008794, name: "Staklo" },
      { lng: 21.4934271, lat: 41.9984643, name: "Staklo" },
      { lng: 21.493618, lat: 41.9992028, name: "Staklo" },
      { lng: 21.4951862, lat: 42.0028969, name: "Staklo" },
      { lng: 21.4988652, lat: 42.0046666, name: "Staklo" },
      { lng: 21.5009392, lat: 42.0061689, name: "Staklo" },
      { lng: 21.5002668, lat: 42.0076149, name: "Staklo" },
      { lng: 21.504366, lat: 42.006641, name: "Staklo" },
      { lng: 21.5057299, lat: 42.0040539, name: "Staklo" },
      { lng: 21.5062768, lat: 42.0029473, name: "Staklo" },
      { lng: 21.500107, lat: 41.9958259, name: "Staklo" },
      { lng: 21.5049807, lat: 41.9949199, name: "Staklo" },
      { lng: 21.5078332, lat: 41.9966768, name: "Staklo" },
      { lng: 21.5086889, lat: 41.9937458, name: "Staklo" },
      { lng: 21.5104887, lat: 41.9949376, name: "Staklo" },
      { lng: 21.5264592, lat: 41.9816728, name: "Staklo" },
      { lng: 21.3989258, lat: 42.0049811, name: "Staklo" },
      { lng: 21.396165, lat: 41.9987725, name: "Staklo" },
      { lng: 21.5123402, lat: 42.0162997, name: "Staklo" },
      { lng: 21.5056207, lat: 42.0101823, name: "Staklo" },
      { lng: 21.5091923, lat: 42.0111034, name: "Staklo" },
      { lng: 21.5098363, lat: 42.0105659, name: "Staklo" },
      { lng: 21.5110405, lat: 42.0093673, name: "Staklo" },
      { lng: 21.5177847, lat: 42.0058299, name: "Staklo" },
      { lng: 21.4599188, lat: 41.9808784, name: "Staklo" },
      { lng: 21.4643835, lat: 41.9800805, name: "Staklo" },
      { lng: 20.8989183, lat: 41.7950482, name: "Staklo" },
      { lng: 20.9072752, lat: 41.8081456, name: "Staklo" },
      { lng: 20.9080679, lat: 41.7955825, name: "Staklo" },
      { lng: 20.9094305, lat: 41.7958944, name: "Staklo" },
      { lng: 20.9150148, lat: 41.7962904, name: "Staklo" },
      { lng: 20.9090115, lat: 41.7972547, name: "Staklo" },
      { lng: 20.8838185, lat: 41.801574, name: "Staklo" },
      { lng: 20.8837245, lat: 41.8058547, name: "Staklo" },
      { lng: 20.9040557, lat: 41.8029097, name: "Staklo" },
      { lng: 20.9047852, lat: 41.801954, name: "Staklo" },
      { lng: 20.9027038, lat: 41.8037015, name: "Staklo" },
      { lng: 20.9045867, lat: 41.8035335, name: "Staklo" },
      { lng: 20.9154938, lat: 41.7954086, name: "Staklo" },
      { lng: 20.9167974, lat: 41.7938924, name: "Staklo" },
      { lng: 20.916903, lat: 41.7957192, name: "Staklo" },
      { lng: 20.9170093, lat: 41.7979681, name: "Staklo" },
      { lng: 20.913509, lat: 41.8028248, name: "Staklo" },
      { lng: 20.9081338, lat: 41.7903696, name: "Staklo" },
      { lng: 20.9070502, lat: 41.7887737, name: "Staklo" },
      { lng: 20.9112345, lat: 41.7893856, name: "Staklo" },
      { lng: 20.9091102, lat: 41.7887537, name: "Staklo" },
      { lng: 20.9128814, lat: 41.7894216, name: "Staklo" },
      { lng: 20.9148286, lat: 41.7889777, name: "Staklo" },
      { lng: 20.9150266, lat: 41.8000601, name: "Staklo" },
      { lng: 20.9135353, lat: 41.8015926, name: "Staklo" },
      { lng: 20.9025145, lat: 41.7904209, name: "Staklo" },
      { lng: 20.9074047, lat: 41.7903676, name: "Staklo" },
      { lng: 21.2025391, lat: 41.2280108, name: "Staklo" },
      { lng: 21.2036119, lat: 41.219173, name: "Staklo" },
      { lng: 21.2029843, lat: 41.2201828, name: "Staklo" },
      { lng: 21.2460729, lat: 41.373699, name: "Staklo" },
      { lng: 21.2484907, lat: 41.3636384, name: "Staklo" },
      { lng: 21.2533053, lat: 41.3646127, name: "Staklo" },
      { lng: 21.2485175, lat: 41.3679885, name: "Staklo" },
      { lng: 21.2493302, lat: 41.3684012, name: "Staklo" },
      { lng: 21.0089237, lat: 41.0894917, name: "Staklo" },
      { lng: 21.0113722, lat: 41.0976963, name: "Staklo" },
      { lng: 21.0112587, lat: 41.0929077, name: "Staklo" },
      { lng: 21.014031, lat: 41.085491, name: "Staklo" },
      { lng: 21.0098682, lat: 41.085115, name: "Staklo" },
      { lng: 21.0100506, lat: 41.0839909, name: "Staklo" },
      { lng: 21.0093103, lat: 41.0828022, name: "Staklo" },
      { lng: 21.0135262, lat: 41.0883953, name: "Staklo" },
      { lng: 21.0139365, lat: 41.0891799, name: "Staklo" },
      { lng: 21.0134832, lat: 41.0899733, name: "Staklo" },
      { lng: 21.5134478, lat: 42.0276437, name: "Staklo" },
      { lng: 21.2165655, lat: 41.507051, name: "Staklo" },
      { lng: 21.2164836, lat: 41.5117806, name: "Staklo" },
      { lng: 21.2193195, lat: 41.5073954, name: "Staklo" },
      { lng: 20.7571664, lat: 41.7014623, name: "Staklo" },
      { lng: 20.8044965, lat: 41.6949423, name: "Staklo" },
      { lng: 20.7348251, lat: 41.6577059, name: "Staklo" },
      { lng: 20.7344747, lat: 41.6586844, name: "Staklo" },
      { lng: 20.7357734, lat: 41.6509542, name: "Staklo" },
      { lng: 22.0103337, lat: 41.4404307, name: "Staklo" },
      { lng: 22.0191577, lat: 41.4342457, name: "Staklo" },
      { lng: 22.0188855, lat: 41.4391539, name: "Staklo" },
      { lng: 22.0225281, lat: 41.4352324, name: "Staklo" },
      { lng: 22.0161929, lat: 41.4293219, name: "Staklo" },
      { lng: 22.0128853, lat: 41.4331718, name: "Staklo" },
      { lng: 22.0167198, lat: 41.4318976, name: "Staklo" },
      { lng: 22.015525, lat: 41.4384988, name: "Staklo" },
      { lng: 22.010395, lat: 41.4415162, name: "Staklo" },
      { lng: 22.0109663, lat: 41.4376379, name: "Staklo" },
      { lng: 22.0026009, lat: 41.4328633, name: "Staklo" },
      { lng: 22.0072304, lat: 41.4407665, name: "Staklo" },
      { lng: 20.6471182, lat: 41.138103, name: "Staklo" },
      { lng: 20.6743294, lat: 41.1740271, name: "Staklo" },
      { lng: 20.6704233, lat: 41.1765725, name: "Staklo" },
      { lng: 20.6668884, lat: 41.1752719, name: "Staklo" },
      { lng: 20.6719805, lat: 41.1769964, name: "Staklo" },
      { lng: 20.6811228, lat: 41.1729476, name: "Staklo" },
      { lng: 20.6812059, lat: 41.1729789, name: "Staklo" },
      { lng: 20.6678635, lat: 41.1718783, name: "Staklo" },
      { lng: 20.6679386, lat: 41.1718904, name: "Staklo" },
      { lng: 20.6680097, lat: 41.1719005, name: "Staklo" },
      { lng: 20.6680861, lat: 41.1719116, name: "Staklo" },
      { lng: 20.6674196, lat: 41.1720842, name: "Staklo" },
      { lng: 20.6733471, lat: 41.1744483, name: "Staklo" },
      { lng: 20.6686146, lat: 41.1732699, name: "Staklo" },
      { lng: 20.6876192, lat: 41.1744923, name: "Staklo" },
      { lng: 20.6872089, lat: 41.1736265, name: "Staklo" },
      { lng: 20.6704676, lat: 41.1741589, name: "Staklo" },
      { lng: 20.6746272, lat: 41.1740105, name: "Staklo" },
      { lng: 20.6660085, lat: 41.1728919, name: "Staklo" },
      { lng: 20.6769411, lat: 41.1816212, name: "Staklo" },
      { lng: 20.6872096, lat: 41.178067, name: "Staklo" },
      { lng: 20.6878855, lat: 41.1776512, name: "Staklo" },
      { lng: 20.6822851, lat: 41.1822665, name: "Staklo" },
      { lng: 20.6846695, lat: 41.1779186, name: "Staklo" },
      { lng: 20.6825428, lat: 41.1753444, name: "Staklo" },
      { lng: 20.6827762, lat: 41.175944, name: "Staklo" },
      { lng: 20.683664, lat: 41.1758088, name: "Staklo" },
      { lng: 20.6851043, lat: 41.1755362, name: "Staklo" },
      { lng: 20.6476131, lat: 41.1429576, name: "Staklo" },
      { lng: 20.6476882, lat: 41.1430384, name: "Staklo" },
      { lng: 20.6748061, lat: 41.1778932, name: "Staklo" },
      { lng: 20.6833215, lat: 41.1729871, name: "Staklo" },
      { lng: 20.6896861, lat: 41.1772205, name: "Staklo" },
      { lng: 20.6508518, lat: 41.1450094, name: "Staklo" },
      { lng: 20.9504167, lat: 41.5123215, name: "Staklo" },
      { lng: 20.9594162, lat: 41.5091015, name: "Staklo" },
      { lng: 20.9631429, lat: 41.5124908, name: "Staklo" },
      { lng: 20.963507, lat: 41.5128492, name: "Staklo" },
      { lng: 20.9621223, lat: 41.5101692, name: "Staklo" },
      { lng: 20.9574708, lat: 41.5182175, name: "Staklo" },
      { lng: 20.9610552, lat: 41.5129109, name: "Staklo" },
      { lng: 20.961201, lat: 41.5193452, name: "Staklo" },
      { lng: 20.9551277, lat: 41.510353, name: "Staklo" },
      { lng: 20.9565001, lat: 41.50852, name: "Staklo" },
      { lng: 20.9577314, lat: 41.5126374, name: "Staklo" },
      { lng: 20.9586897, lat: 41.5112919, name: "Staklo" },
      { lng: 20.9543213, lat: 41.5065074, name: "Staklo" },
      { lng: 20.9546203, lat: 41.5079498, name: "Staklo" },
      { lng: 20.9533905, lat: 41.507015, name: "Staklo" },
      { lng: 20.9532604, lat: 41.5104735, name: "Staklo" },
      { lng: 20.953674, lat: 41.5116911, name: "Staklo" },
      { lng: 20.7765281, lat: 41.1235375, name: "Staklo" },
      { lng: 20.7801652, lat: 41.124402, name: "Staklo" },
      { lng: 20.7830907, lat: 41.1231925, name: "Staklo" },
      { lng: 20.8179882, lat: 41.1123791, name: "Staklo" },
      { lng: 20.7820232, lat: 41.1214193, name: "Staklo" },
      { lng: 20.8010793, lat: 41.11523, name: "Staklo" },
      { lng: 20.7927058, lat: 41.1194973, name: "Staklo" },
      { lng: 20.7901646, lat: 41.1222549, name: "Staklo" },
      { lng: 20.8021713, lat: 41.1134155, name: "Staklo" },
      { lng: 20.8043168, lat: 41.1117192, name: "Staklo" },
      { lng: 20.8096777, lat: 41.1059189, name: "Staklo" },
      { lng: 20.8158063, lat: 41.1129791, name: "Staklo" },
      { lng: 20.8165734, lat: 41.1134924, name: "Staklo" },
      { lng: 20.8077186, lat: 41.1114852, name: "Staklo" },
      { lng: 20.8097846, lat: 41.1119722, name: "Staklo" },
      { lng: 20.8058314, lat: 41.1086231, name: "Staklo" },
      { lng: 20.812123, lat: 41.1083571, name: "Staklo" },
      { lng: 20.800126, lat: 41.1129806, name: "Staklo" },
      { lng: 20.8024967, lat: 41.1188539, name: "Staklo" },
      { lng: 20.8073795, lat: 41.1029945, name: "Staklo" },
      { lng: 20.8136542, lat: 41.1132841, name: "Staklo" },
      { lng: 20.8057767, lat: 41.1108486, name: "Staklo" },
      { lng: 20.8065077, lat: 41.1148519, name: "Staklo" },
      { lng: 20.8067626, lat: 41.1174869, name: "Staklo" },
      { lng: 20.8067787, lat: 41.1173778, name: "Staklo" },
      { lng: 20.8106989, lat: 41.1280845, name: "Staklo" },
      { lng: 20.8142535, lat: 41.1177382, name: "Staklo" },
      { lng: 20.8101171, lat: 41.1167439, name: "Staklo" },
      { lng: 20.8086827, lat: 41.1215239, name: "Staklo" },
      { lng: 20.7911674, lat: 41.1235196, name: "Staklo" },
      { lng: 20.8121006, lat: 41.123553, name: "Staklo" },
      { lng: 20.812765, lat: 41.1163964, name: "Staklo" },
      { lng: 20.9752217, lat: 42.0099323, name: "Staklo" },
      { lng: 20.9834608, lat: 42.0049413, name: "Staklo" },
      { lng: 20.979266, lat: 42.010135, name: "Staklo" },
      { lng: 20.9859823, lat: 42.0047179, name: "Staklo" },
      { lng: 20.9808588, lat: 42.0110622, name: "Staklo" },
      { lng: 20.9799391, lat: 42.0089511, name: "Staklo" },
      { lng: 20.9689748, lat: 42.011467, name: "Staklo" },
      { lng: 20.9632806, lat: 41.9937427, name: "Staklo" },
      { lng: 20.9719548, lat: 42.010649, name: "Staklo" },
      { lng: 20.9712599, lat: 42.0136203, name: "Staklo" },
      { lng: 20.9743372, lat: 42.0009718, name: "Staklo" },
      { lng: 20.9762646, lat: 42.0026483, name: "Staklo" },
      { lng: 20.9597713, lat: 41.9897569, name: "Staklo" },
      { lng: 20.9669546, lat: 41.9978378, name: "Staklo" },
      { lng: 20.9840151, lat: 42.0080621, name: "Staklo" },
      { lng: 20.9808205, lat: 42.0144886, name: "Staklo" },
      { lng: 20.9743463, lat: 42.006571, name: "Staklo" },
      { lng: 20.9781042, lat: 42.0032148, name: "Staklo" },
      { lng: 20.9798599, lat: 42.0023908, name: "Staklo" },
      { lng: 21.3317104, lat: 42.0031182, name: "Plastika/limenki" },
      { lng: 21.350539, lat: 42.0057873, name: "Plastika/limenki" },
      { lng: 21.355011, lat: 42.006533, name: "Plastika/limenki" },
      { lng: 21.3632028, lat: 42.0502103, name: "Plastika/limenki" },
      { lng: 21.3834724, lat: 42.0059807, name: "Plastika/limenki" },
      { lng: 21.4007968, lat: 42.0089819, name: "Plastika/limenki" },
      { lng: 21.4003488, lat: 42.0089715, name: "Plastika/limenki" },
      { lng: 21.3898357, lat: 42.0016518, name: "Plastika/limenki" },
      { lng: 21.3915583, lat: 41.9995916, name: "Plastika/limenki" },
      { lng: 21.3922163, lat: 41.9975075, name: "Plastika/limenki" },
      { lng: 21.3947927, lat: 42.0033139, name: "Plastika/limenki" },
      { lng: 21.3955978, lat: 42.0044759, name: "Plastika/limenki" },
      { lng: 21.3956943, lat: 42.004456, name: "Plastika/limenki" },
      { lng: 21.3954976, lat: 41.9946757, name: "Plastika/limenki" },
      { lng: 21.3966861, lat: 41.9953923, name: "Plastika/limenki" },
      { lng: 21.3996343, lat: 41.9965526, name: "Plastika/limenki" },
      { lng: 21.4006576, lat: 41.9998066, name: "Plastika/limenki" },
      { lng: 21.4030428, lat: 41.9993762, name: "Plastika/limenki" },
      { lng: 21.4027478, lat: 41.9979989, name: "Plastika/limenki" },
      { lng: 21.4040011, lat: 41.9979564, name: "Plastika/limenki" },
      { lng: 21.406041, lat: 42.0058405, name: "Plastika/limenki" },
      { lng: 21.4056927, lat: 41.996397, name: "Plastika/limenki" },
      { lng: 21.4074892, lat: 42.0012889, name: "Plastika/limenki" },
      { lng: 21.4079441, lat: 42.0025917, name: "Plastika/limenki" },
      { lng: 21.4101103, lat: 42.0052047, name: "Plastika/limenki" },
      { lng: 21.4135352, lat: 42.001737, name: "Plastika/limenki" },
      { lng: 21.4162405, lat: 42.0047163, name: "Plastika/limenki" },
      { lng: 21.4111616, lat: 41.9907144, name: "Plastika/limenki" },
      { lng: 21.4126082, lat: 41.9947371, name: "Plastika/limenki" },
      { lng: 21.4148517, lat: 41.992248, name: "Plastika/limenki" },
      { lng: 21.4168196, lat: 41.992793, name: "Plastika/limenki" },
      { lng: 21.4173547, lat: 41.9941574, name: "Plastika/limenki" },
      { lng: 21.4178045, lat: 41.9998625, name: "Plastika/limenki" },
      { lng: 21.4208527, lat: 41.9959693, name: "Plastika/limenki" },
      { lng: 21.4224086, lat: 41.9979454, name: "Plastika/limenki" },
      { lng: 21.4234304, lat: 42.0025491, name: "Plastika/limenki" },
      { lng: 21.424267, lat: 41.9953092, name: "Plastika/limenki" },
      { lng: 21.4281255, lat: 41.9930923, name: "Plastika/limenki" },
      { lng: 21.4279537, lat: 41.9919689, name: "Plastika/limenki" },
      { lng: 21.4225446, lat: 41.9823601, name: "Plastika/limenki" },
      { lng: 21.4100623, lat: 42.0360139, name: "Plastika/limenki" },
      { lng: 21.435964, lat: 41.9912648, name: "Plastika/limenki" },
      { lng: 21.4382979, lat: 41.9920418, name: "Plastika/limenki" },
      { lng: 21.4343731, lat: 41.9842035, name: "Plastika/limenki" },
      { lng: 21.4351522, lat: 41.9818376, name: "Plastika/limenki" },
      { lng: 21.4386192, lat: 41.9844113, name: "Plastika/limenki" },
      { lng: 21.4398329, lat: 41.9849526, name: "Plastika/limenki" },
      { lng: 21.4400755, lat: 41.9823992, name: "Plastika/limenki" },
      { lng: 21.4409216, lat: 41.9805312, name: "Plastika/limenki" },
      { lng: 21.4403104, lat: 41.9783248, name: "Plastika/limenki" },
      { lng: 21.4384921, lat: 41.9757454, name: "Plastika/limenki" },
      { lng: 21.4431405, lat: 41.9788681, name: "Plastika/limenki" },
      { lng: 21.4429307, lat: 41.9767905, name: "Plastika/limenki" },
      { lng: 21.4462886, lat: 41.9805253, name: "Plastika/limenki" },
      { lng: 21.4461827, lat: 41.9773375, name: "Plastika/limenki" },
      { lng: 21.4446109, lat: 41.9754912, name: "Plastika/limenki" },
      { lng: 21.4462049, lat: 41.9752103, name: "Plastika/limenki" },
      { lng: 21.4462076, lat: 41.9745941, name: "Plastika/limenki" },
      { lng: 21.441488, lat: 41.9731925, name: "Plastika/limenki" },
      { lng: 21.4544231, lat: 41.9760257, name: "Plastika/limenki" },
      { lng: 21.4535068, lat: 41.9894459, name: "Plastika/limenki" },
      { lng: 21.3999117, lat: 42.0089751, name: "Plastika/limenki" },
      { lng: 21.4600363, lat: 41.9871737, name: "Plastika/limenki" },
      { lng: 21.4595791, lat: 41.9892558, name: "Plastika/limenki" },
      { lng: 21.4596864, lat: 41.9892219, name: "Plastika/limenki" },
      { lng: 21.4590901, lat: 41.9840683, name: "Plastika/limenki" },
      { lng: 21.4645259, lat: 41.9856425, name: "Plastika/limenki" },
      { lng: 21.4674296, lat: 41.9858876, name: "Plastika/limenki" },
      { lng: 21.4706057, lat: 41.9812511, name: "Plastika/limenki" },
      { lng: 21.4840222, lat: 41.9848776, name: "Plastika/limenki" },
      { lng: 21.4607045, lat: 42.0018377, name: "Plastika/limenki" },
      { lng: 21.4618526, lat: 42.0030767, name: "Plastika/limenki" },
      { lng: 21.4618821, lat: 42.0030229, name: "Plastika/limenki" },
      { lng: 21.4633288, lat: 42.0023838, name: "Plastika/limenki" },
      { lng: 21.4647877, lat: 42.0039471, name: "Plastika/limenki" },
      { lng: 21.4659698, lat: 42.0041597, name: "Plastika/limenki" },
      { lng: 21.4675309, lat: 42.0031178, name: "Plastika/limenki" },
      { lng: 21.4616006, lat: 42.010614, name: "Plastika/limenki" },
      { lng: 21.4580656, lat: 42.012624, name: "Plastika/limenki" },
      { lng: 21.4520931, lat: 42.0156234, name: "Plastika/limenki" },
      { lng: 21.4438237, lat: 42.0091826, name: "Plastika/limenki" },
      { lng: 21.4374585, lat: 42.0132136, name: "Plastika/limenki" },
      { lng: 21.4326668, lat: 42.0181457, name: "Plastika/limenki" },
      { lng: 21.4437563, lat: 42.0151374, name: "Plastika/limenki" },
      { lng: 21.4386127, lat: 42.0218012, name: "Plastika/limenki" },
      { lng: 21.4386829, lat: 42.0234334, name: "Plastika/limenki" },
      { lng: 21.4419343, lat: 42.0232918, name: "Plastika/limenki" },
      { lng: 21.3503104, lat: 42.0777601, name: "Plastika/limenki" },
      { lng: 21.6869685, lat: 42.1292587, name: "Plastika/limenki" },
      { lng: 21.6989055, lat: 42.1286748, name: "Plastika/limenki" },
      { lng: 21.7099951, lat: 42.130716, name: "Plastika/limenki" },
      { lng: 21.7095783, lat: 42.1337741, name: "Plastika/limenki" },
      { lng: 21.7097532, lat: 42.1376782, name: "Plastika/limenki" },
      { lng: 21.7163228, lat: 42.1292444, name: "Plastika/limenki" },
      { lng: 21.7164172, lat: 42.1355991, name: "Plastika/limenki" },
      { lng: 21.7219637, lat: 42.1394356, name: "Plastika/limenki" },
      { lng: 21.7212861, lat: 42.1344741, name: "Plastika/limenki" },
      { lng: 21.7261972, lat: 42.1324609, name: "Plastika/limenki" },
      { lng: 21.7236656, lat: 42.124547, name: "Plastika/limenki" },
      { lng: 21.7330922, lat: 42.1221917, name: "Plastika/limenki" },
      { lng: 21.7325684, lat: 42.1170169, name: "Plastika/limenki" },
      { lng: 21.6909804, lat: 42.1862878, name: "Plastika/limenki" },
      { lng: 21.7146911, lat: 42.211177, name: "Plastika/limenki" },
      { lng: 21.7435158, lat: 42.1621389, name: "Plastika/limenki" },
      { lng: 21.7519079, lat: 42.1631623, name: "Plastika/limenki" },
      { lng: 21.8515064, lat: 42.2769111, name: "Plastika/limenki" },
      { lng: 21.7580352, lat: 41.7723138, name: "Plastika/limenki" },
      { lng: 21.7875308, lat: 41.7150152, name: "Plastika/limenki" },
      { lng: 21.7797708, lat: 41.7179875, name: "Plastika/limenki" },
      { lng: 21.7780801, lat: 41.7175058, name: "Plastika/limenki" },
      { lng: 21.7721728, lat: 41.7163959, name: "Plastika/limenki" },
      { lng: 21.7727996, lat: 41.7174794, name: "Plastika/limenki" },
      { lng: 21.7665687, lat: 41.7173723, name: "Plastika/limenki" },
      { lng: 21.7651842, lat: 41.7177724, name: "Plastika/limenki" },
      { lng: 22.1790752, lat: 41.7468501, name: "Plastika/limenki" },
      { lng: 22.1838311, lat: 41.7703371, name: "Plastika/limenki" },
      { lng: 22.1862405, lat: 41.7688268, name: "Plastika/limenki" },
      { lng: 22.1852013, lat: 41.7600794, name: "Plastika/limenki" },
      { lng: 22.185835, lat: 41.7816049, name: "Plastika/limenki" },
      { lng: 22.2036314, lat: 41.7816227, name: "Plastika/limenki" },
      { lng: 22.1897415, lat: 41.7411575, name: "Plastika/limenki" },
      { lng: 22.1905865, lat: 41.746565, name: "Plastika/limenki" },
      { lng: 22.1921516, lat: 41.7363126, name: "Plastika/limenki" },
      { lng: 22.1941927, lat: 41.7364307, name: "Plastika/limenki" },
      { lng: 22.1942889, lat: 41.7384315, name: "Plastika/limenki" },
      { lng: 22.1924281, lat: 41.7426356, name: "Plastika/limenki" },
      { lng: 22.1937089, lat: 41.7427487, name: "Plastika/limenki" },
      { lng: 22.1922926, lat: 41.7447357, name: "Plastika/limenki" },
      { lng: 22.1924508, lat: 41.7454701, name: "Plastika/limenki" },
      { lng: 22.1985629, lat: 41.7419036, name: "Plastika/limenki" },
      { lng: 22.19931, lat: 41.7495301, name: "Plastika/limenki" },
      { lng: 22.2006306, lat: 41.7500822, name: "Plastika/limenki" },
      { lng: 22.2018832, lat: 41.7504444, name: "Plastika/limenki" },
      { lng: 22.2031265, lat: 41.7488851, name: "Plastika/limenki" },
      { lng: 22.2092941, lat: 41.7514562, name: "Plastika/limenki" },
      { lng: 22.19941, lat: 41.7400815, name: "Plastika/limenki" },
      { lng: 22.200491, lat: 41.7404958, name: "Plastika/limenki" },
      { lng: 22.2029245, lat: 41.7373437, name: "Plastika/limenki" },
      { lng: 22.2021623, lat: 41.7344132, name: "Plastika/limenki" },
      { lng: 22.1996553, lat: 41.73218, name: "Plastika/limenki" },
      { lng: 22.2040199, lat: 41.7586012, name: "Plastika/limenki" },
      { lng: 22.2000203, lat: 41.7623569, name: "Plastika/limenki" },
      { lng: 22.6433483, lat: 41.4548609, name: "Plastika/limenki" },
      { lng: 22.644746, lat: 41.4535752, name: "Plastika/limenki" },
      { lng: 22.6333463, lat: 41.443726, name: "Plastika/limenki" },
      { lng: 22.631729, lat: 41.444311, name: "Plastika/limenki" },
      { lng: 22.6328609, lat: 41.4452319, name: "Plastika/limenki" },
      { lng: 22.6341564, lat: 41.441405, name: "Plastika/limenki" },
      { lng: 22.6366423, lat: 41.438469, name: "Plastika/limenki" },
      { lng: 22.6400878, lat: 41.4414431, name: "Plastika/limenki" },
      { lng: 22.6430513, lat: 41.4433431, name: "Plastika/limenki" },
      { lng: 22.6422216, lat: 41.4400456, name: "Plastika/limenki" },
      { lng: 21.507515, lat: 41.3710845, name: "Plastika/limenki" },
      { lng: 21.5070001, lat: 41.3723888, name: "Plastika/limenki" },
      { lng: 21.5079764, lat: 41.3747881, name: "Plastika/limenki" },
      { lng: 21.5325894, lat: 41.357743, name: "Plastika/limenki" },
      { lng: 21.5352165, lat: 41.3496956, name: "Plastika/limenki" },
      { lng: 21.5367487, lat: 41.3508184, name: "Plastika/limenki" },
      { lng: 21.5393502, lat: 41.3507256, name: "Plastika/limenki" },
      { lng: 21.5419026, lat: 41.3512627, name: "Plastika/limenki" },
      { lng: 21.5455511, lat: 41.3427993, name: "Plastika/limenki" },
      { lng: 21.5474524, lat: 41.3428758, name: "Plastika/limenki" },
      { lng: 21.5476911, lat: 41.3424912, name: "Plastika/limenki" },
      { lng: 21.5481981, lat: 41.3428244, name: "Plastika/limenki" },
      { lng: 21.554265, lat: 41.3337512, name: "Plastika/limenki" },
      { lng: 21.557265, lat: 41.3380248, name: "Plastika/limenki" },
      { lng: 21.5563584, lat: 41.3367106, name: "Plastika/limenki" },
      { lng: 21.5591897, lat: 41.3362999, name: "Plastika/limenki" },
      { lng: 21.555783, lat: 41.3416584, name: "Plastika/limenki" },
      { lng: 21.5326265, lat: 41.341331, name: "Plastika/limenki" },
      { lng: 21.550769, lat: 41.3394208, name: "Plastika/limenki" },
      { lng: 21.5643782, lat: 41.3425885, name: "Plastika/limenki" },
      { lng: 21.562005, lat: 41.3460785, name: "Plastika/limenki" },
      { lng: 21.5602843, lat: 41.3470156, name: "Plastika/limenki" },
      { lng: 21.5620536, lat: 41.3471978, name: "Plastika/limenki" },
      { lng: 21.5612747, lat: 41.3498428, name: "Plastika/limenki" },
      { lng: 21.5610072, lat: 41.3503988, name: "Plastika/limenki" },
      { lng: 21.5607122, lat: 41.3534437, name: "Plastika/limenki" },
      { lng: 21.5622968, lat: 41.3557113, name: "Plastika/limenki" },
      { lng: 21.5647823, lat: 41.3523045, name: "Plastika/limenki" },
      { lng: 21.5644877, lat: 41.3479524, name: "Plastika/limenki" },
      { lng: 21.5649809, lat: 41.3455926, name: "Plastika/limenki" },
      { lng: 21.5682237, lat: 41.3457995, name: "Plastika/limenki" },
      { lng: 21.5712192, lat: 41.3505481, name: "Plastika/limenki" },
      { lng: 21.1548726, lat: 41.0844196, name: "Plastika/limenki" },
      { lng: 21.3099645, lat: 41.0272315, name: "Plastika/limenki" },
      { lng: 21.3089426, lat: 41.024903, name: "Plastika/limenki" },
      { lng: 21.3121762, lat: 41.0237093, name: "Plastika/limenki" },
      { lng: 21.3222492, lat: 41.0255168, name: "Plastika/limenki" },
      { lng: 21.3270562, lat: 41.0237926, name: "Plastika/limenki" },
      { lng: 21.3316666, lat: 41.0215269, name: "Plastika/limenki" },
      { lng: 21.3390706, lat: 41.0356178, name: "Plastika/limenki" },
      { lng: 21.3467492, lat: 41.0345456, name: "Plastika/limenki" },
      { lng: 21.3477618, lat: 41.0342047, name: "Plastika/limenki" },
      { lng: 21.3438628, lat: 41.0275491, name: "Plastika/limenki" },
      { lng: 21.3418718, lat: 41.0530634, name: "Plastika/limenki" },
      { lng: 21.264933, lat: 41.0302777, name: "Plastika/limenki" },
      { lng: 21.3290504, lat: 41.0738292, name: "Plastika/limenki" },
      { lng: 21.3314073, lat: 40.9965733, name: "Plastika/limenki" },
      { lng: 21.4295393, lat: 40.9271962, name: "Plastika/limenki" },
      { lng: 21.4084955, lat: 41.9756425, name: "Plastika/limenki" },
      { lng: 22.4942272, lat: 41.1583416, name: "Plastika/limenki" },
      { lng: 22.4946724, lat: 41.158065, name: "Plastika/limenki" },
      { lng: 22.5096103, lat: 41.1467209, name: "Plastika/limenki" },
      { lng: 22.7143267, lat: 41.1938454, name: "Plastika/limenki" },
      { lng: 21.3990143, lat: 42.0049711, name: "Plastika/limenki" },
      { lng: 21.3959853, lat: 41.9988124, name: "Plastika/limenki" },
      { lng: 21.4564466, lat: 41.9879036, name: "Plastika/limenki" },
      { lng: 21.4489665, lat: 41.9885701, name: "Plastika/limenki" },
      { lng: 21.4216112, lat: 41.9932341, name: "Plastika/limenki" },
      { lng: 21.4177243, lat: 41.9940911, name: "Plastika/limenki" },
      { lng: 21.4060661, lat: 41.9977439, name: "Plastika/limenki" },
      { lng: 21.4031599, lat: 41.9958624, name: "Plastika/limenki" },
      { lng: 21.3847549, lat: 42.0092057, name: "Plastika/limenki" },
      { lng: 21.4280207, lat: 41.9947207, name: "Plastika/limenki" },
      { lng: 21.5001578, lat: 41.995807, name: "Plastika/limenki" },
      { lng: 21.3914883, lat: 42.0062261, name: "Plastika/limenki" },
      { lng: 21.4440349, lat: 41.974395, name: "Plastika/limenki" },
      { lng: 21.4355077, lat: 41.9900493, name: "Plastika/limenki" },
      { lng: 21.427745, lat: 41.9964711, name: "Plastika/limenki" },
      { lng: 22.0104352, lat: 41.4418379, name: "Plastika/limenki" },
      { lng: 22.0097619, lat: 41.4397377, name: "Plastika/limenki" },
      { lng: 22.0098241, lat: 41.4389451, name: "Plastika/limenki" },
      { lng: 22.0185461, lat: 41.4180699, name: "Plastika/limenki" },
      { lng: 20.7765576, lat: 41.1234819, name: "Plastika/limenki" },
      { lng: 21.3632712, lat: 42.0501665, name: "Hartija/kompozit" },
      { lng: 21.4056149, lat: 41.9963193, name: "Hartija/kompozit" },
      { lng: 21.4162753, lat: 42.0047562, name: "Hartija/kompozit" },
      { lng: 21.3992111, lat: 42.0089874, name: "Hartija/kompozit" },
      { lng: 21.4358272, lat: 41.991199, name: "Hartija/kompozit" },
      { lng: 21.4429763, lat: 41.9767177, name: "Hartija/kompozit" },
      { lng: 21.4674229, lat: 41.9858158, name: "Hartija/kompozit" },
      { lng: 21.4706647, lat: 41.9812152, name: "Hartija/kompozit" },
      { lng: 21.4619344, lat: 42.0028904, name: "Hartija/kompozit" },
      { lng: 21.452126, lat: 42.0156343, name: "Hartija/kompozit" },
      { lng: 21.6809807, lat: 42.1244892, name: "Hartija/kompozit" },
      { lng: 21.6808091, lat: 42.1243937, name: "Hartija/kompozit" },
      { lng: 21.6870409, lat: 42.1292686, name: "Hartija/kompozit" },
      { lng: 21.7099307, lat: 42.1306285, name: "Hartija/kompozit" },
      { lng: 21.7096909, lat: 42.1337363, name: "Hartija/kompozit" },
      { lng: 21.7096218, lat: 42.1377498, name: "Hartija/kompozit" },
      { lng: 21.7161967, lat: 42.1291987, name: "Hartija/kompozit" },
      { lng: 21.7164936, lat: 42.1355812, name: "Hartija/kompozit" },
      { lng: 21.7169736, lat: 42.1388617, name: "Hartija/kompozit" },
      { lng: 21.7213122, lat: 42.1344891, name: "Hartija/kompozit" },
      { lng: 21.7271601, lat: 42.1323094, name: "Hartija/kompozit" },
      { lng: 21.7234993, lat: 42.1243481, name: "Hartija/kompozit" },
      { lng: 21.7307267, lat: 42.1203011, name: "Hartija/kompozit" },
      { lng: 21.7331485, lat: 42.1220982, name: "Hartija/kompozit" },
      { lng: 21.7324665, lat: 42.1170288, name: "Hartija/kompozit" },
      { lng: 21.691313, lat: 42.1864945, name: "Hartija/kompozit" },
      { lng: 21.714675, lat: 42.2109744, name: "Hartija/kompozit" },
      { lng: 21.7519736, lat: 42.1631772, name: "Hartija/kompozit" },
      { lng: 21.8515037, lat: 42.2770838, name: "Hartija/kompozit" },
      { lng: 21.7578797, lat: 41.7724178, name: "Hartija/kompozit" },
      { lng: 21.7728653, lat: 41.7175044, name: "Hartija/kompozit" },
      { lng: 21.4085653, lat: 41.9756729, name: "Hartija/kompozit" },
      { lng: 22.5116752, lat: 41.1399052, name: "Hartija/kompozit" },
      { lng: 22.4938083, lat: 41.1429182, name: "Hartija/kompozit" },
      { lng: 22.4960599, lat: 41.1449935, name: "Hartija/kompozit" },
      { lng: 21.3991001, lat: 42.0049512, name: "Hartija/kompozit" },
      { lng: 21.3960712, lat: 41.9987825, name: "Hartija/kompozit" },
      { lng: 21.456515, lat: 41.9878767, name: "Hartija/kompozit" },
      { lng: 21.448903, lat: 41.9885356, name: "Hartija/kompozit" },
      { lng: 21.4215589, lat: 41.9932451, name: "Hartija/kompozit" },
      { lng: 21.4176787, lat: 41.9941041, name: "Hartija/kompozit" },
      { lng: 21.4060607, lat: 41.9977185, name: "Hartija/kompozit" },
      { lng: 21.4032022, lat: 41.9958614, name: "Hartija/kompozit" },
      { lng: 21.3847267, lat: 42.0091449, name: "Hartija/kompozit" },
      { lng: 21.4280227, lat: 41.9947501, name: "Hartija/kompozit" },
      { lng: 21.5002047, lat: 41.99579, name: "Hartija/kompozit" },
      { lng: 21.3913971, lat: 42.0062341, name: "Hartija/kompozit" },
      { lng: 21.4440644, lat: 41.9743192, name: "Hartija/kompozit" },
      { lng: 21.4354876, lat: 41.9900912, name: "Hartija/kompozit" },
      { lng: 21.4277181, lat: 41.9965548, name: "Hartija/kompozit" },
      { lng: 22.0164459, lat: 41.4214141, name: "Hartija/kompozit" },
      { lng: 22.0189928, lat: 41.4391418, name: "Hartija/kompozit" },
      { lng: 22.0161675, lat: 41.4293782, name: "Hartija/kompozit" },
      { lng: 22.0104218, lat: 41.4417494, name: "Hartija/kompozit" },
      { lng: 22.0072546, lat: 41.440859, name: "Hartija/kompozit" },
      { lng: 22.0185058, lat: 41.4181785, name: "Hartija/kompozit" }
    ];


    navigator.geolocation.getCurrentPosition(position => { this.lat = position.coords.latitude });
    navigator.geolocation.getCurrentPosition(position => { this.lng = position.coords.longitude });

    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }

    })
    navigator.geolocation.getCurrentPosition((position) => {
      this.new_center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }

    })




    //41.99646 41.99646



    this.directions_service = new google.maps.DirectionsService();
    this.directions_render = new google.maps.DirectionsRenderer({
      map: null,
      suppressMarkers: true
    })
    navigator.geolocation.getCurrentPosition((position) => {
      this.source_directions = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
    }
    });

    this.destination_directions = {
      lat:41.99646,
      lng:21.43141,
    }

    //navigator.geolocation.getCurrentPosition((position) =>{
    navigator.geolocation.getCurrentPosition((position)=>{
    this.map = new google.maps.Map(document.getElementById('map-canvas'),{
        ...this.options_map,
        center: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
    });
    this.setMarker();
    })
    //console.log(this.setMarker());
    //this.setRoutePolyline();
    //console.log("Ova e route" + this.setRoutePolyline());


    console.log(this.map);

    /*for (var i = 0; i < this.markers_coordinates.length + 1; i++) {
      //console.log(this.markers_coordinates[i].name);
      var icon;
      if(this.markers_coordinates[i].name == "Staklo"){
        icon = {
          url: "/assets/recycle_red.png", // url
          scaledSize: new google.maps.Size(50, 50), // scaled size
          origin: new google.maps.Point(0,0), // origin
          anchor: new google.maps.Point(0, 0) // anchor
        };
      }else if(this.markers_coordinates[i].name == "Hartija/kompozit"){
        icon = {
          url: "/assets/recycle_blue.png", // url
          scaledSize: new google.maps.Size(50, 50), // scaled size
          origin: new google.maps.Point(0,0), // origin
          anchor: new google.maps.Point(0, 0) // anchor
        };
      }else if(this.markers_coordinates[i].name == "Plastika/limenki"){
        icon = {
          url: "/assets/recycle_yellow.png", // url
          scaledSize: new google.maps.Size(50, 50), // scaled size
          origin: new google.maps.Point(0,0), // origin
          anchor: new google.maps.Point(0, 0) // anchor
        };

      }else if(this.markers_coordinates[i].name == "MyPosition"){
        icon = {
          scaledSize: new google.maps.Size(50, 50), // scaled size
          origin: new google.maps.Point(0,0), // origin
          anchor: new google.maps.Point(0, 0) // anchor
        };

      }
      var marker = new google.maps.Marker({
        position: {
          lat: this.markers_coordinates[i].lat,
          lng: this.markers_coordinates[i].lng,
        },
        options: { animation: google.maps.Animation.DROP, icon: icon },
      })

      marker.setMap(this.map);
    }*/

  }
  getYourLat(){

    navigator.geolocation.getCurrentPosition(position => { this.lat = position.coords.latitude });
    return this.lat;
  }
  getYourLng(){
    navigator.geolocation.getCurrentPosition(position => { this.lng = position.coords.longitude });
    return this.lng;
  }

  /*getDistanceMatrix(sendQuery): Observable<any> {
    navigator.geolocation.getCurrentPosition(position => {this.lat=position.coords.latitude});
    navigator.geolocation.getCurrentPosition(position => {this.lng=position.coords.longitude});
      console.log( this.http.get('https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=' + this.lat.toString() + ',' + this.lng.toString() + '&destinations=' + this.markers_coordinates[0].lat.toString() + ',' + this.markers_coordinates[0].lng.toString() + '&key=apikey'));
      return this.http.get('https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=' + this.lat.toString() + ',' + this.lng.toString() + '&destinations=' + this.markers_coordinates[0].lat.toString() + ',' + this.markers_coordinates[0].lng.toString() + '&key=apikey').map((response: Response) => {
        return response.json();
      })


  }*/


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

  options = [
    { name: "Staklo", value: 1 },
    { name: "Plastika/limenki", value: 2 },
    { name: "Hartija/kompozit", value: 3 }
  ]
  print() {
    var index;
    var min = 600000;
    navigator.geolocation.getCurrentPosition(position => { this.lat = position.coords.latitude });
    navigator.geolocation.getCurrentPosition(position => { this.lng = position.coords.longitude });
    for (var i = 0; i < this.markers.length; i++) {
      if (this.getDistanceFromLatLonInKm(this.lat, this.lng, this.markers[i].position.lat, this.markers[i].position.lng) < min) {
        if(this.selectedOption == this.markers[i].title){
        index = i;
        min = this.getDistanceFromLatLonInKm(this.lat, this.lng, this.markers[i].position.lat, this.markers[i].position.lng);
        }
      }
    }
    min = min * 1000;
    var str = "Тип: " + this.markers_coordinates[index].name + " Оддалеченост: " + min;
    this.printedOption = str;
  }
  text1!:string;
onTitleClick(selectedOption) {

    this.selectedOption="Staklo";
    this.setRoutePolyline("Staklo");
    var index;
    var min = 6000;
    navigator.geolocation.getCurrentPosition(position => { this.lat = position.coords.latitude });
    navigator.geolocation.getCurrentPosition(position => { this.lng = position.coords.longitude });
    for (var i = 0; i < this.markers_coordinates.length; i++) {
      if (this.getDistanceFromLatLonInKm(this.lat, this.lng, this.markers_coordinates[i].lat, this.markers_coordinates[i].lng) < min) {
        if("Staklo" == this.markers_coordinates[i].name){
        index = i;
        min = this.getDistanceFromLatLonInKm(this.lat, this.lng, this.markers_coordinates[i].lat, this.markers_coordinates[i].lng);
        }
      }
    }
    min = min * 1000;
    var str ="Најблискиот контејнер за рециклирање стакло е на оддалеченост од "+ parseInt(min.toString()) + " m";
    this.text1 = str;
    for (var i = 0; i < this.markers_coordinates.length + 1; i++) {
      //console.log(this.markers_coordinates[i].name);
      var icon;
      if(this.markers_coordinates[i].name == "Staklo"){
        icon = {
          url: "/assets/recycle_red.png", // url
          scaledSize: new google.maps.Size(50, 50), // scaled size
          origin: new google.maps.Point(0,0), // origin
          anchor: new google.maps.Point(0, 0) // anchor
        };
      }else if(this.markers_coordinates[i].name == "Hartija/kompozit"){
        icon = {
          url: "/assets/recycle_blue.png", // url
          scaledSize: new google.maps.Size(50, 50), // scaled size
          origin: new google.maps.Point(0,0), // origin
          anchor: new google.maps.Point(0, 0) // anchor
        };
      }else if(this.markers_coordinates[i].name == "Plastika/limenki"){
        icon = {
          url: "/assets/recycle_yellow.png", // url
          scaledSize: new google.maps.Size(50, 50), // scaled size
          origin: new google.maps.Point(0,0), // origin
          anchor: new google.maps.Point(0, 0) // anchor
        };

      }else if(this.markers_coordinates[i].name == "MyPosition"){
        icon = {
          scaledSize: new google.maps.Size(50, 50), // scaled size
          origin: new google.maps.Point(0,0), // origin
          anchor: new google.maps.Point(0, 0) // anchor
        };

      }
      if(this.markers_coordinates[i].name == "Staklo"){
      var marker = new google.maps.Marker({
        position: {
          lat: this.markers_coordinates[i].lat,
          lng: this.markers_coordinates[i].lng,
        },
        options: { animation: google.maps.Animation.DROP, icon: icon },
      })

      marker.setMap(this.map);
      }else{
        var marker = new google.maps.Marker({
          position: {
            lat: this.markers_coordinates[i].lat,
            lng: this.markers_coordinates[i].lng,
          },
          options: { animation: google.maps.Animation.DROP, icon: icon },
        })

        marker.setMap(null);
      }
    }



  }
  onTitleClick2(selectedOption) {
    this.selectedOption="Plastika/limenki";
    this.setRoutePolyline("Plastika/limenki");
    var index;
    var min = 6000;
    navigator.geolocation.getCurrentPosition(position => { this.lat = position.coords.latitude });
    navigator.geolocation.getCurrentPosition(position => { this.lng = position.coords.longitude });
    for (var i = 0; i < this.markers_coordinates.length; i++) {
      if (this.getDistanceFromLatLonInKm(this.lat, this.lng, this.markers_coordinates[i].lat, this.markers_coordinates[i].lng) < min) {
        if("Plastika/limenki" == this.markers_coordinates[i].name){
        index = i;
        min = this.getDistanceFromLatLonInKm(this.lat, this.lng, this.markers_coordinates[i].lat, this.markers_coordinates[i].lng);
        }
      }
    }
    min = min * 1000
    var str ="Најблискиот контејнер за рециклирање пластика е на оддалеченост од "+ parseInt(min.toString()) + " m";
    this.text1 = str;
    for (var i = 0; i < this.markers_coordinates.length + 1; i++) {
      //console.log(this.markers_coordinates[i].name);
      var icon;
      if(this.markers_coordinates[i].name == "Staklo"){
        icon = {
          url: "/assets/recycle_red.png", // url
          scaledSize: new google.maps.Size(50, 50), // scaled size
          origin: new google.maps.Point(0,0), // origin
          anchor: new google.maps.Point(0, 0) // anchor
        };
      }else if(this.markers_coordinates[i].name == "Hartija/kompozit"){
        icon = {
          url: "/assets/recycle_blue.png", // url
          scaledSize: new google.maps.Size(50, 50), // scaled size
          origin: new google.maps.Point(0,0), // origin
          anchor: new google.maps.Point(0, 0) // anchor
        };
      }else if(this.markers_coordinates[i].name == "Plastika/limenki"){
        icon = {
          url: "/assets/recycle_yellow.png", // url
          scaledSize: new google.maps.Size(50, 50), // scaled size
          origin: new google.maps.Point(0,0), // origin
          anchor: new google.maps.Point(0, 0) // anchor
        };

      }else if(this.markers_coordinates[i].name == "MyPosition"){
        icon = {
          scaledSize: new google.maps.Size(50, 50), // scaled size
          origin: new google.maps.Point(0,0), // origin
          anchor: new google.maps.Point(0, 0) // anchor
        };

      }
      if(this.markers_coordinates[i].name == "Plastika/limenki"){
      var marker = new google.maps.Marker({
        position: {
          lat: this.markers_coordinates[i].lat,
          lng: this.markers_coordinates[i].lng,
        },
        options: { animation: google.maps.Animation.DROP, icon: icon },
      })

      marker.setMap(this.map);
      }else{
        var marker = new google.maps.Marker({
          position: {
            lat: this.markers_coordinates[i].lat,
            lng: this.markers_coordinates[i].lng,
          },
          options: { animation: google.maps.Animation.DROP, icon: icon },
        })

        marker.setMap(null);
      }
    }


  }
  onTitleClick3(selectedOption) {
    this.selectedOption="Hartija/kompozit";
    this.setRoutePolyline("Hartija/kompozit");
    var index;
    var min = 6000;
    navigator.geolocation.getCurrentPosition(position => { this.lat = position.coords.latitude });
    navigator.geolocation.getCurrentPosition(position => { this.lng = position.coords.longitude });
    for (var i = 0; i < this.markers_coordinates.length; i++) {
      if (this.getDistanceFromLatLonInKm(this.lat, this.lng, this.markers_coordinates[i].lat, this.markers_coordinates[i].lng) < min) {
        if("Hartija/kompozit" == this.markers_coordinates[i].name){
        index = i;
        min = this.getDistanceFromLatLonInKm(this.lat, this.lng, this.markers_coordinates[i].lat, this.markers_coordinates[i].lng);
        }
      }
    }
    min = min * 1000;

    var str ="Најблискиот контејнер за рециклирање хартија е на оддалеченост од "+ parseInt(min.toString()) + " m";
    this.text1 = str;
    for (var i = 0; i < this.markers_coordinates.length + 1; i++) {
      //console.log(this.markers_coordinates[i].name);
      var icon;
      if(this.markers_coordinates[i].name == "Staklo"){
        icon = {
          url: "/assets/recycle_red.png", // url
          scaledSize: new google.maps.Size(50, 50), // scaled size
          origin: new google.maps.Point(0,0), // origin
          anchor: new google.maps.Point(0, 0) // anchor
        };
      }else if(this.markers_coordinates[i].name == "Hartija/kompozit"){
        icon = {
          url: "/assets/recycle_blue.png", // url
          scaledSize: new google.maps.Size(50, 50), // scaled size
          origin: new google.maps.Point(0,0), // origin
          anchor: new google.maps.Point(0, 0) // anchor
        };
      }else if(this.markers_coordinates[i].name == "Plastika/limenki"){
        icon = {
          url: "/assets/recycle_yellow.png", // url
          scaledSize: new google.maps.Size(50, 50), // scaled size
          origin: new google.maps.Point(0,0), // origin
          anchor: new google.maps.Point(0, 0) // anchor
        };

      }else if(this.markers_coordinates[i].name == "MyPosition"){
        icon = {
          scaledSize: new google.maps.Size(50, 50), // scaled size
          origin: new google.maps.Point(0,0), // origin
          anchor: new google.maps.Point(0, 0) // anchor
        };

      }
      if(this.markers_coordinates[i].name == "Hartija/kompozit"){
      var marker = new google.maps.Marker({
        position: {
          lat: this.markers_coordinates[i].lat,
          lng: this.markers_coordinates[i].lng,
        },
        options: { animation: google.maps.Animation.DROP, icon: icon },
      })

      marker.setMap(this.map);
      }else{
        var marker = new google.maps.Marker({
          position: {
            lat: this.markers_coordinates[i].lat,
            lng: this.markers_coordinates[i].lng,
          },
          options: { animation: google.maps.Animation.DROP, icon: icon },
        })

        marker.setMap(null);
      }
    }


  }
}


