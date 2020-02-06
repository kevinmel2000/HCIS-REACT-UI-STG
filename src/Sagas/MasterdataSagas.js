import { call, put } from 'redux-saga/effects';
import MasterdataActions from '../Redux/MasterdataRedux';

export function* getAllMpp(api, action) {
    const { data } = action;
	const response = yield call(api.getAllMpp, data);
	
	if (typeof atob !== 'undefined') {
		console.log(response);
		console.log('^^^ GET MPP ALL ^^^');
	}

	if (response.ok) {
		if (response.data.data && response.data.data.length > 0) {
			yield put(MasterdataActions.getMppSuccess(response.data.data));
		} else {
			yield put(MasterdataActions.getMppFailure(response.data.message));
		}
	} else {
		if(response.problem === "NETWORK_ERROR" || response.problem === "TIMEOUT_ERROR" || response.problem === "CLIENT_ERROR")
			yield put(MasterdataActions.getMppFailure(response.problem));
		yield put(MasterdataActions.getMppFailure({
			path: 'Fetching Mpp',
			message: response.data.message, response
		}));
	}
}

export function* getInstituteByStatus(api, action) {
    const { data } = action;
	const response = yield call(api.getInstituteByStatus, data);
	
	if (typeof atob !== 'undefined') {
		console.log(response);
		console.log('^^^ GET Institute ALL ^^^');
	}

	if (response.ok) {
		if (response.data.data && response.data.data.length > 0) {
			yield put(MasterdataActions.getInstituteSuccess(response.data.data));
		} else {
			yield put(MasterdataActions.getInstituteSuccess([]));
		}
	} else {
		if(response.problem === "NETWORK_ERROR" || response.problem === "TIMEOUT_ERROR" || response.problem === "CLIENT_ERROR")
			yield put(MasterdataActions.getMppFailure(response.problem));
		yield put(MasterdataActions.getInstituteFailure({
			path: 'Fetching Institute',
			message: response.data.message, response
		}));
	}
}

export function* getAddressByStatus(api, action) {
    const { data } = action;
	const response = yield call(api.getAddressByStatus, data);
	
	if (typeof atob !== 'undefined') {
		console.log(response);
		console.log('^^^ GET ADDRESS BY STATUS ^^^');
	}

	if (response.ok) {
		if (response.data.data && response.data.data.length > 0) {
			yield put(MasterdataActions.getAddressStatSuccess(response.data.data));
		} else {
			yield put(MasterdataActions.getAddressStatFailure([]));
		}
	} else {
		if(response.problem === "NETWORK_ERROR" || response.problem === "TIMEOUT_ERROR" || response.problem === "CLIENT_ERROR")
			yield put(MasterdataActions.getAddressStatFailure(response.problem));
		yield put(MasterdataActions.getAddressStatFailure({
			path: 'Fetching AddressStat',
			message: response.data.message, response
		}));
	}
}

export function* getCompanyAll(api, action) {
    const { data } = action;
	const response = yield call(api.getCompanyAll, data);
	
	if (typeof atob !== 'undefined') {
		console.log(response);
		console.log('^^^ GET COMPANY ALL ^^^');
	}

	if (response.ok) {
		if (response.data.data && response.data.data.length > 0) {
			yield put(MasterdataActions.getCompanySuccess(response.data.data));
		} else {
			yield put(MasterdataActions.getCompanyFailure(response.data.message));
		}
	} else {
		if(response.problem === "NETWORK_ERROR" || response.problem === "TIMEOUT_ERROR" || response.problem === "CLIENT_ERROR")
			yield put(MasterdataActions.getCompanyFailure(response.problem));
		yield put(MasterdataActions.getCompanyFailure({
			path: 'Fetching Company',
			message: response.data.message, response
		}));
	}
}

export function* getAddressByRefObjectID(api, action) {
    const { data } = action;
	const response = yield call(api.getAddressByRefObjectID, data);
	
	if (typeof atob !== 'undefined') {
		console.log(response);
		console.log('^^^ GET ADDRESS BY REFOBJECTID ^^^');
	}

	if (response.ok) {
		if (response.data.data && response.data.data.length > 0) {
			yield put(MasterdataActions.getAddressSuccess(response.data.data));
		} else {
			yield put(MasterdataActions.getAddressSuccess([]));
		}
	} else {
		if(response.problem === "NETWORK_ERROR" || response.problem === "TIMEOUT_ERROR" || response.problem === "CLIENT_ERROR")
			yield put(MasterdataActions.getAddressFailure(response.problem));
		yield put(MasterdataActions.getAddressFailure({
			path: 'Fetching Address',
			message: response.data.message, response
		}));
	}
}

export function* getCountryMasterByCountryStatus(api, action) {
    const { data } = action;
	const response = yield call(api.getCountryMasterByCountryStatus, data);
	
	if (typeof atob !== 'undefined') {
		console.log(response);
		console.log('^^^ GET COUNTRY MASTER ^^^');
	}

	if (response.ok && response.data && response.data.status === "S") {
		yield put(MasterdataActions.getCountrySuccess(response.data.data));
	} else {
		yield put(MasterdataActions.getCountryFailure(response.data));
	}
}

export function* getEducationByStatus(api, action) {
	const { data } = action;
	const response = yield call(api.getEducationByStatus, data);

	if (typeof atob !== 'undefined') {
		console.log(response);
		console.log('^^^ GET Education ALL ^^^');
	}

	if (response.ok) {
		if (response.data.data && response.data.data.length > 0) {
			yield put(MasterdataActions.getEducationSuccess(response.data.data));
		} else {
			yield put(MasterdataActions.getEducationSuccess([]));
		}
	} else {
		if (response.problem === "NETWORK_ERROR" || response.problem === "TIMEOUT_ERROR" || response.problem === "CLIENT_ERROR")
			yield put(MasterdataActions.getEducationFailure(response.problem));
		yield put(MasterdataActions.getEducationFailure({
			path: 'Fetching Education',
			message: response.data.message, response
		}));
	}
}