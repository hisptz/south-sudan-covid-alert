// import { HttpClientService } from './http-client.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiLink } from '../../../assets/configurations/apiLink';

@Injectable()
export class CurrentUserService {
  apiUrl = apiLink;
  // apiUrl = APIURL;

  constructor(private httpClient: HttpClient) {}

  loadUser(): Observable<any> {
    const url =
      this.apiUrl +
      'me.json?fields=id,name,displayName,created,' +
      'lastUpdated,email,dataViewOrganisationUnits[id,name,level,parent[id,name],' +
      'children[id,name,parent[id,name]]],' +
      'organisationUnits[id,name,level,parent[id,name],children[id,name,' +
      'parent[id,name]]],userCredentials[username,userRoles[id,name,authorities]]';
    return this.httpClient.get(url);
  }

  loadSystemInfo(): Observable<any> {
    const url = this.apiUrl + 'systemSettings.json';
    return this.httpClient.get(url);
  }
}
