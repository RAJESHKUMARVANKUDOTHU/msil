import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { LoginAuthService } from '../../services/login-auth.service';
import { GeneralService } from '../../services/general.service';
import { ApiService } from '../../services/api.service';
@Component({
  selector: 'app-setting-info',
  templateUrl: './setting-info.component.html',
  styleUrls: ['./setting-info.component.css'],
})
export class SettingInfoComponent implements OnInit {
  type: any;
  loginData: any;
  coinData: any = [];
  coinDataTemp: any = [];
  deviceData: any = [];
  zoneData: any = [];
  groupData: any = [];
  serviceData: any = [];
  mainZone: any = [];
  subZone: any = [];
  coinSettingForm: any;
  findSettingForm: any;
  zoneSettingForm: any;
  serviceSettingForm: any;
  groupSettingForm: any;
  mainZoneForm: any;
  subZoneForm: any;
  groupForm: any;
  zoneForm: any;
  constructor(
    public dialogRef: MatDialogRef<SettingInfoComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private login: LoginAuthService,
    private api: ApiService,
    public general: GeneralService,
    private fb: FormBuilder,
  ) {
    this.type = data.type;
  }

  ngOnInit(): void {
    this.loadData();
    this.loginData = this.login.getLoginDetails();
    this.coinSettingForm = this.fb.group({
      items: this.fb.array([])
    });
    this.findSettingForm = this.fb.group({
      items: this.fb.array([])
    });
    this.zoneSettingForm = this.fb.group({
      items: this.fb.array([])
    });
    this.serviceSettingForm = this.fb.group({
      items: this.fb.array([])
    });
    this.groupSettingForm = this.fb.group({
      items: this.fb.array([])
    });
    this.groupForm = this.fb.group({
      items: this.fb.array([])
    });
    this.zoneForm = this.fb.group({
      items: this.fb.array([])
    });
    this.mainZoneForm = this.fb.group({
      items: this.fb.array([])
    });
    this.subZoneForm = this.fb.group({
      items: this.fb.array([])
    });
  }

  loadData() {
    if (this.type == 'timeDelay' || this.type == 'find-inactive') {
      this.refreshDevice();
    }
    else if (this.type == 'coin') {
      this.refreshCoin();
    }
    else if (this.type == 'coin-cat') {
      this.refreshCoin();
      this.getZoneDetails();
    }
    else if (this.type == 'main-zone') {
      this.getMainZone();
    }
    else if (this.type == 'zone') {
      this.getZoneDetails();
    }
    else {
      this.getMainZone();
      this.getZoneDetails();
    }
  }

  refreshCoin() {
    this.coinData = [];
    this.coinDataTemp = [];
    var data = '';
    this.api.getCoinData(data).then((res: any) => {
      console.log("coin submit====", res);
      if (res.status) {
        this.coinData = res.success;
        if (this.type == 'coin-cat') {
          const control = <FormArray>this.zoneForm.controls.items;
          control.controls = [];
          var zoneData = this.dataDateReduce(res.success)
          this.coinDataTemp = Object.keys(zoneData).map((data) => {
            return {
              name: data,
              data: zoneData[data],
            }
          })
          for (let i = 0; i < this.coinDataTemp.length; i++) {
            control.push(this.fb.group(
              {
                coinId: [this.setCoin(this.coinDataTemp[i].data)],
                coinName: this.setData(this.coinDataTemp[i].data),
                zoneId: [this.coinDataTemp[i].name]
              }
            ));
          }
        }
        else {
          const control = <FormArray>this.coinSettingForm.controls.items;
          control.controls = [];
          for (let i = 0; i < this.coinData.length; i++) {
            control.push(this.fb.group(
              {
                coinId: [this.coinData[i].coinId],
                coinName: [this.coinData[i].coinName],
                _id: [this.coinData[i]._id],
                gatewayId: [this.coinData[i].gatewayId],
                groupId: [this.coinData[i].groupId != null ? this.coinData[i].groupId._id : '-'],
                maxFindAsset: [this.coinData[i].maxFindAsset],
                zoneName: [this.coinData[i].zoneId != null ? this.coinData[i].zoneId : '-'],
                inActivityTime: [this.coinData[i].inActivityTime],
                inactivityAlert: [this.coinData[i].inactivityAlert.sms == true ? 'sms' : this.coinData[i].inactivityAlert.email == true ? 'email' : ''],
                disable: true
              }
            ));
          }
        }
      }
    }).catch((err: any) => {
      console.log("error===", err)
    })
  }

  refreshDevice() {
    this.deviceData = [];
    var data = '';
    this.api
      .getDeviceData(data)
      .then((res: any) => {
        const control = <FormArray>this.findSettingForm.controls.items;
        control.controls = [];
        console.log('find submit====', res);
        if (res.status) {
          this.deviceData = res.success;
          for (let i = 0; i < this.deviceData.length; i++) {
            control.push(this.fb.group(
              {
                _id: [this.deviceData[i]._id],
                deviceId: [this.deviceData[i].deviceId],
                deviceName: [this.deviceData[i].deviceName],
                distance: [this.deviceData[i].distance],
                sms: [this.deviceData[i].sms == false ? 'N' : 'Y'],
                email: [this.deviceData[i].email == false ? 'N' : 'Y'],
                inActivityTime: [this.deviceData[i].inActivityTime],
                inactivityAlert: [this.deviceData[i].inactivityAlert.sms == true ? 'sms' : this.deviceData[i].inactivityAlert.email == true ? 'email' : ''],
                timeDelay: [this.deviceData[i].timeDelay],
                disable: true
              }
            ));
          }
        }
      }).catch((err: any) => {
        console.log("error===", err)
      });
  }

  getZoneDetails() {
    this.zoneData = [];
    this.api.getZone().then((res: any) => {
      console.log('zone details response==', res);
      const control = <FormArray>this.zoneSettingForm.controls.items;
      control.controls = [];
      if (res.status) {
        this.zoneData = res.success;
        if (this.type != 'zone') {
          let groupZone = [];

          this.zoneData.forEach(obj => {
            const key = obj?.mainZoneId?._id;
            if (key) {
              if (!(key in groupZone)) {
                groupZone[key] = [];
                groupZone[key].zoneName = obj?.mainZoneId?.zoneName;
                groupZone[key].standardTime = obj?.mainZoneId?.standardTime;
              }
              groupZone[key].push(obj?.mainZoneId);
            }
          });
          groupZone = Object.values(groupZone);
          for (let i = 0; i < groupZone.length; i++) {
            let zoneName = this.zoneData.map(obj => {
              if (obj?.mainZoneId?.zoneName == groupZone[i].zoneName)
                return obj.zoneName
            });
            console.log("zoneName", zoneName);

            control.push(this.fb.group(
              {
                standardTime: [groupZone[i].standardTime, Validators.min(0)],
                zoneName: [zoneName],
                zoneId: [zoneName],
                mainZoneId: [groupZone[i].zoneName]
              }
            ));
          }
        }
        else {
          for (let i = 0; i < this.zoneData.length; i++) {
            control.push(this.fb.group(
              {
                standardTime: [this.zoneData[i].standardTime, Validators.min(0)],
                zoneName: [this.zoneData[i].zoneName, Validators.pattern('^[a-zA-Z0-9\\s]+(?: [a-zA-Z0-9\\s]+)*$')],
                _id: [this.zoneData[i]._id]
              }
            ));
          }
        }
      }

    })
  }

  onSubmitInactivityFind(value, a) {
    console.log("onSubmitInactivityFind data==", value, a)
    var data = {
      inactivityTime: value.inActivityTime,
      sms: value.inactivityAlert == 'sms' ? true : false,
      email: value.inactivityAlert == 'email' ? true : false,
      deviceId: [value.deviceId]
    }
    try {
      if (this.findSettingForm.valid) {
        console.log("onSubmitInactivityFind data==", data)
        this.api.deviceInactivity(data).then((res: any) => {

          console.log("inactivity find res===", res)
          if (res.status) {
            this.refreshDevice()
            this.general.openSnackBar(res.success, '');
          }
          else {
            this.general.openSnackBar(res.success == false ? res.message : res.success, '');
          }
        }).catch((err) => {
          console.log("err=", err);
        })
      }
    }
    catch (error) {
      console.log("error==", error);
    }

  }

  onSubmitInactivityCoin(value) {
    console.log("onSubmitInactivityCoin data==", value);
    var data = {
      inactivityTime: value.inActivityTime,
      sms: value.inactivityAlert == 'sms' ? true : false,
      email: value.inactivityAlert == 'email' ? true : false,
      coinId: [value.coinId]
    }

    console.log("onSubmitInactivityCoin data==", data);
    try {
      if (data) {
        this.api.coinInactivity(data).then((res: any) => {
          console.log("inactivity coin res===", res);
          if (res.status) {
            this.refreshCoin()
            this.general.openSnackBar(res.success, '');
          }
          else {
            this.general.openSnackBar(res.success == false ? res.message : res.success, '');
          }
        }).catch((err) => {
          console.log("err=", err);
        })
      }
    }
    catch (error) {
      console.log("error==", error);
    }
  }

  onSumbitCoinCategory(value) {
    console.log("onSumbitCoinCategory data==", value);
    value.coinId = this.general.filterIds(value.coinId);
    var data = {
      coinId: value.coinId,
      zoneId: value.zoneId
    }
    console.log("onSumbitCoinCategory data==", data);
    try {
      if (this.zoneForm.valid) {
        this.api.zoneConfiguration(data).then((res: any) => {
          console.log("zone setting res===", res);
          if (res.status) {
            this.refreshCoin();
            this.general.openSnackBar(res.success, '');
          }
          else {
            this.general.openSnackBar(res.success == false ? res.message : res.success, '');
          }
        }).catch((err) => {
          console.log("err=", err);
        })
      }
    }
    catch (error) {
      console.log("error==", error)
    }
  }

  onSubmitZoneForm(data) {
    console.log("onSubmitZoneForm data==", data)
    data.zoneName = data.zoneName.trim().replace(/\s\s+/g, ' ');
    try {
      if (this.zoneSettingForm.valid) {
        this.api.updateZoneDetails(data).then((res: any) => {
          console.log("zone setting res===", res);
          if (res.status) {
            this.getZoneDetails();
            this.general.openSnackBar(res.success, '');
          }
          else {
            this.general.openSnackBar(res.success == false ? res.message : res.success, '');
            this.getZoneDetails();
          }
        }).catch((err) => {
          console.log("err=", err);
        })
      }
    }
    catch (error) {
      console.log("error==", error);
    }
  }

  deleteZoneForm(data) {
    console.log("onSubmitZoneForm data==", data)
    data.zoneName = data.zoneName.trim().replace(/\s\s+/g, ' ');
    try {
      if (this.zoneSettingForm.valid) {
        this.api.deleteZoneName(data).then((res: any) => {

          console.log("zone setting res===", res)
          if (res.status) {
            this.getZoneDetails();
            this.general.openSnackBar(res.success, '');
          }
          else {
            this.general.openSnackBar(res.success == false ? res.message : res.success, '');
            this.getZoneDetails();
          }
        }).catch((err) => {
          console.log("err=", err);
        })
      }
    }
    catch (error) {
      console.log("error==", error);
    }
  }





  deleteInactivityFind(data) {
    console.log("delete InactivityFind data==", data);
    this.api.deleteFindInactivity(data).then((res: any) => {
      if (res.status) {
        this.general.openSnackBar(res.success, '');
        this.refreshDevice();
      }
      else {
        if (res.success === false) {
          this.general.openSnackBar(res.message, '');
        }
        else {
          if (res.success === false) {
            this.general.openSnackBar(res.message, '');
          }
          else {
            this.general.openSnackBar(res.success, '');
          }
        }
      }
    })
  }

  deleteInactivityCoin(data) {
    console.log("delete InactivityCoin data==", data);
    this.api.deleteCoinInactivity(data).then((res: any) => {
      if (res.status) {
        this.general.openSnackBar(res.success, '');
        this.refreshCoin();
      }
      this.general.openSnackBar(res.success == false ? res.message : res.success, '');
    })
  }

  deleteCoinCategory(data) {
    data.coinId = this.general.filterIds(data.coinId)
    console.log("delete CoinCategory data==", data);
    this.api.deleteCoinZone(data).then((res: any) => {
      console.log("delte zone==", res);
      if (res.status) {
        this.general.openSnackBar(res.success, '');
        this.refreshCoin();
        this.getZoneDetails();
      }
      this.general.openSnackBar(res.success == false ? res.message : res.success, '');

    })
  }

  getMainZone() {
    try {
      this.api.getMainZones().then((res: any) => {
        console.log("zone setting res===", res);
        this.mainZone = [];
        if (res.status) {
          this.mainZone = res.success;
          const control = <FormArray>this.mainZoneForm.controls.items;
          control.controls = [];
          for (let i = 0; i < this.mainZone.length; i++) {
            control.push(this.fb.group(
              {
                zoneName: [this.mainZone[i].zoneName, Validators.pattern('^[a-zA-Z0-9\\s]+(?: [a-zA-Z0-9\\s]+)*$')],
                zoneObjectId: [this.mainZone[i]._id],
                standardTime: [this.mainZone[i].standardTime, Validators.min(0)]
              }
            ));
          }
        }
        else {
          this.general.openSnackBar(res.success == false ? res.message : res.success, '');

        }
      }).catch((err) => {
        console.log("err=", err);
      })
    }
    catch (error) {
      console.log("error==", error);
    }
  }

  onSubmitMainZoneForm(data) {
    console.log("onSubmitMainZoneForm data==", data);
    data.zoneName = data.zoneName.trim().replace(/\s\s+/g, ' ');
    data.standardTime = this.loginData.enableZoneStandardTime ? data.standardTime : 0;
    try {
      if (this.mainZoneForm.valid) {
        this.api.updateMainZones(data).then((res: any) => {
          console.log("zone setting res===", res);
          if (res.status) {
            this.getMainZone();
            this.general.openSnackBar(res.success, '');
          }
          else {
            this.general.openSnackBar(res.success == false ? res.message : res.success, '');
            this.getMainZone();
          }
        }).catch((err) => {
          console.log("err=", err);
        })
      }
    }
    catch (error) {
      console.log("error==", error);
    }
  }

  deleteMainZoneForm(data) {
    var value = {
      zoneObjectId: data.zoneObjectId
    }
    console.log("delete zone data==", value);
    this.api.deleteMainZone(value).then((res: any) => {
      if (res.status) {
        console.log("delete zone res==", res);
        this.general.openSnackBar(res.success, '');
        this.getMainZone();
      }
      this.general.openSnackBar(res.success == false ? res.message : res.success, '');
    })
  }

  onSubmitSubZoneForm(data) {
    console.log("onSubmitMainZoneForm data==", data);
    data.mainZoneId = this.zoneData.filter((obj) => {
      if (obj.mainZoneId?.zoneName == data.mainZoneId) {
        return obj.mainZoneId?._id
      }
    })[0].mainZoneId?._id;
    console.log("data.mainZoneId==", data.mainZoneId);
    try {
      if (this.subZoneForm.valid) {
        this.api.updateSubZones(data).then((res: any) => {
          console.log("onSubmitMainZoneForm res===", res);
          if (res.status) {
            this.getZoneDetails();
            this.general.openSnackBar(res.success, '');
          }
          else {
            this.general.openSnackBar(res.success == false ? res.message : res.success, '');
            this.getZoneDetails();
          }
        }).catch((err) => {
          console.log("err=", err);
        })
      }
    }
    catch (error) {
      console.log("error==", error);
    }
  }
  compareFn(o1, o2): boolean {
    return o1.coinId == o2.coinId;
  }
  compareFn1(o1, o2): boolean {
    return o1 == o2;
  }

  setZone(data) {
    console.log("data==", data);
    let arr = new FormArray([]);
    data?.forEach(obj => {
      arr.push(this.fb.group({
        zoneName: [obj.zoneName],
      }));
    });
    return arr;
  }

  setCoin(data) {
    let arr1 = [];
    data.forEach(obj => {
      arr1.push({
        coinId: obj.coinId,
        coinName: obj.coinName,
        groupId: obj.groupId,
        zoneId: obj.zoneId,
      });
    });
    return arr1;
  }

  setData(data) {
    let arr = new FormArray([]);
    data.forEach(obj => {
      arr.push(this.fb.group({
        coinId: [obj.coinId],
        coinName: [obj.coinName],
        groupId: [obj.groupId],
        zoneId: [obj.zoneId],
      }));
    });
    return arr;
  }

  dataDateReduce(data) {
    data = data.filter((obj) => {
      return obj.zoneId != null;
    });
    return data.reduce((zone, obj) => {
      const name = obj.zoneId._id;
      if (!zone[name]) {
        zone[name] = [];
      }
      zone[name].push(obj);
      return zone;
    }, {});

  }
}
