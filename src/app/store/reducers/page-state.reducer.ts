import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import * as PageStateActions from '../actions/page-state.actions';
import { PageState, NotificationState } from '../models';
import * as fromHelpers from '../../shared/helpers';

export const pageStatesFeatureKey = 'pageStates';

export interface State extends EntityState<PageState> {
  // additional entities state properties
  notification: NotificationState;
  notificationStatus: boolean;
  events: any;
  eventsLoading: boolean;
  hasError: boolean;
}

export const adapter: EntityAdapter<PageState> = createEntityAdapter<
  PageState
>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  notification: { message: '', statusCode: 0 },
  notificationStatus: false,
  events: [],
  eventsLoading: true,
  hasError: false,
});

const pageStateReducer = createReducer(
  initialState,
  on(PageStateActions.loadNotification, (state, action) => ({
    ...state,
    notification: action.payload,
    notificationStatus: true,
  })),

);

export function reducer(state: State | undefined, action: Action) {
  return pageStateReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();

export const getEventsState = (state: State) => state.events;
export const getEventsLoadingState = (state: State) => state.eventsLoading;
