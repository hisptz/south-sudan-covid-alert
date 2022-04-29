import { flattenDeep, map, join } from 'lodash';

export function getFormattedAlertPrintOut(headers: any[], eventObjs: any[]) {
  return join(
    flattenDeep(
      map(eventObjs, (eventObj: any) => {
        const content = getHtmlContents(headers, eventObj);
        return ` <div style=page-break-before:always align="center""></div>
    ${content}
  `;
      }),
    ),
    '',
  );
}

function getTableData(headers: any[], eventObj: any) {
  const tBody = join(
    map(headers, (header: any) => {
      const column = header?.column ?? '';
      const value = eventObj[header?.name]?.value ?? '';
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

function getHtmlContents(headers: any[], eventObj: any) {
  const tableContent = getTableData(headers, eventObj);
  return `
    <div style="border: 1px solid #000000 " >
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
                      </div>
											<div style="text-align:center">
                        <img width="150" src="assets/icons/south-sudan-flag.png" alt="" />
											</div>
                      <div style="margin-top: 5px;text-align:center">
                        <h2>MINISTRY OF HEALTH</h2>
                      </div>
                      <div style="text-align:center">
                        <h4>WATCH DESK ALERT</h4>
                      </div>
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
