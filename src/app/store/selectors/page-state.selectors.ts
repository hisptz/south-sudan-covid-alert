import { createSelector } from '@ngrx/store';
import * as fromMainReducer from '../reducers';
import * as fromPageStateReducer from '../reducers/page-state.reducer';

export const getPageState = createSelector(
    fromMainReducer.getRootState,
    (state: fromMainReducer.AppState) => state.pageState
);

export const getDownloadDashboardGraphStatus = createSelector(
    getPageState,
    fromPageStateReducer.getDownloadDashboardGraphStatusState
);
