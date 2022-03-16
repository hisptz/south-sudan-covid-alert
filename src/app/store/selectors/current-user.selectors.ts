import { createSelector } from '@ngrx/store';
import { AppState, getRootState } from '../reducers';
import * as _ from 'lodash';
import {
  getCurrentUserLoadedState,
  getCurrentUserLoadingState,
  getUserState,
  getUserSystemInfoState,
} from '../reducers/current-user.reducer';

export const getCurrentUserState = createSelector(
  getRootState,
  (state: AppState) => state.currentUser,
);

export const getCurrentUser = createSelector(getCurrentUserState, getUserState);
export const getSystemInfo = createSelector(
  getCurrentUserState,
  getUserSystemInfoState,
);

export const getLastSuccessfulAnalyticsDate = createSelector(
  getCurrentUserState,
  getSystemInfo,
  (currentUserState, systemInfo) => {
    const unformatedLastSuccessfulAnalyticsDate = systemInfo
      ? systemInfo.keyLastSuccessfulAnalyticsTablesUpdate
      : null;
    const formatedLastSuccessfulAnalyticsDate = _.join(
      _.reverse(
        _.split(
          _.head(_.split(unformatedLastSuccessfulAnalyticsDate, 'T')),
          '-',
        ),
      ),
      '-',
    );
    if (
      unformatedLastSuccessfulAnalyticsDate &&
      formatedLastSuccessfulAnalyticsDate
    ) {
      return `This data is reflection of last analytics time ${formatedLastSuccessfulAnalyticsDate}`;
    }
  },
);

export const getCurrentUserLoading = createSelector(
  getCurrentUserState,
  getCurrentUserLoadingState,
);

export const getCurrentUserLoaded = createSelector(
  getCurrentUserState,
  getCurrentUserLoadedState,
);

export const authorityValidation = (sectionName: string) =>
  createSelector(getCurrentUser, (user: any) => {
    let authorize = false;
    const authorities = user
      ? user.userCredentials
        ? user.userCredentials.userRoles
          ? user.userCredentials.userRoles[0]
            ? user.userCredentials.userRoles[0].authorities
            : []
          : []
        : []
      : [];
    const filteredAuth = authorities.filter((auth) =>
      auth.includes(sectionName),
    );
    if (filteredAuth.includes(sectionName + '_EDIT')) {
      authorize = true;
    } else if (filteredAuth.includes(sectionName + '_VIEW')) {
      authorize = false;
    }
    return authorize;
  });
