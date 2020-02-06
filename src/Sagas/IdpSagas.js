import { call, put } from 'redux-saga/effects';
import IdpActions from '../Redux/IdpRedux';

export function* getRoleByStatus(api, action) {
    const { data } = action;
	const response = yield call(api.getRoleByStatus, data);
	
	if (typeof atob !== 'undefined') {
		console.log(response);
		console.log('^^^ GET Role By Status ^^^');
	}

	if (response.ok) {
		if (response.data.data && response.data.data.length > 0) {
			yield put(IdpActions.getRoleSuccess(response.data.data));
		} else {
			yield put(IdpActions.getRoleSuccess([]));
		}
	} else {
		yield put(IdpActions.getRoleFailure({
			path: 'Fetching Role',
			message: response.data.message, response
		}));
	}
}

export function* getRoleByName(api, action) {
    const { data } = action;
	const response = yield call(api.getRoleByName, data);
	
	if (typeof atob !== 'undefined') {
		console.log(response);
		console.log('^^^ GET Role By Name ^^^');
	}

	if (response.ok) {
		if (response.data.data && response.data.data.length > 0) {
			yield put(IdpActions.getRoleNameSuccess(response.data.data));
		} else {
			// yield put(IdpActions.getRoleSuccess([]));
		}
	} else {
		yield put(IdpActions.getRoleNameFailure({
			path: 'Fetching Role Name',
			message: response.data.message, response
		}));
	}
}

export function* getUserAll(api, action) {
    const { data } = action;
	const response = yield call(api.getUserAll, data);
	
	if (typeof atob !== 'undefined') {
		console.log(response);
		console.log('^^^ GET User All ^^^');
	}

	if (response.ok) {
		if (response.data.data && response.data.data.length > 0) {
			yield put(IdpActions.getUserSuccess(response.data.data));
		} else {
			yield put(IdpActions.getUserSuccess([]));
		}
	} else {
		if(response.problem === "NETWORK_ERROR" || response.problem === "TIMEOUT_ERROR" || response.problem === "CLIENT_ERROR")
			yield put(IdpActions.getUserFailure(response.problem));
		yield put(IdpActions.getUserFailure({
			path: 'Fetching User',
			message: response.data.message, response
		}));
	}
}

export function* getUserByName(api, action) {
    const { data } = action;
	const response = yield call(api.getUserByName, data);
	
	if (typeof atob !== 'undefined') {
		console.log(response);
		console.log('^^^ GET User By Name ^^^');
	}

	if (response.ok) {
		if (response.data.data && response.data.data.length > 0) {
			yield put(IdpActions.getUserNameSuccess(response.data.data));
		} else {
			// yield put(IdpActions.getUserNameSuccess([]));
		}
	} else {
		if(response.problem === "NETWORK_ERROR" || response.problem === "TIMEOUT_ERROR" || response.problem === "CLIENT_ERROR")
			yield put(IdpActions.getUserNameFailure(response.problem));
		yield put(IdpActions.getUserNameFailure({
			path: 'Fetching User Name',
			message: response.data.message, response
		}));
	}
}