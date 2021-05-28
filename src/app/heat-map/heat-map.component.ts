import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { GeneralService } from '../services/general.service';
import * as moment from 'moment';
import * as L from 'leaflet';
import "leaflet.heat/dist/leaflet-heat.js";

@Component({
  selector: 'app-heat-map',
  templateUrl: './heat-map.component.html',
  styleUrls: ['./heat-map.component.css']
})
export class HeatMapComponent implements OnInit {
  map: any = null;
  bounds:any=[];
  vehicleData:any=[];
  marker:any=[];
  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    public general: GeneralService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    setTimeout(()=>{
      this.initiateMap();
    },1);
    this.cd.detectChanges();
  }
  ngOnDestroy() {
    this.resetMap();
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
            this.map.on('load', this.getZoneVehicleData());
            
          })
        }
      }
      else { }
    })
  }

  getZoneVehicleData() {
 
    this.api.getZoneVehicleData().then((res: any) => {
      console.log('zone vehicle response==', res);
      if (res.status) {
        this.vehicleData = res.success;
        console.log(" this.vehicleData=", this.vehicleData);
        
        let data = res.success;
        data.map((obj, index) => {
          let latlng = [{
            lat: obj.deviceData.deviceBound.latitude,
            lng: obj.deviceData.deviceBound.longitude
          }]
          this.vehicleData[index].latlng = latlng;
        });
        this.heatMap(this.vehicleData);
        // for(let i=0;i<this.vehicleData.length;i++){
        //   this.addCoinMarker(this.vehicleData[i].latlng[0])
        // }


      } else {
        this.vehicleData = [];
      }
      
    }).catch((err)=>{
      console.log("err==",err);
      
    });
  }

  addCoinMarker(data) {
    console.log("data==",data);
    
    let icon = L.icon({
      iconUrl: '../../assets/marker.png',
      iconSize: [25, 25],
    });
    let marker = new L.marker([51.5, -0.09], {
      icon: icon,
      draggable: 'true',
      riseOnHover: true,
    }).addTo(this.map);
    this.cd.detectChanges();
    this.marker.push(marker);

  }

  clearMap() {
    // for (let i in this.marker.length) {
    //   this.map.removeLayer(this.marker[i]);
    // }
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

  heatMap(data: any) {
    // data=[{
    //   lat:51.5,
    //   lng:  -0.09,
    // },{
    //   lat:-120.33808487700023,
    //   lng: 238.2022693684611,
    // },{
    //   lat:-65.33808487700023,
    //   lng: 200.2022693684611,
    // },
    // {
    //   lat:55.5,
    //   lng:  -0.09,
    // },
    // {
    //   lat:60.5,
    //   lng:  -10,
    // },
    // {
    //   lat:51.5,
    //   lng:  -10
    // },
    // {
    //   lat:51.5,
    //   lng:  -10,
    // },]
    this.clearMap();
    console.log("heatmap", data)
    let arr = [];
    const conf = {
      radius: 25,
      scaleRadius :true,
      blur: 15,
      // gradient: {
      //   0.0: 'cyan',
      //   0.5: 'magenta',
      //   1.0: 'red'
      // },
      minOpacity: 1,
    }
    data.filter((obj) => { 
      arr.push({
        lat:obj.latlng[0].lat,
        lng:  obj.latlng[0].lng,
        intensity: 1.0
      })
    })
    var heat = new L.heatLayer(arr, conf).addTo(this.map);
    this.cd.detectChanges()
 
  }
}

