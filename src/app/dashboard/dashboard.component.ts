import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import * as L from 'leaflet';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { environment } from '../../environments/environment';
import * as CanvasJS from '../../assets/canvasjs-3.2.7/canvasjs.min';
import 'leaflet.animatedmarker/src/AnimatedMarker';
import 'leaflet-rotatedmarker/leaflet.rotatedMarker';
// import 'leaflet-moving-marker/index';
import * as moment from 'moment';
import { LoginAuthService } from '../services/login-auth.service';
import { GeneralService } from '../services/general.service'
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  date: any = new Date();
  map;
  loginDetails : any;
  zoneList: any = [];
  zoneAction: any = [];
  deviceList: any = [];
  tempDeviceList: any = [];
  tempZoneList: any = [];
  marker: any = [];
  congestionData: any = []
  interval: any;
  timeInterval: any;
  zoneClickStatus: any = {
    status: false,
    zone: null
  };
  deviceGroupList: any = [];
  errStatus: any = {
    searchError: false,
    searchMessage: 'Vehicle not found',
  };
  serviceCount: any = {
    servicedVehicleCount: 0,
    vehicleForServiceTodayCount: 0,
    vehicleUnderServiceCount: 0,
    overAllEfficiency: 0,
    avgServiceTime: 0
  };
  id:any;

  constructor(
    private cd: ChangeDetectorRef,
    private api: ApiService,
    private login: LoginAuthService,
    private router: Router,
    public general: GeneralService) {

  }

  ngOnInit(): void {
    this.loginDetails = this.login.getLoginDetails();
    console.log("this.loginDetails",this.loginDetails);
    this.id= this.loginDetails._id;
    this.refreshCongestion();
    this.getVehicleServiceCount()
    setTimeout(() => {
      this.createMap();
    }, 1);
    this.timeInterval = setInterval(() => {
      this.getVehicleServiceCount()
    }, 10000);
    this.login.loginCheckData.subscribe(res => {
      if (!res.other) {
        this.clearTimeInterval()
      }
    })

  }

  ngOnDestroy() {
    this.resetMap();
    this.clearTimeInterval()
  }

  resetMap() {
    if (this.map != null) {
      this.clearMap();
      this.clearMapImage();
      this.map.remove();
    }
  }
  initiate() {
    this.timeInterval = setInterval(() => {
      this.refreshCongestion()
      this.getVehicleServiceCount()
    }, 10000);
  }
  clearTimeInterval() {
    clearInterval(this.interval);
    clearInterval(this.timeInterval)
  }

  createMap() {
    this.map = L.map('map', {
      attributionControl: false,
      minZoom: 1,
      maxZoom: 5,
      center: [0, 0],
      zoom: 0,
      fullscreenControl: true,
      fullscreenControlOptions: {
        title: 'Show me the fullscreen !',
        titleCancel: 'Exit fullscreen mode',
        position: 'topleft',
      },
      crs: L.CRS.Simple,
      maxBoundsViscosity: 1.0,
    });
    var bounds = this.map.getBounds();
    this.map.setMaxBounds(bounds);
    this.map.dragging.disable();
    this.getLayout();
    this.map.on('click', (data) => {
      console.log("data latlng===", data.latlng);
    });
  }

  getLayout() {
    this.api
      .getLayouts()
      .then((res: any) => {
        // console.log('get layout res===', res);
        if (res.status) {
          let data = res.success
          for (let i = 0; i < data.length; i++) {
            if (data[i].layoutName != null) {
              this.api.getLayoutImage(data[i]._id).then((resImg: any) => {
                this.clearMapImage();
                var bounds = this.map.getBounds();
                L.imageOverlay(resImg, bounds).addTo(this.map);
                this.map.on('load', this.getZones());
                // this.map.on('load', this.getZoneVehicleData());
              });
              break;
            }
          }
        }
        else {
          this.clearMapImage();
          this.clearMap();
        }
      })
      .catch((err: any) => {
        console.log('error==', err);
      });
  }

  getZoneVehicleData() {
    this.zoneClickStatus = {
      status: false,
      zone: null
    };
    this.api.getZoneVehicleData().then((res: any) => {
      console.log('zone vehicle response==', res);
      if (res.status) {
        this.deviceList = res.success;
        let data = res.success;
        data.map((obj, index) => {
          let latlng = [{
            lat: obj.deviceData.deviceBound.latitude,
            lng: obj.deviceData.deviceBound.longitude
          }]
          this.deviceList[index].latlng = latlng;
        });
        this.tempDeviceList = this.deviceList;
        this.calculateZoneActions();
      } else {
        this.deviceList = [];
        this.zoneList = [];
      }
      this.createDevice();
    });
  }

  // , {color: "white", weight: 1}

  getZones() {
    // console.log('here zones');
    this.api.getZone().then((res: any) => {
      console.log('zone details response==', res);
      this.zoneList = [];
      if (res.status) {
        this.getZoneVehicleData();
        this.interval = setInterval(() => {
          if (!this.zoneClickStatus.status) {
            this.getZoneVehicleData();
          }
        }, 10000)
        this.zoneList = res.success.map((obj) => {
          obj.highlight = false;
          obj.selected = true;
          obj.vehicleCount = 0;
          obj.avgTime = 0;
          obj.color = this.getRandomColor();
          obj.vehicleCount = 0;
          obj.time = 0;
          obj.isDelay = false;
          return obj;
        });
        this.tempZoneList = this.zoneList;
      } else {
        this.zoneList = [];
      }
    });
  }


  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }


  zoneClick(data) {
    // console.log('zone click data===', data);
    this.clearMap();
    // this.zoneList = [];
    this.zoneClickStatus = {
      status: true,
      zone: data.zoneName
    };

    this.zoneList = this.zoneList.map((obj) => {
      if (obj._id == data._id) {
        obj.selected = true;
        obj.highlight = true;
      } else {
        obj.selected = false;
        obj.highlight = false;
      }
      return obj;
    });
    console.log('this.zoneList===', this.zoneList);
    this.createDevice();
    this.GroupDevices(data._id);
  }


  GroupDevices(data) {
    // console.log("group device data===", data);
    this.deviceGroupList = this.deviceList.filter(obj => {
      if (obj.zoneId == data) {
        console.log("true");
        this.zoneClickStatus = {
          status: true,
          zone: obj.zoneName
        };
        return this.getDeviceDelayOperation(obj);
      }
    });
    // console.log("this.deviceGroupList==", this.deviceGroupList);
  }


  getDeviceDelayOperation(obj) {
    if (obj.outTime == null) {
      // let diff = moment(obj.inTime).local().diff(moment(), 'milliseconds');
      // obj.time = Math.ceil((diff * -1) / (60 * 1000));
      // obj.time = obj.standardDeliveryTime - obj.time;
      obj.time = Math.floor(obj.totalDelay / (1000 * 60));
      // if(obj.time > 0){
      if (obj.time < obj?.totalStandardTime) {
        obj.isDelay = false;
      } else {
        obj.isDelay = true;
        // obj.time = obj.time * -1;
      }
    }
    else {
      // obj.time = Math.ceil((obj.totalTime)/(60 * 1000)) - obj.standardDeliveryTime 
      obj.time = Math.floor(obj.totalDelay / (1000 * 60));
      // if(obj.time > 0){
      if (obj.time > obj.standardDeliveryTime) {
        obj.isDelay = true;
      } else {
        obj.isDelay = false;
        // obj.time = obj.time * -1;
      }
    }
    return obj
  }

  createDevice() {
    this.clearMap();
    let icon;
    let iconRed = L.icon({
      iconUrl: '../../assets/Car_Red1.png',
      iconSize: [65, 78],
    });
    let iconBlack = L.icon({
      iconUrl: '../../assets/Car_Black.png',
      iconSize: [60, 40],
    });
    // console.log("this.deviceList==", this.deviceList, "this.zoneList==", this.zoneList);

    for (let i = 0; i < this.zoneList.length; i++) {
      if (this.zoneList[i].selected) {
        new L.polygon(this.zoneList[i].bounds, { color: this.zoneList[i].color })
          .addTo(this.map)
          .on('click', () => {
            this.zoneClick(this.zoneList[i]);
          });
        for (let j = 0; j < this.deviceList.length; j++) {
          if (this.deviceList[j].zoneId == this.zoneList[i]._id) {
            let latlng = [];
            for (let k = 0; k < this.deviceList[j].latlng.length; k++) {
              latlng.push([
                this.deviceList[j].latlng[k].lat,
                this.deviceList[j].latlng[k].lng,
              ]);
            }
            // latlng = [{ lat: 0.0, lng: 0.0 }, { lat: 52.5163, lng: 13.3779 }]
            this.deviceList[j] = this.getDeviceDelayOperation(this.deviceList[j]);
            if (this.deviceList[j].isDelay) {
              icon = iconRed;
            }
            else {
              icon = iconBlack;
            }
            // ,rotationAngle:this.getAngle(latlng[0].lat,latlng[1].lat,latlng[0].lng,latlng[1].lng)
            this.marker.push(
              new L.animatedMarker(latlng, { icon: icon, interval: 3000 })
                .addTo(this.map)
                .bindTooltip(this.getPopUpForm(this.deviceList[j]), {
                  direction: this.getDirection(latlng),
                  permanent: false
                })
            )
            // console.log("mapp==", this.map)
          }
        }
      }
    }
  }

  // getAngle(cx, cy, ex, ey) {
  //   var dy = ey - cy;
  //   var dx = ex - cx;

  //   var theta = Math.atan2(dy, dx); // range (-PI, PI]
  //   console.log("dx==",dx,"dy==",dy,"theta==",theta);
  //   theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
  //   //if (theta < 0) theta = 360 + theta; // range [0, 360)
  //   console.log("theta ==",theta);

  //   return theta;
  // }

  getAngle(cx, cy, ex, ey) {
    let a = Math.log(Math.tan((ex / 2) + (Math.PI / 4)) / Math.tan((cx / 2) + (Math.PI / 4)));
    let b = Math.abs(cy - ey);
    let theta = Math.atan2(b, a)
    theta *= 180 / Math.PI;
    if (theta < 0) theta = 360 + theta
    // console.log("theta ==", theta);
    return theta;
  }


  getDirection(data) {
    // console.log("latlng==", data)
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

    // if (lat < 0 && lng < 0) {

    //   if (lat > -100 && lng > -200) {
    //     return 'bottom'
    //   }
    //   else if (lat < -100 && lng > -200) {
    //     return 'top'
    //   }
    //   else if (lat > -100 && lng < -200) {
    //     return 'auto'
    //   }
    //   else {
    //     return 'auto'
    //   }
    // }

    // if (lat > 0 && lng > 0) {
    //   if (lat > 100 && lng < 200) {
    //     return 'bottom'
    //   }
    //   else if (lat < 100 && lng < 200) {
    //     return 'top'
    //   }
    //   else if (lat < 100 && lng > 200) {
    //     return 'auto'
    //   }
    //   else {
    //     return 'auto'
    //   }

    // }
    // if (lat < 0 && lng > 0) {
    //   if ((lat < -100 || lat > -100) && lng < 200) {
    //     return 'top'
    //   }
    //   else if (lat < -100 && lng > 200) {
    //     return 'auto'
    //   }
    //   else {
    //     return 'auto'
    //   }
    // }
    // if (lat > 0 && lng < 0) {
    //   if (lat > 100 && lng > -200) {
    //     return 'bottom'
    //   }

    //   else if (lat < 100 && lng < -200) {
    //     return 'top'
    //   }
    //   else if (lat < 100 && lng > -200) {
    //     return 'auto'
    //   }
    // }
  }

  searchVehicle(data) {
    console.log('search data===', data);
    if (data) {
      this.clearTimeInterval()
      this.deviceList = this.tempDeviceList.filter((obj) => {
        return (
          (obj.deviceId
            .toString()
            .toLowerCase()
            .indexOf(data.toString().toLowerCase()) > -1) || (obj.deviceName
              .toString()
              .toLowerCase()
              .indexOf(data.toString().toLowerCase()) > -1)
        );
      });

      for (let i = 0; i < this.deviceList.length; i++) {
        this.zoneList = this.tempZoneList.filter((obj) => {
          if (
            obj._id
              .toString()
              .toLowerCase()
              .indexOf(this.deviceList[i].zoneId.toString().toLowerCase()) > -1
          ) {
            this.GroupDevices(this.deviceList[i].zoneId);
            return obj;
          } else {
            return;
          }
        });
      }

      if (!this.zoneList.length || !this.deviceList.length) {
        this.errStatus.searchError = true;
        this.clearSearchDeviceZone();
      } else {
        this.errStatus.searchError = false;
      }
    } else {
      this.clearSearchDeviceZone();
    }
    this.createDevice();
  }

  clearSearchDeviceZone() {
    this.initiate();
    this.zoneClickStatus = {
      status: false,
      zone: null
    };
    this.deviceGroupList = [];
    this.deviceList = this.tempDeviceList;
    this.zoneList = this.tempZoneList;
    this.zoneList = this.zoneList.map((obj) => {
      obj.selected = true;
      obj.highlight = false;
      return obj;
    });
  }

  getPopUpForm(data) {
    // console.log("data pop ===", data);

    let sdt = this.getSDT(data).format('YYYY-MM-DD hh:mm:ss a');
    let edt = this.getEDT(data).format('YYYY-MM-DD hh:mm:ss a');
    let a = '<table class="popup">';
    a += '<tr><td><b>Vehicle name</b></td><td>' + data.deviceName + '</td></tr>';
    a += '<tr><td><b>Location name</b></td><td>' + data.coinName + '</td></tr>';
    a += '<tr><td><b>Service type</b></td><td>' + data.serviceCategory?.serviceName + '</td></tr>';
    a += '<tr><td><b>Zone name</b></td><td>' + data.zoneName + '</td></tr>';
    a += '<tr><td><b>Zone standard time</b></td><td>' + data.standardDeliveryTime + ' minutes</td></tr>';
    a += '<tr><td><b>Total standard time</b></td><td>' + this.getTotalST(data) + ' minutes</td></tr>';
    a += '<tr><td><b>Zone delay</b></td><td>' + this.getDelay(data) + ' minutes</td></tr>';
    a += '<tr><td><b>Total delay</b></td><td>' + this.getTotalDelay(data) + ' minutes</td></tr>';
    a += '<tr><td><b>In time</b></td><td>' + moment(data.inTime).format('YYYY-MM-DD hh:mm:ss a') + '</td></tr>';
    a += '<tr><td><b>SDT</b></td><td>' + sdt + '</td></tr>';
    a += '<tr><td><b>EDT</b></td><td>' + edt + '</td></tr>';
    a += '</table>';
    return a;
  }

  getDelay(data) {
    return Math.floor(data.zoneDelay / (60 * 1000));
  }

  getTotalDelay(data) {
    return Math.floor(data.totalDelay / (60 * 1000));
  }

  getTotalST(data) {
    let ST = 0;
    data.zoneData.forEach(obj => {
      ST += obj.standardTime;
    });
    return ST;
  }


  getSDT(data) {
    let ST = 0;
    data.zoneData.forEach(obj => {
      ST += obj.standardTime;
    });
    return moment(data.inTime).add(ST, 'minutes');
  }

  getEDT(data) {
    let ST = 0;
    data.zoneData.forEach(obj => {
      ST += obj.standardTime;
    });
    ST = ST * 60 * 1000;
    let ET = ST + data.totalDelay;
    return moment(data.inTime).add(ET, 'milliseconds');
  }


  calculateZoneActions() {
    let groupByzone = this.groupByZone();
    let data = Object.keys(groupByzone).map((obj) => {
      return {
        data: groupByzone[obj],
        zoneName: obj
      }
    })

    data.forEach(element => {
      let sum = 0;
      element.data.forEach((obj, index) => {
        // var thedate = moment(obj.inTime).local().diff(moment(), 'milliseconds');
        // sum += thedate;
        sum += obj.zoneTotalTime;
      });
      var avg = (sum / (element.data.length));
      this.zoneList.forEach(zone => {
        if (zone.zoneName == element.zoneName) {
          zone.vehicleCount = element.data.length;
          // zone.avgTime = Math.floor((avg * -1) / (60 * 1000));
          zone.avgTime = Math.floor((avg) / (60 * 1000));
          // zone.time = zone.standardTime - zone.avgTime;
          zone.time = zone.avgTime;
          if (zone.time < zone.standardTime) {
            zone.isDelay = false;
          }
          else {
            zone.isDelay = true;
            // zone.time = zone.time * -1
          }
        }
      });
    });
    // console.log("data calculate zone actions===", groupByzone, "data1===", data, "this.zoneAction==", this.zoneList);
  }


  groupByZone() {
    return this.deviceList.reduce(function (r, a) {
      r[a.zoneName] = r[a.zoneName] || [];
      r[a.zoneName].push(a);
      return r;
    }, Object.create(null));
  }

  clearMap() {
    for (let i in this.marker.length) {
      this.map.removeLayer(this.marker[i]);
    }
    for (let i in this.map._layers) {
      if (!this.map._layers[i].hasOwnProperty('_url')) {
        try {
          this.map.removeLayer(this.map._layers[i]);
        } catch (e) {
          // console.log('problem with ' + e + this.map._layers[i]);
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
          // console.log('problem with ' + e + this.map._layers[i]);
        }
      }
    }
  }

  // vehicleStatus(data) {
  //   // console.log("a==", data);
  //   this.router.navigate(['/vehicle-status'], { queryParams: { record: JSON.stringify(data) } });
  // }

  getVehicleServiceCount() {
    let currentDate = moment().format("YYYY-MM-DD")
    var data = {
      currentDate: currentDate,
      timeZoneOffset: this.general.getZone()
    }
    this.api.getVehicleServiceCount(data).then((res: any) => {
      // console.log("res 0f vehicle service count==", res)
      if (res.status) {
        this.serviceCount.servicedVehicleCount = res.success.servicedVehicleCount;
        this.serviceCount.vehicleForServiceTodayCount = res.success.vehicleForServiceTodayCount;
        this.serviceCount.vehicleUnderServiceCount = res.success.vehicleUnderServiceCount;
        this.serviceCount.overAllEfficiency = Math.floor(res.success.overAllEfficiency);
        this.serviceCount.avgServiceTime = this.general.getTime(res.success.avgTime);
      }
    })
  }

  refreshCongestion() {
    var now = new Date()
    var then = moment(toDate).subtract(5, "minutes").toDate()
    var fromDate = moment(then).format("YYYY-MM-DD HH:mm:ss")
    var toDate = moment(now).format("YYYY-MM-DD HH:mm:ss")
    var data = {
      timeZoneOffset: this.general.getZone(),
      fromDate: fromDate,
      toDate: toDate
    }
    // console.log("congestion form data===",data,moment().subtract(5,'minutes').format("YY-MM-DD HH:MM:SS"))
    this.api.getCongestion(data).then((res: any) => {
      // console.log("congestion res===",res)
      this.congestionData = [];
      if (res.status) {
        for (let i = 0; i < res.success.length; i++) {
          this.congestionData.push({
            label: res.success[i].zoneName,
            y: res.success[i].congestion
          })
        }
      }
      this.congestionGraph();
    }).catch((err: any) => {
      console.log("err===", err)
    })
  }

  congestionGraph() {
    var chart = new CanvasJS.Chart('line', {
      animationEnabled: true,
      theme: 'light2',
      title: {
        text: '',
      },
      axisX: {
        title: "Zone"
      },
      axisY: {
        title: "Congestion (in min)",
        suffix: "min",
        stripLines: [
          {
            startValue: -19.8,
            endValue: -20,
            color: "#black",
            lineDashType: "longDash",
          }
        ],
        minimum: -20,
        gridThickness: 0,
        reversed: true,
        interval: 20
      },
      data: [
        {
          type: 'line',
          indexLabelFontSize: 12,
          dataPoints: this.congestionData,
          yValueFormatString: "#,##0#\" min\"",
        },
      ],
    });
    chart.render();
  }

}



