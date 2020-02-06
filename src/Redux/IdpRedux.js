import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
	getRole: ['data'],
	getRoleSuccess: ['payload'],
	getRoleFailure: ['error'],

	getRoleName: ['data'],
	getRoleNameSuccess: ['payload'],
	getRoleNameFailure: ['error'],

    getUser: ['data'],
	getUserSuccess: ['payload'],
	getUserFailure: ['error'],

	getUserName: ['data'],
	getUserNameSuccess: ['payload'],
	getUserNameFailure: ['error'],

    resetStateIdp: null
});

export const IdpTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
	fetching: null,
	error: null,
    role: null,
	user: null,
	userName: null,
	roleName: null
});

/* ------------- Selectors ------------- */

export const idpSelectors = {
	getData: state => state.data
};

/* ------------- Reducers ------------- */

// request the data from an api
export const request = (state, { data }) => state.merge({ fetching: true, error: null, role: null });
export const requestRoleName = (state, { data }) => state.merge({ fetching: true, error: null, roleName: null });
export const requestUser = (state, { data }) => state.merge({ fetching: true, error: null, user: null });
export const requestUserName = (state, { data }) => state.merge({ fetching: true, error: null, userName: null });

// successful api lookup
export const success = (state, action) => {
	const { payload } = action;
	return state.merge({ fetching: false, error: null, role: payload });
};

export const successRoleName = (state, action) => {
	const { payload } = action;
	return state.merge({ fetching: false, error: null, roleName: payload });
};

export const successUser = (state, action) => {
	const { payload } = action;
	return state.merge({ fetching: false, error: null, user: payload });
};

export const successUserName = (state, action) => {
	const { payload } = action;
	return state.merge({ fetching: false, error: null, userName: payload });
};

// Something went wrong somewhere.
export const failure = state => state.merge({ fetching: false, error: true });

export const resetState = state => state.merge({ fetching: false, error: null });



/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
	[Types.GET_ROLE]: request,
	[Types.GET_ROLE_SUCCESS]: success,
    [Types.GET_ROLE_FAILURE]: failure,

	[Types.GET_ROLE_NAME]: requestRoleName,
	[Types.GET_ROLE_NAME_SUCCESS]: successRoleName,
    [Types.GET_ROLE_NAME_FAILURE]: failure,
    
	[Types.GET_USER]: requestUser,
	[Types.GET_USER_SUCCESS]: successUser,
    [Types.GET_USER_FAILURE]: failure,

	[Types.GET_USER_NAME]: requestUserName,
	[Types.GET_USER_NAME_SUCCESS]: successUserName,
    [Types.GET_USER_NAME_FAILURE]: failure,
    
	[Types.RESET_STATE_IDP]: resetState,
});
