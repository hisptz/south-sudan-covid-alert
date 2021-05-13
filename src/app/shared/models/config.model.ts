import { JSON_FILES } from '../helpers/json-files.helper';

export const METADATA = JSON_FILES?.metadata || {};

export const PROGRAM_ID = METADATA?.programId || '';
export const ORGUNIT_ID = METADATA?.orgUnitId || '';
export const REASON_FOR_CALLING_ID =
  METADATA?.dataElements?.reasonForCalling?.id || '';
export const REASON_FOR_CALLING_VALUE =
  METADATA?.dataElements?.reasonForCalling?.preferredValue || '';
export const SYMPTOM_IDS = METADATA?.dataElements?.symptomIds;
export const ALL_TABLE_HEADERS = JSON_FILES.allHeaders;
export const ALL_REGISTERED_HEADERS = JSON_FILES?.allRegisteredHeaders?.headers;
export const ALL_REGISTERED_FILTERS = JSON_FILES?.allRegisteredHeaders?.filters;
export const REPORTED_TO_RRT_HEADERS = JSON_FILES.reportedToRRTHeaders?.headers;
export const REPORTED_TO_RRT_FILTERS = JSON_FILES.reportedToRRTHeaders?.filters;
export const AUTHORITIES = {
  VIEW_REGISTERED_CALLS: 'VIEW_REGISTERED_CALLS',
  VIEW_REPORTED_TO_RRT: 'VIEW_REPORTED_TO_RRT',
  UPDATE_CASE_NUMBER: 'UPDATE_CASE_NUMBER',
  REPORT_TO_RRT: 'REPORT_TO_RRT',
};
export enum NotificationType {
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
  INFO = 'INFO',
}
