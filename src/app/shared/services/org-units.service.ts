import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { apiLink } from '../../../assets/configurations/apiLink';
import { find,flattenDeep } from 'lodash';
import {  take } from 'rxjs/operators';
import { getDataPaginationFilters } from '../helpers/request.helper';

@Injectable()
export class OrgUnitsService {
  constructor(private httpClient: HttpClient) {}

  async discoveringOrganisationUnitsWithAncestors( ): Promise<any[]>{
    const organisationUnits: any = [];
    const pagingFilters =  await this.discoveringOrganisationUnitPaginations();
    for(const pagingFilter of pagingFilters){
      const response = await this.discoveringOrganisationUnitByPagination(pagingFilter);
      organisationUnits.push(response);
    }
    return flattenDeep(organisationUnits);
  }

  discoveringOrganisationUnitPaginations() : Promise<Array<String>>{
    const url = `${apiLink}organisationUnits.json`;
    return new Promise((resolve,reject)=>{
      this.httpClient.get(`${url}?fields=none&pageSize=1`).pipe(take(1)).subscribe(pagingDetails=>{
        const pagingFilters = getDataPaginationFilters(pagingDetails, 1000);
        resolve(pagingFilters);
      },()=>{
        resolve([]);
      })
    })
  }

  discoveringOrganisationUnitByPagination(pageFilter : any) : Promise<Array<String>>{
    const url = `${apiLink}organisationUnits.json?fields=id,name,ancestors[id,name,level]&${pageFilter}`;
    return new Promise((resolve,reject)=>{
      this.httpClient.get(`${url}`).pipe(take(1)).subscribe((response:any)=>{
        resolve(response.organisationUnits || []);
      },()=>{
        resolve([]);
      })
    })
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
