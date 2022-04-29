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

  loadOrgUnitDataWithAncestors(orgUnitIds: Array<string>): Observable<any> {
    const formattedOrgUnitArr = uniq(orgUnitIds);
    const orgUnitArrStr = formattedOrgUnitArr.toString();
    const url =
      this.apiUrl +
      `organisationUnits.json?fields=id,name,ancestors[id,name,level]&filter=id:in:[${orgUnitArrStr}]&paging=false`;
    return this.httpClient
      .get(url)
      .pipe(catchError((error) => throwError(error)));
  }

  getAncestors(ou: string, ouName: string, organisationUnits: any[]) {
    const orgUnit = find(
      organisationUnits || [],
      (organisationUnit: any) => organisationUnit.id === ou,
    );
    const ancestors = orgUnit && orgUnit.ancestors ? orgUnit.ancestors : [];
    console.log({ ancestors, ouName, ou, organisationUnits });
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
