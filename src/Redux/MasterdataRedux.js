import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
	getMpp: ['data'],
	getMppSuccess: ['payload'],
    getMppFailure: ['error'],
    
    getInstitute: ['data'],
    getInstituteSuccess: ['payload'],
    getInstituteFailure: ['error'],

	getCompany: ['data'],
	getCompanySuccess: ['payload'],
	getCompanyFailure: ['error'],

	getAddress: ['data'],
    getAddressSuccess: ['payload'],
	getAddressFailure: ['error'],

	getAddressStat: ['data'],
	getAddressStatSuccess: ['payload'],
	getAddressStatFailure: ['error'],

	getCountry: ['data'],
    getCountrySuccess: ['payload'],
	getCountryFailure: ['error'],
	
	getEducation: ['data'],
	getEducationSuccess: ['payload'],
	getEducationFailure: ['error'],

    resetStateMasterdata: null
});

export const MasterdataTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
	fetching: null,
	error: null,
	mpp: null,
	company: null,
	institute: null,
	address: null,
	addressStat: null,
	country: null,
	education: null
});

/* ------------- Selectors ------------- */

export const masterdataSelectors = {
	getData: state => state.data
};

/* ------------- Reducers ------------- */

// request the data from an api
export const request = (state, { data }) => state.merge({ fetching: true, error: null, mpp: null, institute: null, address: null, country: null, education: null, company:null, addressStat:null});

// successful api lookup
export const success = (state, action) => {
	const { payload } = action;
	return state.merge({ fetching: false, error: null, mpp: payload });
};

export const successInstitute = (state, action) => {
	const { payload } = action;
	return state.merge({ fetching: false, error: null, institute: payload });
};

export const successCompany = (state, action) => {
	const { payload } = action;
	return state.merge({ fetching: false, error: null, company: payload });
};

export const successAddressStat = (state, action) => {
	const { payload } = action;
	return state.merge({ fetching: false, error: null, addressStat: payload });
};

export const successAddress = (state, action) => {
	const { payload } = action;
	return state.merge({ fetching: false, error: null, address: payload });
};

export const successEducation = (state, action) => {
	const { payload } = action;
	return state.merge({ fetching: false, error: null, education: payload });
};

export const successCountry = (state, action) => {
	const { payload } = action;
	return state.merge({ fetching: false, error: null, country: payload });
};

// Something went wrong somewhere.
export const failure = state => state.merge({ fetching: false, error: true });

export const resetState = state => state.merge({ fetching: false, error: null });



/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
	[Types.GET_MPP]: request,
	[Types.GET_MPP_SUCCESS]: success,
	[Types.GET_MPP_FAILURE]: failure,
    
    [Types.GET_INSTITUTE]: request,
	[Types.GET_INSTITUTE_SUCCESS]: successInstitute,
	[Types.GET_INSTITUTE_FAILURE]: failure,
	
	[Types.GET_COMPANY]: request,
	[Types.GET_COMPANY_SUCCESS]: successCompany,
	[Types.GET_COMPANY_FAILURE]: failure,

	[Types.GET_ADDRESS_STAT]: request,
	[Types.GET_ADDRESS_STAT_SUCCESS]: successAddressStat,
	[Types.GET_ADDRESS_STAT_FAILURE]: failure,

	[Types.GET_ADDRESS]: request,
	[Types.GET_ADDRESS_SUCCESS]: successAddress,
	[Types.GET_ADDRESS_FAILURE]: failure,
	
	[Types.GET_COUNTRY]: request,
	[Types.GET_COUNTRY_SUCCESS]: successCountry,
	[Types.GET_COUNTRY_FAILURE]: failure,
	
	[Types.GET_EDUCATION]: request,
	[Types.GET_EDUCATION_SUCCESS]: successEducation,
	[Types.GET_EDUCATION_FAILURE]: failure,
    
	[Types.RESET_STATE_MASTERDATA]: resetState,
});
