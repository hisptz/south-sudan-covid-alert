import { JSON_FILES } from './json-files.helper';
import { map, find } from 'lodash';
import { commonUsedIds } from '../models/alert.model';

export function getFormattedPayload1(eventRow) {
  const event = eventRow && eventRow.psi ? eventRow.psi : '';
  const reportedToRRTValue = 'Yes';
  let payload = JSON_FILES.payload;
  payload = { ...payload, event };

  const dataValues = map(payload.dataValues || [], (dataValue) => {
    let updatedDataValue = dataValue;
    if (
      eventRow &&
      dataValue &&
      dataValue.dataElement &&
      dataValue.dataElement === 's4jPdjTj69G'
    ) {
      let value = '';
      switch (dataValue.dataElement) {
        case 's4jPdjTj69G':
          updatedDataValue = { ...updatedDataValue, value: reportedToRRTValue };
          break;
        case 'EicmBDTb8Zm':
          value = eventRow.reasoncalling ? eventRow.reasoncalling : '';
          updatedDataValue = { ...updatedDataValue, value };
          break;
        case 'Pe3CHmZicqT':
          value = eventRow.age ? eventRow.age : '';
          updatedDataValue = { ...updatedDataValue, value };
          break;
        case 'ZRo6gpevFmy':
          value = eventRow.signsreported ? eventRow.signsreported : '';
          updatedDataValue = { ...updatedDataValue, value };
          break;
        case 'QsEoQSQUEso':
          value = eventRow.recordissues ? eventRow.recordissues : '';
          updatedDataValue = { ...updatedDataValue, value };
          break;
        case 'dxyEuWRce8l':
          value = eventRow.phone ? eventRow.phone : '';
          updatedDataValue = { ...updatedDataValue, value };
          break;
        case 'UATjIK2KUVd':
          value = eventRow.nameofcallhandler ? eventRow.nameofcallhandler : '';
          updatedDataValue = { ...updatedDataValue, value };
          break;
        case 'FEJYpBRI2tw':
          value = eventRow.callmissed ? eventRow.callmissed : '';
          updatedDataValue = { ...updatedDataValue, value };
          break;
        case 'K6ciAYeQKWL':
          value = eventRow.sex ? eventRow.sex : '';
          updatedDataValue = { ...updatedDataValue, value };
          break;
        case 'a0C28yEISxc':
          value = eventRow.nameofcaller ? eventRow.nameofcaller : '';
          updatedDataValue = { ...updatedDataValue, value };
          break;

        case 'sbwDPRnLzYY':
          value = eventRow.specificquestion ? eventRow.specificquestion : '';
          updatedDataValue = { ...updatedDataValue, value };
          break;
        case 'g7EpCKIysgQ':
          value = eventRow.callermeetcase ? eventRow.callermeetcase : '';
          updatedDataValue = { ...updatedDataValue, value };
          break;
        case 'rBoJRVqlWpD':
          value = eventRow.actiontaken ? eventRow.actiontaken : '';
          updatedDataValue = { ...updatedDataValue, value };
          break;
        case 'm8d3rAwFrCb':
          value = eventRow.casereferred ? eventRow.casereferred : '';
          updatedDataValue = { ...updatedDataValue, value };
          break;
        default:
          updatedDataValue = { ...updatedDataValue };
      }
    }
    return updatedDataValue;
  });
  console.log({ eventRow, event, payload, dataValues });
  payload = { ...payload, dataValues };
  return payload;
}
export function getFormattedPayload(eventData, payload) {
  const dataValues = map(payload.dataValues || [], (dataValue) => {
    const headers = JSON_FILES.allHeaders;
    if (dataValue && dataValue.dataElement) {
      const header = find(
        headers || [],
        (item) =>
          item.name === dataValue.dataElement && item.valueType === 'BOOLEAN',
      );
      let value = eventData[dataValue.dataElement];
      if (header) {
        value = getValidBooleanType(eventData[dataValue.dataElement]);
      } else if (dataValue.dataElement === commonUsedIds.REPORTED_TO_RRT) {
        value = 'No';
      }

      return { ...dataValue, value };
    }
    return dataValue;
  });
  return { ...payload, dataValues };
}
function getValidBooleanType(value) {
  return value === 'Yes' ? 1 : 0;
}
