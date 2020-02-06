import React, { Component } from 'react'
import FlexView from 'react-flexview'
import FormReport from './formReport';
import CalendarPicker from '../../../modules/popup/Calendar'
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import MUIDataTable from "mui-datatables-bitozen"
import DropDown from '../../../modules/popup/DropDown'
import * as R from 'ramda'
import FormSearchEmp from '../../../components/systemConfiguration/userManagement/forms/create/searchEmployee'
import Api from '../../../Services/Api';
import PopUp from '../../../components/pages/PopUpAlert';
import M from 'moment'
import { Checkbox } from "@material-ui/core"
import TimePicker from "../../../modules/popup/Time";
import FileViewer from 'react-file-viewer'
import NumberFormat from "react-number-format"
import UploadFile from '../../upload/upload'
import AuthAction from "../../../Redux/AuthRedux";
import { connect } from "react-redux";

var ct = require("../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions4()

class Resubmit extends Component {
    constructor(props) {
        super(props)
        let title = this.props.data.taskName
        title = title.toLowerCase().split(' ')
        title = title.map((value) => {
            let string = value.replace(/^\w/, c => c.toUpperCase())
            return string + ' '
        })
        this.state = {
            data: this.props.data,
            user: this.props.user,
            title,
            titleNumber: this.props.type + ' Number',
            notes: '',
            reportURL: '',
            reportVisible: false,
            createPopUpVisible: false,
            deletePopUpVisible: false,
            date: '',
            date2: '',
            date3: '',
            date4: '',
            date5: '',
            spkNumber: '',
            information: '',
            psikotestType: '',
            pic: '',
            url: '',
            document: [],
            blacklistType: '',
            blacklistCategory: '',
            interviewTypeValue: '',
            documentUrl: '',
            note: '',
            task: '',
            location: '',
            formSearchEmpVisible: false,
            formFileVisible: false,
            isPermanent: false,
            dataEmp: {
                employeeID: '',
                employeeName: ''
            },
            dataByID: '',
            claimValue: '',
            claimDescription: ''
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.data !== prevProps.data) {
            let title = this.props.data.taskName
            title = title.toLowerCase().split(' ')
            title = title.map((value) => {
                let string = value.replace(/^\w/, c => c.toUpperCase())
                return string + ' '
            })
            this.getData(this.props.data.variables.TASK_TYPE, this.props.data.variables.TASK_REFNO)
            this.setState({
                data: this.props.data,
                titleNumber: this.props.type + ' Number',
                title
            })
        }
    }

    componentWillMount() {
        this.getData(this.props.data.variables.TASK_TYPE, this.props.data.variables.TASK_REFNO)
    }

    getData(value, id) {
        let data = ''
        switch (value) {
            case "MOVEMENTRESUBMIT":
                Api.create('MOVEMENT_QUERY').getMovementByID(id)
                    .then((res) => {
                        if (res.data && res.data.status === 'S') {
                            data = res.data.data
                            this.setState({
                                dataByID: data
                            })
                        }
                        else return alert(res.data.message)
                    })
                break;
            case "BUSINESSTRIPRESUBMIT":
                Api.create('TIME_QUERY').getSppdByID(id)
                    .then((res) => {
                        if (res.data && res.data.status === 'S') {
                            data = res.data.data
                            this.setState({
                                dataByID: data
                            })
                        }
                        else return alert(res.data.message)
                    })
                break;
            case "TERMINATIONRESUBMIT":
                Api.create('TERMINATION_QUERY').getTerminationByID(id)
                    .then((res) => {
                        if (res.data && res.data.status === 'S') {
                            data = res.data.data
                            this.setState({
                                dataByID: data
                            })
                        }
                        else return alert(res.data.message)
                    })
                break;
            case "TRAININGRESUBMIT":

                Api.create('TRAINING_QUERY').getTrainingByID(id)
                    .then((res) => {
                        if (res.data && res.data.status === 'S') {
                            data = res.data.data
                            this.setState({
                                dataByID: data
                            })
                        }
                        else return alert(res.data.message)
                    })
                break;
            case "LEAVERESUBMIT":
                Api.create('TIME_QUERY').getLeaveByID(id)
                    .then((res) => {
                        if (res.data && res.data.status === 'S') {
                            data = res.data.data
                            this.setState({
                                dataByID: data
                            })
                        }
                        else return alert(res.data.message)
                    })
                break;
            case "ABSENCERESUBMIT":
                Api.create('REQUEST_QUERY').getAbsenceByID(id)
                    .then((res) => {
                        if (res.data && res.data.status === 'S') {
                            data = res.data.data
                            this.setState({
                                dataByID: data
                            })
                        }
                        else return alert(res.data.message)
                    })
                break;
            case "BLACKLISTRESUBMIT":
                Api.create('BLACKLIST').getBlacklistByID(id)
                    .then((res) => {
                        if (res.data && res.data.status === 'S') {
                            data = res.data.data
                            this.setState({
                                dataByID: data
                            })
                        }
                        else return alert(res.data.message)
                    })
                break;
            case "OVERTIMERESUBMIT":
                Api.create('TIME_QUERY').getOvertimeByOVID(id)
                    .then((res) => {
                        if (res.data && res.data.status === 'S') {
                            data = res.data.data
                            this.setState({
                                dataByID: data
                            })
                        }
                        else return alert(res.data.message)
                    })
                break;
            case "PAYROLLBATCHAPPROVAL":
                Api.create('CNB_QUERY').getBatchPayrollById(id)
                    .then((res) => {
                        if (res.data && res.data.status === 'S') {
                            data = res.data.data
                            this.setState({
                                dataByID: data
                            })
                        }
                        else return alert(res.data.message)
                    })
                break;
            case "CLAIMRESUBMIT":
                Api.create('CNB_QUERY').getClaimById(id)
                    .then((res) => {
                        if (res.data && res.data.status === 'S') {
                            data = res.data.data
                            this.setState({ dataByID: data })
                        } else return alert(res.data.message)
                    })
                break;
            case "MPPRESUBMIT":
                    Api.create('CFG').getMppByID(id)
                        .then((res) => {
                            if (res.data && res.data.status === 'S') {
                                data = res.data.data
                                this.setState({ dataByID: data })
                            } else return alert(res.data.message)
                        })
                break;
            default:
                break
        }
    }

    openSearch() {
        this.setState({ formSearchEmpVisible: !this.state.formSearchEmpVisible })
    }

    pickEmployee(value) {
        let dataEmp = value
        this.setState({ dataEmp, pic: value.employeeID, formSearchEmpVisible: !this.state.formSearchEmpVisible })
    }

    deleteDocument() {
        this.setState({
            document: '',
            deletePopUpVisible: false
        })
    }

    openDeletePopup = () => {
        this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible })
    };

    columnsDocument = [
        {
            name: "Document",
            options: {
                customBodyRender: (val) => {
                    return (
                        <div>
                            <i className="fas fa-lw fa-file" /> {this.state.document}
                        </div>
                    );
                }
            }
        },
        {
            name: "Action",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (

                        <div>
                            <button
                                type="button"
                                className="btn btn-blue btn-small-circle"
                                style={{ marginRight: 5 }}
                                onClick={() => this.getFile()}
                            >
                                <i className="fa fa-lw fa-print" />
                            </button>
                            {this.props.type !== "view" ?
                                <button
                                    type="button"
                                    className="btn btn-red btn-small-circle"
                                    onClick={() => this.openDeletePopup()}
                                >
                                    <i className="fa fa-lw fa-trash-alt" />
                                </button>
                                : null}

                        </div>

                    );
                }
            }
        }
    ]


    dataDocument = []

    renderHeader = () => (
        <div className="popup-panel grid grid-2x">
            <div className="col-1">
                <div className="popup-title">
                    {this.state.title}
                </div>
            </div>
            <div className="col-2 content-right">
                <button
                    className="btn btn-circle background-white"
                    onClick={this.props.onClickClose}
                >
                    <i className="fa fa-lg fa-times" />
                </button>
            </div>
        </div>
    )

    handleApproval(type) {
        let notes = this.state.notes
        let { taskID, taskName } = this.state.data
        // let { SENDER_USERID, SENDER_EMPID, SENDER_ESID } = this.state.data.variables
        let SENDER_USERID = this.state.user.userID
        let SENDER_EMPID = this.state.user.employeeID
        let data = this.state.dataByID
        let { payload, buttonType } = ''

        switch (type) {
            case 'SAVE & SUBMIT':
                buttonType = 'RESUBMIT'
                break;
            default:
                break;
        }
        switch (taskName) {
            case 'BUSINESS TRIP RESUBMIT':
                if (R.isEmpty(this.state.date)) return alert('Start Date is Required.')
                if (R.isEmpty(this.state.date2)) return alert('End Date is Required.')
                if (!R.isEmpty(this.state.date) && !R.isEmpty(this.state.date2) && (this.state.date2 < this.state.date)) return alert('End Date Should be Greater Than Start Date.')
                if (R.isEmpty(this.state.location)) return alert('Location is Required.')
                if (R.isEmpty(this.state.document)) return alert('Document is Required.')
                let sppdFacilities = Object.assign([], data.sppdFacilities)
                sppdFacilities = data.sppdFacilities && data.sppdFacilities.map((value) => {
                    return {
                        "facilityCategory": value.facilityCategory.bizparKey ? value.facilityCategory.bizparKey : '',
                        "facilityOrderCategory": value.facilityOrderCategory.bizparKey ? value.facilityOrderCategory.bizparKey : '',
                        "facilityOrderType": value.facilityOrderType.bizparKey ? value.facilityOrderType.bizparKey : '',
                        "facilityType": value.facilityType.bizparKey ? value.facilityType.bizparKey : '',
                        "sppdFacilityID": value.sppdFacilityID,
                        "sppdIsBill": value.sppdIsBill,
                        "sppdNotes": value.sppdNotes
                    }
                })
                payload = {
                    "taskID": taskID,
                    "senderUserID": SENDER_USERID,
                    "senderEmpID": SENDER_EMPID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "sppdID": data.sppdID,
                        "sppdStartDate": M(this.state.date).format("DD-MM-YYYY"),
                        "sppdEndDate": M(this.state.date2).format("DD-MM-YYYY"),
                        "sppdDeparturePlace": data.sppdDeparturePlace,
                        "sppdDestinationPlace": this.state.location,
                        "sppdReason": R.isEmpty(this.state.task) ? data.sppdReason : this.state.task,
                        "sppdStatus": data.sppdStatus,
                        "employeeID": data.employee ? data.employee.employeeID : '',
                        "sppdNotes": R.isEmpty(this.state.note) ? data.sppdNotes : this.state.note,
                        "sppdDocumentURL": this.state.documentUrl,
                        "sppdRequestBy": data.sppdRequestBy ? data.sppdRequestBy.employeeID : '',
                        "sppdTripType": data.sppdTripType.bizparKey ? data.sppdTripType.bizparKey : '',
                        "sppdType": data.sppdType.bizparKey ? data.sppdType.bizparKey : '',
                        "sppdCategory": data.sppdCategory.bizparKey ? data.sppdCategory.bizparKey : '',
                        "sppdCurrency": data.sppdCurrency.bizparKey ? data.sppdCurrency.bizparKey : '',
                        "sppdFacilities": sppdFacilities,
                        "createdBy": SENDER_EMPID,
                        "createdDate": data.sppdCreationalDTO.createdDate,
                        "updatedBy": SENDER_EMPID,
                        "updatedDate": data.sppdCreationalDTO.modifiedDate
                    }
                }
                break;
            case 'OVERTIME RESUBMIT':
                if (R.isEmpty(this.state.date)) return alert('Start Time is Required.')
                if (R.isEmpty(this.state.date2)) return alert('End Time is Required.')
                if (!R.isEmpty(this.state.date) && !R.isEmpty(this.state.date2) && (this.state.date2 < this.state.date)) return alert('End Time Should be Greater Than Start Time.')
                if (R.isEmpty(this.state.information)) return alert('Reason is Required.')
                if (R.isEmpty(this.state.document)) return alert('Document is Required.')

                payload = {
                    "taskID": taskID,
                    "senderUserID": SENDER_USERID,
                    "senderEmpID": SENDER_EMPID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "overtimeID": data.overtimeID,
                        "overtimeDate": data.overtimeDate,
                        "overtimeStartDate": data.overtimeDate + ' ' + this.state.date,
                        "overtimeEndDate": data.overtimeDate + ' ' + this.state.date2,
                        "overtimeNotes": this.state.information,
                        "overtimeStatus": data.overtimeStatus,
                        "employeeID": data.employee ? data.employee.employeeID : '',
                        "overtimeDocumentURL": this.state.document,
                        "overtimeTaskDescription": data.overtimeTaskDescription,
                        "overtimeType": data.overtimeType ? data.overtimeType.corporateOvertimeID : '',
                        "createdBy": SENDER_EMPID,
                        "createdDate": data.overtimeCreationalDTO.createdDate,
                        "updatedBy": SENDER_EMPID,
                        "updatedDate": data.overtimeCreationalDTO.modifiedDate
                    }
                }
                break;
            case 'BLACKLIST RESUBMIT':
                //--- Validation
                if (!this.state.isPermanent) {
                    if (!R.isEmpty(this.state.date) && !R.isEmpty(this.state.date2) && (this.state.date2 < this.state.date)) return alert('End Date Should be Greater Than Start Date. BLACKLIST')
                } else {
                    this.setState({
                        date: '',
                        date2: ''
                    })
                }
                if (R.isEmpty(this.state.blacklistType)) return alert('Blacklist Type is Required.')
                if (R.isEmpty(this.state.blacklistCategory)) return alert('Blacklist Category is Required.')
                if (R.isEmpty(this.state.information)) return alert('Reason is Required.')
                if (!this.state.isPermanent && R.isEmpty(this.state.date)) return alert('Effectife Start Date is Required.')
                if (!this.state.isPermanent && R.isEmpty(this.state.date2)) return alert('Effectife End Date is Required.')
                //---
                payload = {
                    "taskID": taskID,
                    "senderUserID": SENDER_USERID,
                    "senderEmpID": SENDER_EMPID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "blacklistID": data.blacklistID,
                        "blacklistSPKNumber": data.blacklistSPKNumber,
                        "blacklistName": data.blacklistName,
                        "blacklistStartDate": this.state.isPermanent ? '' : M(this.state.date).format("DD-MM-YYYY HH:mm:ss"),
                        "blacklistEndDate": this.state.isPermanent ? '' : M(this.state.date2).format("DD-MM-YYYY HH:mm:ss"),
                        "blacklistNotes": this.state.information,
                        "blacklistType": this.state.blacklistType,
                        "blacklistCategory": this.state.blacklistCategory,
                        "isPermanent": this.state.isPermanent,
                        "employeeID": data.employee.employeeID,
                        "blacklistStatus": data.blacklistStatus,
                        "blacklistCreationalDTO": {
                            "createdBy": SENDER_EMPID,
                            "createdDate": data.blacklistCreationalDTO.createdDate,
                            "modifiedBy": SENDER_EMPID,
                            "modifiedDate": data.blacklistCreationalDTO.modifiedDate
                        }
                    }
                }
                break;
            case 'TRAINING REQUEST RESUBMIT':
                payload = {
                    "taskID": taskID,
                    "senderUserID": SENDER_USERID,
                    "senderEmpID": SENDER_EMPID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "createdBy": SENDER_EMPID,
                        "createdDate": data.trainingCreationalDTO.createdDate,
                        "employeeID": data.employeeID.employeeID,
                        "esID": data.esID.esid,
                        "recordID": data.trainingID.recordID,
                        "trainingID": data.trainingID.trainingID,
                        "trainingRequestID": data.trainingRequestID,
                        "trainingRequestStatus": data.trainingRequestStatus,
                        "updatedBy": SENDER_EMPID,
                        "updatedDate": data.trainingCreationalDTO.modifiedDate
                    }
                }
                break;
            case 'MANUAL ABSENCE RESUBMIT':
                if (R.isEmpty(this.state.information)) return alert('Reason is Required.')
                payload = {
                    "taskID": taskID,
                    "senderUserID": SENDER_USERID,
                    "senderEmpID": SENDER_EMPID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "hcisRequestID": data.hcisRequestID,
                        "hcisRequestDate": data.hcisRequestDate,
                        "hcisRequestPayload": {
                            "employeeID": data.hcisRequestPayload.employeeID,
                            "absenceTime": data.hcisRequestPayload.absenceTime,
                            "absenceType": data.hcisRequestPayload.absenceType,
                            "absenceReason": this.state.information
                        },
                        "hcisRequestBy": data.hcisRequestBy.employeeID,
                        "esID": data.esID.esID,
                        "requestType": data.requestType,
                        "requestStatus": data.requestStatus,
                        "createdBy": SENDER_EMPID,
                        "createdDate": data.hcisRequestCreationalDTO.createdDate,
                        "updatedBy": SENDER_EMPID,
                        "updatedDate": data.hcisRequestCreationalDTO.modifiedDate
                    }
                }
                break;
            case 'LEAVE RESUBMIT':
                if (!R.isEmpty(this.state.date) && !R.isEmpty(this.state.date2) && (this.state.date2 < this.state.date)) return alert('End Date Should be Greater Than Start Date.')
                if (R.isEmpty(this.state.information)) return alert('Reason is Required.')
                if (R.isEmpty(this.state.date)) return alert('Start Date is Required.')
                if (R.isEmpty(this.state.date2)) return alert('End Date is Required.')
                payload = {
                    "taskID": taskID,
                    "senderUserID": SENDER_USERID,
                    "senderEmpID": SENDER_EMPID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "leaveID": data.leaveID,
                        "leaveStartDate": M(this.state.date).format("DD-MM-YYYY HH:mm:ss"),
                        "leaveEndDate": M(this.state.date2).format("DD-MM-YYYY HH:mm:ss"),
                        "leaveDocumentURL": data.leaveDocumentURL,
                        "leaveReason": this.state.information,
                        "leaveAddress": data.leaveAddress,
                        "leaveStatus": data.leaveStatus,
                        "employeeID": data.employee ? data.employee.employeeID : '',
                        "subtitutePersonID": data.subtitutePersonID,
                        "leaveType": data.leaveType ? data.leaveType.bizparKey : '',
                        "leaveCategory": data.leaveType ? data.leaveType.bizparKey : '',
                        "leaveNotes": data.leaveNotes,
                        "createdBy": SENDER_EMPID,
                        "createdDate": data.leaveCreationalDTO.createdDate,
                        "updatedBy": SENDER_EMPID,
                        "updatedDate": data.leaveCreationalDTO.modifiedDate
                    }
                }
                break;
            case 'TERMINATION RESUBMIT':
                //--- Validation
                if (R.isEmpty(this.state.spkNumber)) return alert('SPK Number is Required.')
                if (R.isEmpty(this.state.letterNumber)) return alert('Letter Number is Required.')
                if (R.isEmpty(this.state.date)) return alert('SPK Date is Required.')
                if (R.isEmpty(this.state.date2)) return alert('Letter Date is Required.')
                if (R.isEmpty(this.state.date3)) return alert('Request Date is Required.')
                if (R.isEmpty(this.state.date4)) return alert('Out Date is Required.')
                if (R.isEmpty(this.state.date5)) return alert('PPH End Date is Required.')
                if (R.isEmpty(this.state.document)) return alert('Document is Required.')
                if (R.isEmpty(this.state.information)) return alert('Information is Required.')
                //---
                payload = {
                    "taskID": taskID,
                    "senderUserID": SENDER_USERID,
                    "senderEmpID": SENDER_EMPID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "terminationID": data.terminationID,
                        "terminationDocumentNumber": this.state.letterNumber,
                        "terminationSPKNumber": this.state.spkNumber,
                        "terminationSPKDate": M(this.state.date).format("DD-MM-YYYY HH:mm:ss"),
                        "terminationDocumentDate": M(this.state.date2).format("DD-MM-YYYY HH:mm:ss"),
                        "terminationRequestDate": M(this.state.date3).format("DD-MM-YYYY HH:mm:ss"),
                        "terminationEffectiveDate": M(this.state.date4).format("DD-MM-YYYY HH:mm:ss"),
                        "terminationPPHEndDate": M(this.state.date5).format("DD-MM-YYYY HH:mm:ss"),
                        "terminationNotes": this.state.information,
                        "terminationDocumentURL": this.state.documentUrl,
                        "employeeID": data.employee ? data.employee.employeeID : '',
                        "requestBy": data.requestBy ? data.requestBy.employeeID : '',
                        "terminationType": data.terminationType ? data.terminationType.bizparKey : '',
                        "terminationCategory": data.terminationCategory ? data.terminationCategory.bizparKey : '',
                        "terminationReason": data.terminationReason ? data.terminationReason.bizparKey : '',
                        "terminationStatus": data.terminationStatus,
                        "createdBy": SENDER_EMPID,
                        "createdDate": data.terminationCreationalDTO.createdDate,
                        "updatedBy": SENDER_EMPID,
                        "updatedDate": data.terminationCreationalDTO.modifiedDate,
                        "recordID": data.recordID
                    }
                }
                break;
            case 'MOVEMENT RESUBMIT':
                //--- Validation
                if (R.isEmpty(this.state.spkNumber)) return alert('SPK Number is Required.')
                if (R.isEmpty(this.state.date)) return alert('SPK Date is Required.')
                if (R.isEmpty(this.state.date2)) return alert('Effective Date is Required.')
                if (R.isEmpty(this.state.information)) return alert('Information is Required.')
                //---
                payload = {
                    "taskID": taskID,
                    "senderUserID": SENDER_USERID,
                    "senderEmpID": SENDER_EMPID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "movementID": data.movementID,
                        "movementSPKNumber": this.state.spkNumber,
                        "movementSPKDate": M(this.state.date).format("DD-MM-YYYY HH:mm:ss"),
                        "movementNotes": this.state.information,
                        "movementEffectiveDate": M(this.state.date2).format("DD-MM-YYYY HH:mm:ss"),
                        "movementCategory": data.movementCategory ? data.movementCategory.bizparKey : '',
                        "movementType": data.movementType ? data.movementType.bizparKey : '',
                        "employeeID": data.employee ? data.employee.employeeID : '',
                        "movementDocumentURL": data.movementDocumentURL,
                        "movementPosition": {
                            "positionAfterEffectiveStartDate": data.movementPosition ? data.movementPosition.positionAfterEffectiveStartDate : '',
                            "positionAfterEffectiveEndDate": data.movementPosition ? data.movementPosition.positionAfterEffectiveEndDate : '',
                            "companyIDAfter": data.movementPosition.companyIDAfter ? data.movementPosition.companyIDAfter.esid : '',
                            "companyIDBefore": data.movementPosition.companyIDBefore ? data.movementPosition.companyIDBefore.esid : '',
                            "positionIDBefore": data.movementPosition.positionIDBefore ? data.movementPosition.positionIDBefore.ouid : '',
                            "positionIDAfter": data.movementPosition.positionIDAfter ? data.movementPosition.positionIDAfter.ouid : ''
                        },
                        "movementPayroll": {
                            "basicSalaryValue": data.movementPayroll ? data.movementPayroll.basicSalaryValue : '',
                            "effectiveStartDate": data.movementPayroll ? data.movementPayroll.effectiveStartDate : '',
                            "effectiveEndDate": data.movementPayroll ? data.movementPayroll.effectiveEndDate : ''
                        },
                        "movementStatus": data.movementStatus,
                        "requestBy": data.requestBy.employeeID,
                        "createdBy": SENDER_EMPID,
                        "createdDate": data.movementCreationalDTO.createdDate,
                        "updatedBy": SENDER_EMPID,
                        "updatedDate": data.movementCreationalDTO.modifiedDate,
                        "esid": data.esid.esid
                    }
                }
                break;
            case 'CLAIM RESUBMIT':
                if (R.isEmpty(this.state.claimDescription)) return alert('Desciption is Required.')
                if (R.isEmpty(this.state.claimValue)) return alert('Rupiah is Required.')
                let claimValue = String(this.state.claimValue).split(",").join("")

                payload = {
                    "taskID": taskID,
                    "senderUserID": SENDER_USERID,
                    "senderEmpID": SENDER_EMPID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "claimID": data.claimID,
                        "claimDescription": this.state.claimDescription,
                        "claimBudget": data.claimBudget,
                        "claimValue": Number(claimValue),
                        "claimURL": data.claimURL,
                        "claimStatus": data.claimStatus,
                        "claimType": data.claimType.bizparKey,
                        "employee": data.employee.employeeID,
                        "claimDate": data.claimDate,
                        "invoiceDate": data.invoiceDate,
                        "cnbTPLID": data.cnbTPLID.cnbtplid,
                        "createdBy": SENDER_EMPID,
                        "createdDate": data.claimCreationalDTO.createdDate,
                        "updatedBy": SENDER_EMPID,
                        "updatedDate": data.claimCreationalDTO.modifiedDate
                    }
                }
                break;
            case 'MPP RESUBMIT':
                    payload = {
                        "taskID": taskID,
                        "senderUserID": SENDER_USERID,
                        "senderEmpID": SENDER_EMPID,
                        "senderNotes": notes,
                        "senderBPMStatus": buttonType,
                        "data": {
                            "mppID": data.mppID,
                            "mppName": data.mppName,
                            "budget": data.budget,
                            "period": data.period,
                            "position": data.position ? data.position.ouID : '',
                            "esid": data.es.esID,
                            "mppStatus": data.mppStatus,
                            "mppCreationalDTO" : data.mppCreationalDTO
                        }
                    }
                    break;
            default:
                break;
        }
        // return console.log(JSON.stringify(payload))

        if (R.isEmpty(notes)) return alert('Approver Notes is Required.')
        this.props.handleSubmit(payload)
    }

    renderFooter = () => {
        let buttons = [
            {
                label: "SAVE & SUBMIT",
                cb: () => this.handleApproval('SAVE & SUBMIT')
            }
        ]

        return (
            <div className="padding-15px">
                <div className="content-right">
                    {buttons.map((data, index) => {
                        return (
                            <button
                                style={{ marginLeft: "15px" }}
                                className="btn btn-blue"
                                type="button"
                                onClick={data.cb}
                            >
                                <span>{data.label}</span>
                            </button>
                        )
                    })
                    }
                </div>
            </div>
        )
    }

    async openReportMpp(value) {
        let type = this.state.data.taskName
        if (type === 'CLAIM RESUBMIT') {
            let dataClaim = {
                "claimID": this.state.dataByID.claimID,
                "employeeName": this.state.dataByID.employee.employeeName,
                "claimDescription": this.state.dataByID.claimDescription,
                "claimValue": this.state.dataByID.claimValue,
                "claimURL": this.state.dataByID.claimURL,
                "type": "form"
            }
            this.setState({ reportURL: dataClaim, reportVisible: !this.state.reportVisible })
        } else {
            let url = (
                type === 'TERMINATION RESUBMIT' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/terminasi.by.termination.id/' :
                    type === 'MOVEMENT RESUBMIT' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/movement.pengangkatan.karyawan/' :
                        type === 'BUSINESS TRIP RESUBMIT' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/sppd/' :
                            type === 'OVERTIME RESUBMIT' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/overtime/' :
                                type === 'LEAVE RESUBMIT' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/cuti.by.leave.id/' :
                                    type === 'TRAINING REQUEST RESUBMIT' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/training.request/' :
                                        type === 'MANUAL ABSENCE RESUBMIT' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/manual.absence.request/' :
                                            type === 'BLACKLIST RESUBMIT' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/blacklist/' :
                                                type === 'MPP RESUBMIT' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/mpp/' : ''
            )
            let res = await fetch(url + value, {
                headers: {
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4',
                    'Content-Type': 'application/pdf',
                }
            })
            res = await res.blob()
            if (res.size > 0 && res.type === 'application/pdf') {
                res = URL.createObjectURL(res);
                this.setState({ reportURL: res, reportVisible: !this.state.reportVisible })
            } else return alert('Report Not Found!')
        }
    }

    async openReportR(value) {
        let url = process.env.REACT_APP_HCIS_BE_API + 'report/po/recruitment.request.by.recruitment.id/'
        let res = await fetch(url + value, {
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4',
                'Content-Type': 'application/pdf',
            }
        })
        res = await res.blob()
        if (res.size > 0 && res.type === 'application/pdf') {
            res = URL.createObjectURL(res);
            this.setState({ reportURL: res, reportVisible: !this.state.reportVisible })
        } else return alert('Report Not Found!')
    }
    
    async getRecPsikotestById(id) {
        let response = await Api.create("RECRUITMENT_QUERY").getRecPsikotestById(id)
        if (response.data && response.data.status === "S") {
            this.setState({
                documentUrl: response.data.data.psikotestDocumentURL
            })
        }
    }

    async getDocTerminationByID(id) {
        let response = await Api.create("TERMINATION_QUERY").getTerminationByID(id)
        if (response.data && response.data.status === "S") {
            this.setState({
                documentUrl: response.data.data.terminationDocumentURL
            })
        }
    }

    async getDocOvertimeByID(id) {
        let response = await Api.create("TIME_QUERY").getOvertimeByID(id)
        if (response.data && response.data.status === "S") {
            this.setState({
                documentUrl: response.data.data.overtimeDocumentURL
            })
        }
    }

    async getDocSppdByID(id) {
        let response = await Api.create("TIME_QUERY").getSppdByID(id)
        if (response.data && response.data.status === "S") {
            this.setState({
                documentUrl: response.data.data.sppdDocumentURL
            })
        }
    }

    closeReport() {
        this.setState({ reportVisible: !this.state.reportVisible })
    }

    renderFile = () => {
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px" />
                <div className="popup-content background-white border-radius">
                    <div className="padding-15px background-white border-bottom grid grid-2x">
                        <div className="col-1">
                            <div className="txt-site txt-12 txt-bold post-center">
                                Document Viewer
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button
                                className="btn btn-circle background-white"
                                onClick={this.openFileView.bind(this)}
                            >
                                <i className="fa fa-lg fa-times" />
                            </button>
                        </div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        {
                            this.state.fileType === "jpg" ||
                                this.state.fileType === "png" ||
                                this.state.fileType === "jpeg" ?
                                (
                                    <img src={this.state.fileUrl} width={"50%"} alt="" />
                                ) : (
                                    <FileViewer
                                        fileType={this.state.fileType}
                                        filePath={this.state.fileUrl} />
                                )}
                    </div>
                    <div className="padding-15px background-grey">
                        <div className="grid margin-top-15px">
                            <div className="content-right">
                                <button
                                    style={{ marginLeft: "15px" }}
                                    className="btn btn-grey"
                                    type="button"
                                    onClick={this.openFileView.bind(this)}
                                >
                                    <span>CLOSE</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    openFileView() {
        this.setState({ formFileVisible: !this.state.formFileVisible })
    }

    async getFile() {
        let ID = this.state.data.taskName === 'TERMINATION RESUBMIT' ? this.state.dataByID.terminationID :
            this.state.data.taskName === 'BUSINESS TRIP RESUBMIT' ? this.state.dataByID.sppdID :
                this.state.data.taskName === 'OVERTIME RESUBMIT' ? this.state.dataByID.overtimeID : ''

        let length = this.state.document.split(".").length

        let www = this.state.data.taskName === 'TERMINATION RESUBMIT' ? process.env.REACT_APP_HCIS_BE_API + 'tmncmd/api/termination.document.get/' :
            this.state.data.taskName === 'BUSINESS TRIP RESUBMIT' ? process.env.REACT_APP_HCIS_BE_API + 'tmcmd/api/sppd.document.get/' :
                this.state.data.taskName === 'OVERTIME RESUBMIT' ? process.env.REACT_APP_HCIS_BE_API + 'tmcmd/api/overtime.document.get/' : ''
        let response = await fetch(www + ID, {
            headers: {
                Authorization:
                    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4",
                "Content-Type": "application/pdf"
            }
        })
        response = await response.blob()
        if (response.size > 0) {
            response = URL.createObjectURL(response);
            this.setState({
                fileUrl: response,
                fileType: this.state.document.split(".")[length - 1],
                formFileVisible: !this.state.formFileVisible
            });
        } else {
            alert("Failed: Document Not Found")
        }
    }

    render() {
        let documents = []
        documents.push([
            this.state.documentUrl && this.state.documentUrl.split('document/tmn_doc/')
        ])
        return (
            <div className={"a-s-p-place active"}>
                <div>
                    <div className="a-s-p-top">
                        <div className="grid grid-2x">
                            <div className="col-1" style={{ width: "140%" }}>
                                <div className="display-flex-normal margin-top-10px">
                                    <i className="fa fa-1x fa-envelope"></i>
                                    <span className="txt-site txt-11 txt-main margin-left-10px">
                                        {this.state.title}
                                    </span>
                                </div>
                            </div>
                            <div className="col-2 content-right">
                                <button
                                    onClick={this.props.closeSlide}
                                    className="btn btn-circle btn-grey">
                                    <i className="fa fa-lg fa-arrow-right" />
                                </button>
                            </div>
                        </div>
                    </div>
                    {this.state.formFileVisible && this.renderFile()}
                    {this.state.reportVisible && (
                        <FormReport
                            url={this.state.reportURL}
                            id={this.state.data.variables.TASK_REFNO}
                            taskName={this.state.data.taskName}
                            onClickClose={this.closeReport.bind(this)}
                        />
                    )}
                    {this.state.formSearchEmpVisible && (
                        <FormSearchEmp
                            onClickClose={this.openSearch.bind(this)}
                            onClick={this.pickEmployee.bind(this)}
                        />
                    )}
                    <div className='a-s-p-mid a-s-p-pad border-top'>
                        <FlexView column>
                            <div style={{ paddingRight: 20, paddingLeft: 20 }}>
                                <div
                                    style={{ width: '100%', paddingTop: 20 }}
                                >
                                    <button
                                        type='button'
                                        onClick={() => this.openReportMpp(this.state.data.variables.TASK_REFNO)}
                                        style={{
                                            borderRadius: 20,
                                            padding: 10,
                                            width: '100%'
                                        }}
                                        className="btn btn-blue">
                                        {this.state.data.variables.TASK_REFNO}
                                    </button>
                                </div>
                                <div style={{ paddingTop: 10, textAlign: 'center' }}>
                                    <span style={{ paddingTop: 10 }}>
                                        {this.state.titleNumber}
                                    </span>
                                </div>
                            </div>
                            {this.state.data.taskName === 'BUSINESS TRIP RESUBMIT' && (
                                <div className='grid'>
                                    <FlexView grow>
                                        <div className="padding-15px">
                                            <div className="margin-bottom-5px">
                                                <div className="margin-5px">
                                                    <span className="txt-site txt-11 txt-main txt-bold">
                                                        Start Date <span style={{ color: "red" }}>*</span>
                                                    </span>
                                                </div>
                                                <div className="margin-5px">
                                                    <CalendarPicker onChange={(e) => {
                                                        this.setState({
                                                            date: e
                                                        })
                                                        console.log(e)
                                                    }} />
                                                </div>
                                            </div>
                                        </div>
                                    </FlexView>
                                    <FlexView grow>  <div className="padding-15px">
                                        <div className="margin-bottom-5px">
                                            <div className="margin-5px">
                                                <span className="txt-site txt-11 txt-main txt-bold">
                                                    End Date <span style={{ color: "red" }}>*</span>
                                                </span>
                                            </div>
                                            <div className="margin-5px">
                                                <CalendarPicker onChange={(e) => {
                                                    this.setState({
                                                        date2: e
                                                    })
                                                    console.log(e)
                                                }} />
                                            </div>
                                        </div>
                                    </div>
                                    </FlexView>
                                    <FlexView grow><div className="padding-15px">
                                        <div className="margin-bottom-5px">
                                            <div className="margin-5px">
                                                <span className="txt-site txt-11 txt-main txt-bold">
                                                    Location <span style={{ color: "red" }}>*</span>
                                                </span>
                                            </div>
                                            <div className="margin-5px">
                                                <input
                                                    type="text"
                                                    className="txt txt-sekunder-color"
                                                    placeholder=""
                                                    onChange={(e) => this.setState({
                                                        location: e.target.value
                                                    })}
                                                    required />
                                            </div>
                                        </div>
                                    </div>
                                    </FlexView>
                                    <FlexView grow><div className="padding-15px">
                                        <div className="margin-bottom-5px">
                                            <div className="margin-5px">
                                                <span className="txt-site txt-11 txt-main txt-bold">
                                                    Task
                                            </span>
                                            </div>
                                            <textarea
                                                rows={5}
                                                type="text"
                                                className="txt txt-sekunder-color"
                                                placeholder=""
                                                onChange={(e) => this.setState({
                                                    task: e.target.value
                                                })}
                                            />
                                        </div>
                                    </div>
                                    </FlexView>
                                    <FlexView grow>
                                        <div className="padding-15px">
                                            <div className="margin-bottom-5px">
                                                <div className="margin-5px">
                                                    <span className="txt-site txt-11 txt-main txt-bold">
                                                        Note
                                            </span>
                                                </div>
                                                <textarea
                                                    rows={5}
                                                    type="text"
                                                    className="txt txt-sekunder-color"
                                                    placeholder=""
                                                    onChange={(e) => this.setState({
                                                        note: e.target.value
                                                    })}
                                                />
                                            </div>
                                        </div>
                                    </FlexView>
                                </div>
                            )}
                            {this.state.data.taskName === 'OVERTIME RESUBMIT' && (
                                <div className='grid'>
                                    <FlexView grow> <div className="padding-15px">
                                        <div className="margin-bottom-5px">
                                            <div className="grid grid-2x grid-mobile-none gap-15px margin-bottom-20px">
                                                <div className="column-1">
                                                    <div className="margin-5px">
                                                        <div className="txt-site txt-11 txt-main">
                                                            <h4>Start Time <span style={{ color: "red" }}>*</span></h4>
                                                        </div>
                                                    </div>
                                                    <TimePicker
                                                        onChange={e => {
                                                            this.setState({
                                                                date: e
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div className="column-2">
                                                    <div className="margin-5px">
                                                        <div className="txt-site txt-11 txt-main">
                                                            <h4>End Time <span style={{ color: "red" }}>*</span></h4>
                                                        </div>
                                                    </div>
                                                    <TimePicker
                                                        onChange={e => {
                                                            this.setState({
                                                                date2: e
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    </FlexView>
                                    <FlexView grow>   <div className="padding-15px">
                                        <div className="margin-bottom-5px">
                                            <div className="margin-5px">
                                                <span className="txt-site txt-11 txt-main txt-bold">
                                                    Reason <span style={{ color: "red" }}>*</span>
                                                </span>
                                            </div>
                                            <textarea
                                                rows={5}
                                                type="text"
                                                className="txt txt-sekunder-color"
                                                placeholder=""
                                                onChange={(e) => this.setState({
                                                    information: e.target.value
                                                })}
                                                required />
                                        </div>
                                    </div>
                                    </FlexView>
                                </div>
                            )}
                            {this.state.data.taskName === 'BLACKLIST RESUBMIT' && (
                                <div className='grid'>
                                    <FlexView grow><div className="padding-15px">
                                        <div className="margin-bottom-15px">
                                            <div className="margin-5px">
                                                <span className="txt-site txt-11 txt-main txt-bold">
                                                    {'Blacklist Type'} <span style={{ color: "red" }}>*</span>
                                                </span>
                                            </div>
                                            <div className="margin-5px">
                                                <DropDown
                                                    title="-- please select blacklist type --"
                                                    onChange={(dt) => this.setState({
                                                        blacklistType: dt
                                                    })}
                                                    data={this.props.bizparBlacklist}
                                                    type="bizpar" />
                                            </div>
                                        </div>
                                    </div>
                                    </FlexView>
                                    <FlexView grow><div className="padding-15px">
                                        <div className="margin-bottom-15px">
                                            <div className="margin-5px">
                                                <span className="txt-site txt-11 txt-main txt-bold">
                                                    {'Blacklist Category'} <span style={{ color: "red" }}>*</span>
                                                </span>
                                            </div>
                                            <div className="margin-5px">
                                                <DropDown
                                                    title="-- please select blacklist category --"
                                                    onChange={(dt) => this.setState({
                                                        blacklistCategory: dt
                                                    })}
                                                    data={this.props.bizparBlacklistCategory}
                                                    type="bizpar" />
                                            </div>
                                        </div>
                                    </div>
                                    </FlexView>
                                    <FlexView grow><div className="padding-15px">
                                        <div className="margin-bottom-5px">
                                            <div className="margin-5px">
                                                <span className="txt-site txt-11 txt-main txt-bold">
                                                    {'Reason'} <span style={{ color: "red" }}>*</span>
                                                </span>
                                            </div>
                                            <textarea
                                                rows={5}
                                                type="text"
                                                className="txt txt-sekunder-color"
                                                placeholder=""
                                                onChange={(e) => this.setState({
                                                    information: e.target.value
                                                })}
                                                required />
                                        </div>
                                    </div>
                                    </FlexView>
                                    <FlexView grow> <div className="padding-15px">
                                        <div className="margin-bottom-5px">
                                            <div className="margin-5px">
                                                <span className="txt-site txt-11 txt-main txt-bold">
                                                    {'Blacklist Status'}
                                                </span>
                                            </div>
                                            <label>
                                                <Checkbox
                                                    onChange={(e) => this.setState({
                                                        isPermanent: e.target.checked
                                                    })}
                                                    value={this.state.isPermanent}
                                                    checked={this.state.isPermanent}
                                                /> Permanent
                                            </label>
                                        </div>
                                    </div>
                                    </FlexView>
                                    <FlexView grow>
                                        {!this.state.isPermanent &&
                                            <div className="padding-15px">
                                                <div className="margin-bottom-5px">
                                                    <div className="margin-5px">
                                                        <span className="txt-site txt-11 txt-main txt-bold">
                                                            {'Effective Date'} <span style={{ color: "red" }}>*</span>
                                                        </span>
                                                    </div>
                                                    <div className='grid'>
                                                        <div className='column-1' style={{ textAlign: 'center', paddingTop: '7.5px' }}>
                                                            <CalendarPicker
                                                                style={{ width: '100%' }}
                                                                onChange={(e) => this.setState({
                                                                    date: e
                                                                })} />
                                                        </div>
                                                        <div className='col-2' style={{ textAlign: 'center', paddingTop: '7.5px' }}>
                                                            <span className="txt-site txt-center txt-11">To</span>
                                                        </div>
                                                        <div className='col-3' style={{ textAlign: 'center', paddingTop: '7.5px' }}>
                                                            <CalendarPicker
                                                                style={{ width: '100%' }}
                                                                onChange={(e) => this.setState({
                                                                    date2: e
                                                                })} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>}
                                    </FlexView>
                                </div>
                            )}
                            {this.state.data.taskName === 'MOVEMENT RESUBMIT' && (
                                <div>
                                    <FlexView grow>
                                        <div className='col-1'>
                                            <div className="padding-15px">
                                                <div className="margin-bottom-5px">
                                                    <div className="margin-5px">
                                                        <span className="txt-site txt-11 txt-main txt-bold">
                                                            SPK Number <span style={{ color: "red" }}>*</span>
                                                        </span>
                                                    </div>
                                                    <div className="margin-5px">
                                                        <input
                                                            type="text"
                                                            className="txt txt-sekunder-color"
                                                            placeholder=""
                                                            onChange={(e) => this.setState({
                                                                spkNumber: e.target.value
                                                            })}
                                                            required />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </FlexView>
                                    <FlexView grow>
                                        <div className='col-2'>
                                            <div className="padding-15px">
                                                <div className="margin-bottom-5px">
                                                    <div className="margin-5px">
                                                        <span className="txt-site txt-11 txt-main txt-bold">
                                                            SPK Date <span style={{ color: "red" }}>*</span>
                                                        </span>
                                                    </div>
                                                    <div className="margin-5px">
                                                        <CalendarPicker onChange={(e) => {
                                                            this.setState({
                                                                date: e
                                                            })
                                                            console.log(e)
                                                        }} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </FlexView>
                                    <FlexView grow>
                                        <div className='col-3' style={{ width: "100%" }}>
                                            <div className="padding-15px">
                                                <div className="margin-bottom-5px">
                                                    <div className="margin-5px">
                                                        <span className="txt-site txt-11 txt-main txt-bold">
                                                            Information <span style={{ color: "red" }}>*</span>
                                                        </span>
                                                    </div>
                                                    <textarea
                                                        rows={5}
                                                        type="text"
                                                        className="txt txt-sekunder-color"
                                                        placeholder=""
                                                        onChange={(e) => this.setState({
                                                            information: e.target.value
                                                        })}
                                                        required />
                                                </div>
                                            </div>
                                        </div>
                                    </FlexView>
                                    <FlexView grow>
                                        <div className='col-4' style={{ width: "100%" }}>
                                            <div className="padding-15px">
                                                <div className="margin-bottom-5px">
                                                    <div className="margin-5px">
                                                        <span className="txt-site txt-11 txt-main txt-bold">
                                                            Effective Date <span style={{ color: "red" }}>*</span>
                                                        </span>
                                                    </div>
                                                    <div className="margin-5px">
                                                        <CalendarPicker onChange={(e) => {
                                                            this.setState({
                                                                date2: e
                                                            })
                                                            console.log(e)
                                                        }} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </FlexView>
                                </div>
                            )}
                            {this.state.data.taskName === 'TERMINATION RESUBMIT' && (
                                <div>
                                    <FlexView grow>
                                        <div className="padding-15px">
                                            <div className="margin-bottom-5px">
                                                <div className="margin-5px">
                                                    <span className="txt-site txt-11 txt-main txt-bold">
                                                        SPK Number <span style={{ color: "red" }}>*</span>
                                                    </span>
                                                </div>
                                                <div className="margin-5px">
                                                    <input
                                                        type="text"
                                                        className="txt txt-sekunder-color"
                                                        placeholder=""
                                                        onChange={(e) => this.setState({
                                                            spkNumber: e.target.value
                                                        })}
                                                        required />
                                                </div>
                                            </div>
                                        </div>

                                    </FlexView>
                                    <FlexView grow>
                                        <div className="padding-15px">
                                            <div className="margin-bottom-5px">
                                                <div className="margin-5px">
                                                    <span className="txt-site txt-11 txt-main txt-bold">
                                                        Letter Number <span style={{ color: "red" }}>*</span>
                                                    </span>
                                                </div>
                                                <div className="margin-5px">
                                                    <input
                                                        type="text"
                                                        className="txt txt-sekunder-color"
                                                        placeholder=""
                                                        onChange={(e) => this.setState({
                                                            letterNumber: e.target.value
                                                        })}
                                                        required />
                                                </div>
                                            </div>
                                        </div>

                                    </FlexView>
                                    <FlexView grow>
                                        <div className="padding-15px">
                                            <div className="margin-bottom-5px">
                                                <div className="margin-5px">
                                                    <span className="txt-site txt-11 txt-main txt-bold">
                                                        SPK Date <span style={{ color: "red" }}>*</span>
                                                    </span>
                                                </div>
                                                <div className="margin-5px">
                                                    <CalendarPicker onChange={(e) => {
                                                        this.setState({
                                                            date: e
                                                        })
                                                        console.log(e)
                                                    }} />
                                                </div>
                                            </div>
                                        </div>

                                    </FlexView>
                                    <FlexView grow>
                                        <div className="padding-15px">
                                            <div className="margin-bottom-5px">
                                                <div className="margin-5px">
                                                    <span className="txt-site txt-11 txt-main txt-bold">
                                                        Letter Date <span style={{ color: "red" }}>*</span>
                                                    </span>
                                                </div>
                                                <div className="margin-5px">
                                                    <CalendarPicker onChange={(e) => {
                                                        this.setState({
                                                            date2: e
                                                        })
                                                        console.log(e)
                                                    }} />
                                                </div>
                                            </div>
                                        </div>

                                    </FlexView>
                                    <FlexView grow>
                                        <div className="padding-15px">
                                            <div className="margin-bottom-5px">
                                                <div className="margin-5px">
                                                    <span className="txt-site txt-11 txt-main txt-bold">
                                                        Request Date <span style={{ color: "red" }}>*</span>
                                                    </span>
                                                </div>
                                                <div className="margin-5px">
                                                    <CalendarPicker onChange={(e) => {
                                                        this.setState({
                                                            date3: e
                                                        })
                                                        console.log(e)
                                                    }} />
                                                </div>
                                            </div>
                                        </div>

                                    </FlexView>
                                    <FlexView grow>
                                        <div className="padding-15px">
                                            <div className="margin-bottom-5px">
                                                <div className="margin-5px">
                                                    <span className="txt-site txt-11 txt-main txt-bold">
                                                        Out Date <span style={{ color: "red" }}>*</span>
                                                    </span>
                                                </div>
                                                <div className="margin-5px">
                                                    <CalendarPicker onChange={(e) => {
                                                        this.setState({
                                                            date4: e
                                                        })
                                                        console.log(e)
                                                    }} />
                                                </div>
                                            </div>
                                        </div>

                                    </FlexView>
                                    <FlexView grow>
                                        <div className="padding-15px">
                                            <div className="margin-bottom-5px">
                                                <div className="margin-5px">
                                                    <span className="txt-site txt-11 txt-main txt-bold">
                                                        PPH End Date <span style={{ color: "red" }}>*</span>
                                                    </span>
                                                </div>
                                                <div className="margin-5px">
                                                    <CalendarPicker onChange={(e) => {
                                                        this.setState({
                                                            date5: e
                                                        })
                                                        console.log(e)
                                                    }} />
                                                </div>
                                            </div>
                                        </div>

                                    </FlexView>
                                    <FlexView grow>
                                        <div className="padding-15px">
                                            <div className="margin-bottom-5px">
                                                <div className="margin-5px">
                                                    <span className="txt-site txt-11 txt-main txt-bold">
                                                        Information <span style={{ color: "red" }}>*</span>
                                                    </span>
                                                </div>
                                                <textarea
                                                    rows={5}
                                                    type="text"
                                                    className="txt txt-sekunder-color"
                                                    placeholder=""
                                                    onChange={(e) => this.setState({
                                                        information: e.target.value
                                                    })}
                                                    required />
                                            </div>
                                        </div>

                                    </FlexView>
                                </div>
                            )}
                            {this.state.data.taskName === 'TERMINATION RESUBMIT' || this.state.data.taskName === 'OVERTIME RESUBMIT' || this.state.data.taskName === 'BUSINESS TRIP RESUBMIT' ? (
                                <FlexView grow>
                                    <div className="padding-15px">
                                        <div className="margin-bottom-5px">
                                            <div className="margin-5px">
                                                <MuiThemeProvider theme={getMuiTheme()}>
                                                    <MUIDataTable
                                                        title='Document'
                                                        data={R.isEmpty(this.state.document) ? this.dataDocument : documents}
                                                        columns={this.columnsDocument}
                                                        options={options}
                                                    />
                                                </MuiThemeProvider>
                                            </div>
                                        </div>
                                        <div className="padding-15px">
                                            <div className="padding-5px">
                                                <span className="txt-site txt-11 txt-main txt-bold">
                                                    <h4>File <span style={{ color: "red" }}>*format file (pdf)</span></h4>
                                                </span>
                                            </div>

                                            <UploadFile
                                                type={this.state.uploadStatus}
                                                percentage={this.state.percentage}
                                                result={this.state.result}
                                                acceptedFiles={['pdf']}
                                                onHandle={(dt) => {
                                                    var url = dt
                                                    var number = this.state.data.taskName === 'TERMINATION RESUBMIT' ? this.state.dataByID.terminationID : this.state.data.taskName === 'OVERTIME RESUBMIT' ? this.state.dataByID.overtimeID : this.state.dataByID.sppdID;
                                                    const formData = new FormData();
                                                    formData.append(this.state.data.taskName === 'TERMINATION RESUBMIT' ? "terminationID" : this.state.data.taskName === 'OVERTIME RESUBMIT' ? "overtimeID" : "sppdID", number);
                                                    formData.append("file", url);
                                                    formData.append("updatedBy",this.props.auth.user.employeeID)
                                                    formData.append("updatedDate",M().format("DD-MM-YYYY HH:mm:ss"))
                                                    this.setState({ url, formData, uploadStatus: 'idle', percentage: '0' })
                                                }}
                                                onUpload={() => {
                                                    this.setState({ uploadStatus: 'upload' })
                                                    if (this.state.url === '') return alert('Please Select Document.')
                                                    if (this.state.url && this.state.url.type !== 'application/pdf') return alert('Format file must be pdf.')
                                                    if (this.state.data.taskName === 'TERMINATION RESUBMIT') {
                                                        return Api.create('TERMINATION').uploadTerminationDoc(this.state.formData, {
                                                            onUploadProgress: (progress) => {
                                                                if (progress.lengthComputable) {
                                                                    if (progress.total >= 1000000) {
                                                                        this.setState({ result: 'error', percentage: '0', uploadStatus: 'idle' })
                                                                    } else {
                                                                        var percentCompleted = Math.round((progress.loaded * 100) / progress.total)
                                                                        this.setState({ percentage: percentCompleted })
                                                                        if (progress.loaded === progress.total) {
                                                                            this.setState({ result: 'success' })
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }).then(
                                                            (res) => {
                                                                if (!res.ok && res.status === 413) {
                                                                    alert("Your Document Too Large, Please Select Another Document")
                                                                    this.setState({ result: 'error', percentage: '0' })
                                                                }
                                                                if (!res.ok && res.status === 500) {
                                                                    alert("Please Select Document")
                                                                    this.setState({ result: 'error' })
                                                                }
                                                                if (!res.ok && R.isNil(res.status)) {
                                                                    alert(res.problem)
                                                                    this.setState({ result: 'error' })
                                                                }
                                                                if (!res.ok && R.isNil(res.status)) alert(res.problem)
                                                                if (res.data.code === '201') {
                                                                    this.getDocTerminationByID(this.state.dataByID.terminationID)
                                                                    this.setState({
                                                                        createPopUpVisible: true,
                                                                        document: this.state.url.name,
                                                                        result: 'success'
                                                                    })
                                                                }
                                                            }
                                                        )
                                                    }
                                                    if (this.state.data.taskName === 'OVERTIME RESUBMIT') {
                                                        return Api.create('TIME').uploadOvertimeDoc(this.state.formData, {
                                                            onUploadProgress: (progress) => {
                                                                if (progress.lengthComputable) {
                                                                    if (progress.total >= 1000000) {
                                                                        this.setState({ result: 'error', percentage: '0', uploadStatus: 'idle' })
                                                                    } else {
                                                                        var percentCompleted = Math.round((progress.loaded * 100) / progress.total)
                                                                        this.setState({ percentage: percentCompleted })
                                                                        if (progress.loaded === progress.total) {
                                                                            this.setState({ result: 'success' })
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }).then(
                                                            (res) => {
                                                                if (!res.ok && res.status === 413) {
                                                                    alert("Your Document Too Large, Please Select Another Document")
                                                                    this.setState({ result: 'error', percentage: '0' })
                                                                }
                                                                if (!res.ok && res.status === 500) {
                                                                    alert("Please Select Document")
                                                                    this.setState({ result: 'error' })
                                                                }
                                                                if (!res.ok && R.isNil(res.status)) {
                                                                    alert(res.problem)
                                                                    this.setState({ result: 'error' })
                                                                }
                                                                if (!res.ok && R.isNil(res.status)) alert(res.problem)
                                                                if (res.data.code === '201') {
                                                                    this.getDocOvertimeByID(this.state.dataByID.overtimeID)
                                                                    this.setState({
                                                                        createPopUpVisible: true,
                                                                        document: this.state.url.name,
                                                                        result: 'success'
                                                                    })
                                                                }
                                                            }
                                                        )
                                                    }
                                                    if (this.state.data.taskName === 'BUSINESS TRIP RESUBMIT') {
                                                        return Api.create('TIME').uploadSppdDoc(this.state.formData, {
                                                            onUploadProgress: (progress) => {
                                                                if (progress.lengthComputable) {
                                                                    if (progress.total >= 1000000) {
                                                                        this.setState({ result: 'error', percentage: '0', uploadStatus: 'idle' })
                                                                    } else {
                                                                        var percentCompleted = Math.round((progress.loaded * 100) / progress.total)
                                                                        this.setState({ percentage: percentCompleted })
                                                                        if (progress.loaded === progress.total) {
                                                                            this.setState({ result: 'success' })
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }).then(
                                                            (res) => {
                                                                if (!res.ok && res.status === 413) {
                                                                    alert("Your Document Too Large, Please Select Another Document")
                                                                    this.setState({ result: 'error', percentage: '0' })
                                                                }
                                                                if (!res.ok && res.status === 500) {
                                                                    alert("Please Select Document")
                                                                    this.setState({ result: 'error' })
                                                                }
                                                                if (!res.ok && R.isNil(res.status)) {
                                                                    alert(res.problem)
                                                                    this.setState({ result: 'error' })
                                                                }
                                                                if (!res.ok && R.isNil(res.status)) alert(res.problem)
                                                                if (res.data.code === '201') {
                                                                    this.getDocSppdByID(this.state.dataByID.sppdID)
                                                                    this.setState({
                                                                        createPopUpVisible: true,
                                                                        document: this.state.url.name,
                                                                        result: 'success'
                                                                    })
                                                                }
                                                            }
                                                        )
                                                    }
                                                }} />

                                            {/* <FilePond
                                                allowMultiple={false}
                                                onupdatefiles={
                                                    fileItems => {
                                                        let file = fileItems.map(fileItem => fileItem.file)
                                                        // this.handleChange(file[0])
                                                        var url = file[0]
                                                        var number = this.state.data.taskName === 'TERMINATION RESUBMIT' ? this.state.dataByID.terminationID : this.state.data.taskName === 'OVERTIME RESUBMIT' ? this.state.dataByID.overtimeID : this.state.dataByID.sppdID;

                                                        const formData = new FormData();
                                                        formData.append(this.state.data.taskName === 'TERMINATION RESUBMIT' ? "terminationID" : this.state.data.taskName === 'OVERTIME RESUBMIT' ? "overtimeID" : "sppdID", number);
                                                        formData.append("file", url);
                                                        this.setState({ url, formData })
                                                        if (file[0]) {
                                                            this.setState({
                                                                buttonVisible: true
                                                            })
                                                        } else {
                                                            this.setState({
                                                                buttonVisible: false
                                                            })
                                                        }
                                                    }
                                                }
                                                onremovefile={
                                                    () => {
                                                        this.setState({
                                                            buttonVisible: false
                                                        })
                                                    }
                                                } />
                                            {this.state.buttonVisible
                                                ? <button
                                                    type="button"
                                                    className="btn btn-blue btn-width-all margin-top-5px"
                                                    onClick={() => {
                                                        if (this.state.url === '') return alert('Please Select Document.')
                                                        if (this.state.url && this.state.url.type !== 'application/pdf') return alert('Format file must be pdf.')
                                                        if (this.state.data.taskName === 'TERMINATION RESUBMIT') {
                                                            return Api.create('TERMINATION').uploadTerminationDoc(this.state.formData).then(
                                                                (res) => {
                                                                    if (!res.ok && res.status === 400) alert("Please Insert File")
                                                                    if (!res.ok && res.status === 413) alert("Your Document Too Large, Please Select Another Document")
                                                                    if (!res.ok && res.status === 500) alert("Please Select Document")
                                                                    if (!res.ok && R.isNil(res.status)) alert(res.problem)
                                                                    if (res.data.code === '201') {
                                                                        this.setState({
                                                                            createPopUpVisible: true,
                                                                            document: this.state.url.name
                                                                        })
                                                                    }
                                                                }
                                                            )
                                                        }
                                                        if (this.state.data.taskName === 'OVERTIME RESUBMIT') {
                                                            return Api.create('TIME').uploadOvertimeDoc(this.state.formData).then(
                                                                (res) => {
                                                                    if (!res.ok && res.status === 400) alert("Please Insert File")
                                                                    if (!res.ok && res.status === 413) alert("Your Document Too Large, Please Select Another Document")
                                                                    if (!res.ok && res.status === 500) alert("Please Select Document")
                                                                    if (!res.ok && R.isNil(res.status)) alert(res.problem)
                                                                    if (res.data.code === '201') {
                                                                        this.setState({
                                                                            createPopUpVisible: true,
                                                                            document: this.state.url.name
                                                                        })
                                                                    }
                                                                }
                                                            )
                                                        }
                                                        if (this.state.data.taskName === 'BUSINESS TRIP RESUBMIT') {
                                                            return Api.create('TIME').uploadSppdDoc(this.state.formData).then(
                                                                (res) => {
                                                                    if (!res.ok && res.status === 400) alert("Please Insert File")
                                                                    if (!res.ok && res.status === 413) alert("Your Document Too Large, Please Select Another Document")
                                                                    if (!res.ok && res.status === 500) alert("Please Select Document")
                                                                    if (!res.ok && R.isNil(res.status)) alert(res.problem)
                                                                    if (res.data.code === '201') {
                                                                        this.setState({
                                                                            createPopUpVisible: true,
                                                                            document: this.state.url.name
                                                                        })
                                                                    }
                                                                }
                                                            )
                                                        }
                                                    }}>
                                                    Upload File
                                                            </button>
                                                : null} */}
                                        </div>
                                    </div>
                                </FlexView>

                            ) : null}
                            {this.state.data.taskName === 'LEAVE RESUBMIT' && (
                                <div className='grid'>
                                    <FlexView grow>
                                        <div className="padding-15px">
                                            <div className="margin-bottom-5px">
                                                <div className="margin-5px">
                                                    <span className="txt-site txt-11 txt-main txt-bold">
                                                        Start Date <span style={{ color: "red" }}>*</span>
                                                    </span>
                                                </div>
                                                <div className="margin-5px">
                                                    <CalendarPicker onChange={(e) => {
                                                        this.setState({
                                                            date: e
                                                        })
                                                        console.log(e)
                                                    }} />
                                                </div>
                                            </div>
                                        </div>

                                    </FlexView>
                                    <FlexView grow>
                                        <div className="padding-15px">
                                            <div className="margin-bottom-5px">
                                                <div className="margin-5px">
                                                    <span className="txt-site txt-11 txt-main txt-bold">
                                                        End Date <span style={{ color: "red" }}>*</span>
                                                    </span>
                                                </div>
                                                <div className="margin-5px">
                                                    <CalendarPicker onChange={(e) => {
                                                        this.setState({
                                                            date2: e
                                                        })
                                                        console.log(e)
                                                    }} />
                                                </div>
                                            </div>
                                        </div>

                                    </FlexView>
                                </div>
                            )}
                            {this.state.data.taskName === 'MANUAL ABSENCE RESUBMIT' || this.state.data.taskName === 'LEAVE RESUBMIT' ? (
                                <FlexView grow>
                                    <div className="padding-15px">
                                        <div className="margin-bottom-5px">
                                            <div className="margin-5px">
                                                <span className="txt-site txt-11 txt-main txt-bold">
                                                    {'Reason'} <span style={{ color: "red" }}>*</span>
                                                </span>
                                            </div>
                                            <textarea
                                                rows={5}
                                                type="text"
                                                className="txt txt-sekunder-color"
                                                placeholder=""
                                                onChange={(e) => this.setState({
                                                    information: e.target.value
                                                })}
                                                required />
                                        </div>
                                    </div>
                                </FlexView>
                            ) : null}
                            {this.state.data.taskName === 'CLAIM RESUBMIT' ? (
                                <div>
                                    <FlexView grow>
                                        <div className="padding-15px">
                                            <div className="margin-bottom-5px">
                                                <div className="margin-5px">
                                                    <span className="txt-site txt-11 txt-main txt-bold">
                                                        {'Journal ID'}
                                                    </span>
                                                </div>
                                                <input
                                                    type="text"
                                                    disabled
                                                    className="txt txt-sekunder-color"
                                                    style={{ backgroundColor: "#E6E6E6" }}
                                                    value={this.state.dataByID.claimID}
                                                />
                                            </div>
                                        </div>
                                    </FlexView>
                                    <FlexView grow>
                                        <div className="padding-15px" style={{ marginTop: "-15px" }}>
                                            <div className="margin-bottom-5px">
                                                <div className="margin-5px">
                                                    <span className="txt-site txt-11 txt-main txt-bold">
                                                        {'Description'} <span style={{ color: "red" }}>*</span>
                                                    </span>
                                                </div>
                                                <input
                                                    type="text"
                                                    className="txt txt-sekunder-color"
                                                    onChange={(e) => this.setState({
                                                        claimDescription: e.target.value
                                                    })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </FlexView>
                                    <FlexView grow>
                                        <div className="padding-15px" style={{ marginTop: "-15px" }}>
                                            <div className="margin-bottom-5px">
                                                <div className="margin-5px">
                                                    <span className="txt-site txt-11 txt-main txt-bold">
                                                        {'Rupiah'} <span style={{ color: "red" }}>*</span>
                                                    </span>
                                                </div>
                                                <NumberFormat
                                                    className="txt txt-sekunder-color"
                                                    thousandSeparator={true}
                                                    onValueChange={e => {
                                                        this.setState({
                                                            claimValue: e.formattedValue
                                                        });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </FlexView>
                                </div>
                            ) : null}
                            {this.state.data.taskName === 'MPP RESUBMIT' ? (
                                <div>
                                    <FlexView grow>
                                        <div className="padding-15px">
                                            <div className="margin-bottom-5px">
                                                <div className="margin-5px">
                                                    <span className="txt-site txt-11 txt-main txt-bold">
                                                        {'MPP Resubmit Number'}
                                                    </span>
                                                </div>
                                                <input
                                                    type="text"
                                                    disabled
                                                    className="txt txt-sekunder-color"
                                                    style={{ backgroundColor: "#E6E6E6" }}
                                                    value={this.state.dataByID.mppID}
                                                />
                                            </div>
                                        </div>
                                    </FlexView>
                                    <FlexView grow>
                                        <div className="padding-15px" style={{ marginTop: "-15px" }}>
                                            <div className="margin-bottom-5px">
                                                <div className="margin-5px">
                                                    <span className="txt-site txt-11 txt-main txt-bold">
                                                        {'Period'} <span style={{ color: "red" }}>*</span>
                                                    </span>
                                                </div>
                                                <input
                                                    type="text"
                                                    className="txt txt-sekunder-color"
                                                    value={this.state.dataByID.period}
                                                    required
                                                    style={{ backgroundColor: "#E6E6E6" }}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    </FlexView>
                                    <FlexView grow>
                                        <div className="padding-15px" style={{ marginTop: "-15px" }}>
                                            <div className="margin-bottom-5px">
                                                <div className="margin-5px">
                                                    <span className="txt-site txt-11 txt-main txt-bold">
                                                        {'Departement'} <span style={{ color: "red" }}>*</span>
                                                    </span>
                                                </div>
                                                <DropDown title="OPERATION" disabled />
                                            </div>
                                        </div>
                                    </FlexView>
                                    <FlexView grow>
                                        <div className="padding-15px" style={{ marginTop: "-15px" }}>
                                            <div className="margin-bottom-5px">
                                                <div className="margin-5px">
                                                    <span className="txt-site txt-11 txt-main txt-bold">
                                                        {'Position'} <span style={{ color: "red" }}>*</span>
                                                    </span>
                                                </div>
                                                <DropDown 
                                                    title="-- please select position --"
                                                    disabled
                                                    data={this.props.dataPosition}
                                                    value={this.state.dataByID.position ? this.state.dataByID.position.ouID : ""}
                                                    bizValue={this.state.dataByID.position ? this.state.dataByID.position.ouName : "-"}
                                                    type="position"/>
                                            </div>
                                        </div>
                                    </FlexView>
                                    <FlexView grow>
                                        <div className="padding-15px" style={{ marginTop: "-15px" }}>
                                            <div className="margin-bottom-5px">
                                                <div className="margin-5px">
                                                    <span className="txt-site txt-11 txt-main txt-bold">
                                                        {'Budget'} <span style={{ color: "red" }}>*</span>
                                                    </span>
                                                </div>
                                                <input
                                                    type="text"
                                                    className="txt txt-sekunder-color"
                                                    value={this.state.dataByID.budget}
                                                    required
                                                    onChange={(e) => this.setState({
                                                        dataByID:{
                                                            ...this.state.dataByID,
                                                            budget: e.target.value
                                                        }
                                                    })}
                                                />
                                            </div>
                                        </div>
                                    </FlexView>
                                    <FlexView grow>
                                        <div className="padding-15px" style={{ marginTop: "-15px" }}>
                                            <div className="margin-bottom-5px">
                                                <div className="margin-5px">
                                                    <span className="txt-site txt-11 txt-main txt-bold">
                                                        {'Used'} <span style={{ color: "red" }}>*</span>
                                                    </span>
                                                </div>
                                                <input
                                                    type="text"
                                                    className="txt txt-sekunder-color"
                                                    value={this.state.dataByID.used}
                                                    required
                                                    style={{ backgroundColor: "#E6E6E6" }}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    </FlexView>
                                    <FlexView grow>
                                        <div className="padding-15px" style={{ marginTop: "-15px" }}>
                                            <div className="margin-bottom-5px">
                                                <div className="margin-5px">
                                                    <span className="txt-site txt-11 txt-main txt-bold">
                                                        {'Unused'} <span style={{ color: "red" }}>*</span>
                                                    </span>
                                                </div>
                                                <input
                                                    type="text"
                                                    className="txt txt-sekunder-color"
                                                    value={this.state.dataByID.unused}
                                                    required
                                                    style={{ backgroundColor: "#E6E6E6" }}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    </FlexView>
                                    <FlexView grow>
                                        <div className="padding-15px" style={{ marginTop: "-15px" }}>
                                            <div className="margin-bottom-5px">
                                                <div className="margin-5px">
                                                    <span className="txt-site txt-11 txt-main txt-bold">
                                                        {'Outstanding'} <span style={{ color: "red" }}>*</span>
                                                    </span>
                                                </div>
                                                <input
                                                    type="text"
                                                    className="txt txt-sekunder-color"
                                                    value={this.state.dataByID.outstanding}
                                                    required
                                                    style={{ backgroundColor: "#E6E6E6" }}
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    </FlexView>
                                    <FlexView grow>
                                    <div className="margin-bottom-20px">
                                        <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Status</h4>
                                        </div>
                                        </div>
                                        <div className="margin-15px">
                                        <label className="radio">
                                            <input type="checkbox" checked disabled />
                                            <span className="checkmark" />
                                            <div className="txt-site txt-11 txt-bold txt-main">
                                            <h4>Activate</h4>
                                            </div>
                                        </label>
                                        </div>
                                    </div>
                                    </FlexView>
                                </div>
                            ) : null}
                            <FlexView grow>
                                <div className="padding-15px">
                                    <div className="margin-bottom-5px">
                                        <div className="margin-5px">
                                            <span className="txt-site txt-11 txt-main txt-bold">
                                                {'Approver Notes'} <span style={{ color: "red" }}>*</span>
                                            </span>
                                        </div>
                                        <textarea
                                            rows={5}
                                            type="text"
                                            className="txt txt-sekunder-color"
                                            placeholder=""
                                            onChange={(e) => this.setState({
                                                notes: e.target.value
                                            })}
                                            required />
                                    </div>
                                </div>
                            </FlexView>
                        </FlexView>
                        <div className='border-top'>{this.renderFooter()}</div>
                    </div>
                </div>
                {this.state.createPopUpVisible && (
                    <PopUp
                        type={"save"}
                        class={"app-popup app-popup-show"}
                        onClick={() => {
                            this.setState({
                                createPopUpVisible: false,
                                result: null
                            })
                        }}
                    />
                )}
                {this.state.deletePopUpVisible && (
                    <PopUp
                        type={"delete"}
                        class={"app-popup app-popup-show"}
                        onClickDelete={this.deleteDocument.bind(this)}
                        onClick={this.openDeletePopup.bind(this)}
                    />
                )}
                <div className="padding-bottom-20px" />
            </div >
        )
    }
}

const mapStateToProps = state => {
    return {
      auth: state.auth
    };
  };
  
  const mapDispatchToProps = dispatch => {
    return {
      authLogout: () => dispatch(AuthAction.authLogout())
    };
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(Resubmit);