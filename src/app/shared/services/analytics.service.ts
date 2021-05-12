import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiLink } from '../../../assets/configurations/apiLink';
import { find, uniq } from 'lodash';

import { take } from 'rxjs/operators';

@Injectable()
export class AnalyticsService {
  apiUrl = apiLink;

  constructor(
    private httpClient: HttpClient,
  ) {}

  loadOrgUnitDataWithAncestors(orgUnitIdArr: Array<any>) {
    const formattedOrgUnitArr = uniq(orgUnitIdArr);
    const orgUnitArrStr = formattedOrgUnitArr.toString();
    const url =
      this.apiUrl +
      `organisationUnits.json?fields=id,name,ancestors[id,name]&filter=id:in:[${orgUnitArrStr}]&paging=false`;
    return this.httpClient.get(url);
  }
  loadOrgUnitDataWithAncestorsPromise(orgUnitIdArr: Array<any>): any {
    return new Promise((resolve, reject) => {
      this.loadOrgUnitDataWithAncestors(orgUnitIdArr)
        .pipe(take(1))
        .subscribe(
          (res) => {
            resolve(res);
          },
          (error) => {
            reject(error);
          },
        );
    });
  }
  getAncestors(ou: string, ancestorsOrgUnitData: any) {
    const orgUnit = find(
      ancestorsOrgUnitData.organisationUnits || [],
      (obj) => obj.id === ou,
    );
    const ancestors = orgUnit && orgUnit.ancestors ? orgUnit.ancestors : [];
    return ancestors && ancestors.length
      ? {
          country: ancestors[0]?.name,
          state: ancestors[1]?.name,
          county: ancestors[2]?.name,
          payam: ancestors[3]?.name,
        }
      : { country: '', state: '', county: '', payam: '' };
  }
}
