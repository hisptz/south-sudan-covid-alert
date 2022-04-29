import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiLink } from '../../../assets/configurations/apiLink';
import { find } from 'lodash';

import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable()
export class OrgUnitsService {
  constructor(private httpClient: HttpClient) {}

  loadOrgUnitDataWithAncestors(orgUnitIds: Array<string>): Observable<any> {
    const url =
      apiLink +
      `organisationUnits.json?fields=id,name,ancestors[id,name,level]&filter=id:in:[${orgUnitIds.join(
        ',',
      )}]&paging=false`;
    return this.httpClient
      .get(url)
      .pipe(catchError((error) => throwError(error)));
  }

  getAncestors(ou: string, ouName: string, organisationUnits: any[]) {
    const orgUnit = find(
      organisationUnits || [],
      (organisationUnit: any) => organisationUnit.id === ou,
    );
    const country = this.getAncestorByLevel(orgUnit.ancestors || [], 3);
    const state = this.getAncestorByLevel(orgUnit.ancestors || [], 2);
    const payam = this.getAncestorByLevel(orgUnit.ancestors || [], 4);
    return [
      {
        dataElement: 'country',
        value: country.name || '',
      },
      {
        dataElement: 'state',
        value: state.name || '',
      },
      {
        dataElement: 'payam',
        value: payam.name || '',
      },
      {
        dataElement: 'ouname',
        value: ouName || '',
      },
    ];
  }

  getAncestorByLevel(ancestors: any[], level: number) {
    return find(
      ancestors,
      (ancestor: any) => ancestor.level && ancestor.level === level,
    );
  }
}
