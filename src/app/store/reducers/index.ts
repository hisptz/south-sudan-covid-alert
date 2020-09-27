import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as fromPageState from '../page-state.reducer';


export interface State {

  [fromPageState.pageStatesFeatureKey]: fromPageState.State;
}

export const reducers: ActionReducerMap<State> = {

  [fromPageState.pageStatesFeatureKey]: fromPageState.reducer,
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
