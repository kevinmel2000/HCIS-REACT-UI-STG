import { call, put } from 'redux-saga/effects';
import RecruitmentActions from '../Redux/RecruitmentRedux';

export function* getApplicantAll(api, action) {
    const { data } = action;
	const response = yield call(api.getApplicantAll, data);
	
	if (typeof atob !== 'undefined') {
		console.log(response);
		console.log('^^^ GET Applicant ALL ^^^');
	}

	if (response.ok) {
		if (response.data.data && response.data.data.length > 0) {
			yield put(RecruitmentActions.getApplicantSuccess(response.data.data));
		} else {
			yield put(RecruitmentActions.getApplicantFailure(response.data.message));
		}
	} else {
		if(response.problem === "NETWORK_ERROR" || response.problem === "TIMEOUT_ERROR" || response.problem === "CLIENT_ERROR")
			yield put(RecruitmentActions.getApplicantFailure(response.problem));
		yield put(RecruitmentActions.getApplicantFailure({
			path: 'Fetching Applicant',
			message: response.data.message, response
		}));
	}
}

export function* getApplicantByName(api, action) {
    const { data } = action;
	const response = yield call(api.getApplicantByName, data);
	
	if (typeof atob !== 'undefined') {
		console.log(response);
		console.log('^^^ GET Applicant By Name ^^^');
	}

	if (response.ok) {
		if (response.data.data && response.data.data.length > 0) {
			yield put(RecruitmentActions.getApplicantNameSuccess(response.data.data));
		} else {
			// yield put(RecruitmentActions.getApplicantNameFailure(response.data.message));
		}
	} else {
		if(response.problem === "NETWORK_ERROR" || response.problem === "TIMEOUT_ERROR" || response.problem === "CLIENT_ERROR")
			yield put(RecruitmentActions.getApplicantNameFailure(response.problem));
		yield put(RecruitmentActions.getApplicantNameFailure({
			path: 'Fetching Applicant Name',
			message: response.data.message, response
		}));
	}
}