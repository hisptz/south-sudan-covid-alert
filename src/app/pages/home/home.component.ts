import { Component, OnInit } from '@angular/core';
import { AppState } from '../../store/reducers';
import { Store } from '@ngrx/store';
import * as fromSelectors from '../../store/selectors';
import * as fromActions from '../../store/actions';
import { Observable } from 'rxjs';
import { FilterByPipe } from 'ngx-pipes';
import { map, flattenDeep, findIndex, filter } from 'lodash';
import { getFormattedPayload } from 'src/app/shared/helpers/get-formatted-payload.helper';
import { updateReportToRRT } from 'src/app/store/actions/report.actions';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { convertExponentialToDecimal } from 'src/app/shared/helpers/convert-exponential-to-decimal.helper';
import { JSON_FILES } from '../../shared/helpers/json-files.helper';
import { commonUsedIds } from '../../shared/models/alert.model';
import {
  ALL_REGISTERED_HEADERS,
  ALL_REGISTERED_FILTERS,
  REPORTED_TO_RRT_HEADERS,
  REPORTED_TO_RRT_FILTERS,
  ALL_TABLE_HEADERS,
} from 'src/app/shared/models/config.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmReportToRrtDialogComponent } from 'src/app/shared/dialogs/confirm-report-to-rrt-dialog/confirm-report-to-rrt-dialog.component';
import { CaseNumberDialogComponent } from 'src/app/shared/dialogs/case-number-dialog/case-number-dialog.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [FilterByPipe],
})
export class HomeComponent implements OnInit {
  eventsByProgramId$: Observable<any>;
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
  allHeaders = ALL_TABLE_HEADERS;
  pageIndex = 0;
  pageSize = 10;
  lowValue = 0;
  highValue = 10;

  rPageIndex = 0;
  rPageSize = 10;
  rLowValue = 0;
  rHighValue = 10;
  constructor(
    private store: Store<AppState>,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {
    this.allRegisteredHeaders = ALL_REGISTERED_HEADERS;
    this.allRegisteredFilters = ALL_REGISTERED_FILTERS;
    this.reportedToRRTHeaders = REPORTED_TO_RRT_HEADERS;
    this.reportedToRRTFilters = REPORTED_TO_RRT_FILTERS;
    this.eventsLoading$ = store.select(
      fromSelectors.getEventsByProgramIdLoading,
    );
    this.eventsByProgramId$ = store.select(fromSelectors.eventsToDisplay);
  }

  ngOnInit() {
    this.store.dispatch(fromActions.loadEventsByProgramId());
    this.eventsLoadingErrorStatus$ = this.store.select(
      fromSelectors.getEventsByProgramIdErrorStatus,
    );
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

  addCaseNumber(row, caseNumber) {
    const dialogRef = this.dialog.open(CaseNumberDialogComponent, {
      data: {
        eventId: row?.event,
        caseNumber
      },
      height: '250px',
      width: '500px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.reportToRRT) {
        this._snackBar.open('Saving case number', null, {
  
          duration: 3000,
        });
        const data = {
          event: row?.event,
          dataValues: { dataElement: this.reportedToRRTId, value: true },
        };
        this.store.dispatch(updateReportToRRT({ data, id: row?.event }));
      }
    });
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
  getReportedToRRTEvents(eventsAnalytics: Array<any>): Array<any> {
    return flattenDeep(
      map(eventsAnalytics || [], (eventAnalytic) => {
        return eventAnalytic[this.reportedToRRTId] &&
          eventAnalytic[this.reportedToRRTId]?.value === 'Yes'
          ? eventAnalytic
          : [];
      }),
    );
  }
  updateReportToRRT(row) {
    const dialogRef = this.dialog.open(ConfirmReportToRrtDialogComponent, {
      data: {
        firstName: row[commonUsedIds?.CALLER_FIRST_NAME]?.value,
        lastName: row[commonUsedIds?.CALLER_LAST_NAME]?.value,
      },
      height: '150px',
      width: '500px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.reportToRRT) {
        this._snackBar.open('Reporting to RRT', null, {
          duration: 3000,
        });
        const data = {
          event: row?.event,
          dataValues: { dataElement: this.reportedToRRTId, value: true },
        };
        this.store.dispatch(updateReportToRRT({ data, id: row?.event }));
      }
    });
  }
  showEventData(event, header = null, value = null) {
    if (header === commonUsedIds.CASE_NUMBER) {
      this.eventToShow = null;
    } else {
      this.allRegisteredHeaders = this.allRegisteredHeaders.slice(0, 4);
      this.eventToShow = event;
    }
  }
  closeEventDataSection(data) {
    if (data && data.closeView) {
      this.allRegisteredHeaders = ALL_REGISTERED_HEADERS;
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
