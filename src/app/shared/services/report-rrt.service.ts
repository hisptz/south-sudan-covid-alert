import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { getFormattedPayloadForUpdate } from '../helpers/get-formatted-payload.helper';
import { commonUsedIds } from '../models/alert.model';
import { PromiseService } from './promise.service';
import { EventsService } from './events.service';
@Injectable({
  providedIn: 'root',
})
export class ReportRrtService {
  constructor(
    private promiseService: PromiseService,
    private eventsService: EventsService,
  ) {}

  async reportToRRTRequestPromise(
    data: any,
    eventId: string,
    dataValueId: string,
  ) {
    try {
      const updateEventObservable = this.eventsService.updateEventBySingleDataValue(
        data,
        eventId,
        dataValueId,
      );
      return await this.promiseService.getPromiseFromObservable(
        updateEventObservable,
      );
    } catch (e) {
      throw Error(e?.message || 'Failed to update event');
    }
  }
  async reportToRRTPromise(data: any, eventId: string) {
    let response = null;
    try {
      const payload = await this.getFormattedEventPayload(
        eventId,
        commonUsedIds.REPORTED_TO_RRT,
        true,
      );
      if (payload) {
        const reportToRRTResponse = await this.reportToRRTRequestPromise(
          payload,
          eventId,
          commonUsedIds.REPORTED_TO_RRT,
        );
        response = { ...response, reportToRRTResponse };
      }
    } catch (e) {
      throw new Error(e?.message || 'Failed to report to RRT');
    } finally {
      return response;
    }
  }
  reportToRRT(data: any, id: string) {
    return from(this.reportToRRTPromise(data, id));
  }

  async getFormattedEventPayload(
    eventId: string,
    dataValueId: string,
    value: any,
  ) {
    let formattedPayload = null;
    try {
      const payload = await this.eventsService.getEventPromise(eventId);
      formattedPayload = getFormattedPayloadForUpdate(
        payload,
        dataValueId,
        value,
      );
    } catch (e) {
      throw Error(e?.message || 'Failed to fetch event payload');
    }
    return formattedPayload;
  }
}
