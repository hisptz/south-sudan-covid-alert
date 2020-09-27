import { RouterReducerState, getSelectors } from '@ngrx/router-store';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromMainReducer from '../reducers';


export const getRouterState = createSelector(
  fromMainReducer.getRootState,
  (state: fromMainReducer.AppState) => state.router
);

const {
  selectQueryParams: getQueryParams, // select the current route query params
  selectRouteParams: getRouteParams, // select the current route params
  selectRouteData: getRouteData, // select the current route data
  selectUrl: getUrl // select the current url
} = getSelectors(getRouterState);

export const getRouterUrl = createSelector(
  getRouterState,
  routeState =>
    routeState && routeState.state && routeState.state.url
      ? routeState.state.url.split('?')[0]
      : ''
);

export const getRouterParams = createSelector(
  getRouterState,
  (routeState: any) =>
    routeState && routeState.state && routeState.state.queryParams
      ? routeState.state.queryParams
      : {}
);
