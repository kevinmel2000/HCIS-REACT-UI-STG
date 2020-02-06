import apisauce from 'apisauce';

const create = (type = '') => {
	let api;

	switch (type) {
		case 'IDP':
			api = apisauce.create({
				baseURL: process.env.REACT_APP_HCIS_BE_API + "idp/",
				headers: {
					'Cache-Control': 'no-cache',
					'Accept': 'application/json;charset=UTF-8',
					'Content-Type': 'application/json',
					'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4'
				},
				timeout: 80000
			});
			break;
		case 'ES':
			api = apisauce.create({
				baseURL: process.env.REACT_APP_HCIS_BE_API + "es/",
				headers: {
					'Cache-Control': 'no-cache',
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4'
				},
				timeout: 80000
			});
			break;
		case 'CFG':
			api = apisauce.create({
				baseURL: process.env.REACT_APP_HCIS_BE_API + "cfg/",
				headers: {
					'Cache-Control': 'no-cache',
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4'
				},
				timeout: 80000
			});
			break;
		case 'MASTERDATA':
			api = apisauce.create({
				baseURL: process.env.REACT_APP_HCIS_BE_API + "masterdata/",
				headers: {
					'Cache-Control': 'no-cache',
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4'
				},
				timeout: 80000
			});
			break;
		case 'BIZPAR':
			api = apisauce.create({
				baseURL: process.env.REACT_APP_HCIS_BE_API + "bizpar/",
				headers: {
					'Cache-Control': 'no-cache',
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4'
				},
				timeout: 80000
			});
			break;
		case 'EMPLOYEE':
			api = apisauce.create({
				baseURL: process.env.REACT_APP_HCIS_BE_API + "emcmd/",
				headers: {
					'Cache-Control': 'no-cache',
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4'
				},
				timeout: 80000
			});
			break;
		case 'EMPLOYEE_QUERY':
			api = apisauce.create({
				baseURL: process.env.REACT_APP_HCIS_BE_API + "emqry/",
				headers: {
					'Cache-Control': 'no-cache',
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4'
				},
				timeout: 80000
			});
			break;
		case 'RECRUITMENT':
			api = apisauce.create({
				baseURL: process.env.REACT_APP_HCIS_BE_API + "recruitmentcmd/",
				headers: {
					'Cache-Control': 'no-cache',
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4'
				},
				timeout: 80000
			});
			break;
		case 'RECRUITMENT_QUERY':
			api = apisauce.create({
				baseURL: process.env.REACT_APP_HCIS_BE_API + "recruitmentqry/",
				headers: {
					'Cache-Control': 'no-cache',
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4'
				},
				timeout: 80000
			});
			break;
		case 'TIME':
			api = apisauce.create({
				baseURL: process.env.REACT_APP_HCIS_BE_API + "tmcmd/",
				headers: {
					'Cache-Control': 'no-cache',
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4'
				},
				timeout: 80000
			});
			break;
		case 'TIME_QUERY':
			api = apisauce.create({
				baseURL: process.env.REACT_APP_HCIS_BE_API + "tmqry/",
				headers: {
					'Cache-Control': 'no-cache',
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4'
				},
				timeout: 80000
			});
			break;
		case 'CNB':
			api = apisauce.create({
				baseURL: process.env.REACT_APP_HCIS_BE_API + "cnbcmd/",
				headers: {
					'Cache-Control': 'no-cache',
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4'
				},
				timeout: 80000
			});
			break;
		case 'CNB_QUERY':
			api = apisauce.create({
				baseURL: process.env.REACT_APP_HCIS_BE_API + "cnbqry/",
				headers: {
					'Cache-Control': 'no-cache',
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4'
				},
				timeout: 80000
			});
			break;
		case 'BPM':
			api = apisauce.create({
				baseURL: process.env.REACT_APP_HCIS_BE_API + "bpm/",
				headers: {
					'Cache-Control': 'no-cache',
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4'
				},
				timeout: 80000
			});
			break;
		case 'MOVEMENT_QUERY':
			api = apisauce.create({
				baseURL: process.env.REACT_APP_HCIS_BE_API + "mvqry/",
				headers: {
					'Cache-Control': 'no-cache',
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4'
				},
				timeout: 80000
			});
			break;
		case 'MOVEMENT':
			api = apisauce.create({
				baseURL: process.env.REACT_APP_HCIS_BE_API + "mvcmd/",
				headers: {
					'Cache-Control': 'no-cache',
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4'
				},
				timeout: 80000
			});
			break;
		case 'TERMINATION_QUERY':
			api = apisauce.create({
				baseURL: process.env.REACT_APP_HCIS_BE_API + "tmnqry/",
				headers: {
					'Cache-Control': 'no-cache',
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4'
				},
				timeout: 80000
			});
			break;
		case 'TERMINATION':
			api = apisauce.create({
				baseURL: process.env.REACT_APP_HCIS_BE_API + "tmncmd/",
				headers: {
					'Cache-Control': 'no-cache',
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4'
				},
				timeout: 80000
			});
			break;
		case 'BLACKLIST':
			api = apisauce.create({
				baseURL: process.env.REACT_APP_HCIS_BE_API + "blacklist/",
				headers: {
					'Cache-Control': 'no-cache',
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4'
				},
				timeout: 80000
			});
			break;
		case 'TRAINING_QUERY':
			api = apisauce.create({
				baseURL: process.env.REACT_APP_HCIS_BE_API + "trnqry/",
				headers: {
					'Cache-Control': 'no-cache',
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4'
				},
				timeout: 80000
			});
			break;
		case 'TRAINING':
			api = apisauce.create({
				baseURL: process.env.REACT_APP_HCIS_BE_API + "trncmd/",
				headers: {
					'Cache-Control': 'no-cache',
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4'
				},
				timeout: 80000
			});
			break;
		case 'REQUEST_QUERY':
			api = apisauce.create({
				baseURL: process.env.REACT_APP_HCIS_BE_API + "requestqry/",
				headers: {
					'Cache-Control': 'no-cache',
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4'
				},
				timeout: 80000
			});
			break;
		case 'REQUEST':
			api = apisauce.create({
				baseURL: process.env.REACT_APP_HCIS_BE_API + "requestcmd/",
				headers: {
					'Cache-Control': 'no-cache',
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4'
				},
				timeout: 80000
			});
			break;
		case 'DASHBOARD':
			api = apisauce.create({
				baseURL: process.env.REACT_APP_HCIS_BE_API + "dashboard/",
				headers: {
					'Cache-Control': 'no-cache',
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4'
				},
				timeout: 80000
			});
			break;
		default:
			break;
	}

	// IDP
	const userAuth = body => api.post('/user.auth', body);
	const getUserAll = body => api.post('/get.all.user', body);
	const postUser = body => api.post('/post.user', body);
	const updateUser = body => api.put('/update.user', body);
	const updateUserPassword = body => api.put('/update.user.password', body);
	const deleteUser = body => api.post('/delete.user', body, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		}
	})
	const getRoleAll = body => api.post('/get.all.role', body);
	const getRoleByStatus = body => api.post('/get.role.by.status', body);
	const getPrivilegeAll = body => api.post('/get.all.privilege', body);
	const updateRole = body => api.put('/update.role', body);
	const postRole = body => api.post('/post.role', body);
	const deleteRole = body => api.post('/delete.role', body, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
		}
	});
	const postUserRole = body => api.post('/post.user.role', body);
	const deleteUserRole = body => api.post('/delete.user.role', body, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
		}
	});
	const addPrivilege = body => api.get('role.privilege.assign/' + body.roleID + '/' + body.privilegeID)
	const deletePrivilege = body => api.get('role.privilege.unassign/' + body.roleID + '/' + body.privilegeID)
	const getUserByName = body => api.post('get.user.by.name', body)
	const getCountUser = body => api.get('get.count.user.by.name/' + body)
	const getCountAllUser = () => api.get('get.count.all.user/')

	// BIZPAR
	const getBizparByCategory = body => api.post('/get.bizpar.by.category', body);
	const getBizparByStatus = body => api.post('/get.bizpar.by.status', body);
	const postBizpar = body => api.post('/post.bizpar', body)
	const updateBizpar = body => api.put('/update.bizpar', body)
	const deleteBizpar = body => api.post('/delete.bizpar', body, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		}
	})
	const getBizparByParentKeyAndCategory = body => api.post('get.bizpar.by.parentkey.and.category', body)
	const getBizparByValue = body => api.post('/get.bizpar.by.value', body);
	const getAllBizparByParentKey = body => api.post('get.all.bizpar.by.parentkey', body);

	// EMPLOYEE
	const getAllEmployee = body => api.post('/query/get.all.employee', body)
	const getEmployeeByStatus = body => api.post('/query/get.employee.by.status', body)
	const getEmployeeById = body => api.get('/query/get.employee.by.id/' + body.employeeID)
	const putEmployee = body => api.put('/command/put.employee', body)
	const putEmployeeAbility = body => api.put('/command/put.employee.special.ability', body)
	const putEmployeWeakness = body => api.put('/command/put.employee.weakness', body)
	const updateEmployeeWorkExperience = body => api.put('/command/put.employee.work.experience', body)
	const updateEmployeeFormalEducation = body => api.put('/command/put.employee.formal.education', body)
	const updateEmployeeInformalEducation = body => api.put('/command/put.employee.informal.education', body)
	const updateEmployeeEmergencyContact = body => api.put('/command/put.employee.emergency.contact', body)
	const updateEmployeeDocument = body => api.put('/command/put.employee.document', body)
	const updateEmployeeSocialMedia = body => api.put('/command/put.employee.social.media', body)
	const updateEmployeeLicense = body => api.put('/command/put.employee.license', body)
	const updateEmployeeReference = body => api.put('/command/put.employee.reference', body)
	const updateEmployeeOrgExp = body => api.put('/command/put.employee.organization.experience', body)
	const updateEmployeeLanguSkill = body => api.put('/command/put.employee.language.skill', body)
	const createAndUpdateFam = body => api.put('/command/put.employee.family', body)
	const employeePhotoPost = body => api.post('/api/employee.photo.post', body)
	const uploadDocument = (body, config) => api.post('/api/employee.document.post', body, config)
	const updateEmployeeInsurance = body => api.put('/command/put.employee.insurance', body)
	const updateEmployeeFacility = body => api.put('/command/put.employee.facility', body)
	const updateEmployeeAppreciation = body => api.put('/command/put.employee.appreciation', body)
	const uploadDocumentAppreciation = (body, config) => api.post('/api/appreciation.document.post', body, config)
	const getTrainingRequestById = body => api.post('/query/get.training.request.by.employee.id', body)
	const getEmployeeByEsid = body => api.post('/query/get.employee.by.esid', body)
	const getEmployeeKseCheckByEmpId = body => api.post('query/get.employee.kse.checklist.by.employee.id', body)

	//Personal Management
	const getAllMovement = body => api.post('/query/get.all.movement', body)
	const postMovement = body => api.post('/command/post.movement', body)
	const updateMovement = body => api.put('/command/put.movement', body)
	const uploadMovementDoc = (body, config) => api.post("/api/movement.document.post", body, config)
	const deleteMovement = body => api.post('/delete.movement', body, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		}
	})
	const getAllTermination = body => api.post('/query/get.all.termination', body)
	const postTermination = body => api.post('/command/post.termination', body)
	const updateTermination = body => api.put('/command/put.termination', body)
	const uploadTerminationDoc = (body, config) => api.post("/api/termination.document.post", body, config)
	const deleteTermination = body => api.post('/delete.termination', body, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		}
	})
	const getEmployeeHead = body => api.post('query/get.employee.head', body)
	const getEmployeeByName = body => api.post('query/get.employee.by.name', body)
	const getCountEmployee = body => api.get('query/get.count.employee.by.name/' + body)
	const getCountAllEmployee = () => api.get('query/get.count.all.employee')
	const getMovementByID = body => api.get('/query/get.movement.by.id/' + body)
	const getTerminationByID = body => api.get('/query/get.termination.by.id/' + body)
	const getTrainingByID = body => api.get('/query/get.training.request.by.id/' + body)
	const getLeaveByID = body => api.get('/query/get.leave.by.id/' + body)
	const getAbsenceByID = body => api.get('/query/get.hcis.request.by.id/' + body)
	const getOvertimeByOVID = body => api.get('/query/get.overtime.by.id/' + body)

	// CFG
	const getAllMpp = body => api.post('/get.all.mpp', body)
	const postMpp = body => api.post('/post.mpp', body)
	const updateMpp = body => api.put('/update.mpp', body)
	const deleteMpp = body => api.post('/delete.mpp', body, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		}
	})
	const getCorporateHolidayByStatus = body => api.post('get.corporate.holiday.by.status', body)
	const updateCorporateHoliday = body => api.put('update.corporate.holiday', body)
	const postCorporateHoliday = body => api.post('post.corporate.holiday', body)
	const postPhotoCorporateHoliday = body => api.post('api/corporate.holiday.photo.post', body)
	const deleteCorporateHoliday = body => api.post('/delete.corporate.holiday', body, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		}
	})
	const getCorporateOfficeHourByStatus = body => api.post('get.corporate.office.hour.by.status', body)
	const updateCorporateOfficeHour = body => api.put('update.corporate.office.hour', body)
	const postCorporateOfficeHour = body => api.post('post.corporate.office.hour', body)
	const postPhotoCorporateOfficeHour = body => api.post('api/corporate.office.hour.photo.post', body)
	const deleteCorporateOfficeHour = body => api.post('/delete.corporate.office.hour', body, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		}
	})
	const getPersonelOfficeHourByStatus = body => api.post('get.personel.office.hour.by.status', body)
	const updatePersonalOfficeHour = body => api.put('update.personel.office.hour', body)
	const postPersonalOfficeHour = body => api.post('post.personel.office.hour', body)
	const deletePersonalOfficeHour = body => api.post('/delete.personel.office.hour', body, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		}
	})

	const getOfficeShiftHourByStatus = body => api.post('get.office.shift.hour.by.status', body)
	const updateOfficeShiftHour = body => api.put('update.office.shift.hour', body)
	const postOfficeShiftHour = body => api.post('post.office.shift.hour', body)
	const deleteOfficeShiftHour = body => api.post('/delete.office.shift.hour', body, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		}
	})
	const getMppByID = body => api.get('get.mpp.by.id/' + body)
	const getAllTax = body => api.post('get.all.corporate.tax.tpl', body)
	const getTaxByStatus = body => api.post('get.corporate.tax.tpl.by.status', body)
	const postTax = body => api.post('post.corporate.tax.tpl', body)
	const updateTax = body => api.put('update.corporate.tax.tpl', body)
	const deleteTax = body => api.post('delete.corporate.tax.tpl', body, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		}
	}
	)
	const postPhotoTax = body => api.post('api/corporate.tax.tpl.photo.post', body)
	const getAllCorporateTravelExpense = body => api.post('get.all.corporate.travel.expense/', body)
	const postCorporateTravelExpense = body => api.post('post.corporate.travel.expense', body)
	const updateCorporateTravelExpense = body => api.put('update.corporate.travel.expense', body)
	const deleteCorporateTravelExpense = body => api.post('/delete.corporate.travel.expense', body, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		}
	})
	const getAllPayroll = body => api.post('get.corporate.payroll.tpl.by.status', body)
	const getAllCoaCategory = body => api.post('get.all.coa.category', body)
	const postPayroll = body => api.post('post.corporate.payroll.tpl', body)
	const updatePayroll = body => api.put('update.corporate.payroll.tpl', body)
	const deletePayroll = body => api.post('delete.corporate.payroll.tpl', body, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		}
	})
	const getAllOrg = body => api.post('get.corporate.orgstructure.tpl.by.status', body)
	const getAllOrgTpl = body => api.post('get.all.orgstructure.tpl', body)
	const postOrg = body => api.post('post.orgstructure.tpl', body)
	const updateOrg = body => api.put('update.corporate.orgstructure.tpl', body)
	const deleteOrg = body => api.post('delete.corporate.orgstructure.tpl', body, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		}
	})
	const postPhotoPayroll = body => api.post('api/corporate.payroll.tpl.photo.post', body)
	const postPhotoOrg = body => api.post('api/corporate.orgstructure.tpl.photo.post', body)
	const getCorporateLeaveTypeByEsid = body => api.post('get.corporate.leave.type.by.esid', body)
	const getCorporateLeavePlafonByEsid = body => api.post('get.corporate.leave.plafon.by.esid', body)
	const postCorporateLeaveType = body => api.post('post.corporate.leave.type', body)
	const updateCorporateLeaveType = body => api.put('update.corporate.leave.type', body)
	const deleteCorporateLeaveType = body => api.post('delete.corporate.leave.type', body, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		}
	})
	const postCorporateLeavePlafon = body => api.post('post.corporate.leave.plafon', body)
	const updateCorporateLeavePlafon = body => api.put('update.corporate.leave.plafon', body)
	const deleteCorporateLeavePlafon = body => api.post('delete.corporate.leave.plafon', body, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		}
	})

	const getParentOrgStruct = body => api.get('get.corporate.orgstructure.tpl.flat.by.id/' + body)
	const getCorporatePresenceByStatus = body => api.post('get.corporate.presence.point.by.status', body)
	const postCorporatePresence = body => api.post('post.corporate.presence.point', body)
	const updateCorporatePresence = body => api.put('update.corporate.presence.point', body)
	const deleteCorporatePresence = body => api.post('delete.corporate.presence.point', body, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		}
	})
	const getCorporateOrgStructureTplById = body => api.get('/get.corporate.orgstructure.tpl.by.id/' + body)
	const getCorporateCnbTplByEsId = body => api.post('get.corporate.cnb.tpl.by.es.id', body)
	const postCorporateCnbTpl = body => api.post('post.corporate.cnb.tpl', body)
	const updateCorporateCnbTpl = body => api.put('update.corporate.cnb.tpl', body)
	const deleteCorporateCnbTpl = body => api.post('delete.corporate.cnb.tpl', body, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		}
	})
	const postPhotoCorporateCnb = body => api.post('api/corporate.cnb.tpl.photo.post', body)
	const getCorporateFacilityTplByEsId = body => api.post('get.corporate.facility.tpl.by.esid', body)
	const postCorporateFacilityTpl = body => api.post('post.corporate.facility.tpl', body)
	const updateCorporateFacilityTpl = body => api.put('update.corporate.facility.tpl', body)
	const deleteCorporateFacilityTpl = body => api.post('delete.corporate.facility.tpl', body, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		}
	})
	const postPhotoCorporateFacilityTpl = body => api.post('api/corporate.facility.tpl.photo.post', body)

	const getCorporateOvertimeByEsId = body => api.post('/get.corporate.overtime.type.by.esid', body)
	const postCorporateOvertimeType = body => api.post('post.corporate.overtime.type', body)
	const updateCorporateOvertimeType = body => api.put('update.corporate.overtime.type', body)
	const deleteCorporateOvertimeType = body => api.post('delete.corporate.overtime.type', body, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		}
	})
	const getAllFacility = body => api.post('/get.all.corporate.facility.tpl', body)
	const getAllCNB = body => api.post('/get.all.corporate.cnb.tpl', body)
	const getFacilityByStatus = body => api.post('/get.corporate.facility.tpl.by.status', body)
	const getCNBbyStatus = body => api.post('/get.corporate.cnb.tpl.by.status', body)

	// MASTERDATA
	const postCountry = body => api.post('/post.country', body)
	const updateCountry = body => api.put('/update.country', body)
	const deleteCountry = body => api.post('/delete.country', body, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		}
	})
	const getCountryMasterByCountryStatus = body => api.post('/get.countrymaster.by.countrystatus', body)
	const getInstituteByStatus = body => api.post('/get.institute.by.status', body)
	const postInstitute = body => api.post('/post.institute', body)
	const updateInstitute = body => api.put('/update.institute', body)
	const deleteInstitute = body => api.post('/delete.institute', body, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		}
	})
	const getAddressByRefObjectID = body => api.post('/get.address.by.refobjectid', body)
	const getProvinceByStatus = body => api.post('/get.province.by.status', body)
	const getProvinceByCountryID = body => api.get('/get.province.by.countryid/' + body)
	const getKabKotByProvinceID = body => api.get('/get.kabupatenkota.by.provinceid/' + body)
	const getKecamatanByKabKotID = body => api.get('/get.kecamatan.by.kabkotid/' + body)
	const getKelurahanByKecID = body => api.get('/get.kelurahan.by.kecamatanid/' + body)
	const postAddress = body => api.post('/post.address', body)
	const deleteAddress = body => api.post('/delete.address', body, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		}
	})
	const updateAddress = body => api.put('/update.address', body)
	const getEducationByStatus = body => api.post('/get.education.configuration.by.status', body)
	const getEducationByEduID = body => api.get('/get.education.configuration.by.id/' + body)
	const getInstituteByTypeAndLevel = body => api.post('/get.institute.by.education.configuration.type.and.level', body)
	const getDepartmentByTypeAndLevel = body => api.post('/get.departement.by.education.configuration.type.and.level', body)
	const postEducation = body => api.post('/post.education.configuration', body)
	const getAddressByStatus = body => api.post('/get.address.by.status', body)
	const updateEducation = body => api.put('/update.education.configuration', body)
	const deleteEducation = body => api.post('/delete.education.configuration', body, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		}
	})
	const postProvince = body => api.post('/post.province', body)
	const updateProvince = body => api.put('/update.province', body)
	const getProvince = body => api.get('/get.province.by.countryid/' + body)
	const postKabupatenkota = body => api.post('/post.kabupatenkota', body)
	const updateKabupatenkota = body => api.put('/update.kabupatenkota', body)
	const postKecamatan = body => api.post('/post.kecamatan', body)
	const updateKecamatan = body => api.put('/update.kecamatan', body)
	const postKelurahan = body => api.post('/post.kelurahan', body)
	const updateKelurahan = body => api.put('/update.kelurahan', body)
	const deleteProvince = body => api.post('/delete.province', body, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		}
	})
	const deleteKabupatenkota = body => api.post('/delete.kabupatenkota', body, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		}
	})
	const deleteKecamatan = body => api.post('/delete.kecamatan', body, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		}
	})
	const deleteKelurahan = body => api.post('/delete.kelurahan', body, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		}
	})

	// ES
	const getPosistion = () => api.get('/get.tpljson/es-001')
	const getCorporateOrgStructDetail = body => api.get('/get.tpljson/' + body)
	const getCompanyAll = body => api.post('/get.es.all', body)
	const deleteCompany = body => api.post('/delete.es', body, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		}
	})
	const postCompGeneral = body => api.post('/post.es', body)
	const updateCompGeneral = body => api.put('/update.es', body)
	const uploadCompanyDoc = (body, config) => api.post('/api/org.legal.document.post', body, config)
	const getEsByOuid = body => api.get('/get.es.by.ouid/' + body.esid + '/' + body.ouid)
	const getEsByLevel = body => api.post('get.es.by.esid.level', body)
	const getEsByStatus = body => api.post('get.es.by.status', body)
	const getEsById = body => api.get('/get.es.by.id/' + body)
	const getCompanyByStatus = body => api.post('/get.es.by.status', body)

	// RECRUITMENT
	const getRecReqById = body => api.get('/query/get.recruitment.request.by.id/' + body)
	const putRecReq = body => api.put('/command/put.recruitment.request', body)
	const putRecReqPos = body => api.put('/command/put.recruitment.request.position', body)
	const putRecReqQua = body => api.put('/command/put.recruitment.request.qualification', body)
	const putRecReqDoc = body => api.put('command/put.recruitment.request.document', body)
	const putRecReqSel = body => api.put('command/put.recruitment.request.selection', body)
	const putRecReqOth = body => api.put('command/put.recruitment.request.other.clauses', body)
	const postRecReq = body => api.post('/command/post.recruitment.request', body)
	const getRecruitmentReqAll = body => api.post('/query/get.all.recruitment.request', body)
	const updateApplicantWorkExperience = body => api.put('/command/put.applicant.work.experience', body)
	const getApplicantAll = body => api.post('/query/get.all.applicant', body)
	const postApplicant = body => api.post('/command/post.applicant', body)
	const updateApplicant = body => api.put('/command/put.applicant', body)
	const deleteApplicant = body => api.post('/delete.applicant', body, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		}
	})
	const applicantPhotoPost = body => api.post('/api/applicant.photo.post', body)
	const updateApplicantEmergencyContact = body => api.put('/command/put.applicant.emergency.contact', body)
	const updateApplicantOrgExp = body => api.put('/command/put.applicant.organization.experience', body)
	const createAndUpdate = body => api.put('command/put.applicant.family', body)
	const updateApplicantSocialMedia = body => api.put('/command/put.applicant.social.media', body)
	const updateApplicantDocument = body => api.put('/command/put.applicant.document', body)
	const updateApplicantFileDocument = (body, config) => api.post('/api/applicant.document.post', body, config)
	const updateApplicantFormalEducation = body => api.put('/command/put.applicant.formal.education', body)
	const updateApplicantInformalEducation = body => api.put('/command/put.applicant.informal.education', body)
	const updateApplicantReference = body => api.put('/command/put.applicant.reference', body)
	const updateApplicantWeekness = body => api.put('/command/put.applicant.weakness', body)
	const updateApplicantAbility = body => api.put('/command/put.applicant.special.ability', body)
	const updateApplicantLanguageSkill = body => api.put('/command/put.applicant.language.skill', body)
	const getAllRecruitmentVacancy = body => api.post('query/get.all.recruitment.vacancy', body)
	const postDocumentPsikotest = (body, config) => api.post('api/recruiment.psikotest.document.post', body, config)
	const getRecPsikotestById = body => api.get('query/get.recruitment.psikotest.by.id/' + body)
	const getRecInterviewByInterviewId = body => api.get('query/get.recruitment.interview.by.interview.id/' + body)
	const getApplicantByName = body => api.post('query/get.applicant.by.name', body)
	const getCountApplicantName = body => api.get('query/get.count.applicant.by.name/' + body)
	const getCountApplicant = () => api.get('query/get.count.all.applicant')

	// TIME & MANAGEMENT
	const getAllLeave = body => api.post('/query/get.all.leave', body)
	const getAllSppd = body => api.post('/query/get.all.sppd', body)
	const getAllOvertime = body => api.post('/query/get.all.overtime', body)
	const getAllTimesheet = body => api.post('/query/get.all.timesheet', body)
	const getAllTimeSheetTask = body => api.post('query/get.all.timesheet.task', body)
	const getTimesheetTaskById = body => api.post('query/get.timesheet.task.by.employee.id', body)
	const getTimesheetTaskByIdDate = body => api.post('query/get.timesheet.task.by.employee.id.and.date', body)

	const getTplJson = body => api.get('/get.tpljson/' + body)
	const getMppByPosition = body => api.post('/get.mpp.by.position', body)

	// bpm
	const getInboxData = body => api.post('/post.task', body)
	const submitMpp = body => api.post('/submit.mpp', body)
	const submitMppApproval = body => api.post('/submit.mpp.approval', body)
	const saveReqruitmentRequestPartial = body => api.post('/save.recruitmentrequest.partial', body)
	const getRecruitmentRequestByID = body => api.get('/query/get.recruitment.request.by.id/' + body)
	const submitRecruitmentRequest = body => api.post('/submit.recruitmentrequest', body)
	const submitRecruitmentRequestApproval = body => api.post('/submit.request.approval', body)
	const submitRecruitmentSelection = body => api.post('/submit.selection.recruitmentrequest', body)
	const submitRecruitmentSelectionApproval = body => api.post('/submit.selection.recruitmentrequest.approval', body)
	const submitApplicantCollection = body => api.post('/submit.applicant.collection', body)
	const submitValidApplicantData = body => api.post('/submit.valid.applicant.data', body)
	const submitPsikotest = body => api.post('/submit.psikotest', body)
	const submitUserInterview = body => api.post('/submit.user.interview', body)
	const submitCandidate = body => api.post('/submit.candidate', body)
	const submitMovement = body => api.post('/submit.movement', body)
	const submitTermination = body => api.post('/submit.termination', body)
	const submitKseChechklist = body => api.post('/submit.kse.checklist', body)
	const submitBiztrip = body => api.post('/submit.business.trip', body)
	const submitOvertime = body => api.post('/submit.overtime', body)
	const submitLeave = body => api.post('/submit.leave', body)
	const submitMovementApproval = body => api.post('/submit.movement.approval', body)
	const submitTerminationApproval = body => api.post('/submit.termination.approval', body)
	const submitSPPDApproval = body => api.post('/submit.business.trip.approval', body)
	const submitLeaveApproval = body => api.post('/submit.leave.approval', body)
	const submitAbsenceApproval = body => api.post('/submit.absence.approval', body)
	const submitTrainingApproval = body => api.post('/submit.training.approval', body)
	const submitBlacklistApproval = body => api.post('/submit.blacklist.approval', body)
	const submitOvertimeApproval = body => api.post('/submit.overtime.approval', body)
	const submitBlacklist = body => api.post('submit.blacklist', body)
	const submitTraining = body => api.post('/submit.training', body)
	const submitTimesheet = body => api.post('/submit.absence', body)
	const submitClaim = body => api.post('submit.claim', body)
	const submitClaimApproval = body => api.post('submit.claim.approval', body)
	const resubmitMovement = body => api.post('/resubmit.movement', body)
	const resubmitTermination = body => api.post('/resubmit.termination', body)
	const resubmitSPPD = body => api.post('/resubmit.business.trip', body)
	const resubmitLeave = body => api.post('/resubmit.leave', body)
	const resubmitAbsence = body => api.post('/resubmit.absence', body)
	const resubmitTraining = body => api.post('/resubmit.training', body)
	const resubmitBlacklist = body => api.post('/resubmit.blacklist', body)
	const resubmitOvertime = body => api.post('/resubmit.overtime', body)
	const submitPayrollBatch = body => api.post('submit.payroll.batch', body)
	const submitPayrollBatchApproval = body => api.post('submit.payroll.batch.approval', body)
	const submitTerminationChecklist = body => api.post('submit.termination.checklist', body)
	const resubmitClaim = body => api.post('resubmit.claim', body)

	//ESS
	const getPayrollByEmployeeId = body => api.post('/query/get.payroll.by.employee.id', body)
	const getLeaveByStatus = body => api.post('/query/get.leave.by.leave.status', body)
	const postLeaveEss = body => api.post('/command/post.leave', body)
	const getLeaveByEmployeeId = body => api.post('/query/get.leave.by.employee.id', body)
	const updateLeaveEss = body => api.put('/command/put.leave', body)
	const deleteLeaveEss = body => api.post('/delete.leave', body, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		}
	})
	const getSppdByID = body => api.get('/query/get.sppd.by.id/' + body)
	const getSppdByEmpId = body => api.post('/query/get.sppd.by.employee.id', body)
	const postSppd = body => api.post('/command/post.sppd', body)
	const updateSppd = body => api.put('/command/put.sppd', body)
	const deleteSppd = body => api.post('/delete.sppd', body, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		}
	})
	const getRequestByType = body => api.post('/query/get.request.by.hcis.request.by', body)
	const postTimesheet = body => api.post('/command/post.hcis.request', body)
	const updateTimesheet = body => api.put('/command/put.hcis.request', body)
	const deleteTimesheet = body => api.post('/delete.hcis.request', body, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		}
	})
	const uploadSppdDoc = (body, config) => api.post('/api/sppd.document.post', body, config)
	const getTrainingByStatus = body => api.post('/query/get.training.plan.by.status', body)
	const postTrainingReq = body => api.post('/command/register.training.plan', body)
	const getOvertimeByID = body => api.post('/query/get.overtime.by.employee.id', body)
	const postOvertime = body => api.post('/command/post.overtime', body)
	const updateOvertime = body => api.put('/command/put.overtime', body)
	const deleteOvertime = body => api.post('/delete.overtime', body, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		}
	})
	const uploadOvertimeDoc = (body, config) => api.post('/api/overtime.document.post', body, config)

	//blacklist
	const getAllBlacklist = body => api.post('/get.all.blacklist', body)
	const postBlacklist = body => api.post('/post.blacklist', body)
	const putBlacklist = body => api.put('/update.blacklist', body)
	const deleteBlacklist = body => api.post('/delete.blacklist', body, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		}
	})
	const getBlacklistbyEmployeeId = body => api.post('/get.blacklist.by.employee.id', body)
	const getBlacklistByID = body => api.get('/get.blacklist.by.id/' + body)

	// CNB
	const getAllBatchPayroll = body => api.post('get.all.batchpayroll', body)
	const postBatchPayroll = body => api.post('command/post.batchpayroll', body)
	const putBatchPayroll = body => api.put('command/put.batchpayroll', body)
	const calculateBatchPayroll = body => api.put('command/calculate.batch.payroll', body)
	const getBatchPayrollById = body => api.get('get.batchpayroll.by.id/' + body)
	const getAllClaim = body => api.post('query/get.all.claim', body)
	const getClaimDocument = body => api.get('api/claim.document.get/' + body)
	const postClaimDocument = body => api.post('api/claim.document.post', body)
	const getComponentClaimByEmpCompPosition = body => api.post('query/get.component.claim.by.employee.company.position', body)
	const getClaimByEmpIdTypeYear = body => api.post('query/get.claim.by.employeeid.type.and.year', body)
	const getClaimById = body => api.get('query/get.claim.by.id/' + body)

	// DASHBOARD
	const getAverageLeaveBalance = () => api.get('get.average.leave.balance')
	const getStaffPerformance = () => api.get('get.staff.performance')
	const getTotalCostPerHire = () => api.get('get.total.cost.per.hire')
	const getTotalEmployeePerHire = () => api.get('get.total.employee.per.hire')
	const getStatusEmployee = () => api.get('get.status.employee')
	const getAgeDemographicPerDepartment = () => api.get('get.age.demographic.per.department')
	const getOpenPositionByDepartment = () => api.get('get.open.position.by.department')
	const getEmployeeScore = () => api.get('get.employee.score')
	const getAverageLeaveBalanceDays = () => api.get('get.average.leave.balance.days')
	const getIncomeBreakdown = () => api.get('get.income.breakdown')
	const getEksadStrategyMatrix = () => api.get('get.eksad.strategy.matrix')
	const getTotalEmployee = () => api.get('get.total.employee')
	const getEksadAverageSpendPerHire = () => api.get('get.eksad.average.spend.per.hire')
	const getDashboard = () => api.get('get.dashboard')

	return {
		userAuth,
		getUserAll,
		postUser,
		updateUser,
		updateUserPassword,
		deleteUser,
		getRoleAll,
		getRoleByStatus,
		getPrivilegeAll,
		getBizparByCategory,
		getBizparByStatus,
		getEmployeeByStatus,
		putEmployee,
		putEmployeeAbility,
		putEmployeWeakness,
		getAllMpp,
		postMpp,
		updateMpp,
		deleteMpp,
		getCountryMasterByCountryStatus,
		getInstituteByStatus,
		getPosistion,
		getRecruitmentReqAll,
		getRecReqById,
		putRecReq,
		putRecReqPos,
		putRecReqQua,
		putRecReqDoc,
		putRecReqSel,
		postRecReq,
		getApplicantAll,
		postApplicant,
		updateApplicant,
		deleteApplicant,
		getAllLeave,
		getAllSppd,
		getAllOvertime,
		getAllTimesheet,
		postInstitute,
		updateInstitute,
		deleteInstitute,
		deleteRole,
		updateRole,
		postRole,
		postBizpar,
		updateBizpar,
		deleteBizpar,
		createAndUpdate,
		applicantPhotoPost,
		updateApplicantEmergencyContact,
		updateApplicantOrgExp,
		updateApplicantSocialMedia,
		updateApplicantDocument,
		updateApplicantFileDocument,
		updateApplicantWorkExperience,
		updateApplicantFormalEducation,
		updateApplicantInformalEducation,
		updateApplicantReference,
		updateApplicantWeekness,
		updateApplicantAbility,
		updateApplicantLanguageSkill,
		getAddressByRefObjectID,
		getProvinceByStatus,
		getProvinceByCountryID,
		getKabKotByProvinceID,
		getKecamatanByKabKotID,
		getKelurahanByKecID,
		postAddress,
		deleteAddress,
		updateEmployeeWorkExperience,
		updateEmployeeFormalEducation,
		updateEmployeeInformalEducation,
		updateAddress,
		updateEmployeeDocument,
		updateEmployeeEmergencyContact,
		updateEmployeeSocialMedia,
		updateEmployeeLicense,
		updateEmployeeReference,
		updateEmployeeOrgExp,
		updateEmployeeLanguSkill,
		employeePhotoPost,
		getAllEmployee,
		createAndUpdateFam,
		postCountry,
		getCorporateOrgStructureTplById,
		updateCountry,
		deleteCountry,
		getEducationByStatus,
		getInstituteByTypeAndLevel,
		getDepartmentByTypeAndLevel,
		postEducation,
		uploadDocument,
		getTplJson,
		getMppByPosition,
		getCompanyAll,
		postCompGeneral,
		updateCompGeneral,
		getAddressByStatus,
		uploadCompanyDoc,
		deleteCompany,
		updateEducation,
		deleteEducation,
		postProvince,
		getProvince,
		updateProvince,
		postKabupatenkota,
		updateKabupatenkota,
		postKecamatan,
		updateKecamatan,
		postKelurahan,
		updateKelurahan,
		deleteProvince,
		deleteKabupatenkota,
		deleteKecamatan,
		deleteKelurahan,
		getEducationByEduID,
		getEsByOuid,
		getAllTimeSheetTask,
		postUserRole,
		deleteUserRole,
		getInboxData,
		getCorporateHolidayByStatus,
		getCorporateOfficeHourByStatus,
		getPersonelOfficeHourByStatus,
		getOfficeShiftHourByStatus,
		updateCorporateHoliday,
		postCorporateHoliday,
		deleteCorporateHoliday,
		postPhotoCorporateHoliday,
		updateCorporateOfficeHour,
		postCorporateOfficeHour,
		deleteCorporateOfficeHour,
		postPersonalOfficeHour,
		updatePersonalOfficeHour,
		deletePersonalOfficeHour,
		postOfficeShiftHour,
		updateOfficeShiftHour,
		deleteOfficeShiftHour,
		postPhotoCorporateOfficeHour,
		updateEmployeeInsurance,
		updateEmployeeFacility,
		updateEmployeeAppreciation,
		getAllMovement,
		postMovement,
		deleteMovement,
		updateMovement,
		uploadMovementDoc,
		getEmployeeById,
		uploadDocumentAppreciation,
		addPrivilege,
		deletePrivilege,
		submitMpp,
		submitMppApproval,
		saveReqruitmentRequestPartial,
		getRecruitmentRequestByID,
		getMppByID,
		submitRecruitmentRequest,
		submitRecruitmentRequestApproval,
		putRecReqOth,
		submitRecruitmentSelection,
		submitRecruitmentSelectionApproval,
		submitOvertime,
		getAllBlacklist,
		postBlacklist,
		putBlacklist,
		deleteBlacklist,
		getAllTermination,
		postTermination,
		updateTermination,
		deleteTermination,
		uploadTerminationDoc,
		getLeaveByStatus,
		postLeaveEss,
		getLeaveByEmployeeId,
		updateLeaveEss,
		deleteLeaveEss,
		postTax,
		updateTax,
		getBizparByParentKeyAndCategory,
		getBizparByValue,
		deleteTax,
		postPhotoTax,
		getAllTax,
		getAllCorporateTravelExpense,
		postCorporateTravelExpense,
		updateCorporateTravelExpense,
		deleteCorporateTravelExpense,
		getEmployeeHead,
		getPayrollByEmployeeId,
		getRequestByType,
		postTimesheet,
		updateTimesheet,
		deleteTimesheet,
		getEsByLevel,
		getAllPayroll,
		getAllCoaCategory,
		postPayroll,
		updatePayroll,
		deletePayroll,
		getAllOrg,
		postOrg,
		deleteOrg,
		postPhotoPayroll,
		postPhotoOrg,
		updateOrg,
		getCorporateLeaveTypeByEsid,
		getCorporateLeavePlafonByEsid,
		postCorporateLeaveType,
		updateCorporateLeaveType,
		deleteCorporateLeaveType,
		postCorporateLeavePlafon,
		updateCorporateLeavePlafon,
		deleteCorporateLeavePlafon,
		getBlacklistbyEmployeeId,
		getTrainingRequestById,
		getSppdByEmpId,
		postSppd,
		updateSppd,
		deleteSppd,
		uploadSppdDoc,
		getTrainingByStatus,
		postTrainingReq,
		getOvertimeByID,
		postOvertime,
		updateOvertime,
		deleteOvertime,
		getParentOrgStruct,
		uploadOvertimeDoc,
		getCorporatePresenceByStatus,
		postCorporatePresence,
		updateCorporatePresence,
		getEsByStatus,
		getEsById,
		deleteCorporatePresence,
		getCorporateOrgStructDetail,
		getEmployeeByEsid,
		getCompanyByStatus,
		getAllOrgTpl,
		getAllRecruitmentVacancy,
		submitApplicantCollection,
		submitValidApplicantData,
		submitPsikotest,
		submitUserInterview,
		submitCandidate,
		submitKseChechklist,
		getCorporateCnbTplByEsId,
		postCorporateCnbTpl,
		updateCorporateCnbTpl,
		deleteCorporateCnbTpl,
		postPhotoCorporateCnb,
		getCorporateFacilityTplByEsId,
		postCorporateFacilityTpl,
		updateCorporateFacilityTpl,
		deleteCorporateFacilityTpl,
		postPhotoCorporateFacilityTpl,
		getCorporateOvertimeByEsId,
		getAllBizparByParentKey,
		postCorporateOvertimeType,
		updateCorporateOvertimeType,
		deleteCorporateOvertimeType,
		submitMovement,
		submitTermination,
		postDocumentPsikotest,
		submitBiztrip,
		getRecPsikotestById,
		getRecInterviewByInterviewId,
		submitLeave,
		submitMovementApproval,
		submitTerminationApproval,
		submitSPPDApproval,
		submitLeaveApproval,
		submitAbsenceApproval,
		submitTrainingApproval,
		submitBlacklistApproval,
		submitOvertimeApproval,
		getAllFacility,
		getAllCNB,
		getEmployeeByName,
		getCountEmployee,
		getCountAllEmployee,
		submitBlacklist,
		submitTraining,
		submitTimesheet,
		getApplicantByName,
		getCountApplicantName,
		getCountApplicant,
		getMovementByID,
		resubmitAbsence,
		resubmitBlacklist,
		resubmitLeave,
		resubmitMovement,
		resubmitOvertime,
		resubmitSPPD,
		resubmitTermination,
		getTerminationByID,
		resubmitTraining,
		getTrainingByID,
		getLeaveByID,
		getAbsenceByID,
		getBlacklistByID,
		getOvertimeByOVID,
		getSppdByID,
		getAllBatchPayroll,
		postBatchPayroll,
		putBatchPayroll,
		calculateBatchPayroll,
		getBatchPayrollById,
		submitPayrollBatch,
		submitPayrollBatchApproval,
		getAverageLeaveBalance,
		getStaffPerformance,
		getTotalCostPerHire,
		getTotalEmployeePerHire,
		getStatusEmployee,
		getAgeDemographicPerDepartment,
		getOpenPositionByDepartment,
		getEmployeeScore,
		getAverageLeaveBalanceDays,
		getIncomeBreakdown,
		getEksadStrategyMatrix,
		getTotalEmployee,
		getEksadAverageSpendPerHire,
		getDashboard,
		getTimesheetTaskById,
		getTaxByStatus,
		getFacilityByStatus,
		getCNBbyStatus,
		getAllClaim,
		getClaimDocument,
		postClaimDocument,
		getComponentClaimByEmpCompPosition,
		getClaimByEmpIdTypeYear,
		submitClaim,
		submitClaimApproval,
		getClaimById,
		getTimesheetTaskByIdDate,
		getEmployeeKseCheckByEmpId,
		submitTerminationChecklist,
		resubmitClaim,
		getUserByName,
		getCountUser,
		getCountAllUser
	}
}

export default { create };