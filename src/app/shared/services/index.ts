import { CurrentUserService } from './current-user.service';
import { AnalyticsService } from './analytics.service';

export const services: any[] = [
    CurrentUserService, AnalyticsService
];

export * from './current-user.service';
export * from './analytics.service';

