import { call, put } from 'redux-saga/effects';
import EmployeeActions from '../Redux/EmployeeRedux';

export function* getAllEmployee(api, action) {
    const { data } = action;
	const response = yield call(api.getAllEmployee, data);
	
	if (typeof atob !== 'undefined') {
		console.log(response);
		console.log('^^^ GET ALL EMPLOYEE ^^^');
	}

	if (response.ok) {
		if (response.data.data && response.data.data.length > 0) {
			yield put(EmployeeActions.getEmployeeSuccess(response.data.data));
		} else {
			yield put(EmployeeActions.getEmployeeFailure(response.data.message));
		}
	} else {
		if(response.problem === "NETWORK_ERROR" || response.problem === "TIMEOUT_ERROR" || response.problem === "CLIENT_ERROR")
			yield put(EmployeeActions.getEmployeeFailure(response.problem));
		yield put(EmployeeActions.getEmployeeFailure({
			path: 'Fetching Employee',
			message: response.data.message, response
		}));
	}
}

export function* getEmployeeByName(api, action) {
    const { data } = action;
	const response = yield call(api.getEmployeeByName, data);
	
	if (typeof atob !== 'undefined') {
		console.log(response);
		console.log('^^^ GET EMPLOYEE BY NAME ^^^');
	}

	if (response.ok) {
		if (response.data.data && response.data.data.length > 0) {
			yield put(EmployeeActions.getEmployeeNameSuccess(response.data.data));
		} else {
			// yield put(EmployeeActions.getEmployeeNameFailure(response.data.message));
		}
	} else {
		if(response.problem === "NETWORK_ERROR" || response.problem === "TIMEOUT_ERROR" || response.problem === "CLIENT_ERROR")
			yield put(EmployeeActions.getEmployeeNameFailure(response.problem));
		yield put(EmployeeActions.getEmployeeNameFailure({
			path: 'Fetching Employee Name',
			message: response.data.message, response
		}));
	}
}