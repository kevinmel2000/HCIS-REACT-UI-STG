import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import PopUp from "../../../components/pages/PopUpAlert";
import EmployeeSearchForm from "./employeeSearchForm";
import QualificationForm from "./qualificationForm";
import { getBizpar, renderInputText, } from '../../../Services/Utils'
import uuid from "uuid";
import M from 'moment'
import { connect } from 'react-redux';
import FlexView from 'react-flexview'
import * as R from 'ramda'
import PositionSearchForm from './positionSearchForm'
import API from '../../../Services/Api'
import FormOtherRecRequest from './recruitmentRequestFormOther'
import DropDown from '../../../modules/popup/DropDown';
import CalendarPicker from '../../../modules/popup/Calendar'
import AuthAction from '../../../Redux/AuthRedux'
import WebsocketNotif from '../../../modules/popup/WebsocketNotif'
import Stomp from 'stompjs'

const defaultMpp = {
  used: 0,
  outstanding: 0,
  budget: 0
}

const defaultPayload = {

  "recruitmentRequestID": '',
  "recruitmentRequestDate": '',
  "recruitmentPublishStartDate": '',
  "recruitmentPublishEndDate": '',
  "recruitmentRequestStatus": '',
  "recruitmentType": '',
  "recruitmentEmployeeStatus": '',
  "recruitmentCategory": '',
  "recruitmentRequestType": '',
  "recruitmentEmployeeStatusCategoryType": '',
  "recruitmentRequestBy": '',
  "mppID": '',
  "esID": '',
  "createdBy": null,
  "createdDate": M().format('DD-MM-YYYY HH:mm:ss'),
  "updatedBy": null,
  "updatedDate": null,
  "recordID": uuid.v4()
}

const ct = require("../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = { ...ct.customOptions(), filter: false, search: false, viewColumns: false, pagination: false };

class FormRecruitRequest extends Component {
  constructor(props) {
    super(props);
    // let { type } = this.props.data.taskName
    // let tabMenu = []
    let activeTab = this.props.data.taskName === 'RECRUITMENT REQUEST' ? 'General' : 'Documents'
    let tabGeneralVisible = true
    let tabDocumentsVisible = false

    // switch (type) {
    //   case "RECRUITMENT REQUEST SELECTION":
    //     tabMenu = [
    //       'Documents',
    //       'Selection',
    //       'Others',
    //     ]
    //     activeTab = "Documents"
    //     tabDocumentsVisible = true
    //     break
    //   case "RECRUITMENT REQUEST":
    //     tabMenu = [
    //       'General',
    //       'Qualification',
    //       'Position'
    //     ]
    //     activeTab = "General"
    //     tabGeneralVisible = true
    //     break
    // }

    let employeeName = ""
    let employeeRegistrationDate = ""
    let x = ""

    if (props.data.recruitmentRequestBy) {
      employeeName = props.data.recruitmentRequestBy.employeeName
      employeeRegistrationDate = props.data.recruitmentRequestBy.employeeRegistrationDate
      x = M(employeeRegistrationDate, 'DD-MM-YYYY')
      x = x.fromNow().split(" ")[0] + " Months Ago"
    }
    console.log('props data', this.props.rawDataRecruitmentRequestByID)
    this.state = {
      bizValue: {},
      searchPositionVisible: false,
      data: this.props.rawDataRecruitmentRequestByID ? this.props.rawDataRecruitmentRequestByID : { ...defaultPayload, createdBy: this.props.user.employeeID, updatedBy: this.props.user.employeeID },
      createClassQualification: "app-popup",
      employeeSearchFormVisible: false,
      popupDeleteVisible: false,
      popupSaveVisible: false,

      mpp: defaultMpp,
      tabMenu:
        this.props.type === 'create' && this.props.data.taskName === 'RECRUITMENT REQUEST' ? [
          'General'
        ] :
          // this.props.data.taskName === 'RECRUITMENT REQUEST' ? [
          //   'General',
          //   'Qualification',
          //   'Position'
          // ]
          // :
          [
            'Documents',
            'Selection',
            'Others',
          ],
      activeTab,
      tabGeneralVisible,
      tabDocumentsVisible,
      tabQualificationVisible: false,
      tabPositionVisible: false,
      tabSelectionVisible: false,
      tabOthersVisible: false,
      bizparRecruitmentQualificationType: [],
      bizparRecruitmentDocumentType: [],
      bizparRecruitmentSelectionType: [],
      notCreate: this.props.data.taskName === 'RECRUITMENT REQUEST SELECTION' ? true : false,

      employeeName,
      tmk: employeeRegistrationDate,
      workperiod: x,

      indexOtherClauseSelected: null,
      formOtherVisible: false,
      placeDateStart: false,
      placeDateEnd: false,
      hasQuota: false,
      notifVisible: false,
      message: "",
      messages: "",
      auth: props.auth
    };
    console.log(this.state.data)
  }

  connectWebsocket = async (a) => {
    let stompClient = Stomp.client(process.env.REACT_APP_HCIS_WEBSOCKET);
    let employeeID = this.props.auth.user.employeeID
    stompClient.debug = null;
    stompClient.connect({}, (frame) => {
      console.log('Connected: ' + frame)
      stompClient.subscribe('/topic/recruitment/request/'+ a + employeeID, 
      (message) => {
        let res = JSON.parse(message.body)
        console.log('messages: ' + res.messages)
        this.setState({ notifVisible: true, message: res.messages,
        })
        setTimeout(() => {
          this.setState({
            notifVisible:false
          })
        }, 2000);
      })
    })
  }

  closeNotif() {
    this.setState({ notifVisible: false })
  }

  async componentDidUpdate(prevProvs) {
    if (this.props.data !== prevProvs.data) {
      let employeeName = ""
      let employeeRegistrationDate = ""
      let x = ""

      if (this.props.data.recruitmentRequestBy) {
        employeeName = this.props.data.recruitmentRequestBy.employeeName
        employeeRegistrationDate = this.props.data.recruitmentRequestBy.employeeRegistrationDate
        x = M(employeeRegistrationDate, 'DD-MM-YYYY')
        x = x.fromNow().split(" ")[0] + " Months Ago"
      }
      let bizparRecruitmentQualificationType = await getBizpar('RECRUITMENT_QUALIFICATION_TYPE')
      let bizparRecruitmentDocumentType = await getBizpar('RECRUITMENT_DOCUMENT_TYPE')
      let bizparRecruitmentSelectionType = await getBizpar('RECRUITMENT_SELECTION_TYPE')
      let cux = []
      let reqID = this.props.data.variables.TASK_REFNO
      let mppID = this.props.data.variables.MPPID
      this.getDataEmp()
      this.getRecruitmentRequestByID(reqID)
      this.getMppByID(mppID)
      bizparRecruitmentSelectionType.map((data) => {
        if (data.bizparStatus === "ACTIVE") cux.push(data)
      })

      let doto = this.props.data

      delete doto.recruitmentType
      delete doto.recruitmentCategory
      delete doto.recruitmentRequestType
      delete doto.recruitmentEmployeeStatus
      delete doto.bizparEmployeeStatusCategory
      delete doto.recruitmentRequestID

      this.setState({
        data: this.props.data.recruitmentRequestBy ? this.props.data : doto,
        employeeName,
        tmk: employeeRegistrationDate,
        workperiod: x,
        bizparRecruitmentQualificationType,
        bizparRecruitmentDocumentType,
        bizparRecruitmentSelectionType: cux
      })
    }
  }

  opPlaceDateDivorce = () => {
    if (this.state.placeDateEnd === false) {
      this.setState({
        placeDateEnd: true
      })
    } else {
      this.setState({
        placeDateEnd: false
      })
    }
  }

  opPlaceDateStart = () => {
    if (this.state.placeDateStart === false) {
      this.setState({
        placeDateStart: true
      })
    } else {
      this.setState({
        placeDateStart: false
      })
    }
  }

  removeChange = () => {
    this.setState({
      file: null
    })
  }

  // handleSelectDate = (range) => {
  //   this.setState({
  //     datePicker: range
  //   })
  // }

  handleRangeChange = (which, payload) => {
    console.log(which, payload);
    this.setState({
      [which]: {
        ...this.state[which],
        ...payload,
      },
    })
  }

  opPlaceDateRange = () => {
    if (this.state.placeDateRange === false) {
      this.setState({
        placeDateRange: true
      })
    } else {
      this.setState({
        placeDateRange: false
      })
    }
  }

  async getDataEmp() {
    let payload = {
      employeeID: this.props.data.variables.SENDER_EMPID
    }
    let response = await API.create('EMPLOYEE_QUERY').getEmployeeById(payload)
    if (response.data && response.data.status === "S") {
      this.setState({
        dataEmployeeReg: response.data.data.employeeRegistrationDate,
      })
    }
  }

  async getRecruitmentRequestByID(value) {
    let response = await API.create('RECRUITMENT_QUERY').getRecruitmentRequestByID(value)
    if (response.data && response.data.status === "S" && response.data.code === '201') {
      // console.log(response.data.data)
      response = response.data.data

      let {
        recruitmentEmployeeStatus,
        recruitmentCategory,
        recruitmentEmployeeStatusCategoryType,
        recruitmentType,
        recruitmentRequestType,
        recruitmentRequestDocumentDTOs,
        recruitmentRequestQualificationDTOs,
        recruitmentRequestSelectionDTOs,
        recruitmentPublishStartDate,
        recruitmentPublishEndDate,
        recruitmentRequestPositionDTOs
      } = response

      let bizValue = {
        recruitmentType: response.recruitmentType.bizparValue,
        recruitmentCategory: response.recruitmentCategory.bizparValue,
        recruitmentRequestType: response.recruitmentRequestType.bizparValue,
        recruitmentEmployeeStatusCategoryType: response.recruitmentEmployeeStatusCategoryType.bizparValue,
        recruitmentEmployeeStatus: response.recruitmentEmployeeStatus.bizparValue,

      }

      recruitmentRequestDocumentDTOs = recruitmentRequestDocumentDTOs.map((data) => {
        return {
          ...data,
          recruitmentDocumentType: data.recruitmentDocumentType.bizparKey
        }
      })

      recruitmentRequestSelectionDTOs = recruitmentRequestSelectionDTOs.map((data) => {
        return {
          ...data,
          recruitmentSelectionType: data.recruitmentSelectionType.bizparKey
        }
      })

      recruitmentRequestQualificationDTOs = recruitmentRequestQualificationDTOs.map((data) => {
        let requestQualifications = []
        data.requestQualifications.map((data) => {
          requestQualifications.push(data.bizparKey)
        })
        return {
          ...data,
          qualificationType: data.qualificationType.bizparKey,
          requestQualifications
        }
      })

      delete response.recruitmentRequestQualificationDTOs
      delete response.recruitmentRequestSelectionDTOs
      delete response.recruitmentRequestDocumentDTOs
      delete response.recruitmentRequestPositionDTOs

      response = {
        ...response,
        recruitmentCategory: recruitmentCategory.bizparKey,
        recruitmentEmployeeStatus: !R.isNil(recruitmentEmployeeStatus) ? recruitmentEmployeeStatus.bizparKey : "",
        recruitmentEmployeeStatusCategoryType: recruitmentEmployeeStatusCategoryType.bizparKey,
        recruitmentType: recruitmentType.bizparKey,
        recruitmentRequestType: recruitmentRequestType.bizparKey,
        recruitmentRequestDocuments: recruitmentRequestDocumentDTOs,
        recruitmentRequestQualifications: recruitmentRequestQualificationDTOs,
        recruitmentRequestSelections: recruitmentRequestSelectionDTOs,
        recruitmentPublishStartDate: M(recruitmentPublishStartDate, 'DD-MM-yyyy').format('YYYY-MM-DD'),
        recruitmentPublishEndDate: M(recruitmentPublishEndDate, 'DD-MM-yyyy').format('YYYY-MM-DD'),
        recruitmentRequestPositions: recruitmentRequestPositionDTOs
      }

      // this.setState({
      //   rawData: 
      // })
      this.setState({
        bizValue,
        data: response,
        tabMenu: this.props.data.taskName === 'RECRUITMENT REQUEST' ? ['General', 'Qualification', 'Position'] :
          [
            'Documents',
            'Selection',
            'Others',
          ],
        notCreate: true
        // tabDocumentsVisible: this.props.data.taskName === 'SELECTION RECRUITMENT' ? true : false
      })
    }
    else {
      this.setState({
        data: { ...this.state.data, recruitmentRequestID: 'R-' + M() },

      })
    }
  }

  async getMppByID(value) {
    let response = await API.create('CFG').getMppByID(value)
    if (response.data && response.data.status === "S" && response.data.code === '201') {
      // console.log(response.data)
      this.setState({
        mpp: response.data.data,
        budget: response.data.data.budget,
        used: response.data.data.used,
        outstanding: response.data.data.outstanding,
      })
    }

  }

  async componentWillMount() {
    if (this.props.data.taskName === 'SELECTION RECRUITMENT') {
      this.setState({
        tabGeneralVisible: false,
        tabDocumentsVisible: true
      })
    }
    let bizparRecruitmentQualificationType = await getBizpar('RECRUITMENT_QUALIFICATION_TYPE')
    let bizparRecruitmentDocumentType = await getBizpar('RECRUITMENT_DOCUMENT_TYPE')
    let bizparRecruitmentSelectionType = await getBizpar('RECRUITMENT_SELECTION_TYPE')
    let cux = []
    let reqID = this.props.data.variables.TASK_REFNO
    let mppID = this.props.data.variables.MPPID
    this.getDataEmp()
    this.getRecruitmentRequestByID(reqID)
    this.getMppByID(mppID)
    // console.log('data', JSON.parse(this.props.data.variables.TASK_DATA).data && JSON.parse(this.props.data.variables.TASK_DATA).data.recruitmentRequestID)
    // console.log('bizparRecruitmentQualificationType', bizparRecruitmentQualificationType)
    // console.log('rawdata', this.props.rawDataRecruitmentRequestByID)
    bizparRecruitmentSelectionType.map((data) => {
      if (data.bizparStatus === "ACTIVE") cux.push(data)
    })

    // let mpp = this.state.mpp
    // if (this.state.data.recruitmentRequestPositions.length > 0) {
    //   let payload = {
    //     "limit": 100,
    //     "offset": 0,
    //     "params": {
    //       "position": this.state.data.recruitmentRequestPositions[0].recruitmentRequestPositionID
    //     }
    //   }

    //   let mpp = await API.create('MASTERDATA').getMppByPosition(payload)

    //   if (mpp.data && mpp.data.status === "S" && mpp.data.data.length > 0) {
    //     let { budget, used, outstanding } = mpp.data.data[0]
    //     mpp = {
    //       used,
    //       outstanding,
    //       budget
    //     }
    //   } else {
    //     mpp = defaultMpp
    //   }
    // }

    // let parsedBizSelection = bizparRecruitmentSelectionType.map((data, index) => {
    //   return {
    //     "recruitmentRequestSelectionID": uuid.v4(),
    //     "recruitmentSelectionType": data.bizparKey,
    //     "requestSelectionMandatory": true,
    //     "requestSelectionNotes": "",
    //     "requestSelectionSequence": 0
    //   }
    // })

    // let parsedBizDocument = bizparRecruitmentDocumentType.map((data, index) => {
    //   return {
    //     "recruitmentRequestDocumentID": uuid.v4(),
    //     "documentMandatory": true,
    //     "requestDocumentNotes": "",
    //     "requestDocumentSequence": 0,
    //     "recruitmentDocumentType": data.bizparKey
    //   }
    // })

    // let parsedQualification = bizparRecruitmentQualificationType.map((data, index) => {
    //   return {
    //     "recruitmentReqQualificationID": uuid.v4(),
    //     "requestQualifications": [],
    //     "requestQualificationNotes": null,
    //     "qualificationType": data.bizparKey
    //   }
    // })

    // let data = {
    // ...this.state.data,
    // recruitmentRequestDate: M().format('YYYY-MM-DD'),
    // recruitmentRequestSelections: this.state.data.recruitmentRequestSelections.length === 0 ? parsedBizSelection : this.state.data.recruitmentRequestSelections,
    // recruitmentRequestDocuments: this.state.data.recruitmentRequestDocuments.length === 0 ? parsedBizDocument : this.state.data.recruitmentRequestDocuments,
    // recruitmentRequestQualifications: this.props.rawDataRecruitmentRequestByID.recruitmentRequestQualificationDTO.length === 0 ? parsedQualification : this.props.rawDataRecruitmentRequestByID.recruitmentRequestQualificationDTO,
    // recruitmentRequestPositions: this.state.data.recruitmentRequestPositions.length > 0 ? this.state.data.recruitmentRequestPositions : [
    //   {
    //     "recruitmentRequestPositionID": "",
    //     "positionQuota": "",
    //     "positionNotes": ""
    //   }
    // ]
    // }

    this.setState({
      bizparRecruitmentQualificationType,
      bizparRecruitmentDocumentType,
      bizparRecruitmentSelectionType: cux,
      // data,
      // mpp
    })
  }

  columnsDocument = [
    "No",
    {
      name: "Document Type",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              {val}
            </div>
          );
        }
      }
    },
    "Sequence",
    "Notes",
    {
      name: "Is Mandatory",
      options: {
        customBodyRender: (val) => {
          return (
            <div style={{ width: '100%', display: 'flex' }}>
              <i
                className="fa fa-lw fa-circle"
                style={{
                  color: val ? "green" : "brown",
                  marginRight: 10,
                }}
              />
              <div >
                {val ? "Yes" : "No"}
              </div>
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
                className="btnAct"
                style={{ marginRight: 15, backgroundColor: 'transparent' }}
                onClick={() => this.openQualificationForm(this.state.bizparRecruitmentDocumentType[tableMeta.rowIndex].bizparValue)}
              >
                <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
              </button>
            </div>
          );
        }
      }
    }
  ];

  columnsSelection = [
    "No",
    {
      name: "Selection Type",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              {val}
            </div>
          );
        }
      }
    },
    "Sequence",
    "Notes",
    {
      name: "Is Mandatory",
      options: {
        customBodyRender: (val) => {
          return (
            <div style={{ width: '100%', display: 'flex' }}>
              <i
                className="fa fa-lw fa-circle"
                style={{
                  color: val ? "green" : "brown",
                  marginRight: 10,
                }}
              />
              <div>
                {val ? "Yes" : "No"}
              </div>
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
                className="btnAct"
                style={{ marginRight: 15, backgroundColor: 'transparent' }}
                onClick={() => this.openQualificationForm(this.state.bizparRecruitmentSelectionType[tableMeta.rowIndex].bizparValue)}
              >
                <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
              </button>
            </div>
          );
        }
      }
    }
  ];

  columnsOthers = [
    "No",
    "Other Clause",
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              <button
                type="button"
                onClick={() => this.openFormOtherClause(tableMeta.rowIndex)}
                className="btnAct"
                style={{ marginRight: 15, backgroundColor: 'transparent' }}>
                <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
              </button>
              <button
                type="button"
                className="btnAct"
                style={{ marginRight: 15, backgroundColor: 'transparent' }}
                onClick={() => this.openDeletePopup(tableMeta.rowIndex)}>
                <i className="fa fa-lw fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
              </button>
            </div>
          )
        }
      }
    }
  ]

  //qualification
  columnsQualification = [
    "No",
    {
      name: "Qualification Type",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              {val}
            </div>
          );
        }
      }
    },
    "Qualification",
    "Notes",
    {
      name: "Is Mandatory",
      options: {
        customBodyRender: (val) => {
          return (
            <div style={{ width: '100%', display: 'flex' }}>
              <i
                className="fa fa-lw fa-circle"
                style={{
                  color: val ? "green" : "brown",
                  marginRight: 10,
                }}
              />
              <div>
                {val ? "Yes" : "No"}
              </div>
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
                className="btnAct"
                style={{ marginRight: 15, backgroundColor: 'transparent' }}
                onClick={() => this.openQualificationForm(this.state.bizparRecruitmentQualificationType[tableMeta.rowIndex].bizparValue)}
              >
                <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
              </button>
            </div>
          );
        }
      }
    }
  ];

  // important
  // vertical tab function
  opNavigator = (title) => {
    let cl = title === this.state.activeTab ? 'c-n-link active' : 'c-n-link'
    return (
      <li key={title} className={cl} onClick={this.opContent(title)}>
        {title}
      </li>
    );
  };

  opContent = title => e => {
    e.preventDefault();
    if (title === this.state.activeTab) return true;

    let allStateVisibleFalse = {
      ...this.state,
      tabGeneralVisible: false,
      tabQualificationVisible: false,
      tabPositionVisible: false,
      tabDocumentsVisible: false,
      tabSelectionVisible: false,
      tabOthersVisible: false,
      activeTab: title
    }

    switch (title) {
      case "General":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          tabGeneralVisible: true
        }
        break
      case "Qualification":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          tabQualificationVisible: true
        }
        break
      case "Documents":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          tabDocumentsVisible: true
        }
        break
      case "Selection":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          tabSelectionVisible: true
        }
        break
      case "Others":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          tabOthersVisible: true
        }
        break
      default:
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          tabPositionVisible: true
        }
        break
    }
    this.setState(allStateVisibleFalse)
  };

  openSearchEmployee = () => this.setState({ employeeSearchFormVisible: !this.state.employeeSearchFormVisible })

  handleChooseEmployee = (value) => {
    let { employeeName, employeeRegistrationDate, employeeID } = value
    let tmk = employeeRegistrationDate

    let x = M(employeeRegistrationDate, 'DD-MM-YYYY')

    this.setState({
      data: {
        ...this.state.data,
        recruitmentRequestBy: employeeID
      },
      employeeSearchFormVisible: false,
      employeeName,
      tmk,
      workperiod: x.fromNow().split(" ")[0] + " Months Ago"
    })
  }

  openQualificationForm(qualificationType) {
    this.setState({ qualificationType })
  }

  handleQualificationFormSave = async (newData) => {
    let { data, qualificationType, bizparRecruitmentQualificationType, bizparRecruitmentDocumentType, bizparRecruitmentSelectionType } = this.state
    let payload

    let is_qualification = R.findIndex(R.propEq('bizparValue', qualificationType))(bizparRecruitmentQualificationType)
    let is_document = R.findIndex(R.propEq('bizparValue', qualificationType))(bizparRecruitmentDocumentType)
    let is_selection = R.findIndex(R.propEq('bizparValue', qualificationType))(bizparRecruitmentSelectionType)

    if (is_qualification >= 0) {
      let bizparKey = bizparRecruitmentQualificationType[is_qualification].bizparKey
      bizparKey = R.findIndex(R.propEq('qualificationType', bizparKey))(data.recruitmentRequestQualifications)

      payload = Object.assign({}, data.recruitmentRequestQualifications[bizparKey])
      payload = {
        ...payload,
        requestQualifications: typeof newData.selected === "string" ? [newData.selected] : newData.selected,
        requestQualificationNotes: newData.notes,
        isMandatory: newData.is_mandatory
      }

      data.recruitmentRequestQualifications[bizparKey] = payload

      let payloadApi = {
        "recruitmentRequestID": data.recruitmentRequestID,
        "recruitmentRequestQualifications": data.recruitmentRequestQualifications,
        "updatedBy": this.props.user.employeeID,
        "updatedDate": M().format('DD-MM-YYYY HH:mm:ss')
      }
      this.connectWebsocket('put.recruitment.request.qualification/')
      let response = await API.create('RECRUITMENT').putRecReqQua(payloadApi)
      console.log('PUT REC REQ QUA : ', response)
    } else if (is_document >= 0) {
      let bizparKey = bizparRecruitmentDocumentType[is_document].bizparKey
      bizparKey = R.findIndex(R.propEq('recruitmentDocumentType', bizparKey))(data.recruitmentRequestDocuments)

      payload = Object.assign({}, data.recruitmentRequestDocuments[bizparKey])
      payload = {
        ...payload,
        documentMandatory: newData.is_mandatory,
        requestDocumentNotes: newData.notes,
        requestDocumentSequence: newData.selected
      }
      data.recruitmentRequestDocuments[bizparKey] = payload

      let payloadApi = {
        "recruitmentRequestID": data.recruitmentRequestID,
        "recruitmentRequestDocuments": data.recruitmentRequestDocuments,
        "updatedBy": this.props.user.employeeID,
        "updatedDate": M().format('DD-MM-YYYY HH:mm:ss')
      }
      this.connectWebsocket('put.recruitment.request.document/')
      let response = await API.create('RECRUITMENT').putRecReqDoc(payloadApi)
      console.log('PUT REC REQ DOC : ', response)
      if (response.data.status === 'F') return alert(response.data.message)
    } else if (is_selection >= 0) {
      let bizparKey = bizparRecruitmentSelectionType[is_selection].bizparKey
      bizparKey = R.findIndex(R.propEq('recruitmentSelectionType', bizparKey))(data.recruitmentRequestSelections)

      payload = Object.assign({}, data.recruitmentRequestSelections[bizparKey])
      payload = {
        ...payload,
        requestSelectionMandatory: newData.is_mandatory,
        requestSelectionNotes: newData.notes,
        requestSelectionSequence: newData.selected
      }
      data.recruitmentRequestSelections[bizparKey] = payload

      let payloadApi = {
        "recruitmentRequestID": data.recruitmentRequestID,
        "recruitmentRequestSelections": data.recruitmentRequestSelections,
        "updatedBy": this.props.user.employeeID,
        "updatedDate": M().format('DD-MM-YYYY HH:mm:ss')
      }
      
      this.connectWebsocket('put.recruitment.request.selection/')
      let response = await API.create('RECRUITMENT').putRecReqSel(payloadApi)
      if (response.data.status === 'F') return alert(response.data.message)
      console.log('PUT REC REQ SEL : ', response)
    }
    this.setState({ qualificationType: null, data})
  }

  translateQualification(data) {
    if (typeof data === "string") return data

    let returnData = ""
    data.map((item, index) => {
      returnData = ++index === data.length ? returnData + item : returnData + item + ", "
    })

    return returnData
  }

  handleChoosePosition = async (data) => {
    // return console.log('selected data', data)
    let recruitmentRequestPositions = Object.assign([], this.state.data.recruitmentRequestPositions)
    recruitmentRequestPositions[0].positionID = data.ouid

    // let payload = {
    //   "limit": 100,
    //   "offset": 0,
    //   "params": {
    //     "position": data.ouid
    //   }
    // }

    // let mpp = await API.create('MASTERDATA').getMppByPosition(payload)

    // if (mpp.data && mpp.data.status === "S" && mpp.data.data.length > 0) {
    //   let { budget, used, outstanding } = mpp.data.data[0]
    //   mpp = {
    //     used,
    //     outstanding,
    //     budget
    //   }
    // } else {
    //   mpp = defaultMpp
    // }

    this.setState({
      searchPositionVisible: false,
      data: {
        ...this.state.data,
        recruitmentRequestPositions
      },
      // mpp
    })
    // console.log('new state', this.state.data.recruitmentRequestPositions[0].positionID)
  }

  openSearchPosition = () => {
    this.setState({ searchPositionVisible: !this.state.searchPositionVisible })
  }

  handleOtherClause = (value) => {
    if (value === "") return this.setState({ formOtherVisible: false })
    let { data } = this.state
    let indexFound = -1
    let recruitmentRequestID = data.recruitmentRequestID
    let recruitmentRequestOtherClauses = Object.assign([], data.recruitmentRequestOtherClauses);

    data.recruitmentRequestOtherClauses.map((data, index) => {
      if (value.previousData === data) indexFound = index
    })
    // console.log('recruitmentRequestID found', recruitmentRequestID)
    if (indexFound >= 0) {
      recruitmentRequestOtherClauses[indexFound] = value.data
    } else {
      recruitmentRequestOtherClauses.push(value.data)
    }

    // console.log('other data', recruitmentRequestOtherClauses)

    this.setState({
      data: {
        ...data,
        recruitmentRequestOtherClauses
      },
      formOtherVisible: false
    })

    let payload = {
      recruitmentRequestID,
      recruitmentRequestOtherClauses,
      "updatedBy": this.props.user.employeeID,
      "updatedDate": M().format("DD-MM-YYYY HH:mm:ss")
    }
    // console.log('payload',JSON.stringify(payload))
    this.connectWebsocket('put.recruitment.request.other.clauses/')
    let response = API.create('RECRUITMENT').putRecReqOth(payload)
    console.log('PUT REC REQ OTH : ', response)
    // console.log('other', this.state.data.recruitmentRequestOtherClauses)
  }

  handleDeleteOtherCaluse = (value) => {
    if (value === "") return this.setState({ formOtherVisible: false })
    let { data } = this.state
    let indexFound = -1
    let recruitmentRequestID = data.recruitmentRequestID
    let recruitmentRequestOtherClauses = Object.assign([], data.recruitmentRequestOtherClauses);

    data.recruitmentRequestOtherClauses.map((data, index) => {
      if (value.previousData === data) indexFound = index
    })
    // return console.log('indexFound', value)
    if (indexFound >= 0) {
      recruitmentRequestOtherClauses[indexFound] = value.data
    } else {
      recruitmentRequestOtherClauses.splice(value, 1)
    }
    this.setState({
      data: {
        ...data,
        recruitmentRequestOtherClauses
      },
      popupDeleteVisible: false,
    })
    // return console.log('recruitmentRequestOtherClauses', recruitmentRequestOtherClauses)
    let payload = {
      recruitmentRequestID,
      recruitmentRequestOtherClauses,
      "updatedBy": this.props.user.employeeID,
      "updatedDate": M().format("DD-MM-YYYY HH:mm:ss")
    }
    console.log('payload', payload)
    API.create('RECRUITMENT').putRecReqOth(payload)
  }

  openDeletePopup(index) {
    this.setState({ popupDeleteVisible: !this.state.popupDeleteVisible, selectedIndex: index })
  }

  openFormOtherClause = (data) => {
    this.setState({ formOtherVisible: !this.state.formOtherVisible, indexOtherClauseSelected: data })
  }

  openSavePopUp = () => {
    this.setState({ popupSaveVisible: !this.state.popupSaveVisible })
  }

  renderHeader = () => {
    return (
      <div className="a-s-p-top">
        <div className="grid grid-2x">
          <div className="col-1" style={{ width: "140%" }}>
            <div className="display-flex-normal margin-top-10px">
              <i className="fa fa-1x fa-envelope"></i>
              <span className="txt-site txt-11 txt-main margin-left-10px">
                {this.props.data.taskName === 'RECRUITMENT REQUEST'
                  ? "Recruitment Request Form"
                  : "Selection Request Form"}
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
    )
  }

  renderFooter = () => {
    return (
      <div className="padding-15px">
        <div className="grid grid-2x">
          <div className="col-1" />
          <div className="col-2 content-right">
            <button
              style={{ marginLeft: "15px" }}
              className="btn btn-blue"
              type="button"
              onClick={() => this.props.handleSubmit(this.state.data, this.props.data.taskID)}
            >
              <span>SUBMIT</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  renderGeneral = () => {
    let { companyID, employeeID } = this.props.user
    let { variables } = this.props.data
    let hasQuota = this.state.data.recruitmentRequestPositions && (this.state.data.recruitmentRequestPositions[0].positionQuota === 0 || this.state.data.recruitmentRequestPositions[0].positionQuota === "0" || R.isEmpty(this.state.data.recruitmentRequestPositions[0].positionQuota)) ? this.state.hasQuota : true
    return (
      <div>
        <div className='padding-5px'>
          <div>
            {/* request number */}
            {renderInputText(
              'Request Number',
              this.state.data.recruitmentRequestID,
              (e) => this.setState({
                data: {
                  ...this.state.data,
                  recruitmentRequestID: e.target.value
                }
              }),
              true
            )}
            {/* employee name */}
            <div className="margin-bottom-15px">
              <div className="margin-5px">
                <span className="txt-site txt-11 txt-main txt-bold">
                  Employee Name
              </span>
              </div>
              <div>
                <input
                  value={variables.SENDER_EMPNAME}
                  className="txt txt-sekunder-color"
                  type="text"
                  readOnly
                  style={{ backgroundColor: "#E6E6E6" }}
                  placeholder=""
                />
              </div>
            </div>
            {renderInputText(
              'Join Date',
              M(this.state.dataEmployeeReg, 'DD-MM-YYYY').format('DD-MM-YYYY'),
              (e) => null,
              true
            )}
            {/* work period */}
            {renderInputText(
              'Years of Service',
              M(this.state.dataEmployeeReg, 'DD-MM-YYYY').fromNow().split(" ")[0] + (M(this.state.dataEmployeeReg, 'DD-MM-YYYY').fromNow().split(" ")[1] === "months" ? " Months Ago" : M(this.state.dataEmployeeReg, 'DD-MM-YYYY').fromNow().split(" ")[1] === "days" ? " Days Ago" : M(this.state.dataEmployeeReg, 'DD-MM-YYYY').fromNow().split(" ")[1] === "hours" ? " Hours Ago" : " Years Ago"),
              (e) => null,
              true
            )}
            {/* recruitment type */}
            <div className="margin-bottom-15px">
              <div className="margin-5px">
                <span className="txt-site txt-11 txt-main txt-bold">
                  Recruitment Type <span style={{ color: "red" }}>*</span>
                </span>
              </div>
              <DropDown
                title="-- please select recruitment type --"
                bizValue={this.state.data.recruitmentRequestQualifications ? this.state.bizValue.recruitmentType : "-- please select recruitment type --"}
                onChange={dt =>
                  this.setState({
                    data: {
                      ...this.state.data,
                      recruitmentType: dt
                    }
                  })
                }
                disabled={this.props.type === "view" ? true : false}
                data={this.props.bizparRecruitmentType}
                value={this.state.data.recruitmentType}
                type="bizpar" />
            </div>
          </div>
          <div>
            <div className="margin-bottom-15px">
              <div className="margin-5px">
                <span className="txt-site txt-11 txt-main txt-bold">
                  Recruitment Category <span style={{ color: "red" }}>*</span>
                </span>
              </div>
              <DropDown
                title="-- please select recruitment category --"
                bizValue={this.state.data.recruitmentRequestQualifications ? this.state.bizValue.recruitmentCategory : "-- please select recruitment category --"}
                onChange={dt =>
                  this.setState({
                    data: {
                      ...this.state.data,
                      recruitmentCategory: dt
                    }
                  })
                }
                disabled={this.props.type === "view" ? true : false}
                data={this.props.bizparRecruitmentCategory}
                value={this.state.data.recruitmentCategory}
                type="bizpar" />
            </div>
            <div className="margin-bottom-15px">
              <div className="margin-5px">
                <span className="txt-site txt-11 txt-main txt-bold">
                  Request Type <span style={{ color: "red" }}>*</span>
                </span>
              </div>
              <DropDown
                title="-- please select request type --"
                bizValue={this.state.data.recruitmentRequestQualifications ? this.state.bizValue.recruitmentRequestType : "-- please select request type --"}
                onChange={dt =>
                  this.setState({
                    data: {
                      ...this.state.data,
                      recruitmentRequestType: dt
                    }
                  })
                }
                disabled={this.props.type === "view" ? true : false}
                data={this.props.bizparRequestType}
                value={this.state.data.recruitmentRequestType}
                type="bizpar" />
            </div>
            <div className="margin-bottom-15px">
              <div className="margin-5px">
                <span className="txt-site txt-11 txt-main txt-bold">
                  Employee Status Type <span style={{ color: "red" }}>*</span>
                </span>
              </div>
              <DropDown
                title="-- please select Employee Status Type --"
                bizValue={this.state.data.recruitmentRequestQualifications ? this.state.bizValue.recruitmentEmployeeStatus : "-- please select Employee Status Type --"}
                onChange={dt =>
                  this.setState({
                    data: {
                      ...this.state.data,
                      recruitmentEmployeeStatus: dt
                    }
                  })
                }
                disabled={this.props.type === "view" ? true : false}
                data={this.props.bizparEmployeeStatusType}
                value={this.state.data.recruitmentEmployeeStatus}
                type="bizpar" />
            </div>
            <div className="margin-bottom-15px">
              <div className="margin-5px">
                <span className="txt-site txt-11 txt-main txt-bold">
                  Employee Status Category <span style={{ color: "red" }}>*</span>
                </span>
              </div>
              <DropDown
                title="-- please select Employee Status Category--"
                bizValue={this.state.data.recruitmentRequestQualifications ? this.state.bizValue.recruitmentEmployeeStatusCategoryType : "-- please select Employee Status Category--"}
                onChange={dt =>
                  this.setState({
                    data: {
                      ...this.state.data,
                      recruitmentEmployeeStatusCategoryType: dt
                    }
                  })
                }
                disabled={this.props.type === "view" ? true : false}
                data={this.props.bizparEmployeeStatusCategory}
                value={this.state.data.recruitmentEmployeeStatusCategoryType}
                type="bizpar" />
            </div>
            <div className="margin-bottom-15px">
              <div className="margin-5px">
                <span className="txt-site txt-11 txt-main txt-bold">
                  Publish Date <span style={{ color: "red" }}>*</span>
                </span>
              </div>
              <div className="grid">
                <div>
                  <CalendarPicker
                    date={this.state.data.recruitmentPublishStartDate}
                    disabled={this.props.type === "view" ? true : false}
                    onChange={(e) => this.setState({
                      data: {
                        ...this.state.data,
                        recruitmentPublishStartDate: M(e).format("YYYY-MM-DD")
                      }
                    })
                    } />
                </div>
                <div className="column-2">
                  <p align="center" className="padding-5px">
                    To
                </p>
                </div>
                <div>
                  <CalendarPicker
                    date={this.state.data.recruitmentPublishEndDate}
                    disabled={this.props.type === "view" ? true : false}
                    onChange={(e) => this.setState({
                      data: {
                        ...this.state.data,
                        recruitmentPublishEndDate: M(e).format("YYYY-MM-DD")
                      }
                    })
                    } />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='padding-5px border-top'>
          <div className="grid">
            <div className="col-1" />
            <div className="col-2 content-right">
              <button
                style={{ marginLeft: "15px" }}
                className="btn btn-blue"
                type="button"
                onClick={() => {
                  if (R.isEmpty(this.state.data.recruitmentType) || R.isNil(this.state.data.recruitmentType)) return alert('Recruitment Type is Required.')
                  if (R.isEmpty(this.state.data.recruitmentCategory) || R.isNil(this.state.data.recruitmentCategory)) return alert('Recruitment Category is Required.')
                  if (R.isEmpty(this.state.data.recruitmentRequestType) || R.isNil(this.state.data.recruitmentRequestType)) return alert('Request Type is Required.')
                  if (R.isEmpty(this.state.data.recruitmentEmployeeStatus) || R.isNil(this.state.data.recruitmentEmployeeStatus)) return alert('Employee Status Type is Required.')
                  if (R.isEmpty(this.state.data.recruitmentEmployeeStatusCategoryType) || R.isNil(this.state.data.recruitmentEmployeeStatusCategoryType)) return alert('Employee Status Category Type is Required.')
                  if (R.isEmpty(this.state.data.recruitmentPublishStartDate) || R.isEmpty(this.state.data.recruitmentPublishEndDate)) return alert('Publish Date is Required.')
                  if (!R.isEmpty(this.state.data.recruitmentPublishStartDate) && !R.isEmpty(this.state.data.recruitmentPublishEndDate) && (this.state.data.recruitmentPublishEndDate < this.state.data.recruitmentPublishStartDate)) return alert('End Date Should be Greater Than Start Date.')
                  // return console.log(this.state.data.recruitmentPublishEndDate)
                  this.props.onClickSave({

                    // ...this.state.data,
                    esID: companyID,
                    mppID: variables.MPPID,
                    recruitmentRequestBy: employeeID,
                    recruitmentRequestID: this.state.data.recruitmentRequestID,
                    recruitmentRequestDate: this.state.data.recruitmentRequestDate,
                    recruitmentPublishStartDate: this.state.data.recruitmentPublishStartDate,
                    recruitmentPublishEndDate: this.state.data.recruitmentPublishEndDate,
                    recruitmentRequestStatus: this.state.data.recruitmentRequestStatus,
                    recruitmentType: this.state.data.recruitmentType,
                    recruitmentEmployeeStatus: this.state.data.recruitmentEmployeeStatus,
                    recruitmentCategory: this.state.data.recruitmentCategory,
                    recruitmentRequestType: this.state.data.recruitmentRequestType,
                    recruitmentEmployeeStatusCategoryType: this.state.data.recruitmentEmployeeStatusCategoryType,
                    createdBy: this.props.user.employeeID,
                    createdDate: M().format('DD-MM-YYYY HH:mm:ss'),
                    updatedBy: this.props.auth.user.employeeID,
                    updatedDate: null,
                    recordID: uuid.v4()
                    // recruitmentRequestType: this.state.recruitmentRequestType,
                    // recruitmentType: thi
                  })
                }}
              >
                <span>
                  SAVE
              </span>
              </button>
              <button
                style={{ marginLeft: "15px" }}
                className="btn btn-blue"
                type="button"
                onClick={() => {
                  if (R.isEmpty(this.state.data.recruitmentType)) return alert('Recruitment Type is Required.')
                  if (R.isEmpty(this.state.data.recruitmentCategory)) return alert('Recruitment Category is Required.')
                  if (R.isEmpty(this.state.data.recruitmentRequestType)) return alert('Request Type is Required.')
                  if (R.isEmpty(this.state.data.recruitmentEmployeeStatus)) return alert('Employee Status Type is Required.')
                  if (R.isEmpty(this.state.data.recruitmentEmployeeStatusCategoryType)) return alert('Employee Status Category Type is Required.')
                  if (R.isEmpty(this.state.data.recruitmentPublishStartDate) || R.isEmpty(this.state.data.recruitmentPublishEndDate)) return alert('Publish Date is Required.')
                  if (this.state.data.recruitmentRequestPositions[0].positionQuota === 0 || this.state.data.recruitmentRequestPositions[0].positionQuota === "0" || R.isEmpty(this.state.data.recruitmentRequestPositions[0].positionQuota)) return alert('Quota is Required.')
                  if (this.state.data.recruitmentRequestPositions[0].positionQuota > this.state.budget) return alert('Quota Should be Less Than Budget.')
                  if (!hasQuota) return alert('Please Save Quota First.')
                  this.props.handleSubmit(this.state.data, this.props.data.taskID)
                }}
              >
                <span>SUBMIT</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  render() {
    let titleForm = ""
    let payload = ""
    let { indexOtherClauseSelected, data, qualificationType, bizparRecruitmentQualificationType, bizparRecruitmentDocumentType, bizparRecruitmentSelectionType } = this.state
    // let { variables } = this.props.data

    let { dataTableDocument, dataTableQualification, dataTableOtherClause } = []
    if (data.recruitmentRequestQualifications !== undefined) {
      dataTableQualification = this.state.bizparRecruitmentQualificationType.map((datax, index) => {
        let indexQ = R.findIndex(R.propEq('qualificationType', datax.bizparKey))(data.recruitmentRequestQualifications)
        // console.log('indexQ', indexQ)

        return [
          ++index,
          datax.bizparValue,
          this.translateQualification(data.recruitmentRequestQualifications[indexQ].requestQualifications),
          data.recruitmentRequestQualifications[indexQ].requestQualificationNotes,
          data.recruitmentRequestQualifications[indexQ].isMandatory
        ]

      })
    }
    if (data.recruitmentRequestDocuments !== undefined) {
      dataTableDocument = this.state.bizparRecruitmentDocumentType.map((datay, index) => {
        let indexQ = R.findIndex(R.propEq('recruitmentDocumentType', datay.bizparKey))(data.recruitmentRequestDocuments)
        return [
          ++index,
          datay.bizparValue,
          data.recruitmentRequestDocuments[indexQ].requestDocumentSequence,
          data.recruitmentRequestDocuments[indexQ].requestDocumentNotes,
          data.recruitmentRequestDocuments[indexQ].documentMandatory
        ]
      })
    }

    let dataTableSelection = []

    if (data.recruitmentRequestSelections !== undefined) {
      this.state.bizparRecruitmentSelectionType.map((dataz, index) => {
        let indexQ = R.findIndex(R.propEq('recruitmentSelectionType', dataz.bizparKey))(data.recruitmentRequestSelections)
        if (indexQ >= 0) {
          dataTableSelection.push([
            ++index,
            dataz.bizparValue,
            data.recruitmentRequestSelections[indexQ].requestSelectionSequence,
            data.recruitmentRequestSelections[indexQ].requestSelectionNotes,
            data.recruitmentRequestSelections[indexQ].requestSelectionMandatory
          ])
        }
      })
    }

    let is_qualification = R.findIndex(R.propEq('bizparValue', qualificationType))(bizparRecruitmentQualificationType)
    let is_document = R.findIndex(R.propEq('bizparValue', qualificationType))(bizparRecruitmentDocumentType)
    let is_selection = R.findIndex(R.propEq('bizparValue', qualificationType))(bizparRecruitmentSelectionType)

    if (is_qualification >= 0) {
      let bizparKey = bizparRecruitmentQualificationType[is_qualification].bizparKey
      bizparKey = R.findIndex(R.propEq('qualificationType', bizparKey))(data.recruitmentRequestQualifications)

      payload = data.recruitmentRequestQualifications[bizparKey]
      titleForm = "Request Qualification"

    }
    else if (is_document >= 0) {
      let bizparKey = bizparRecruitmentDocumentType[is_document].bizparKey
      bizparKey = R.findIndex(R.propEq('recruitmentDocumentType', bizparKey))(data.recruitmentRequestDocuments)

      payload = data.recruitmentRequestDocuments[bizparKey]
      titleForm = "Request Document"
    } else if (is_selection >= 0) {
      let bizparKey = bizparRecruitmentSelectionType[is_selection].bizparKey
      bizparKey = R.findIndex(R.propEq('recruitmentSelectionType', bizparKey))(data.recruitmentRequestSelections)

      payload = data.recruitmentRequestSelections[bizparKey]
      titleForm = "Request Selection Step"
    }

    if (data.recruitmentRequestOtherClauses !== undefined) {
      dataTableOtherClause = data.recruitmentRequestOtherClauses.map((data, index) => {
        return [
          ++index,
          data
        ]
      })
    }
    return (
      <div className={"a-s-p-place active"}>
        {/* <div className="padding-top-20px" /> */}
        <div>
          {this.renderHeader()}
          <form action="#">
            <div className="a-s-p-mid a-s-p-pad border-top">
              {this.props.data.taskName === 'RECRUITMENT REQUEST' && (
                <div className="app-open-close margin-bottom-20px">
                  <input
                    type="checkbox"
                    name="navmenu"
                    className="app-open-close-input"
                    id="navmenu-ch" />
                  <div className="grid grid-2x margin-bottom-10px">
                    <div className="col-1">
                      <div className="display-flex-normal margin-top-10px">
                        <i className="fa fa-1x fa-envelope margin-right-5px"></i>
                        <span className="txt-site txt-11 txt-main">General</span>
                      </div>
                    </div>
                    <div className="col-2 content-right">
                      <label htmlFor="navmenu-ch">
                        <div className="app-open-close-icon"></div>
                      </label>
                    </div>
                  </div>
                  <div className="app-open-close-content">
                    {this.renderGeneral()}
                  </div>
                </div>
              )}
              {(this.state.data.recruitmentRequestQualifications && this.props.data.taskName === 'RECRUITMENT REQUEST') && (
                <div>
                  <div className="app-open-close margin-bottom-20px">
                    <input
                      type="checkbox"
                      name="navmenu"
                      className="app-open-close-input"
                      id="navmenu-ch1" />
                    <div className="grid grid-2x margin-bottom-10px">
                      <div className="col-1">
                        <div className="display-flex-normal margin-top-10px">
                          <i className="fa fa-1x fa-envelope margin-right-5px"></i>
                          <span className="txt-site txt-11 txt-main">Qualification</span>
                        </div>
                      </div>
                      <div className="col-2 content-right">
                        <label htmlFor="navmenu-ch1">
                          <div className="app-open-close-icon"></div>
                        </label>
                      </div>
                    </div>
                    <div className="app-open-close-content">
                      <div>
                        <MuiThemeProvider theme={getMuiTheme()}>
                          <MUIDataTable
                            data={dataTableQualification}
                            columns={this.columnsQualification}
                            options={options}
                          />
                        </MuiThemeProvider>
                      </div>
                    </div>
                  </div>
                  <div className="app-open-close margin-bottom-20px">
                    <input
                      type="checkbox"
                      name="navmenu"
                      className="app-open-close-input"
                      id="navmenu-ch2" />
                    <div className="grid grid-2x margin-bottom-10px">
                      <div className="col-1">
                        <div className="display-flex-normal margin-top-10px">
                          <i className="fa fa-1x fa-envelope margin-right-5px"></i>
                          <span className="txt-site txt-11 txt-main">Position</span>
                        </div>
                      </div>
                      <div className="col-2 content-right">
                        <label htmlFor="navmenu-ch2">
                          <div className="app-open-close-icon"></div>
                        </label>
                      </div>
                    </div>
                    <div className="app-open-close-content">
                      <div>
                        <FlexView>
                          <FlexView column style={{ margin: 10, flex: 1 }}>
                            <FlexView style={{ fontWeight: "bold", fontSize: "13px", marginBottom: 5 }}>
                              Position
                          </FlexView>
                            <FlexView>
                              <FlexView grow style={{ paddingRight: 10 }}>
                                <input
                                  value={typeof this.state.data.recruitmentRequestPositions[0].positionID === 'object' ? this.state.data.recruitmentRequestPositions[0].positionID.ouid :
                                    this.state.data.recruitmentRequestPositions[0].positionName}
                                  className="txt txt-sekunder-color"
                                  type="text"
                                  readOnly
                                  style={{ width: "100%", backgroundColor: "#E6E6E6" }}
                                  placeholder=""
                                />
                              </FlexView>
                              {/* <FlexView>
                                <button
                                  className="btn btn-circle"
                                  type="button"
                                // onClick={this.openSearchPosition.bind(this)}
                                >
                                  <i className="fas fa-search" />
                                </button>
                              </FlexView> */}
                            </FlexView>
                          </FlexView>
                          <FlexView column style={{ margin: 10, flex: 1 }}>
                            <FlexView style={{ fontWeight: "bold", fontSize: "13px", marginBottom: 5 }}>
                              Quota <div style={{ color: "red", display: "inline-block" }}> *</div>
                            </FlexView>
                            <FlexView grow>
                              <input
                                value={this.state.data.recruitmentRequestPositions.length > 0 ? this.state.data.recruitmentRequestPositions[0].positionQuota : ""}
                                onChange={(e) => {
                                  if (isNaN(e.target.value)) return true
                                  let recruitmentRequestPositions = Object.assign([], this.state.data.recruitmentRequestPositions)
                                  recruitmentRequestPositions[0].positionQuota = e.target.value
                                  this.setState({
                                    data: {
                                      ...this.state.data,
                                      recruitmentRequestPositions
                                    }
                                  })
                                }}
                                className="txt txt-sekunder-color"
                                type="text"
                              />
                            </FlexView>
                          </FlexView>
                        </FlexView>
                        <FlexView column style={{ margin: 10, border: "1px solid #d7d7d7", borderRadius: 15 }}>
                          <FlexView style={{ margin: 15, fontWeight: "bold", fontSize: 16, justifyContent: 'center' }}>
                            MPP
                           </FlexView>
                          <FlexView style={{ marginBottom: 15, paddingRight: '35%', paddingLeft: '30%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                              <div style={{ fontSize: 16 }}>
                                {'Budget'}
                              </div>
                              <div style={{ fontWeight: "bold", fontSize: 16 }}>
                                {this.state.budget}
                              </div>
                            </div>
                          </FlexView>
                          <FlexView style={{ marginBottom: 15, paddingRight: '35%', paddingLeft: '30%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                              <div style={{ fontSize: 16 }}>
                                {'Used'}
                              </div>
                              <div style={{ fontWeight: "bold", fontSize: 16 }}>
                                {this.state.used}
                              </div>
                            </div>
                          </FlexView>
                          <FlexView style={{ marginBottom: 15, paddingRight: '35%', paddingLeft: '30%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                              <div style={{ fontSize: 16 }}>
                                {'Outstanding'}
                              </div>
                              <div style={{ fontWeight: "bold", fontSize: 16 }}>
                                {this.state.outstanding}
                              </div>
                            </div>
                          </FlexView>
                        </FlexView>
                        <FlexView style={{ padding: 15 }}>
                          <div className="grid grid-2x">
                            <div className="col-1" />
                            <div className="col-2 content-right">
                              <button
                                style={{ marginLeft: "15px" }}
                                className="btn btn-blue"
                                type="button"
                                onClick={() => {
                                  if (this.state.data.recruitmentRequestPositions[0].positionQuota === 0 || this.state.data.recruitmentRequestPositions[0].positionQuota === "0" || R.isEmpty(this.state.data.recruitmentRequestPositions[0].positionQuota)) return alert('Quota is Required.')
                                  if (this.state.data.recruitmentRequestPositions[0].positionQuota > this.state.budget) return alert('Quota Should be Less Than Budget.')
                                  this.props.onClickSavePosition(this.state.data)
                                }}
                              >
                                <span>
                                  SAVE
                            </span>
                              </button>
                            </div>
                          </div>
                        </FlexView>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* SELECTION */}
              {this.props.data.taskName !== "RECRUITMENT REQUEST" && (
                <div>
                  <div className="app-open-close margin-bottom-20px">
                    <input
                      type="checkbox"
                      name="navmenu"
                      className="app-open-close-input"
                      id="navmenu-ch1" />
                    <div className="grid grid-2x margin-bottom-10px">
                      <div className="col-1">
                        <div className="display-flex-normal margin-top-10px">
                          <i className="fa fa-1x fa-envelope margin-right-5px"></i>
                          <span className="txt-site txt-11 txt-main">Documents</span>
                        </div>
                      </div>
                      <div className="col-2 content-right">
                        <label htmlFor="navmenu-ch1">
                          <div className="app-open-close-icon"></div>
                        </label>
                      </div>
                    </div>
                    <div className="app-open-close-content">
                      <div>
                        <MuiThemeProvider theme={getMuiTheme()}>
                          <MUIDataTable
                            data={dataTableDocument}
                            columns={this.columnsDocument}
                            options={options}
                          />
                        </MuiThemeProvider>
                      </div>
                    </div>
                  </div>
                  <div className="app-open-close margin-bottom-20px">
                    <input
                      type="checkbox"
                      name="navmenu"
                      className="app-open-close-input"
                      id="navmenu-ch2" />
                    <div className="grid grid-2x margin-bottom-10px">
                      <div className="col-1">
                        <div className="display-flex-normal margin-top-10px">
                          <i className="fa fa-1x fa-envelope margin-right-5px"></i>
                          <span className="txt-site txt-11 txt-main">Selection</span>
                        </div>
                      </div>
                      <div className="col-2 content-right">
                        <label htmlFor="navmenu-ch2">
                          <div className="app-open-close-icon"></div>
                        </label>
                      </div>
                    </div>
                    <div className="app-open-close-content">
                      <div>
                        <MuiThemeProvider theme={getMuiTheme()}>
                          <MUIDataTable
                            data={dataTableSelection}
                            columns={this.columnsSelection}
                            options={options}
                          />
                        </MuiThemeProvider>
                      </div>
                    </div>
                  </div>
                  <div className="app-open-close margin-bottom-20px">
                    <input
                      type="checkbox"
                      name="navmenu"
                      className="app-open-close-input"
                      id="navmenu-ch3" />
                    <div className="grid grid-2x margin-bottom-10px">
                      <div className="col-1">
                        <div className="display-flex-normal margin-top-10px">
                          <i className="fa fa-1x fa-envelope margin-right-5px"></i>
                          <span className="txt-site txt-11 txt-main">Other Clause</span>
                        </div>
                      </div>
                      <div className="col-2 content-right">
                        <label htmlFor="navmenu-ch3">
                          <div className="app-open-close-icon"></div>
                        </label>
                      </div>
                    </div>
                    <div className="app-open-close-content">
                      <div>
                        <div className="col-2 content-right" style={{ marginBottom: 5 }}>
                          <button
                            type="button"
                            className="btn btn-circle background-blue"
                            style={{ marginRight: 5 }}
                            onClick={() => this.openFormOtherClause(null)}
                          >
                            <i className="fa fa-1x fa-plus" />
                          </button>
                        </div>

                        {this.state.formOtherVisible && (
                          <FormOtherRecRequest
                            data={indexOtherClauseSelected >= 0 ? data.recruitmentRequestOtherClauses[indexOtherClauseSelected] : null}
                            onClickSave={(data) => this.handleOtherClause(data)}
                            onClickClose={() => this.openFormOtherClause(null)}
                          />
                        )}

                        <MuiThemeProvider theme={getMuiTheme()}>
                          <MUIDataTable
                            data={dataTableOtherClause}
                            columns={this.columnsOthers}
                            options={options}
                          />
                        </MuiThemeProvider>
                      </div>
                    </div>
                  </div>
                  {this.renderFooter()}
                </div>
              )}
            </div>
            {/* {this.props.data.taskName === "RECRUITMENT REQUEST SELECTION" && (
              <FlexView>
                <FlexView style={{ padding: 30 }}>
                  <span style={{ padding: 10 }}>
                    Recruitment Request Number
                  </span>
                </FlexView>
                <FlexView style={{ padding: 30 }}>
                  <span style={{ borderRadius: 20, paddingLeft: 30, paddingRight: 30, paddingTop: 10, paddingBottom: 10, backgroundColor: "#3498db" }}>
                    {this.state.data.recruitmentRequestID}
                  </span>
                </FlexView>
              </FlexView>
            )} */}

            {this.state.notifVisible && (
            <WebsocketNotif message={this.state.message} type={"float"} onClickClose={this.closeNotif.bind(this)}
            />
            )}
            
            {this.state.employeeSearchFormVisible && (
              <EmployeeSearchForm
                onClickClose={this.openSearchEmployee.bind(this)}
                onChoose={this.handleChooseEmployee.bind(this)}
              />
            )}

            {this.state.searchPositionVisible && (
              <PositionSearchForm
                onChoose={(this.handleChoosePosition.bind(this))}
                onClickClose={this.openSearchPosition.bind(this)}
              />
            )}

            {this.state.qualificationType && (
              <QualificationForm
                data={payload}
                onClickSave={this.handleQualificationFormSave.bind(this)}
                title={titleForm}
                onClickClose={() => this.openQualificationForm(null)}
                qualificationType={this.state.qualificationType}
              />
            )}

            {this.state.popupSaveVisible && (
              <PopUp
                type={"save"}
                class={"app-popup app-popup-show"}
                onClick={this.openSavePopUp}
              />
            )}

            {this.state.popupDeleteVisible && (
              <PopUp
                type={"delete"}
                class={"app-popup app-popup-show"}
                onClickDelete={() => this.handleDeleteOtherCaluse(this.state.selectedIndex)}
                onClick={this.openDeletePopup}
              />
            )}

            <div className={!this.state.notCreate ? null : "popup-content-grid"}>
              {!this.state.notCreate ? null :
                <div className="popup-col-1" style={{ marginRight: 45 }}>
                  <ul className="vertical-tab">
                    {this.state.tabMenu.map((data, index) => { return this.opNavigator(data) })}
                  </ul>
                </div>

              }

              <div className={!this.state.notCreate ? null : "popup-col-2"}>

                {this.state.tabDocumentsVisible && (
                  <div className="vertical-tab-content active" style={{ marginLeft: -30, marginTop: 10, marginBottom: 10 }}>
                    <MuiThemeProvider theme={getMuiTheme()}>
                      <MUIDataTable
                        data={dataTableDocument}
                        columns={this.columnsDocument}
                        options={options}
                      />
                    </MuiThemeProvider>
                  </div>
                )}

                {this.state.tabSelectionVisible && (
                  <div className="vertical-tab-content active" style={{ marginLeft: -30, marginTop: 10, marginBottom: 10 }}>
                    <MuiThemeProvider theme={getMuiTheme()}>
                      <MUIDataTable
                        data={dataTableSelection}
                        columns={this.columnsSelection}
                        options={options}
                      />
                    </MuiThemeProvider>
                  </div>
                )}

                {this.state.tabQualificationVisible && (
                  <div className="vertical-tab-content active" style={{ marginLeft: -30, marginTop: 10, marginBottom: 10 }}>
                    <MuiThemeProvider theme={getMuiTheme()}>
                      <MUIDataTable
                        data={dataTableQualification}
                        columns={this.columnsQualification}
                        options={options}
                      />
                    </MuiThemeProvider>
                  </div>
                )}

                {this.state.tabOthersVisible && (
                  <div className="vertical-tab-content active" style={{ marginLeft: -30, marginTop: 10, marginBottom: 10 }}>
                    <div className="col-2 content-right" style={{ marginBottom: 5 }}>
                      <button
                        type="button"
                        className="btn btn-circle background-blue"
                        style={{ marginRight: 5 }}
                        onClick={() => this.openFormOtherClause(null)}
                      >
                        <i className="fa fa-1x fa-plus" />
                      </button>
                    </div>

                    {this.state.formOtherVisible && (
                      <FormOtherRecRequest
                        data={indexOtherClauseSelected >= 0 ? data.recruitmentRequestOtherClauses[indexOtherClauseSelected] : null}
                        onClickSave={(data) => this.handleOtherClause(data)}
                        onClickClose={() => this.openFormOtherClause(null)}
                      />
                    )}

                    <MuiThemeProvider theme={getMuiTheme()}>
                      <MUIDataTable
                        data={dataTableOtherClause}
                        columns={this.columnsOthers}
                        options={options}
                      />
                    </MuiThemeProvider>
                  </div>
                )}

                {this.state.tabPositionVisible && (
                  <div className="vertical-tab-content active" style={{ marginLeft: -30 }}>
                    <FlexView>
                      <FlexView column style={{ margin: 10, flex: 1 }}>
                        <FlexView style={{ fontWeight: "bold", fontSize: "13px", marginBottom: 5 }}>
                          Position
                          </FlexView>
                        <FlexView>
                          <FlexView grow style={{ paddingRight: 10 }}>
                            <input
                              value={typeof this.state.data.recruitmentRequestPositions[0].positionID === 'object' ? this.state.data.recruitmentRequestPositions[0].positionID.ouid :
                                this.state.data.recruitmentRequestPositions[0].positionID}
                              className="txt txt-sekunder-color"
                              type="text"
                              readOnly
                              style={{ width: "100%", backgroundColor: "#E6E6E6" }}
                              placeholder=""
                            />
                            {/* {console.log('type', typeof this.state.data.recruitmentRequestPositions[0].positionID)} */}
                          </FlexView>
                          <FlexView>
                            <button
                              className="btn btn-circle"
                              type="button"
                            // onClick={this.openSearchPosition.bind(this)}
                            >
                              <i className="fas fa-search" />
                            </button>
                          </FlexView>
                        </FlexView>
                      </FlexView>
                      <FlexView column style={{ margin: 10, flex: 1 }}>
                        <FlexView style={{ fontWeight: "bold", fontSize: "13px", marginBottom: 5 }}>
                          Quota <div style={{ color: "red", display: "inline-block" }}> *</div>
                        </FlexView>
                        <FlexView grow>
                          <input
                            value={this.state.data.recruitmentRequestPositions.length > 0 ? this.state.data.recruitmentRequestPositions[0].positionQuota : ""}
                            onChange={(e) => {
                              if (isNaN(e.target.value)) return true
                              let recruitmentRequestPositions = Object.assign([], this.state.data.recruitmentRequestPositions)
                              recruitmentRequestPositions[0].positionQuota = e.target.value
                              this.setState({
                                data: {
                                  ...this.state.data,
                                  recruitmentRequestPositions
                                }
                              })
                            }}
                            className="txt txt-sekunder-color"
                            type="text"
                          />
                        </FlexView>
                      </FlexView>
                    </FlexView>
                    <FlexView column style={{ margin: 10, border: "1px solid black" }}>
                      <FlexView style={{ margin: 30, fontWeight: "bold", fontSize: 20 }}>
                        MPP
                      </FlexView>
                      <FlexView style={{ marginTop: 0, marginLeft: 30, marginRight: 30, marginBottom: 30 }}>
                        <FlexView
                          // key={index}
                          hAlignContent="center"
                          vAlignContent="center"
                          style={{
                            flex: 1,
                            border: "1px solid black",
                            textAlign: "center",
                            display: "block",
                            marginLeft: 10,
                            marginRight: 10,
                            borderRadius: 20,
                            paddingTop: 10,
                            paddingBottom: 10
                          }}>
                          <div style={{ fontSize: 20 }}>
                            {'Budget'}
                          </div>
                          <div style={{ marginTop: 15, fontWeight: "bold", fontSize: 30 }}>
                            {this.state.budget}
                          </div>
                        </FlexView>
                        <FlexView
                          // key={index}
                          hAlignContent="center"
                          vAlignContent="center"
                          style={{
                            flex: 1,
                            border: "1px solid black",
                            textAlign: "center",
                            display: "block",
                            marginLeft: 10,
                            marginRight: 10,
                            borderRadius: 20,
                            paddingTop: 10,
                            paddingBottom: 10
                          }}>
                          <div style={{ fontSize: 20 }}>
                            {'Used'}
                          </div>
                          <div style={{ marginTop: 15, fontWeight: "bold", fontSize: 30 }}>
                            {this.state.used}
                          </div>
                        </FlexView>
                        <FlexView
                          // key={index}
                          hAlignContent="center"
                          vAlignContent="center"
                          style={{
                            flex: 1,
                            border: "1px solid black",
                            textAlign: "center",
                            display: "block",
                            marginLeft: 10,
                            marginRight: 10,
                            borderRadius: 20,
                            paddingTop: 10,
                            paddingBottom: 10
                          }}>
                          <div style={{ fontSize: 20 }}>
                            {'Outstanding'}
                          </div>
                          <div style={{ marginTop: 15, fontWeight: "bold", fontSize: 30 }}>
                            {this.state.outstanding}
                          </div>
                        </FlexView>
                        {/* {this.state.mpp !== undefined ? ( */}

                        {/* this.state.mpp && this.state.mpp.map((data, index) => {
                            return (
                              <FlexView
                                key={index}
                                hAlignContent="center"
                                vAlignContent="center"
                                style={{
                                  flex: 1,
                                  border: "1px solid black",
                                  textAlign: "center",
                                  display: "block",
                                  marginLeft: 10,
                                  marginRight: 10,
                                  borderRadius: 20,
                                  paddingTop: 10,
                                  paddingBottom: 10
                                }}>
                                <div style={{ fontSize: 20 }}>
                                  {data.title}
                                </div>
                                <div style={{ marginTop: 15, fontWeight: "bold", fontSize: 30 }}>
                                  {data.value}
                                </div>
                              </FlexView>
                            )
                          }) */}

                        {/* ) : null} */}
                        {/* {this.state.mpp.map((data, index) => {
                          return (
                            <FlexView
                              key={index}
                              hAlignContent="center"
                              vAlignContent="center"
                              style={{
                                flex: 1,
                                border: "1px solid black",
                                textAlign: "center",
                                display: "block",
                                marginLeft: 10,
                                marginRight: 10,
                                borderRadius: 20,
                                paddingTop: 10,
                                paddingBottom: 10
                              }}>
                              <div style={{ fontSize: 20 }}>
                                {data.title}
                              </div>
                              <div style={{ marginTop: 15, fontWeight: "bold", fontSize: 30 }}>
                                {data.value}
                              </div>
                            </FlexView>
                          )
                        })} */}
                      </FlexView>
                    </FlexView>
                    <FlexView style={{ padding: 15 }}>
                      <div className="grid grid-2x">
                        <div className="col-1" />
                        <div className="col-2 content-right">
                          <button
                            style={{ marginLeft: "15px" }}
                            className="btn btn-blue"
                            type="button"
                            onClick={() => {
                              if (this.state.data.recruitmentRequestPositions[0].positionQuota === 0 || this.state.data.recruitmentRequestPositions[0].positionQuota === "0" || R.isEmpty(this.state.data.recruitmentRequestPositions[0].positionQuota)) return alert('Quota is Required.')
                              if (this.state.data.recruitmentRequestPositions[0].positionQuota > this.state.budget) return alert('Quota Should be Less Than Budget.')
                              this.setState({ hasQuota: true })
                              this.props.onClickSavePosition(this.state.data)
                            }}
                          >
                            <span>
                              SAVE
                            </span>
                          </button>
                        </div>
                      </div>
                    </FlexView>
                  </div>
                )}
              </div>
            </div>
            {this.props.data.taskName === 'SELECTION RECRUITMENT' && (
              this.renderFooter()
            )}
          </form>

        </div >
        <div className="padding-bottom-20px" />
      </div >
    );
  }
}

const mapStateToProps = state => {
  return {
    recruitment: state.recruitment,
    auth: state.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    authLogout: () => dispatch(AuthAction.authLogout())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormRecruitRequest);

