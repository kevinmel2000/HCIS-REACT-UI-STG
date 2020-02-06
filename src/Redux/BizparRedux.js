import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({

    getBizpar: ['data'],
    getBizparSuccess: ['payload'],
    getBizparFailure: ['error'],

    resetStateBizpar: null
});

export const BizparTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
	fetching: null,
	error: null,
    bizpar: null
});

/* ------------- Selectors ------------- */

export const bizparSelectors = {
	getData: state => state.data
};

/* ------------- Reducers ------------- */

// request the data from an api
export const requestBizpar = (state, { data }) => state.merge({ fetching: true, error: null, bizpar: null });

// successful api lookup

export const successBizpar = (state, action) => {
	const { payload } = action;
	return state.merge({ fetching: false, error: null, bizpar: payload });
};

// Something went wrong somewhere.
export const failure = state => state.merge({ fetching: false, error: true });

export const resetState = state => state.merge({ fetching: false, error: null });



/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
    [Types.GET_BIZPAR]: requestBizpar,
	[Types.GET_BIZPAR_SUCCESS]: successBizpar,
    [Types.GET_BIZPAR_FAILURE]: failure,
	[Types.RESET_STATE_BIZPAR]: resetState,
});
