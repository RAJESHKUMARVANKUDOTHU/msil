import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterialModule } from './material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { LoginComponent } from './login/login/login.component';
import { SetPasswordComponent } from './login/set-password/set-password.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticationInterceptor } from './authentication.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuard } from './auth.guard';
import { BnNgIdleService } from 'bn-ng-idle';
import { ManageAssetComponent } from './assets/manage-asset/manage-asset.component';
import { GeofenceComponent } from './geofence/geofence.component';
import { ReportComponent } from './report/report/report.component';
import { ManageDeviceComponent } from './assets/manage-device/manage-device.component';
import { ManageGatewayComponent } from './assets/manage-gateway/manage-gateway.component';
import { ManageCoinComponent } from './assets/manage-coin/manage-coin.component';
import { ActiveDeviceComponent } from './assets/active-device/active-device.component';
import { OfflineDeviceComponent } from './assets/offline-device/offline-device.component';
import { ChartsModule } from 'ng2-charts';
import { AddAssetsComponent } from './assets/add-assets/add-assets.component';
import { EditAssetsComponent } from './assets/edit-assets/edit-assets.component';
import { SettingComponent } from './setting/setting/setting.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import {NgxIntlTelInputModule} from 'ngx-intl-tel-input';
import { SettingInfoComponent } from './setting/setting-info/setting-info.component';
import { GeofenceDashboardComponent } from './geofence-dashboard/geofence-dashboard.component';
import { ProfileComponent } from './createProfile/profile/profile.component';
import { MapActionsComponent } from './map-actions/map-actions.component';
import { ZoneConfigurationComponent } from './zone-configuration/zone-configuration.component';
import { EditProfileComponent } from './createProfile/edit-profile/edit-profile.component';
import { VehicleStatusComponent } from './vehicle-status/vehicle-status.component';
import { ZoneDashboardComponent } from './zone-dashboard/zone-dashboard.component';
import { AdminSettingsComponent } from './admin/admin-settings/admin-settings.component';
import { LocationReportComponent } from './report/location-report/location-report.component';
import { ZoneReportComponent } from './report/zone-report/zone-report.component';
import { VehiclewisereportComponent } from './report/vehiclewisereport/vehiclewisereport.component';
import { EditSettingShiftComponent } from './admin/edit-setting-shift/edit-setting-shift.component';
import { CongestionComponent } from './congestion/congestion.component';
import {NgxLeafletFullscreenModule} from '@runette/ngx-leaflet-fullscreen';
import { AdminSettingInfoComponent } from './admin/admin-setting-info/admin-setting-info.component';
import { HeatMapComponent } from './heat-map/heat-map.component';
import { VehicleTrackComponent } from './vehicle-track/vehicle-track.component';
import { GroupingComponent } from './grouping/grouping.component';
import { VehicleStatusTrackComponent } from './vehicle-status-track/vehicle-status-track.component';
@NgModule({
  declarations: [
    AppComponent,
    AdminLoginComponent,
    LoginComponent,
    DashboardComponent,
    AdminDashboardComponent,
    ManageAssetComponent,
    GeofenceComponent,
    ReportComponent,
    ManageDeviceComponent,
    ManageGatewayComponent,
    ManageCoinComponent,
    ActiveDeviceComponent,
    OfflineDeviceComponent,
    AddAssetsComponent,
    EditAssetsComponent,
    SettingComponent,
    SettingInfoComponent,
    GeofenceDashboardComponent,
    ProfileComponent,
    MapActionsComponent,
    ZoneConfigurationComponent,
    EditProfileComponent,
    VehicleStatusComponent,
    ZoneDashboardComponent,
    SetPasswordComponent,
    AdminSettingsComponent,
    LocationReportComponent,
    ZoneReportComponent,
    VehiclewisereportComponent,
    EditSettingShiftComponent,
    CongestionComponent,
    AdminSettingInfoComponent,
    HeatMapComponent,
    VehicleTrackComponent,
    GroupingComponent,
    VehicleStatusTrackComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ChartsModule,
    NgxIntlTelInputModule,
    NgxLeafletFullscreenModule,
    NgCircleProgressModule.forRoot({}),

  ],
  providers: [
    AuthGuard,BnNgIdleService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor,multi:true},
  ],
    bootstrap: [AppComponent]
})
export class AppModule { }
