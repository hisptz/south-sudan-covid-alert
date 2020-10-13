import { Component, OnInit } from '@angular/core';
import { AppState } from '../../store/reducers';
import { Store } from '@ngrx/store';
import * as fromSelectors from '../../store/selectors';
import * as fromActions from '../../store/actions';
import { Observable } from 'rxjs';
import { FilterByPipe } from 'ngx-pipes';
import { map, flattenDeep } from 'lodash';
import { getFormattedPayload } from 'src/app/shared/helpers/get-formatted-payload.helper';
import { updateReportToRRT } from 'src/app/store/actions/report.actions';
import { MatSnackBar } from '@angular/material';
import { convertExponentialToDecimal } from 'src/app/shared/helpers/convert-exponential-to-decimal.helper';
import { JSON_FILES } from '../../shared/helpers/json-files.helper';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [FilterByPipe],
})
export class HomeComponent implements OnInit {
  eventsAnalytics$: Observable<any>;
  eventsLoading$: Observable<any>;
  page = 1;
  itemsPerPage = 10;
  searchText = '';
  eventToShow = null;
  allRegisteredHeaders = [];
  allRegisteredFilters = [];

  constructor(private store: Store<AppState>, private _snackBar: MatSnackBar) {
    this.allRegisteredHeaders =
      JSON_FILES.allRegisteredHeaders && JSON_FILES.allRegisteredHeaders.headers
        ? JSON_FILES.allRegisteredHeaders.headers
        : [];
    this.allRegisteredFilters = JSON_FILES.allRegisteredHeaders && JSON_FILES.allRegisteredHeaders.filters
    ? JSON_FILES.allRegisteredHeaders.filters
    : [];  
    this.eventsAnalytics$ = store.select(fromSelectors.getEvents);
    this.eventsLoading$ = store.select(fromSelectors.getEventsLoading);
  }

  ngOnInit() {
    this.store.dispatch(fromActions.loadEvents());
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
          eventAnalytic.reportedToRRT &&
          (eventAnalytic.reportedToRRT === 'Yes' ||
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
    const payload = getFormattedPayload(event);
    const id = event && event.psi ? event.psi : '';
    this.store.dispatch(updateReportToRRT({ data: payload, id }));
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
}
