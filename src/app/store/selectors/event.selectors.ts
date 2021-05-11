import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState, getRootState } from '../reducers';
import { map, keyBy } from 'lodash';
export const getEventState = createSelector(
  getRootState,
  (state: AppState) => state.events,
);

export const getEventsByProgramId = createSelector(
  getEventState,
  (state) => state.events,
);

export const eventsToDisplay = createSelector(
  getEventState,
  getEventsByProgramId,
  (state, events) => {
    return map(events || [], (eventItem) => {
      return {
        ...keyBy(eventItem?.dataValues || [], 'dataElement'),
        event: eventItem?.event,
      };
    });
  },
);
export const getEventsByProgramIdLoading = createSelector(
  getEventState,
  (state) => state.eventsLoading,
);
export const getEventsByProgramIdErrorStatus = createSelector(
  getEventState,
  (state) => state.hasError,
);
