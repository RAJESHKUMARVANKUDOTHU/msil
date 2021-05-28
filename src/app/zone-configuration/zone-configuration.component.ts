import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MapService } from '../services/map-services/map.service';
import { ApiService } from '../services/api.service';
import { GeneralService } from '../services/general.service';
import { MatOption } from '@angular/material/core';
import * as L from 'leaflet';
@Component({
  selector: 'app-zone-configuration',
  templateUrl: './zone-configuration.component.html',
  styleUrls: ['./zone-configuration.component.css'],
})
export class ZoneConfigurationComponent implements OnInit {
  @ViewChild('mapElement') mapElement: ElementRef;
  selectZoneForm: FormGroup;
  selectedLayout: any = '';
  gatewayList: any = [];
  zoneList: any = [];
  bound: any = [];
  layoutData: any = [];
  marker: any = [];
  mapDisable: boolean = true;
  map: any = null;
  constructor(
    private fb: FormBuilder,
    public mapService: MapService,
    private api: ApiService,
    private general: GeneralService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getLayout();
    this.selectZoneForm = this.fb.group({
      layout: ['', Validators.required],
      id: ['', Validators.required],
      bounds: ['', Validators.required],
    });
  }

  ngOnDestroy() {
    if (this.map != null) {
      this.map.remove();
    }
    this.layoutData = [];
  }

  createMap() {
    this.mapDisable = true;
    console.log("l==",L)
    this.map =  L.map('map', {
      fullscreenControl: true,
      fullscreenControlOptions: {
        title: 'Show me the fullscreen !',
        titleCancel: 'Exit fullscreen mode',
        position: 'topleft',
      },
      attributionControl: false,
      minZoom: 1,
      maxZoom: 5,
      center: [0, 0],
      zoom: 0,
      crs: L.CRS.Simple,
      maxBoundsViscosity: 1.0,
    });
    this.bound = this.map.getBounds();
    this.map.setMaxBounds(this.bound);
    this.map.dragging.disable();
    this.map.on('click', (data) => {
      let latlng = [data.latlng.lat, data.latlng.lng];
      let bounds = this.selectZoneForm.get('bounds').value;
      let id = this.selectZoneForm.get('id').value;
      if (id) {
        bounds.push(latlng);
        this.selectZoneForm.patchValue({
          bounds: bounds,
        });
        this.clearMap();
        L.polygon(bounds).addTo(this.map);
      }
      this.cd.detectChanges();
    });
    if(this.gatewayList.length == 1){
      this.layoutSelect(this.gatewayList[0]._id);
    }
    this.cd.detectChanges();
  }

  layoutSelect(data, status = 1) {
    console.log('layoutchange===', data);
    this.mapDisable = false;
    let layout = this.gatewayList.filter((obj) => {
      return obj._id == data;
    });
    console.log('layout===', layout);

    this.selectedLayout = data;
    this.selectZoneForm.patchValue({
      layout: this.selectedLayout,
    });
    if (layout) {
      if(status = 1){
        this.getLayoutImage(layout);
      }
      else{
        this.getZoneDetails();
      }
    }
  }

  getLayoutImage(data){
    this.api.getLayoutImage(data[0]._id).then((res: any) => {
      L.imageOverlay(res, this.bound).addTo(this.map);
      this.getZoneDetails();
    });
  }

  zoneSelect(data) {
    console.log('zone data on select===', data);
    let zone = this.zoneList.filter((obj) => {
      return obj._id == data;
    });
    console.log('zone===', zone);

    this.selectZoneForm.patchValue({
      bounds: zone[0].bounds,
    });
    this.createPolygon(data);
  }

  createPolygon(zoneId = 0) {
    this.clearMap();
    this.zoneList.forEach((obj) => {
      if (zoneId == 0) {
        L.polygon(obj.bounds).addTo(this.map);
      } else {
        if (obj._id == zoneId) {
          L.polygon(obj.bounds).addTo(this.map);
        }
      }
    });
    this.cd.detectChanges();
    setTimeout(() => {
      this.mapElement.nativeElement.focus();
    }, 0);
  }

  submitZone() {
    var data = {
      id: this.selectZoneForm.get('id').value,
      bounds: this.selectZoneForm.get('bounds').value,
    };
    console.log('zone submit===', data);
    this.api
      .updateZoneBound(data)
      .then((res: any) => {
        console.log('update zone bounds res==', res);
        if (res.status) {
          this.selectZoneForm.reset();
          this.general.openSnackBar(res.message, '');
          this.getZoneDetails();
          this.selectZoneForm.patchValue({
            layout: this.selectedLayout,
          });
          this.cd.detectChanges();
        } else {
          this.general.openSnackBar(res.message, '');
          this.cd.detectChanges();
        }
      })
      .catch((err) => {
        console.log('err==', err);
      });
  }

  removeZone() {
    let sendData = {
      id: this.selectZoneForm.get('id').value,
    };
    this.api
      .deleteZoneBound(sendData)
      .then((res: any) => {
        console.log('delete zone bounds res==', res);
        if (res.status) {
          this.selectZoneForm.reset();
          this.general.openSnackBar(res.message, '');
          this.getZoneDetails();
          this.selectZoneForm.patchValue({
            layout: this.selectedLayout,
          });
          this.cd.detectChanges();
        } else {
          this.general.openSnackBar(res.message, '');
          this.cd.detectChanges();
        }
      })
      .catch((err) => {
        console.log('err==', err);
      });
  }

  getLayout() {
    this.api
      .getLayouts()
      .then((res: any) => {
        console.log('get layout res===', res);
        if (res.status) {
          this.gatewayList = res.success;
          if (!this.map) {
            this.createMap();
          }
        } else {
          this.gatewayList = [];
          if (!this.map) {
            this.createMap();
          }
        }
      })
      .catch((err: any) => {
        console.log('error==', err);
      });
  }

  getZoneDetails() {
    this.api.getZone().then((res: any) => {
      console.log('zone details response==', res);
      this.zoneList = [];
      if (res.status) {
        this.zoneList = res.success;
        this.createPolygon();
      } else {
        this.zoneList = [];
        this.createPolygon();
      }
    });
  }

  clearMap() {
    if (this.marker.length != undefined) {
      for (let i in this.marker.length) {
        this.map.removeLayer(this.marker[i].marker);
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
}

// {
//   id: 1,
//   name: 'Job card',
//   bounds: [
//     [8.667918002363134, -229.21875000000003],
//     [18.22935133838668, 275.62500000000006],
//     [-68.56038368664157, 215.15625000000003],
//   ],
// },
// {
//   id: 2,
//   name: 'Washing',
//   bounds: [
//     [-61.48075950007598, -600.4687500000001],
//     [7.27529233637217, -503.43750000000006],
//     [-67.50856836293859, -452.81250000000006],
//     [-79.63987399850707, -530.1562500000001],
//   ],
// },
// {
//   id: 3,
//   name: 'Shopfloor',
//   bounds: [],
// },
