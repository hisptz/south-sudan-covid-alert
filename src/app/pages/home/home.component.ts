import { Component, OnInit } from '@angular/core';
import { AppState } from '../../store/reducers';
import { Store } from '@ngrx/store';
import * as fromSelectors from '../../store/selectors';
import * as fromActions from '../../store/actions';
import { Observable } from 'rxjs';
import { FilterByPipe } from 'ngx-pipes';
import { map, flattenDeep, findIndex } from 'lodash';
import { getFormattedPayload } from 'src/app/shared/helpers/get-formatted-payload.helper';
import { updateReportToRRT } from 'src/app/store/actions/report.actions';
import { MatSnackBar, PageEvent } from '@angular/material';
import { convertExponentialToDecimal } from 'src/app/shared/helpers/convert-exponential-to-decimal.helper';
import { JSON_FILES } from '../../shared/helpers/json-files.helper';
import { commonUsedIds } from '../../shared/models/alert.model';
import { getErrorStatus } from '../../store/selectors';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [FilterByPipe],
})
export class HomeComponent implements OnInit {
  eventsAnalytics$: Observable<any>;
  eventsLoading$: Observable<any>;
  eventsLoadingErrorStatus$: Observable<any>;
  page = 1;
  itemsPerPage = 10;
  searchText = '';
  eventToShow = null;
  allRegisteredHeaders = [];
  allRegisteredFilters = [];
  reportedToRRTHeaders = [];
  reportedToRRTFilters = [];
  reportedToRRTId = commonUsedIds.REPORTED_TO_RRT;
  commonIds = commonUsedIds;
  allHeaders = JSON_FILES.allHeaders;
  pageIndex = 0;
  pageSize = 10;
  lowValue = 0;
  highValue = 10;
  
  rPageIndex = 0;
  rPageSize = 10;
  rLowValue = 0;
  rHighValue = 10;
  constructor(private store: Store<AppState>, private _snackBar: MatSnackBar) {
    this.allRegisteredHeaders =
      JSON_FILES.allRegisteredHeaders && JSON_FILES.allRegisteredHeaders.headers
        ? JSON_FILES.allRegisteredHeaders.headers
        : [];
    this.allRegisteredFilters =
      JSON_FILES.allRegisteredHeaders && JSON_FILES.allRegisteredHeaders.filters
        ? JSON_FILES.allRegisteredHeaders.filters
        : [];
    this.reportedToRRTHeaders =
      JSON_FILES.allRegisteredHeaders && JSON_FILES.reportedToRRTHeaders.headers
        ? JSON_FILES.reportedToRRTHeaders.headers
        : [];
    this.reportedToRRTFilters =
      JSON_FILES.allRegisteredHeaders && JSON_FILES.reportedToRRTHeaders.filters
        ? JSON_FILES.reportedToRRTHeaders.filters
        : [];
    this.eventsAnalytics$ = store.select(fromSelectors.getEvents);
    this.eventsLoading$ = store.select(fromSelectors.getEventsLoading);
  }

  ngOnInit() {
    this.store.dispatch(fromActions.loadEvents());
    this.eventsLoadingErrorStatus$ = this.store.select(getErrorStatus);
  }

  trackByFn(index, item) {
    return item.id;
  }

  searchingItems(e) {
    if (e) {
      e.stopPropagation();
    }
    this.searchText = e ? e.target.value.trim() : this.searchText;
  }

  onUpdatePageSize(e) {
    this.itemsPerPage = e;
  }

  onCurrentPageUpdate(e) {
    this.page = e;
  }

  getEventsWithCallerMeetCase(eventsAnalytics: Array<any>): Array<any> {
    return flattenDeep(
      map(eventsAnalytics || [], (eventAnalytic) => {
        return eventAnalytic &&
          eventAnalytic[this.reportedToRRTId] &&
          (eventAnalytic[this.reportedToRRTId] === 'Yes' ||
            eventAnalytic.isReportToRRTPending)
          ? eventAnalytic
          : [];
      }),
    );
  }
  updateReportToRRT(event) {
    this._snackBar.open('Reporting to RRT', null, {
      duration: 3000,
    });
    // const payload = getFormattedPayload(event);
    const id = event && event.psi ? event.psi : '';
    this.store.dispatch(updateReportToRRT({ data: event, id }));
  }
  showEventData(event) {
    this.eventToShow = event;
  }
  closeEventDataSection(data) {
    if (data && data.closeView) {
      this.eventToShow = null;
    }
  }
  getValidPhone(phone) {
    return phone && convertExponentialToDecimal(phone)
      ? convertExponentialToDecimal(phone)
      : '';
  }
  onPageChange(event) {
    if (event.pageIndex === this.pageIndex + 1) {
      this.lowValue = this.lowValue + this.pageSize;
      this.highValue = this.highValue + this.pageSize;
    } else if (event.pageIndex === this.pageIndex - 1) {
      this.lowValue = this.lowValue - this.pageSize;
      this.highValue = this.highValue - this.pageSize;
    }
    this.pageIndex = event.pageIndex;
  }
  rOnPageChange(event) {
    if (event.pageIndex === this.rPageIndex + 1) {
      this.rLowValue = this.rLowValue + this.rPageSize;
      this.rHighValue = this.rHighValue + this.rPageSize;
    } else if (event.pageIndex === this.rPageIndex - 1) {
      this.rLowValue = this.rLowValue - this.rPageSize;
      this.rHighValue = this.rHighValue - this.rPageSize;
    }
    this.rPageIndex = event.pageIndex;
  }

  getRowNumber(row, analytics: Array<any>) {
    return findIndex(analytics || [], row) + 1;
  }
  
}
