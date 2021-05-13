import { CurrentUserService } from './current-user.service';
import { OrgUnitsService } from './org-units.service';
import { EventsService } from './events.service';
import { PromiseService } from './promise.service';

export const services: any[] = [
  CurrentUserService,
  OrgUnitsService,
  EventsService,
  PromiseService,
];

export * from './current-user.service';
export * from './org-units.service';
export * from './events.service';
export * from './promise.service';
