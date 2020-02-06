import { call, put } from 'redux-saga/effects';
import BizparActions from '../Redux/BizparRedux';

export function* getBizparByStatus(api, action) {
    const { data } = action;
	const response = yield call(api.getBizparByValue, data);
	
	if (typeof atob !== 'undefined') {
		console.log(response);
		console.log('^^^ GET Bizpar ALL ^^^');
	}

	if (response.ok) {
		if (response.data.data && response.data.data.length > 0) {
			yield put(BizparActions.getBizparSuccess(response.data.data));
		} else {
			yield put(BizparActions.getBizparFailure(response.data.message));
		}
	} else {
		yield put(BizparActions.getBizparFailure({
			path: 'Fetching Bizpar',
			message: response.data.message, response
		}));
	}
}