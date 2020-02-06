import React, { Component } from 'react'
import FlexView from 'react-flexview'
import FormReport from './formReport';
import CalendarPicker from '../../../modules/popup/Calendar'
import DropDown from '../../../modules/popup/DropDown'
import * as R from 'ramda'
import FormSearchEmp from '../../../components/systemConfiguration/userManagement/forms/create/searchEmployee'
import Api from '../../../Services/Api';
import PopUp from '../../../components/pages/PopUpAlert';
import M from 'moment'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import UploadFile from '../../upload/upload'
import uuid from 'uuid'
import AuthAction from "../../../Redux/AuthRedux";
import { connect } from "react-redux";
import Stomp from 'stompjs'
import WebsocketNotif from '../../../modules/popup/WebsocketNotif'


var ct = require("../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())

class mppApproval extends Component {
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
            title: this.props.type === 'MPP' ? 'MPP Approval' : this.props.type === 'KSE Checklist' ? this.props.type : title,
            titleNumber: this.props.type === 'Claim Approval' ? 'Claim Request Number' : this.props.type === 'Termination Checklist' ? 'Termination Request Number' : this.props.type + ' Number',
            notes: '',
            reportURL: '',
            reportVisible: false,
            reportVisibleRecruitmentRequest: false,
            createPopUpVisible: false,
            date: '',
            psikotestType: '',
            pic: '',
            url: '',
            document: '',
            interviewType: '',
            interviewTypeValue: '',
            documentUrl: '',
            formSearchEmpVisible: false,
            dataEmp: {
                employeeID: '',
                employeeName: ''
            },
            uploadStatus: 'idle',
            percentage: '0',
            dataFacilityKse: [],
            facility: [],
            payloadFacility: [],
            facilityID: '',
            terminationEmpID: '',
            notifVisible: false,
            message: ''
        }
        console.log(this.props.data)

    }

    options = {
        ...ct.customOptions2(),
        selectableRowsOnClick: true,
        onRowsSelect: (currentRowsSelected, allRowsSelected) => {
            let facilities = []
            allRowsSelected.map((data, index) => {
                if (this.state.data.taskName === "KSE CHECKLIST") {
                    facilities.push({
                        ...this.state.facility[data.index],
                        facilityDate: M().format("DD-MM-YYYY HH:mm:ss"),
                        isFacilityGiven: true
                    })
                } else {
                    facilities.push({
                        ...this.state.facility[data.index],
                        facilityReturnDate: M().format("DD-MM-YYYY HH:mm:ss"),
                        isFacilityReturn: true
                    })
                }
            })
            this.setFacility(facilities)
        }
    }

    connectWebsocket = async () => {
        let stompClient = Stomp.client(process.env.REACT_APP_HCIS_WEBSOCKET);
        let employeeID = this.props.auth.user.employeeID
        stompClient.debug = null;
        stompClient.connect({}, (frame) => {
            console.log('Connected: ' + frame)
            stompClient.subscribe('/topic/recruitment/psikotest/post.recruitment.psikotest.document/' + employeeID, (message) => {
                let res = JSON.parse(message.body)
                console.log('messages: ' + res.messages)
                this.setState({ notifVisible: true, message: res.messages })
                setTimeout(() => {
                    this.setState({
                        notifVisible: false
                    })
                }, 2000);
            })
        })
    }

    closeNotif() {
        this.setState({ notifVisible: false })
    }

    setFacility(facilities) {
        this.setState({
            payloadFacility: facilities
        })
    }

    columnsKse = ["No", "Facility Name"]

    componentDidUpdate(prevProps) {
        if (this.props.data !== prevProps.data) {
            let title = this.props.data.taskName
            title = title.toLowerCase().split(' ')
            title = title.map((value) => {
                let string = value.replace(/^\w/, c => c.toUpperCase())
                return string + ' '
            })
            if (this.state.data.variables.INTERVIEW_ID) this.getInterview()
            this.setState({
                data: this.props.data,
                titleNumber: this.props.type + ' Number',
                title
            })
        }
    }

    async getInterview() {
        Api.create('RECRUITMENT_QUERY').getRecInterviewByInterviewId(this.state.data.variables.INTERVIEW_ID).then(
            (res) => {
                if (res.data && res.data.status === "S") {
                    this.setState({
                        interviewType: res.data.data.interviewType.bizparKey,
                        interviewTypeValue: res.data.data.interviewType.bizparValue
                    })
                }
            }
        )
    }

    async getEmployee() {
        let payload = {
            "employeeID": this.state.data.variables.TASK_REFNO
        }
        let res = await Api.create("EMPLOYEE_QUERY").getEmployeeById(payload)
        if (res.data && res.data.status === "S") {
            this.getFacilityKse(res.data.data.company.companyID, res.data.data.position.positionID)
        } else {
            alert("Data Employee Not Found.")
        }
    }

    async getFacilityKse(esid, ouid) {
        let payload = {
            "esid": esid,
            "ouid": ouid,
        }
        let res = await Api.create('ES').getEsByOuid(payload)
        console.log('test' + JSON.stringify(res.data.data.ouFacilityTPLID))
        if (res.data.data.ouFacilityTPLID !== null) {
            if (res.data && res.data.status === "S") {
                let facility = res.data.data.ouFacilityTPLID.facilities.map((data, index) => {
                    return {
                        "employeeFacilityID": data.facilityDetailID,
                        "facilityCategory": data.facilitycategory.bizparKey,
                        "facilityDate": null,
                        "facilityNotes": data.facilityDetailNotes,
                        "facilityQuantity": data.facilityDetailQty,
                        "facilityReturnDate": null,
                        "facilityType": data.facilityType.bizparKey,
                        "isFacilityGiven": false,
                        "isFacilityReturn": false
                    }
                })
                let dataFacilityKse = res.data.data.ouFacilityTPLID.facilities.map((value, index) => {
                    const { facilitycategory } = value
                    return [
                        index += 1,
                        facilitycategory.bizparValue
                    ]
                })
                this.setState({ dataFacilityKse, facilityID: res.data.data.ouFacilityTPLID.facilityID, facility })
            }
        }
    }

    async getDataTermination() {
        let res = await Api.create("TERMINATION_QUERY").getTerminationByID(this.state.data.variables.TASK_REFNO)
        if (res.data && res.data.status === "S" && res.data.code === "201") {
            this.getFacilityTermination(res.data.data.employee.employeeID)
            this.setState({ terminationEmpID: res.data.data.employee.employeeID })
        } else {
            alert("Data Termination Not Found.")
        }
    }

    async getFacilityTermination(employeeID) {
        let payload = {
            "limit": 100,
            "offset": 0,
            "params": {
                "employeeID": employeeID
            }
        }
        let res = await Api.create("EMPLOYEE_QUERY").getEmployeeKseCheckByEmpId(payload)
        if (res.data && res.data.status === "S" && res.data.data.length > 0) {
            let facility = res.data.data[0].employeeFacilities.map((data, index) => {
                return {
                    "employeeFacilityID": data.employeeFacilityID,
                    "facilityCategory": data.facilitycategory.bizparKey,
                    "facilityDate": data.facilityDate,
                    "facilityNotes": data.facilityDetailNotes,
                    "facilityQuantity": data.facilityDetailQty,
                    "facilityReturnDate": null,
                    "facilityType": data.facilityType.bizparKey,
                    "isFacilityGiven": data.isFacilityGiven,
                    "isFacilityReturn": false
                }
            })
            let dataFacilityKse = res.data.data[0].employeeFacilities.map((value, index) => {
                const { facilitycategory } = value
                return [
                    index += 1,
                    facilitycategory.bizparValue
                ]
            })
            this.setState({ dataFacilityKse, facilityID: res.data.data[0].facilityID.facilityID, facility })
        }
    }

    componentWillMount() {
        if (this.state.data.variables.INTERVIEW_ID) this.getInterview()
        if (this.state.data.taskName === "KSE CHECKLIST") return this.getEmployee()
        if (this.state.data.taskName === "TERMINATION CHECKLIST") return this.getDataTermination()
    }

    openSearch() {
        this.setState({ formSearchEmpVisible: !this.state.formSearchEmpVisible })
    }

    pickEmployee(value) {
        let dataEmp = value
        this.setState({ dataEmp, pic: value.employeeID, formSearchEmpVisible: !this.state.formSearchEmpVisible })
    }

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
        let recID = this.state.data.variables.TASK_REFNO
        let { userID, employeeID } = this.state.user
        let { payload, buttonType } = ''

        switch (type) {
            case 'APPROVE':
                console.log('Approved')
                buttonType = 'APPROVE'
                break;
            case 'REJECT':
                console.log('Rejected')
                buttonType = 'REJECT'
                break;
            case 'RESUBMIT':
                console.log('Please resubmit')
                buttonType = 'RESUBMIT'
                break;
            case 'PASS':
                console.log('OK')
                buttonType = 'OK'
                break;
            case 'FAILED':
                console.log('FAILED')
                buttonType = 'KO'
                break;
            case 'SIGN TO BE EMPLOYEE':
                console.log('APPROVE')
                buttonType = 'APPROVE'
                break;
            case 'PROCESS':
                console.log('APPROVE')
                buttonType = 'APPROVE'
                break;
            default:
                break;
        }
        switch (taskName) {
            case 'MPP APPROVAL':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": null
                }
                break;
            case 'MPP APPROVAL LEVEL 2':
                    payload = {
                        "taskID": taskID,
                        "senderUserID": userID,
                        "senderEmpID": employeeID,
                        "senderNotes": notes,
                        "senderBPMStatus": buttonType,
                        "data": null
                }
                break;
            case 'MPP APPROVAL LEVEL 3':
                    payload = {
                        "taskID": taskID,
                        "senderUserID": userID,
                        "senderEmpID": employeeID,
                        "senderNotes": notes,
                        "senderBPMStatus": buttonType,
                        "data": null
                }
                break;
            case 'MPP APPROVAL LEVEL 4':
                    payload = {
                        "taskID": taskID,
                        "senderUserID": userID,
                        "senderEmpID": employeeID,
                        "senderNotes": notes,
                        "senderBPMStatus": buttonType,
                        "data": null
                }
                break;
            case 'REQUEST APPROVAL':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "recruitmentRequestID": recID
                    }
                }
                break;
            case 'SELECTION RECRUITMENT APPROVAL':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "recruitmentRequestID": recID
                    }
                }
                break;
            case 'APPLICANT COLLECTION':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "applicantNumber": recID
                    }
                }
                break;
            case 'VALID APPLICANT DATA':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "applicantNumber": recID
                    }
                }
                break;
            case 'PSIKOTEST':
                if (R.isEmpty(this.state.date)) return alert('Date is Required')
                if (R.isEmpty(this.state.psikotestType)) return alert('Psikotest Type is Required.')
                if (R.isEmpty(this.state.pic)) return alert('PIC is Required.')
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": '',
                    "senderBPMStatus": "INITIATE",
                    "data": {
                        "applicantNumber": recID,
                        "psikotestNumber": this.state.data.variables.PSIKOTEST_ID,
                        "psikotestDate": M(this.state.date).format("DD-MM-YYYY HH:mm:ss"),
                        "psikotestType": this.state.psikotestType,
                        "psikotestNotes": notes,
                        "psikotestDocumentURL": this.state.documentUrl,
                        "pic": this.state.pic,
                        "updatedBy": "SYSTEM",
                        "updatedDate": M().format("DD-MM-YYYY HH:mm:ss"),
                        "isPass": buttonType

                    }
                }
                break;
            case 'USER INTERVIEW':
                if (R.isEmpty(this.state.date)) return alert('Date is Required')
                if (R.isEmpty(this.state.pic)) return alert('PIC is Required.')
                if (R.isEmpty(this.state.interviewType)) return alert('Interview Type is Required.')
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": '',
                    "senderBPMStatus": "INITIATE",
                    "data": {
                        "applicantNumber": recID,
                        "interviewID": this.state.data.variables.INTERVIEW_ID,
                        "interviewDate": M(this.state.date).format("DD-MM-YYYY HH:mm:ss"),
                        "interviewType": this.state.interviewType,
                        "interviewNotes": notes,
                        "esid": this.state.data.variables.SENDER_ESID,
                        "pic": this.state.pic,
                        "updatedBy": "SYSTEM",
                        "updatedDate": M().format("DD-MM-YYYY HH:mm:ss"),
                        "isPass": buttonType,
                    }
                }
                break;
            case 'CANDIDATE':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "applicantNumber": recID
                    }
                }
                break;
            case 'KSE CHECKLIST':
                this.state.facility.map((value, index) => {
                    let isExist = R.findIndex(R.propEq("employeeFacilityID", value.employeeFacilityID))(this.state.payloadFacility)
                    let payloadFacility = this.state.payloadFacility
                    if (isExist < 0) {
                        payloadFacility.push({
                            ...value
                        })
                        this.setState({ payloadFacility })
                    }
                })
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "empKSEChecklistID": "KSEC-" + M(),
                        "employeeFacilities": this.state.payloadFacility,
                        "employeeID": recID,
                        "facilityID": this.state.facilityID,
                        "overtimeType": null,
                        "empKSEChecklistDate": M().format("DD-MM-YYYY"),
                        "empKSEChecklistNotes": notes,
                        "empKSEChecklistDocumentURL": null,
                        "pic": employeeID,
                        "createdBy": employeeID,
                        "createdDate": M().format("DD-MM-YYYY HH:mm:ss"),
                        "updatedBy": employeeID,
                        "updatedDate": null,
                        "recordID": uuid.v4()
                    }
                }
                break;
            case 'TERMINATION CHECKLIST':
                this.state.facility.map((value, index) => {
                    let isExist = R.findIndex(R.propEq("employeeFacilityID", value.employeeFacilityID))(this.state.payloadFacility)
                    let payloadFacility = this.state.payloadFacility
                    if (isExist < 0) {
                        payloadFacility.push({
                            ...value
                        })
                        this.setState({ payloadFacility })
                    }
                })
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "terminationChecklistID": "TMN-CHECKLIST-" + M(),
                        "employeeID": this.state.terminationEmpID,
                        "facilityID": this.state.facilityID,
                        "terminationChecklistFacilities": this.state.payloadFacility,
                        "terminationChecklistDate": M().format("DD-MM-YYYY"),
                        "terminationChecklistNotes": notes,
                        "terminationChecklistDocumentURL": null,
                        "pic": employeeID,
                        "createdBy": employeeID,
                        "createdDate": M().format("DD-MM-YYYY HH:mm:ss"),
                        "updatedBy": employeeID,
                        "updatedDate": null,
                        "recordID": uuid.v4()
                    }
                }
                break;
            case 'TERMINATION APPROVAL':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "terminationID": recID
                    }
                }
                break;
            case 'MOVEMENT APPROVAL':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "movementID": recID
                    }
                }
                break;
            case 'BUSINESS TRIP APPROVAL':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "sppdID": recID
                    }
                }
                break;
            case 'LEAVE APPROVAL':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "leaveID": recID
                    }
                }
                break;
            case 'OVERTIME APPROVAL':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "overtimeID": recID
                    }
                }
                break;
            case 'TRAINING REQUEST APPROVAL':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "trainingRequestID": recID
                    }
                }
                break;
            case 'BLACKLIST APPROVAL':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "blacklistID": recID
                    }
                }
                break;
            case 'MANUAL ABSENCE APPROVAL':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "hcisRequestID": recID
                    }
                }
                break;
            case 'CLAIM APPROVAL':
                payload = {
                    "taskID": taskID,
                    "senderUserID": userID,
                    "senderEmpID": employeeID,
                    "senderNotes": notes,
                    "senderBPMStatus": buttonType,
                    "data": {
                        "claimID": recID
                    }
                }
                break;
            default:
                break;
        }
        // return console.log(payload)

        if (R.isEmpty(notes)) return alert('Notes is Required.')
        this.props.handleSubmit(payload)
    }

    renderFooter = () => {
        let buttons = [
            {
                label: "APPROVE",
                cb: () => this.handleApproval('APPROVE')
                // console.log("ini tombol approve")
            },
            {
                label: "REJECT",
                cb: () => this.handleApproval('REJECT')
            },
            // {
            //     label: "RESUBMIT",
            //     cb: () => this.handleApproval('RESUBMIT')
            // }
        ]
        let buttonsMpp = [
            {
                label: "APPROVE",
                cb: () => this.handleApproval('APPROVE')
                // console.log("ini tombol approve")
            },
            {
                label: "REJECT",
                cb: () => this.handleApproval('REJECT')
            }
        ]

        let buttonTest = [
            {
                label: "PASS",
                cb: () => this.handleApproval('PASS')
                // console.log("ini tombol approve")
            },
            {
                label: "FAILED",
                cb: () => this.handleApproval('FAILED')
            }
        ]

        let buttonCandidate = [
            {
                label: "SIGN TO BE EMPLOYEE",
                cb: () => this.handleApproval('SIGN TO BE EMPLOYEE')
                // console.log("ini tombol approve")
            }
        ]

        let buttonKse = [
            {
                label: "PROCESS",
                cb: () => this.handleApproval('PROCESS')
                // console.log("ini tombol approve")
            }
        ]

        return (
            <div className="padding-15px border-top">
                <div className="content-right">
                    {this.state.data.taskName === 'MPP APPROVAL' || this.state.data.taskName === "APPLICANT COLLECTION" || this.state.data.taskName === "TRAINING REQUEST APPROVAL" ? buttonsMpp.map((data, index) => {
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
                    }) :
                        this.state.data.variables.TASK_TYPE === 'PSIKOTEST' || this.state.data.taskName === 'PSIKOTEST' || this.state.data.taskName === 'USER INTERVIEW' ? buttonTest.map((data, index) => {
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
                        }) :
                            this.state.data.taskName === 'CANDIDATE' ? buttonCandidate.map((data, index) => {
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
                                :
                                this.state.data.taskName === 'KSE CHECKLIST' || this.state.data.taskName === 'TERMINATION CHECKLIST' ? buttonKse.map((data, index) => {
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
                                    :
                                    buttons.map((data, index) => {
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

        if (type === 'CLAIM APPROVAL') {
            let res = await Api.create('CNB_QUERY').getClaimById(value)
            if (res.data && res.data.status === 'S') {
                if (res.data.code === "201") {
                    let dataClaim = res.data.data
                    dataClaim = {
                        "claimID": dataClaim.claimID,
                        "employeeName": dataClaim.employee.employeeName,
                        "claimDescription": dataClaim.claimDescription,
                        "claimValue": dataClaim.claimValue,
                        "claimURL": dataClaim.claimURL,
                        "type": "form"
                    }
                    this.setState({ reportURL: dataClaim, reportVisible: !this.state.reportVisible })
                } else return alert("Failed: " + res.data.message)
            } else return alert("Failed: " + res.data ? res.data.message : res.message)
        } else {
            let url = (
                type === 'MPP APPROVAL' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/mpp/' :
                    type === 'MPP APPROVAL LEVEL 2' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/mpp/' :
                      type === 'MPP APPROVAL LEVEL 3' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/mpp/' :
                        type === 'MPP APPROVAL LEVEL 4' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/mpp/' :
                            type === 'REQUEST APPROVAL' || type === 'SELECTION RECRUITMENT APPROVAL' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/recruitment.request.by.recruitment.id/' :
                                type === 'PSIKOTEST' || type === 'APPLICANT COLLECTION' || type === 'VALID APPLICANT DATA' || type === 'USER INTERVIEW' || type === 'CANDIDATE' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/curriculum.vitae/' :
                                    type === 'KSE CHECKLIST' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/daftar.riwayat.hidup/' :
                                        type === 'TERMINATION APPROVAL' || type === 'TERMINATION CHECKLIST' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/terminasi.by.termination.id/' :
                                            type === 'MOVEMENT APPROVAL' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/movement.pengangkatan.karyawan/' :
                                                type === 'BUSINESS TRIP APPROVAL' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/sppd/' :
                                                    type === 'OVERTIME APPROVAL' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/overtime/' :
                                                        type === 'LEAVE APPROVAL' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/cuti.by.leave.id/' :
                                                            type === 'TRAINING REQUEST APPROVAL' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/training.request/' :
                                                                type === 'MANUAL ABSENCE APPROVAL' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/manual.absence.request/' :
                                                                    type === 'BLACKLIST APPROVAL' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/blacklist/' : ''
            )
            let res = await fetch(url + value, {
                headers: {
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4',
                    'Content-Type': 'application/pdf',
                }
            })
            // let res = await fetch(process.env.REACT_APP_HCIS_BE_API + 'report/po/keterangan.kerja/EMP-206', {
            //     headers: {
            //         'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4',
            //         'Content-Type': 'application/pdf',
            //     }
            // })
            console.log(res)
            res = await res.blob()
            console.log(res)
            if (res.size > 0 && res.type === 'application/pdf') {
                res = URL.createObjectURL(res);
                this.setState({ reportURL: res, reportVisible: !this.state.reportVisible })
            } else return alert('Report Not Found!')
        }
    }

    async openReportR(value) {
        // let id = 'MPP-001'
        let url = process.env.REACT_APP_HCIS_BE_API + 'report/po/recruitment.request.by.recruitment.id/'
        let res = await fetch(url + value, {
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4',
                'Content-Type': 'application/pdf',
            }
        })
        // let res = await fetch(process.env.REACT_APP_HCIS_BE_API + 'report/po/keterangan.kerja/EMP-206', {
        //     headers: {
        //         'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4',
        //         'Content-Type': 'application/pdf',
        //     }
        // })
        console.log(res)
        res = await res.blob()
        console.log(res)
        if (res.size > 0 && res.type === 'application/pdf') {
            res = URL.createObjectURL(res);
            this.setState({ reportURL: res, reportVisibleRecruitmentRequest: !this.state.reportVisibleRecruitmentRequest })
        } else return alert('Report Not Found!')
    }

    async getRecPsikotestById(id) {
        let response = await Api.create("RECRUITMENT_QUERY").getRecPsikotestById(id)
        if (response.data && response.data.status === "S") {
            this.setState({
                documentUrl: response.data.data.psikotestDocumentURL,
                result: null
            })
        }
    }

    closeReport() {
        this.setState({ reportVisible: false, reportVisibleRecruitmentRequest: false })
    }

    render() {
        return (
            <div className={"a-s-p-place active"}>
                {/* <div className="padding-top-20px" /> */}
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
                    {/* {this.renderHeader()} */}
                    {this.state.reportVisible && (
                        <FormReport
                            url={this.state.reportURL}
                            id={this.state.data.variables.TASK_REFNO}
                            taskName={this.state.data.taskName}
                            onClickClose={this.closeReport.bind(this)}
                        />
                    )}
                    {this.state.reportVisibleRecruitmentRequest && (
                        <FormReport
                            type={'RecRequest'}
                            url={this.state.reportURL}
                            id={this.state.data.variables.RECRUITMENTREQID}
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
                    <div className="a-s-p-mid a-s-p-pad border-top">
                        <FlexView column>
                            {this.state.data.taskName === 'APPLICANT COLLECTION' && (
                                <div style={{ paddingRight: 20, paddingLeft: 20 }}>
                                    <div
                                        style={{ width: '100%', paddingTop: 20 }}
                                    >
                                        <button
                                            type='button'
                                            // onClick={() => this.state.data.taskName === 'MPP APPROVAL' ? this.openReportMpp(this.state.data.variables.TASK_REFNO) : null}
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
                                            {'Applicant Number'}
                                        </span>
                                    </div>
                                </div>
                            )}
                            {this.state.data.taskName === 'VALID APPLICANT DATA' && (
                                <div style={{ paddingRight: 20, paddingLeft: 20 }}>
                                    <div
                                        style={{ width: '100%', paddingTop: 20 }}
                                    >
                                        <button
                                            type='button'
                                            // onClick={() => this.state.data.taskName === 'MPP APPROVAL' ? this.openReportMpp(this.state.data.variables.TASK_REFNO) : null}
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
                                            {'Applicant Number'}
                                        </span>
                                    </div>
                                </div>
                            )}
                            {this.state.data.taskName === 'PSIKOTEST' && (
                                <div style={{ paddingRight: 20, paddingLeft: 20 }}>
                                    <div
                                        style={{ width: '100%', paddingTop: 20 }}
                                    >
                                        <button
                                            type='button'
                                            // onClick={() => this.state.data.taskName === 'MPP APPROVAL' ? this.openReportMpp(this.state.data.variables.TASK_REFNO) : null}
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
                                            {'Applicant Number'}
                                        </span>
                                    </div>
                                </div>
                            )}
                            {this.state.data.taskName === 'USER INTERVIEW' && (
                                <div style={{ paddingRight: 20, paddingLeft: 20 }}>
                                    <div
                                        style={{ width: '100%', paddingTop: 20 }}
                                    >
                                        <button
                                            type='button'
                                            // onClick={() => this.state.data.taskName === 'MPP APPROVAL' ? this.openReportMpp(this.state.data.variables.TASK_REFNO) : null}
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
                                            {'Applicant Number'}
                                        </span>
                                    </div>
                                </div>
                            )}
                            {this.state.data.taskName === 'CANDIDATE' && (
                                <div style={{ paddingRight: 20, paddingLeft: 20 }}>
                                    <div
                                        style={{ width: '100%', paddingTop: 20 }}
                                    >
                                        <button
                                            type='button'
                                            // onClick={() => this.state.data.taskName === 'MPP APPROVAL' ? this.openReportMpp(this.state.data.variables.TASK_REFNO) : null}
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
                                            {'Applicant Number'}
                                        </span>
                                    </div>
                                </div>
                            )}
                            <div style={{ paddingRight: 20, paddingLeft: 20 }}>
                                <div
                                    style={{ width: '100%', paddingTop: 20 }}
                                >
                                    <button
                                        type='button'
                                        // onClick={() => this.state.data.taskName === 'MPP APPROVAL' ? this.openReportMpp(this.state.data.variables.TASK_REFNO) : null}
                                        onClick={() => this.state.data.taskName === 'APPLICANT COLLECTION' || this.state.data.taskName === 'VALID APPLICANT DATA' || this.state.data.taskName === 'PSIKOTEST' || this.state.data.taskName === 'USER INTERVIEW' || this.state.data.taskName === 'CANDIDATE' ? this.openReportR(this.state.data.variables.RECRUITMENTREQID) : this.openReportMpp(this.state.data.variables.TASK_REFNO)}
                                        style={{
                                            borderRadius: 20,
                                            padding: 10,
                                            width: '100%'
                                        }}
                                        className="btn btn-blue">
                                        {this.state.data.taskName === 'APPLICANT COLLECTION' || this.state.data.taskName === 'VALID APPLICANT DATA' || this.state.data.taskName === 'PSIKOTEST' || this.state.data.taskName === 'USER INTERVIEW' || this.state.data.taskName === 'CANDIDATE' ? this.state.data.variables.RECRUITMENTREQID : this.state.data.taskName === 'KSE CHECKLIST' ? this.state.data.variables.TASK_REFNO : this.state.data.variables.TASK_REFNO}
                                    </button>
                                </div>
                                <div style={{ paddingTop: 10, textAlign: 'center' }}>
                                    <span style={{ paddingTop: 10 }}>
                                        {this.state.data.taskName === 'APPLICANT COLLECTION' || this.state.data.taskName === 'VALID APPLICANT DATA' || this.state.data.taskName === 'PSIKOTEST' || this.state.data.taskName === 'USER INTERVIEW' || this.state.data.taskName === 'CANDIDATE' || this.state.data.taskName === 'SELECTION RECRUITMENT APPROVAL' ? 'Recruitment Request Number' : this.state.data.taskName === 'KSE CHECKLIST' ? 'Employee Number' : this.state.titleNumber}
                                    </span>
                                </div>
                            </div>
                            {this.state.data.taskName === 'PSIKOTEST' || this.state.data.taskName === 'USER INTERVIEW' ? (
                                <div className='grid'>
                                    <FlexView
                                        grow>
                                        {/* <div className='col-1'> */}
                                        <div className="padding-15px">
                                            <div className="margin-bottom-15px">
                                                <div className="margin-5px">
                                                    <span className="txt-site txt-11 txt-main txt-bold">
                                                        Date <span style={{ color: "red" }}>*</span>
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
                                        {/* </div> */}
                                    </FlexView>
                                    <FlexView
                                        grow>
                                        <div className='col-2'>
                                            <div className="padding-15px">
                                                <div className="margin-bottom-15px">
                                                    <div className="margin-5px">
                                                        <span className="txt-site txt-11 txt-main txt-bold">
                                                            {this.state.data.taskName === 'PSIKOTEST' ? 'Psikotest Type' : 'Interview Type'} <span style={{ color: "red" }}>*</span>
                                                        </span>
                                                    </div>
                                                    <div className="margin-5px">
                                                        <DropDown
                                                            disabled={this.state.data.taskName === 'PSIKOTEST' ? false : true}
                                                            title={this.state.data.taskName === 'PSIKOTEST' ? "-- please select psikotest type --" : this.state.interviewTypeValue}
                                                            bizValue={this.state.interviewTypeValue}
                                                            onChange={(dt) => this.setState({
                                                                psikotestType: dt
                                                            })}
                                                            data={this.props.bizparPsikotesType}
                                                            type="bizpar" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </FlexView>
                                    <FlexView
                                        grow>
                                        <div className='col-3' style={{ width: "100%" }}>
                                            <div className="padding-15px">
                                                <div className="margin-bottom-15px">
                                                    <div className="margin-5px">
                                                        <span className="txt-site txt-11 txt-main txt-bold">
                                                            PIC <span style={{ color: "red" }}>*</span>
                                                        </span>
                                                    </div>
                                                    {/* <button type='button'>
                                                    <i className="far fa-lw fa-user-circle" style={{ color: 'blue' }} />
                                                </button> */}
                                                    <div>
                                                        <input
                                                            type="text"
                                                            className="txt txt-sekunder-color"
                                                            readOnly
                                                            style={{ width: '73%', backgroundColor: "#E6E6E6" }}
                                                            value={this.state.dataEmp.employeeID + ' - ' + this.state.dataEmp.employeeName}
                                                            // onChange={(e) => this.setState({
                                                            //     PIC: e.target.value
                                                            // })}
                                                            required />
                                                        <button
                                                            className="btn btn-circle margin-left-10px"
                                                            type="button"
                                                            onClick={() => this.openSearch()}
                                                        >
                                                            <i class="fas fa-search" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </FlexView>
                                    <FlexView grow>
                                        {this.state.data.taskName === 'PSIKOTEST' ?
                                            <div className='col-4' style={{ width: "100%" }}>
                                                <div className="padding-15px">
                                                    <div className="margin-5px">
                                                        <span className="txt-site txt-11 txt-main txt-bold">
                                                            Document <span style={{ color: "red" }}>*format file (docx & pdf)</span>
                                                        </span>
                                                    </div>
                                                    <input
                                                        readOnly
                                                        type="text"
                                                        className="txt txt-sekunder-color margin-bottom-15px"
                                                        placeholder=""
                                                        // onChange={(e) => this.setState({
                                                        //     document: e.target.value
                                                        // })}
                                                        value={this.state.documentUrl && this.state.documentUrl.split('document/recruitment_psikotest_doc/')}
                                                        required />

                                                    <UploadFile
                                                        type={this.state.uploadStatus}
                                                        percentage={this.state.percentage}
                                                        result={this.state.result}
                                                        acceptedFiles={['pdf', 'docx']}
                                                        onHandle={(dt) => {
                                                            this.setState({
                                                                url: dt, uploadStatus: 'idle', percentage: '0'
                                                            })
                                                        }
                                                        }
                                                        onUpload={() => {
                                                            this.connectWebsocket()
                                                            this.setState({ uploadStatus: 'upload' })
                                                            if (this.state.url === '') return alert('Please Select Document.')
                                                            if (this.state.url && !(this.state.url.type === 'application/pdf' || this.state.url.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) return alert('Format file must be docx or pdf.')
                                                            const formData = new FormData()
                                                            formData.append('file', this.state.url)
                                                            formData.append('psikotestID', this.state.data.variables.PSIKOTEST_ID)
                                                            formData.append('updatedBy', this.props.auth.user.employeeID)
                                                            formData.append('updatedDate', M().format("DD-MM-YYYY HH:mm:ss"))
                                                            Api.create('RECRUITMENT').postDocumentPsikotest(formData, {
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
                                                                        this.setState({
                                                                            // createPopUpVisible: true,
                                                                            // document: this.state.url.name,
                                                                            result: 'success'
                                                                        })
                                                                        this.getRecPsikotestById(this.state.data.variables.PSIKOTEST_ID)
                                                                    }
                                                                })
                                                        }} />

                                                    {/* <FilePond
                                                        allowMultiple={false}
                                                        onupdatefiles={
                                                            fileItems => {
                                                                let file = fileItems.map(fileItem => fileItem.file)
                                                                var url = file[0]
                                                                // console.log('url',url)
                                                                this.setState({ url })
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
                                                        } /> */}
                                                    {/* {this.state.buttonVisible
                                                        ? <button
                                                            type="button"
                                                            className="btn btn-blue btn-width-all margin-top-5px"
                                                            onClick={() => {
                                                                if (this.state.url === '') return alert('Please Select Document.')
                                                                if (this.state.url && !(this.state.url.type === 'application/pdf' || this.state.url.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) return alert('Format file must be docx or pdf.')
                                                                const formData = new FormData()
                                                                formData.append('file', this.state.url)
                                                                formData.append('psikotestID', this.state.data.variables.PSIKOTEST_ID)
                                                                Api.create('RECRUITMENT').postDocumentPsikotest(formData).then(
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
                                                                            this.getRecPsikotestById(this.state.data.variables.PSIKOTEST_ID)
                                                                        }
                                                                    })
                                                            }}>
                                                            Upload File
                                                            </button>
                                                        : null} */}
                                                </div>

                                            </div>
                                            : null}
                                    </FlexView>

                                </div>
                            ) : null}

                            {this.state.data.taskName === 'KSE CHECKLIST' || this.state.data.taskName === 'TERMINATION CHECKLIST' ? (
                                <MuiThemeProvider theme={getMuiTheme()}>
                                    <MUIDataTable
                                        data={this.state.dataFacilityKse}
                                        columns={this.columnsKse}
                                        options={this.options}
                                    />
                                </MuiThemeProvider>
                            ) : null}

                            <FlexView
                                grow>
                                <div className="padding-15px">
                                    <div className="margin-bottom-15px">
                                        <div className="margin-5px">
                                            <span className="txt-site txt-11 txt-main txt-bold">
                                                Notes <span style={{ color: "red" }}>*</span>
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
                        {this.renderFooter()}
                    </div>
                </div>
                {this.state.notifVisible && (<WebsocketNotif message={this.state.message} type={"float"} onClickClose={this.closeNotif.bind(this)} />)}

                {
                    this.state.createPopUpVisible && (
                        <PopUp
                            type={"save"}
                            class={"app-popup app-popup-show"}
                            onClick={() => {
                                this.setState({
                                    createPopUpVisible: false
                                })
                            }}
                        />
                    )
                }
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

export default connect(mapStateToProps, mapDispatchToProps)(mppApproval);