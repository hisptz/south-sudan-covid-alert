export function removeAnalyticsheaders(analytics, headersToRemove) {
  const newAnalytics = { ...analytics };
  headersToRemove.forEach((head) => {
    const dataIndex = newAnalytics.headers.map((e) => e.column).indexOf(head);
    const headerItem = newAnalytics.headers[dataIndex];
    // splice analytics headers
    newAnalytics.headers = newAnalytics.headers.filter(
      (header) => header.column !== headerItem.column
    );
    newAnalytics.rows = (newAnalytics.rows || []).map((row) => {
      const newRow = [];
      row.forEach((item, index) => {
        if (index !== dataIndex) {
          newRow.push(item);
        }
      });
      return newRow;
    });
  });
  return newAnalytics;
}

export function transformAnalytics(analytics) {
  const headers = analytics.headers;
  const transformedData = (analytics.rows || []).map((row) => {
    let reportedToRRT =
      row[itemIndex(headers, 'Reported to RRT for follow up')];
    reportedToRRT =
      reportedToRRT === 'Yes' || reportedToRRT === '1' || reportedToRRT === 1 ? 'Yes' : 'No';
    return {
      psi: row[itemIndex(headers, 'Event')],
      eventdate: row[itemIndex(headers, 'Event date')],
      nameofcaller: row[itemIndex(headers, 'Name of caller')],
      sex: row[itemIndex(headers, 'Sex')],
      age: row[itemIndex(headers, 'Age')],
      phone: row[itemIndex(headers, 'Phone number')],
      callmissed: row[itemIndex(headers, 'Was call missed or picked')],
      reasoncalling: row[itemIndex(headers, 'Reason for calling 6666')],
      orgunitname: row[itemIndex(headers, 'Organisation unit name')],
      orgunitid: row[itemIndex(headers, 'Organisation unit')],
      specificquestion:
        row[itemIndex(headers, 'Specific question about Diseases ')],
      callermeetcase:
        row[
          itemIndex(
            headers,
            'Did the caller meet case definition of COVID19 Cases'
          )
        ],
      actiontaken: row[itemIndex(headers, 'Action Taken')],
      casereferred: row[itemIndex(headers, 'Case Referred to')],
      reportedToRRT
    };
  });
  return transformedData;
}

export function itemIndex(headers, headername) {
  const itemindex = (headers || []).findIndex(
    (head) => head.column === headername
  );
  return itemindex;
}
