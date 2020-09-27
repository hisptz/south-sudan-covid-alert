import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as fromPaginationHelpers from './pagination.helper';
@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {
  @Input() itemsPerPage: any;

  @Input() currentPage: any;

  @Input() pageInterval: any;

  @Input() pageIntervalFactor: any;

  @Input() dataArray: any;

  @Input() maxSize: any;

  @Output()
  updateItemsPerPage: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  changeCurrentPage: EventEmitter<any> = new EventEmitter<any>();

  pagingIntervals: any;

  constructor() {}
  ngOnInit() {
    if (this.dataArray) {
      this.pagingIntervals = fromPaginationHelpers.generatePaginationEntryList(
        this.maxSize,
        this.pageIntervalFactor
      );
    }
  }

  onSetItemsPerPage(e) {
    if (e) {
      e.stopPropagation();
    }
    const pageSize = e ? e.target.value.trim() : this.itemsPerPage;
    this.updateItemsPerPage.emit((this.itemsPerPage = pageSize));
    this.pageInterval = pageSize;
  }

  onChangeCurrentPage(e) {
    if (e) {
      this.changeCurrentPage.emit((this.currentPage = e));
    }
  }
}
