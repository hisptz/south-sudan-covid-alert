import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiLink } from '../../../assets/configurations/apiLink';
import { find, uniq } from 'lodash';

import { catchError, take } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable()
export class OrgUnitsService {
  apiUrl = apiLink;

  constructor(private httpClient: HttpClient) {}

  loadOrgUnitDataWithAncestors(orgUnitIdArr: Array<any>): Observable<any> {
    const formattedOrgUnitArr = uniq(orgUnitIdArr);
    const orgUnitArrStr = formattedOrgUnitArr.toString();
    const url =
      this.apiUrl +
      `organisationUnits.json?fields=id,name,ancestors[id,name]&filter=id:in:[${orgUnitArrStr}]&paging=false`;
    return this.httpClient
      .get(url)
      .pipe(catchError((error) => throwError(error)));
  }
  getAncestors(ou: string, ouName: string, ancestorsOrgUnitData: any) {
    const orgUnit = find(
      ancestorsOrgUnitData.organisationUnits || [],
      (obj) => obj.id === ou,
    );
    const ancestors = orgUnit && orgUnit.ancestors ? orgUnit.ancestors : [];
    //TODO improve logics for get value for ancestors
    return [
      {
        dataElement: 'country',
        value: ancestors[0]?.name || '',
      },
      {
        dataElement: 'state',
        value: ancestors[1]?.name || '',
      },
      {
        dataElement: 'county',
        value: ancestors[2]?.name || '',
      },
      {
        dataElement: 'payam',
        value: ancestors[3]?.name || '',
      },
      {
        dataElement: 'ouname',
        value: ouName || '',
      },
    ];
  }
}
