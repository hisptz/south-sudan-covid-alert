import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  PROGRAM_ID,
  ORGUNIT_ID,
  REASON_FOR_CALLING_ID,
  REASON_FOR_CALLING_VALUE,
} from '../models/config.model';
import { apiLink } from '../../../assets/configurations/apiLink';
import { catchError } from 'rxjs/operators';
import { from, Observable, throwError } from 'rxjs';
import { PromiseService } from './promise.service';
import { getDataPaginationFilters } from '../helpers/request.helper';
import {filter} from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  constructor(
    private httpClient: HttpClient,
    private promiseService: PromiseService,
  ) {}

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
    let events = [];
    try {
      const fields = `fields=program,event,eventDate,orgUnit,orgUnitName,dataValues[dataElement,value]`;
      const pagingDetails = await this.geteventsPagingDetails();
      const pagingFilters = getDataPaginationFilters(pagingDetails, 50);
      if (pagingFilters?.length) {
        for (const pageFilter of pagingFilters) {
          const eventsObservable: Observable<Function> = this.getEventsByProgramIdObservable(
            { pageFilter, fields },
          );
          const eventsResult = await this.promiseService.getPromiseFromObservable(
            eventsObservable,
          );
          events = eventsResult?.events?.length
            ? [...events, ...eventsResult?.events]
            : [...events];
        }
      }
    } catch (e) {
      throw new Error(e?.message || `Failed to fetch events`);
    } finally {
      return events;
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

  getEventsWithMoreThanOneSymptomDataElement(events) {
    
    // return filter
  }
}
