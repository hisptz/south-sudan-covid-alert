import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiLink } from '../../../assets/configurations/apiLink';
@Injectable({
  providedIn: 'root',
})
export class ReportRrtService {
  constructor(private httpClient: HttpClient) {}

  reportToRRT(data,id) {
    const url = apiLink + `events/${id}`;
    return this.httpClient.put(url, data);
  }
}
