import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import * as ChartData from '../types/chart';
import * as Company from '../types/company';

@Injectable()
export class DataService {
  public apiHost: string = './assets/data/constituents-financials.json';
  private allCompanies: Company.Details[];

  constructor(private http: Http) {}

  public getAll(): Observable<Object> {
    return this.http
      .get(this.apiHost)
      .map(response => {
        const resJson = response.json(); //todo: sort by symbol
        this.allCompanies = resJson;
        return resJson;
      })
      .catch((error: any) =>
        Observable.throw(error.json().error || 'Server error')
      );
  }

  public getTickerCap(): Observable<Object> {
    return this.getAll().map(companies => {
      let tickerCapArr = [];

      for (let i in companies) {
        // console.log(companies[i]);
        tickerCapArr.push([companies[i].Symbol, companies[i]['Market Cap']]);
        // tickerCapArr.push([companies[i].Price]);
      }
      return tickerCapArr;
    });
  }

  public getChartData(): Observable<Object> {
    return this.getAll().map((companies: Company.Details) => {
      let nodes = [];

      // let indexCap = 0;

      for (let i in companies) {
        nodes.push({
          label: companies[i].Symbol,
          r: parseInt(companies[i]['Market Cap']) / 10 || 0,
          color: this.sectorColors[companies[i].Sector]
        });
        // indexCap = indexCap + parseInt(companies[i]['Market Cap']) || 0;
      }
      // console.log(indexCap);
      // nodes.push({
      //   label: 'SNP',
      //   r: indexCap / 10,
      //   color: 'black'
      // });

      return nodes;
    });
  }

  public companyByTicker(ticker: string): Company.Details {
    return this.allCompanies.filter(
      (company: Company.Details) => company.Symbol === ticker
    )[0];
  }

  private sectorColors = {
    Industrials: '#ff6600',
    'Health Care': '#99ff66',
    'Information Technology': '#0000e6',
    'Consumer Discretionary': '#ff33cc',
    Utilities: '#666633',
    Financials: '#00ccff',
    Materials: '#ffcc00',
    'Consumer Staples': '#660066',
    'Real Estate': '#006666',
    Energy: '#663300',
    'Telecommunications Services': '#ff0000'
  };
}
