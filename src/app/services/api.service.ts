import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  host: string = environment.apiHost;
  constructor(private http: HttpClient) { }

  // user/subuser login
  login(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/loginUser';
    // let body = {
    //   data: data,
    // };
    return new Promise((resolve, reject) => {
      this.http.post(url, data, httpOptions).subscribe(
        (res:any) => {
          resolve(res);
        },
        (err) => {
          // console.log('err==', err);
          reject(err);
        }
      );
    });
  }
  verifyTwoStepOtp(data){
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/verify2StepOtp';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, data, httpOptions).subscribe(
        (res: any) => {

          resolve(res);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  forgetPassword(data){
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/forgetPassword';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, data, httpOptions).subscribe(
        (res: any) => {

          resolve(res);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  forgetPasswordVerify(data){
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/forgetPasswordVerify';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, data, httpOptions).subscribe(
        (res: any) => {

          resolve(res);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }
  createSubUsers(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/registerSubUsers';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {

          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  viewUsers() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/getAllUsers';
    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe(
        (res: any) => {

          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  deleteSubuser(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/updateSubuserStatus';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          // console.log('get', res);
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  updateSubUser(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/updateSubuserEmail';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          // console.log('get', res);
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }
  // -------------superadmin login--------------------------
  adminLogin(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/loginSuperAdmin';
    return new Promise((resolve, reject) => {
      this.http.post(url, data, httpOptions).subscribe(
        (res: any) => {
          resolve(res);
        },
        (err) => {
          // console.log('err==', err);
          reject(err);
        }
      );
    });
  }
// ----------------superadmin settings------------------------
getUserSettings(data){
  const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  let url = this.host + '/getUserSettings/'+data;
  return new Promise((resolve, reject) => {
    this.http.get(url).subscribe(
      (res: any) => {
        resolve(res.data);
      },
      (err) => {
        reject(err);
      }
    );
  });
}


updateOnlineStatus(data){
  const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  let url = this.host + '/updateOnlineStatus';
  let body = {
    data: data,
  };
  return new Promise((resolve, reject) => {
    this.http.post(url, body, httpOptions).subscribe(
      (res: any) => {
        resolve(res.data);
      },
      (err) => {
        reject(err);
      }
    );
  });
}

updateOfflineStatus(data){
  const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  let url = this.host + '/updateOfflineStatus';
  let body = {
    data: data,
  };
  return new Promise((resolve, reject) => {
    this.http.post(url, body, httpOptions).subscribe(
      (res: any) => {
        resolve(res.data);
      },
      (err) => {
        reject(err);
      }
    );
  });
}

updateRssi(data){
  const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  let url = this.host + '/updateRssi';
  let body = {
    data: data,
  };
  return new Promise((resolve, reject) => {
    this.http.post(url, body, httpOptions).subscribe(
      (res: any) => {
        resolve(res.data);
      },
      (err) => {
        reject(err);
      }
    );
  });
}

updateTxPower(data){
  const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  let url = this.host + '/updateTxPower';
  let body = {
    data: data,
  };
  return new Promise((resolve, reject) => {
    this.http.post(url, body, httpOptions).subscribe(
      (res: any) => {
        resolve(res.data);
      },
      (err) => {
        reject(err);
      }
    );
  });
}

createdDeviceShift(data){
  const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  let url = this.host + '/createdDeviceShift';
  let body = {
    data: data,
  };
  return new Promise((resolve, reject) => {
    this.http.post(url, body, httpOptions).subscribe(
      (res: any) => {
        resolve(res.data);
      },
      (err) => {
        reject(err);
      }
    );
  });
}
getUserShiftSuperAdmin(data){
  const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  let url = this.host + '/getUserShiftSuperAdmin';
  let body = {
    data: data,
  };
  return new Promise((resolve, reject) => {
    this.http.post(url, body, httpOptions).subscribe(
      (res: any) => {
        resolve(res.data);
      },
      (err) => {
        reject(err);
      }
    );
  });
}
updateUserShiftSuperAdmin(data){
  const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  let url = this.host + '/updateUserShiftSuperAdmin';
  let body = {
    data: data,
  };
  return new Promise((resolve, reject) => {
    this.http.post(url, body, httpOptions).subscribe(
      (res: any) => {
        resolve(res.data);
      },
      (err) => {
        reject(err);
      }
    );
  });
}
deleteUserShiftSuperAdmin(data){
  const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  let url = this.host + '/deleteUserShiftSuperAdmin';
  let body = {
    data: data,
  };
  return new Promise((resolve, reject) => {
    this.http.post(url, body, httpOptions).subscribe(
      (res: any) => {
        resolve(res.data);
      },
      (err) => {
        reject(err);
      }
    );
  });
}

updateMergingTime(data){
  const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  let url = this.host + '/updateMergingTime';
  let body = {
    data: data,
  };
  return new Promise((resolve, reject) => {
    this.http.post(url, body, httpOptions).subscribe(
      (res: any) => {
        resolve(res.data);
      },
      (err) => {
        reject(err);
      }
    );
  });
}
updateDeletionTime(data){
  const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  let url = this.host + '/updateDeletionTime'
  let body = {
    data: data,
  };
  return new Promise((resolve, reject) => {
    this.http.post(url, body, httpOptions).subscribe(
      (res: any) => {
        resolve(res.data);
      },
      (err) => {
        reject(err);
      }
    );
  });
}
updateMeshId(data){
  const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  let url = this.host + '/updateMeshId'
  let body = {
    data: data,
  };
  return new Promise((resolve, reject) => {
    this.http.post(url, body, httpOptions).subscribe(
      (res: any) => {
        resolve(res.data);
      },
      (err) => {
        reject(err);
      }
    );
  });
}
getSuperAdminGatewayData(data){
  const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  let url = this.host + '/viewGatewaySuperAdmin'
  let body = {
    data: data,
  };
  return new Promise((resolve, reject) => {
    this.http.post(url, body, httpOptions).subscribe(
      (res: any) => {
        resolve(res.data);
      },
      (err) => {
        reject(err);
      }
    );
  });
}

getMeshData(data){
  const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  let url = this.host + '/getMeshData'
  let body = {
    data: data,
  };
  return new Promise((resolve, reject) => {
    this.http.post(url, body, httpOptions).subscribe(
      (res: any) => {
        resolve(res.data);
      },
      (err) => {
        reject(err);
      }
    );
  });
}

updateInOutMergeTime(data){
  const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  let url = this.host + '/updateInOutMergeTime'
  let body = {
    data: data,
  };
  return new Promise((resolve, reject) => {
    this.http.post(url, body, httpOptions).subscribe(
      (res: any) => {
        resolve(res.data);
      },
      (err) => {
        reject(err);
      }
    );
  });
}
// ---------------------end----------------------------
  createUsers(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/registerAdmin';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  viewAdmins() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/getAllAdmins';
    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  deleteUser(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/editIsDeletedUser';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }
  // ------------------------------------end-----------------------------------------------------

  //------------------------- device,gateway and coin registartion------------------------------------
  deviceRegistration(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/deviceRegister';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }
  gatewayRegistration(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/gatewayRegister';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }
  coinRegistration(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/coinRegistration';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  // ----------------------------registration ends--------------------------------------------

  //---------------------get data list of device,gateway,coin-------------------------------
  getDeviceData(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/viewDevice';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }
  getGatewayData(data) {
    // console.log('gateway res check');

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/viewGateway';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }
  getCoinData(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/viewCoin';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }
  // ----------------------------------end-------------------------------------
  //  -----------------------edit device,gateway,coin--------------------------
  editDevice(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/editDevice';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }
  editGateway(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/editGateway';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }
  editCoin(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/editCoin';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  // ----------------------------------end--------------------------------------------

  //  -----------------------delete device,gateway,coin--------------------------

  deleteDevice(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/deleteDevice';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }
  deleteGateway(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/deleteGateway';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }
  deleteCoin(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/deleteCoin';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  // ----------------------------------end--------------------------------------------

  // -----------------------registered device ,gateway,coin count----------------------------
  allDeviceCount() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/getDevicesCount';
    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  deviceOnOff(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/deviceToggleStatus';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  // ----------------------------assign/deassign asset--------------------------
  assignAsset(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/assignAsset';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }
  deassignAsset(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/deAssignAsset';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  assignAssetList() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/getAssignAsset';
    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }
  deassignAssetList() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/getDeAssignAsset';
    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }
  // ------------------------------------end------------------------------------

  // -----------------------------------------------------------------------------------------
  // get Active data of device gateway and coin respectively
  getOnlineDevice(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/getOnlineDevice';
    let body = {
      data: data,
    };
    
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }
  getOfflineDevice(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/getOfflineDevice';
    let body = {
      data: data,
    };
    
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  // ----------------------------------------end---------------------------------------------------------

  // -------------------------------Settings page api-------------------------------

  // dateTimeFormat(data){
  //     const httpOptions = {
  //       headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  //     };

  //     let url = this.host+'/dateTimeFormatUpdate';
  //     return new Promise((resolve,reject)=>{
  //       this.http.post(url,data,httpOptions).subscribe(res=>{
  //         resolve(res);
  //       })
  //     })

  // }

  // --------------geofence setting--------------------
  geofenceSetting(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/geoFenceSetting';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  getGeofenceSetting(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body={
      data:data
    }
    let url = this.host + '/getGeoFenceSetting';
    return new Promise((resolve, reject) => {
      this.http.post(url,body,httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }
  deleteGoefenceSetting(data){
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body={
      data:data
    }
    let url = this.host + '/deleteGeoFenceCoins';
    return new Promise((resolve, reject) => {
      this.http.post(url,body,httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }
  getDeviceGeofence(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = {
      data: data,
    };
    let url = this.host + '/viewUserLocationDevice';
    return new Promise((resolve, reject) => {
      this.http.post(url,body,httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }
  getGroupingData(data){
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    let body = {
      data: data,
    };
    let url = this.host + '/getGroupingData';
    return new Promise((resolve, reject) => {
      this.http.post(url,body,httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }
  // ---------------end----------------------------

  /* ------------- Setting ----------------------- */
  setRange(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/rangeSetting';
    let body = {
      data: data,
    };
    // console.log("range data==", body)
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          // console.log("range res==", res)
          resolve(res.data);
        },
        (err) => {
          // console.log("range err==", err)
          reject(err);
        }
      );
    });
  }

  timeDelay(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/timeDelay';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  deleteTimeDelay(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/deleteTimeDelay';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  zoneSetting(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/zoneRegister';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  deleteZoneName(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/deleteZoneDetails';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          console.log("res.data", res.data)
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }
  deleteMaxFindAsset(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/deleteMaxFindAsset';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          console.log("res.data", res.data)
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }


  getZone() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/getZonesDetails';
    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }


  getZoneVehicleData() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/getZoneVehicleData';
    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  deviceInactivity(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/updateDeviceInactivityTime';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  deleteFindInactivity(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/deleteDeviceInactivityTime';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  coinInactivity(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/updateCoinInActivityTime';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }
  deleteCoinInactivity(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/deleteCoinInActivityTime';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }
  zoneConfiguration(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/updateCoinZone';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  groupRegister(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/groupRegister';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }
  updateGroupName(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/updateGroupName';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  deleteGroupDetails(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/deleteGroupDetails';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  getGroup() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/getAllGroupDetails';
    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  updateGroup(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/updateGroupDetails';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  updateMaxFind(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/updateMaxFindAsset';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }
  updateZoneDetails(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/updateZoneDetails';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }
  updateZoneInfo(data){
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/updateZoneInfo';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  createServiceType(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/updateZoneIdServices';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  getServiceType() {

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/getServiceDetails';
    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  updateServiceId(data) {

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/updateServiceId';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }
  deleteServices(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/deleteServiceId';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          console.log(res.data)
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  deleteCoinGroupDetails(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/deleteCoinGroupDetails';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          console.log(res.data)
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }
  deleteCoinZone(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/deleteCoinZone';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          console.log(res.data)
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  twoStepAuth(data){
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/setTwoStepAuth';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          console.log(res.data)
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  uploadLogo(data){
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    let body = {
      data: data,
    };
    let url = this.host+'/uploadLogo';
    return new Promise((resolve,reject)=>{
      this.http.post(url,body,httpOptions).subscribe(res=>{
        resolve(res);
      })
    });
  }
  getLogoImage(){
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/getLogoImage';
    return new Promise((resolve, reject) => {
      this.http.get(url, { responseType: 'blob' }).subscribe(
        (res: any) => {
          // console.log(res)
          // observer.next(res);
          const reader = new FileReader();
          reader.readAsDataURL(res);
          reader.onloadend = function () {

            resolve(reader.result);
          };
        },
        (err) => {
          // console.log(err);
          reject(err)
        }
      );
    });
  }
  refreshSettings() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/getSettings';
    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  // ----------------------map center API's----------------------------------

  createLayout(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/createLayout';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  getLayouts() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/getLayouts';
    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  getLayoutImage(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/getLayoutImage/' + data;
    return new Promise((resolve, reject) => {
      this.http.get(url, { responseType: 'blob' }).subscribe(
        (res: any) => {
          const reader = new FileReader();
          reader.readAsDataURL(res);
          reader.onloadend = function () {

            resolve(reader.result);
          };
        },
        (err) => {
          reject(err)
        }
      );
    });
  }

  updateLatLng(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/updateLatLng';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  updateZoneBound(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/updateZoneBounds';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  deleteZoneBound(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/deleteZoneBounds';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  deleteCoinBound(data){
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/updateCoinBounds';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }
  
  deleteLayout(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/deleteLayoutInfo';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  getZoneDashBoard(data) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/getZoneDashBoard';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }
  getVehicleStatus(data){
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/getVehicleStatus';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }
  getVehicleServiceCount(data){
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/getVehicleServiceCount';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  getdeviceLatLngPerDay(data){
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/getdeviceLatLngPerDay';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }
// -----------------report page APIs--------------------
genericReport(data){
  const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  let url = this.host + '/getGenericReport';
  let body = {
    data: data,
  };
  return new Promise((resolve, reject) => {
    this.http.post(url, body, httpOptions).subscribe(
      (res: any) => {
        resolve(res.data);
      },
      (err) => {
        reject(err);
      }
    );
  });
}
vehicleNameReport(data){
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/getDeviceNameReport';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
}
deviceIdReport(data){
      const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/getDeviceIdReport';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
}
getLocationReport(data){
      const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/getLocationReport';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
}
getZoneWiseReport(data){
      const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    let url = this.host + '/getZoneIdReport';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
}

getvehicleServicedReport(data){
  const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  let url = this.host + '/getVehicleReport';
  let body = {
    data: data,
  };
  return new Promise((resolve, reject) => {
    this.http.post(url, body, httpOptions).subscribe(
      (res: any) => {
        resolve(res.data);
      },
      (err) => {
        reject(err);
      }
    );
  });
}
getAverageTimeOfBays(data){
  const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  let url = this.host + '/getAverageTimeOfBays';
  let body = {
    data: data,
  };
  return new Promise((resolve, reject) => {
    this.http.post(url, body, httpOptions).subscribe(
      (res: any) => {
        resolve(res.data);
      },
      (err) => {
        reject(err);
      }
    );
  });
}
getZonePerformance(data){
  const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  let url = this.host + '/zonePerformance';
  let body = {
    data: data,
  };
  return new Promise((resolve, reject) => {
    this.http.post(url, body, httpOptions).subscribe(
      (res: any) => {
        resolve(res.data);
      },
      (err) => {
        reject(err);
      }
    );
  });
}
zoneWisePerformancePerDay(data){
  const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  let url = this.host + '/zoneWisePerformancePerDay';
  let body = {
    data: data,
  };
  return new Promise((resolve, reject) => {
    this.http.post(url, body, httpOptions).subscribe(
      (res: any) => {
        resolve(res.data);
      },
      (err) => {
        reject(err);
      }
    );
  });
}

getVehicleZoneWiseReport(data){
  const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  let url = this.host + '/getVehicleZoneWiseReport';
  let body = {
    data: data,
  };
  return new Promise((resolve, reject) => {
    this.http.post(url, body, httpOptions).subscribe(
      (res: any) => {
        resolve(res.data);
      },
      (err) => {
        reject(err);
      }
    );
  });
}

zoneWiseEfficiency(data){
  const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  let url = this.host + '/zoneWiseEfficiency';
  let body = {
    data: data,
  };
  return new Promise((resolve, reject) => {
    this.http.post(url, body, httpOptions).subscribe(
      (res: any) => {
        resolve(res.data);
      },
      (err) => {
        reject(err);
      }
    );
  });
}

getJcSummaryData(data){
  const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  let url = this.host + '/getJcSummaryData';
  let body = {
    data: data,
  };
  return new Promise((resolve, reject) => {
    this.http.post(url, body, httpOptions).subscribe(
      (res: any) => {
        resolve(res.data);
      },
      (err) => {
        reject(err);
      }
    );
  });
}

getZoneWiseEfficiencyByDay(data){
  const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  let url = this.host + '/getZoneWisePerformanceByDelay';
  let body = {
    data: data,
  };
  return new Promise((resolve, reject) => {
    this.http.post(url, body, httpOptions).subscribe(
      (res: any) => {
        resolve(res.data);
      },
      (err) => {
        reject(err);
      }
    );
  });
}
  // ----------------report download-------------------------------

  downloadGenericReport(data,fileName){
    // this.general.loadingFreez.next({status:true})
    let body = {
      data: data,
    };
    let url = this.host + '/downloadGenericReport';
    return new Promise((resolve, reject) => {
      this.http.post(url,body,{ observe: 'response', responseType: 'blob' as 'json' }).subscribe(res => {
        if (res.status == 200)
          this.downloadFile(res, fileName)

        resolve(true);
      },
        err => {
          console.log("err==", err)
        })
    });
  }
  downloadvehicleNameReport(data,fileName){
    // this.general.loadingFreez.next({status:true})
    let body = {
      data: data,
    };
    let url = this.host + '/downloadDeviceNameReport';
    return new Promise((resolve, reject) => {
      this.http.post(url,body,{ observe: 'response', responseType: 'blob' as 'json' }).subscribe(res => {
        if (res.status == 200)
          this.downloadFile(res, fileName)

        resolve(true);
      },
        err => {
          // console.log("err==", err)
        })
    });
  }
  downloadDeviceIdReport(data,fileName){
    // this.general.loadingFreez.next({status:true})
    let body = {
      data: data,
    };
    let url = this.host + '/downloadDeviceIdReport';
    return new Promise((resolve, reject) => {
      this.http.post(url,body,{ observe: 'response', responseType: 'blob' as 'json' }).subscribe(res => {
        if (res.status == 200)
          this.downloadFile(res, fileName)

        resolve(true);
      },
        err => {
          // console.log("err==", err)
        })
    });
  }
  downloadLocationReport(data,fileName){
    let body = {
      data: data,
    };
    let url = this.host + '/downloadLocationReport';
    return new Promise((resolve, reject) => {
      this.http.post(url,body,{ observe: 'response', responseType: 'blob' as 'json' }).subscribe(res => {
        if (res.status == 200)
          this.downloadFile(res, fileName)

        resolve(true);
      },
        err => {
          // console.log("err==", err)
        })
    });
  }

  downloadzoneWiseReport(data,fileName){
    let body = {
      data: data,
    };
    let url = this.host + '/downloadZoneIdReport';
    return new Promise((resolve, reject) => {
      this.http.post(url,body,{ observe: 'response', responseType: 'blob' as 'json' }).subscribe(res => {
        if (res.status == 200)
          this.downloadFile(res, fileName)

        resolve(true);
      },
        err => {
          // console.log("err==", err)
        })
    });
  }

  downloadVehicleZoneWiseReport(data,fileName){
    let body = {
      data: data,
    };
    let url = this.host + '/downloadVehicleZoneWiseReport';
    return new Promise((resolve, reject) => {
      this.http.post(url,body,{ observe: 'response', responseType: 'blob' as 'json' }).subscribe(res => {
        if (res.status == 200)
          this.downloadFile(res, fileName)

        resolve(true);
      },
        err => {
          // console.log("err==", err)
        })
    });
  }
  downloadAverageTimeOfBays(data,fileName){
    let body = {
      data: data,
    };
    let url = this.host + '/getAverageTimeOfBaysDownload';
    return new Promise((resolve, reject) => {
      this.http.post(url,body,{ observe: 'response', responseType: 'blob' as 'json' }).subscribe(res => {
        if (res.status == 200)
          this.downloadFile(res, fileName)

        resolve(true);
      },
        err => {
          // console.log("err==", err)
        })
    });
  }
  downloadVehicleReport(data,fileName){
    let body = {
      data: data,
    };
    let url = this.host + '/downloadVehicleReport';
    return new Promise((resolve, reject) => {
      this.http.post(url,body,{ observe: 'response', responseType: 'blob' as 'json' }).subscribe(res => {
        if (res.status == 200)
          this.downloadFile(res, fileName)

        resolve(true);
      },
        err => {
          // console.log("err==", err)
        })
    });
  }
  //---------------------manage asset download -------------------------------

  downloadFile(response, fileName) {
    let body = response.body
    let dataType = body.type;
    let binaryData = [];
    binaryData.push(body);
   
    let downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
    downloadLink.setAttribute('download', fileName);
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }

  downloadRegisteredCoins(data,  fileName) {
    // this.general.loadingFreez.next({status:true})
    let body = {
      data: data,
    };
    let url = this.host + '/downloadRegisteredCoins';
    return new Promise((resolve, reject) => {
      this.http.post(url,body,{ observe: 'response', responseType: 'blob' as 'json' }).subscribe(res => {
        console.log("res==", res)
        if (res.status == 200)
          this.downloadFile(res, fileName)

        resolve(true);
      },
        err => {
          // console.log("err==", err)
        })
    });

  }

  downloadRegisteredGateways(data, fileName) {
    // this.general.loadingFreez.next({status:true})
    let body = {
      data: data,
    };
    let url = this.host + '/downloadRegisteredGateways';
    return new Promise((resolve, reject) => {
      this.http.post(url,body,{ observe: 'response', responseType: 'blob' as 'json' }).subscribe(res => {
        // console.log("res==", res)
        if (res.status == 200)
          this.downloadFile(res, fileName)

        resolve(true);
      },
        err => {
          // console.log("err==", err)
        })
    });
  }

  downloadRegisteredDevice(data, fileName) {
    // this.general.loadingFreez.next({status:true})
    let body = {
      data: data,
    };
    let url = this.host + '/downloadRegisteredDeviceData';
    return new Promise((resolve, reject) => {
      this.http.post(url,body,{ observe: 'response', responseType: 'blob' as 'json' }).subscribe(res => {

        if (res.status == 200)
          this.downloadFile(res, fileName)

        resolve(true);
      },
        err => {
          // console.log("err==", err)
        })
    });

  }

  downloadOnlineCoin(data, fileName) {
    // this.general.loadingFreez.next({status:true})
    let body = {
      data: data,
    };
    let url = this.host + '/downloadOnlineCoin';
    return new Promise((resolve, reject) => {
      this.http.post(url,body,{ observe: 'response', responseType: 'blob' as 'json' }).subscribe(res => {

        if (res.status == 200)
          this.downloadFile(res, fileName)

        resolve(true);
      },
        err => {
          // console.log("err==", err)
        })
    });

  }

  downloadOfflineCoin(data, fileName) {
    // this.general.loadingFreez.next({status:true})
    let body = {
      data: data,
    };
    let url = this.host + '/downloadOfflineCoin';
    return new Promise((resolve, reject) => {
      this.http.post(url,body,{ observe: 'response', responseType: 'blob' as 'json' }).subscribe(res => {
        if (res.status == 200) this.downloadFile(res, fileName);
        console.log("res==",res)

        resolve(true);
      },
        (err) => {
          // console.log('err==', err);
        }
      );
    });
  }

  downloadOnlineGateways(data, fileName) {
    // this.general.loadingFreez.next({status:true})
    let body = {
      data: data,
    };
    let url = this.host + '/downloadOnlineGateways';
    return new Promise((resolve, reject) => {
      this.http.post(url,body,{ observe: 'response', responseType: 'blob' as 'json' }).subscribe(res => {
        if (res.status == 200) this.downloadFile(res, fileName);
        resolve(true);
      },
        (err) => {
          // console.log('err==', err);
        }
      );
    });
  }

  downloadOfflineGateways(data, fileName) {
    // this.general.loadingFreez.next({status:true})
    let body = {
      data: data,
    };
    let url = this.host + '/downloadOfflineGateways';
    return new Promise((resolve, reject) => {
      this.http.post(url,body,{ observe: 'response', responseType: 'blob' as 'json' }).subscribe(res => {
        if (res.status == 200) this.downloadFile(res, fileName);
        console.log("res==",res)
        resolve(true);
      },
        (err) => {
          // console.log('err==', err);
        }
      );
    });
  }

  downloadOnlineDevice(data, fileName) {
    // this.general.loadingFreez.next({status:true})
    let body = {
      data: data,
    };
    let url = this.host + '/downloadOnlineDeviceData';
    return new Promise((resolve, reject) => {
      this.http.post(url,body,{ observe: 'response', responseType: 'blob' as 'json' }).subscribe(res => {
        if (res.status == 200) this.downloadFile(res, fileName);

        resolve(true);
      },
        (err) => {
          // console.log('err==', err);
        }
      );
    });
  }

  downloadOfflineDevice(data, fileName) {
    // this.general.loadingFreez.next({status:true})
    let body = {
      data: data,
    };
    let url = this.host + '/downloadOfflineDeviceData';
    return new Promise((resolve, reject) => {
      this.http.post(url,body,{ observe: 'response', responseType: 'blob' as 'json' }).subscribe(res => {
        if (res.status == 200) this.downloadFile(res, fileName);

        resolve(true);
      },
        (err) => {
          // console.log('err==', err);
        }
      );
    });
  }
  
  // ----------------------congestion---------------------
  getCongestion(data){
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
  
    let url = this.host + '/getCongestion';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }
  getCongestionPerDay(data){
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
  
    let url = this.host + '/getCongestionPerDay';
    let body = {
      data: data,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, body, httpOptions).subscribe(
        (res: any) => {
          resolve(res.data);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  getVehicleStatusData(data){
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',"skip":"true" }),
    };
  
    let url = this.host + '/getVehicleInfo';
 
    return new Promise((resolve, reject) => {
      this.http.post(url, data, httpOptions).subscribe(
        (res: any) => {
          resolve(res);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }
  getZones(data){
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json',"skip":"true" }),
    };
  
    let url = this.host + '/getZonesInfo';
 
    return new Promise((resolve, reject) => {
      this.http.post(url, data, httpOptions).subscribe(
        (res: any) => {
          resolve(res);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }
}
