import { Component, OnInit } from '@angular/core';
import { AppState } from '../../store/reducers';
import { Store } from '@ngrx/store';
import * as fromSelectors from '../../store/selectors';
import * as fromActions from '../../store/actions';
import * as _ from 'lodash';
import * as XLSX from 'xlsx';
import { Observable } from 'rxjs';
import { FilterByPipe } from 'ngx-pipes';
import { map, flattenDeep, findIndex,  } from 'lodash';
import { updateReportToRRT } from 'src/app/store/actions/report.actions';
import { convertExponentialToDecimal } from 'src/app/shared/helpers/convert-exponential-to-decimal.helper';
import { commonUsedIds } from '../../shared/models/alert.model';
import {
  ALL_REGISTERED_HEADERS,
  ALL_REGISTERED_FILTERS,
  REPORTED_TO_RRT_HEADERS,
  REPORTED_TO_RRT_FILTERS,
  ALL_TABLE_HEADERS,
  AUTHORITIES,
} from 'src/app/shared/models/config.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmReportToRrtDialogComponent } from 'src/app/shared/dialogs/confirm-report-to-rrt-dialog/confirm-report-to-rrt-dialog.component';
import { CaseNumberDialogComponent } from 'src/app/shared/dialogs/case-number-dialog/case-number-dialog.component';
import { take } from 'rxjs/operators';
import { getFormattedAlertPrintOut } from 'src/app/shared/helpers/get-print-out-content.helper';
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
  currentUser$: Observable<any>;
  alertsToPrint: any[];
  authorities = AUTHORITIES;
  page = 1;
  itemsPerPage = 10;
  searchText = '';
  eventToShow = null;
  allRegisteredHeaders = [];
  defaultAllRegisteredHeaders = [];
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

  constructor(private store: Store<AppState>, public dialog: MatDialog) {
    this.allRegisteredHeaders = ALL_REGISTERED_HEADERS;
    this.defaultAllRegisteredHeaders = ALL_REGISTERED_HEADERS;
    this.allRegisteredFilters = ALL_REGISTERED_FILTERS;
    this.reportedToRRTHeaders = REPORTED_TO_RRT_HEADERS;
    this.reportedToRRTFilters = REPORTED_TO_RRT_FILTERS;
    this.eventsLoading$ = store.select(
      fromSelectors.getEventsByProgramIdLoading,
    );
    this.eventsByProgramId$ = store.select(fromSelectors.eventsToDisplay);
    this.currentUser$ = store.select(fromSelectors.getCurrentUser);
  }

  ngOnInit() {
    this.alertsToPrint = [];
    this.store.dispatch(fromActions.loadEventsByProgramId());
    this.eventsLoadingErrorStatus$ = this.store.select(
      fromSelectors.getEventsByProgramIdErrorStatus,
    );
  }

  trackByFn(index, item) {
    return item.id;
  }

  isAuthorised(currentUser, authority) {
    return currentUser?.authorities?.includes(authority);
  }

  searchingItems(e, currentUser = null) {
    if (e) {
      e.stopPropagation();
    }
    this.searchText = e ? e.target.value.trim() : this.searchText;
  }

  addCaseNumber(row, caseNumber) {
    const caseApprover = row[this.commonIds.CASE_APPROVER]?.value ?? '';
    caseNumber = caseNumber ?? '';
    const dialogRef = this.dialog.open(CaseNumberDialogComponent, {
      data: {
        eventId: row?.event,
        caseNumber,
        caseApprover,
      },
      height: '350px',
      width: '500px',
    });
    dialogRef.afterClosed().subscribe(() => {});
  }

  onUpdatePageSize(e) {
    this.itemsPerPage = e;
  }

  onCurrentPageUpdate(e) {
    this.page = e;
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
        this.store.dispatch(
          fromActions.showNotification({ message: 'Reporting to RRT' }),
        );
        const data = {
          event: row?.event,
          dataValues: { dataElement: this.reportedToRRTId, value: true },
        };
        this.store.dispatch(updateReportToRRT({ data, id: row?.event }));
      }
    });
  }

  selectAlertForPrint(eventObj: any) {
    if (this.eventToShow === null) {
      if (this.alertsToPrint.includes(eventObj)) {
        this.alertsToPrint = _.filter(
          this.alertsToPrint,
          (event) => event !== eventObj,
        );
      } else {
        this.alertsToPrint.push(eventObj);
      }
    }
  }

  selectedTabChange() {
    this.allRegisteredHeaders = ALL_REGISTERED_HEADERS;
    this.reportedToRRTHeaders = REPORTED_TO_RRT_HEADERS;
    this.eventToShow = null;
    this.alertsToPrint = [];
  }

  onPrintAlerts() {
    var WinPrint = window.open(
      '',
      '',
      'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0',
    );
    console.log(this.alertsToPrint.length);
    const contents = getFormattedAlertPrintOut(
      this.allHeaders,
      this.alertsToPrint,
    );
    WinPrint.document.write(contents);
    WinPrint.document.close();
    WinPrint.focus();
    WinPrint.print();
    setTimeout(() => {
      WinPrint.close();
    }, 2 * 1000);
    this.alertsToPrint = [];
  }

  onDownloadAllAlert() {
    this.eventsByProgramId$.pipe(take(1)).subscribe((data) => {
      this.onDownloadDataInExcel(
        this.defaultAllRegisteredHeaders,
        data,
        'All registed Alerts',
      );
    });
  }

  onDownloadConfirmedAlert() {
    this.eventsByProgramId$.pipe(take(1)).subscribe((data) => {
      this.onDownloadDataInExcel(
        this.reportedToRRTHeaders,
        this.getReportedToRRTEvents(data),
        'Reported to RRT',
      );
    });
  }

  async onDownloadDataInExcel(headers: any, data: any[], fileName: string) {
    var ws = XLSX.utils.json_to_sheet(
      _.flattenDeep(
        _.map(data, (dataObj: any) => {
          const newData = {};
          for (const header of headers) {
            const id = header?.name ?? '';
            const columnName = header?.column ?? '';
            if (id !== '' && columnName !== '') {
              const value = dataObj[id]?.value ?? '';
              newData[columnName] = `${value}`;
            }
          }
          return newData;
        }),
      ),
    );
    let workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, ws, 'Sheet');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  }

  showEventData(event, header = null) {
    if (header === commonUsedIds.CASE_NUMBER) {
      this.eventToShow = null;
    } else {
      this.allRegisteredHeaders = this.allRegisteredHeaders.slice(0, 6);
      this.eventToShow = event;
      this.alertsToPrint = [event];
    }
  }

  closeEventDataSection(data: any) {
    if (data && data.closeView) {
      this.selectedTabChange();
    }
  }

  getValidPhone(phone: any) {
    return phone && convertExponentialToDecimal(phone)
      ? convertExponentialToDecimal(phone)
      : '';
  }

  onPageChange(event: any) {
    if (event.pageIndex === this.pageIndex + 1) {
      this.lowValue = this.lowValue + this.pageSize;
      this.highValue = this.highValue + this.pageSize;
    } else if (event.pageIndex === this.pageIndex - 1) {
      this.lowValue = this.lowValue - this.pageSize;
      this.highValue = this.highValue - this.pageSize;
    }
    this.pageIndex = event.pageIndex;
  }

  rOnPageChange(event: any) {
    if (event.pageIndex === this.rPageIndex + 1) {
      this.rLowValue = this.rLowValue + this.rPageSize;
      this.rHighValue = this.rHighValue + this.rPageSize;
    } else if (event.pageIndex === this.rPageIndex - 1) {
      this.rLowValue = this.rLowValue - this.rPageSize;
      this.rHighValue = this.rHighValue - this.rPageSize;
    }
    this.rPageIndex = event.pageIndex;
  }

  getRowNumber(row: any, analytics: Array<any>) {
    return findIndex(analytics || [], row) + 1;
  }
}
