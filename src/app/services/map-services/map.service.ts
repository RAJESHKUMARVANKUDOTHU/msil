import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ApiService } from '../api.service';
import { GeneralService } from '../general.service';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  // public mapCoinSelected = new Subject<any>();
  // public mapZone = new Subject<any>();
  // public mapError = new Subject<any>();
  // public mapDetectChanges = new Subject<any>();
  // public selectedLayout = new Subject<any>()
  // public GatewayCoinBound: any = [];
  public selectedLayoutZone: any = {
    layoutName: '',
    id: '',
    bounds: [],
  };
  // public selectedCoinBound: any = {
  //   layout: '',
  //   gatewayId: '',
  //   coinId: 0,
  //   coinName: '',
  //   coinBounds: [],
  // };
  // gatewayData: any = [];
  // coinData: any = [];
  // gatewayList: any = [];
  // coinList: any = [];

  constructor(
    private api: ApiService,
    private general: GeneralService,
  ) { }

  // getLayout() {
  //   this.api
  //     .getLayouts()
  //     .then((res: any) => {

  //       console.log('get layout res===', res);
  //       if (res.status) {
  //         this.gatewayList = res.success;
  //       }
  //       else {
  //         this.gatewayList = [];
  //       }
  //     })
  //     .catch((err: any) => {
  //       console.log('error==', err);
  //     });
  // }

  // clear() {
  //   // this.selectedLayoutZone.layout = '';
  //   this.selectedLayoutZone.id = '';
  //   this.selectedLayoutZone.bounds = [];

  //   // this.selectedCoinBound.layout = '';
  //   this.selectedCoinBound.gatewayId = '';
  //   this.selectedCoinBound.coinId = 0;
  //   this.selectedCoinBound.coinBounds = [];
  // }

}
