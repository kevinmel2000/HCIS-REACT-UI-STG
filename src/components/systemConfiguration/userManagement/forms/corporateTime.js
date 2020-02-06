import React, { Component } from 'react'
import CorporateHoliday from '../tables/corporateHoliday'
import OfficeShiftHour from '../tables/officeShiftHour'
import CorporateOfficeHour from '../tables/corporateOfficeHour'
import PersonalOfficeHour from '../tables/personalOfficeHour'
import M from 'moment'
import PopUp from '../../../pages/PopUpAlert'
import { connect } from 'react-redux';

import ResizeSlider from '../../../../modules/resize/Slider'

// form edit
import FormEditCorporateHoliday from './edit/corporateHoliday'
import FormEditCorporateOfficeHour from './edit/corporateOfficeHour'
import FormEditPersonalOfficeHour from './edit/personalOfficeHour'
import FormEditOfficeShiftHour from './edit/officeShiftHour'

// form create
import FormCreateCorporateHoliday from './create/corporateHoliday'
import FormCreateCorporateOfficeHour from './create/corporateOfficeHour'
import FormCreatePersonalOfficeHour from './create/personalOfficeHour'
import FormCreateOfficeShiftHour from './create/officeShiftHour'
import API from '../../../../Services/Api'

const clSlidePage = 'a-s-p-main'

const timeNow = M().format('DD-MM-YYYY HH:mm:ss')
const dateNow = M().format('DD-MM-YYYY')

class CorporateTime extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataHoliday: [],
            dataTableCorporateOfficeHour: [],
            dataTablePersonalOfficeHour: [],
            dataTableOfficeShiftHour: [],
            bizparHolidayType: [],
            bizparOfficeHourType: [],
            bizparCalendarType: [],
            classAppSlidePage: 'app-side-page',
            classAppSlidePageMain: clSlidePage,
            slideCorporateHoliday: false,
            slideCorporateOfficeHour: false,
            slideOfficeShiftHour: false,
            slidePersonalOfficeHour: false,
            createCorporateHoliday: false,
            createCorporateOfficeHour: false,
            createOfficeShiftHour: false,
            createPersonalOfficeHour: false,
            auth: props.auth,
            // important for resize pane
            allowResize: false,
            defaultSize: 0,
            minSize: 0,
            maxSize: 0
        }
    }

    opResizePane = () => {
        console.log('open', this.state.defaultSize)
        this.setState({
            allowResize: true,
            defaultSize: 370,
            minSize: 370,
            maxSize: 850
        })
    }

    clResizePane = () => {
        console.log('close', this.state.defaultSize)
        this.setState({
            allowResize: false,
            defaultSize: 0,
            minSize: 0,
            maxSize: 0
        })
    }

    opSidePage = (menu, data) => (e) => {
        e.preventDefault()
        let rawData = {}
        rawData = data
        console.log(rawData)
        this.setState({
            classAppSlidePage: 'app-side-page op-app-side',
            slideCorporateHoliday: false,
            slideCorporateOfficeHour: false,
            slideOfficeShiftHour: false,
            slidePersonalOfficeHour: false
        })

        this.opResizePane()

        switch (menu) {
            case 'slide-menu-1':
                this.setState({
                    slideCorporateHoliday: true,
                    rawData: {
                        ...rawData,
                        holidayStartDate: M(rawData.holidayStartDate, 'DD-MM-YYYY HH:mm:ss').format('HH:mm:ss'),
                        holidayEndDate: M(rawData.holidayEndDate, 'DD-MM-YYYY HH:mm:ss').format('HH:mm:ss'),
                    }
                })
                break
            case 'slide-menu-2':
                this.setState({
                    slideCorporateOfficeHour: true,
                    rawData
                })
                break
            case 'slide-menu-3':
                this.setState({
                    slidePersonalOfficeHour: true,
                    rawData
                })
                break
            case 'slide-menu-4':
                this.setState({
                    slideOfficeShiftHour: true,
                    rawData
                })
                break
            default:
                break
        }

    }
    // =================================================================================================
    //API GET----------------------------------------------------------------------
    componentDidMount() {
        console.log('Loading...')
        this.getBizparByCategoryHolidayStatus()
        this.getBizparByCategoryCalendarType()
        this.getBizparByCategoryOfficeHourType()
        this.getBizparByCategoryDayType()
        this.getBizparByCategoryShiftType()
        this.getHoliday()
        this.getPersonelOfficeHourByStatus()
        this.getCorporateOfficeHourByStatus()
        this.getOfficeShiftHourByStatus()
    }

    getHoliday() {
        this.refs.child.getHoliday(0, 5);
        // let payload = {
        //     "limit": 50,
        //     "offset": 0,
        //     "params": {
        //         "holidayStatus": "ACTIVE"
        //     }
        // }
        // API.create("CFG").getCorporateHolidayByStatus(payload).then(res => {
        //     console.log('res ', res)
        //     if (res.status === 200) {
        //         if (res.data.status === "S") {
        //             let dataHoliday = res.data.data.map((value) => {
        //                 const { holidayDate, holidayStartDate, holidayEndDate, isAllDay, holidayType, holidayName, holidayStatus } = value
        //                 let allDay = ''
        //                 let activation = ''
        //                 if (isAllDay === true) {
        //                     allDay = 'YES'
        //                 } else { allDay = 'NO' }
        //                 if (holidayStatus === 'ACTIVE') {
        //                     activation = 'YES'
        //                 }
        //                 else { activation = 'NO' }
        //                 return [
        //                     holidayDate,
        //                     holidayType !== null ? holidayType.bizparValue : '',
        //                     allDay,
        //                     M(holidayStartDate, 'DD-MM-YYYY HH:mm:ss').format('HH:mm:ss') + "-" + M(holidayEndDate, 'DD-MM-YYYY HH:mm:ss').format('HH:mm:ss'),
        //                     holidayName,
        //                     activation

        //                 ]
        //             })
        //             this.setState({
        //                 dataHoliday,
        //                 rawDataHoliday: res.data.data
        //             })
        //         }
        //     }
        // })
    }

    getCorporateOfficeHourByStatus() {
        this.refs.child2.getData(0, 5);
        // let payload = {
        //     "limit": 50,
        //     "offset": 0,
        //     "params": {
        //         "corporateOfficeHourStatus": "ACTIVE"
        //     }
        // }
        // API.create("CFG").getCorporateOfficeHourByStatus(payload).then(res => {
        //     console.log('res ', res)
        //     if (res.status === 200) {
        //         if (res.data.status === "S") {
        //             let dataTableCorporateOfficeHour = res.data.data.map((value) => {
        //                 const {
        //                     dayType,
        //                     corporateOfficeHourType,
        //                     calendarType,
        //                     corporateOfficeHourStartDate,
        //                     corporateOfficeHourEndDate,
        //                     corporateOfficeHourName,
        //                     corporateOfficeHourStatus
        //                 } = value
        //                 let activation = ''
        //                 if (corporateOfficeHourStatus === 'ACTIVE') {
        //                     activation = 'YES'
        //                 }
        //                 else { activation = 'NO' }
        //                 return [
        //                     dayType.bizparValue,
        //                     corporateOfficeHourType.bizparValue,
        //                     calendarType.bizparValue,
        //                     M(corporateOfficeHourStartDate, 'DD-MM-YYYY HH:mm:ss').format('HH:mm:ss') + "-" + M(corporateOfficeHourEndDate, 'DD-MM-YYYY HH:mm:ss').format('HH:mm:ss'),
        //                     corporateOfficeHourName,
        //                     activation

        //                 ]
        //             })
        //             this.setState({
        //                 dataTableCorporateOfficeHour,
        //                 rawDataCorporateOfficeHour: res.data.data
        //             })
        //         }
        //     }
        // })
    }

    getPersonelOfficeHourByStatus() {
        this.refs.child3.getData(0, 5);
        // let payload = {
        //     "limit": 50,
        //     "offset": 0,
        //     "params": {
        //         "personelOfficeHourStatus": "ACTIVE"
        //     }
        // }
        // API.create("CFG").getPersonelOfficeHourByStatus(payload).then(res => {
        //     console.log('res ', res)
        //     if (res.status === 200) {
        //         if (res.data.status === "S") {
        //             let dataTablePersonalOfficeHour = res.data.data.map((value) => {
        //                 const { employee, personelOfficeDate, personelOfficeHourType, calendarType, personelOfficeHourStartDate, personelOfficeHourEndDate, personelOfficeHourStatus } = value
        //                 let activation = ''
        //                 if (personelOfficeHourStatus === 'ACTIVE') {
        //                     activation = 'YES'
        //                 }
        //                 else { activation = 'NO' }
        //                 return [
        //                     personelOfficeDate,
        //                     personelOfficeHourType.bizparValue,
        //                     calendarType.bizparValue,
        //                     M(personelOfficeHourStartDate, 'DD-MM-YYYY HH:mm:ss').format('HH:mm:ss') + "-" + M(personelOfficeHourEndDate, 'DD-MM-YYYY HH:mm:ss').format('HH:mm:ss'),
        //                     employee && employee.employeeName,
        //                     activation

        //                 ]
        //             })
        //             this.setState({
        //                 dataTablePersonalOfficeHour,
        //                 rawDataPersonalOfficeHour: res.data.data
        //             })
        //         }
        //     }
        // })
    }

    getOfficeShiftHourByStatus() {
        this.refs.child4.getData(0, 5);
        // let payload = {
        //     "limit": 50,
        //     "offset": 0,
        //     "params": {
        //         "shiftStatus": "ACTIVE"
        //     }
        // }
        // API.create("CFG").getOfficeShiftHourByStatus(payload).then(res => {
        //     console.log('res ', res)
        //     if (res.status === 200) {
        //         if (res.data.status === "S") {
        //             let dataTableOfficeShiftHour = res.data.data.map((value) => {
        //                 const { shiftCode, shiftLeader, shiftType, shiftStartDate, shiftEndDate, shiftStartTime, shiftEndTime, shiftStatus } = value
        //                 let activation = ''
        //                 if (shiftStatus === 'ACTIVE') {
        //                     activation = 'YES'
        //                 }
        //                 else { activation = 'NO' }
        //                 return [
        //                     shiftCode,
        //                     shiftType.bizparValue,
        //                     M(shiftStartDate, 'DD-MM-YYYY HH:mm:ss').format('DD/MM/YYYY') + "-" + M(shiftEndDate, 'DD-MM-YYYY HH:mm:ss').format('DD/MM/YYYY'),
        //                     M(shiftStartTime, 'DD-MM-YYYY HH:mm:ss').format('HH:mm:ss') + "-" + M(shiftEndTime, 'DD-MM-YYYY HH:mm:ss').format('HH:mm:ss'),
        //                     shiftLeader && shiftLeader.employeeName,
        //                     activation

        //                 ]
        //             })
        //             this.setState({
        //                 dataTableOfficeShiftHour,
        //                 rawDataOfficeShiftHour: res.data.data
        //             })
        //         }
        //     }
        // })
    }

    async getBizparByCategoryShiftType() {
        let payload = {
            params: {
                bizparCategory: "SHIFT_TYPE"
            },
            offset: 0,
            limit: 20
        }
        API.create('BIZPAR').getBizparByCategory(payload).then(
            (res) => {
                if (res.status === 200) {
                    if (res.data.status === 'S') {
                        this.setState({
                            bizparShiftType: res.data.data
                        })
                    }
                }
            }
        )
    }

    async getBizparByCategoryHolidayStatus() {
        let payload = {
            params: {
                bizparCategory: "HOLIDAY_STATUS"
            },
            offset: 0,
            limit: 20
        }
        API.create('BIZPAR').getBizparByCategory(payload).then(
            (res) => {
                if (res.status === 200) {
                    if (res.data.status === 'S') {
                        this.setState({
                            bizparHolidayType: res.data.data
                        })
                    }
                }
            }
        )
    }

    async getBizparByCategoryOfficeHourType() {
        let payload = {
            params: {
                bizparCategory: "OFFICE_HOUR_TYPE"
            },
            offset: 0,
            limit: 20
        }
        API.create('BIZPAR').getBizparByCategory(payload).then(
            (res) => {
                if (res.status === 200) {
                    if (res.data.status === 'S') {
                        this.setState({
                            bizparOfficeHourType: res.data.data
                        })
                    }
                }
            }
        )
    }

    async getBizparByCategoryCalendarType() {
        let payload = {
            params: {
                bizparCategory: "CALENDAR_TYPE"
            },
            offset: 0,
            limit: 20
        }
        API.create('BIZPAR').getBizparByCategory(payload).then(
            (res) => {
                if (res.status === 200) {
                    if (res.data.status === 'S') {
                        this.setState({
                            bizparCalendarType: res.data.data
                        })
                    }
                }
            }
        )
    }

    async getBizparByCategoryDayType() {
        let payload = {
            params: {
                bizparCategory: "DAY_TYPE"
            },
            offset: 0,
            limit: 20
        }
        API.create('BIZPAR').getBizparByCategory(payload).then(
            (res) => {
                if (res.status === 200) {
                    if (res.data.status === 'S') {
                        this.setState({
                            bizparDayType: res.data.data
                        })
                    }
                }
            }
        )
    }

    //CUD----------------------------------------------------------------------
    handleSubmit(data, type) {
        console.log('test' + JSON.stringify(data))
        let payload, date, deafultTimeStart, deafultTimeEnd = ''

        switch (type) {
            case "corporateHoliday":
                if (data.holidayStartDate === '') {
                    deafultTimeStart = true
                } else { deafultTimeStart = false }

                if (data.holidayEndDate === '') {
                    deafultTimeEnd = true
                } else { deafultTimeEnd = false }


                date = data.holidayDate !== '' ? M.parseZone(data.holidayDate).format('DD-MM-YYYY') : dateNow
                payload = {
                    "corporateHolidayID": data.corporateHolidayID,
                    "esID": this.state.auth.user.companyID,
                    "holidayName": data.holidayName,
                    "holidayDate": date,
                    "holidayType": data.holidayType.bizparKey,
                    "isAllDay": data.isAllDay,
                    "holidayStartDate": deafultTimeStart ? timeNow : M(data.holidayStartDate, 'HH:mm:ss').format(date + ' HH:mm:ss'),
                    "holidayEndDate": deafultTimeEnd ? timeNow : M(data.holidayEndDate, 'HH:mm:ss').format(date + ' HH:mm:ss'),
                    "corporateHolidayPhotoURL": data.corporateHolidayPhotoURL,
                    "holidayStatus": 'ACTIVE',
                    "holidayCreationalDTO": {
                        "createdBy": this.props.auth.user.employeeID,
                        "createdDate": M().format("DD-MM-YYYY HH:mm:ss"),
                        "modifiedBy": this.props.auth.user.employeeID,
                        "modifiedDate": null
                    }
                }
                // return console.log('payload ', JSON.stringify(payload))
                API.create("CFG").postCorporateHoliday(payload).then(
                    (res) => {
                        console.log('res ', res)
                        if (res.status === 200) {
                            if (res.data.status === 'S') {
                                console.log('success ', res.data);
                                this.openSavePopUp()
                                this.getHoliday()
                            } else {
                                console.log(res.data)
                                alert('Failed: ', res.data.message)
                            }
                        }
                    }
                )
                console.log('tipe form', JSON.stringify(type))
                break;
            case 'corporateOfficeHour':
                // let dateNow = M().format('DD-MM-YYYY')
                if (data.corporateOfficeHourStartDate === '') {
                    deafultTimeStart = true
                } else { deafultTimeStart = false }

                if (data.corporateOfficeHourEndDate === '') {
                    deafultTimeEnd = true
                } else { deafultTimeEnd = false }
                payload = {
                    "corporateOfficeHourID": data.corporateOfficeHourID,
                    "esID": this.state.auth.user.companyID,
                    "dayType": data.dayType.bizparKey,
                    "corporateOfficeHourName": data.corporateOfficeHourName,
                    "corporateOfficeHourType": data.corporateOfficeHourType.bizparKey,
                    "calendarType": data.calendarType.bizparKey,
                    "corporateOfficeHourStartDate": deafultTimeStart ? timeNow : M(data.corporateOfficeHourStartDate, 'HH:mm:ss').format(dateNow + ' HH:mm:ss'),
                    "corporateOfficeHourEndDate": deafultTimeEnd ? timeNow : M(data.corporateOfficeHourEndDate, 'HH:mm:ss').format(dateNow + ' HH:mm:ss'),
                    "corporateOfficeHourPhotoURL": data.corporateOfficeHourPhotoURL,
                    "corporateOfficeHourStatus": data.corporateOfficeHourStatus === true ? "ACTIVE" : "INACTIVE",
                    "corporateOfficeHourCreational": {
                        "createdBy": this.props.auth.user.employeeID,
                        "createdDate": M().format("DD-MM-YYYY HH:mm:ss"),
                        "modifiedBy": this.props.auth.user.employeeID,
                        "modifiedDate": null
                    }
                }
                // return console.log('payload ', JSON.stringify(payload))
                API.create("CFG").postCorporateOfficeHour(payload).then(
                    (res) => {
                        console.log('res ', res)
                        if (res.status === 200) {
                            if (res.data.status === 'S') {
                                console.log('success ', res.data);
                                this.openSavePopUp()
                                this.getCorporateOfficeHourByStatus()
                            } else {
                                console.log(res.data)
                                alert('Failed: ', res.data.message)
                            }
                        }
                    }
                )
                break;
            case 'personalOfficeHour':
                date = data.personelOfficeDate !== '' ? M.parseZone(data.personelOfficeDate).format('DD-MM-YYYY') : dateNow
                if (data.personelOfficeHourStartDate === '') {
                    deafultTimeStart = true
                } else { deafultTimeStart = false }

                if (data.personelOfficeHourEndDate === '') {
                    deafultTimeEnd = true
                } else { deafultTimeEnd = false }
                payload = {
                    "personelOfficeHourID": data.personelOfficeHourID,
                    "employeeID": data.employeeID,
                    "esID": this.state.auth.user.companyID,
                    "personelOfficeDate": date,
                    "personelOfficeHourType": data.personelOfficeHourType.bizparKey,
                    "calendarType": data.calendarType.bizparKey,
                    "personelOfficeHourStartDate": deafultTimeStart ? timeNow : M(data.personelOfficeHourStartDate, 'HH:mm:ss').format(date + ' HH:mm:ss'),
                    "personelOfficeHourEndDate": deafultTimeEnd ? timeNow : M(data.personelOfficeHourEndDate, 'HH:mm:ss').format(date + ' HH:mm:ss'),
                    "personelOfficeHourStatus": 'ACTIVE',
                    "personelOfficeHourCreationalDTO": {
                        "createdBy": this.props.auth.user.employeeID,
                        "createdDate": M().format("DD-MM-YYYY HH:mm:ss"),
                        "modifiedBy": this.props.auth.user.employeeID,
                        "modifiedDate": null
                    }
                }
                // return console.log('payload ', JSON.stringify(payload))
                API.create("CFG").postPersonalOfficeHour(payload).then(
                    (res) => {
                        console.log('res ', res)
                        if (res.status === 200) {
                            if (res.data.status === 'S') {
                                console.log('success ', res.data);
                                this.openSavePopUp()
                                this.getPersonelOfficeHourByStatus()
                            } else {
                                console.log(res.data)
                                alert('Failed: ', res.data.message)
                            }
                        }
                    }
                )
                break;
            case 'officeShiftHour':
                // return console.log(data)
                if (data.shiftStartTime === '') {
                    deafultTimeStart = true
                } else { deafultTimeStart = false }

                if (data.shiftEndTime === '') {
                    deafultTimeEnd = true
                } else { deafultTimeEnd = false }
                let dateStart = data.shiftStartDate !== '' ? M.parseZone(data.shiftStartDate).format('DD-MM-YYYY') : dateNow
                let dateEnd = data.shiftEndDate !== '' ? M.parseZone(data.shiftEndDate).format('DD-MM-YYYY') : dateNow
                payload = {
                    "shiftCode": data.shiftCode,
                    "shiftLeaderID": data.shiftLeaderID,
                    "esID": this.state.auth.user.companyID,
                    "shiftType": data.shiftType.bizparKey,
                    "calendarType": data.calendarType.bizparKey,
                    "shiftStartDate": dateStart,
                    "shiftEndDate": dateEnd,
                    "shiftStartTime": deafultTimeStart ? timeNow : M(data.shiftStartTime, 'HH:mm:ss').format(dateStart + ' HH:mm:ss'),
                    "shiftEndTime": deafultTimeEnd ? timeNow : M(data.shiftEndTime, 'HH:mm:ss').format(dateEnd + ' HH:mm:ss'),
                    "shiftStatus": "ACTIVE",
                    "shiftHourCreationalDTO": {
                        "createdBy": this.props.auth.user.employeeID,
                        "createdDate": M().format("DD-MM-YYYY HH:mm:ss"),
                        "modifiedBy": this.props.auth.user.employeeID,
                        "modifiedDate": null
                    }
                }
                // return console.log('payload ', payload)
                API.create("CFG").postOfficeShiftHour(payload).then(
                    (res) => {
                        console.log('res ', res)
                        if (res.status === 200) {
                            if (res.data.status === 'S') {
                                console.log('success ', res.data);
                                this.openSavePopUp()
                                this.getOfficeShiftHourByStatus()
                            } else {
                                console.log(res.data)
                                alert('Failed: ', res.data.message)
                            }
                        }
                    }
                )
                break
            case 'payrollDetail-1':
                this.openSavePopUp()
                break;
            case 'payrollDetail-2':
                this.openSavePopUp()
                break;
            default:
                break;
        }
    }

    handleUpdate(data, type) {
        console.log("test" + JSON.stringify(data))
        let date, payload = ''
        switch (type) {
            case "corporateHoliday":
                date = data.holidayDate
                payload = {
                    "corporateHolidayID": data.corporateHolidayID,
                    "esID": data.es ? data.es.esid : this.props.auth.user.companyID,
                    "holidayName": data.holidayName,
                    "holidayDate": date,
                    "holidayType": data.holidayType.bizparKey,
                    "isAllDay": data.isAllDay,
                    "holidayStartDate": date + ' ' + data.holidayStartDate,
                    "holidayEndDate": date + ' ' + data.holidayEndDate,
                    "corporateHolidayPhotoURL": data.corporateHolidayPhotoURL,
                    "holidayStatus": 'ACTIVE',
                    "holidayCreationalDTO": {
                        "createdBy": this.props.auth.user.employeeID,
                        "createdDate": M().format("DD-MM-YYYY HH:mm:ss"),
                        "modifiedBy": this.props.auth.user.employeeID,
                        "modifiedDate": M().format("DD-MM-YYYY HH:mm:ss")
                    }
                }
                // return console.log('payload ', JSON.stringify(payload))
                API.create("CFG").updateCorporateHoliday(payload).then(
                    (res) => {
                        console.log('res ', res)
                        if (res.status === 200) {
                            if (res.data.status === 'S') {
                                console.log('success ', res.data);
                                this.openSavePopUp()
                                this.getHoliday()
                            } else {
                                console.log(res.data)
                                alert('Failed: ', res.data.message)
                            }
                        }
                    }
                )
                break;

            case 'corporateOfficeHour':
                // return console.log('data', data, type)
                // date = M.parseZone(data.corporateOfficeHourStartDate).format('DD-MM-YYYY')
                let dateNow = M().format('DD-MM-YYYY')
                payload = {
                    "corporateOfficeHourID": data.corporateOfficeHourID,
                    "esID": data.es ? data.es.esid : this.props.auth.user.companyID,
                    "dayType": data.dayType.bizparKey,
                    "corporateOfficeHourName": data.corporateOfficeHourName,
                    "corporateOfficeHourType": data.corporateOfficeHourType.bizparKey,
                    "calendarType": data.calendarType.bizparKey,
                    "corporateOfficeHourStartDate": M(data.corporateOfficeHourStartDate, 'HH:mm:ss').format(dateNow + ' HH:mm:ss'),
                    "corporateOfficeHourEndDate": M(data.corporateOfficeHourEndDate, 'HH:mm:ss').format(dateNow + ' HH:mm:ss'),
                    "corporateOfficeHourPhotoURL": data.corporateOfficeHourPhotoURL,
                    "corporateOfficeHourStatus": 'ACTIVE',
                    "corporateOfficeHourCreational": {
                        "createdBy": this.props.auth.user.employeeID,
                        "createdDate": M().format("DD-MM-YYYY HH:mm:ss"),
                        "modifiedBy": this.props.auth.user.employeeID,
                        "modifiedDate": M().format("DD-MM-YYYY HH:mm:ss")
                    }
                }
                // return console.log('payload ', JSON.stringify(payload))
                API.create("CFG").updateCorporateOfficeHour(payload).then(
                    (res) => {
                        console.log('res ', res)
                        if (res.status === 200) {
                            if (res.data.status === 'S') {
                                console.log('success ', res.data);
                                this.openSavePopUp()
                                this.getCorporateOfficeHourByStatus()
                            } else {
                                console.log(res.data)
                                alert('Failed: ', res.data.message)
                            }
                        }
                    }
                )
                break;

            case 'personalOfficeHour':
                date = M.parseZone(data.personelOfficeDate).format('DD-MM-YYYY')
                payload = {
                    "personelOfficeHourID": data.personelOfficeHourID,
                    "employeeID": data.employee.employeeID,
                    "esID": data.company.esid,
                    "personelOfficeDate": date,
                    "personelOfficeHourType": data.personelOfficeHourType.bizparKey,
                    "calendarType": data.calendarType.bizparKey,
                    "personelOfficeHourStartDate": M(data.personelOfficeHourStartDate, 'HH:mm:ss').format(date + ' HH:mm:ss'),
                    "personelOfficeHourEndDate": M(data.personelOfficeHourEndDate, 'HH:mm:ss').format(date + ' HH:mm:ss'),
                    "personelOfficeHourStatus": "ACTIVE",
                    "personelOfficeHourCreationalDTO": {
                        "modifiedBy": this.props.auth.user.employeeID,
                        "modifiedDate": M().format("DD-MM-YYYY HH:mm:ss")
                    }
                }
                // return console.log('payload ', payload)
                API.create("CFG").updatePersonalOfficeHour(payload).then(
                    (res) => {
                        console.log('res ', res)
                        if (res.status === 200) {
                            if (res.data.status === 'S') {
                                console.log('success ', res.data);
                                this.openSavePopUp()
                                this.getPersonelOfficeHourByStatus()
                            } else {
                                console.log(res.data)
                                alert('Failed: ', res.data.message)
                            }
                        }
                    }
                )
                break;

            case 'officeShiftHour':
                // return console.log(data)
                // let dateStart = M(data.shiftStartDate).format('DD-MM-YYYY')
                // let dateEnd = M(data.shiftEndDate).format('DD-MM-YYYY')
                payload = {
                    "shiftCode": data.shiftCode,
                    "shiftLeaderID": data.shiftLeader.employeeID,
                    "esID": data.company.esid,
                    "shiftType": data.shiftType.bizparKey,
                    "calendarType": data.calendarType.bizparKey,
                    "shiftStartDate": data.shiftStartDate,
                    "shiftEndDate": data.shiftEndDate,
                    "shiftStartTime": M(data.shiftStartTime, 'HH:mm:ss').format(data.shiftStartDate + ' HH:mm:ss'),
                    "shiftEndTime": M(data.shiftEndTime, 'HH:mm:ss').format(data.shiftEndDate + ' HH:mm:ss'),
                    "shiftStatus": "ACTIVE",
                    "shiftHourCreationalDTO": {
                        "createdBy": this.props.auth.user.employeeID,
                        "createdDate": M().format("DD-MM-YYYY HH:mm:ss"),
                        "modifiedBy": this.props.auth.user.employeeID,
                        "modifiedDate": M().format("DD-MM-YYYY HH:mm:ss")
                    }
                }
                console.log('payload ', payload)
                API.create("CFG").updateOfficeShiftHour(payload).then(
                    (res) => {
                        console.log('res ', res)
                        if (res.status === 200) {
                            if (res.data.status === 'S') {
                                console.log('success ', res.data);
                                this.openSavePopUp()
                                this.getOfficeShiftHourByStatus()
                            } else {
                                console.log(res.data)
                                alert('Failed: ', res.data.message)
                            }
                        }
                    }
                )
                break;

            default:
                break;
        }
        console.log('tipe form', JSON.stringify(type))
    }

    handleDelete = async () => {
        let type = this.state.formType
        let response, payload = ''
        // return console.log('payload ',  this.state.rawData[this.state.selectedIndex].corporateHolidayID)
        switch (type) {
            case "corporateHoliday":
                payload = {
                    referenceID: this.state.rawData[this.state.selectedIndex].corporateHolidayID,
                    requestBy: "SYSTEM",
                    requestDate: M().format("DD-MM-YYYY HH:mm:ss")
                }

                response = await API.create('CFG').deleteCorporateHoliday(payload)
                if (response.ok && response.data.status === 'S') {
                    this.setState({ deletePopUpVisible: false })
                    this.getHoliday()
                } else {
                    if (response.data && response.data.message) alert(response.data.message)
                }
                console.log('tipe form', JSON.stringify(type))
                break;

            case 'corporateOfficeHour':
                payload = {
                    referenceID: this.state.rawData[this.state.selectedIndex].corporateOfficeHourID,
                    requestBy: "SYSTEM",
                    requestDate: M().format("DD-MM-YYYY HH:mm:ss")
                }

                response = await API.create('CFG').deleteCorporateOfficeHour(payload)
                if (response.ok && response.data.status === 'S') {
                    this.setState({ deletePopUpVisible: false })
                    this.getCorporateOfficeHourByStatus()
                } else {
                    if (response.data && response.data.message) alert(response.data.message)
                }
                console.log('tipe form', JSON.stringify(type))
                break;

            case 'personalOfficeHour':
                payload = {
                    referenceID: this.state.rawData[this.state.selectedIndex].personelOfficeHourID,
                    requestBy: "SYSTEM",
                    requestDate: M().format("DD-MM-YYYY HH:mm:ss")
                }

                response = await API.create('CFG').deletePersonalOfficeHour(payload)
                if (response.ok && response.data.status === 'S') {
                    this.setState({ deletePopUpVisible: false })
                    this.getPersonelOfficeHourByStatus()
                } else {
                    if (response.data && response.data.message) alert(response.data.message)
                }
                console.log('tipe form', JSON.stringify(type))
                break;

            case 'officeShiftHour':
                payload = {
                    referenceID: this.state.rawData[this.state.selectedIndex].shiftCode,
                    requestBy: "SYSTEM",
                    requestDate: M().format("DD-MM-YYYY HH:mm:ss")
                }

                response = await API.create('CFG').deleteOfficeShiftHour(payload)
                if (response.ok && response.data.status === 'S') {
                    this.setState({ deletePopUpVisible: false })
                    this.getOfficeShiftHourByStatus()
                } else {
                    if (response.data && response.data.message) alert(response.data.message)
                }
                console.log('tipe form', JSON.stringify(type))
                break;
            default:
                break;
        }
    }

    // =================================================================================================
    clSidePage = () => {
        this.setState({ classAppSlidePage: 'app-side-page' })
    }

    openSavePopUp = () => {
        this.setState({
            savePopUpVisible: !this.state.savePopUpVisible,
            slideCorporateHoliday: false,
            slideCorporateOfficeHour: false,
            slideOfficeShiftHour: false,
            slidePersonalOfficeHour: false,
            classAppSlidePage: 'app-side-page'
        })
        this.clResizePane()
    }

    closePopUpCreate = () => {
        this.setState({
            savePopUpVisible: !this.state.savePopUpVisible,
            createCorporateHoliday: false,
            createCorporateOfficeHour: false,
            createOfficeShiftHour: false,
            createPersonalOfficeHour: false
        })
    }

    openDeletePopUp = (rawData, index, type) => {
        this.setState({
            deletePopUpVisible: !this.state.deletePopUpVisible, selectedIndex: index, rawData: rawData, formType: type,
            slideCorporateHoliday: false,
            slideCorporateOfficeHour: false,
            slideOfficeShiftHour: false,
            slidePersonalOfficeHour: false,
            classAppSlidePage: 'app-side-page'
        })
    }

    opPopupPage = (menu) => (e) => {
        e.preventDefault()

        this.setState({
            createCorporateHoliday: false,
            createCorporateOfficeHour: false,
            createOfficeShiftHour: false,
            createPersonalOfficeHour: false
        })

        this.clResizePane()
        switch (menu) {
            case 'popup-menu-1':
                this.setState({
                    createCorporateHoliday: true,
                    slideCorporateHoliday: false,
                    slideCorporateOfficeHour: false,
                    slideOfficeShiftHour: false,
                    slidePersonalOfficeHour: false,
                    classAppSlidePage: 'app-side-page'
                })
                break
            case 'popup-menu-2':
                this.setState({
                    createCorporateOfficeHour: true,
                    slideCorporateHoliday: false,
                    slideCorporateOfficeHour: false,
                    slideOfficeShiftHour: false,
                    slidePersonalOfficeHour: false,
                    classAppSlidePage: 'app-side-page'
                })
                break
            case 'popup-menu-3':
                this.setState({
                    createPersonalOfficeHour: true,
                    slideCorporateHoliday: false,
                    slideCorporateOfficeHour: false,
                    slideOfficeShiftHour: false,
                    slidePersonalOfficeHour: false,
                    classAppSlidePage: 'app-side-page'
                })
                break
            case 'popup-menu-4':
                this.setState({
                    createOfficeShiftHour: true,
                    slideCorporateHoliday: false,
                    slideCorporateOfficeHour: false,
                    slideOfficeShiftHour: false,
                    slidePersonalOfficeHour: false,
                    classAppSlidePage: 'app-side-page'
                })
                break
            default:
                break;
        }
    }

    clPopupPage = () => {
        let savePopUpVisible = this.state.savePopUpVisible ? !this.state.savePopUpVisible : false;
        this.setState({
            createCorporateHoliday: false,
            createCorporateOfficeHour: false,
            createOfficeShiftHour: false,
            createPersonalOfficeHour: false,
            savePopUpVisible
        })
    }

    render() {
        return (
            <div>
                <ResizeSlider
                    allowResize={this.state.allowResize}
                    defaultSize={this.state.defaultSize}
                    minSize={this.state.minSize}
                    maxSize={this.state.maxSize}
                    main={(
                        <div>
                            <div className="a-s-p-place a-s-p-content active">
                                <div className="a-s-p-top">
                                    <div className="grid grid-2x">
                                        <div className="col-1">
                                            <div className="margin-left-15px margin-top-10px margin-bottom-10px display-flex-normal">
                                                <div>
                                                    <i className="color-blue fa fa-1x fa-calendar margin-right-10px"></i>
                                                </div>
                                                <div>
                                                    <div className="txt-site txt-12 txt-bold txt-main">Corporate Time</div>
                                                    <div className="txt-site txt-10 txt-thin txt-primary">Corporate Time</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-2 content-right">
                                            {/* <button className="btn btn-circle btn-grey">
                                            <i className="fa fa-lw fa-search" />
                                        </button>
                                        <button className="btn btn-grey">
                                            <i className="fa fa-1x fa-filter" /> FILTER
                                        </button> */}
                                        </div>
                                    </div>
                                </div>
                                <div className="a-s-p-mid border-top">
                                    <div className="padding-10px">
                                        <div className="app-open-close margin-bottom-20px">
                                            <input
                                                type="checkbox"
                                                name="navmenu"
                                                className="app-open-close-input"
                                                id="navmenu-ch" />
                                            <div className="grid grid-2x margin-bottom-10px">
                                                <div className="col-1">
                                                    <div className="display-flex-normal margin-top-10px">
                                                        <i className="fa fa-1x fa-calendar margin-right-5px"></i>
                                                        <span className="txt-site txt-11 txt-main">Corporate Holiday</span>
                                                    </div>
                                                </div>
                                                <div className="col-2 content-right">
                                                    <label htmlFor="navmenu-ch">
                                                        <div className="app-open-close-icon"></div>
                                                    </label>
                                                    <button
                                                        onClick={this.opPopupPage('popup-menu-1')}
                                                        className="btn btn-small-circle btn-sekunder margin-left-5px">
                                                        <i className="fa fa-lw fa-plus" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="app-open-close-content">
                                                <CorporateHoliday
                                                    ref="child"
                                                    data={this.state.dataHoliday}
                                                    rawData={this.state.rawDataHoliday}
                                                    openSlide={this.opSidePage.bind(this)}
                                                    onClickDelete={this.openDeletePopUp.bind(this)}
                                                >
                                                </CorporateHoliday>
                                            </div>
                                        </div>

                                        <div className="app-open-close margin-top-20px">
                                            <input
                                                type="checkbox"
                                                name="navmenu"
                                                className="app-open-close-input"
                                                id="navmenu-coh" />
                                            <div className="grid grid-2x margin-bottom-10px">
                                                <div className="col-1">
                                                    <div className="display-flex-normal margin-top-10px">
                                                        <i className="fa fa-1x fa-clock margin-right-5px"></i>
                                                        <span className="txt-site txt-11 txt-main">Corporate Office Hour</span>
                                                    </div>
                                                </div>
                                                <div className="col-2 content-right">
                                                    <label htmlFor="navmenu-coh">
                                                        <div className="app-open-close-icon"></div>
                                                    </label>
                                                    <button
                                                        onClick={this.opPopupPage('popup-menu-2')}
                                                        className="btn btn-small-circle btn-sekunder margin-left-5px">
                                                        <i className="fa fa-lw fa-plus" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="app-open-close-content">
                                                <CorporateOfficeHour
                                                    ref="child2"
                                                    data={this.state.dataTableCorporateOfficeHour}
                                                    rawData={this.state.rawDataCorporateOfficeHour}
                                                    bizparDayType={this.state.bizparDayType}
                                                    openSlide={this.opSidePage.bind(this)}
                                                    onClickDelete={this.openDeletePopUp.bind(this)}></CorporateOfficeHour>
                                            </div>
                                        </div>

                                        <div className="app-open-close margin-top-20px">
                                            <input
                                                type="checkbox"
                                                name="navmenu"
                                                className="app-open-close-input"
                                                id="navmenu-poh" />
                                            <div className="grid grid-2x margin-bottom-10px">
                                                <div className="col-1">
                                                    <div className="display-flex-normal margin-top-10px">
                                                        <i className="fa fa-1x fa-people-carry margin-right-5px"></i>
                                                        <span className="txt-site txt-11 txt-main">Personal Office Hour</span>
                                                    </div>
                                                </div>
                                                <div className="col-2 content-right">
                                                    <label htmlFor="navmenu-poh">
                                                        <div className="app-open-close-icon"></div>
                                                    </label>
                                                    <button
                                                        onClick={this.opPopupPage('popup-menu-3')}
                                                        className="btn btn-small-circle btn-sekunder margin-left-5px">
                                                        <i className="fa fa-lw fa-plus" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="app-open-close-content">
                                                <PersonalOfficeHour
                                                    ref="child3"
                                                    data={this.state.dataTablePersonalOfficeHour}
                                                    rawData={this.state.rawDataPersonalOfficeHour}
                                                    openSlide={this.opSidePage.bind(this)}
                                                    onClickDelete={this.openDeletePopUp.bind(this)}
                                                >
                                                </PersonalOfficeHour>
                                            </div>
                                        </div>

                                        <div className="app-open-close margin-top-20px">
                                            <input
                                                type="checkbox"
                                                name="navmenu"
                                                className="app-open-close-input"
                                                id="navmenu-osh" />
                                            <div className="grid grid-2x margin-bottom-10px">
                                                <div className="col-1">
                                                    <div className="display-flex-normal margin-top-10px">
                                                        <i className="fa fa-1x fa-building margin-right-5px"></i>
                                                        <span className="txt-site txt-11 txt-main">Office Shift Hour</span>
                                                    </div>
                                                </div>
                                                <div className="col-2 content-right">
                                                    <label htmlFor="navmenu-osh">
                                                        <div className="app-open-close-icon"></div>
                                                    </label>
                                                    <button
                                                        onClick={this.opPopupPage('popup-menu-4')}
                                                        className="btn btn-small-circle btn-sekunder margin-left-5px">
                                                        <i className="fa fa-lw fa-plus" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="app-open-close-content">
                                                <OfficeShiftHour
                                                    ref="child4"
                                                    data={this.state.dataTableOfficeShiftHour}
                                                    rawData={this.state.rawDataOfficeShiftHour}
                                                    openSlide={this.opSidePage.bind(this)}
                                                    onClickDelete={this.openDeletePopUp.bind(this)}></OfficeShiftHour>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    side={(
                        <div className="a-s-p-side">
                            {/* edit */}
                            {(this.state.slideCorporateHoliday)
                                ? (<FormEditCorporateHoliday
                                    bizparHolidayType={this.state.bizparHolidayType}
                                    rawData={this.state.rawData}
                                    closeSlide={this.clResizePane}
                                    onClickSave={this.handleUpdate.bind(this)} />)
                                : null}

                            {(this.state.slideCorporateOfficeHour)
                                ? (<FormEditCorporateOfficeHour
                                    bizparDayType={this.state.bizparDayType}
                                    bizparCalendarType={this.state.bizparCalendarType}
                                    bizparOfficeHourType={this.state.bizparOfficeHourType}
                                    closeSlide={this.clResizePane}
                                    rawData={this.state.rawData}
                                    onClickSave={this.handleUpdate.bind(this)} />)
                                : null}

                            {(this.state.slidePersonalOfficeHour)
                                ? (<FormEditPersonalOfficeHour
                                    bizparCalendarType={this.state.bizparCalendarType}
                                    bizparOfficeHourType={this.state.bizparOfficeHourType}
                                    rawData={this.state.rawData}
                                    closeSlide={this.clResizePane}
                                    onClickSave={this.handleUpdate.bind(this)} />)
                                : null}

                            {(this.state.slideOfficeShiftHour)
                                ? (<FormEditOfficeShiftHour
                                    bizparCalendarType={this.state.bizparCalendarType}
                                    bizparShiftType={this.state.bizparShiftType}
                                    closeSlide={this.clResizePane}
                                    rawData={this.state.rawData}
                                    onClickSave={this.handleUpdate.bind(this)} />)
                                : null}
                        </div>
                    )}></ResizeSlider>

                {/* create */}
                {(this.state.createCorporateHoliday)
                    ? (<FormCreateCorporateHoliday
                        bizparHolidayType={this.state.bizparHolidayType}
                        onClickClose={this.clPopupPage}
                        onClickSave={this.handleSubmit.bind(this)} />)
                    : null}

                {(this.state.createCorporateOfficeHour)
                    ? (<FormCreateCorporateOfficeHour
                        bizparCalendarType={this.state.bizparCalendarType}
                        bizparDayType={this.state.bizparDayType}
                        bizparOfficeHourType={this.state.bizparOfficeHourType}
                        onClickClose={this.clPopupPage}
                        onClickSave={this.handleSubmit.bind(this)} />)
                    : null}

                {(this.state.createPersonalOfficeHour)
                    ? (<FormCreatePersonalOfficeHour
                        bizparCalendarType={this.state.bizparCalendarType}
                        bizparOfficeHourType={this.state.bizparOfficeHourType}
                        onClickClose={this.clPopupPage}
                        onClickSave={this.handleSubmit.bind(this)} />)
                    : null}

                {(this.state.createOfficeShiftHour)
                    ? (<FormCreateOfficeShiftHour
                        bizparCalendarType={this.state.bizparCalendarType}
                        bizparShiftType={this.state.bizparShiftType}
                        onClickClose={this.clPopupPage}
                        onClickSave={this.handleSubmit.bind(this)} />)
                    : null}


                {/* notification */}
                {this.state.savePopUpVisible && (
                    <PopUp
                        type={"save"}
                        class={"app-popup app-popup-show"}
                        onClick={this.closePopUpCreate.bind(this)}
                    />
                )}

                {this.state.deletePopUpVisible && (
                    <PopUp
                        type={"delete"}
                        class={"app-popup app-popup-show"}
                        onClick={this.openDeletePopUp}
                        onClickDelete={this.handleDelete.bind(this)}
                    />
                )}
            </div>

        )
    }
}
const mapStateToProps = state => {
    return {
        auth: state.auth
    };
};

export default connect(mapStateToProps)(CorporateTime)