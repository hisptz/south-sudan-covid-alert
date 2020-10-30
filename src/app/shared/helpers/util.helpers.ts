import { commonUsedIds, definedSysmptoms } from '../models/alert.model';
import { convertExponentialToDecimal } from './convert-exponential-to-decimal.helper';
import { flattenDeep } from 'lodash';
import { calculateAge } from './calculate-age.helper';

export function removeAnalyticsheaders(analytics, headersToRemove) {
  const newAnalytics = { ...analytics };
  headersToRemove.forEach((head) => {
    const dataIndex = newAnalytics.headers.map((e) => e.column).indexOf(head);
    const headerItem = newAnalytics.headers[dataIndex];
    // splice analytics headers
    newAnalytics.headers = newAnalytics.headers.filter(
      (header) => header.column !== headerItem.column,
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
  const newVersion = transformAnalytics1(analytics);
  const headers = analytics.headers;
  const transformedData = (analytics.rows || []).map((row) => {
    let reportedToRRT =
      row[itemIndex(headers, 'Reported to RRT for follow up')];
    reportedToRRT =
      reportedToRRT === 'Yes' || reportedToRRT === '1' || reportedToRRT === 1
        ? 'Yes'
        : 'No';
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
      signsreported:
        row[itemIndex(headers, 'which signs & symptoms did they reported?')],
      recordissues:
        row[itemIndex(headers, 'Record any myths, issues, concerns')],
      nameofcallhandler: row[itemIndex(headers, 'Name of Phone Call Handler')],
      specificquestion:
        row[itemIndex(headers, 'Specific question about Diseases ')],
      callermeetcase:
        row[
          itemIndex(
            headers,
            'Did the caller meet case definition of COVID19 Cases',
          )
        ],
      actiontaken: row[itemIndex(headers, 'Action Taken')],
      casereferred: row[itemIndex(headers, 'Case Referred to')],
      reportedToRRT,
    };
  });
  return transformedData;
}
export function transformAnalytics1(analytics) {
  const headers = analytics && analytics.headers ? analytics.headers : [];
  // const rows = analytics && analytics.rows ? analytics.rows : [];

  const transformedData = (analytics.rows || []).map((row) => {
    let obj = {};
    let symptoms = [];
    if (headers && headers.length) {
      for (const header of headers) {
        let value = '';
        value = getHeaderValue(row[itemIndex1(headers, header.name)], header);
        const definedSysmptom = getDefinedSysmptom(header, value);
        symptoms = definedSysmptom
          ? [...symptoms, definedSysmptom]
          : [...symptoms];
        obj =
          header && header.name ? { ...obj, [header.name]: value } : { ...obj };
      }
    }
    obj = { ...obj, symptoms };
    return obj &&
      obj[commonUsedIds.REASON_FOR_CALLING] &&
      obj[commonUsedIds.REASON_FOR_CALLING] === 'Sickness'
      ? obj
      : [];
  });
  return flattenDeep(transformedData);
}

export function itemIndex(headers, headername) {
  const itemindex = (headers || []).findIndex(
    (head) => head.column === headername,
  );
  return itemindex;
}
export function itemIndex1(headers, headername) {
  const itemindex = (headers || []).findIndex(
    (head) => head.name === headername,
  );
  return itemindex;
}
function getHeaderValue(rowValue, header) {
  if (header && header.valueType && header.valueType === 'BOOLEAN') {
    return rowValue === '1' ? 'Yes' : 'No';
  }
  if (header && header.name && header.name === commonUsedIds.PHONE_NUMBER) {
    return convertExponentialToDecimal(rowValue) === '0.0'
      ? 0
      : convertExponentialToDecimal(rowValue);
  }
  if (header && header.name && header.name === commonUsedIds.SEX) {
    if (rowValue === '01') {
      return 'Male';
    } else if (rowValue === '02') {
      return 'Female';
    } else {
      return rowValue;
    }
  }
  if (header && header.name && header.name === commonUsedIds.AGE) {
    const birthDate = new Date(rowValue);
    return calculateAge(birthDate) ? calculateAge(birthDate) : '';
  }

  return rowValue;
}
function getDefinedSysmptom(header, value) {
  let symptomValue = '';
  if (definedSysmptoms && definedSysmptoms.length) {
    for (const symptom of definedSysmptoms) {
      if (
        header &&
        symptom &&
        symptom.id &&
        header.name === symptom.id &&
        value === 'Yes'
      ) {
        if (symptomValue) {
          symptomValue = symptom.name
            ? 'symptomValue' + ' ' + symptom.name
            : symptomValue;
        } else {
          symptomValue = symptom.name ? `${symptom.name}` : symptomValue;
        }
      }
    }
  }
  return symptomValue;
}
