import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
	getEmployee: ['data'],
	getEmployeeSuccess: ['payload'],
	getEmployeeFailure: ['error'],
	
	getEmployeeName: ['data'],
	getEmployeeNameSuccess: ['payload'],
	getEmployeeNameFailure: ['error'],

    resetStateEmployee: null
});

export const EmployeeTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
	fetching: null,
	error: null,
	employee: null,
	employeeName: null
});

/* ------------- Selectors ------------- */

export const employeeSelectors = {
	getData: state => state.data
};

/* ------------- Reducers ------------- */

// request the data from an api
export const request = (state, { data }) => state.merge({ fetching: true, error: null, employee: null });
export const requestName = (state, { data }) => state.merge({ fetching: true, error: null, employeeName: null });

// successful api lookup
export const success = (state, action) => {
	const { payload } = action;
	return state.merge({ fetching: false, error: null, employee: payload });
};

export const successName = (state, action) => {
	const { payload } = action;
	return state.merge({ fetching: false, error: null, employeeName: payload });
};

// Something went wrong somewhere.
export const failure = state => state.merge({ fetching: false, error: true });

export const resetState = state => state.merge({ fetching: false, error: null });



/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
	[Types.GET_EMPLOYEE]: request,
	[Types.GET_EMPLOYEE_SUCCESS]: success,
	[Types.GET_EMPLOYEE_FAILURE]: failure,
	
	[Types.GET_EMPLOYEE_NAME]: requestName,
	[Types.GET_EMPLOYEE_NAME_SUCCESS]: successName,
	[Types.GET_EMPLOYEE_NAME_FAILURE]: failure,

	[Types.RESET_STATE_EMPLOYEE]: resetState,
});
