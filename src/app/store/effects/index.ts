import { CurrentUserEffects } from './current-user.effects';
import { EventEffects } from './event.effects';
import { ReportEffects } from './report.effects';
import { RouterEffects } from './router.effects';

export const effects: any[] = [
    CurrentUserEffects, 
    RouterEffects, ReportEffects, EventEffects
];
