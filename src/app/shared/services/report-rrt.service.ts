import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, throwError } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { apiLink } from '../../../assets/configurations/apiLink';
import { getFormattedPayload } from '../helpers/get-formatted-payload.helper';
@Injectable({
  providedIn: 'root',
})
export class ReportRrtService {
  constructor(private httpClient: HttpClient) {}

  reportToRRTRequest(data: any, id: string) {
    const url = apiLink + `events/${id}`;
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
  reportToRRTRequestPromise(data: any, id: string): any {
    return new Promise((resolve, reject) => {
      this.reportToRRTRequest(data, id)
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
  async reportToRRTPromise(data: any, id: string) {
    const payload = await this.getFormattedEventPayload(id, data);
    let response = { reportToRRTResponse: null, pendingReportResponse: null };
    try {
      if (payload) {
        const reportToRRTResponse = await this.reportToRRTRequestPromise(
          payload,
          id,
        );
        const pendingReportResponse = await this.savePendingReportToRRT(id);
        response = { ...response, pendingReportResponse, reportToRRTResponse };
      }
    } catch (e) {}
    return response;
  }
  reportToRRT(data: any, id: string) {
    return from(this.reportToRRTPromise(data, id));
  }
  async savePendingReportToRRT(id) {
    let response = null;
    try {
      const availablePendingReportResponse = await this.getAvailablePendingReportResponse();
      if (
        availablePendingReportResponse &&
        availablePendingReportResponse.events
      ) {
        let newEvents = availablePendingReportResponse.events;

        newEvents = [...newEvents, id];

        response = await this.updatePendingReportedEventsPromise(newEvents);
      } else {
        response = await this.createPendingReportedEventsPromise([id]);
      }
    } catch (e) {
      if (e && e.status && e.status === 404) {
        response = await this.createPendingReportedEventsPromise([id]);
      } else {
        response = e;
      }
    }
    return response;
  }
  async getAvailablePendingReportResponse() {
    try {
      const pendingEventsObj = await this.getPendingReportedEventsPromise();
      return pendingEventsObj;
    } catch (e) {
      return null;
    }
  }
  async getFormattedEventPayload(id, eventData) {
    let formattedPayload = null;
    try {
      const payload = await this.getEventPayloadPromise(id);
      formattedPayload = getFormattedPayload(eventData, payload);
      console.log({formattedPayload})
    } catch (e) {
      formattedPayload = null;
    }
    return formattedPayload;
  }
}
