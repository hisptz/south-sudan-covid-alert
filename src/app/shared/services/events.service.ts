import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  PROGRAM_ID,
  ORGUNIT_ID,
  REASON_FOR_CALLING_ID,
  REASON_FOR_CALLING_VALUE,
  SYMPTOM_IDS,
  ALL_TABLE_HEADERS,
} from '../models/config.model';
import { apiLink } from '../../../assets/configurations/apiLink';
import { catchError } from 'rxjs/operators';
import { from, Observable, throwError } from 'rxjs';
import { PromiseService } from './promise.service';
import { getDataPaginationFilters } from '../helpers/request.helper';
import { filter, map, find } from 'lodash';
import { EventResponse } from 'src/app/store/models/events.model';
import { AnalyticsService } from './analytics.service';
import { convertExponentialToDecimal } from '../helpers/convert-exponential-to-decimal.helper';
import { commonUsedIds, definedSysmptoms } from '../models/alert.model';
import { calculateAge } from '../helpers/calculate-age.helper';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  constructor(
    private httpClient: HttpClient,
    private promiseService: PromiseService,
    private analyticsService: AnalyticsService,
  ) {}


  updateEventBySingleDataValue(data: any, eventId: string, dataValueId: string) {
    const url = apiLink + `events/${eventId}/${dataValueId}`;
    return this.httpClient
      .put(url, data)
      .pipe(catchError((error) => throwError(error)));
  }

  getEventsByProgramIdObservable({
    programId = PROGRAM_ID,
    pageFilter = '',
    fields,
    pageSize = 50,
  }): Observable<any> {
    const filterExpression = `filter=${REASON_FOR_CALLING_ID}:EQ:${REASON_FOR_CALLING_VALUE}`;
    const queries = `program=${programId}&ou=${ORGUNIT_ID}&ouMode=DESCENDANTS&order=eventDate:DESC&${pageSize}`;
    const url = `${apiLink}events.json?${pageFilter}&${queries}&${fields}&${filterExpression}`;
    return this.httpClient
      .get(url)
      .pipe(catchError((error) => throwError(error)));
  }

  async getEventsByProgramIdPromise() {
    let events: Array<EventResponse> = [];
    try {
      const fields = `fields=program,event,eventDate,orgUnit,orgUnitName,dataValues[dataElement,value]`;
      const pagingDetails = await this.geteventsPagingDetails();
      const pagingFilters = getDataPaginationFilters(pagingDetails, 50);
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
            ? [
                ...events,
                ...this.getEventsWithMoreThanOneSymptomDataElement(
                  eventsResult?.events,
                ),
              ]
            : [...events];
        }
      }
    } catch (e) {
      throw new Error(e?.message || `Failed to fetch events`);
    } finally {
      return await this.formatEvents(events);
    }
  }

  getEvents() {
    return from(this.getEventsByProgramIdPromise());
  }

  async geteventsPagingDetails() {
    const eventsObservable: Observable<any> = this.getEventsByProgramIdObservable(
      { fields: 'none' },
    );
    return await this.promiseService.getPromiseFromObservable(eventsObservable);
  }

  private async formatEvents(events: Array<EventResponse>) {
    try {
      const requiredEvents = this.getEventsWithMoreThanOneSymptomDataElement(
        events,
      );
      const ouArr = map(requiredEvents || [], (event) => event.orgUnit);
      const orgUnitWithAncestors = await this.analyticsService.loadOrgUnitDataWithAncestorsPromise(
        ouArr,
      );
      return map(requiredEvents || [], (eventItem) => {
        const orgUnitData = this.getAncestors(
          eventItem?.orgUnit,
          eventItem?.orgUnitName,
          orgUnitWithAncestors,
        );
        const dataValues = [
          ...this.formatDataValues(eventItem?.dataValues),
          ...orgUnitData,
          {dataElement: 'eventdate', value: eventItem?.eventDate}
        ];
        return { ...eventItem, dataValues };
      });
    } catch (e) {
      return [];
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
  getValueByHeader(rowValue, header) {
    if (header?.valueType === 'BOOLEAN') {
      return rowValue === '1' || rowValue === 'true' ? 'Yes' : 'No';
    }
    if (header?.name === commonUsedIds.PHONE_NUMBER) {
      return convertExponentialToDecimal(rowValue) === '0.0'
        ? 0
        : convertExponentialToDecimal(rowValue);
    }
    if (header?.name === commonUsedIds.SEX) {
      if (rowValue === '01') {
        return 'Male';
      } else if (rowValue === '02') {
        return 'Female';
      } else {
        return rowValue;
      }
    }
    if (header?.name === commonUsedIds.AGE) {
      const birthDate = new Date(rowValue);
      return calculateAge(birthDate) ? calculateAge(birthDate) : '';
    }

    return rowValue;
  }

  getEventsWithMoreThanOneSymptomDataElement(
    events: Array<EventResponse>,
  ): Array<EventResponse> {
    return filter(events || [], (eventItem: EventResponse) => {
      if (eventItem?.dataValues) {
        const symptomsDataValues = filter(
          eventItem?.dataValues || [],
          (dataValue) => {
            if (SYMPTOM_IDS?.includes(dataValue?.dataElement)) {
              return dataValue;
            }
          },
        );
        if (symptomsDataValues?.length > 1) {
          return eventItem;
        }
      }
    });
  }

  getAncestors(ou: string, ouName: string, ancestorsOrgUnitData: any) {
    const orgUnit = find(
      ancestorsOrgUnitData.organisationUnits || [],
      (obj) => obj.id === ou,
    );
    const ancestors = orgUnit && orgUnit.ancestors ? orgUnit.ancestors : [];
    return [
      {
        dataElement: 'country',
        value: ancestors[0]?.name || '',
      },
      {
        dataElement: 'state',
        value: ancestors[1]?.name || '',
      },
      {
        dataElement: 'county',
        value: ancestors[2]?.name || '',
      },
      {
        dataElement: 'payam',
        value: ancestors[3]?.name || '',
      },
      {
        dataElement: 'ouname',
        value: ouName || '',
      },
    ];
  }
}
