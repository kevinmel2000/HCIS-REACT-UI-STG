import React, { Component } from "react";
import { Redirect } from 'react-router-dom'
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import LoadingBar from "react-top-loading-bar";
import PopUp from "../../pages/PopUpAlert";
import FormApplicantData from "../../../modules/formsRecApplicant/formApplicantData";
import FormIdentity from "../../../modules/formsRecApplicant/formIdentity";
import FormAddressApplicant from "../../../modules/formsRecApplicant/formAddressApplicant";
import FormFamilyApplicant from "../../../modules/formsRecApplicant/formFamilyApplicant";
import FormEmergencyContactApplicant from "../../../modules/formsRecApplicant/formEmergencyContactApplicant";
import FormSocialMediaApplicant from "../../../modules/formsRecApplicant/formSocialMediaApplicant";
import FormDocumentApplicant from "../../../modules/formsRecApplicant/formDocumentApplicant";
import FormFormalEdu from "../../../modules/formsRecApplicant/formFormalEducationApplicant";
import FormInformalEdu from "../../../modules/formsRecApplicant/formInformalEducationApplicant";
import FormLanguageSkillApplicant from '../../../modules/formsRecApplicant/formLanguageSkillApplicant'
import FormWorkExperienceApplicant from '../../../modules/formsRecApplicant/formWorkExperienceApplicant'
import FormAbilityApplicant from '../../../modules/formsRecApplicant/formAbilityApplicant'
import FormOrgExperienceApplicant from '../../../modules/formsRecApplicant/formOrgExperienceApplicant'
import FormDeficiencyApplicant from '../../../modules/formsRecApplicant/formDeficiencyApplicant'
import FormReferenceApplicant from '../../../modules/formsRecApplicant/formReferenceApplicant'
import FormSeachRec from '../../../modules/formsRecApplicant/formSearchRec';
import API from '../../../Services/Api'
import RecruitmentAction from '../../../Redux/RecruitmentRedux'
import { connect } from 'react-redux';
import * as R from 'ramda';
import M from 'moment';
import { parseApplicantData } from '../../../Services/Utils';
import DropDown from '../../../modules/popup/DropDown';
import CalendarPicker from '../../../modules/popup/Calendar';
import Dropzone from 'react-dropzone'
import AuthAction from '../../../Redux/AuthRedux'
import IdleTimer from 'react-idle-timer'
import WebsocketNotif from '../../../modules/popup/WebsocketNotif'
import Stomp from 'stompjs'
import Loader from 'react-loader-spinner'

var ct = require("../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();
const date = new Date();
const year = date.getFullYear();

class Applicant extends Component {
  constructor() {
    super();
    this.state = {
      type: "create",
      file: null,
      uploadVisible: false,
      createVisible: false,
      createClass: "app-popup",
      saveClass: "app-popup",
      deleteClass: "app-popup",
      dataTable: [],
      rawData: [],
      bizparDocument: [],
      bizparSocialMedia: [],
      bizparGender: [],
      bizparNationality: [],
      bizparReligion: [],
      bizparMaritalStatus: [],
      bizparEduLvl: [],
      bizparBloodType: [],
      applicantData: this.defaultApplicant,
      fetching: false,
      refreshing: false,
      record: '',
      dataRecruitment: '',
      imageUrl: '',
      loading: false,
      notifVisible: false,
      message: "",
      isWeb: false,
      payloadAwal: [],
      sendState: "",
      payload: [],
      formSearchRecVisible: false,
      formApplicantDetailViewVisible: false,
      formApplicantDetailUpdateVisible: false,
      formApplicantDataVisible: false,
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
      formDocumentVisible: false,
      formSocialMediaVisible: false,
      activeTab: "",
      tabMenu: [
        'Applicant Data',
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
        'Document',
        'Social Media',
      ],
      applicantCount: 0,
      table_limit: 5,
      table_page: 0,
      table_query: "",
      timeout: 1000 * 100 * 9,
      isTimedOut: false
    }
    this.idleTimer = null
    this.handleChange = this.handleChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  defaultApplicant = {
    "applicantNumber": "A-" + Date.now(),
    "applicantName": "",
    "applicantBirthPlace": "",
    "applicantBirthDate": "",
    "applicantKTPNumber": "",
    "applicantNPWPNumber": "",
    "applicantHandphoneNumber": "",
    "applicantEmail": "",
    "applicantKKNumber": "",
    "recruitmentRequestID": "",
    "applicantGender": "",
    "applicantNationality": "",
    "applicantStatus": "APPROVED",
    "recordID": ""
  }

  connectWebsocket(method, type) {
    // console.log(method)
    // if (method === 'put/') {
    //   this.setState({
    //     isWeb: !this.state.isWeb,
    //   }, () => this.state.isWeb === true ? this.handleUpdate(this.state.payloadAwal) : {})
    // }
    // setTimeout(() => {
    //   this.setState({
    //     createVisible: false, sendState: ""
    //   })
    // }, 3000);
    let stompClient = Stomp.client(process.env.REACT_APP_HCIS_WEBSOCKET);
    let employeeID = this.props.auth.user.employeeID
    stompClient.debug = null;
    stompClient.connect({}, (frame) => {
      console.log('Connected: ' + frame)
      stompClient.subscribe('/topic/applicant/' + method + employeeID,
        (message) => {
          let res = JSON.parse(message.body)
          console.log('messages: ' + res.messages)
          this.getData(0, 5)
          if (method === 'post/') {
            this.setState({
              notifVisible: true, message: res.messages, createVisible: false,
            })
          } else if (method === 'put/') {
            setTimeout(() => {
              this.setState({ sendState: "finished" }, () => {
                setTimeout(() => {
                  this.setState({
                    notifVisible: true, message: res.messages,
                    formApplicantDetailUpdateVisible: false,
                    createVisible: false,
                    formApplicantDataVisible: false,
                    formIdentityVisible: false,
                    isWeb: true
                  })
                }, 500);
              })
            }, 500);
          } else if (type === 'foto') {
            this.setState({ notifVisible: true, message: res.messages, })
          }
          else {
            this.setState({
              notifVisible: true, message: res.messages, createVisible: false, formApplicantDetailUpdateVisible: false,
            })
          }
          setTimeout(() => {
            this.setState({
              notifVisible: false, message: res.messages, applicantData: this.defaultApplicant, dataRecruitment: '', sendState: ""
            })
          }, 4000);
        })
    })
  }

  closeNotif() {
    this.setState({ notifVisible: false })
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

  addRecruitmentHandler(value, rawDataRecruiment) {
    let selectedRecruitment = rawDataRecruiment[value]
    this.setState({ dataRecruitment: selectedRecruitment.recruitmentRequestID, record: selectedRecruitment.recordID, formSearchRecVisible: !this.state.formSearchRecVisible })
  }

  handleChange(event) {
    this.setState({
      file: URL.createObjectURL(event.target.files[0])
    });
  }

  handleDelete() {
    this.deleteApplicant()
  }

  async handleUpdate(payload) {
    this.setState({ sendState: "loading", payloadAwal: payload })
    payload = parseApplicantData(payload)
    payload = {
      ...payload,
      "updatedBy": this.props.auth.user.employeeID
    }
    this.connectWebsocket('put/')
    API.create('RECRUITMENT').updateApplicant(payload).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            this.openSavePopUp()
            this.setState({ payload })
          } else {
            alert("Failed: " + res.data.message)
          }
        } else {
          alert("Failed.")
        }
      })
  }

  removeChange = () => {
    this.setState({
      file: null
    });
  };

  openUpload = () => {
    this.setState({ uploadVisible: !this.state.uploadVisible })
  };

  openCreateForm = () => {
    this.setState({ createVisible: !this.state.createVisible })
  };

  openApplicantDetailView = (index) => {
    let { formApplicantDetailViewVisible } = this.state
    this.setState({
      formApplicantDetailViewVisible: !formApplicantDetailViewVisible,
      selectedIndex: !formApplicantDetailViewVisible ? index : null,
      imageUrl: "",
      activeTab: !formApplicantDetailViewVisible ? "Applicant Data" : "",
      formApplicantDataVisible: !formApplicantDetailViewVisible ? true : false,
      formReferenceVisible: false,
      formIdentityVisible: false,
      formAddressVisible: false,
      formFamilyVisible: false,
      formFormalEducationVisible: false,
      formInformalEducationVisible: false,
      formWorkExperienceVisible: false,
      formLanguageSkillVisible: false,
      formOrgExperienceVisible: false,
      formDeficiencyVisible: false,
      formAbilityVisible: false,
      formDocumentVisible: false,
      formEmergencyContactVisible: false,
      formSocialMediaVisible: false,
    })
    this.getImage(index)
  };

  openApplicantDetailUpdate = (index) => {
    let { formApplicantDetailUpdateVisible } = this.state
    this.setState({
      formApplicantDetailUpdateVisible: !formApplicantDetailUpdateVisible,
      selectedIndex: !formApplicantDetailUpdateVisible ? index : null,
      imageUrl: "",
      activeTab: !formApplicantDetailUpdateVisible ? "Applicant Data" : "",
      formApplicantDataVisible: !formApplicantDetailUpdateVisible ? true : false,
      formReferenceVisible: false,
      formIdentityVisible: false,
      formAddressVisible: false,
      formFamilyVisible: false,
      formFormalEducationVisible: false,
      formInformalEducationVisible: false,
      formWorkExperienceVisible: false,
      formLanguageSkillVisible: false,
      formOrgExperienceVisible: false,
      formDeficiencyVisible: false,
      formAbilityVisible: false,
      formDocumentVisible: false,
      formEmergencyContactVisible: false,
      formSocialMediaVisible: false,
    })
    this.getImage(index)
  };

  openSearch() {
    this.setState({ formSearchRecVisible: !this.state.formSearchRecVisible })
  }

  openSavePopUp = () => {
    if ((this.state.saveClass === "app-popup app-popup-show" && this.state.formApplicantDetailUpdateVisible) || (this.state.saveClass === "app-popup app-popup-show")) {
      this.setState({
        dataTable: [],
        saveClass: "app-popup",
        formApplicantDetailUpdateVisible: false,
        createVisible: false,
        formApplicantDataVisible: false,
        formIdentityVisible: false
      });
      this.getData(this.state.table_page, this.state.table_limit)
    } else {
      this.setState({ saveClass: "app-popup app-popup-show" });
    }
  };

  openDeletePopup = (index) => {
    if (this.state.deleteClass === "app-popup app-popup-show") {
      this.setState({ deleteClass: "app-popup", selectedIndex: null });
    } else {
      this.setState({ deleteClass: "app-popup app-popup-show", selectedIndex: index });
    }
  };

  getData = (page, limit) => {
    this.props.getApplicantName({
      "params": {
        "applicantName": this.state.table_query
      },
      "offset": page,
      "limit": limit
    });
    this.getCountPage()
  }

  getCountPage = async () => {
    if (!R.isEmpty(this.state.table_query)) {
      let response = await API.create('RECRUITMENT_QUERY').getCountApplicantName(this.state.table_query)
      if (response.ok) {
        this.setState({ applicantCount: response.data.data })
      }
    } else {
      let res = await API.create('RECRUITMENT_QUERY').getCountApplicant()
      this.setState({ applicantCount: res.data.data })
    }
  }

  componentDidMount() {
    if (!R.isNil(this.props.auth.user)) {
      this.startFetch();
      this.getData(this.state.table_page, this.state.table_limit)
      this.getBizparGender();
      this.getBizparNationality();
      this.getBizparReligion();
      this.getBizparMaritalStatus();
      this.getBizparEduLvl();
      this.getBizparBloodType();
      this.getBizparDocument();
      this.getBizparSocialMedia();
    }
  }

  componentDidUpdate(prevProps) {
		if (this.props.data !== prevProps.data) this.setState({ dataTable: this.props.data })
	}

  componentWillReceiveProps(newProps) {
    if (!newProps.recruitment.fetching && !R.isNil(newProps.recruitment.applicantName)) {
      this.onFinishFetch()
      let dataTable = newProps.recruitment.applicantName.map((value, index) => {
        console.log(value)
        if (value === null) {
          return []
        } else {
          const { applicantNumber, applicantName, applicantBirthPlace, applicantBirthDate, applicantGender, applicantHandphoneNumber, applicantNPWPNumber, applicantKTPNumber, applicantEmail } = value;
          return [
            // index += (1 + (this.state.table_page * this.state.table_limit)),
            applicantNumber,
            applicantName,
            applicantBirthPlace,
            applicantBirthDate,
            applicantGender ? applicantGender.bizparValue : "",
            applicantHandphoneNumber,
            applicantNPWPNumber,
            applicantKTPNumber,
            applicantBirthDate ? year - applicantBirthDate.split("-")[2] : "",
            applicantEmail
          ]
        }
      })

      this.setState({
        rawData: newProps.recruitment.applicantName,
        dataTable
      })
    } else {
      this.onFinishFetch()
    }

    this.setState({
      fetching: newProps.recruitment.fetching,
      refreshing: newProps.recruitment.fetching
    });
  }

  deleteApplicant() {
    let payload = {
      applicantNumber: this.state.rawData[this.state.selectedIndex].applicantNumber,
      updatedBy: this.props.auth.user.employeeID
    }
    this.connectWebsocket('delete/')
    API.create('RECRUITMENT').deleteApplicant(payload).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            this.setState({ deleteClass: 'app-popup', dataTable: [] })
            this.getData(this.state.table_page, this.state.table_limit)
          } else {
            alert("Failed: " + res.data.message)
          }
        } else {
          alert("Failed.")
        }
      })
  }

  async postApplicant() {
    let payload = {
      ...this.state.applicantData,
      "applicantNumber": "A-" + Date.now(),
      "applicantName": this.state.applicantData.applicantName,
      "applicantBirthPlace": this.state.applicantData.applicantBirthPlace,
      "applicantBirthDate": this.state.applicantData.applicantBirthDate,
      "recruitmentRequestID": this.state.dataRecruitment,
      "applicantGender": this.state.applicantData.applicantGender.bizparKey,
      "applicantNationality": this.state.applicantData.applicantNationality.bizparKey,
      "applicantKTPNumber": this.state.applicantData.applicantKTPNumber,
      "applicantNPWPNumber": this.state.applicantData.applicantNPWPNumber,
      "applicantHandphoneNumber": this.state.applicantData.applicantHandphoneNumber,
      "applicantEmail": this.state.applicantData.applicantEmail,
      "recordID": this.state.record,
      "createdBy": this.props.auth.user.employeeID
    }
    this.connectWebsocket('post/')
    API.create('RECRUITMENT').postApplicant(payload).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            this.openSavePopUp()
            this.setState({
              applicantData: this.defaultApplicant, dataRecruitment: '',
              createVisible: false
            })
            this.getData(this.state.table_page, this.state.table_limit)
          } else {
            alert('Failed: ' + res.data.message)
          }
        } else {
          alert('Failed.')
        }
      })
  }

  async getBizparGender() {
    let payloadGender = {
      params: {
        bizparCategory: "GENDER_TYPE"
      },
      offset: 0,
      limit: 2
    }
    API.create('BIZPAR').getBizparByCategory(payloadGender).then(
      (res) => {
        if (res.status === 200) {
          console.log(res.data);
          if (res.data.status === 'S') {
            this.setState({
              bizparGender: res.data.data
            })
          }
        }
      }
    )
  }

  async getBizparDocument() {
    let payloadDocument = {
      params: {
        bizparCategory: "DOCUMENT_TYPE"
      },
      offset: 0,
      limit: 20
    }
    API.create('BIZPAR').getBizparByCategory(payloadDocument).then(
      (res) => {
        if (res.status === 200) {
          console.log(res.data);
          if (res.data.status === 'S') {
            this.setState({
              bizparDocument: res.data.data
            })
          }
        }
      }
    )
  }

  async getBizparSocialMedia() {
    let payloadSocialMedia = {
      params: {
        bizparCategory: "SOCIAL_MEDIA"
      },
      offset: 0,
      limit: 2
    }
    API.create('BIZPAR').getBizparByCategory(payloadSocialMedia).then(
      (res) => {
        if (res.status === 200) {
          console.log(res.data);
          if (res.data.status === 'S') {
            this.setState({
              bizparSocialMedia: res.data.data
            })
          }
        }
      }
    )
  }

  async getBizparNationality() {
    let payloadNationality = {
      params: {
        bizparCategory: "NATIONALITY_TYPE"
      },
      offset: 0,
      limit: 2
    }
    API.create('BIZPAR').getBizparByCategory(payloadNationality).then(
      (res) => {
        if (res.status === 200) {
          console.log(res.data);
          if (res.data.status === 'S') {
            this.setState({
              bizparNationality: res.data.data
            })
          }
        }
      }
    )
  }

  async getBizparReligion() {
    let payloadReligion = {
      params: {
        bizparCategory: "RELIGION_TYPE"
      },
      offset: 0,
      limit: 10
    }
    API.create('BIZPAR').getBizparByCategory(payloadReligion).then(
      (res) => {
        if (res.status === 200) {
          console.log(res.data);
          if (res.data.status === 'S') {
            this.setState({
              bizparReligion: res.data.data
            })
          }
        }
      }
    )
  }

  async getBizparMaritalStatus() {
    let payloadMarital = {
      params: {
        bizparCategory: "MARITAL_STATUS"
      },
      offset: 0,
      limit: 10
    }
    API.create('BIZPAR').getBizparByCategory(payloadMarital).then(
      (res) => {
        if (res.status === 200) {
          console.log(res.data);
          if (res.data.status === 'S') {
            this.setState({
              bizparMaritalStatus: res.data.data
            })
          }
        }
      }
    )
  }

  async getBizparEduLvl() {
    let payloadEdu = {
      params: {
        bizparCategory: "EDUCATION_LEVEL"
      },
      offset: 0,
      limit: 15
    }
    API.create('BIZPAR').getBizparByCategory(payloadEdu).then(
      (res) => {
        if (res.status === 200) {
          console.log(res.data);
          if (res.data.status === 'S') {
            this.setState({
              bizparEduLvl: res.data.data
            })
          }
        }
      }
    )
  }

  async getBizparBloodType() {
    let payloadBlood = {
      params: {
        bizparCategory: "BLOOD_TYPE"
      },
      offset: 0,
      limit: 10
    }
    API.create('BIZPAR').getBizparByCategory(payloadBlood).then(
      (res) => {
        if (res.status === 200) {
          console.log(res.data);
          if (res.data.status === 'S') {
            this.setState({
              bizparBloodType: res.data.data
            })
          }
        }
      }
    )
  }

  startFetch = () => {
    this.LoadingBar.continousStart();
  };

  onFinishFetch = () => {
    console.log(this.state.message)
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
    if (this.state.message !== "") {
      this.setState({ notifVisible: true })
      setTimeout(
        function () {
          this.setState({ notifVisible: false, message: "" })
        }.bind(this), 3000)
    }
  };

  getImage(index) {
    if (index >= 0) {
      let applicantData = this.state.rawData[index]
      if (applicantData) {
        this.getImageBlob(applicantData.applicantNumber)
      }
    }
  }

  async getImageBlob(id) {
    this.setState({ loading: true, imageUrl: '' })
    let response = await fetch(process.env.REACT_APP_HCIS_BE_API + 'recruitmentcmd/api/applicant.photo.get/' + id, {
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
  }

  async onDrop(acceptedFiles) {
    this.connectWebsocket('post.applicant.photo.image/', 'foto')
    const formData = new FormData();
    let length = acceptedFiles[0].name.split(".").length
    let fileType = acceptedFiles[0].name.split(".")[length - 1]
    let applicantData = this.state.rawData[this.state.selectedIndex]
    formData.append('file', acceptedFiles[0])
    formData.append('applicantNumber', applicantData.applicantNumber)
    formData.append("updatedBy", this.props.auth.user.employeeID);
    formData.append("updatedDate", M().format("DD-MM-YYYY HH:mm:ss"))
    if (fileType === "jpg" || fileType === "jpeg" || fileType === "png") {
      let response = await API.create('RECRUITMENT').applicantPhotoPost(formData)
      if (!response.ok && response.status === 413) alert("Your Image Too Large, Please Select Another Image")
      if (!response.ok && R.isNil(response.status)) alert(response.problem)

      switch (response.data.status) {
        case "S":
          this.setState({ imageUrl: "" }, () => {
            this.getImageBlob(applicantData.applicantNumber)
          })
          break;
        default:
          break;
      }
    } else {
      alert("Unsupported Media Type")
    }
  }


  columns = [
    "Applicant Number",
    "Name",
    "Birth Place",
    "Date of Birth",
    "Gender",
    "Phone Number",
    "NPWP",
    "KTP Number",
    "Age",
    "Email Address",
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div className="grid grid-3x">
              <div className="col-1">
                <button
                  className="btnAct"
                  style={{ marginRight: 15, backgroundColor: 'transparent' }}
                  onClick={() => this.openApplicantDetailUpdate(tableMeta.rowIndex)}>
                  <i className="fa fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                </button>
              </div>
              <div className="col-2">
                <button
                  className="btnAct"
                  style={{ marginRight: 15, backgroundColor: 'transparent' }}
                  onClick={() => this.openDeletePopup(tableMeta.rowIndex)}>
                  <i className="fa fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                </button>
              </div>
              <div className="col-3">
                <button
                  className="btnAct"
                  style={{ backgroundColor: 'transparent' }}
                  onClick={() => this.openApplicantDetailView(tableMeta.rowIndex)}>
                  <i className="fa fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                </button>
              </div>
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

    let allStateVisibleFalse = {
      ...this.state,
      formApplicantDataVisible: false,
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
      formDocumentVisible: false,
      formSocialMediaVisible: false,
      activeTab: title
    }

    switch (title) {
      case "Applicant Data":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formApplicantDataVisible: true
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
      default:
        break;
    }
    this.setState(allStateVisibleFalse);
  };

  renderUploadForm = () => {
    return (
      <div className="app-popup app-popup-show">
        <div className="popup-content-mikro background-white border-radius post-center">
          <div className="padding-15px background-white border-bottom grid grid-2x">
            <div className="col-1">
              <div className="txt-site txt-12 txt-bold post-center">
                Applicant - Upload Form
              </div>
            </div>
            <div className="col-2 content-right">
              <button
                className="btn btn-circle btn-grey"
                onClick={this.openUpload}
              >
                <i className="fa fa-lg fa-times" />
              </button>
            </div>
          </div>

          <div className="padding-15px background-grey">
            <input
              type="file"
              id="upload-image"
              style={{ display: "none" }}
              onChange={this.handleChange}
            />

            <input
              type="file"
              id="upload-image"
              style={{ display: "none" }}
              onChange={this.handleChange}
            />

            <div className="upload-image">
              <div className="u-i-info">
                <div className="u-i-icon">
                  <i className="fa fa-lg fa-images" />
                </div>
                <div className="u-i-label">Upload a file</div>
              </div>

              <div
                className="u-i-image image image-all"
                style={{ backgroundImage: "url(" + this.state.file + ")" }}
              >
                <div className="u-i-btn">
                  <label htmlFor="upload-image">
                    <div className="btn btn-circle-div btn-green border-all">
                      <i className="fa fa-lg fa-plus" />
                    </div>
                  </label>
                  <button
                    onClick={this.removeChange}
                    type="button"
                    className="btn btn-circle btn-red border-all"
                  >
                    <i className="fa fa-lg fa-trash-alt" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid margin-top-15px">
              <div className="content-right">
                <button className="btn background-blue">Submit</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderCreateForm = () => {
    return (
      <div className="app-popup app-popup-show">
        <div className="padding-top-20px" />
        <div className="popup-content background-white border-radius">
          <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="popup-title">
                Applicant - Create Form
              </div>
            </div>
            <div className="col-2 content-right">
              <button
                className="btn btn-circle btn-grey"
                onClick={this.openCreateForm}
              >
                <i className="fa fa-lg fa-times" />
              </button>
            </div>
          </div>
          <form action="#" onSubmit={(e) => {
            e.preventDefault()
            if (R.isEmpty(this.state.dataRecruitment)) return alert("Recruitment Request is Required.")
            if (R.isEmpty(this.state.applicantData.applicantBirthDate)) return alert("Date of Birth is Required.")
            if (R.isEmpty(this.state.applicantData.applicantGender) || R.isEmpty(this.state.applicantData.applicantGender.bizparKey)) return alert("Gender is Required.")
            if (R.isEmpty(this.state.applicantData.applicantNationality) || R.isEmpty(this.state.applicantData.applicantNationality.bizparKey)) return alert("Citizenship is Required.")
            if (this.state.applicantData.applicantKTPNumber.length < 16) return alert("KTP Number Must be 16 Digit.")
            if (this.state.applicantData.applicantNPWPNumber.length < 15) return alert("NPWP Number Must be 15 Digit.")
            else this.postApplicant()
          }}>
            <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-20px">
              <div className="column-1">
                <div className="card-date-picker" style={{ marginBottom: 17 }}>
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Recruitment Request <span style={{ color: "red" }}>*</span></h4>
                    </div>
                  </div>
                  <div className='double'>
                    <input
                      value={this.state.dataRecruitment}
                      readOnly
                      type="text"
                      className="input"
                      style={{ backgroundColor: '#E6E6E6', padding: 15 }}
                      placeholder=""
                      required
                    />
                    <button type="button" className="btn btn-grey border-left btn-no-radius" onClick={this.openSearch.bind(this)}>
                      <i className="fa fa-lg fa-search"></i>
                    </button>
                  </div>
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Full Name (KTP) <span style={{ color: "red" }}>*</span></h4>
                    </div>
                  </div>
                  <input
                    onChange={(e) => {
                      let applicantData = JSON.stringify(this.state.applicantData)
                      applicantData = JSON.parse(applicantData)
                      applicantData.applicantName = e.target.value
                      this.setState({ applicantData })
                    }}
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Birth Place <span style={{ color: "red" }}>*</span></h4>
                    </div>
                  </div>
                  <input
                    onChange={(e) => {
                      let applicantData = JSON.stringify(this.state.applicantData)
                      applicantData = JSON.parse(applicantData)
                      applicantData.applicantBirthPlace = e.target.value
                      this.setState({ applicantData })
                    }}
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Date of Birth <span style={{ color: "red" }}>*</span></h4>
                    </div>
                  </div>
                  <CalendarPicker onChange={(e) => {
                    let applicantData = JSON.stringify(this.state.applicantData)
                    applicantData = JSON.parse(applicantData)
                    applicantData.applicantBirthDate = M(e).format("DD-MM-YYYY")
                    this.setState({ applicantData })
                  }} />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Gender <span style={{ color: "red" }}>*</span></h4>
                    </div>
                  </div>
                  <DropDown
                    title="-- please select gender --"
                    onChange={(dt) => this.setState({
                      applicantData: {
                        ...this.state.applicantData,
                        applicantGender: {
                          ...this.state.applicantData.applicantGender,
                          bizparKey: dt
                        }
                      }
                    })}
                    type="bizpar"
                    data={this.state.bizparGender} />
                </div>
              </div>
              <div className="column-2">
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Citizenship <span style={{ color: "red" }}>*</span></h4>
                    </div>
                  </div>
                  <DropDown
                    title="-- please select citizenship --"
                    onChange={(dt) => this.setState({
                      applicantData: {
                        ...this.state.applicantData,
                        applicantNationality: {
                          ...this.state.applicantData.applicantNationality,
                          bizparKey: dt
                        }
                      }
                    })}
                    type="bizpar"
                    data={this.state.bizparNationality} />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>KTP Number <span style={{ color: "red" }}>*</span></h4>
                    </div>
                  </div>
                  <input
                    onChange={(e) => {
                      if (isNaN(e.target.value)) return true
                      this.setState({
                        applicantData: {
                          ...this.state.applicantData,
                          applicantKTPNumber: e.target.value
                        }
                      })
                    }}
                    maxLength={16}
                    value={this.state.applicantData.applicantKTPNumber}
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>NPWP <span style={{ color: "red" }}>*</span></h4>
                    </div>
                  </div>
                  <input
                    onChange={(e) => {
                      if (isNaN(e.target.value)) return true
                      this.setState({
                        applicantData: {
                          ...this.state.applicantData,
                          applicantNPWPNumber: e.target.value
                        }
                      })
                    }}
                    maxLength={15}
                    value={this.state.applicantData.applicantNPWPNumber}
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Phone Number <span style={{ color: "red" }}>*</span></h4>
                    </div>
                  </div>
                  <input
                    onChange={(e) => {
                      if (isNaN(e.target.value)) return true
                      this.setState({
                        applicantData: {
                          ...this.state.applicantData,
                          applicantHandphoneNumber: e.target.value
                        }
                      })
                    }}
                    value={this.state.applicantData.applicantHandphoneNumber}
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Email Address <span style={{ color: "red" }}>*</span></h4>
                    </div>
                  </div>
                  <input
                    onChange={(e) => {
                      let applicantData = JSON.stringify(this.state.applicantData)
                      applicantData = JSON.parse(applicantData)
                      applicantData.applicantEmail = e.target.value
                      this.setState({ applicantData })
                    }}
                    type="email"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                  />
                </div>
              </div>
            </div>
            <div className="padding-15px">
              <div className="grid grid-2x">
                <div className="col-1" />
                <div className="col-2 content-right">
                  <button
                    style={{ marginLeft: "15px" }}
                    className="btn btn-blue"
                    type="submit"
                  >
                    <span>SAVE</span>
                  </button>
                  <button
                    style={{ marginLeft: "15px" }}
                    className="btn btn-primary"
                    type="button"
                    onClick={this.openCreateForm}
                  >
                    <span>CLOSE</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="padding-bottom-20px" />
      </div>
    )
  }

  render() {
    if (R.isNil(this.props.auth.user)) return <Redirect to={{ pathname: "/" }} ></Redirect>
    let { applicantCount, table_query } = this.state
    let tableOptions = {
      ...options,
      serverSide: true,
      count: applicantCount,
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
        <IdleTimer
          ref={ref => { this.idleTimer = ref }}
          element={document}
          onActive={this.onActive.bind(this)}
          onIdle={this.onIdle.bind(this)}
          onAction={this.onAction.bind(this)}
          debounce={250}
          timeout={this.state.timeout} />

        <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
        <div className="padding-5px grid grid-2x">
          <div className="col-1">
            <div className="txt-site txt-18 txt-bold txt-main padding-top-5px">
              {/* APPLICANT */}
            </div>
          </div>
          <div className="col-2 content-right">
            <button
              type="button"
              className="btn btn-circle background-blue"
              style={{ marginRight: 5 }}
              onClick={this.openCreateForm}
            >
              <i className="fa fa-1x fa-plus" />
            </button>
            <button
              type="button"
              className="btn btn-circle background-blue"
              style={{ marginRight: 5 }}
              onClick={this.openUpload}
            >
              <i className="fa fa-1x fa-upload" />
            </button>
            <button type="button" className="btn btn-circle background-blue">
              <i className="fa fa-1x fa-download" />
            </button>
          </div>
        </div>

        <div className="padding-5px">
          <MuiThemeProvider theme={getMuiTheme()}>
            <MUIDataTable
              key={applicantCount}
              title={'Applicant'}
              subtitle={'lorem ipsum dolor'}
              data={this.state.dataTable}
              columns={this.columns}
              options={tableOptions}
            />
          </MuiThemeProvider>
        </div>
        {this.state.notifVisible && (
          <WebsocketNotif message={this.state.message} type={"float"} onClickClose={this.closeNotif.bind(this)}
          />
        )}

        {this.state.uploadVisible ? this.renderUploadForm() : null}

        {this.state.createVisible ? this.renderCreateForm() : null}

        {this.state.formSearchRecVisible && (
          <FormSeachRec
            onClickClose={this.openSearch.bind(this)}
            onClick={this.addRecruitmentHandler.bind(this)}
          />
        )}

        {this.state.formApplicantDetailUpdateVisible && (
          <div className={'app-popup app-popup-show'}>
            <div className="padding-top-20px" />
            <div className="popup-content background-white border-radius">

              <div className="popup-panel grid grid-2x">
                <div className="col-1">
                  <div className="popup-title">
                    Applicant - Edit Form
                </div>
                </div>
                <div className="col-2 content-right">
                  <button
                    className="btn btn-circle btn-grey"
                    onClick={this.openApplicantDetailUpdate}
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
                    {this.state.tabMenu.map((data, index) => { return this.opNavigator(data) })}
                  </ul>
                </div>

                <div className="popup-scroll popup-col-2">
                  {/* APPLICANT DATA */}
                  {this.state.formApplicantDataVisible && (
                    <FormApplicantData
                      sendState={this.state.sendState}
                      type={'update'}
                      applicantData={this.state.rawData[this.state.selectedIndex]}
                      onClickSave={this.handleUpdate.bind(this)}
                      onClickClose={this.openApplicantDetailUpdate}
                      bizparGender={this.state.bizparGender}
                      bizparNationality={this.state.bizparNationality}
                      page={this.state.table_page}
                      limit={this.state.table_limit}
                      name={this.state.table_query}
                    />)}

                  {/* IDENTITY */}
                  {this.state.formIdentityVisible && (
                    <FormIdentity
                      sendState={this.state.sendState}
                      type={'update'}
                      applicantData={this.state.rawData[this.state.selectedIndex]}
                      onClickSave={this.handleUpdate.bind(this)}
                      onClickClose={this.openApplicantDetailUpdate}
                      bizparReligion={this.state.bizparReligion}
                      bizparMaritalStatus={this.state.bizparMaritalStatus}
                      bizparEduLvl={this.state.bizparEduLvl}
                      bizparBloodType={this.state.bizparBloodType}
                    />
                  )}

                  {/* ADDRESS */}
                  {this.state.formAddressVisible && (
                    <FormAddressApplicant
                      type={'update'}
                      applicantData={this.state.rawData[this.state.selectedIndex]}
                      backToPage={this.openApplicantDetailUpdate}
                    />
                  )}

                  {/* FAMILY */}
                  {this.state.formFamilyVisible && (
                    <FormFamilyApplicant
                      sendState={this.state.sendState}
                      type={'update'}
                      onSelect={this.onSelect}
                      applicantData={this.state.rawData[this.state.selectedIndex]}
                      backToPage={this.openApplicantDetailUpdate}
                      page={this.state.table_page}
                      limit={this.state.table_limit}
                      name={this.state.table_query}
                      onFinishFetch={this.onFinishFetch}
                      openSavePopUp={this.openSavePopUp.bind(this)}
                    />
                  )}

                  {/* FORMAL EDUCATION */}
                  {this.state.formFormalEducationVisible && (
                    <FormFormalEdu
                      type='update'
                      sendState={this.state.sendState}
                      onSelect={this.onSelect}
                      applicantData={this.state.rawData[this.state.selectedIndex]}
                      backToPage={this.openApplicantDetailUpdate}
                      page={this.state.table_page}
                      limit={this.state.table_limit}
                      name={this.state.table_query}
                      onFinishFetch={this.onFinishFetch}
                      openSavePopUp={this.openSavePopUp.bind(this)}
                    />
                  )}

                  {/* INFORMAL EDUCATION */}
                  {this.state.formInformalEducationVisible && (
                    <FormInformalEdu
                      type={'update'}
                      onSelect={this.onSelect}
                      applicantData={this.state.rawData[this.state.selectedIndex]}
                      backToPage={this.openApplicantDetailUpdate}
                      page={this.state.table_page}
                      limit={this.state.table_limit}
                      name={this.state.table_query}
                      onFinishFetch={this.onFinishFetch}
                      openSavePopUp={this.openSavePopUp.bind(this)}
                    />
                  )}

                  {/* WORK EXPERIENCE */}
                  {this.state.formWorkExperienceVisible && (
                    <FormWorkExperienceApplicant
                      type={'update'}
                      onSelect={this.onSelect}
                      applicantData={this.state.rawData[this.state.selectedIndex]}
                      backToPage={this.openApplicantDetailUpdate}
                      page={this.state.table_page}
                      limit={this.state.table_limit}
                      name={this.state.table_query}
                      onFinishFetch={this.onFinishFetch}
                      openSavePopUp={this.openSavePopUp.bind(this)}
                    />
                  )}

                  {/* LANGUAGE SKILL */}
                  {this.state.formLanguageSkillVisible && (
                    <FormLanguageSkillApplicant
                      type={'update'}
                      onSelect={this.onSelect}
                      applicantData={this.state.rawData[this.state.selectedIndex]}
                      backToPage={this.openApplicantDetailUpdate}
                      page={this.state.table_page}
                      limit={this.state.table_limit}
                      name={this.state.table_query}
                      onFinishFetch={this.onFinishFetch}
                      openSavePopUp={this.openSavePopUp.bind(this)}
                    />
                  )}

                  {/* ORGANIZATION EXPERIENCE */}
                  {this.state.formOrgExperienceVisible && (
                    <FormOrgExperienceApplicant
                      type={'update'}
                      onSelect={this.onSelect}
                      applicantData={this.state.rawData[this.state.selectedIndex]}
                      backToPage={this.openApplicantDetailUpdate}
                      page={this.state.table_page}
                      limit={this.state.table_limit}
                      name={this.state.table_query}
                      onFinishFetch={this.onFinishFetch}
                      openSavePopUp={this.openSavePopUp.bind(this)}
                    />
                  )}

                  {/* ABILITY */}
                  {this.state.formAbilityVisible && (
                    <FormAbilityApplicant
                      type={'update'}
                      onSelect={this.onSelect}
                      applicantData={this.state.rawData[this.state.selectedIndex]}
                      backToPage={this.openApplicantDetailUpdate}
                      page={this.state.table_page}
                      limit={this.state.table_limit}
                      name={this.state.table_query}
                      onFinishFetch={this.onFinishFetch}
                      openSavePopUp={this.openSavePopUp.bind(this)}
                    />
                  )}

                  {/* DEFICIENCY */}
                  {this.state.formDeficiencyVisible && (
                    <FormDeficiencyApplicant
                      type={'update'}
                      onSelect={this.onSelect}
                      applicantData={this.state.rawData[this.state.selectedIndex]}
                      backToPage={this.openApplicantDetailUpdate}
                      page={this.state.table_page}
                      limit={this.state.table_limit}
                      name={this.state.table_query}
                      onFinishFetch={this.onFinishFetch}
                      openSavePopUp={this.openSavePopUp.bind(this)}
                    />
                  )}

                  {/* REFERENCE */}
                  {this.state.formReferenceVisible && (
                    <FormReferenceApplicant
                      type={'update'}
                      onSelect={this.onSelect}
                      applicantData={this.state.rawData[this.state.selectedIndex]}
                      backToPage={this.openApplicantDetailUpdate}
                      page={this.state.table_page}
                      limit={this.state.table_limit}
                      name={this.state.table_query}
                      onFinishFetch={this.onFinishFetch}
                      openSavePopUp={this.openSavePopUp.bind(this)}
                    />
                  )}

                  {/* EMERGENCY CONTACT */}
                  {this.state.formEmergencyContactVisible && (
                    <FormEmergencyContactApplicant
                      type={'update'}
                      onSelect={this.onSelect}
                      applicantData={this.state.rawData[this.state.selectedIndex]}
                      backToPage={this.openApplicantDetailUpdate}
                      page={this.state.table_page}
                      limit={this.state.table_limit}
                      name={this.state.table_query}
                      onFinishFetch={this.onFinishFetch}
                      openSavePopUp={this.openSavePopUp.bind(this)}
                    />
                  )}

                  {/* DOCUMENT */}
                  {this.state.formDocumentVisible && (
                    <FormDocumentApplicant
                      type={'update'}
                      onSelect={this.onSelect}
                      applicantData={this.state.rawData[this.state.selectedIndex]}
                      bizparDocument={this.state.bizparDocument}
                      backToPage={this.openApplicantDetailUpdate}
                      page={this.state.table_page}
                      limit={this.state.table_limit}
                      name={this.state.table_query}
                      onFinishFetch={this.onFinishFetch}
                      openSavePopUp={this.openSavePopUp.bind(this)}
                    />
                  )}

                  {/* SOCIAL MEDIA */}
                  {this.state.formSocialMediaVisible && (
                    <FormSocialMediaApplicant
                      type={'update'}
                      onSelect={this.onSelect}
                      applicantData={this.state.rawData[this.state.selectedIndex]}
                      bizparSocialMedia={this.state.bizparSocialMedia}
                      backToPage={this.openApplicantDetailUpdate}
                      page={this.state.table_page}
                      limit={this.state.table_limit}
                      name={this.state.table_query}
                      onFinishFetch={this.onFinishFetch}
                      openSavePopUp={this.openSavePopUp.bind(this)}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="padding-bottom-20px" />
          </div>
        )}

        {this.state.formApplicantDetailViewVisible && (
          <div className={'app-popup app-popup-show'}>
            <div className="padding-top-20px" />
            <div className="popup-content background-white border-radius">

              <div className="popup-panel grid grid-2x">
                <div className="col-1">
                  <div className="popup-title">
                    Applicant - View Form
                </div>
                </div>
                <div className="col-2 content-right">
                  <button
                    className="btn btn-circle btn-grey"
                    onClick={this.openApplicantDetailView}
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
                        // backgroundImage: "url("+(this.state.imageUrl !== "") ? this.state.imageUrl : null+")"
                      }}>
                      {this.state.loading && (
                        <Loader
                          type="ThreeDots"
                          style={{display:'flex', justifyContent:'center',marginTop:45}}
                          color={"#somecolor"}
                          height={80}
                          width={80}
                          loading={this.state.loading} />
                      )}
                      {(this.state.imageUrl === "")
                        ? this.state.loading === true ? <i />
                          : (<i className="icn far fa-user fa-3x" />)
                        : (<img src={this.state.imageUrl} alt="img" />)
                      }
                    </div>
                  </div>
                  <ul className="vertical-tab">
                    {this.state.tabMenu.map((data, index) => { return this.opNavigator(data) })}
                  </ul>
                </div>

                <div className="popup-scroll popup-col-2">
                  {/* APPLICANT DATA */}
                  {this.state.formApplicantDataVisible && (
                    <FormApplicantData
                      type={'view'}
                      applicantData={this.state.rawData[this.state.selectedIndex]}
                      onClickSave={this.handleUpdate.bind(this)}
                      onClickClose={this.openApplicantDetailView}
                      bizparGender={this.state.bizparGender}
                      bizparNationality={this.state.bizparNationality}
                    />)}

                  {/* IDENTITY */}
                  {this.state.formIdentityVisible && (
                    <FormIdentity
                      type={'view'}
                      applicantData={this.state.rawData[this.state.selectedIndex]}
                      onClickSave={this.handleUpdate.bind(this)}
                      onClickClose={this.openApplicantDetailView}
                      bizparReligion={this.state.bizparReligion}
                      bizparMaritalStatus={this.state.bizparMaritalStatus}
                      bizparEduLvl={this.state.bizparEduLvl}
                      bizparBloodType={this.state.bizparBloodType}
                    />
                  )}

                  {/* ADDRESS */}
                  {this.state.formAddressVisible && (
                    <FormAddressApplicant
                      type={'view'}
                      applicantData={this.state.rawData[this.state.selectedIndex]}
                    />
                  )}

                  {/* FAMILY */}
                  {this.state.formFamilyVisible && (
                    <FormFamilyApplicant
                      type={'view'}
                      applicantData={this.state.rawData[this.state.selectedIndex]}
                    />
                  )}

                  {/* FORMAL EDUCATION */}
                  {this.state.formFormalEducationVisible && (
                    <FormFormalEdu
                      type={'view'}
                      applicantData={this.state.rawData[this.state.selectedIndex]}
                    />
                  )}

                  {/* INFORMAL EDUCATION */}
                  {this.state.formInformalEducationVisible && (
                    <FormInformalEdu
                      type={'view'}
                      applicantData={this.state.rawData[this.state.selectedIndex]}
                    />
                  )}

                  {/* WORK EXPERIENCE */}
                  {this.state.formWorkExperienceVisible && (
                    <FormWorkExperienceApplicant
                      type={'view'}
                      applicantData={this.state.rawData[this.state.selectedIndex]} />
                  )}

                  {/* LANGUAGE SKILL */}
                  {this.state.formLanguageSkillVisible && (
                    <FormLanguageSkillApplicant
                      type={'view'}
                      applicantData={this.state.rawData[this.state.selectedIndex]} />
                  )}

                  {/* ORGANIZATION EXPERIENCE */}
                  {this.state.formOrgExperienceVisible && (
                    <FormOrgExperienceApplicant
                      type={'view'}
                      applicantData={this.state.rawData[this.state.selectedIndex]} />
                  )}

                  {/* ABILITY */}
                  {this.state.formAbilityVisible && (
                    <FormAbilityApplicant
                      type={'view'}
                      applicantData={this.state.rawData[this.state.selectedIndex]} />
                  )}

                  {/* DEFICIENCY */}
                  {this.state.formDeficiencyVisible && (
                    <FormDeficiencyApplicant
                      type={'view'}
                      applicantData={this.state.rawData[this.state.selectedIndex]} />
                  )}

                  {/* REFERENCE */}
                  {this.state.formReferenceVisible && (
                    <FormReferenceApplicant
                      type={'view'}
                      applicantData={this.state.rawData[this.state.selectedIndex]} />
                  )}

                  {/* EMERGENCY CONTACT */}
                  {this.state.formEmergencyContactVisible && (
                    <FormEmergencyContactApplicant
                      type={'view'}
                      applicantData={this.state.rawData[this.state.selectedIndex]}
                    />
                  )}

                  {/* DOCUMENT */}
                  {this.state.formDocumentVisible && (
                    <FormDocumentApplicant
                      type={'view'}
                      applicantData={this.state.rawData[this.state.selectedIndex]}
                      bizparDocument={this.state.bizparDocument}
                    />
                  )}

                  {/* SOCIAL MEDIA */}
                  {this.state.formSocialMediaVisible && (
                    <FormSocialMediaApplicant
                      type={'view'}
                      applicantData={this.state.rawData[this.state.selectedIndex]}
                      bizparSocialMedia={this.state.bizparSocialMedia}
                    />
                  )}

                </div>
              </div>
            </div>
            <div className="padding-bottom-20px" />
          </div>
        )}

        <PopUp
          type={"save"}
          class={this.state.saveClass}
          onClick={this.openSavePopUp}
        />
        <PopUp
          type={"delete"}
          class={this.state.deleteClass}
          onClick={this.openDeletePopup}
          onClickDelete={this.handleDelete}
        />
      </div>
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
    getApplicant: obj => dispatch(RecruitmentAction.getApplicant(obj)),
    getApplicantName: obj => dispatch(RecruitmentAction.getApplicantName(obj)),
    authLogout: () => dispatch(AuthAction.authLogout())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Applicant);
