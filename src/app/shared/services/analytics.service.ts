// import { HttpClientService } from './http-client.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, throwError } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { apiLink } from '../../../assets/configurations/apiLink';
import * as fromHelpers from '../../shared/helpers';
import * as _ from 'lodash';
import { ReportRrtService } from './report-rrt.service';
import { commonUsedIds, definedSysmptoms } from '../models/alert.model';
import { getOrgUnitAncestors } from '../helpers/get-orgunit-ancestors.helper';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import { loadOrgUnitsAncestors } from 'src/app/store/actions/page-state.actions';

@Injectable()
export class AnalyticsService {
  apiUrl = apiLink;

  constructor(
    private httpClient: HttpClient,
    private reportService: ReportRrtService,
    private store: Store<AppState>,
  ) {}

  loadEvents(): Observable<any> {
    const url =
      this.apiUrl +
      'analytics/events/query/uaV8Y8Yd2te.json?' +
      'dimension=pe:THIS_YEAR&dimension=ou:he6RdNPCKhY&' +
      'dimension=qpjm7pHJYu0.g7EpCKIysgQ&' +
      'dimension=qpjm7pHJYu0.BafEF62hrZ4&' +
      'dimension=qpjm7pHJYu0.UATjIK2KUVd&dimension=qpjm7pHJYu0.a0C28yEISxc&dimension=qpjm7pHJYu0.oQSKqGcOGNe&' +
      'dimension=qpjm7pHJYu0.dxyEuWRce8l&dimension=qpjm7pHJYu0.EicmBDTb8Zm&' +
      'dimension=qpjm7pHJYu0.s4jPdjTj69G&dimension=qpjm7pHJYu0.K6ciAYeQKWL&' +
      'dimension=qpjm7pHJYu0.snEoCW6OmBH&' +
      'dimension=qpjm7pHJYu0.EWZcuvPOrJF&' +
      'dimension=qpjm7pHJYu0.FEJYpBRI2tw&' +
      'dimension=qpjm7pHJYu0.Yh5KOJj8l7p&' +
      'dimension=qpjm7pHJYu0.HkqxOfRr51f&' +
      'dimension=qpjm7pHJYu0.T0ehgpsDrui&' +
      'dimension=qpjm7pHJYu0.Pe3CHmZicqT&' +
      'dimension=qpjm7pHJYu0.fyzp8BpsPMl&' +
      'dimension=qpjm7pHJYu0.aVm8pmWxIWX&' +
      'dimension=qpjm7pHJYu0.aTMMzGXk19L&' +
      'dimension=qpjm7pHJYu0.YirYKgXDYwm&' +
      'dimension=qpjm7pHJYu0.nybNlx0XcUq&' +
      'dimension=qpjm7pHJYu0.HahhmzRvwu8&' +
      'dimension=qpjm7pHJYu0.iUEwXfg9CgD&' +
      'dimension=qpjm7pHJYu0.IrFWIj5ks2p&' +
      'stage=qpjm7pHJYu0&displayProperty=NAME&outputType=EVENT&desc=eventdate&paging=false';
    return this.httpClient.get(url);
  }
  loadEvents1(): Observable<any> {
    const url =
      this.apiUrl +
      'analytics/events/query/uaV8Y8Yd2te.json?dimension=pe:THIS_YEAR&dimension=ou:he6RdNPCKhY&dimension=qpjm7pHJYu0.ULq5o82P6yq&dimension=qpjm7pHJYu0.snEoCW6OmBH&dimension=qpjm7pHJYu0.UVb0n05eXrb&dimension=qpjm7pHJYu0.dxyEuWRce8l&dimension=qpjm7pHJYu0.FEJYpBRI2tw:IN:Picked&dimension=qpjm7pHJYu0.a0C28yEISxc&dimension=qpjm7pHJYu0.cQkocmeqivx&dimension=qpjm7pHJYu0.oQSKqGcOGNe&dimension=qpjm7pHJYu0.TwGiy51IM8t&dimension=qpjm7pHJYu0.Pe3CHmZicqT&dimension=qpjm7pHJYu0.K6ciAYeQKWL&dimension=qpjm7pHJYu0.EicmBDTb8Zm:IN:Sickness&dimension=qpjm7pHJYu0.nybNlx0XcUq&dimension=qpjm7pHJYu0.aTMMzGXk19L&dimension=qpjm7pHJYu0.Yh5KOJj8l7p&dimension=qpjm7pHJYu0.EWZcuvPOrJF&dimension=qpjm7pHJYu0.fyzp8BpsPMl&dimension=qpjm7pHJYu0.IrFWIj5ks2p&dimension=qpjm7pHJYu0.iUEwXfg9CgD&dimension=qpjm7pHJYu0.HahhmzRvwu8&dimension=qpjm7pHJYu0.T0ehgpsDrui&dimension=qpjm7pHJYu0.YirYKgXDYwm&dimension=qpjm7pHJYu0.aVm8pmWxIWX&dimension=qpjm7pHJYu0.UATjIK2KUVd&dimension=qpjm7pHJYu0.gYjZ1iTGNlg&dimension=qpjm7pHJYu0.HkqxOfRr51f&dimension=qpjm7pHJYu0.g7EpCKIysgQ&dimension=qpjm7pHJYu0.s4jPdjTj69G&stage=qpjm7pHJYu0&displayProperty=NAME&outputType=EVENT&desc=eventdate&paging=false';
    return this.httpClient.get(url);
  }

  loadOrgUnitDataWithAncestors(orgUnitIdArr: Array<any>) {
    const formattedOrgUnitArr = _.uniq(orgUnitIdArr);
    const orgUnitArrStr = formattedOrgUnitArr.toString();
    // const url =
    //   this.apiUrl +
    //   `organisationUnits/${orgUnitId}.json?fields=id,name,level,ancestors[id,name,%20level]`;
    const url =
      this.apiUrl +
      `organisationUnits.json?fields=id,name,ancestors[id,name]&filter=id:in:[${orgUnitArrStr}]&paging=false`;
    return this.httpClient.get(url);
  }
  loadOrgUnitDataWithAncestorsPromise(orgUnitIdArr: Array<any>): any {
    return new Promise((resolve, reject) => {
      this.loadOrgUnitDataWithAncestors(orgUnitIdArr)
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
  getAncestors(ou: string, ancestorsOrgUnitData: any) {
    const orgUnit = _.find(
      ancestorsOrgUnitData.organisationUnits || [],
      (obj) => obj.id === ou,
    );
    const ancestors = orgUnit && orgUnit.ancestors ? orgUnit.ancestors : [];
    return ancestors && ancestors.length
      ? {
          country: ancestors[0].name,
          state: ancestors[1].name,
          county: ancestors[2].name,
          payam: ancestors[3].name,
        }
      : { country: '', state: '', county: '', payam: '' };
  }
  async getEventListingPromise(eventsAnalytics: Array<any>) {
    let eventsWithPendingStatus = [];
    const formattedEvents = fromHelpers.transformAnalytics1(eventsAnalytics); // Format analytics data of events
    try {
      const ouArr = _.map(formattedEvents || [], (event) => event.ou);
      const orgUnitWithAncestors = await this.loadOrgUnitDataWithAncestorsPromise(
        ouArr,
      );
      let symptoms = [];
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

       

        const orgUnitData = this.getAncestors(event.ou, orgUnitWithAncestors);

        const newEvent = { ...event, isReportToRRTPending, ...orgUnitData};
        eventsWithPendingStatus.push(newEvent);
      }
      // this.store.dispatch(loadOrgUnitsAncestors({ orgUnitIds: ouArr }));

      return eventsWithPendingStatus;
    } catch (e) {
      if (e && e.status && e.status === 404) {
        eventsWithPendingStatus = _.map(
          formattedEvents || [],
          (formattedEvent) => {
            return { ...formattedEvent, isReportToRRTPending: false };
          },
        );
      }
      return eventsWithPendingStatus;
    }
    // return formattedEvents;
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
      if (formattedEvent && formattedEvent[commonUsedIds.REPORTED_TO_RRT]) {
        const eventPendingFromStore = this.getEventPendingFromStore(
          pendingEvents,
          formattedEvent,
        );
        if (formattedEvent[commonUsedIds.REPORTED_TO_RRT] === 'No') {
          status = eventPendingFromStore ? true : false;
        } else if (formattedEvent[commonUsedIds.REPORTED_TO_RRT] === 'Yes') {
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
