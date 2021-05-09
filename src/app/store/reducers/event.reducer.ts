import { Action, createReducer, on } from '@ngrx/store';


export const eventFeatureKey = 'event';

export interface State {

}

export const initialState: State = {

};

const eventReducer = createReducer(
  initialState,

);

export function reducer(state: State | undefined, action: Action) {
  return eventReducer(state, action);
}
