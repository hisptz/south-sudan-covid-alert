import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, throwError } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { apiLink } from '../../../assets/configurations/apiLink';
import { getFormattedPayloadForUpdate } from '../helpers/get-formatted-payload.helper';
import { commonUsedIds } from '../models/alert.model';
import { find } from 'lodash';
@Injectable({
  providedIn: 'root',
})
export class ReportRrtService {
  constructor(private httpClient: HttpClient) {}

  reportToRRTRequest(data: any, eventId: string, dataValueId: string) {
    const url = apiLink + `events/${eventId}/${dataValueId}`;
    return this.httpClient
      .put(url, data)
      .pipe(catchError((error) => throwError(error)));
  }
  getPendingReportedEvents(): Observable<any> {
    const url = apiLink + `dataStore/covidAlertConfig/pendingReportedEvents`;
    return this.httpClient
      .get(url)
      .pipe(catchError((error) => throwError(error)));
  }
  getEventPayLoad(id: string): Observable<any> {
    const url = apiLink + `events/${id}.json`;
    return this.httpClient
      .get(url)
      .pipe(catchError((error) => throwError(error)));
  }
  updatePendingReportedEvents(events: Array<any>): Observable<any> {
    const url = apiLink + `dataStore/covidAlertConfig/pendingReportedEvents`;
    return this.httpClient
      .put(url, { events })
      .pipe(catchError((error) => throwError(error)));
  }
  createPendingReportedEvents(events: Array<any>): Observable<any> {
    const url = apiLink + `dataStore/covidAlertConfig/pendingReportedEvents`;
    return this.httpClient
      .post(url, { events })
      .pipe(catchError((error) => throwError(error)));
  }
  reportToRRTRequestPromise(
    data: any,
    eventId: string,
    dataValueId: string,
  ): any {
    return new Promise((resolve, reject) => {
      this.reportToRRTRequest(data, eventId, dataValueId)
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
  getEventPayloadPromise(id: string): any {
    return new Promise((resolve, reject) => {
      this.getEventPayLoad(id)
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
  createPendingReportedEventsPromise(events: Array<any>): any {
    return new Promise((resolve, reject) => {
      this.createPendingReportedEvents(events)
        .pipe(take(1))
        .subscribe(
          (data) => {
            resolve(data);
          },
          (error) => {
            reject(error);
          },
        );
    });
  }
  updatePendingReportedEventsPromise(events: Array<any>): any {
    return new Promise((resolve, reject) => {
      this.updatePendingReportedEvents(events)
        .pipe(take(1))
        .subscribe(
          (data) => {
            resolve(data);
          },
          (error) => {
            reject(error);
          },
        );
    });
  }
  getPendingReportedEventsPromise(): any {
    return new Promise((resolve, reject) => {
      this.getPendingReportedEvents()
        .pipe(take(1))
        .subscribe(
          (data) => {
            resolve(data);
          },
          (error) => {
            reject(error);
          },
        );
    });
  }
  async reportToRRTPromise(data: any, eventId: string) {
    const payload = await this.getFormattedEventPayload(eventId, commonUsedIds.REPORTED_TO_RRT, true);
    let response = { reportToRRTResponse: null, pendingReportResponse: null };
    try {
      if (payload) {
        const reportToRRTResponse = await this.reportToRRTRequestPromise(
          payload,
          eventId,
          commonUsedIds.REPORTED_TO_RRT,
        );
        response = { ...response, reportToRRTResponse };
      }
    } catch (e) {}
    return response;
  }
  reportToRRT(data: any, id: string) {
    return from(this.reportToRRTPromise(data, id));
  }
 
  async getFormattedEventPayload(eventId, dataValueId, value) {
    let formattedPayload = null;
    try {
      const payload = await this.getEventPayloadPromise(eventId);
      formattedPayload = getFormattedPayloadForUpdate(
        payload,
        dataValueId,
        value,
      );
    } catch (e) {
      formattedPayload = null;
    }
    return formattedPayload;
  }
}
