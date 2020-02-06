import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
	getApplicant: ['data'],
	getApplicantSuccess: ['payload'],
	getApplicantFailure: ['error'],

	getApplicantName: ['data'],
	getApplicantNameSuccess: ['payload'],
	getApplicantNameFailure: ['error'],

    resetStateRecruitment: null
});

export const RecruitmentTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
	fetching: null,
	error: null,
	applicant: null,
	applicantName: null
});

/* ------------- Selectors ------------- */

export const recruitmentSelectors = {
	getData: state => state.data
};

/* ------------- Reducers ------------- */

// request the data from an api
export const request = (state, { data }) => state.merge({ fetching: true, error: null, applicant: null });
export const requestName = (state, { data }) => state.merge({ fetching: true, error: null, applicantName: null });

// successful api lookup
export const success = (state, action) => {
	const { payload } = action;
	return state.merge({ fetching: false, error: null, applicant: payload });
};

export const successName = (state, action) => {
	const { payload } = action;
	return state.merge({ fetching: false, error: null, applicantName: payload });
};

// Something went wrong somewhere.
export const failure = state => state.merge({ fetching: false, error: true });

export const resetState = state => state.merge({ fetching: false, error: null });



/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
	[Types.GET_APPLICANT]: request,
	[Types.GET_APPLICANT_SUCCESS]: success,
	[Types.GET_APPLICANT_FAILURE]: failure,

	[Types.GET_APPLICANT_NAME]: requestName,
	[Types.GET_APPLICANT_NAME_SUCCESS]: successName,
	[Types.GET_APPLICANT_NAME_FAILURE]: failure,
	
	[Types.RESET_STATE_RECRUITMENT]: resetState,
});
