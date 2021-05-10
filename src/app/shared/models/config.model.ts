import { JSON_FILES } from '../helpers/json-files.helper';

export const METADATA = JSON_FILES?.metadata || {};

export const PROGRAM_ID = METADATA?.programId || '';
export const ORGUNIT_ID = METADATA?.orgUnitId || '';
export const REASON_FOR_CALLING_ID =
  METADATA?.dataElements?.reasonForCalling?.id || '';
export const REASON_FOR_CALLING_VALUE =
  METADATA?.dataElements?.reasonForCalling?.preferredValue || '';
export const SYMPTOM_IDS = METADATA?.dataElements?.sysmptomsIds;
