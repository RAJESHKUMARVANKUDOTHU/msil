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
import "leaflet.heat/dist/leaflet-heat.js";

@Component({
  selector: 'app-map-actions',
  templateUrl: './map-actions.component.html',
  styleUrls: ['./map-actions.component.css'],
})
export class MapActionsComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('allSelected') private allSelected: MatOption;
  @ViewChild('mapElement') mapElement: ElementRef;
  newLayoutForm: FormGroup;
  tempImagePath: any = [];
  selectLayoutForm: FormGroup;
  public configCoinForm: FormGroup;
  mapDisable: boolean = true;
  marker: any = [];
  map: any = null;
  bound: any;
  layoutData: any = '';
  newGatewayLayout = [];
  selectedLayout: any = '';
  coinData: any = [];
  gatewayList: any = [];
  gateway: any = []
  heat: any

  constructor(
    private fb: FormBuilder,
    public mapService: MapService,
    private api: ApiService,
    public general: GeneralService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.resetMap();
    this.createForm();
    this.refreshGateway();
    this.getLayout();
    this.general.getZone()
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

  createMap() {
    console.log("create map");

    this.mapDisable = true;
    this.map = L.map('map', {
      attributionControl: false,
      minZoom: 1,
      maxZoom: 5,
      center: [0, 0],
      zoom: 0,
      zoomControl: true,
      fullscreenControl: true,
      fullscreenControlOptions: {
        title: 'Show me the fullscreen !',
        titleCancel: 'Exit fullscreen mode',
        position: 'topleft',
      },

      crs: L.CRS.Simple,
      maxBoundsViscosity: 1.0,
    });

    this.bound = this.map.getBounds();
    this.map.setMaxBounds(this.bound);
    this.map.dragging.disable();
    this.map.on('click', (data) => {
      let latlng = [data.latlng.lat, data.latlng.lng];

      let coin = this.configCoinForm.get('coinId').value;
      console.log("coin id==",coin);
      
      if (coin) {
        this.configCoinForm.patchValue({
          coinBounds: latlng,
        });
      }
      this.createMarker();
    });
    if(this.gatewayList.length == 1){
      this.layoutSelect(this.gatewayList[0].layoutName);
    }
    this.cd.detectChanges();
  }

  createForm() {
    this.newLayoutForm = this.fb.group({
      gatewayId: ['', Validators.required],
      layoutName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_]+(?: [a-zA-Z0-9_]+)*$')]],
      fileData: ['', Validators.required],
      height: ['', Validators.required],
      width: ['', Validators.required]
    });
    this.selectLayoutForm = this.fb.group({
      layout: ['', Validators.required],
    });
    this.configCoinForm = this.fb.group({
      gatewayId: ['', Validators.required],
      coinId: ['', Validators.required],
      coinName: ['', Validators.required],
      coinBounds: ['', Validators.required],
    });
  }

  layoutSelect(data, status = 1) {
    this.mapDisable = false;
    this.gateway = []
    console.log('data layout===', data);
    if (data) {
      this.selectedLayout = data;
      this.selectLayoutForm.patchValue({
        layout: this.selectedLayout
      })
      let layout = this.gatewayList.filter(obj => {
        return obj.layoutName == data
      })

      if (layout.length > 0) {
        layout[0].gateway.filter((obj) => {
          return this.gateway.push(obj)
        })
        if (status = 1) {
          this.getLayoutImage(layout);
        } else {
          this.layoutData = layout[0];
          this.configCoinForm.reset()
          this.updateSelected();
          this.createMarker();
        }
      }
    }
  }

  getLayoutImage(data) {
    this.api.getLayoutImage(data[0]._id).then((res: any) => {
      // console.log("image layout==", res);
      this.layoutData = data[0];
      console.log("this.layoutData==",this.layoutData);
      
      this.configCoinForm.reset()
      this.updateSelected();
      this.clearMapImage();
      L.imageOverlay(res, this.bound).addTo(this.map);
      this.createMarker();
    });
  }

  gatewaySelect(data) {
    console.log('data==', data);
    this.coinData = [];
    let gatewayData = this.layoutData.gateway.filter(obj => {
      return obj.gatewayId == data
    });
    this.coinData = gatewayData.length ? gatewayData[0].coinData : [];
    console.log("coinData==", this.coinData)
    this.updateSelected(data);
    this.createMarker();
  }

  coinSelect(data) {
    console.log('data==', data);
    let coins = this.coinData.filter((obj) => {
      return obj.coinId == data;
    });
    if (coins.length) {
      this.configCoinForm.patchValue({
        coinId: coins[0].coinId,
        coinName: coins[0].coinName,
        coinBounds: coins[0].coinBounds != null ? coins[0].coinBounds : [],
      });
      this.updateSelected(coins[0].gatewayId, coins[0].coinId);
      this.createMarker();
    }
  }

  updateSelected(gatewayId = 0, coinId = 0) {
    if (this.layoutData != '') {
      this.layoutData.gateway = this.layoutData.gateway.map((obj) => {
        if (gatewayId == 0) {
          obj.selected = true;
        } else {
          if (obj.gatewayId == gatewayId) {
            obj.selected = true;
          } else {
            obj.selected = false;
          }
        }
        obj.coinData.map((coin) => {
          if (coinId == 0) {
            coin.selected = true;
          } else {
            if (coin.coinId == coinId) {
              coin.selected = true;
            } else {
              coin.selected = false;
            }
          }
        });
        return obj;
      });
      console.log('layout data===', this.layoutData);
    }
  }

  createMarker() {
    this.clearMap();
    // this.heatMap(this.gateway)

    let coin = this.configCoinForm.get('coinBounds').value;
    console.log("coin===", coin);

    if (coin != null) {
      let data = {
        bounds: this.configCoinForm.get('coinBounds').value,
        gatewayId: this.configCoinForm.get('gatewayId').value,
        coinId: this.configCoinForm.get('coinId').value,
        coinName: this.configCoinForm.get('coinName').value,
      };
      if (data.bounds.length) {
        this.addCoinMarker(data);
      }
    } else {
      for (let i = 0; i < this.layoutData.gateway.length; i++) {
        if (this.layoutData.gateway[i].selected) {
          for (let j = 0; j < this.layoutData.gateway[i].coinData.length; j++) {
            if (this.layoutData.gateway[i].coinData[j].selected) {
              this.layoutData.gateway[i].coinData[j].coinBounds =
                this.layoutData.gateway[i].coinData[j].coinBounds != null
                  ? this.layoutData.gateway[i].coinData[j].coinBounds
                  : [];

              if (this.layoutData.gateway[i].coinData[j].coinBounds.length) {
                let data = {
                  gatewayId: this.layoutData.gateway[i].coinData[j].gatewayId,
                  bounds: this.layoutData.gateway[i].coinData[j].coinBounds,
                  coinId: this.layoutData.gateway[i].coinData[j].coinId,
                  coinName: this.layoutData.gateway[i].coinData[j].coinName,
                  zoneName: this.layoutData.gateway[i].coinData[j].zoneData?.zoneName,
                };
                this.addCoinMarker(data);
              }
            }
          }
        }
      }
    }
    this.cd.detectChanges();
    setTimeout(() => {
      this.mapElement.nativeElement.focus();
    }, 0);
  }

  addCoinMarker(data) {
    let icon = L.icon({
      iconUrl: '../../assets/marker.png',
      iconSize: [25, 25],
    });
    let marker = new L.marker(data.bounds, {
      icon: icon,
      draggable: 'true',
      riseOnHover: true,
    });
    marker.gatewayId = data.gatewayId;
    marker.coinId = data.coinId;
    marker.coinName = data.coinName;
    marker.bounds = data.bounds;
    marker
      .addTo(this.map)
      .bindTooltip(this.getPopUpForm(data), {
        permanent: false
      })
      .on('click', (obj) => {
        console.log('clicked data===', obj.target);
        this.gatewaySelect(obj.target.gatewayId);
        this.coinSelect(obj.target.coinId);
        this.configCoinForm.patchValue({
          gatewayId: obj.target.gatewayId,
          coinId: obj.target.coinId,
          coinName: obj.target.coinName,
          coinBounds: obj.target.bounds,
        });
        this.cd.detectChanges();
        this.createMarker();
      })
      .on('dragend', (event) => {
        console.log('drag data===', event.target);
        this.gatewaySelect(event.target.gatewayId);
        let position = event.target.getLatLng();
        let latlng = [position.lat, position.lng];
        this.configCoinForm.patchValue({
          gatewayId: event.target.gatewayId,
          coinId: event.target.coinId,
          coinName: event.target.coinName,
          coinBounds: latlng,
        });
        this.createMarker();
      });
    this.marker.push(marker);

  }


  getPopUpForm(data) {
    let zone = data.zoneName == undefined ? 'Not assigned' : data.zoneName;
    let a = '<table class="popup">';
    a += '<tr><td><b>Gateway Id</b></td><td>' + data.gatewayId + '</td></tr>';
    a += '<tr><td><b>Coin Id</b></td><td>' + data.coinId + '</td></tr>';
    a += '<tr><td><b>Coin name</b></td><td>' + data.coinName + '</td></tr>';
    a += '<tr><td><b>Zone name</b></td><td>' + zone + '</td></tr>';
    a += '</table>';
    return a;
  }

  getValidation() {
    let coin = this.configCoinForm.get('coinId').value || 0;
    if (this.layoutData != '') {
      if (
        this.layoutData.layoutName != '' &&
        coin
      ) {
        return 'visible';
      } else {
        return 'hide';
      }
    }
  }

  toggleAllSelectionGateway(formData) {
    if (this.allSelected.selected) {
      formData.controls.gatewayId.patchValue([
        ...this.newGatewayLayout.map((obj) => obj.gatewayId),
        0,
      ]);
    } else {
      formData.controls.gatewayId.patchValue([]);
    }
  }

  fileChange(files) {
    let reader = new FileReader();
    if (files && files.length > 0) {
      let file = files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.tempImagePath = reader.result;
        this.newLayoutForm.get('fileData').setValue({
          filename: file.name,
          filetype: file.type,
          value: this.tempImagePath.split(',')[1],
        });
      };
    }
  }

  clearFile() {
    this.newLayoutForm.get('fileData').setValue(null);
    this.tempImagePath = '';
    this.fileInput.nativeElement.value = '';
  }

  randomNumber(min = 1, max = 20) {
    return Math.random() * (max - min) + min;
  }

  createNewLayout(data) {
    console.log(this.newLayoutForm)
    // data.length = data.width;
    // data.breadth = data.height;
    data.gatewayObjectId = this.general.filterArray(data.gatewayId);
    data.fileData.filename =
      data.gatewayId[0] +
      parseInt(this.randomNumber().toString()) +
      data.fileData.filename;
    // data.file=data.fileData.filename
    console.log('file===', data);
    if (
      data.fileData.filetype == 'image/jpg' ||
      data.fileData.filetype == 'image/jpeg' ||
      data.fileData.filetype == 'image/png'
    ) {
      this.general.loadingFreez.next({ status: true, msg: 'Uploading layout..!' })
      this.api
        .createLayout(data)
        .then((res: any) => {
          console.log('create layout res===', res);
          this.refreshGateway();
          this.getLayout();
          if (res.status) {
            this.general.loadingFreez.next({ status: false, msg: '' })
            this.getLayout()
            this.newLayoutForm.reset()
            this.clearFile()
            this.general.openSnackBar(res.success, '');
          } else {
            this.general.openSnackBar(res.success, '');
          }
        })
        .catch((err: any) => {
          console.log('error==', err);
        });
    } else {
    }
  }

  updateCoinBound(data) {
    console.log('submit coin===', data);

    this.api
      .updateLatLng(data)
      .then((res: any) => {
        console.log('update bounds res==', res);
        if (res.status) {
          this.general.openSnackBar(res.message, '');
          this.getLayout();
          this.configCoinForm.reset()
        } else {
          this.general.openSnackBar(res.message, '');
        }
      })
      .catch((err) => {
        console.log('err==', err);
      });
  }

  deleteCoinBound(data) {
    console.log('submit coin===', data);

    if(this.configCoinForm.valid){
      try{
        this.api
        .deleteCoinBound(data)
        .then((res: any) => {
          console.log('delete bounds res==', res);
          if (res.status) {
            this.general.openSnackBar(res.success, '');
            this.getLayout();
            this.configCoinForm.reset()
          } else {
            this.general.openSnackBar( !res.success?res.message:res.success, '');
          }
        })
        .catch((err) => {
          console.log('err==', err);
        });
      }
      catch(err){
        console.log("error",err)
      }
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

  getLayout() {
    this.gatewayList = []
    this.api
      .getLayouts()
      .then((res: any) => {
        console.log('get layout res===', res);
        if (res.status) {
          this.gatewayList = res.success;
          this.selectLayoutForm.patchValue({
            layout: this.selectedLayout
          })
          if (!this.map) {
            this.createMap();
          } else {
            // this.updateSelected();
            // this.createMarker()
            this.layoutSelect(this.selectedLayout, 2);

          }
        } else {
          this.gatewayList = [];
          if (!this.map) {
            this.createMap();
          } else {
            // this.updateSelected();
            // this.createMarker()
            this.layoutSelect(this.selectedLayout, 2);

          }
        }
      })
      .catch((err: any) => {
        console.log('error==', err);
      });
  }

  refreshGateway() {
    var data = ''
    this.api
      .getGatewayData(data)
      .then((res: any) => {
        this.newGatewayLayout = [];
        if (res.status) {
          this.newGatewayLayout = res.success;
          console.log('gateway list====', this.newGatewayLayout);
        }
      })
      .catch((err: any) => {
        console.log('error===', err);
      });
  }

  deleteLayout() {

    var data = {
      fileName: this.gateway[0].fileName
    }
    console.log("delete layout ==", data)

    this.api.deleteLayout(data).then((res: any) => {
      console.log("delete layout res ==", res)
      if (res.status) {
        this.general.openSnackBar(res.success, '')
        this.mapDisable = true
        this.resetMap()
        this.map = null
        this.coinData = []
        this.selectedLayout = []
        this.layoutData = []
        this.gateway = []
        this.marker = []
        this.getLayout();
        this.refreshGateway()
      }
      else {
        this.general.openSnackBar(!res.success ? res.message : res.success, '')

      }
    })
  }



  heatMap(latlng: any) {
    console.log("heatmap", latlng)
    let arr = [];
    const conf = {
      radius: 20,
      max: 1.0,
      blur: 15,
      gradient: {
        0.0: 'green',
        0.5: 'red',
        1.0: 'yellow'
      },
      minOpacity: 1,
    }
    latlng.filter((obj) => {
      if (obj.coinData.length > 0) {
        obj.coinData.filter((ele) => {
          if (ele.coinBounds.length > 0) {
            arr.push({
              lat: ele.coinBounds[0],
              lng: ele.coinBounds[1],
              intensity: 1.0
            })
          } else { }
        })
      }
    })
    console.log("data==", arr)
    var heat = new L.heatLayer(arr, conf).addTo(this.map)
    console.log("heatmap==", this.map)
  }
}

// selectedLayoutCoin: any = {
//   layout: '',
//   coin: [],
// };
// gatewayData: any = [];
// coinData: any = [];
// gatewayList: any = [
//   {
//     layoutName: 'layout.jpg',
//     gateway: [
//       {
//         gatewayId: '123456789878',
//         gatewayName: 'gateway1',
//         coinData: [
//           {
//             _id: 1,
//             coinId: 1,
//             coinName: 'a',
//             bound: [79.48061790228995, -189.84375],
//           },
//           {
//             _id: 2,
//             coinId: 2,
//             coinName: 'b',
//             bound: [-52.32191088594772, 253.12500000000003],
//           },
//           {
//             _id: 3,
//             coinId: 3,
//             coinName: 'c',
//             bound: [],
//           },
//         ],
//       },
//       {
//         gatewayId: 'AB3456789878',
//         gatewayName: 'gateway2',
//         coinData: [
//           {
//             _id: 4,
//             coinId: 4,
//             coinName: 'aa',
//             bound: [-69.56522590149099, -354.37500000000006],
//           },
//           {
//             _id: 5,
//             coinId: 5,
//             coinName: 'bb',
//             bound: [],
//           },
//           {
//             _id: 6,
//             coinId: 6,
//             coinName: 'cc',
//             bound: [],
//           },
//         ],
//       },
//     ],
//   },
//   {
//     layoutName: 'layout.jpg',
//     gateway: [
//       {
//         gatewayId: '123456789878',
//         gatewayName: 'gateway1',
//         coinData: [
//           {
//             _id: 1,
//             coinId: 1,
//             coinName: 'a',
//             bound: [],
//           },
//           {
//             _id: 2,
//             coinId: 2,
//             coinName: 'b',
//             bound: [24.766784522874453, -514.6875000000001],
//           },
//           {
//             _id: 3,
//             coinId: 3,
//             coinName: 'c',
//             bound: [],
//           },
//         ],
//       },
//       {
//         gatewayId: 'CD3456789878',
//         gatewayName: 'gateway3',
//         coinData: [
//           {
//             _id: 7,
//             coinId: 7,
//             coinName: 'aaa',
//             bound: [],
//           },
//           {
//             _id: 8,
//             coinId: 8,
//             coinName: 'bbb',
//             bound: [],
//           },
//           {
//             _id: 9,
//             coinId: 9,
//             coinName: 'ccc',
//             bound: [],
//           },
//         ],
//       },
//     ],
//   },

//   {
//     layoutName: 'office-layout.png',
//     gateway: [],
//   },
// ];
// coinList: any = [];
