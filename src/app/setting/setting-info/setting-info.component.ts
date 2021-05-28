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
  coinData: any = [];
  coinDataTemp: any = [];
  deviceData: any = [];
  zoneData: any = [];
  groupData: any = [];
  serviceData: any = [];
  form1: any;
  form2: any;
  form3: any;
  form4: any;
  form5: any;
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
    this.form1 = this.fb.group({
      items: this.fb.array([])
    });
    this.form2 = this.fb.group({
      items: this.fb.array([])
    });
    this.form3 = this.fb.group({
      items: this.fb.array([])
    });
    this.form4 = this.fb.group({
      items: this.fb.array([])
    });
    this.form5 = this.fb.group({
      items: this.fb.array([])
    });
    this.groupForm = this.fb.group({
      items: this.fb.array([])
    });
    this.zoneForm = this.fb.group({
      items: this.fb.array([])
    });
  }

  loadData() {
    if (this.type == 'timeDelay' || this.type == 'find-inactive') {
      this.refreshDevice();
    }
    else if (this.type == 'coin' || this.type == 'max-find') {
      this.refreshCoin();
    }
    else if (this.type == 'coin-cat') {
      this.refreshCoin();
      this.getZoneDetails();
    }
    else if (this.type == 'groupName' || this.type == 'coinGrp') {
      this.refreshCoin();
      this.getGroups();
    }
    else if (this.type == 'serviceType') {
      this.getServiceDetails();
      this.getZoneDetails();
    }
    else {
      this.getZoneDetails();
    }
  }

  refreshCoin() {
    this.coinData = [];
    this.coinDataTemp = [];
    var data='';
    this.api.getCoinData(data).then((res: any) => {
      console.log("coin submit====", res);
      if (res.status) {
        this.coinData = res.success;
        if (this.type == 'coinGrp') {
          const control = <FormArray>this.groupForm.controls.items;
          control.controls = [];
          var groupData = this.dataDateReduce(res.success, 'group')
          this.coinDataTemp = Object.keys(groupData).map((data) => {
            return {
              name: data,
              data: groupData[data],
            }
          })
          console.log("this.coinDataTemp", this.coinDataTemp)
          for (let i = 0; i < this.coinDataTemp.length; i++) {
            control.push(this.fb.group(
              {
                coinId: [this.setCoin(this.coinDataTemp[i].data)],
                coinName: this.setData(this.coinDataTemp[i].data),
                groupId: [this.coinDataTemp[i].name]
              }
            ));
          }
        }
        else if (this.type == 'coin-cat') {
          const control = <FormArray>this.zoneForm.controls.items;
          control.controls = [];

          var zoneData = this.dataDateReduce(res.success, 'zone')
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
          const control = <FormArray>this.form1.controls.items;
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

      else { }

    }).catch((err: any) => {
      console.log("error===", err)
    })

  }

  refreshDevice() {
    this.deviceData = [];
    var data=''
    this.api
      .getDeviceData(data)
      .then((res: any) => {
        const control = <FormArray>this.form2.controls.items;
        control.controls = [];
        console.log('find submit====', res);
        if (res.status) {
          this.deviceData = res.success
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
        else { }
      }).catch((err: any) => {
        console.log("error===", err)
      });
  }

  getZoneDetails() {
    this.zoneData = [];
    this.api.getZone().then((res: any) => {
      console.log('zone details response==', res);
      const control = <FormArray>this.form3.controls.items;
      control.controls = [];
      if (res.status) {
        this.zoneData = res.success;
        for (let i = 0; i < this.zoneData.length; i++) {
          control.push(this.fb.group(
            {
              standardTime: [this.zoneData[i].standardTime,Validators.min(0)],
              zoneName: [this.zoneData[i].zoneName, Validators.pattern('^[a-zA-Z0-9_]+(?: [a-zA-Z0-9_]+)*$')],
              _id: [this.zoneData[i]._id]
            }
          ));
        }
      }
      else { }

    })
  }

  getGroups() {
    this.groupData = []
    this.api.getGroup().then((res: any) => {
      console.log("group details response==", res)
      if (res.status) {
        this.groupData = res.success
        const control = <FormArray>this.form5.controls.items;
        control.controls = [];
        for (let i = 0; i < this.groupData.length; i++) {
          control.push(this.fb.group(
            {
              groupName: [this.groupData[i].groupName, Validators.pattern('^[a-zA-Z0-9_]+(?: [a-zA-Z0-9_]+)*$')],
              _id: [this.groupData[i]._id]
            }
          ));
        }
      }
      else { }
    })
  }

  getServiceDetails() {
    this.serviceData = []
    this.api.getServiceType().then((res: any) => {
      console.log("service details response==", res)
      if (res.status) {
        this.serviceData = res.success
        const control = <FormArray>this.form4.controls.items;
        control.controls = [];
        for (let i = 0; i < this.serviceData.length; i++) {
          control.push(this.fb.group(
            {
              serviceName: [this.serviceData[i].serviceName, Validators.pattern('^[a-zA-Z0-9_]+(?: [a-zA-Z0-9_]+)*$')],
              zoneId: [this.serviceData[i].zoneId],
              zoneName: this.setZone(this.serviceData[i].zoneId),
              _id: [this.serviceData[i]._id],
              deviceId:[this.serviceData[i].deviceId]
            }
          ));
        }
      }
      else { }
    })
  }
  onSubmitTimeDelay(value) {
    console.log("onSubmitTimeDelay data==", value)
    var data = {
      deviceId: value.deviceId,
      timeDelay: value.timeDelay
    }
    console.log("onSubmitTimeDelay data==", data)
    try {
      if (this.form2.valid) {
        this.api.timeDelay(data).then((res: any) => {

          console.log("timeDelay res===", res)
          if (res.status) {
            this.refreshDevice()
            this.general.openSnackBar(res.success, '')
          }
          else {
            this.general.openSnackBar(res.success == false ? res.message : res.success, '')
          }
        }).catch((err) => {
          console.log("err=", err)
        })
      }
      else { }
    }
    catch (error) {
      console.log("error==", error)
    }

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
      if (this.form2.valid) {
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
          console.log("err=", err)
        })
      }
      else { }
    }
    catch (error) {
      console.log("error==", error)
    }

  }

  onSubmitInactivityCoin(value) {
    console.log("onSubmitInactivityCoin data==", value)
    var data = {
      inactivityTime: value.inActivityTime,
      sms: value.inactivityAlert == 'sms' ? true : false,
      email: value.inactivityAlert == 'email' ? true : false,
      coinId: [value.coinId]
    }

    console.log("onSubmitInactivityCoin data==", data)
    try {
      if (data) {
        this.api.coinInactivity(data).then((res: any) => {

          console.log("inactivity coin res===", res)
          if (res.status) {
            this.refreshCoin()
            this.general.openSnackBar(res.success, '')
          }
          else {
            this.general.openSnackBar(res.success == false ? res.message : res.success, '')

          }
        }).catch((err) => {
          console.log("err=", err)
        })
      }
      else { }
    }
    catch (error) {
      console.log("error==", error)
    }
  }

  onSubmitMaxFindForm(value) {
    console.log("onSubmitMaxFindForm data==", value)
    var data = {
      coinId: [value.coinId],
      maxFindAsset: value.maxFindAsset,
    }
    console.log("onSubmitMaxFindForm data==", data)
    try {
      if (this.form1.valid) {
        this.api.updateMaxFind(data).then((res: any) => {
          console.log("max find res===", res)
          if (res.status) {
            this.refreshDevice()
            this.general.openSnackBar(res.success, '')
          }
          else {
            this.general.openSnackBar(res.success == false ? res.message : res.success, '')

          }
        }).catch((err) => {
          console.log("err=", err)
        })
      }
      else { }
    }
    catch (error) {
      console.log("error==", error)
    }
  }

  onSumbitCoinCategory(value) {
    console.log("onSumbitCoinCategory data==", value)
    value.coinId = this.general.filterIds(value.coinId)
    var data = {
      coinId: value.coinId,
      zoneId: value.zoneId
    }
    console.log("onSumbitCoinCategory data==", data)

    try {
      if (this.zoneForm.valid) {
        this.api.zoneConfiguration(data).then((res: any) => {

          console.log("zone setting res===", res)
          if (res.status) {
            this.refreshCoin()
            this.general.openSnackBar(res.success, '')
          }
          else {
            this.general.openSnackBar(res.success == false ? res.message : res.success, '')

          }
        }).catch((err) => {
          console.log("err=", err)
        })
      }
      else { }
    }
    catch (error) {
      console.log("error==", error)
    }


  }

  onSubmitZoneForm(data) {

    console.log("onSubmitZoneForm data==", data)
    data.zoneName = data.zoneName.trim()
    try {
      if (this.form3.valid) {
        this.api.updateZoneDetails(data).then((res: any) => {

          console.log("zone setting res===", res)
          if (res.status) {
            this.getZoneDetails()
            this.general.openSnackBar(res.success, '')
          }
          else {
            this.general.openSnackBar(res.success == false ? res.message : res.success, '')
            this.getZoneDetails()
          }
        }).catch((err) => {
          console.log("err=", err)
        })
      }
      else { }
    }
    catch (error) {
      console.log("error==", error)
    }
  }
  onSubmitZoneSTDForm(data) {
    data.zoneId=[data._id]
    console.log("onSubmitZoneForm data==", data)
    // data.zoneName = data.zoneName.trim()
    try {
      if (this.form3.valid) {
        this.api.updateZoneInfo(data).then((res: any) => {

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
      else { }
    }
    catch (error) {
      console.log("error==", error);
    }
  }

  onSubmitGroup(value) {
    console.log("onSubmitGroup data==", value)
    var data = {
      _id: value._id,
      groupName: value.groupName.trim()
    }
    console.log("onSubmitZoneForm data==", data)

    try {
      if (this.form5.valid) {
        this.api.updateGroupName(data).then((res: any) => {

          console.log("Group register res===", res)
          if (res.status) {
            this.getGroups()
            this.general.openSnackBar(res.success, '')
          }
          else {
            this.general.openSnackBar(res.success == false ? res.message : res.success, '')

          }
        }).catch((err) => {
          console.log("err=", err)
        })
      }
      else { }
    }
    catch (error) {
      console.log("error==", error)
    }
  }

  onSubmitGroupCoinForm(value) {
    value.groupName = this.groupData.filter(obj => obj._id == value.groupId)[0].groupName;
    value.coinId = this.general.filterIds(value.coinId)
    console.log("onSubmitGroupCoinForm data==", value)

    var data = {
      coinId: value.coinId,
      groupId: value.groupId,
      groupName: value.groupName,
    }
    console.log("onSubmitGroupCoinForm data==", data)
    try {
      if (this.groupForm.valid) {
        this.api.updateGroup(data).then((res: any) => {
          console.log("Group coin res===", res)
          if (res.status) {
            this.refreshCoin()
            this.getGroups()
            this.general.openSnackBar(res.success, '')
          }
          else {
            this.general.openSnackBar(res.success == false ? res.message : res.success, '')

          }
        }).catch((err) => {
          console.log("err=", err)
        })
      }
      else { }
    }
    catch (error) {
      console.log("error==", error)
    }
  }

  onSubmitServiceType(value) {
    console.log("onSubmitServiceType data==", value)
    var data = {
      zoneId: value.zoneId,
      serviceName: value.serviceName.trim(),
    }
    console.log("onSubmitServiceTye data==", data)
    try {
      if (this.form4.valid) {
        this.api.createServiceType(data).then((res: any) => {

          console.log("Group coin res===", res)
          if (res.status) {
            this.getServiceDetails()
            this.getZoneDetails()
            this.general.openSnackBar(res.success, '')
          }
          else {
            this.general.openSnackBar(res.success == false ? res.message : res.success, '')

          }
        }).catch((err) => {
          console.log("err=", err)
        })
      }
      else { }
    }
    catch (error) {
      console.log("error==", error)
    }
  }
  
  deleteTimeDelay(value) {
    var data = {
      _id: value._id
    }
    console.log("delete TimeDelay data==", data)
    this.api.deleteTimeDelay(data).then((res: any) => {
      if (res.status) {
        this.general.openSnackBar(res.success, '')
        this.refreshDevice()
      }
      this.general.openSnackBar(res.success == false ? res.message : res.success, '')

    })
  }

  deleteInactivityFind(data) {
    console.log("delete InactivityFind data==", data)
    this.api.deleteFindInactivity(data).then((res: any) => {
      if (res.status) {
        this.general.openSnackBar(res.success, '')
        this.refreshDevice()
      }
      else {
        if (res.success === false) {
          this.general.openSnackBar(res.message, '')
        }
        else {
          if (res.success === false) {
            this.general.openSnackBar(res.message, '')
          }
          else {
            this.general.openSnackBar(res.success, '')
          }
        }
      }
    })
  }

  deleteInactivityCoin(data) {
    console.log("delete InactivityCoin data==", data)
    this.api.deleteCoinInactivity(data).then((res: any) => {
      if (res.status) {
        this.general.openSnackBar(res.success, '')
        this.refreshCoin()
      }
      this.general.openSnackBar(res.success == false ? res.message : res.success, '')

    })
  }

  deleteMaxFindForm(data) {

    console.log("delete max find data==", data)
    this.api.deleteMaxFindAsset(data).then((res: any) => {
      if (res.status) {
        this.general.openSnackBar(res.success, '')
        this.refreshCoin()
      }
      this.general.openSnackBar(res.success == false ? res.message : res.success, '')

    })
  }

  deleteGroup(value) {
    var data = {
      _id: value._id
    }
    console.log("delete  group data==", data)
    this.api.deleteGroupDetails(data).then((res: any) => {
      if (res.status) {
        this.general.openSnackBar(res.success, '')
        this.refreshCoin()
        this.getGroups()
      }
      this.general.openSnackBar(res.success == false ? res.message : res.success, '')

    })
  }

  deleteZoneForm(data) {
    console.log("delete zone data==", data)
    this.api.deleteZoneName(data).then((res: any) => {
      if (res.status) {
        console.log("delete zone res==", res)
        this.general.openSnackBar(res.success, '')
        this.refreshCoin()
        this.getZoneDetails()
      }
      this.general.openSnackBar(res.success == false ? res.message : res.success, '')

    })
  }
  deleteGroupCoinForm(data) {
    data.coinId=this.general.filterIds(data.coinId)
    console.log("delete GroupCoinForm data==", data)
    this.api.deleteCoinGroupDetails(data).then((res: any) => {
      console.log("delte group coin==", res)
      if (res.status) {
        this.general.openSnackBar(res.success, '')
        this.refreshCoin()
        this.getGroups()
      }
      this.general.openSnackBar(res.success == false ? res.message : res.success, '')

    })
  }

  deleteCoinCategory(data) {
    data.coinId=this.general.filterIds(data.coinId)
    console.log("delete CoinCategory data==", data)
    this.api.deleteCoinZone(data).then((res: any) => {
      console.log("delte zone==", res)
      if (res.status) {
        this.general.openSnackBar(res.success, '')
        this.refreshCoin()
        this.getZoneDetails()

      }
      this.general.openSnackBar(res.success == false ? res.message : res.success, '')

    })
  }
  deleteServiceType(data) {
    console.log("delete ServiceType data==", data)
    this.api.deleteServices(data).then((res: any) => {
      if (res.status) {
        this.general.openSnackBar(res.success, '')
        this.refreshCoin()
        this.getServiceDetails()
      }
      this.general.openSnackBar(res.success == false ? res.message : res.success, '')

    })
  }
  compareFn(o1, o2): boolean {
    return o1.coinId == o2.coinId;
  }
  compareFn1(o1, o2): boolean {
    return o1 == o2._id;
  }

  setZone(data) {
    let arr = new FormArray([])
    data.forEach(obj => {
      arr.push(this.fb.group({
        _id: [obj._id],
        zoneName: [obj.zoneName],
      }))
    })
    return arr;
  }

  setCoin(data) {
    let arr1 = []
    data.forEach(obj => {
      arr1.push({
        coinId: obj.coinId,
        coinName: obj.coinName,
        groupId: obj.groupId,
        zoneId: obj.zoneId,
      })

    })
    return arr1;
  }
  setData(data) {
    let arr = new FormArray([])
    data.forEach(obj => {
      arr.push(this.fb.group({
        coinId: [obj.coinId],
        coinName: [obj.coinName],
        groupId: [obj.groupId],
        zoneId: [obj.zoneId],
      }))

    })
    return arr;
  }

  dataDateReduce(data, type) {
    if (type == 'group') {
      data = data.filter((obj) => {
        return obj.groupId != null
      })
      console.log("data==", data)
      return data.reduce((group, obj) => {
        const name = obj.groupId._id
        if (!group[name]) {
          group[name] = []
        }
        group[name].push(obj)
        return group
      }, {})
    }
    else {
      data = data.filter((obj) => {
        return obj.zoneId != null
      })

      return data.reduce((zone, obj) => {
        const name = obj.zoneId._id
        if (!zone[name]) {
          zone[name] = []
        }
        zone[name].push(obj)
        return zone
      }, {})
    }
  }
}
