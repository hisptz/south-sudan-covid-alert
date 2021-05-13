import { CurrentUserEffects } from './current-user.effects';
import { EventEffects } from './event.effects';
import { PageStateEffects } from './page-state.effects';
import { ReportEffects } from './report.effects';
import { RouterEffects } from './router.effects';

export const effects: any[] = [
    CurrentUserEffects, 
    RouterEffects, ReportEffects, EventEffects, PageStateEffects
];
