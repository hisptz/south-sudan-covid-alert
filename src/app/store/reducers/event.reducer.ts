import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import {
  loadEventsByProgramId,
  loadEventsByProgramIdFailure,
  loadEventsByProgramIdSuccess,
} from '../actions';
import { NotificationState } from '../../shared/models';

export const eventFeatureKey = 'events';

export interface EventState extends EntityState<any> {
  notification: NotificationState;
  notificationStatus: boolean;
  events: any;
  eventsLoading: boolean;
  hasError: boolean;
}
export const adapter: EntityAdapter<any> = createEntityAdapter<any>();

export const initialState: EventState = adapter.getInitialState({
  // additional entity state properties
  notification: { message: '', statusCode: 0 },
  notificationStatus: false,
  events: [],
  eventsLoading: true,
  hasError: false,
});

export const eventReducer = createReducer(
  initialState,
  on(loadEventsByProgramId, (state, action) => ({
    ...state,
    eventsLoading: true,
  })),
  on(loadEventsByProgramIdSuccess, (state, { events, isCompleted }) =>{
    return ({
      ...state,
      eventsLoading: isCompleted ?  false : true,
      hasError: false,
      events,
    });
  }),
  on(loadEventsByProgramIdFailure, (state, action) => ({
    ...state,
    eventsLoading: false,
    hasError: true,
  })),
);

export function reducer(state: EventState | undefined, action: Action) {
  return eventReducer(state, action);
}
