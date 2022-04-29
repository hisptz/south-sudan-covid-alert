import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-view-event',
  templateUrl: './view-event.component.html',
  styleUrls: ['./view-event.component.css'],
})
export class ViewEventComponent implements OnInit {
  @Input() event;
  @Input() headers;
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
    const contents = this.getHtmlContents();
    WinPrint.document.write(contents);
    WinPrint.document.close();
    WinPrint.focus();
    WinPrint.print();
    setTimeout(() => {
      WinPrint.close();
    }, 2 * 1000);
  }

  getTableData() {
    const tBody = _.join(
      _.map(this.headers, (header) => {
        const column = header?.column ?? '';
        const value = this.event[header?.name]?.value ?? '';
        return `
      <tr>
        <td><p style="font-weight : bold;">${column}</p></td>
        <td>${value}</td>
      </tr>
        `;
      }),
      '',
    );
    return `
    <table cellSpacing=0 border=1 cellPadding=5 width= 100%>
      <tbody>
        ${tBody}
      <tbody>
    </table>
    
    `;
  }

  getHtmlContents() {
    const tableContent = this.getTableData();
    return `
    <div style="border: 1px solid #000000">
			<div style="border: 1px solid #ffffff">
				<div style="border: 1px solid #da121a">
					<div style="border: 1px solid #ffffff">
						<div style="border: 1px solid #078930">
							<div style="border: 1px solid #fcdd09">
								<div style="border: 1px solid #0f47af">
									<div
										style="
											width: calc(100% - 20px) !important;
											background-image: url(assets/icons/minister.png);
											background-repeat: no-repeat;
											opacity: 0.9;
											background-position: center;
											background-size: 25%;
										"
									>
										<div
											style="
                        margin :10px;
												table-layout: fixed !important;
												width: 100% !important;
												word-wrap: break-word !important;
												word-break: break-all !important;
												margin-bottom: 0px !important;
												background-color: #fff;
												opacity: 0.9;
											"
										>
                      <div style="margin: 10px;text-align:center">
                        <h3>REPUBLIC OF SOUTH SUDAN</h3>
                      <div>
											<div style="text-align:center">
                        <img width="150" src="assets/icons/south-sudan-flag.png" alt="" />
											</div>
                      <div style="margin-top: 5px;text-align:center">
                        <h2>MINISTRY OF HEALTH</h2>
                      <div>
                      <div style="text-align:center">
                        <h4>WATCH DESK ALERT</h4>
                      <div>
											<div style="margin-top: 20px;border-bottom: 20px;">
                        ${tableContent}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>`;
  }
}
