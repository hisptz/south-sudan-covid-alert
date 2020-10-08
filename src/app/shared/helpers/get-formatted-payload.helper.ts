import { JSON_FILES } from './json-files.helper';
import { map } from 'lodash';

export function getFormattedPayload(eventRow) {
  const event = eventRow && eventRow.psi ? eventRow.psi : '';
  const reportedToRRTValue = 'Yes';
  let payload = JSON_FILES.payload;
  payload = { ...payload, event };

  const dataValues = map(payload.dataValues || [], (dataValue) => {
    let updatedDataValue = dataValue;
    if (
      dataValue &&
      dataValue.dataElement &&
      dataValue.dataElement === 's4jPdjTj69G'
    ) {
      updatedDataValue = { ...updatedDataValue, value: reportedToRRTValue };
    }
    return updatedDataValue;
  });
  console.log({ eventRow, event, payload, dataValues });
  payload = { ...payload, dataValues };
  return payload;
}
