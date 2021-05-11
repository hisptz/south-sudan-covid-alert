import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, throwError } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { apiLink } from '../../../assets/configurations/apiLink';
import { getFormattedPayload } from '../helpers/get-formatted-payload.helper';
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
  async saveCaseNumberPromise({ data, eventId }) {
    let response = null;
    try {
      const eventPayload = await this.getEventPayloadPromise(eventId);
      const formattedPayload = this.addCaseNumberInPayload({
        payload: eventPayload,
        data,
      });

      response = await this.reportToRRTRequestPromise(formattedPayload, eventId, commonUsedIds.CASE_NUMBER);
    } catch (e) {
    } finally {
      return response;
    }
  }
  saveCaseNumber({ data, eventId }) {
    return from(this.saveCaseNumberPromise({ data, eventId }));
  }

  addCaseNumberInPayload({ payload, data }) {
    let caseNumberObj = find(
      payload?.dataValues || [],
      (dataValue) => dataValue?.dataElement === commonUsedIds?.CASE_NUMBER,
    );
    caseNumberObj = caseNumberObj
      ? { ...caseNumberObj, value: data[commonUsedIds?.CASE_NUMBER] }
      : {
          dataElement: commonUsedIds?.CASE_NUMBER,
          value: data[commonUsedIds?.CASE_NUMBER],
        };
    return {
      ...payload,
      dataValues: [ caseNumberObj],
    };
  }
  async reportToRRTPromise(data: any, id: string) {
    const payload = await this.getFormattedEventPayload(id, data);
    let response = { reportToRRTResponse: null, pendingReportResponse: null };
    try {
      if (payload) {
        const reportToRRTResponse = await this.reportToRRTRequestPromise(
          payload,
          id,
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
    } catch (e) {
      formattedPayload = null;
    }
    return formattedPayload;
  }
}
