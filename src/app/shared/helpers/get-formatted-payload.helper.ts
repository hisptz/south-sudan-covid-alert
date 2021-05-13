import { find } from 'lodash';

export function getFormattedPayloadForUpdate(payload, dataValueId, value) {
  let reportToRrtObj = find(
    payload?.dataValues || [],
    (dataValue) => dataValue?.dataElement === dataValueId,
  );
  reportToRrtObj = reportToRrtObj
    ? { ...reportToRrtObj, value }
    : { dataElement: dataValueId, value };
  return {
    ...payload,
    dataValues: [reportToRrtObj],
  };
}
