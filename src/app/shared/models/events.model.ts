export interface EventResponse {
  orgUnit: string;
  orgUnitName: string;
  program: string;
  event: string;
  dataValues: Array<{ dataElement: string; value: string }>;
}
