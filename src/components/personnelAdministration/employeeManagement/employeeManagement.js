import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import LoadingBar from 'react-top-loading-bar'
import PopUp from '../../pages/PopUpAlert'
import FormEmployee from '../../../modules/forms/formEmployee/formEmployeeData'
import FormIdentity from '../../../modules/forms/formEmployee/formIdentityEmployee'
import FormAddressEmployee from '../../../modules/forms/formEmployee/formAddressEmployee';
import FormFamilyEmployee from '../../../modules/forms/formEmployee/formFamilyEmployee';
import FormFormalEducationEmployee from '../../../modules/forms/formEmployee/formFormalEducationEmployee';
import FormInformalEducationEmployee from '../../../modules/forms/formEmployee/formInformalEducationEmployee';
import FormWorkExpEmployee from '../../../modules/forms/formEmployee/formWorkExpEmployee';
import FormLanguageSkillEmployee from '../../../modules/forms/formEmployee/formLanguageSkillEmployee';
import FormOrgExpEmployee from '../../../modules/forms/formEmployee/formOrgExpEmployee';
import FormAbilityEmployee from '../../../modules/forms/formEmployee/formAbilityEmployee';
import FormDeficiencyEmployee from '../../../modules/forms/formEmployee/formDeficiencyEmployee';
import FormReferenceEmployee from '../../../modules/forms/formEmployee/formReferenceEmployee';
import FormEmergencyContactEmployee from '../../../modules/forms/formEmployee/formEmergencyContactEmployee';
import FormCardEmployee from '../../../modules/forms/formEmployee/formCardEmployee';
import FormDocumentEmployee from '../../../modules/forms/formEmployee/formDocumentEmployee';
import FormSocialMediaEmployee from '../../../modules/forms/formEmployee/formSocialMediaEmployee';
import FormFacilities from '../../../modules/forms/formEmployee/formFacilites';
import FormTrainingCertificate from '../../../modules/forms/formEmployee/formTrainingCertificate';
import FormViolation from '../../../modules/forms/formEmployee/formViolation';
import FormAppreciation from '../../../modules/forms/formEmployee/FormAppreciation';
import FormInsuranceBPJS from '../../../modules/forms/formEmployee/formInsuranceBPJS';
import FormPaymentMethod from '../../../modules/forms/formEmployee/formPaymentMethod';
import EmployeeAction from '../../../Redux/EmployeeRedux'
import { connect } from 'react-redux';
import API from '../../../Services/Api'
import * as R from 'ramda'
import { getBizpar, parseEmployeeData } from '../../../Services/Utils'
import FileViewer from 'react-file-viewer'
import Dropzone from 'react-dropzone'
import AuthAction from '../../../Redux/AuthRedux'
import IdleTimer from 'react-idle-timer'
import Api from '../../../Services/Api'
import WebsocketNotif from '../../../modules/popup/WebsocketNotif'
import Stomp from 'stompjs'
import Loader from 'react-loader-spinner'
import M from "moment";


var ct = require("../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions()

class employeeManagement extends Component {
  constructor() {
    super()
    this.state = {
      file: null,
      imageUrl: "",
      loading: false,
      employeeClass: 'app-popup',
      uploadClass: 'app-popup',
      saveClass: 'app-popup',
      deleteClass: 'app-popup',
      type: 'create',
      selectedIndex: null,
      rawData: [],
      dataTable: [],
      bizparDocument: [],
      bizparSocialMedia: [],
      bizparGender: [],
      bizparNationality: [],
      bizparReligion: [],
      bizparMarital: [],
      bizparEducation: [],
      bizparBlood: [],
      bizparInsuranceCategory: [],
      bizparInsuranceType: [],
      bizparFamilyFaskesClass: [],
      bizparFamilyFaskes: [],
      bizparFacilityType: [],
      bizparFacilityCategory: [],
      bizparAppreciationType: [],
      bizparPaymentMethod: [],
      bizparCurrency: [],
      bizparBank: [],
      bizparThrBase: [],
      bizparTaxStatus: [],
      bizparPensionType: [],
      acceptedFiles: [],
      refreshing: false,
      fetching: false,
      reportType: "",
      reportUrl: "",
      notifVisible: false,
      message: "", 
      messages: "",
      sendState: "",
      formEmployeeDetailUpdateVisible: false,
      formEmployeeDetailViewVisible: false,
      formEmployeeDetailVisible: false,
      formEmployeeDataVisible: false,
      formIdentityVisible: false,
      formAddressVisible: false,
      formFamilyVisible: false,
      formFormalEducationVisible: false,
      formInformalEducationVisible: false,
      formWorkExperienceVisible: false,
      formLanguageSkillVisible: false,
      formOrgExperienceVisible: false,
      formAbilityVisible: false,
      formDeficiencyVisible: false,
      formReferenceVisible: false,
      formEmergencyContactVisible: false,
      formCardVisible: false,
      formDocumentVisible: false,
      formSocialMediaVisible: false,
      formInsuranceBPJSVisible: false,
      formPaymentMethod: false,
      formFacilites: false,
      formTrainingCertificateVisible: false,
      formViolationVisible: false,
      FormAppreciationVisible: false,
      reportVisible: false,
      activeTab: "",
      tabMenu: [
        'Employee Data',
        'Identity',
        'Address',
        'Family',
        'Formal Education',
        'Informal Education',
        'Work Experience',
        'Language Skill',
        'Organization Experience',
        'Ability',
        'Deficiency',
        'Reference',
        'Emergency Contact',
        'Card',
        'Document',
        'Social Media',
        'Insurance',
        'Payment Method',
        'Facilities',
        'Training & Certificate',
        'Violation',
        'Appreciation',
      ],
      employeeCount: 0,
      table_limit: 5,
      table_page: 0,
      table_query: "",
      timeout: 1000 * 100 * 9,
      isTimedOut: false
    }
    this.idleTimer = null
    this.handleChange = this.handleChange.bind(this)
  }

  logout() {
    this.props.authLogout()
    return <Redirect to={{ pathname: "/" }} ></Redirect>
  }

  onAction() {
    this.setState({ isTimedOut: false })
  }

  onActive() {
    this.setState({ isTimedOut: false })
  }

  onSelect = data => {
    this.setState(data);
  }

  onIdle() {
    const isTimedOut = this.state.isTimedOut
    if (isTimedOut) {
      alert("Your session has timed out. Please log in again")
      this.logout()
    } else {
      this.idleTimer.reset();
      this.setState({ isTimedOut: true })
    }
  }

  handleChange(event) {
    this.setState({
      file: URL.createObjectURL(event.target.files[0])
    })
  }

  removeChange = () => {
    this.setState({
      file: null
    })
  }

  getData = (page, limit) => {
    this.props.getEmployeeName({
      "params": {
        "employeeName": this.state.table_query
      },
      "offset": page,
      "limit": limit
    });
    this.getCountPage()
  }

  getCountPage = async () => {
    if (!R.isEmpty(this.state.table_query)) {
      let response = await API.create('EMPLOYEE_QUERY').getCountEmployee(this.state.table_query)
      if (response.ok) {
        this.setState({ employeeCount: response.data.data })
      }
    } else {
      let res = await API.create('EMPLOYEE_QUERY').getCountAllEmployee()
      this.setState({ employeeCount: res.data.data })
    }
  }

  componentDidMount() {
    if (!R.isNil(this.props.auth.user)) {
      this.startFetch()
      this.getData(this.state.table_page, this.state.table_limit)
      this.getBizpar()
    }
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.employee.fetching && !R.isNil(newProps.employee.employeeName)) {
      this.onFinishFetch()
      let dataTable = newProps.employee.employeeName.map((value, index) => {
        if (value === null) {
          return ["", "", "", "", "", "", "", "", "", ""]
        } else {
          const { employeeID, employeeName, employeeGender, employeeMaritalStatus, employeeRegistrationDate, position, employeePTKPType, employeeStatus, employeeType, employeeExitDate } = value;
          return [
            // index += (1 + (this.state.table_page * this.state.table_limit)),
            employeeID,
            employeeName,
            employeeGender ? employeeGender.bizparValue : "",
            employeeMaritalStatus ? employeeMaritalStatus.bizparValue : "",
            employeePTKPType ? employeePTKPType.bizparValue : "",
            employeeRegistrationDate,
            employeeStatus ? employeeStatus.bizparValue : "",
            employeeType ? employeeType.bizparValue : "",
            (!R.isNil(position) ? position.positionName : "-") + "|" + employeeRegistrationDate + "|" + employeeExitDate
          ]
        }
      })
      this.setState({
        rawData: newProps.employee.employeeName,
        dataTable
      })
    }
    this.setState({
      fetching: newProps.employee.fetching,
      refreshing: newProps.employee.fetching
    });
  } 

  getBizpar = async () => {
    let bizparAppreciationType = await getBizpar('APPRECIATION_TYPE')
    let bizparGender = await getBizpar('GENDER_TYPE')
    let bizparNationality = await getBizpar('NATIONALITY_TYPE')
    let bizparReligion = await getBizpar('RELIGION_TYPE')
    let bizparMarital = await getBizpar('MARITAL_STATUS')
    let bizparEducation = await getBizpar('EDUCATION_LEVEL')
    let bizparBlood = await getBizpar('BLOOD_TYPE')
    let bizparFamilyFaskes = await getBizpar('FAMILY_FASKES')
    let bizparFamilyFaskesClass = await getBizpar('FAMILY_FASKES_CLASS')
    let bizparInsuranceCategory = await getBizpar('INSURANCE_CATEGORY')
    let bizparInsuranceType = await getBizpar('INSURANCE_TYPE')
    let bizparFacilityCategory = await getBizpar('FACILITY_CATEGORY')
    let bizparFacilityType = await getBizpar('FACILITY_TYPE')
    let bizparSocialMedia = await getBizpar('SOCIAL_MEDIA')
    let bizparDocument = await getBizpar('DOCUMENT_TYPE')
    let bizparPaymentMethod = await getBizpar('PAYMENT_METHOD')
    let bizparCurrency = await getBizpar('CURRENCY')
    let bizparBank = await getBizpar('BANK')
    let bizparThrBase = await getBizpar('THR_BASE')
    let bizparTaxStatus = await getBizpar('PTKP_DEPENDENTS_FAMILY_TYPE')
    let bizparPensionType = await getBizpar('PENSION_TYPE')

    this.setState({
      bizparAppreciationType,
      bizparGender,
      bizparNationality,
      bizparReligion,
      bizparMarital,
      bizparEducation,
      bizparBlood,
      bizparFamilyFaskes,
      bizparFamilyFaskesClass,
      bizparInsuranceCategory,
      bizparInsuranceType,
      bizparFacilityCategory,
      bizparFacilityType,
      bizparSocialMedia,
      bizparDocument,
      bizparPaymentMethod,
      bizparCurrency,
      bizparBank,
      bizparThrBase,
      bizparTaxStatus,
      bizparPensionType
    })
  }

  connectWebsocket = async (method) => {
    let stompClient = Stomp.client(process.env.REACT_APP_HCIS_WEBSOCKET);
    let employeeID = this.props.auth.user.employeeID
    stompClient.debug = null;
    stompClient.connect({}, (frame) => {
      console.log('Connected: ' + frame)
      stompClient.subscribe('/topic/employee/' + method + employeeID, (message) => {
        let res = JSON.parse(message.body)
        console.log('messages: ' + res.messages)
        if(method === 'put/'){
          setTimeout(() => {
            this.setState({ sendState: "finished" }, () => {
              setTimeout(() => {
                this.setState({
                  notifVisible: true, message: res.messages,
                  formEmployeeDetailUpdateVisible: false,
                  formPaymentMethod: false,
                  formEmployeeDataVisible: false,
                  formIdentityVisible: false,
                })
              }, 500);
            })
          }, 500);
        }else {
          this.setState({ notifVisible: true, message: res.messages })
        }
      })
      setTimeout(() => {
        this.setState({
          notifVisible:false, sendState: ""
        })
      }, 6000);
    })
  }

  async updateEmployee(data) {
    this.setState({ sendState: "loading" })
    this.connectWebsocket('put/')
    data = parseEmployeeData(data)
    data = {
      ...data,
      "updatedBy": this.props.auth.user.employeeID
    }
    console.log(JSON.stringify(data))
    let response = await API.create('EMPLOYEE').putEmployee(data)
    if (response.data && response.data.status === 'S') {
      this.openSavePopUp()
      this.getData(this.state.table_page, this.state.table_limit)
    } else {
      alert('Failed: ' + response.data.message)
    }
  }

  startFetch = () => {
    this.LoadingBar.continousStart();
  };

  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
    if (this.state.messages !== "") {
      this.setState({ notifVisible: true })
      setTimeout(
        function () {
          this.setState({ notifVisible: false, message: "", messages: ""})
        }.bind(this), 2000)
    }
  };

  openEmployeeDetailUpdate = (index) => {
    let { formEmployeeDetailUpdateVisible } = this.state
    this.setState({
      formEmployeeDetailUpdateVisible: !formEmployeeDetailUpdateVisible,
      selectedIndex: !formEmployeeDetailUpdateVisible ? index : null,
      imageUrl: "",
      employeeData: this.state.rawData[index],
      activeTab: !formEmployeeDetailUpdateVisible ? "Employee Data" : "",
      formEmployeeDataVisible: !formEmployeeDetailUpdateVisible ? true : false,
      formIdentityVisible: false,
      formAddressVisible: false,
      formFamilyVisible: false,
      formFormalEducationVisible: false,
      formInformalEducationVisible: false,
      formWorkExperienceVisible: false,
      formLanguageSkillVisible: false,
      formOrgExperienceVisible: false,
      formReferenceVisible: false,
      formDeficiencyVisible: false,
      formAbilityVisible: false,
      formDocumentVisible: false,
      formCardVisible: false,
      formEmergencyContactVisible: false,
      formSocialMediaVisible: false,
      formInsuranceBPJSVisible: false,
      formPaymentMethod: false,
      formFacilites: false,
      formTrainingCertificateVisible: false,
      formViolationVisible: false,
      formAppreciationVisible: false,
    })

    this.getImage(index)
  };

  openEmployeeDetailView = (index) => {
    let { formEmployeeDetailViewVisible } = this.state
    this.setState({
      formEmployeeDetailViewVisible: !formEmployeeDetailViewVisible,
      selectedIndex: !formEmployeeDetailViewVisible ? index : null,
      imageUrl: "",
      employeeData: this.state.rawData[index],
      activeTab: !formEmployeeDetailViewVisible ? "Employee Data" : "",
      formEmployeeDataVisible: !formEmployeeDetailViewVisible ? true : false,
      formIdentityVisible: false,
      formAddressVisible: false,
      formFamilyVisible: false,
      formFormalEducationVisible: false,
      formInformalEducationVisible: false,
      formWorkExperienceVisible: false,
      formLanguageSkillVisible: false,
      formOrgExperienceVisible: false,
      formReferenceVisible: false,
      formDeficiencyVisible: false,
      formAbilityVisible: false,
      formDocumentVisible: false,
      formCardVisible: false,
      formEmergencyContactVisible: false,
      formSocialMediaVisible: false,
      formInsuranceBPJSVisible: false,
      formPaymentMethod: false,
      formFacilites: false,
      formTrainingCertificateVisible: false,
      formViolationVisible: false,
      formAppreciationVisible: false,
    })

    this.getImage(index)
  };

  openUploadPopUp = () => {
    if (this.state.uploadClass === 'app-popup app-popup-show') {
      this.setState({ uploadClass: 'app-popup' })
    } else {
      this.setState({ uploadClass: 'app-popup app-popup-show' })
    }
  }

  getImage(index) {
    if (index >= 0) {
      let employeeData = this.state.rawData[index]
      if (employeeData) {
        this.getImageBlob(employeeData.employeeID)
      }
    }
  }

  async getImageBlob(id) {
    this.setState({ loading: true, imageUrl: '' })
    let response = await fetch(process.env.REACT_APP_HCIS_BE_API + 'emcmd/api/employee.photo.get/' + id, {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4'
      }
    })
    response = await response.blob()
    if (response.size > 0) {
      setTimeout(() => {
        response = URL.createObjectURL(response);
        this.setState({ imageUrl: response, loading: false })
      }, 500)
    } else {
      setTimeout(() => {
        this.setState({ imageUrl: '', loading: false })
      }, 500)
    }

    let payload = {
      "employeeID": id
    }
    let res = await Api.create("EMPLOYEE_QUERY").getEmployeeById(payload)
    if (res.data && res.data.status === "S") return this.setState({ employeeData: { ...this.state.rawData[this.state.selectedIndex], employeePhotoURL: res.data.data.employeePhotoURL } })
  }

  async onDrop(acceptedFiles) {
    this.connectWebsocket('post.employee.photo.image/')
    const formData = new FormData();
    let length = acceptedFiles[0].name.split(".").length
    let fileType = acceptedFiles[0].name.split(".")[length - 1]
    let employee = this.state.rawData[this.state.selectedIndex]
    formData.append('file', acceptedFiles[0])
    formData.append('employeeID', employee.employeeID)
    formData.append('updatedBy',this.props.auth.user.employeeID)
    formData.append('updatedDate',M().format("DD-MM-YYYY HH:mm:ss"))

    if (fileType === "jpg" || fileType === "jpeg" || fileType === "png") {
      let response = await API.create('EMPLOYEE').employeePhotoPost(formData)
      if (!response.ok && response.status === 413) alert("Your Image Too Large, Please Select Another Image")
      if (!response.ok && R.isNil(response.status)) alert(response.problem)

      switch (response.data.status) {
        case "S":
          this.openSavePopUp()
          this.setState({ imageUrl: "" }, () => {
            this.getImageBlob(employee.employeeID)
          })
          break;
        default:
          break;
      }
    } else {
      alert("Unsupported Media Type")
    }
  }

  async openReport(index) {
    let { rawData } = this.state
    let response = await fetch(process.env.REACT_APP_HCIS_BE_API + 'report/po/daftar.riwayat.hidup/' + rawData[index].employeeID, {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4'
      }
    })
    response = await response.blob()
    if (response.size > 0) {
      response = URL.createObjectURL(response)
      this.setState({
        reportUrl: response,
        reportType: "pdf",
        reportVisible: !this.state.reportVisible
      });
    } else {
      alert("Failed: Report Not Found")
    }
  }

  openSavePopUp = () => {
    if ((this.state.saveClass === "app-popup app-popup-show" && this.state.formEmployeeDataVisible) || (this.state.saveClass === "app-popup app-popup-show" && this.state.formIdentityVisible) || (this.state.saveClass === "app-popup app-popup-show" && this.state.formPaymentMethod) || (this.state.saveClass === "app-popup app-popup-show")) {
      this.setState({ dataTable: [], saveClass: "app-popup", formEmployeeDetailUpdateVisible: false, formEmployeeDataVisible: false, formIdentityVisible: false, formPaymentMethod: false });
      this.getData(this.state.table_page, this.state.table_limit)
    } else {
      this.setState({ saveClass: "app-popup app-popup-show" });
    }
  };

  openDeletePopup = () => {
    if (this.state.deleteClass === "app-popup app-popup-show") {
      this.setState({ deleteClass: "app-popup" });
    } else {
      this.setState({ deleteClass: "app-popup app-popup-show" });
    }
  };

  closeNotif() {
    this.setState({ notifVisible: false })
  }

  opNavigator = (title, index) => {
    let cl = title === this.state.activeTab ? 'c-n-link active' : 'c-n-link'
    return (
      <li key={index} className={cl} onClick={this.opContent(title)}>
        {title}
      </li>
    );
  };

  opContent = title => e => {
    e.preventDefault();

    let allStateVisibleFalse = {
      ...this.state,
      formEmployeeDataVisible: false,
      formIdentityVisible: false,
      formAddressVisible: false,
      formFamilyVisible: false,
      formFormalEducationVisible: false,
      formInformalEducationVisible: false,
      formWorkExperienceVisible: false,
      formLanguageSkillVisible: false,
      formOrgExperienceVisible: false,
      formAbilityVisible: false,
      formDeficiencyVisible: false,
      formReferenceVisible: false,
      formEmergencyContactVisible: false,
      formCardVisible: false,
      formDocumentVisible: false,
      formSocialMediaVisible: false,
      formInsuranceBPJSVisible: false,
      formPaymentMethod: false,
      formFacilites: false,
      formTrainingCertificateVisible: false,
      formViolationVisible: false,
      formAppreciationVisible: false,
      activeTab: title
    }

    switch (title) {
      case "Employee Data":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formEmployeeDataVisible: true
        }
        break;
      case "Identity":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formIdentityVisible: true
        }
        break;
      case "Address":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formAddressVisible: true
        }
        break;
      case "Family":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formFamilyVisible: true
        }
        break;
      case "Formal Education":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formFormalEducationVisible: true
        }
        break;
      case "Informal Education":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formInformalEducationVisible: true
        }
        break;
      case "Work Experience":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formWorkExperienceVisible: true
        }
        break;
      case "Language Skill":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formLanguageSkillVisible: true
        }
        break;
      case "Organization Experience":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formOrgExperienceVisible: true
        }
        break;
      case "Ability":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formAbilityVisible: true
        }
        break;
      case "Deficiency":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formDeficiencyVisible: true
        }
        break;
      case "Reference":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formReferenceVisible: true
        }
        break;
      case "Emergency Contact":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formEmergencyContactVisible: true
        }
        break;
      case "Card":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formCardVisible: true
        }
        break;
      case "Document":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formDocumentVisible: true
        }
        break;
      case "Social Media":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formSocialMediaVisible: true
        }
        break;
      case "Insurance":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formInsuranceBPJSVisible: true
        }
        break;
      case "Payment Method":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formPaymentMethod: true
        }
        break;
      case "Facilities":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formFacilites: true
        }
        break;
      case "Training & Certificate":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formTrainingCertificateVisible: true
        }
        break;
      case "Violation":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formViolationVisible: true
        }
        break;
      case "Appreciation":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formAppreciationVisible: true
        }
        break;
      default:
        break;
    }
    this.setState(allStateVisibleFalse);
  };

  columns = [
    "NIK",
    "Employee Name",
    "Gender",
    "Marital Status",
    "Tax Status",
    "Join Date",
    "Working Status",
    "Employee Type",
    {
      name: "Organization Structure",
      options: {
        filter: false,
        customHeadRender: (columnMeta, updateDirection) => (
          <th key={columnMeta.index} style={{ cursor: 'pointer', borderBottom: "1px rgba(0,0,0,0.1) solid", fontSize: 13, fontWeight: 1, textAlign: "center", top: 0, position: "sticky", backgroundColor: "#fff", zIndex: 100 }} scope="col">
            <div style={{ borderBottom: "1px rgba(0,0,0,0.1) solid", position: "sticky" }}>{columnMeta.name}</div>
            <div className="grid grid-3x" style={{ fontSize: 13, fontWeight: 1, position: "sticky" }}>
              <div className="col-1">
                {"Position"}
              </div>
              <div className="col-2">
                {"Start Date"}
              </div>
              <div className="col-3">
                {"End Date"}
              </div>
            </div>
          </th>
        ),
        customBodyRender: (val) => (
          <div className="grid grid-3x">
            <div className="col-1">
              {val.split("|")[0]}
            </div>
            <div className="col-2">
              {val.split("|")[1]}
            </div>
            <div className="col-3">
              {val.split("|")[2]}
            </div>
          </div>
        ),
      }
    },
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div className="grid grid-3x">
              <div className="col-1">
                <button
                  className="btnAct"
                  style={{ marginRight: 15 }}
                  onClick={() => this.openEmployeeDetailUpdate(tableMeta.rowIndex)}
                >
                  <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                </button>
              </div>
              <div className="col-2">
                <button
                  className="btnAct"
                  style={{ marginRight: 15 }}
                  onClick={() => this.openReport(tableMeta.rowIndex)}>
                  <i className="fa fa-lw fa-print" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                </button>
              </div>
              <div className="col-3">
                <button
                  className="btnAct"
                  onClick={() => this.openEmployeeDetailView(tableMeta.rowIndex)}>
                  <i className="fa fa-lw fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                </button>
              </div>
            </div>
          )
        }
      }
    }
  ]

  renderDocument = () => {
    return (
      <div className="app-popup app-popup-show">
        <div className="padding-top-20px" />
        <div className="popup-content-small background-white border-radius">
          <div className="padding-15px background-white border-bottom grid grid-2x">
            <div className="col-1">
              <div className="txt-site txt-12 txt-bold post-center">
                Report Viewer
              </div>
            </div>
            <div className="col-2 content-right">
              <button
                className="btn btn-circle btn-grey"
                onClick={() => this.setState({ reportVisible: false })}
              >
                <i className="fa fa-lg fa-times" />
              </button>
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <FileViewer
              fileType={this.state.reportType}
              filePath={this.state.reportUrl} />
          </div>
          <div className="padding-15px background-grey">
            <div className="grid margin-top-15px">
              <div className="content-right">
                <button
                  style={{ marginLeft: "15px" }}
                  className="btn btn-primary"
                  type="button"
                  onClick={() => this.setState({ reportVisible: false })}
                >
                  <span>CLOSE</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="margin-bottom-15px"></div>
      </div>
    )
  }

  render() {
    if (R.isNil(this.props.auth.user)) return <Redirect to={{ pathname: "/" }} ></Redirect>
    let { employeeCount, table_query } = this.state
    let tableOptions = {
      ...options,
      serverSide: true,
      count: employeeCount,
      searchText: table_query,
      onTableChange: (action, tableState) => {
        switch (action) {
          case 'changePage':
            this.setState({ table_page: tableState.page })
            this.getData(tableState.page, tableState.rowsPerPage);
            break;
          case 'changeRowsPerPage':
            this.setState({ table_limit: tableState.rowsPerPage })
            this.getData(tableState.page, tableState.rowsPerPage);
            break;
          case 'search':
            let searchText = tableState.searchText ? tableState.searchText : ""
            this.setState({ table_query: searchText }, () => {
              this.getData(tableState.page, tableState.rowsPerPage)
            })
            break;
          default:
            break;
        }
      }
    }
    return (
      <div className="main-content">
        <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
        <IdleTimer
          ref={ref => { this.idleTimer = ref }}
          element={document}
          onActive={this.onActive.bind(this)}
          onIdle={this.onIdle.bind(this)}
          onAction={this.onAction.bind(this)}
          debounce={250}
          timeout={this.state.timeout} />
        {this.state.notifVisible && (
          <WebsocketNotif message={this.state.message === "" ? this.state.messages : this.state.message} type={"float"} onClickClose={this.closeNotif.bind(this)} />
        )}
        <div className="padding-5px grid grid-2x">
          <div className="col-1">
            <div className="txt-site txt-18 txt-bold txt-main padding-top-5px">
              {/* EMPLOYEE */}
            </div>
          </div>
          <div className="col-2 content-right">
            <button type="button" className="btn btn-circle background-blue" style={{ marginRight: 5 }} onClick={this.openUploadPopUp}>
              <i className='fa fa-1x fa-upload'></i>
            </button>
            <button type="button" className="btn btn-circle background-blue">
              <i className='fa fa-1x fa-download'></i>
            </button>
          </div>
        </div>

        <div className="padding-5px">
          <MuiThemeProvider theme={getMuiTheme()}>
            <MUIDataTable
              key={employeeCount}
              title={<div><i className="fa fa-1x fa-desktop" /> Employee</div>}
              subtitle={"lorem ipsum dolor"}
              data={this.state.dataTable}
              columns={this.columns}
              options={tableOptions}
            />
          </MuiThemeProvider>
        </div>

        {this.state.formEmployeeDetailUpdateVisible && (
          <div className="app-popup app-popup-show">
            <div className="padding-top-20px" />
            <div className="popup-content background-white border-radius">

              <div className="popup-panel grid grid-2x">
                <div className="col-1">
                  <div className="popup-title">
                    <i className="fa fa-1x fa-desktop" /> Employee Detail
                  </div>
                </div>
                <div className="col-2 content-right">
                  <button
                    className="btn btn-circle btn-grey"
                    onClick={this.openEmployeeDetailUpdate}
                  >
                    <i className="fa fa-lg fa-times" />
                  </button>
                </div>
              </div>

              <div className="popup-content-grid">
                <div className="popup-scroll popup-col-1">
                  <div className="padding-10px">
                    <div
                      className="image image-160px image-circle margin-bottom-20px"
                      style={{
                        margin: "auto",
                        backgroundColor: "#f8f8f8",
                      }}>
                      {this.state.loading && (
                          <Loader
                            type="ThreeDots"
                            style={{display:'flex', justifyContent:'center',marginTop:45}}
                            color={"#somecolor"}
                            height={80}
                            width={80}
                            loading={this.state.loading}
                      />
                      )}
                      {(this.state.imageUrl === "")
                        ? this.state.loading === true ? <i />
                        : (<i className="icn far fa-user fa-3x" />)
                        : (<img src={this.state.imageUrl} alt="img" />)
                      }
                    </div>
                    <div>
                      {this.props.type !== 'view'
                        ?
                        <button
                          className="btn btn-red btn-small-circle"
                          type="button"
                          align="center"
                          style={{
                            position: "absolute",
                            bottom: "30px",
                            right: "40px"
                          }}
                        >
                          <Dropzone onDrop={this.onDrop.bind(this)}>
                            {({ getRootProps, getInputProps }) => (
                              <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <i className="fa fa-lw fa-pencil-alt"></i>
                              </div>
                            )}
                          </Dropzone>
                        </button>
                        : null}
                    </div>
                    {this.props.type !== 'view' ?
                      <div style={{ textAlign: "center" }}>
                        <span style={{ color: "red", fontSize: 11, marginBottom: 5 }}>*Image max 1Mb</span>
                      </div> : null}
                  </div>
                  <ul className="vertical-tab">
                    {this.state.tabMenu.map((data, index) => { return this.opNavigator(data, index) })}
                  </ul>
                </div>

                <div className="popup-scroll popup-col-2">
                  {/* Employee Data*/}
                  {this.state.formEmployeeDataVisible && (
                    <FormEmployee
                      type={'update'}
                      sendState={this.state.sendState}
                      employeeData={this.state.employeeData}
                      onClickSave={(data) => this.updateEmployee(data)}
                      bizparGender={this.state.bizparGender}
                      bizparNationality={this.state.bizparNationality}
                      bizparTaxStatus={this.state.bizparTaxStatus}
                      bizparPensionType={this.state.bizparPensionType}
                      page={this.state.table_page}
                      limit={this.state.table_limit}
                      name={this.state.table_query} />
                  )}

                  {/* Identity */}
                  {this.state.formIdentityVisible && (
                    <FormIdentity
                      type={'update'}
                      sendState={this.state.sendState}
                      employeeData={this.state.rawData[this.state.selectedIndex]}
                      onClickSave={(data) => this.updateEmployee(data)}
                      bizparReligion={this.state.bizparReligion}
                      bizparMarital={this.state.bizparMarital}
                      bizparEducation={this.state.bizparEducation}
                      bizparBlood={this.state.bizparBlood} />
                  )}

                  {/* Address */}
                  {this.state.formAddressVisible && (
                    <FormAddressEmployee
                      type={'update'}
                      employeeData={this.state.rawData[this.state.selectedIndex]}
                      backToPage={this.openEmployeeDetailUpdate}
                    />
                  )}

                  {/* Family */}
                  {this.state.formFamilyVisible && (
                    <FormFamilyEmployee
                      type={'update'}
                      openSavePopUp={this.openSavePopUp.bind(this)}
                      onSelect={this.onSelect}
                      employeeData={this.state.rawData[this.state.selectedIndex]}
                      backToPage={this.openEmployeeDetailUpdate}
                      page={this.state.table_page}
                      limit={this.state.table_limit}
                      name={this.state.table_query}
                      onFinishFetch={this.onFinishFetch} />
                  )}

                  {/* Formal Education */}
                  {this.state.formFormalEducationVisible && (
                    <FormFormalEducationEmployee
                      type={'update'}
                      onSelect={this.onSelect}
                      employeeData={this.state.rawData[this.state.selectedIndex]}
                      backToPage={this.openEmployeeDetailUpdate.bind(this)}
                      page={this.state.table_page}
                      limit={this.state.table_limit}
                      name={this.state.table_query}
                      onFinishFetch={this.onFinishFetch}
                      openSavePopUp={this.openSavePopUp.bind(this)} />
                  )}

                  {/* Informal Education */}
                  {this.state.formInformalEducationVisible && (
                    <FormInformalEducationEmployee
                      type={'update'}
                      onSelect={this.onSelect}
                      employeeData={this.state.rawData[this.state.selectedIndex]}
                      backToPage={this.openEmployeeDetailUpdate}
                      page={this.state.table_page}
                      limit={this.state.table_limit}
                      name={this.state.table_query}
                      onFinishFetch={this.onFinishFetch}
                      openSavePopUp={this.openSavePopUp.bind(this)} />
                  )}

                  {/* Work Experience */}
                  {this.state.formWorkExperienceVisible && (
                    <FormWorkExpEmployee
                      type={'update'}
                      onSelect={this.onSelect}
                      employeeData={this.state.rawData[this.state.selectedIndex]}
                      backToPage={this.openEmployeeDetailUpdate}
                      page={this.state.table_page}
                      limit={this.state.table_limit}
                      name={this.state.table_query}
                      onFinishFetch={this.onFinishFetch}
                      openSavePopUp={this.openSavePopUp.bind(this)} />
                  )}

                  {/* Language Skill */}
                  {this.state.formLanguageSkillVisible && (
                    <FormLanguageSkillEmployee
                      type={'update'}
                      onSelect={this.onSelect}
                      employeeData={this.state.rawData[this.state.selectedIndex]}
                      backToPage={this.openEmployeeDetailUpdate}
                      page={this.state.table_page}
                      limit={this.state.table_limit}
                      name={this.state.table_query}
                      onFinishFetch={this.onFinishFetch}
                      openSavePopUp={this.openSavePopUp.bind(this)}  />
                  )}

                  {/* Organization Experience */}
                  {this.state.formOrgExperienceVisible && (
                    <FormOrgExpEmployee
                      type={'update'}
                      onSelect={this.onSelect}
                      employeeData={this.state.rawData[this.state.selectedIndex]}
                      backToPage={this.openEmployeeDetailUpdate}
                      page={this.state.table_page}
                      limit={this.state.table_limit}
                      name={this.state.table_query}
                      onFinishFetch={this.onFinishFetch}
                      openSavePopUp={this.openSavePopUp.bind(this)} />
                  )}

                  {/* Ability */}
                  {this.state.formAbilityVisible && (
                    <FormAbilityEmployee
                      type={'update'}
                      onSelect={this.onSelect}
                      employeeData={this.state.rawData[this.state.selectedIndex]}
                      backToPage={this.openEmployeeDetailUpdate}
                      page={this.state.table_page}
                      limit={this.state.table_limit}
                      name={this.state.table_query}
                      onFinishFetch={this.onFinishFetch}
                      openSavePopUp={this.openSavePopUp.bind(this)} />
                  )}

                  {/* Deficiency */}
                  {this.state.formDeficiencyVisible && (
                    <FormDeficiencyEmployee
                      type={'update'}
                      backToPage={this.openEmployeeDetailUpdate}
                      onSelect={this.onSelect}
                      employeeData={this.state.rawData[this.state.selectedIndex]}
                      page={this.state.table_page}
                      limit={this.state.table_limit}
                      name={this.state.table_query}
                      onFinishFetch={this.onFinishFetch}
                      openSavePopUp={this.openSavePopUp.bind(this)} />
                  )}

                  {/* Reference */}
                  {this.state.formReferenceVisible && (
                    <FormReferenceEmployee
                      type={'update'}
                      onSelect={this.onSelect}
                      employeeData={this.state.rawData[this.state.selectedIndex]}
                      backToPage={this.openEmployeeDetailUpdate}
                      page={this.state.table_page}
                      limit={this.state.table_limit}
                      name={this.state.table_query}
                      onFinishFetch={this.onFinishFetch}
                      openSavePopUp={this.openSavePopUp.bind(this)} />
                  )}

                  {/* Emergency Contact */}
                  {this.state.formEmergencyContactVisible && (
                    <FormEmergencyContactEmployee
                      type={'update'}
                      onSelect={this.onSelect}
                      employeeData={this.state.rawData[this.state.selectedIndex]}
                      backToPage={this.openEmployeeDetailUpdate}
                      page={this.state.table_page}
                      limit={this.state.table_limit}
                      name={this.state.table_query}
                      onFinishFetch={this.onFinishFetch}
                      openSavePopUp={this.openSavePopUp.bind(this)} />
                  )}

                  {/* Card */}
                  {this.state.formCardVisible && (
                    <FormCardEmployee
                      type={'update'}
                      employeeData={this.state.rawData[this.state.selectedIndex]}
                      backToPage={this.openEmployeeDetailUpdate}
                      page={this.state.table_page}
                      limit={this.state.table_limit}
                      name={this.state.table_query} 
                      onSelect={this.onSelect}
                      onFinishFetch={this.onFinishFetch}
                      openSavePopUp={this.openSavePopUp.bind(this)}/>
                  )}

                  {/* Document */}
                  {this.state.formDocumentVisible && (
                    <FormDocumentEmployee
                      type={'update'}
                      onSelect={this.onSelect}
                      employeeData={this.state.rawData[this.state.selectedIndex]}
                      bizparDocument={this.state.bizparDocument}
                      backToPage={this.openEmployeeDetailUpdate}
                      page={this.state.table_page}
                      limit={this.state.table_limit}
                      name={this.state.table_query}
                      onFinishFetch={this.onFinishFetch}
                      openSavePopUp={this.openSavePopUp.bind(this)}
                    />
                  )}

                  {/* Social Media */}
                  {this.state.formSocialMediaVisible && (
                    <FormSocialMediaEmployee
                      type={'update'}
                      onSelect={this.onSelect}
                      employeeData={this.state.rawData[this.state.selectedIndex]}
                      bizparSocialMedia={this.state.bizparSocialMedia}
                      backToPage={this.openEmployeeDetailUpdate}
                      page={this.state.table_page}
                      limit={this.state.table_limit}
                      name={this.state.table_query}
                      onClickSave={(data) => this.updateEmployee(data)}
                      onFinishFetch={this.onFinishFetch}
                      openSavePopUp={this.openSavePopUp.bind(this)}
                    />
                  )}

                  {/* Insurance */}
                  {this.state.formInsuranceBPJSVisible && (
                    <FormInsuranceBPJS
                      type={'update'}
                      employeeData={this.state.rawData[this.state.selectedIndex]}
                      bizparInsuranceCategory={this.state.bizparInsuranceCategory}
                      bizparInsuranceType={this.state.bizparInsuranceType}
                      bizparFamilyFaskes={this.state.bizparFamilyFaskes}
                      bizparFamilyFaskesClass={this.state.bizparFamilyFaskesClass}
                      backToPage={this.openEmployeeDetailUpdate}
                      page={this.state.table_page}
                      limit={this.state.table_limit}
                      name={this.state.table_query}
                      onSelect={this.onSelect}
                      onFinishFetch={this.onFinishFetch}
                      openSavePopUp={this.openSavePopUp.bind(this)}
                    />
                  )}
                  {/* {Payment Method} */}
                  {this.state.formPaymentMethod && (
                    <FormPaymentMethod
                      type={'update'}
                      employeeData={this.state.rawData[this.state.selectedIndex]}
                      bizparPaymentMethod={this.state.bizparPaymentMethod}
                      bizparCurrency={this.state.bizparCurrency}
                      bizparBank={this.state.bizparBank}
                      bizparThrBase={this.state.bizparThrBase}
                      onClickSave={(data) => this.updateEmployee(data)}
                      backToPage={this.openEmployeeDetailUpdate}
                    />
                  )}

                  {/* {FormFacilities} */}
                  {this.state.formFacilites && (
                    <FormFacilities
                      type={'update'}
                      employeeData={this.state.rawData[this.state.selectedIndex]}
                      bizparFacilityCategory={this.state.bizparFacilityCategory}
                      bizparFacilityType={this.state.bizparFacilityType}
                      backToPage={this.openEmployeeDetailUpdate}
                      page={this.state.table_page}
                      limit={this.state.table_limit}
                      name={this.state.table_query}
                      onSelect={this.onSelect}
                      onFinishFetch={this.onFinishFetch}
                      openSavePopUp={this.openSavePopUp.bind(this)}
                    />
                  )}

                  {/* Training & Certificate */}
                  {this.state.formTrainingCertificateVisible && (
                    <FormTrainingCertificate
                      type={'update'}
                      backToPage={this.openEmployeeDetailUpdate} />
                  )}

                  {/* Violation */}
                  {this.state.formViolationVisible && (
                    <FormViolation
                      type={'update'}
                      employeeID={this.state.rawData[this.state.selectedIndex].employeeID}
                      backToPage={this.openEmployeeDetailUpdate} />
                  )}

                  {/* Appreciation */}
                  {this.state.formAppreciationVisible && (
                    <FormAppreciation
                      type={'update'}
                      onSelect={this.onSelect}
                      employeeData={this.state.rawData[this.state.selectedIndex]}
                      bizparAppreciationType={this.state.bizparAppreciationType}
                      backToPage={this.openEmployeeDetailUpdate}
                      page={this.state.table_page}
                      limit={this.state.table_limit}
                      name={this.state.table_query}
                      onFinishFetch={this.onFinishFetch}
                      openSavePopUp={this.openSavePopUp.bind(this)} />
                  )}

                </div>
              </div>
            </div>
          </div>
        )}

        {this.state.formEmployeeDetailViewVisible && (
          <div className="app-popup app-popup-show">
            <div className="padding-top-20px" />
            <div className="popup-content background-white border-radius">

              <div className="popup-panel grid grid-2x">
                <div className="col-1">
                  <div className="popup-title">
                    <i className="fa fa-1x fa-desktop" /> Employee - View Form
                </div>
                </div>
                <div className="col-2 content-right">
                  <button
                    className="btn btn-circle btn-grey"
                    onClick={this.openEmployeeDetailView}
                  >
                    <i className="fa fa-lg fa-times" />
                  </button>
                </div>
              </div>

              <div className="popup-content-grid">
                <div className="popup-scroll popup-col-1">
                  <div className="padding-10px">
                    <div
                      className="image image-160px image-circle margin-bottom-20px"
                      style={{
                        margin: "auto",
                        backgroundColor: "#f8f8f8",
                      }}>
                      {this.state.loading && (
                        <Loader
                          type="ThreeDots"
                          style={{display:'flex', justifyContent:'center',marginTop:45}}
                          color={"#somecolor"}
                          height={80}
                          width={80}
                          loading={this.state.loading}
                      />
                      )}
                      {(this.state.imageUrl === "")
                        ? this.state.loading === true ? <i />
                        : (<i className="icn far fa-user fa-3x" />)
                        : (<img src={this.state.imageUrl} alt="img" />)
                      }
                    </div>
                  </div>
                  <ul className="vertical-tab">
                    {this.state.tabMenu.map((data, index) => { return this.opNavigator(data, index) })}
                  </ul>
                </div>

                <div className="popup-scroll popup-col-2">
                  {/* Employee Data*/}
                  {this.state.formEmployeeDataVisible && (
                    <FormEmployee
                      type={'view'}
                      employeeData={this.state.employeeData}
                      onClickSave={(data) => this.updateEmployee(data)}
                      onClickClose={this.openEmployeeDetailView}
                      bizparGender={this.state.bizparGender}
                      bizparNationality={this.state.bizparNationality}
                      bizparTaxStatus={this.state.bizparTaxStatus}
                      bizparPensionType={this.state.bizparPensionType}
                    />
                  )}

                  {/* Identity */}
                  {this.state.formIdentityVisible && (
                    <FormIdentity
                      type={'view'}
                      employeeData={this.state.rawData[this.state.selectedIndex]}
                      onClickSave={(data) => this.updateEmployee(data)}
                      onClickClose={this.openEmployeeDetailView}
                      bizparReligion={this.state.bizparReligion}
                      bizparMarital={this.state.bizparMarital}
                      bizparEducation={this.state.bizparEducation}
                      bizparBlood={this.state.bizparBlood} />
                  )}

                  {/* Address */}
                  {this.state.formAddressVisible && (
                    <FormAddressEmployee
                      type={'view'}
                      employeeData={this.state.rawData[this.state.selectedIndex]}
                    />
                  )}

                  {/* Family */}
                  {this.state.formFamilyVisible && (
                    <FormFamilyEmployee
                      type={'view'}
                      employeeData={this.state.rawData[this.state.selectedIndex]} />
                  )}

                  {/* Formal Education */}
                  {this.state.formFormalEducationVisible && (
                    <FormFormalEducationEmployee
                      type={'view'}
                      employeeData={this.state.rawData[this.state.selectedIndex]} />
                  )}

                  {/* Informal Education */}
                  {this.state.formInformalEducationVisible && (
                    <FormInformalEducationEmployee
                      type={'view'}
                      employeeData={this.state.rawData[this.state.selectedIndex]} />
                  )}

                  {/* Work Experience */}
                  {this.state.formWorkExperienceVisible && (
                    <FormWorkExpEmployee
                      type={'view'}
                      employeeData={this.state.rawData[this.state.selectedIndex]} />
                  )}

                  {/* Language Skill */}
                  {this.state.formLanguageSkillVisible && (
                    <FormLanguageSkillEmployee
                      type={'view'}
                      employeeData={this.state.rawData[this.state.selectedIndex]} />
                  )}

                  {/* Organization Experience */}
                  {this.state.formOrgExperienceVisible && (
                    <FormOrgExpEmployee
                      type={'view'}
                      employeeData={this.state.rawData[this.state.selectedIndex]} />
                  )}

                  {/* Ability */}
                  {this.state.formAbilityVisible && (
                    <FormAbilityEmployee
                      type={'view'}
                      employeeData={this.state.rawData[this.state.selectedIndex]} />
                  )}

                  {/* Deficiency */}
                  {this.state.formDeficiencyVisible && (
                    <FormDeficiencyEmployee
                      type={'view'}
                      employeeData={this.state.rawData[this.state.selectedIndex]} />
                  )}

                  {/* Reference */}
                  {this.state.formReferenceVisible && (
                    <FormReferenceEmployee
                      type={'view'}
                      employeeData={this.state.rawData[this.state.selectedIndex]} />
                  )}

                  {/* Emergency Contact */}
                  {this.state.formEmergencyContactVisible && (
                    <FormEmergencyContactEmployee
                      type={'view'}
                      employeeData={this.state.rawData[this.state.selectedIndex]} />
                  )}

                  {/* Card */}
                  {this.state.formCardVisible && (
                    <FormCardEmployee
                      type={'view'}
                      employeeData={this.state.rawData[this.state.selectedIndex]} />
                  )}

                  {/* Document */}
                  {this.state.formDocumentVisible && (
                    <FormDocumentEmployee
                      type={'view'}
                      employeeData={this.state.rawData[this.state.selectedIndex]}
                      bizparDocument={this.state.bizparDocument}
                    />
                  )}

                  {/* Social Media */}
                  {this.state.formSocialMediaVisible && (
                    <FormSocialMediaEmployee
                      type={'view'}
                      employeeData={this.state.rawData[this.state.selectedIndex]}
                      bizparSocialMedia={this.state.bizparSocialMedia}
                    />
                  )}

                  {/* Insurance */}
                  {this.state.formInsuranceBPJSVisible && (
                    <FormInsuranceBPJS
                      type={'view'}
                      employeeData={this.state.rawData[this.state.selectedIndex]}
                      bizparInsuranceCategory={this.state.bizparInsuranceCategory}
                      bizparInsuranceType={this.state.bizparInsuranceType}
                      bizparFamilyFaskes={this.state.bizparFamilyFaskes}
                      bizparFamilyFaskesClass={this.state.bizparFamilyFaskesClass}
                      backToPage={this.openEmployeeDetailUpdate}
                    />
                  )}

                  {/* Payment Method */}
                  {this.state.formPaymentMethod && (
                    <FormPaymentMethod
                      type={'view'}
                      employeeData={this.state.rawData[this.state.selectedIndex]}
                      bizparPaymentMethod={this.state.bizparPaymentMethod}
                      bizparCurrency={this.state.bizparCurrency}
                      bizparBank={this.state.bizparBank}
                      bizparThrBase={this.state.bizparThrBase}
                      backToPage={this.openEmployeeDetailUpdate}
                    />
                  )}
                  {/* Facilities */}
                  {this.state.formFacilites && (
                    <FormFacilities
                      type={'view'}
                      employeeData={this.state.rawData[this.state.selectedIndex]}
                      bizparFacilityCategory={this.state.bizparFacilityCategory}
                      bizparFacilityType={this.state.bizparFacilityType}
                      backToPage={this.openEmployeeDetailUpdate}
                    />
                  )}

                  {/* Training & Certificate */}
                  {this.state.formTrainingCertificateVisible && (
                    <FormTrainingCertificate
                      type={'view'}
                      employeeID={this.state.rawData[this.state.selectedIndex].employeeID}
                      backToPage={this.openEmployeeDetailUpdate}
                    />
                  )}

                  {/* Violation */}
                  {this.state.formViolationVisible && (
                    <FormViolation
                      type={'view'}
                      employeeID={this.state.rawData[this.state.selectedIndex].employeeID}
                      backToPage={this.openEmployeeDetailUpdate}
                    />
                  )}

                  {/* Appreciation */}
                  {this.state.formAppreciationVisible && (
                    <FormAppreciation
                      type={'view'}
                      employeeData={this.state.rawData[this.state.selectedIndex]}
                      bizparAppreciationType={this.state.bizparAppreciationType}
                      backToPage={this.openEmployeeDetailUpdate}
                    />
                  )}

                </div>
              </div>
            </div>
          </div>
        )}

        {this.state.reportVisible && this.renderDocument()}

        <PopUp type={'upload'} class={this.state.uploadClass} onClick={this.openUploadPopUp} file={this.state.file} title={'Employee - Upload Form'} onChange={this.handleChange} removeChange={this.removeChange} />
        <PopUp type={"save"} class={this.state.saveClass} onClick={this.openSavePopUp} />
        <PopUp type={"delete"} class={this.state.deleteClass} onClick={this.openDeletePopup} />

      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    employee: state.employee,
    auth: state.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getEmployee: obj => dispatch(EmployeeAction.getEmployee(obj)),
    getEmployeeName: obj => dispatch(EmployeeAction.getEmployeeName(obj)),
    authLogout: () => dispatch(AuthAction.authLogout())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(employeeManagement);