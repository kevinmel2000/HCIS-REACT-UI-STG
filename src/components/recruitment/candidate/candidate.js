import React, { Component } from "react"
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import MUIDataTable from "mui-datatables-bitozen"
import LoadingBar from "react-top-loading-bar"
import FormApplicantData from "../../../modules/formsRecApplicant/formApplicantData"
import FormIdentity from "../../../modules/formsRecApplicant/formIdentity"
import FormAddressApplicant from "../../../modules/formsRecApplicant/formAddressApplicant"
import FormFamilyApplicant from "../../../modules/formsRecApplicant/formFamilyApplicant"
import FormEmergencyContactApplicant from "../../../modules/formsRecApplicant/formEmergencyContactApplicant"
import FormSocialMediaApplicant from "../../../modules/formsRecApplicant/formSocialMediaApplicant"
import FormDocumentApplicant from "../../../modules/formsRecApplicant/formDocumentApplicant"
import FormFormalEdu from "../../../modules/formsRecApplicant/formFormalEducationApplicant"
import FormInformalEdu from "../../../modules/formsRecApplicant/formInformalEducationApplicant"
import FormLanguageSkillApplicant from '../../../modules/formsRecApplicant/formLanguageSkillApplicant'
import FormWorkExperienceApplicant from '../../../modules/formsRecApplicant/formWorkExperienceApplicant'
import FormAbilityApplicant from '../../../modules/formsRecApplicant/formAbilityApplicant'
import FormOrgExperienceApplicant from '../../../modules/formsRecApplicant/formOrgExperienceApplicant'
import FormDeficiencyApplicant from '../../../modules/formsRecApplicant/formDeficiencyApplicant'
import FormReferenceApplicant from '../../../modules/formsRecApplicant/formReferenceApplicant'
import API from '../../../Services/Api'
import RecruitmentAction from '../../../Redux/RecruitmentRedux'
import { connect } from 'react-redux'
import * as R from 'ramda'
import { Redirect } from 'react-router-dom'
import AuthAction from '../../../Redux/AuthRedux'
import IdleTimer from 'react-idle-timer'

var ct = require("../../../modules/custom/customTable")
const date = new Date()
const year = date.getFullYear()
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

class Candidate extends Component {
  constructor() {
    super();
    this.state = {
      type: "create",
      file: null,
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
        'Candidate Data',
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
      candidateCount: 0,
      table_limit: 5,
      table_page: 0,
      table_query: "",
      timeout: 1000 * 100 * 9,
      isTimedOut: false
    }
    this.idleTimer = null
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
        this.setState({ candidateCount: response.data.data })
      }
    } else {
      let res = await API.create('RECRUITMENT_QUERY').getCountApplicant()
      this.setState({ candidateCount: res.data.data })
    }
  }

  openApplicantDetailView = (index) => {
    let { formApplicantDetailViewVisible } = this.state
    this.setState({
      formApplicantDetailViewVisible: !formApplicantDetailViewVisible,
      selectedIndex: !formApplicantDetailViewVisible ? index : null,
      activeTab: !formApplicantDetailViewVisible ? "Candidate Data" : "",
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
  };

  openApplicantDetailUpdate = (index) => {
    let { formApplicantDetailUpdateVisible } = this.state
    this.setState({
      formApplicantDetailUpdateVisible: !formApplicantDetailUpdateVisible,
      selectedIndex: !formApplicantDetailUpdateVisible ? index : null,
      activeTab: !formApplicantDetailUpdateVisible ? "Candidate Data" : "",
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
  };

  componentDidMount() {
    if (!R.isNil(this.props.auth.user)) {
      this.startFetch();
      this.getData(this.state.table_page, this.state.table_limit)
      this.props.getApplicant({
        "offset": 0,
        "limit": 150
      });
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

  componentWillReceiveProps(newProps) {
    if (!newProps.recruitment.fetching && !R.isNil(newProps.recruitment.applicantName)) {
      this.onFinishFetch()
      let dataTable = newProps.recruitment.applicantName.map((value, index) => {
        if (value === null) {
          return []
        } else {
          const { applicantNumber, applicantName, applicantStatus, applicantBirthPlace, applicantBirthDate, applicantGender, applicantHandphoneNumber, applicantNPWPNumber, applicantKTPNumber, applicantEmail } = value;
          return [
            applicantNumber,
            applicantName,
            applicantStatus.replace(/_/g," "),
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
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
  };

  columns = [
    "No Candidate",
    "Name",
    {
      name: "Status",
      options: {
        customBodyRender: val => {
          return (
            <div style={{ display: 'flex', justifyContent: 'space-between'}}>
              <div style={{ width: '20%'}}>
                <i
                  className="fa fa-lw fa-circle"
                  style={{
                    color:
                      val === "INITIATE"
                        ? "orange"
                        : val === "APPROVED"
                        ? "brown"
                        : val === "" || val === null
                        ? null
                        : val === "REJECTED"
                        ? "#424242"
                        : "gray",
                  }}
                />
              </div> 
              <div style={{ width: '80%', textAlign: 'center',paddingRight: 5,paddingLeft:10}}>
                {val}
              </div>
            </div>
          );
        }
      }
    },
    "Birth Place",
    "Date of Birth",
    "Gender",
    "Phone Number",
    "NPWP",
    "ID Number",
    "Age",
    "Email Address",
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <button
              type='button'
              className="btnAct"
              onClick={() => this.openApplicantDetailView(tableMeta.rowIndex)}>
               <i className="fa fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }}/>
            </button>
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
      case "Candidate Data":
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

  render() {
    if (R.isNil(this.props.auth.user)) return <Redirect to={{ pathname: "/" }} ></Redirect>
    let { candidateCount, table_query } = this.state
    let tableOptions = {
      ...options,
      download: true,
      downloadOptions: {
        filename: 'data-all-candidate.csv'
      },
      serverSide: true,
      count: candidateCount,
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

        <div className="padding-5px">
          <MuiThemeProvider theme={getMuiTheme()}>
            <MUIDataTable
              key={candidateCount}
              title={'Candidate'}
              subtitle={'lorem ipsum dolor'}
              data={this.state.dataTable}
              columns={this.columns}
              options={tableOptions}
            />
          </MuiThemeProvider>
        </div>

        {this.state.formApplicantDetailViewVisible && (
          <div className={'app-popup app-popup-show'}>
            <div className="padding-top-20px" />
            <div className="popup-content background-white border-radius">

              <div className="popup-panel border-bottom grid grid-2x">
                <div className="col-1">
                  <div className="popup-title">
                    Candidate - View Form
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
                      onClickClose={this.openApplicantDetailView}
                      bizparGender={this.state.bizparGender}
                      bizparNationality={this.state.bizparNationality}
                    />)}

                  {/* IDENTITY */}
                  {this.state.formIdentityVisible && (
                    <FormIdentity
                      type={'view'}
                      applicantData={this.state.rawData[this.state.selectedIndex]}
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

export default connect(mapStateToProps, mapDispatchToProps)(Candidate);