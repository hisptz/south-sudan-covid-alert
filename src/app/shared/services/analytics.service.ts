// import { HttpClientService } from './http-client.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiLink } from '../../../assets/configurations/apiLink';

@Injectable()
export class AnalyticsService {
  apiUrl = apiLink;

  constructor(private httpClient: HttpClient) {}

  loadEvents(): Observable<any> {
    const url = this.apiUrl + 'analytics/events/query/uaV8Y8Yd2te.json?' +
    'dimension=pe:THIS_YEAR&dimension=ou:he6RdNPCKhY&dimension=qpjm7pHJYu0.rBoJRVqlWpD&' +
    'dimension=qpjm7pHJYu0.Pe3CHmZicqT&dimension=qpjm7pHJYu0.m8d3rAwFrCb&dimension=qpjm7pHJYu0.g7EpCKIysgQ&' +
    'dimension=qpjm7pHJYu0.BafEF62hrZ4&dimension=qpjm7pHJYu0.uTtGZfgk8bv&dimension=qpjm7pHJYu0.sjvr2QS64x5&' +
    'dimension=qpjm7pHJYu0.UATjIK2KUVd&dimension=qpjm7pHJYu0.a0C28yEISxc&dimension=qpjm7pHJYu0.oQSKqGcOGNe&' +
    'dimension=qpjm7pHJYu0.uIR6DUFBQ7g&dimension=qpjm7pHJYu0.dxyEuWRce8l&dimension=qpjm7pHJYu0.EicmBDTb8Zm&' +
    'dimension=qpjm7pHJYu0.QsEoQSQUEso&dimension=qpjm7pHJYu0.s4jPdjTj69G&dimension=qpjm7pHJYu0.K6ciAYeQKWL&' +
    'dimension=qpjm7pHJYu0.sbwDPRnLzYY&dimension=qpjm7pHJYu0.snEoCW6OmBH&dimension=qpjm7pHJYu0.GBN3XQk9Ktg&' +
    'dimension=qpjm7pHJYu0.FEJYpBRI2tw&dimension=qpjm7pHJYu0.PSabDGnGtw8&dimension=qpjm7pHJYu0.JHvOHr5nmSi&' +
    'dimension=qpjm7pHJYu0.ZRo6gpevFmy&stage=qpjm7pHJYu0&displayProperty=NAME&outputType=EVENT&desc=eventdate&paging=false';
    return this.httpClient.get(url);
  }
}
