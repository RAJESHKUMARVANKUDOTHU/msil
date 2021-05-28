import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { LoginAuthService } from '../services/login-auth.service';
import { GeneralService } from '../services/general.service';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import * as L from 'leaflet';
// import 'leaflet.marker.slideto/Leaflet.Marker.SlideTo';
// import 'leaflet-rotatedmarker/leaflet.rotatedMarker';
import 'leaflet-moving-rotated-marker/leaflet.movingRotatedMarker';
@Component({
  selector: 'app-vehicle-track',
  templateUrl: './vehicle-track.component.html',
  styleUrls: ['./vehicle-track.component.css']
})
export class VehicleTrackComponent implements OnInit {
  vehicleHistory: FormGroup;
  vehicleData: any = [];
  deviceData: any = [];
  marker: any = [];
  bounds: any = [];
  map: any = null;
  timeInterval: any;
  refreshVehicleData: boolean = true;

  constructor(
    private fb: FormBuilder,
    private login: LoginAuthService,
    private api: ApiService,
    private general: GeneralService,
    private cd: ChangeDetectorRef
  ) { }



  ngOnInit(): void {
    this.vehicleHistory = this.fb.group({
      date: ['', Validators.required],
      deviceName: ['']
    });

    setTimeout(() => {
      this.initiateMap();
    }, 1);

    this.cd.detectChanges();
    this.refreshDevice();
  }

  ngOnDestroy() {
    this.resetMap();
  }

  initiate() {
    this.timeInterval = setInterval(() => {
      if (this.refreshVehicleData) {
        this.refreshVehicle();
      };
    }, 1000 * 30);
  }

  destroy() {
    this.refreshVehicleData = true;
    this.resetMap();
    this.cd.detectChanges();
    this.initiateMap();
    this.initiate();
  }

  resetMap() {
    if (this.map != null) {
      this.clearMap();
      this.clearMapImage();
      this.map.remove();
    }
  }

  initiateMap() {
    this.map = L.map('map', {
      attributionControl: false,
      minZoom: 1,
      maxZoom: 5,
      center: [0, 0],
      zoom: 0,
      zoomControl: true,
      crs: L.CRS.Simple,
      maxBoundsViscosity: 1.0,
      fullscreenControl: true,
      fullscreenControlOptions: {
        title: 'Show me the fullscreen !',
        titleCancel: 'Exit fullscreen mode',
        position: 'topleft',
      },
    })
    this.bounds = this.map.getBounds();
    this.map.setMaxBounds(this.bounds);
    this.map.dragging.disable();
    this.getLayout();
  }

  getLayout() {
    this.api.getLayouts().then((res: any) => {
      console.log("res==", res)
      if (res.status) {
        let layout = res.success
        for (let i = 0; i < layout.length; i++) {
          this.api.getLayoutImage(layout[i]._id).then((imgRes: any) => {
            this.clearMapImage();
            L.imageOverlay(imgRes, this.bounds).addTo(this.map);
            this.test();

            // this.refreshVehicle();

            // if (this.refreshVehicleData) {
            //   this.timeInterval = setInterval(() => {
            //     this.refreshVehicle();
            //   }, 1000 * 30);
            // };
          }).catch(err => {
            console.log("err==", err)
          })
        }
      }
      else { }
    }).catch(err => {
      console.log("err==", err)
    })
  }

  refreshDevice() {
    var data = '';
    this.api.getDeviceData(data).then((res: any) => {

      this.deviceData = [];
      console.log("find submit====", res);
      if (res.status) {
        this.deviceData = res.success;
      }
      else {
        this.deviceData = [];
      }

    }).catch((err: any) => {
      console.log("error===", err)
    })
  }

  refreshVehicle() {
    var date = moment(new Date()).format('YYYY-MM-DD');

    var data = {
      fromDate: date,
      toDate: date,
      timeZoneOffset: this.general.getZone()
    };
    console.log("data==", data);

    this.api.getdeviceLatLngPerDay(data).then(async (res: any) => {
      console.log('getdeviceLatLngPerDay response==', res);
      this.vehicleData = [];
      if (res.status) {
        this.vehicleData = res.success;
        let vehicleDataPromise = this.vehicleData.map((obj, index) => this.addMarker(obj, index));
        await Promise.all([vehicleDataPromise]);
      }
      else { }
    }).catch(err => {
      console.log("err===", err);
    });
  }

  submit(value) {
    console.log("valuee=", value);
    value.date = moment(value.date).format('YYYY-MM-DD');

    var data = {
      fromDate: value.date,
      toDate: value.date,
      deviceName: value.deviceName,
      timeZoneOffset: this.general.getZone()
    };
    console.log("data==", data);

    this.api.getdeviceLatLngPerDay(data).then(async (res: any) => {
      console.log('getdeviceLatLngPerDay response==', res);
      this.vehicleData = [];
      if (res.status) {
        this.refreshVehicleData = false;
        clearInterval(this.timeInterval);
        this.vehicleData = res.success;
        let vehicleDataPromise = this.vehicleData.map((obj, index) => this.addMarker(obj, index));
        await Promise.all([vehicleDataPromise]);
      }
    }).catch(err => {
      console.log("err===", err);
    });
  }

  async addMarker(data, i) {
    console.log("data==", data);
    let icon = L.icon({
      iconUrl: '../../assets/Car_Black.png',
      iconSize: [50, 30],
    });
    let loc = L.icon({
      iconUrl: '../../assets/loc.png',
      iconSize: [50, 30],
    });

    let latlng = [];
    let latlngPath = [];
    for (let i = 0; i < data.latLong.length; i++) {
      latlng.push([data.latLong[i].latitude, data.latLong[i].longitude])
      latlngPath.push({ lat: data.latLong[i].latitude, lng: data.latLong[i].longitude })
    }

    let polyLine = new L.polyline(latlng, {
      color: this.getRandomColor(),
      weight: 3,
      opacity: 0.5,
      smoothFactor: 1
    }).addTo(this.map);

    let angle = this.angleFromCoordinate(latlngPath[0].lat, latlngPath[0].lng, latlngPath[1].lat, latlngPath[1].lng)
    
    var m = new L.marker([data.latLong[0].latitude, data.latLong[0].longitude], {
      icon: icon,
      // rotationAngle: (angle)// default rotation
    }).addTo(this.map)
      .bindTooltip(this.getPopUpForm(data), {
        permanent: false
      });

    console.log("latlng==", latlngPath, "angle===", angle);

    m.slideTo([data.latLong[0].latitude, data.latLong[0].longitude], { path: latlngPath, duration: 300 });

    this.cd.detectChanges();
  }


  test(){
    let testData = [
      {
        lat : '53.21003615423956', 
        lng : '-87.38192666366524'
      },
      {
        lat : '-133.93716588587048',
        lng : '105.52727366858079'

      },
      // {
        
      //   lat: '142',
      //   lng:  '5.52810190302813'
      // },
      // {
        
      //   lat: '169.58751257257663',
      //   lng:  '-82.319368017550774'
      // },
      // {
        
      //   lat: '-40.5717684476798',
      //   lng:  '61.2861555820262'
      // },
      // {
      //   lat : '-17.974681209750898',
      //   lng: '-69.96164626570581'
      // }

    ];

    let icon = L.icon({
      iconUrl: '../../assets/Car_Black2.png',
      iconSize: [40, 60],
    });
    let loc = L.icon({
      iconUrl: '../../assets/loc.png',
      iconSize: [50, 30],
    });

    let latlng = [];
    let latlngPath = [];
    for (let i = 0; i < testData.length; i++) {
      latlng.push([testData[i].lat, testData[i].lng]);
      latlngPath.push(testData[i]);
    }

    let polyLine = new L.polyline(latlng, {
      color: this.getRandomColor(),
      weight: 3,
      opacity: 0.5,
      smoothFactor: 1
    }).addTo(this.map);

    let angle = this.angleFromCoordinate(latlngPath[0].lat, latlngPath[0].lng, latlngPath[1].lat, latlngPath[1].lng)
    
    var m = new L.marker([latlngPath[0].lat,latlngPath[0].lng], {
      icon: icon,
      // rotationAngle: (angle)// default rotation
    }).addTo(this.map);

    console.log("latlng==", latlngPath, "angle===", angle);

    m.slideTo([latlngPath[0].lat, latlngPath[0].lng], { path: latlngPath, duration: 300 });

  }

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }


  angleFromCoordinate(lat1, long1, lat2,
    long2) {

    let dLon = (long2 - long1);

    let y = Math.sin(dLon) * Math.cos(lat2);
    let x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1)
      * Math.cos(lat2) * Math.cos(dLon);

    let brng = Math.atan2(y, x);

    brng *= 180 / Math.PI;
    brng = (brng + 360) % 360;
    // brng = 360 - brng; // count degrees counter-clockwise - remove to make clockwise

    return brng;
  }


  getPopUpForm(data) {
    let a = '<table class="popup">';
    a += '<tr><td><b>Tag id</b></td><td>' + data.deviceId + '</td></tr>';
    a += '<tr><td><b>Vehicle name</b></td><td>' + data.deviceName + '</td></tr>';
    a += '</table>';
    return a;
  }

  getDirection(data) {
    let lat = data[0][0]
    let lng = data[0][1]
    if ((lat < 0 && lng < 0) || (lat < 0 && lng > 0)) {
      return 'top';
    }
    else if ((lat > 0 && lng > 0) || (lat > 0 && lng < 0)) {
      return 'bottom';
    }
    else {
      return 'auto';
    }
  }

  clearMap() {
    if (this.marker.length != undefined) {
      for (let i in this.marker.length) {
        this.map.removeLayer(this.marker[i]);
      }
      for (let i in this.map._layers) {
        if (!this.map._layers[i].hasOwnProperty('_url')) {
          try {
            this.map.removeLayer(this.map._layers[i]);
          } catch (e) {
            console.log('problem with ' + e + this.map._layers[i]);
          }
        }
      }
    }
  }

  clearMapImage() {
    for (let i in this.map._layers) {
      if (this.map._layers[i].hasOwnProperty('_url')) {
        try {
          this.map.removeLayer(this.map._layers[i]);
        } catch (e) {
          console.log('problem with ' + e + this.map._layers[i]);
        }
      }
    }
  }

}
