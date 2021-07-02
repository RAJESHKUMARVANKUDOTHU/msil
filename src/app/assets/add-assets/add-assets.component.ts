import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginAuthService } from '../../services/login-auth.service';
import { ApiService } from '../../services/api.service';
import { GeneralService } from '../../services/general.service';

@Component({
  selector: 'app-add-assets',
  templateUrl: './add-assets.component.html',
  styleUrls: ['./add-assets.component.css']
})
export class AddAssetsComponent implements OnInit {
  addFind: FormGroup;
  addGateway: FormGroup;
  addCoin: FormGroup;
  assignAsset: FormGroup;
  deassignAsset: FormGroup;
  gateway: any;
  type: any;
  loginData: any;
  zoneData: any = [];
  constructor(
    public dialogRef: MatDialogRef<AddAssetsComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private fb: FormBuilder,
    public general: GeneralService,
    private login: LoginAuthService,
    private api: ApiService,

  ) {
    this.type = data.type;
  }

  ngOnInit(): void {
    this.loginData = this.login.getLoginDetails();
    this.addFind = this.fb.group({
      deviceName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9\\s]+(?: [a-zA-Z0-9\\s]+)*$')]],
      deviceId: ['', [Validators.required, Validators.min(1), Validators.max(65535)]]
    });
    this.addGateway = this.fb.group({
      gatewayName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9\\s]+(?: [a-zA-Z0-9\\s]+)*$')]],
      gatewayId: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(12), Validators.pattern('^[a-zA-z0-9]{12}$')]],
      gatewayType: ['',Validators.required]
    })
    this.addCoin = this.fb.group({
      coinName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9\\s]+(?: [a-zA-Z0-9\\s]+)*$')]],
      coinId: ['', [Validators.required, Validators.min(1), Validators.max(65535)]],
      gatewayId: ['', Validators.required],
      zoneId: ['']
    })

    this.refreshGateway();
    this.getZoneDetails();
  }

  findSubmit(data) {
    var value = {
      deviceId: data.deviceId,
      deviceName: data.deviceName
    }
    try {
      if (this.addFind.valid) {
        console.log("data====", data);
        this.api.deviceRegistration(value).then((res: any) => {
          console.log("find submit====", res);
          if (res.status) {
            if (res.success == "Device registered successfully") {
              this.addFind.reset();
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
      console.log('error==', err);
    }
  }

  gatewaySubmit(data) {
    try {
      if (this.addGateway.valid) {
        data.gatewayName = data.gatewayName.trim().replace(/\s\s+/g, ' ');
        this.api.gatewayRegistration(data).then((res: any) => {
          console.log("gateway submit====", res);
          if (res.status) {
            if (res.success == "Gateway registered successfully") {
              this.addGateway.reset();
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
      console.log("error==", err);
    }
  }

  coinSubmit(data) {
    console.log("coin data==", data);
    data.zoneId = data.zoneId ? data.zoneId : null;
    try {
      if (this.addCoin.valid) {
        data.coinName = data.coinName.trim().replace(/\s\s+/g, ' ');
        this.api.coinRegistration(data).then((res: any) => {
          console.log("coin submit====", res);
          if (res.status) {
            if (res.success == "Coin registered successfully") {
              this.addCoin.reset();
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
      console.log("error==", err);

    }
  }

  refreshGateway() {
    var data = '';
    this.api.getGatewayData(data).then((res: any) => {
      console.log("gatway submit====", res);
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
