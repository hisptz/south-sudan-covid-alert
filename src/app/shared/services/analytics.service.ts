// import { HttpClientService } from './http-client.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, throwError } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { apiLink } from '../../../assets/configurations/apiLink';
import * as fromHelpers from '../../shared/helpers';
import * as _ from 'lodash';
import { ReportRrtService } from './report-rrt.service';

@Injectable()
export class AnalyticsService {
  apiUrl = apiLink;

  constructor(
    private httpClient: HttpClient,
    private reportService: ReportRrtService,
  ) {}

  loadEvents(): Observable<any> {
    const url =
      this.apiUrl +
      'analytics/events/query/uaV8Y8Yd2te.json?' +
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

  async getEventListingPromise(eventsAnalytics: Array<any>) {
    let eventsWithPendingStatus = [];
    const formattedEvents = fromHelpers.transformAnalytics1(eventsAnalytics); // Format analytics data of events
    try {
      const pendingEventsObj = await this.reportService.getPendingReportedEventsPromise(); // Get saved pending reported to RRT events
      for (const event of formattedEvents) {
        const pendingEvents =
          pendingEventsObj && pendingEventsObj.events
            ? pendingEventsObj.events
            : [];
        const isReportToRRTPending = await this.getReportedToRRTPendingStatus(
          event,
          pendingEvents,
        );

        const newEvent = { ...event, isReportToRRTPending };
        eventsWithPendingStatus.push(newEvent);
      }

     // return eventsWithPendingStatus;
    } catch (e) {
      if (e && e.status && e.status === 404) {
        eventsWithPendingStatus = _.map(
          formattedEvents || [],
          (formattedEvent) => {
            return { ...formattedEvent, isReportToRRTPending: false };
          },
        );
      }
     // return eventsWithPendingStatus;
    }
    return formattedEvents;
  }
  getEventListing(eventsAnalytics: Array<any>) {
    return from(this.getEventListingPromise(eventsAnalytics));
  }

  async getReportedToRRTPendingStatus(
    formattedEvent,
    pendingEvents,
  ): Promise<boolean> {
    let status = false;

    if (pendingEvents) {
      if (formattedEvent && formattedEvent.reportedToRRT) {
        const eventPendingFromStore = this.getEventPendingFromStore(
          pendingEvents,
          formattedEvent,
        );
        if (formattedEvent.reportedToRRT === 'No') {
          status = eventPendingFromStore ? true : false;
        } else if (formattedEvent.reportedToRRT === 'Yes') {
          await this.removeCompletedReportedToRRTEvent(
            pendingEvents,
            eventPendingFromStore,
          );
          status = false;
        } else {
          status = false;
        }
      }
    } else {
      status = false;
    }

    return status;
  }
  async removeCompletedReportedToRRTEvent(
    pendingEvents,
    eventPendingFromStore,
  ) {
    if (eventPendingFromStore) {
      const updatedPendingEvents: Array<any> =
        _.pull(pendingEvents, eventPendingFromStore) || pendingEvents;
      const response = await this.reportService.updatePendingReportedEventsPromise(
        updatedPendingEvents,
      );
    }
    return;
  }
  getEventPendingFromStore(pendingEvents, formattedEvent) {
    return _.find(
      pendingEvents,
      (pendingEvent) => pendingEvent === formattedEvent.psi,
    );
  }
}
