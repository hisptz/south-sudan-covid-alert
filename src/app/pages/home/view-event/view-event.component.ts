import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import { getFormattedAlertPrintOut } from 'src/app/shared/helpers/get-print-out-content.helper';

@Component({
  selector: 'app-view-event',
  templateUrl: './view-event.component.html',
  styleUrls: ['./view-event.component.css'],
})
export class ViewEventComponent implements OnInit {
  @Input() event: any;
  @Input() headers: any[];
  @Output() closeEvent = new EventEmitter<any>();
  constructor() {}

  ngOnInit() {}

  closeSection() {
    this.closeEvent.emit({ closeView: true });
  }

  onPrint() {
    var WinPrint = window.open(
      '',
      '',
      'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0',
    );
    const contents = getFormattedAlertPrintOut(this.headers, [this.event]);
    WinPrint.document.write(contents);
    WinPrint.document.close();
    WinPrint.focus();
    WinPrint.print();
    setTimeout(() => {
      WinPrint.close();
    }, 2 * 1000);
  }
}
