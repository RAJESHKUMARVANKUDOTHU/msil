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
// import 'leaflet-rotatedmarker/leaflet.rotatedMarker';
// import 'leaflet-moving-marker/index';
import * as moment from 'moment';
import { LoginAuthService } from '../services/login-auth.service';
import { GeneralService } from '../services/general.service'
import 'leaflet-moving-rotated-marker/leaflet.movingRotatedMarker';
import * as R from 'leaflet-responsive-popup';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  date: any = new Date();
  map;
  loginDetails: any;
  zoneList: any = [];
  mainZoneList: any = [];
  deviceList: any = [];
  layoutList: any = [];
  selectedLayout: any;
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
  id: any;

  constructor(
    private cd: ChangeDetectorRef,
    private api: ApiService,
    private login: LoginAuthService,
    private router: Router,
    public general: GeneralService) {

  }

  ngOnInit(): void {
    this.loginDetails = this.login.getLoginDetails();
    console.log("this.loginDetails", this.loginDetails);
    this.id = this.loginDetails._id;
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
        console.log('get layout res===', res);
        if (res.status) {
          let data = res.success
          this.layoutList = res.success;
          for (let i = 0; i < data.length; i++) {
            if (data[i].layoutName != null) {
              this.layoutSelect(data[i].layoutName);
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

  layoutSelect(data) {
    console.log('data layout===', data);
    if (data) {

      let layout = this.layoutList.filter(obj => {
        return obj.layoutName == data
      })[0]
      this.selectedLayout = layout;
      let zones = [];
      let unique = new Set();
      if (layout) {
        layout.gateway.filter((obj) => {
          obj.coinData.filter(coin => {
            if (!(unique.has(coin.zoneId))) {
              unique.add(coin.zoneId)
              zones.push(coin.zoneId)
            }
            return;
          })
        })
        console.log("zones==", zones);
        this.selectedLayout['zones'] = zones;
        this.getLayoutImage(layout._id, zones);
      }
    }
  }


  getLayoutImage(id, zones) {
    this.api.getLayoutImage(id).then((resImg: any) => {
      this.clearMapImage();
      var bounds = this.map.getBounds();
      L.imageOverlay(resImg, bounds).addTo(this.map);
      this.map.on('load', this.getZones(zones));
    });
  }

  // , {color: "white", weight: 1}

  getZones(zones) {
    // console.log('here zones');
    this.api.getZoneByZoneId({ zoneId: zones }).then((res: any) => {
      console.log('zone details response==', res);
      this.zoneList = [];
      this.mainZoneList = [];
      if (res.status) {
        this.getZoneVehicleData(zones);
        this.interval = setInterval((i) => {
          console.log("i=====",i);
          
          if (!this.zoneClickStatus.status) {
            console.log("this.selectedLayout===",this.selectedLayout);
            
            this.getZoneVehicleData(this.selectedLayout?.zones);
          }
        }, 10000)
        let unique = new Set();
        this.zoneList = res.success.map((obj) => {
          obj.highlight = false;
          obj.selected = true;
          obj.vehicleCount = 0;
          obj.avgTime = 0;
          obj.color = this.getRandomColor();
          obj.vehicleCount = 0;
          obj.time = 0;
          obj.isDelay = false;
          if (!unique.has(obj?.mainZoneId?._id)) {
            if (obj?.mainZoneId?._id) {
              unique.add(obj?.mainZoneId?._id)
              this.mainZoneList.push({
                _id: obj?.mainZoneId?._id,
                zoneName: obj?.mainZoneId?.zoneName,
                standardTime: obj?.mainZoneId?.standardTime,
                vehicleCount: 0,
                avgTime: 0,
                time: 0,
                isDelay: false,
              })
            }
          }
          return obj;
        });
        console.log("this.mainZoneList===", this.mainZoneList);

        this.tempZoneList = this.zoneList;
      } else {
        this.zoneList = [];
        this.mainZoneList = [];
      }
    });
  }


  getZoneVehicleData(data) {
    this.zoneClickStatus = {
      status: false,
      zone: null
    };
    console.log("vehicle para===",data);
    
    this.api.getZoneVehicleData({ zoneId: data }).then((res: any) => {
      console.log('zone vehicle response==', res);
      if (res.status) {
        this.deviceList = res.success;
        let data = res.success;
        data.map((obj, index) => {
          let latlng = [{
            lat: obj.deviceData?.deviceBound?.latitude,
            lng: obj.deviceData?.deviceBound?.longitude
          }]
          this.deviceList[index].latlng = latlng;
          let prevlatlng = [];
          if (obj.deviceData?.prevCoinLatLng?.length) {
            prevlatlng = [{
              lat: obj.deviceData?.prevCoinLatLng[0],
              lng: obj.deviceData?.prevCoinLatLng[1]
            }]
          }
          this.deviceList[index].prevlatlng = prevlatlng;
        });
        this.tempDeviceList = this.deviceList;
        this.calculateZoneActions();
      } else {
        this.deviceList = [];
        this.zoneList = [];
        this.mainZoneList = [];
      }
      this.createDevice();
    });
  }


  calculateZoneActions() {
    let groupByzone = this.groupByZone();
    let data = Object.keys(groupByzone).map((obj) => {
      return {
        data: groupByzone[obj],
        zoneName: obj
      }
    })
    console.log("data group===", data);

    this.resetZoneList();
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
          this.mainZoneList.forEach(obj => {
            if (obj._id == zone?.mainZoneId?._id) {
              obj.time += zone.time;
              obj.vehicleCount = element.data.length;
              if (obj.time < obj.standardTime) {
                obj.isDelay = false;
              }
              else {
                obj.isDelay = true;
                // zone.time = zone.time * -1
              }
            }
          });
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

  resetZoneList() {
    this.zoneList = this.zoneList.map((obj) => {
      obj.highlight = false;
      obj.selected = true;
      obj.vehicleCount = 0;
      obj.avgTime = 0;
      obj.color = this.getRandomColor();
      obj.vehicleCount = 0;
      obj.time = 0;
      obj.isDelay = false;
      return obj;
    })
    this.mainZoneList = this.mainZoneList.map((obj) => {
      obj.vehicleCount = 0;
      obj.avgTime = 0;
      obj.vehicleCount = 0;
      obj.time = 0;
      obj.isDelay = false;
      return obj;
    })
  }


  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }


  zoneClick(data, mapClick = true) {
    console.log("zone click data===", data);

    this.clearMap();
    let zoneName;
    if (mapClick) {
      zoneName = data?.mainZoneId?.zoneName ? data?.mainZoneId?.zoneName : 'No parent zone';
    }
    else {
      zoneName = data.zoneName;
    }
    this.zoneClickStatus = {
      status: true,
      zone: zoneName
    };
    console.log("this.zoneClickStatus", this.zoneClickStatus);

    this.zoneList = this.zoneList.map((obj) => {
      if ((obj._id == data._id && mapClick) || (!mapClick && obj?.mainZoneId?._id == data._id)) {
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
    this.GroupDevices(data._id, mapClick);
  }


  GroupDevices(data, mapClick = true) {
    this.deviceGroupList = this.deviceList.filter(obj => {
      if ((obj.zoneId == data && mapClick) || (obj.mainZoneId == data && !mapClick)) {
        console.log("true");
        console.log('this.zoneList===', this.zoneList);
        return this.getDeviceDelayOperation(obj);
      }
    });
    console.log("this.deviceGroupList==",this.deviceGroupList)
  }


  getDeviceDelayOperation(obj) {
    if (obj.outTime == null) {
      obj.time = Math.floor(obj.totalDelay / (1000 * 60));
      if (obj.time < 0) {
        obj.isDelay = false;
        obj.time *= -1;
      } else {
        obj.isDelay = true;
      }
    }
    else {
      obj.time = Math.floor(obj.totalDelay / (1000 * 60));
      if (obj.time < 0) {
        obj.isDelay = false;
        obj.time *= -1;
      } else {
        obj.isDelay = true;
      }
    }
    obj.EDT = this.getEDT(obj);
    obj.SDT = this.getSDT(obj);
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
            // let latlngPath = [];
            for (let k = 0; k < this.deviceList[j].latlng.length; k++) {
              latlng.push([
                this.deviceList[j].latlng[k].lat,
                this.deviceList[j].latlng[k].lng,
              ]);
              // latlngPath.push(this.deviceList[j].latlng[k]);

            }
            // if (this.deviceList[j]?.prevlatlng?.length) {
            //   for (let k = 0; k < this.deviceList[j].prevlatlng.length; k++) {
            //     latlngPath.push(this.deviceList[j].prevlatlng[k]);
            //   }
            // }
            // latlng = [{ lat: 0.0, lng: 0.0 }, { lat: 52.5163, lng: 13.3779 }]
            this.deviceList[j] = this.getDeviceDelayOperation(this.deviceList[j]);
            if (this.deviceList[j].isDelay) {
              icon = iconRed;
            }
            else {
              icon = iconBlack;
            }
            // ,rotationAngle:this.getAngle(latlng[0].lat,latlng[1].lat,latlng[0].lng,latlng[1].lng)
            // var m = new L.marker([this.deviceList[j].latlng[0].lat, this.deviceList[j].latlng[0].lng], {
            //   icon: icon,
            // }).addTo(this.map)
            //   .bindTooltip(this.getPopUpForm(this.deviceList[j]), {
            //     direction: this.getDirection(latlng),
            //     permanent: false
            //   })
            // console.log("latlngPath==", latlngPath);

            // m.slideTo([this.deviceList[j].latlng[0].lat, this.deviceList[j].latlng[0].lng], { path: latlngPath, duration: 300 });
            // this.cd.detectChanges();

            let popup = R.responsivePopup().setContent(this.getPopUpForm(this.deviceList[j]));
            this.marker.push(
              new L.animatedMarker(latlng, { icon: icon, interval: 3000 })
                .addTo(this.map).bindPopup(popup)
                // .bindTooltip(this.getPopUpForm(this.deviceList[j]), {
                //   direction: this.getDirection(latlng),
                //   permanent: false,
                //   className: 'tootip-custom'
                // })
            );
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
            this.zoneClickStatus = {
              status: true,
              zone: this.deviceList[i]?.mainZoneName ? this.deviceList[i]?.mainZoneName : 'No parent zone'
            };
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
    let a = '<table class="popup">';
    a += '<tr><td><b>Vehicle name</b></td><td>' + data.deviceName + '</td></tr>';
    a += '<tr><td><b>Location name</b></td><td>' + data.coinName + '</td></tr>';
    a += '<tr><td><b>Service type</b></td><td>' + data.serviceCategory?.serviceName + '</td></tr>';
    a += '<tr><td><b>Zone name</b></td><td>' + data.zoneName + '</td></tr>';
    a += '<tr><td><b>Zone standard time</b></td><td>' + data.standardDeliveryTime + ' minutes</td></tr>';
    a += '<tr><td><b>Total standard time</b></td><td>' + data?.totalStandardTime + ' minutes</td></tr>';
    a += '<tr><td><b>Zone delay</b></td><td>' + this.getDelay(data) + ' minutes</td></tr>';
    a += '<tr><td><b>Total delay</b></td><td>' + this.getTotalDelay(data) + ' minutes</td></tr>';
    a += '<tr><td><b>In time</b></td><td>' + moment(data.inTime).format('YYYY-MM-DD hh:mm:ss a') + '</td></tr>';
    a += '<tr><td><b>SDT</b></td><td>' + data.SDT.format('YYYY-MM-DD hh:mm:ss a') + '</td></tr>';
    a += '<tr><td><b>EDT</b></td><td>' + data.EDT.format('YYYY-MM-DD hh:mm:ss a') + '</td></tr>';
    a += '</table>';
    return a;
  }

  getDelay(data) {
    return Math.floor(data.zoneDelay / (60 * 1000));
  }

  getTotalDelay(data) {
    return Math.floor(data.totalDelay / (60 * 1000));
  }


  getSDT(data) {
    let ST = data?.totalStandardTime || 0;
    return moment(data.deviceData.jcInTime).add(ST, 'minutes');
  }

  getEDT(data) {
    let ST = data?.totalStandardTime || 0;
    ST = ST * 60 * 1000;
    let ET = ST;
    data.jcSummaryData?.zoneJC.forEach(obj => {
      if (obj.delayTime != (-1 * (obj.standardTime * 60 * 1000))) {
        ET += obj.delayTime;
      }
    });
    return moment(data.deviceData.jcInTime).add(ET, 'milliseconds');
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
    this.api.getCongestion(data).then((res: any) => {
      console.log("congestion res===", res)
      this.congestionData = [];
      if (res.status) {
        for (let i = 0; i < res.success.length; i++) {
          this.congestionData.push({
            label: res.success[i].zoneName,
            y: res.success[i].congestion ? res.success[i].congestion : 0
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
            color: "black",
            lineDashType: "longDash",
          }
        ],
        // minimum: -20,
        gridThickness: 0,
        reversed: true,
        // interval: 20
      },
      data: [
        {
          type: "line",
          indexLabelFontSize: 12,
          dataPoints: this.congestionData,
          // yValueFormatString: "#,##0#\" min\"",
        },
      ],
    });
    chart.render();
  }

}