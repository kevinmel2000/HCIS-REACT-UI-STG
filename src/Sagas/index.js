import { takeLatest, all } from 'redux-saga/effects';
import API from '../Services/Api';

// Types
import { AuthTypes } from '../Redux/AuthRedux';
import { MasterdataTypes } from '../Redux/MasterdataRedux';
import { RecruitmentTypes } from '../Redux/RecruitmentRedux';
import { EmployeeTypes } from '../Redux/EmployeeRedux';
import { IdpTypes } from '../Redux/IdpRedux';
import { BizparTypes } from '../Redux/BizparRedux';
import { PersonalTypes } from '../Redux/PersonalRedux'

// Sagas
import { getAuth } from './AuthSagas';
import { getAllMpp, getInstituteByStatus, getAddressByRefObjectID, getCountryMasterByCountryStatus, getEducationByStatus,getCompanyAll,getAddressByStatus  } from './MasterdataSagas';
import { getApplicantAll, getApplicantByName } from './RecruitmentSagas';
import { getAllEmployee, getEmployeeByName } from './EmployeeSagas';
import { getRoleByStatus, getRoleByName, getUserAll, getUserByName } from './IdpSagas';
import { getBizparByStatus } from './BizparSagas';
import { getAllMovement } from './PersonalSagas';

const esApi = API.create('ES')
const idpApi = API.create('IDP');
const masterdataApi = API.create('MASTERDATA');
const recruitmentQueryApi = API.create('RECRUITMENT_QUERY');
const employeeQueryApi = API.create('EMPLOYEE_QUERY');
const bizparQueryApi = API.create('BIZPAR');
const cfgApi = API.create('CFG');
const personalApi = API.create('MOVEMENT_QUERY');

export default function* root() {
	yield all([
        takeLatest(AuthTypes.AUTH_REQUEST, getAuth, idpApi),

        takeLatest(MasterdataTypes.GET_MPP, getAllMpp, cfgApi),
        takeLatest(MasterdataTypes.GET_INSTITUTE, getInstituteByStatus, masterdataApi),
        takeLatest(MasterdataTypes.GET_ADDRESS, getAddressByRefObjectID, masterdataApi),
        takeLatest(MasterdataTypes.GET_COUNTRY, getCountryMasterByCountryStatus, masterdataApi),
        takeLatest(MasterdataTypes.GET_EDUCATION, getEducationByStatus, masterdataApi),
        takeLatest(MasterdataTypes.GET_ADDRESS_STAT, getAddressByStatus, masterdataApi),

        takeLatest(MasterdataTypes.GET_COMPANY, getCompanyAll, esApi),

        takeLatest(RecruitmentTypes.GET_APPLICANT, getApplicantAll, recruitmentQueryApi),
        takeLatest(RecruitmentTypes.GET_APPLICANT_NAME, getApplicantByName, recruitmentQueryApi),

        takeLatest(EmployeeTypes.GET_EMPLOYEE, getAllEmployee, employeeQueryApi),
        takeLatest(EmployeeTypes.GET_EMPLOYEE_NAME, getEmployeeByName, employeeQueryApi),

        takeLatest(PersonalTypes.GET_ALL_MOVEMENT, getAllMovement, personalApi),

        takeLatest(IdpTypes.GET_ROLE, getRoleByStatus, idpApi),
        takeLatest(IdpTypes.GET_ROLE_NAME, getRoleByName, idpApi),
        takeLatest(IdpTypes.GET_USER, getUserAll, idpApi),
        takeLatest(IdpTypes.GET_USER_NAME, getUserByName, idpApi),

        takeLatest(BizparTypes.GET_BIZPAR, getBizparByStatus, bizparQueryApi)
    ]);
}