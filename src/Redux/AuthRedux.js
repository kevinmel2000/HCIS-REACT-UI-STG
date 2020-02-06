import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
	authRequest: ['data'],
	authSuccess: ['payload'],
	authFailure: ['error'],
	authLogout: [],
	authUserUpdate: ['data'],
	authLoginCheck: null
});

export const AuthTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
	fetching: null,
	error: null,
	user: null
});

/* ------------- Selectors ------------- */

export const AuthSelectors = {
	getData: state => state.data
};

/* ------------- Reducers ------------- */

// request the data from an api
export const request = (state, { data }) => state.merge({ fetching: true, error: null, user: null });

// successful api lookup
export const success = (state, action) => {
	const { payload } = action;
	return state.merge({ fetching: false, error: null, user: payload });
};

// Something went wrong somewhere.
export const failure = (state, { error }) => state.merge({ fetching: false, error });

export const logout = state => state.merge({ fetching: false, error: null, user: null });

export const userUpdate = (state, { data }) => state.merge({ fetching: true, error: null });

export const authLoginCheck = state => state.merge({ fetching: false });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
	[Types.AUTH_REQUEST]: request,
	[Types.AUTH_SUCCESS]: success,
	[Types.AUTH_FAILURE]: failure,
	[Types.AUTH_LOGOUT]: logout,
	[Types.AUTH_USER_UPDATE]: userUpdate,
	[Types.AUTH_LOGIN_CHECK]: authLoginCheck
});
