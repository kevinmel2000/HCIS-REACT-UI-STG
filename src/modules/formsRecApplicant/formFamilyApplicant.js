import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import PopUp from '../../components/pages/PopUpAlert'
import FormFamily from "./formFamily";
import API from '../../Services/Api'
import { connect } from 'react-redux';
import RecruitmentAction from '../../Redux/RecruitmentRedux'
import * as R from 'ramda'
import AuthAction from '../../Redux/AuthRedux'
import Stomp from 'stompjs'

var ct = require("../../modules/custom/customTable");
var currentDate = new Date().getDate();

class formFamilyAplicant extends Component {
  constructor(props) {
    super(props);
    let { applicantData } = this.props;

    let applicantFamilies = Object.assign([], applicantData.applicantFamilies)
    applicantFamilies = applicantFamilies.map((data, index) => {
      return {
        ...data,
        familyEducationLevel: data.familyEducationLevel.bizparKey,
        familyGenderType: data.familyGenderType.bizparKey,
        familyMaritalStatus: data.familyMaritalStatus.bizparKey,
        familyNationalityType: data.familyNationalityType.bizparKey,
        familyRelationshipType: data.familyRelationshipType.bizparKey,
        familyReligionType: data.familyReligionType.bizparKey,
        familyType: data.familyType.bizparKey
      }
    })

    applicantData = {
      ...applicantData,
      applicantFamilies
    }

    this.state = {
      applicantData,
      typeFamily: "create",
      createVisible: false,
      createPopUpVisible: false,
      deletePopUpVisible: false,
      editVisible: false,
      viewVisible: false,
      refreshing: false,
      fetching: false,
      rawData: [],
      bizparFamilyType: [],
      bizparFamilyRelational: [],
      bizparGender: [],
      bizparReligion: [],
      bizparEducationLevel: [],
      bizparNationality: [],
      notifVisible: false,
      message: "",
      auth: props.auth,
      defaultPayload: [],
      isWeb: false,
      sendState: ""
    };
  }

  connectWebsocket(type) {
    console.log(type)
    let stompClient = Stomp.client(process.env.REACT_APP_HCIS_WEBSOCKET);
    let employeeID = this.props.auth.user.employeeID
    stompClient.debug = null;
    stompClient.connect({}, (frame) => {
      console.log('Connected: ' + frame)
      stompClient.subscribe('/topic/applicant/put.applicant.family/' + employeeID, (message) => {
        let res = JSON.parse(message.body)
        console.log('messages: ' + res.messages)
        if (type !== "delete") {
          setTimeout(() => {
            this.setState({ sendState: "finished" }, () => {
              setTimeout(() => {
                this.setState({ message: res.messages, createVisible: false, editVisible: false, viewVisible: false, isWeb: true })
                this.props.onSelect({
                  message: res.messages,
                  // formFormalEducationVisible: false,
                  formApplicantDetailUpdateVisible: false,
                  // formApplicantDataVisible: false
                })
                this.props.onFinishFetch()
              }, 500);
            })
          }, 500);
        } else {
          this.props.onSelect({
            message: res.messages,
            formFormalEducationVisible: false,
            formApplicantDetailUpdateVisible: false,
            formApplicantDataVisible: false
          })
        }
      })
    })
  }

  componentDidMount() {
    this.getBizparFamilyType();
    this.getBizparFamilyRelational();
    this.getBizparGender();
    this.getBizparReligion();
    this.getBizparEducation();
    this.getBizparNationality();
  }

  componentWillReceiveProps(newProps) {
    let { applicantData } = newProps
    this.setState({ applicantData })
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
          if (res.data.status === 'S') {
            this.setState({
              bizparNationality: res.data.data
            })
          }
        }
      }
    )
  }

  async getBizparFamilyType() {
    let payloadFamily = {
      params: {
        bizparCategory: "FAMILY_TYPE"
      },
      offset: 0,
      limit: 10
    }
    API.create('BIZPAR').getBizparByCategory(payloadFamily).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            this.setState({
              bizparFamilyType: res.data.data
            })
          }
        }
      }
    )
  }

  async getBizparFamilyRelational() {
    let payloadFamilyRelational = {
      params: {
        bizparCategory: "FAMILY_RELATIONAL_STATUS"
      },
      offset: 0,
      limit: 20
    }
    API.create('BIZPAR').getBizparByCategory(payloadFamilyRelational).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            this.setState({
              bizparFamilyRelational: res.data.data
            })
          }
        }
      }
    )
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
          if (res.data.status === 'S') {
            this.setState({
              bizparGender: res.data.data
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
      limit: 8
    }
    API.create('BIZPAR').getBizparByCategory(payloadReligion).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            this.setState({
              bizparReligion: res.data.data
            })
          }
        }
      }
    )
  }


  async getBizparEducation() {
    let payloadEducation = {
      params: {
        bizparCategory: "EDUCATION_LEVEL"
      },
      offset: 0,
      limit: 20
    }
    API.create('BIZPAR').getBizparByCategory(payloadEducation).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            this.setState({
              bizparEducationLevel: res.data.data
            })
          }
        }
      }
    )
  }

  async saveDataFamily(payload, type = "") {
    this.setState({ defaultPayload: payload, sendState: "loading" })
    let applicantFamilies = Object.assign([], this.state.applicantData.applicantFamilies)

    let isExist = R.findIndex(R.propEq('applicantFamilyID', payload.applicantFamilyID))(applicantFamilies)

    if (type === "delete") {
      applicantFamilies.splice(this.state.selectedIndex, 1)
    } else if (isExist >= 0) {
      applicantFamilies[isExist] = payload
    } else {
      applicantFamilies.push(payload);
    }

    applicantFamilies = applicantFamilies.map((data, index) => {
      let address = data.applicantFamilyAddress.address.map((datax, index) => {
        return {
          ...datax,
          country: R.isNil(datax.country) || R.isEmpty(datax.country) ? '' : typeof datax.country === "object" ? datax.country.countryID : datax.country,
          addressType: typeof datax.addressType === "object" ? datax.addressType.bizparKey : datax.addressType,
          province: R.isNil(datax.province) || R.isEmpty(datax.province) ? '' : typeof datax.province === "object" ? datax.province.provinceID : datax.province,
          kabkot: R.isNil(datax.kabkot) || R.isEmpty(datax.kabkot) ? '' : typeof datax.kabkot === "object" ? datax.kabkot.kabkotID : datax.kabkot,
          kecamatan: R.isNil(datax.kecamatan) || R.isEmpty(datax.kecamatan) ? '' : typeof datax.kecamatan === "object" ? datax.kecamatan.kecamatanID : datax.kecamatan,
          kelurahan: R.isNil(datax.kelurahan) || R.isEmpty(datax.kelurahan) ? '' : typeof datax.kelurahan === "object" ? datax.kelurahan.kelurahanID : datax.kelurahan
        }
      })
      return {
        ...data,
        applicantFamilyAddress: {
          address
        },
        familyRelationshipType: data.familyRelationshipType && !R.isNil(data.familyRelationshipType.bizparKey) ? data.familyRelationshipType.bizparKey : data.familyRelationshipType,
        familyEducationLevel: data.familyEducationLevel && !R.isNil(data.familyEducationLevel.bizparKey) ? data.familyEducationLevel.bizparKey : data.familyEducationLevel,
        familyGenderType: data.familyGenderType && !R.isNil(data.familyGenderType.bizparKey) ? data.familyGenderType.bizparKey : data.familyGenderType,
        familyMaritalStatus: data.familyMaritalStatus && !R.isNil(data.familyMaritalStatus.bizparKey) ? data.familyMaritalStatus.bizparKey : "",
        familyReligionType: data.familyReligionType && !R.isNil(data.familyReligionType.bizparKey) ? data.familyReligionType.bizparKey : data.familyReligionType,
        familyNationalityType: data.familyNationalityType && !R.isNil(data.familyNationalityType.bizparKey) ? data.familyNationalityType.bizparKey : data.familyNationalityType,
        familyType: data.familyType && !R.isNil(data.familyType.bizparKey) ? data.familyType.bizparKey : data.familyType,
        familyBirthDate: data.familyBirthDate === "" || data.familyBirthDate === null ? "" : data.familyBirthDate,
        familyDivorceDate: data.familyDivorceDate === "" || R.isNil(data.familyDivorceDate) ? "" : data.familyDivorceDate
      }
    })

    payload = {
      applicantFamilies,
      "applicantNumber": this.state.applicantData.applicantNumber,
      "updatedBy": this.state.auth.user.employeeID,
      "updatedDate": currentDate
    }

    this.connectWebsocket(type)
    API.create('RECRUITMENT').createAndUpdate(payload).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            this.props.openSavePopUp()
            if (type !== "delete") this.setState({
              //createPopUpVisible: true
            })
            else this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible })
            this.props.getApplicantName({
              "params": {
                applicantName: this.props.name
              },
              "offset": 0,
              "limit": this.props.limit
            })
            if (type === "delete") {
              //this.props.backToPage() 
            }
          } else {
            alert("Failed : " + res.data.message)
          }
        } else {
        }
      }
    )

  }

  openCloseCreate() {
    let createPopUpVisible = this.state.createPopUpVisible
      ? !this.state.createPopUpVisible
      : false;
    this.setState({
      createVisible: !this.state.createVisible,
      createPopUpVisible
    });
  }

  openCloseEdit(selectedIndex) {
    this.setState({ editVisible: !this.state.editVisible, selectedIndex });
  }

  openCloseView(selectedIndex) {
    this.setState({ viewVisible: !this.state.viewVisible, selectedIndex });
  }

  openDeletePopup(selectedIndex) {
    this.setState({
      deletePopUpVisible: !this.state.deletePopUpVisible,
      selectedIndex
    });
  }

  openCreateFormFamily = (typeFamily = "create") => {
    if (this.state.createClassFamily === "app-popup app-popup-show") {
      this.setState({ createClassFamily: "app-popup", typeFamily });
    } else {
      this.setState({
        createClassFamily: "app-popup app-popup-show",
        typeFamily
      });
    }
  };

  getMuiTheme = () => createMuiTheme(ct.customTable());

  options = ct.customOptions();

  columnsFamily = [
    "Family Number",
    "Type",
    "Relationship",
    "Name",
    "NIK",
    "Date of Birth",
    "Gender",
    "Education",
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            this.props.type !== 'view' ?
              <div className='grid grid-3x'>
                <div className='column-1'>
                  <button
                    type="button"
                    className="btnAct"
                    style={{ marginRight: 15 }}
                    onClick={() => this.openCloseEdit(tableMeta.rowIndex)}
                  >
                    <i className="fa fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                  </button>
                </div>
                <div className='column-2'>
                  <button
                    type="button"
                    className="btnAct"
                    style={{ marginRight: 15 }}
                    onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
                  >
                    <i className="fa fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                  </button>
                </div>
                <div className='column-3'>
                  <button
                    type="button"
                    className="btnAct"
                    onClick={() => this.openCloseView(tableMeta.rowIndex)}
                  >
                    <i className="fa fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                  </button>
                </div>
              </div> :
              <button
                type="button"
                className="btnAct"
                onClick={() => this.openCloseView(tableMeta.rowIndex)}
              >
                <i className="fa fa-lw fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
              </button>
          );
        }
      }
    }
  ];

  render() {
    let { applicantData, selectedIndex, bizparFamilyType, bizparFamilyRelational, bizparGender, bizparEducationLevel } = this.state

    let dataTableFamily = applicantData.applicantFamilies.map((value) => {
      let { applicantFamilyID, familyType, familyRelationshipType, familyName, familyKTPNumber, familyBirthDate, familyGenderType, familyEducationLevel } = value;

      let index = R.findIndex(R.propEq('bizparKey', familyType))(bizparFamilyType)
      familyType = index >= 0 ? bizparFamilyType[index].bizparValue : ""

      index = R.findIndex(R.propEq('bizparKey', familyRelationshipType))(bizparFamilyRelational)
      familyRelationshipType = index >= 0 ? bizparFamilyRelational[index].bizparValue : ""

      index = R.findIndex(R.propEq('bizparKey', familyGenderType))(bizparGender)
      familyGenderType = index >= 0 ? bizparGender[index].bizparValue : ""

      index = R.findIndex(R.propEq('bizparKey', familyEducationLevel))(bizparEducationLevel)
      familyEducationLevel = index >= 0 ? bizparEducationLevel[index].bizparValue : ""

      return [
        applicantFamilyID,
        familyType,
        familyRelationshipType,
        familyName,
        familyKTPNumber,
        familyBirthDate,
        familyGenderType,
        familyEducationLevel,
      ]
    });
    return (
      <div className="vertical-tab-content active" id="content-nav-3">
        <form action="#">
          <div className="border-bottom padding-10px  grid-mobile-none gap-20px">
            <div className="col-1 content-right margin-bottom-10px">
              {this.props.type !== 'view' ?
                <button
                  type="button"
                  className="btn btn-circle background-blue"
                  onClick={this.openCloseCreate.bind(this)}
                >
                  <i className="fa fa-1x fa-plus" />
                </button>
                : null}
            </div>
            <MuiThemeProvider theme={this.getMuiTheme()}>
              <MUIDataTable
                title='Family'
                subtitle={'lorem ipsum dolor'}
                data={dataTableFamily}
                columns={this.columnsFamily}
                options={this.options}
              />
            </MuiThemeProvider>
          </div>
        </form>
        {this.state.createVisible && (
          <FormFamily
            sendState={this.state.sendState}
            type={"create"}
            applicantData={this.state.applicantData}
            onSave={(payload) => this.saveDataFamily(payload)}
            bizparFamilyType={this.state.bizparFamilyType}
            bizparFamilyRelational={this.state.bizparFamilyRelational}
            bizparGender={this.state.bizparGender}
            bizparReligion={this.state.bizparReligion}
            bizparEducationLevel={this.state.bizparEducationLevel}
            bizparNationality={this.state.bizparNationality}
            label="Create Applicant Familiy"
            onClickClose={this.openCloseCreate.bind(this)}
          />
        )}
        {this.state.editVisible && (
          <FormFamily
            sendState={this.state.sendState}
            type={"update"}
            label="Update Applicant Familiy"
            onSave={(payload) => this.saveDataFamily(payload)}
            onClickClose={this.openCloseEdit.bind(this)}
            bizparFamilyType={this.state.bizparFamilyType}
            bizparFamilyRelational={this.state.bizparFamilyRelational}
            bizparGender={this.state.bizparGender}
            bizparReligion={this.state.bizparReligion}
            bizparEducationLevel={this.state.bizparEducationLevel}
            bizparNationality={this.state.bizparNationality}
            applicantDataFamily={applicantData.applicantFamilies[selectedIndex]}
            applicantData={this.state.applicantData}
          />
        )}
        {this.state.viewVisible && (
          <FormFamily
            type={"view"}
            onClickClose={this.openCloseView.bind(this)}
            bizparFamilyType={this.state.bizparFamilyType}
            bizparFamilyRelational={this.state.bizparFamilyRelational}
            bizparGender={this.state.bizparGender}
            bizparReligion={this.state.bizparReligion}
            bizparEducationLevel={this.state.bizparEducationLevel}
            bizparNationality={this.state.bizparNationality}
            applicantDataFamily={applicantData.applicantFamilies[selectedIndex]}
            applicantData={this.state.applicantData}
          />
        )}
        {this.state.createPopUpVisible && (
          <PopUp
            type={"save"}
            class={"app-popup app-popup-show"}
            onClick={() => {
              this.setState({
                createVisible: false,
                editVisible: false,
                createPopUpVisible: false
              })
              // this.props.getApplicant({
              //   "offset": 0,
              //   "limit": 25
              // })
              //this.props.backToPage()
            }}
          />
        )}

        {this.state.deletePopUpVisible && (
          <PopUp
            type={"delete"}
            class={"app-popup app-popup-show"}
            onClick={this.openDeletePopup.bind(this)}
            onClickDelete={() => this.saveDataFamily('', 'delete')}
          />
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

export default connect(mapStateToProps, mapDispatchToProps)(formFamilyAplicant);
