import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PROGRAM_ID, ALL_TABLE_HEADERS } from '../models/config.model';
import { apiLink } from '../../../assets/configurations/apiLink';
import { catchError } from 'rxjs/operators';
import { from, Observable, throwError } from 'rxjs';
import { PromiseService } from './promise.service';
import { getDataPaginationFilters } from '../helpers/request.helper';
import { flattenDeep, uniq, chunk, map, find } from 'lodash';
import { EventResponse } from '../models/events.model';
import { OrgUnitsService } from './org-units.service';
import { convertExponentialToDecimal } from '../helpers/convert-exponential-to-decimal.helper';
import { commonUsedIds, definedSysmptoms } from '../models/alert.model';
import { calculateAge } from '../helpers/calculate-age.helper';
import { getFormattedPayloadForUpdate } from '../helpers/get-formatted-payload.helper';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import { loadEventsByProgramIdSuccess } from 'src/app/store/actions';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  constructor(
    private httpClient: HttpClient,
    private promiseService: PromiseService,
    private orgUnitsService: OrgUnitsService,
    private store: Store<AppState>,
  ) {}

  updateEventBySingleDataValue(
    data: any,
    eventId: string,
    dataValueId: string,
  ): Observable<any> {
    const url = apiLink + `events/${eventId}/${dataValueId}`;
    return this.httpClient
      .put(url, data)
      .pipe(catchError((error) => throwError(error)));
  }

  getEventByIdObservable(eventId: string): Observable<any> {
    const fields = `fields=program,event,eventDate,orgUnit,orgUnitName,dataValues[dataElement,value]`;
    const url = apiLink + `events/${eventId}.json?${fields}`;
    return this.httpClient
      .get(url)
      .pipe(catchError((error) => throwError(error)));
  }

  getEventsByProgramIdObservable({
    programId = PROGRAM_ID,
    pageFilter = '',
    fields,
    pageSize = 50,
  }): Observable<any> {
    pageSize = fields === 'none' ? 1 : pageSize;
    const queries = `program=${programId}&ouMode=ACCESSIBLE&order=eventDate:DESC&pageSize=${pageSize}`;
    const url = `${apiLink}events.json?${pageFilter}&${queries}&fields=${fields}`;
    return this.httpClient
      .get(url)
      .pipe(catchError((error) => throwError(error)));
  }

  async getEventsByProgramIdPromise( ) {
    const fields = `fields=program,event,eventDate,orgUnit,orgUnitName,dataValues[dataElement,value]`;
    let events: Array<EventResponse> = [];
    let  orgUnitWithAncestors : Array<any> = [];
    try {
      orgUnitWithAncestors =  await this.orgUnitsService.discoveringOrganisationUnitsWithAncestors();
      console.log(orgUnitWithAncestors);
      const pagingDetails = await this.geteventsPagingDetails();
      const pagingFilters = getDataPaginationFilters(pagingDetails, 1000);
      if (pagingFilters?.length) {
        for (const pageFilter of pagingFilters) {
          const eventsObservable: Observable<Function> = this.getEventsByProgramIdObservable(
            { pageFilter, fields },
          );
          const eventsResult: {
            events: Array<EventResponse>;
          } = await this.promiseService.getPromiseFromObservable(
            eventsObservable,
          );
          events = eventsResult?.events?.length
            ? [...events, ...(eventsResult?.events ?? [])]
            : [...events];
          const response = await this.formatEvents(events, orgUnitWithAncestors);
          this.store.dispatch(loadEventsByProgramIdSuccess({ events:response , isCompleted: false }));

        }
      }
    } catch (e) {
      throw new Error(e?.message || `Failed to fetch events`);
    } finally {
      return await this.formatEvents(events,orgUnitWithAncestors);
    }
  }

  getEvents() {
    return from(this.getEventsByProgramIdPromise());
  }

  async geteventsPagingDetails() {
    const eventsObservable: Observable<any> = this.getEventsByProgramIdObservable(
      { fields: 'none', pageFilter: 'totalPages=true' },
    );
    return await this.promiseService.getPromiseFromObservable(eventsObservable);
  }

  private async formatEvents(events: Array<EventResponse>, orgUnitWithAncestors : any[]) {
    let formattedEvents = [];
    try {
      formattedEvents = map(events || [], (eventItem) => {
        const orgUnitData = this.orgUnitsService.getAncestors(
          eventItem?.orgUnit,
          eventItem?.orgUnitName,
          flattenDeep(orgUnitWithAncestors),
        );
        const dataValues = [
          ...this.formatDataValues(eventItem?.dataValues),
          ...orgUnitData,
          { dataElement: 'eventdate', value: eventItem?.eventDate },
        ];
        return { ...eventItem, dataValues };
      });
    } catch (e) {
      throw new Error(e?.message || `Failed to format events`);
    } finally {
      return formattedEvents;
    }
  }

  formatDataValues(dataValues: Array<any>): Array<any> {
    let sysmptoms = '';
    return [
      ...map(dataValues || [], (dataValue) => {
        const headerData = find(
          ALL_TABLE_HEADERS || [],
          (header) => header?.name === dataValue?.dataElement,
        );
        const symptomItem = find(
          definedSysmptoms || [],
          (definedSymptom) => definedSymptom?.id === dataValue?.dataElement,
        );
        sysmptoms = symptomItem?.name
          ? `${sysmptoms} ${sysmptoms ? ',' : ''} ${symptomItem?.name || ''}`
          : sysmptoms;
        return {
          ...dataValue,
          value: this.getValueByHeader(dataValue?.value, headerData) || '',
        };
      }),
      { dataElement: 'symptoms', value: sysmptoms || '' },
    ];
  }
  private getValueByHeader(rowValue, header) {
    if (header?.valueType === 'BOOLEAN') {
      return rowValue === '1' || rowValue === 'true' ? 'Yes' : 'No';
    }
    if (header?.name === commonUsedIds.PHONE_NUMBER) {
      return convertExponentialToDecimal(rowValue) === '0.0'
        ? 0
        : convertExponentialToDecimal(rowValue);
    }
    if (header?.name === commonUsedIds.SEX) {
      return rowValue === '01'
        ? 'Male'
        : rowValue === '02'
        ? 'Female'
        : rowValue;
    }
    if (header?.name === commonUsedIds.AGE) {
      const birthDate = new Date(rowValue);
      return calculateAge(birthDate);
    }

    return rowValue;
  }

  async getEventPromise(eventId: string) {
    const eventObservable = this.getEventByIdObservable(eventId);
    return await this.promiseService.getPromiseFromObservable(eventObservable);
  }

  async updateCaseNumberPromise({ data, eventId }) {
    let response = null;
    try {
      const eventPayload = await this.getEventPromise(eventId);
      const formattedCaseNumberPayload = getFormattedPayloadForUpdate(
        eventPayload,
        commonUsedIds.CASE_NUMBER,
        data[commonUsedIds.CASE_NUMBER],
      );
      let updateEventObservable = await this.updateEventBySingleDataValue(
        formattedCaseNumberPayload,
        eventId,
        commonUsedIds.CASE_NUMBER,
      );
      response = await this.promiseService.getPromiseFromObservable(
        updateEventObservable,
      );
      const formattedCaseApprovalPayload = getFormattedPayloadForUpdate(
        eventPayload,
        commonUsedIds.CASE_APPROVER,
        data[commonUsedIds.CASE_APPROVER],
      );
      updateEventObservable = await this.updateEventBySingleDataValue(
        formattedCaseApprovalPayload,
        eventId,
        commonUsedIds.CASE_APPROVER,
      );
      response = await this.promiseService.getPromiseFromObservable(
        updateEventObservable,
      );
    } catch (e) {
      response = e;
      throw new Error(e?.message || `Failed to format events`);
    } finally {
      return response;
    }
  }

  updateCaseNumber({ data, eventId }) {
    return from(this.updateCaseNumberPromise({ data, eventId }));
  }
}
