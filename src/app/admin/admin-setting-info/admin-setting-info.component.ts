import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { GeneralService } from '../../services/general.service';
import { LoginAuthService } from 'src/app/services/login-auth.service';
@Component({
  selector: 'app-admin-setting-info',
  templateUrl: './admin-setting-info.component.html',
  styleUrls: ['./admin-setting-info.component.css']
})
export class AdminSettingInfoComponent implements OnInit {
  userId: any;
  meshForm: any;
  meshData: any = [];
  gatewayData: any = [];
  type: any;
  loginData: any;
  coinData: any = [];
  coinDataTemp: any = [];
  deviceData: any = [];
  groupData: any = [];
  coinSettingForm: any;
  findSettingForm: any;
  groupSettingForm: any;
  groupForm: any;
  constructor(
    public dialogRef: MatDialogRef<AdminSettingInfoComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private api: ApiService,
    private general: GeneralService,
    private login: LoginAuthService,
    private fb: FormBuilder,
  ) {
    this.type = data.type;
    console.log("type==",this.type);
    
  }

  ngOnInit(): void {
    this.loginData = this.login.getLoginDetails();
    this.meshForm = this.fb.group({
      items: this.fb.array([])
    });
    this.coinSettingForm = this.fb.group({
      items: this.fb.array([])
    });
    this.findSettingForm = this.fb.group({
      items: this.fb.array([])
    });
    this.groupSettingForm = this.fb.group({
      items: this.fb.array([])
    });
    this.groupForm = this.fb.group({
      items: this.fb.array([])
    });
    this.getMeshData();
    this.refreshGateway();
    this.loadData();
  }

  loadData() {
    if (this.type == 'timeDelay' || this.type == 'find-txPower') {
      this.refreshDevice();
    }

    else if (this.type == 'groupName' || this.type == 'coinGrp') {
      this.refreshCoin();
      this.getGroups();
    }
    else{
      this.refreshCoin();
    }
  }

  getMeshData() {
    var data = {
      userId: this.loginData.userData
    }
    console.log("data==", data)
    this.api.getMeshData(data).then((res: any) => {
      this.meshData = []
      if (res.status) {
        console.log("res==", res)
        this.meshData = res.success
        const control = <FormArray>this.meshForm.controls.items;
        control.controls = [];
        for (var i = 0; i < this.meshData.length; i++) {
          control.push(this.fb.group(
            {
              userId: [this.meshData[i].userId],
              meshId: [this.meshData[i].meshId, [Validators.required, Validators.min(0), Validators.max(255)]],
              gatewayId: [this.meshData[i].gatewayId],
              gatewayName: [this.meshData[i].gatewayName],
            }
          ))
        }
      }
    }).catch((err: any) => {
      console.log("err==", err);
    })
  }

  refreshGateway() {
    var data = {
      userId: this.loginData.userData
    }
    console.log("user id data==", data);
    this.api.getSuperAdminGatewayData(data).then((res: any) => {
      console.log("gatway submit====", res);
      this.gatewayData = [];
      if (res.status) {
        this.gatewayData = res.success;
      }
    }).catch((err: any) => {
      console.log("error===", err);
    })
  }

  refreshCoin() {
    this.coinData = [];
    this.coinDataTemp = [];
    var data = {
      userId: this.loginData.userData
    }
    this.api.getSuperAdminCoin(data).then((res: any) => {
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
                coinPlacement:[this.coinData[i].coinPlacement],
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
    var data = {
      userId: this.loginData.userData
    }
    this.api
      .viewSuperAdminDevice(data)
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
                txPower:[this.deviceData[i].txPower,Validators.min(0)],
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
        console.log("error===", err);
      });
  }

  getGroups() {
    var data = {
      userId: this.loginData.userData
    }
    this.api.getGroup(data).then((res: any) => {
      console.log("group details response==", res);
      this.groupData = [];
      if (res.status) {
        this.groupData = res.success;
        const control = <FormArray>this.groupSettingForm.controls.items;
        control.controls = [];
        for (let i = 0; i < this.groupData.length; i++) {
          control.push(this.fb.group(
            {
              groupName: [this.groupData[i].groupName, Validators.pattern('^[a-zA-Z0-9\\s]+(?: [a-zA-Z0-9\\s]+)*$')],
              _id: [this.groupData[i]._id]
            }
          ));
        }
      }
      else { }
    })
  }

  submit(data) {
    if (this.meshForm.valid) {
      console.log("onSubmit mesh data==", data);
      this.api.updateMeshId(data).then((res: any) => {
        if (res.status) {
          console.log("res==", res);
          this.general.openSnackBar(res.success, '');
        }
      }).catch((err: any) => {
        console.log("err==", err);
      })
    }
  }

  onSubmitTimeDelay(value) {
    console.log("onSubmitTimeDelay data==", value);
    var data = {
      deviceId: value.deviceId,
      timeDelay: value.timeDelay,
      userId:this.loginData.userData

    }
    console.log("onSubmitTimeDelay data==", data);
    try {
      if (this.findSettingForm.valid) {
        this.api.timeDelay(data).then((res: any) => {
          console.log("timeDelay res===", res);
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

  onSubmitMaxFindForm(value) {
    console.log("onSubmitMaxFindForm data==", value);
    var data = {
      coinId: [value.coinId],
      maxFindAsset: value.maxFindAsset,
      userId:this.loginData.userData
    }
    console.log("onSubmitMaxFindForm data==", data);
    try {
      if (this.coinSettingForm.valid) {
        this.api.updateMaxFind(data).then((res: any) => {
          console.log("max find res===", res);
          if (res.status) {
            this.refreshDevice();
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

  onSubmitGroup(value) {
    console.log("onSubmitGroup data==", value);
    var data = {
      _id: value._id,
      groupName: value.groupName.trim().replace(/\s\s+/g, ' '),
      userId:this.loginData.userData

    }
    console.log("onSubmitZoneForm data==", data);

    try {
      if (this.groupSettingForm.valid) {
        this.api.updateGroupName(data).then((res: any) => {

          console.log("Group register res===", res);
          if (res.status) {
            this.getGroups();
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

  onSubmitGroupCoinForm(value) {
    value.groupName = this.groupData.filter(obj => obj._id == value.groupId)[0].groupName;
    value.coinId = this.general.filterIds(value.coinId);
    console.log("onSubmitGroupCoinForm data==", value)

    var data = {
      coinId: value.coinId,
      groupId: value.groupId,
      groupName: value.groupName,
      userId:this.loginData.userData
    }
    console.log("onSubmitGroupCoinForm data==", data);
    try {
      if (this.groupForm.valid) {
        this.api.updateGroup(data).then((res: any) => {
          console.log("Group coin res===", res);
          if (res.status) {
            this.refreshCoin();
            this.getGroups();
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

  onSubmitFindTxPower(data){
    data.deviceId = [data.deviceId];
    data.userId = this.loginData.userData;
    console.log("onSubmitFindTxPower data==", data);
    try {
      if (this.findSettingForm.valid) {
          this.api.updateDeviceTxPower(data).then((res: any) => {

            console.log("onSubmitFindTxPower res===", res);
            if (res.status) {
              this.findSettingForm.reset();
              this.refreshDevice();
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
  onSubmitCoinPlacement(data){
    data.coinId = [data.coinId];
    data.userId = this.loginData.userData;
    console.log("onSubmitCoinPlacement data==", data);
    try {
      if (this.coinSettingForm.valid) {
          this.api.updateCoinPlacement(data).then((res: any) => {
            console.log("onSubmitCoinPlacement res===", res);
            if (res.status) {
              this.coinSettingForm.reset();
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
      console.log("error==", error);
    }
  }

  deleteTimeDelay(value) {
    var data = {
      _id: value._id,
      userId:this.loginData.userData

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

  deleteMaxFindForm(data) {
    data.userId=this.loginData.userData;
    console.log("delete max find data==", data);
    this.api.deleteMaxFindAsset(data).then((res: any) => {
      if (res.status) {
        this.general.openSnackBar(res.success, '');
        this.refreshCoin();
      }
      this.general.openSnackBar(res.success == false ? res.message : res.success, '');
    })
  }

  deleteGroup(value) {
    var data = {
      _id: value._id,
      userId:this.loginData.userData
    }
    console.log("delete  group data==", data);
    this.api.deleteGroupDetails(data).then((res: any) => {
      if (res.status) {
        this.general.openSnackBar(res.success, '');
        this.refreshCoin();
        this.getGroups();
      }
      this.general.openSnackBar(res.success == false ? res.message : res.success, '');
    })
  }

  deleteGroupCoinForm(data) {
    data.coinId = this.general.filterIds(data.coinId);
    data.userId=this.loginData.userData;
    console.log("delete GroupCoinForm data==", data);
    this.api.deleteCoinGroupDetails(data).then((res: any) => {
      console.log("delte group coin==", res);
      if (res.status) {
        this.general.openSnackBar(res.success, '');
        this.refreshCoin();
        this.getGroups();
      }
      this.general.openSnackBar(res.success == false ? res.message : res.success, '');
    })
  }

  setCoin(data) {
    let arr1 = [];
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
    let arr = new FormArray([]);
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
        return obj.groupId != null;
      })
      console.log("data==", data);
      return data.reduce((group, obj) => {
        const name = obj.groupId._id
        if (!group[name]) {
          group[name] = [];
        }
        group[name].push(obj)
        return group;
      }, {})
    }
  }
  
  compareFn(o1, o2): boolean {
    return o1.coinId == o2.coinId;
  }
}
