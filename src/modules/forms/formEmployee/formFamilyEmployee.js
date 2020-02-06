import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import PopUp from '../../../components/pages/PopUpAlert'
import FormFamily from "./formFamilyEm";
import API from '../../../Services/Api'
import M from 'moment'
import { connect } from 'react-redux';
import EmployeeAction from '../../../Redux/EmployeeRedux'
import * as R from 'ramda'
import Stomp from 'stompjs'
import AuthAction from '../../../Redux/AuthRedux'

var ct = require("../../../modules/custom/customTable");
var currentDate = new Date().getDate();

class formFamilyEmployee extends Component {
  constructor(props) {
    super(props);
    let { employeeData } = this.props;

    let employeeFamilies = Object.assign([], employeeData.employeeFamilies)
    employeeFamilies = employeeFamilies.map((data, index) => {
      return {
        ...data,
        familyEducationLevel: data.familyEducationLevel.bizparKey,
        familyGenderType: data.familyGenderType.bizparKey,
        familyMaritalStatus: data.familyMaritalStatus.bizparKey,
        familyNationalityType: data.familyNationalityType.bizparKey,
        familyRelationshipType: data.familyRelationshipType.bizparKey,
        familyReligionType: data.familyReligionType.bizparKey,
        familyType: data.familyType.bizparKey,
        familyFaskesClass: data.familyFaskesClass.bizparKey,
        familyFaskes: data.familyFaskes.bizparKey
      }
    })

    employeeData = {
      ...employeeData,
      employeeFamilies
    }

    this.state = {
      employeeData: employeeData,
      typeFamily: "create",
      createVisible: false,
      createPopUpVisible: false,
      deletePopUpVisible: false,
      editVisible: false,
      viewVisible: false,
      refreshing: false,
      fetching: false,
      dataTableFamily: [],
      rawData: [],
      bizparFamilyType: [],
      bizparFamilyRelational: [],
      bizparGender: [],
      bizparReligion: [],
      bizparEducationLevel: [],
      bizparNationality: [],
      bizparFaskes: [],
      bizparFaskesClass: [],
      notifVisible: false,
      message: '',
      sendState: ""
    };
  }

  componentDidMount() {
    // this.getDataFamily(this.state.employeeData);
    this.getBizparFamilyType();
    this.getBizparFamilyRelational();
    this.getBizparGender();
    this.getBizparReligion();
    this.getBizparEducation();
    this.getBizparNationality();
    this.getBizparFaskes();
    this.getBizparFaskesClass();
  }

  componentWillReceiveProps(newProps) {
    let { employeeData } = newProps
    this.setState({ employeeData })
    // this.getDataFamily(employeeData)
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
  
  closeNotif() {
    this.setState({ notifVisible: false })
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

  async getBizparFaskes() {
    let payloadFaskes = {
      params: {
        bizparCategory: "FAMILY_FASKES"
      },
      offset: 0,
      limit: 8
    }
    API.create('BIZPAR').getBizparByCategory(payloadFaskes).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            this.setState({
              bizparFaskes: res.data.data
            })
          }
        }
      }
    )
  }

  async getBizparFaskesClass() {
    let payloadFaskesClass = {
      params: {
        bizparCategory: "FAMILY_FASKES_CLASS"
      },
      offset: 0,
      limit: 10
    }
    API.create('BIZPAR').getBizparByCategory(payloadFaskesClass).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            this.setState({
              bizparFaskesClass: res.data.data
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

  // getDataFamily(employeeData) {
  //   let dataTableFamily = employeeData.employeeFamilies.map((value) => {
  //     const { employeeFamilyID, familyType, familyRelationshipType, familyName, familyKTPNumber, familyBirthDate, familyGenderType, familyEducationLevel } = value;
  //     return [
  //       employeeFamilyID,
  //       familyType && familyType.bizparValue,
  //       familyRelationshipType && familyRelationshipType.bizparValue,
  //       familyName,
  //       familyKTPNumber,
  //       familyBirthDate,
  //       familyGenderType && familyGenderType.bizparValue,
  //       familyEducationLevel && familyEducationLevel.bizparValue,
  //     ]
  //   });
  //   this.setState({ dataTableFamily });
  // }

  connectWebsocket = async () => {
    let stompClient = Stomp.client(process.env.REACT_APP_HCIS_WEBSOCKET);
    let employeeID = this.props.auth.user.employeeID
    stompClient.debug = null;
    stompClient.connect({}, (frame) => {
      console.log('Connected: ' + frame)
      stompClient.subscribe('/topic/employee/put.employee.family/' + employeeID, (message) => {  
        let res = JSON.parse(message.body)
        console.log('messages: ' + res.messages)
        setTimeout(() => {
          this.setState({ sendState: "finished" }, () => {
              setTimeout(() => {
                  this.setState({ message: res.messages, editVisible: false, viewVisible: false, createVisible: false })
                  this.props.onSelect({
                      messages: res.messages,
                      // formEmployeeDataVisible: false,
                      // formFamilyVisible: false,
                      formEmployeeDetailUpdateVisible: false
                  })
                  this.props.onFinishFetch()
              }, 500);
          })
      }, 500)
      })
    })
  }

  async saveDataFamily(payload, type = "") {
    this.setState({ sendState: "loading" })
    let employeeFamilies = Object.assign([], this.state.employeeData.employeeFamilies)
    let isExist = R.findIndex(R.propEq('employeeFamilyID', payload.employeeFamilyID))(employeeFamilies)

    if (type === "delete") {
      employeeFamilies.splice(this.state.selectedIndex, 1)
    } else if (isExist >= 0) {
      employeeFamilies[isExist] = payload
    } else {
      employeeFamilies.push(payload);
    }

    employeeFamilies = employeeFamilies.map((data, index) => {
      let address = data.employeeFamilyAddress.address.map((datax, index) => {
        return {
          ...datax,
          country: R.isEmpty(datax.country) || R.isNil(datax.country) ? '' : typeof datax.country === "object" ? datax.country.countryID : datax.country,
          addressType: typeof datax.addressType === "object" ? datax.addressType.bizparKey : datax.addressType,
          province: R.isEmpty(datax.province) || R.isNil(datax.province)? '' : typeof datax.province === "object" ? datax.province.provinceID : datax.province,
          kabkot: R.isEmpty(datax.kabkot) || R.isNil(datax.kabkot)? '' : typeof datax.kabkot === "object" ? datax.kabkot.kabkotID : datax.kabkot,
          kecamatan: R.isEmpty(datax.kecamatan) || R.isNil(datax.kecamatan) ? '' : typeof datax.kecamatan === "object" ? datax.kecamatan.kecamatanID : datax.kecamatan,
          kelurahan: R.isEmpty(datax.kelurahan) || R.isNil(datax.kelurahan) ? '' : typeof datax.kelurahan === "object" ? datax.kelurahan.kelurahanID : datax.kelurahan
        }
      })
      return {
        ...data,
        employeeFamilyAddress: {
          address
        },
        familyRelationshipType: data.familyRelationshipType && !R.isNil(data.familyRelationshipType.bizparKey) ? data.familyRelationshipType.bizparKey : data.familyRelationshipType,
        familyEducationLevel: data.familyEducationLevel && !R.isNil(data.familyEducationLevel.bizparKey) ? data.familyEducationLevel.bizparKey : data.familyEducationLevel,
        familyGenderType: data.familyGenderType && !R.isNil(data.familyGenderType.bizparKey) ? data.familyGenderType.bizparKey : data.familyGenderType,
        familyMaritalStatus: data.familyMaritalStatus && !R.isNil(data.familyMaritalStatus.bizparKey) ? data.familyMaritalStatus.bizparKey : "",
        familyReligionType: data.familyReligionType && !R.isNil(data.familyReligionType.bizparKey) ? data.familyReligionType.bizparKey : data.familyReligionType,
        familyNationalityType: data.familyNationalityType && !R.isNil(data.familyNationalityType.bizparKey) ? data.familyNationalityType.bizparKey : data.familyNationalityType,
        familyType: data.familyType && !R.isNil(data.familyType.bizparKey) ? data.familyType.bizparKey : data.familyType,
        familyFaskes: data.familyFaskes && !R.isNil(data.familyFaskes.bizparKey) ? data.familyFaskes.bizparKey : data.familyFaskes,
        familyFaskesClass: data.familyFaskesClass && !R.isNil(data.familyFaskesClass.bizparKey) ? data.familyFaskesClass.bizparKey : data.familyFaskesClass,
        familyBirthDate: data.familyBirthDate === "" || data.familyBirthDate === null ? "" : M(data.familyBirthDate, 'YYYY-MM-DD').format('DD-MM-YYYY'),
        familyDivorceDate: data.familyDivorceDate === "" || R.isNil(data.familyDivorceDate) ? "" : M(data.familyDivorceDate, 'YYYY-MM-DD').format('DD-MM-YYYY'),
        familyDateOfDeath: data.familyDateOfDeath === "" || R.isNil(data.familyDateOfDeath) ? "" : M(data.familyDateOfDeath, 'YYYY-MM-DD').format('DD-MM-YYYY')
      }
    })
    this.connectWebsocket()
    payload = {
      employeeFamilies,
      "employeeID": this.state.employeeData.employeeID,
      "updatedBy": this.props.auth.user.employeeID,
      "updatedDate": currentDate
    } 
    API.create('EMPLOYEE').createAndUpdateFam(payload).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') { 
            this.props.openSavePopUp()
            // this.setState({ createPopUpVisible: true }) 
            this.props.getEmployeeName({
              "params": {
                employeeName: this.props.name
              },
              "offset": 0,
              "limit": this.props.limit
            })
            if (type === "delete") {
              this.props.backToPage()
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
                    <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                  </button>
                </div>
                <div className='column-2'>
                  <button
                    type="button"
                    className="btnAct"
                    style={{ marginRight: 15 }}
                    onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
                  >
                    <i className="fa fa-lw fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                  </button>
                </div>
                <div className='column-3'>
                  <button
                    type="button"
                    className="btnAct"
                    onClick={() => this.openCloseView(tableMeta.rowIndex)}
                  >
                    <i className="fa fa-lw fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
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
    let { employeeData, selectedIndex, bizparFamilyType, bizparFamilyRelational, bizparGender, bizparEducationLevel } = this.state
    let dataTableFamily = employeeData.employeeFamilies.map((value) => {
      let { employeeFamilyID, familyType, familyRelationshipType, familyName, familyKTPNumber, familyBirthDate, familyGenderType, familyEducationLevel } = value;

      let index = R.findIndex(R.propEq('bizparKey', familyType))(bizparFamilyType)
      familyType = index >= 0 ? bizparFamilyType[index].bizparValue : ""

      index = R.findIndex(R.propEq('bizparKey', familyRelationshipType))(bizparFamilyRelational)
      familyRelationshipType = index >= 0 ? bizparFamilyRelational[index].bizparValue : ""

      index = R.findIndex(R.propEq('bizparKey', familyGenderType))(bizparGender)
      familyGenderType = index >= 0 ? bizparGender[index].bizparValue : ""

      index = R.findIndex(R.propEq('bizparKey', familyEducationLevel))(bizparEducationLevel)
      familyEducationLevel = index >= 0 ? bizparEducationLevel[index].bizparValue : ""

      return [
        employeeFamilyID,
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
          <div className="padding-10px  grid-mobile-none gap-20px">
            <div className="col-1 content-right">
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
            <div className="padding-5px" />
            <MuiThemeProvider theme={this.getMuiTheme()}>
              <MUIDataTable
                title='Family'
                subtitle={"lorem ipsum dolor"}
                data={dataTableFamily}
                columns={this.columnsFamily}
                options={this.options}
              />
            </MuiThemeProvider>
          </div>
        </form>
        {this.state.createVisible && (
          <FormFamily
            type={"create"}
            sendState={this.state.sendState}
            employeeData={this.state.employeeData}
            onSave={(payload) => this.saveDataFamily(payload)}
            bizparFamilyType={this.state.bizparFamilyType}
            bizparFamilyRelational={this.state.bizparFamilyRelational}
            bizparGender={this.state.bizparGender}
            bizparReligion={this.state.bizparReligion}
            bizparEducationLevel={this.state.bizparEducationLevel}
            bizparNationality={this.state.bizparNationality}
            bizparFaskes={this.state.bizparFaskes}
            bizparFaskesClass={this.state.bizparFaskesClass}
            label="Create Employee Familiy"
            onClickClose={this.openCloseCreate.bind(this)}
          />
        )}
        {this.state.editVisible && (
          <FormFamily
            type={"update"}
            sendState={this.state.sendState}
            label="Update Employee Familiy"
            onSave={(payload) => this.saveDataFamily(payload)}
            onClickClose={this.openCloseEdit.bind(this)}
            bizparFamilyType={this.state.bizparFamilyType}
            bizparFamilyRelational={this.state.bizparFamilyRelational}
            bizparGender={this.state.bizparGender}
            bizparReligion={this.state.bizparReligion}
            bizparEducationLevel={this.state.bizparEducationLevel}
            bizparNationality={this.state.bizparNationality}
            bizparFaskes={this.state.bizparFaskes}
            bizparFaskesClass={this.state.bizparFaskesClass}
            employeeDataFamily={employeeData.employeeFamilies[selectedIndex]}
            employeeData={this.state.employeeData}
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
            bizparFaskes={this.state.bizparFaskes}
            bizparFaskesClass={this.state.bizparFaskesClass}
            employeeDataFamily={employeeData.employeeFamilies[selectedIndex]}
            employeeData={this.state.employeeData}
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
              // this.props.backToPage()
              
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

export default connect(mapStateToProps, mapDispatchToProps)(formFamilyEmployee);
