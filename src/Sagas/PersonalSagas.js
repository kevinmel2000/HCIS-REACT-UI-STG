import { call, put } from 'redux-saga/effects';
import PersonalActions from '../Redux/PersonalRedux';

export function* getAllMovement(api, action) {
    const { data } = action;
	const response = yield call(api.getAllMovement, data);
	
	if (typeof atob !== 'undefined') {
		console.log(response);
		console.log('^^^ GET ALL MOVEMENT ^^^');
	}

	if (response.ok) {
		if (response.data.data && response.data.data.length > 0) {
			yield put(PersonalActions.getMovementSuccess(response.data.data));
		} else {
			yield put(PersonalActions.getMovementFailure(response.data.message));
		}
	} else {
		if(response.problem === "NETWORK_ERROR" || response.problem === "TIMEOUT_ERROR" || response.problem === "CLIENT_ERROR")
			yield put(PersonalActions.getMovementFailure(response.problem));
		yield put(PersonalActions.getMovementFailure({
			path: 'Fetching Movement',
			message: response.data.message, response
		}));
	}
}