import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginAuthService } from '../../services/login-auth.service';
import { ApiService } from '../../services/api.service';
import { GeneralService } from '../../services/general.service';

@Component({
  selector: 'app-edit-assets',
  templateUrl: './edit-assets.component.html',
  styleUrls: ['./edit-assets.component.css']
})
export class EditAssetsComponent implements OnInit {
  editFind: FormGroup;
  editGateway: FormGroup;
  editCoin: FormGroup;
  gateway: any;
  type: any;
  patchData: any;
  zoneData: any = [];
  loginData: any;
  constructor(
    public dialogRef: MatDialogRef<EditAssetsComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private fb: FormBuilder,
    private login: LoginAuthService,
    private api: ApiService,
    public general: GeneralService,

  ) {
    this.type = data.type;
    this.patchData = data.data;
    console.log("patch data===", this.patchData);
  }

  ngOnInit(): void {
    this.loginData = this.login.getLoginDetails();
    this.editFind = this.fb.group({
      deviceName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9\\s]+(?: [a-zA-Z0-9\\s]+)*$')]],
      deviceId: [{ value: '', disabled: true }],
    })
    this.editGateway = this.fb.group({
      gatewayName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9\\s]+(?: [a-zA-Z0-9\\s]+)*$')]],
      gatewayId: [{ value: '', disabled: true }],
      gatewayType:[{ value: '', disabled: true }]
    })
    this.editCoin = this.fb.group({
      coinName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_]+(?: [a-zA-Z0-9_]+)*$')]],
      coinId: [{ value: '', disabled: true }, [Validators.min(1), Validators.max(255)]],
      gatewayId: ['', Validators.required],
      zoneId: ['', Validators.required]
    })

    this.patchValue();
    this.refreshGateway();
    this.getZoneDetails();

  }

  patchValue() {
    if (this.type == 'find') {
      this.editFind.patchValue({
        deviceName: this.patchData.deviceName,
        deviceId: this.patchData.deviceId
      });
    }
    else if (this.type == 'gateway') {
      this.editGateway.patchValue({
        gatewayName: this.patchData.gatewayName,
        gatewayId: this.patchData.gatewayId,
        gatewayType:this.patchData.gatewayType
      });
    }
    else {
      this.editCoin.patchValue({
        coinId: this.patchData.coinId,
        coinName: this.patchData.coinName,
        gatewayId: this.patchData.gatewayId,
        zoneId: this.patchData.zoneId
      });
    }
  }

  updateFind(data) {
    data.deviceId = this.patchData.deviceId;
    data.deviceObjectId = this.patchData.id;
    console.log("edit device==", data);
    try {
      if (this.editFind.valid) {
        this.api.editDevice(data).then((res: any) => {
          console.log("find submit====", res);
          if (res.status) {
            if (res.success == 'Device updated successfully') {
              this.editFind.reset();
              this.dialogRef.close();
            }
            this.general.deviceChanges.next(true);
            this.general.openSnackBar(res.success, '');
          }
          else {
            this.general.deviceChanges.next(false);
            this.general.openSnackBar(res.success == false ? res.message : res.success, '');
          }
        }).catch((err: any) => {
          console.log("error===", err);
        })
      }
    }
    catch (err) {
      console.log("error===", err);
    }
  }

  updateGateway(data) {
    data.gatewayObjectId = this.patchData.id;
    data.userId = this.patchData.userId;
    console.log("gateway ==", data);
    try {
      if (this.editGateway.valid) {
        data.gatewayName = data.gatewayName.trim().replace(/\s\s+/g, ' ');
        this.api.editGateway(data).then((res: any) => {

          console.log("gateway submit====", res);
          if (res.status) {
            if (res.success == 'Gateway updated successfully') {
              this.dialogRef.close();
              this.editGateway.reset();
            }
            this.general.deviceChanges.next(true);
            this.general.openSnackBar(res.success, '');
          }
          else {
            this.general.deviceChanges.next(false);
            this.general.openSnackBar(res.success == false ? res.message : res.success, '');
          }
        }).catch((err: any) => {
          console.log("error===", err);
        })
      }
    }
    catch (err) {
      console.log("error===", err);
    }
  }

  updateCoin(data) {
    data.coinObjectId = this.patchData.id;
    data.userId = this.patchData.userId;
    data.zoneId = this.loginData.enableZone ? data.zoneId : "";
    console.log("coin submit====", data);
    try {
      if (this.editCoin.valid) {
        data.coinName = data.coinName.trim().replace(/\s\s+/g, ' ');
        this.api.editCoin(data).then((res: any) => {
          console.log("coin submit====", res);
          if (res.status) {
            if (res.success == 'Coin updated successfully') {
              this.editCoin.reset();
              this.dialogRef.close();
            }
            this.general.deviceChanges.next(true);
            this.general.openSnackBar(res.success, '');
          }
          else {
            this.general.deviceChanges.next(false);
            this.general.openSnackBar(res.success == false ? res.message : res.success, '');
          }
        }).catch((err: any) => {
          console.log("error===", err);
        })
      }
    }
    catch (err) {
      console.log("error===", err);
    }
  }

  refreshGateway() {
    var data = '';
    this.api.getGatewayData(data).then((res: any) => {
      console.log("coin submit====", res);
      this.gateway = [];
      if (res.status) {
        this.gateway = res.success;
      }
    }).catch((err: any) => {
      console.log("error===", err);
    })
  }

  getZoneDetails() {
    this.api.getZone().then((res: any) => {
      console.log("zone details response==", res);
      this.zoneData = [];
      if (res.status) {
        this.zoneData = res.success;
      }
      else {
        this.zoneData = [];
      }
    })
  }
}
