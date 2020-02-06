import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
	getAllMovement: ['data'],
	getAllMovementSuccess: ['payload'],
	getAllMovementFailure: ['error'],

    resetStatePersonal: null
});

export const PersonalTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
	fetching: null,
	error: null,
	movement: null
});

/* ------------- Selectors ------------- */

export const personalSelectors = {
	getData: state => state.data
};

/* ------------- Reducers ------------- */

// request the data from an api
export const request = (state, { data }) => state.merge({ fetching: true, error: null, movement: null });

// successful api lookup
export const success = (state, action) => {
	const { payload } = action;
	return state.merge({ fetching: false, error: null, movement: payload });
};

// Something went wrong somewhere.
export const failure = state => state.merge({ fetching: false, error: true });

export const resetState = state => state.merge({ fetching: false, error: null });



/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
	[Types.GET_ALL_MOVEMENT]: request,
	[Types.GET_ALL_MOVEMENT_SUCCESS]: success,
	[Types.GET_ALL_MOVEMENT_FAILURE]: failure,
	[Types.RESET_STATE_PERSONAL]: resetState,
});
