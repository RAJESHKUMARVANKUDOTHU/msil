import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';
import { AdminLoginComponent } from './admin/admin-login/admin-login.component';
import { LoginComponent } from './login/login/login.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { ManageAssetComponent } from './assets/manage-asset/manage-asset.component';
import { GeofenceComponent } from './geofence/geofence.component';
import { ReportComponent } from './report/report/report.component';
import { ManageDeviceComponent } from './assets/manage-device/manage-device.component';
import { ManageGatewayComponent } from './assets/manage-gateway/manage-gateway.component';
import { ManageCoinComponent } from './assets/manage-coin/manage-coin.component';
import { ActiveDeviceComponent } from './assets/active-device/active-device.component';
import { OfflineDeviceComponent } from './assets/offline-device/offline-device.component';
import { SettingComponent } from './setting/setting/setting.component';
import { GeofenceDashboardComponent } from './geofence-dashboard/geofence-dashboard.component';
import { ProfileComponent } from './createProfile/profile/profile.component';
import { MapActionsComponent } from './map-actions/map-actions.component';
import { ZoneConfigurationComponent } from './zone-configuration/zone-configuration.component';
import { VehicleStatusComponent } from './vehicle-status/vehicle-status.component';
import { ZoneDashboardComponent } from './zone-dashboard/zone-dashboard.component';
import { SetPasswordComponent } from './login/set-password/set-password.component';
import { AdminSettingsComponent } from './admin/admin-settings/admin-settings.component';
import { CongestionComponent } from './congestion/congestion.component';
import { HeatMapComponent } from './heat-map/heat-map.component'
import { VehicleTrackComponent } from './vehicle-track/vehicle-track.component';
import { VehicleStatusTrackComponent } from './vehicle-status-track/vehicle-status-track.component';

const routes: Routes = [
  // {path : '', component:LoginComponent},
  {path:'login' , component:LoginComponent},
  { path: 'set-password', component:SetPasswordComponent},
  { path: '', component:DashboardComponent, canActivate: [AuthGuard], data:{role:['adminRole','userRole', 'coAdminRole', 'subAdminRole']}},
  { path: 'dashboard', component:DashboardComponent, canActivate: [AuthGuard], data:{role:['adminRole','userRole', 'coAdminRole', 'subAdminRole']}},
  { path: 'manage-asset', component:ManageAssetComponent, canActivate: [AuthGuard], data:{role:['adminRole','userRole', 'coAdminRole', 'subAdminRole']}},
  { path: 'geofence', component:GeofenceComponent, canActivate: [AuthGuard], data:{role:['adminRole','userRole', 'coAdminRole', 'subAdminRole']}},
  { path: 'report', component:ReportComponent, canActivate: [AuthGuard], data:{role:['adminRole','userRole', 'coAdminRole', 'subAdminRole']}},
  { path: 'setting', component:SettingComponent, canActivate: [AuthGuard], data:{role:['adminRole','userRole', 'coAdminRole', 'subAdminRole']}},
  { path: 'manage-device', component:ManageDeviceComponent, canActivate: [AuthGuard], data:{role:['adminRole','userRole', 'coAdminRole', 'subAdminRole']}},
  { path: 'manage-gateway', component:ManageGatewayComponent, canActivate: [AuthGuard], data:{role:['adminRole','userRole', 'coAdminRole', 'subAdminRole']}},
  { path: 'manage-coin', component:ManageCoinComponent, canActivate: [AuthGuard], data:{role:['adminRole','userRole', 'coAdminRole', 'subAdminRole']}},
  { path: 'active-device', component:ActiveDeviceComponent, canActivate: [AuthGuard], data:{role:['adminRole','userRole', 'coAdminRole', 'subAdminRole']}},
  { path: 'offline-device', component:OfflineDeviceComponent, canActivate: [AuthGuard], data:{role:['adminRole','userRole', 'coAdminRole', 'subAdminRole']}},
  { path: 'geofence-dashboard', component:GeofenceDashboardComponent, canActivate: [AuthGuard], data:{role:['adminRole','userRole', 'coAdminRole', 'subAdminRole']}},
  { path: 'profile', component:ProfileComponent, canActivate: [AuthGuard], data:{role:['adminRole','userRole', 'coAdminRole', 'subAdminRole']}},
  { path: 'map-actions', component:MapActionsComponent, canActivate: [AuthGuard], data:{role:['adminRole','userRole', 'coAdminRole', 'subAdminRole']}},
  { path: 'zone-configuration', component:ZoneConfigurationComponent, canActivate: [AuthGuard], data:{role:['adminRole','userRole', 'coAdminRole', 'subAdminRole']}},
  { path: 'vehicle-status', component:VehicleStatusComponent, canActivate: [AuthGuard], data:{role:['adminRole','userRole', 'coAdminRole', 'subAdminRole']}},
  { path: 'vehicle-status-track', component:VehicleStatusTrackComponent},
  { path: 'zone-dashboard', component:ZoneDashboardComponent, canActivate: [AuthGuard], data:{role:['adminRole','userRole', 'coAdminRole', 'subAdminRole']}},
  { path: 'congestion', component:CongestionComponent, canActivate: [AuthGuard], data:{role:['adminRole','userRole', 'coAdminRole', 'subAdminRole']}},
  { path: 'heat-map', component:HeatMapComponent, canActivate: [AuthGuard], data:{role:['adminRole','userRole', 'coAdminRole', 'subAdminRole']}},
  { path: 'vehicle-track', component:VehicleTrackComponent, canActivate: [AuthGuard], data:{role:['adminRole','userRole', 'coAdminRole', 'subAdminRole']}},

  {path:'admin-login' , component:AdminLoginComponent},
  {path:'admin-dashboard' , component:AdminDashboardComponent, canActivate: [AuthGuard], data:{role:['superAdminRole']}},
  {path:'admin-settings' , component:AdminSettingsComponent, canActivate: [AuthGuard], data:{role:['superAdminRole']}},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
