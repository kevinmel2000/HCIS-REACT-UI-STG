import { call, put } from 'redux-saga/effects';
import AuthActions from '../Redux/AuthRedux';
import { isNil, map } from 'ramda';

export function* getAuth(api, action) {
	const { data } = action;
	const response = yield call(api.userAuth, data);

	if (typeof atob !== 'undefined') {
		console.log(response);
		console.log('^^^ GET AUTH ^^^');
	}

	if (response.ok) {
		switch (response.data.status) {
			case 'F':
				if(isNil(response.data.message)) yield put(AuthActions.authFailure("Failed, Please Try Again"));
				yield put(AuthActions.authFailure(response.data.message));
				break;
			case 'S':
				let role = ['R_WEB_ACCESS']
				let checkRole = false;
				const roleCheck = data => {
					let isExist = role.indexOf(data);
					if (isExist > -1) checkRole = true;
				}
				map(roleCheck,response.data.data.roles)
				if (checkRole) yield put(AuthActions.authSuccess(response.data.data));
				else yield put(AuthActions.authFailure("Failed, Please Try Again"));
				break;
			default:
				break;
			// default:
			// 	yield put(AuthActions.authFailure('Tidak dapat login.'));
			// 	break;
		}
	} else {
		if (response.data && response.data.status === 500) {
			return yield put(AuthActions.authFailure({
				path: 'Sign In',
				message: response.data.message, response
			}));
		}
		yield put(AuthActions.authFailure('Username atau Password Salah !'));
	}
}

export function* userUpdate(api, action) {
	const { data } = action;
	const response = yield call(api.userUpdate, { userProfileDTO: data });

	if (typeof atob !== 'undefined') {
		console.log(response);
		console.log('^^^ USER UPDATE ^^^');
	}

	if (response.ok) {
		if (isNil(response.data.responseType)) yield put(AuthActions.authFailure('Invalid responseType'));
		else {
			switch (response.data.responseType) {
				case 'FAILED':
					yield put(AuthActions.authFailure(response.data.responseDesc));
					break;
				case 'SUCCESS':
					yield put(AuthActions.authSuccess(response.data));
					break;
				default:
					yield put(AuthActions.authFailure('Unknown responseType'));
					break;
			}
		}
	} else {
		yield put(AuthActions.authFailure(`${response.status} : Server error`));
	}
}
