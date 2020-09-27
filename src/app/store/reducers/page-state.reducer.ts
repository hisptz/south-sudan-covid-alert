import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import * as PageStateActions from '../actions/page-state.actions';
import { PageState, NotificationState } from '../models';

export const pageStatesFeatureKey = 'pageStates';

export interface State extends EntityState<PageState> {
  // additional entities state properties
  notification: NotificationState;
  notificationStatus: boolean;
  downloadGraphs: boolean;
}

export const adapter: EntityAdapter<PageState> = createEntityAdapter<
  PageState
>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  notification: { message: '', statusCode: 0 },
  notificationStatus: false,
  downloadGraphs: false
});

const pageStateReducer = createReducer(
  initialState,
  on(PageStateActions.addPageState, (state, action) =>
    adapter.addOne(action.pageState, state)
  ),
  on(PageStateActions.upsertPageState, (state, action) =>
    adapter.upsertOne(action.pageState, state)
  ),
  on(PageStateActions.addPageStates, (state, action) =>
    adapter.addMany(action.pageStates, state)
  ),
  on(PageStateActions.upsertPageStates, (state, action) =>
    adapter.upsertMany(action.pageStates, state)
  ),
  on(PageStateActions.updatePageState, (state, action) =>
    adapter.updateOne(action.pageState, state)
  ),
  on(PageStateActions.updatePageStates, (state, action) =>
    adapter.updateMany(action.pageStates, state)
  ),
  on(PageStateActions.deletePageState, (state, action) =>
    adapter.removeOne(action.id, state)
  ),
  on(PageStateActions.updateNotification, (state, action) => ({
    ...state,
    notification: action.payload,
    notificationStatus: true,
  })),
  on(PageStateActions.updateNotificationStatus, (state, action) => ({
    ...state,
    notificationStatus: action.payload,
  })),
  on(PageStateActions.downloadDashboardGraphs, (state, action) => ({
    ...state,
    downloadGraphs: action.payload
  })),
  on(PageStateActions.clearPageStates, (state) => adapter.removeAll(state))
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

export const getDownloadDashboardGraphStatusState = (state: State) => state.downloadGraphs;
