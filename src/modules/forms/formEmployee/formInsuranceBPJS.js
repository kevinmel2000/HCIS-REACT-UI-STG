import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import PopUp from "../../../components/pages/PopUpAlert";
import FormInsurance from "./formInsurance";
import { connect } from 'react-redux';
import EmployeeAction from '../../../Redux/EmployeeRedux'
import API from '../../../Services/Api'
import M from 'moment'
import * as R from 'ramda'
import AuthAction from '../../../Redux/AuthRedux'
import Stomp from 'stompjs'

var ct = require("../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class formInsuranceBPJS extends Component {
  constructor(props) {
    super(props)
    let { employeeData, bizparInsuranceCategory, bizparInsuranceType, bizparFamilyFaskes, bizparFamilyFaskesClass } = this.props;
    this.state = {
      dataTableInsurance: [],
      deletePopUpVisible: false,
      createVisible: false,
      editVisible: false,
      viewVisible: false,
      savePopUpVisible: false,
      notifVisible:false,
      message:'',
      employeeData,
      bizparInsuranceCategory,
      bizparInsuranceType,
      bizparFamilyFaskes,
      bizparFamilyFaskesClass,
      auth:props.auth,
      sendState: ""
    }
  }

  connectWebsocket = async () => {
    let stompClient = Stomp.client(process.env.REACT_APP_HCIS_WEBSOCKET);
    let employeeID = this.props.auth.user.employeeID
    stompClient.debug = null;
    stompClient.connect({}, (frame) => {
      console.log('Connected: ' + frame)
      stompClient.subscribe('/topic/employee/put.employee.insurance/' + employeeID, (message) => {
        let res = JSON.parse(message.body)
        console.log('messages: ' + res.messages)
        setTimeout(() => {
          this.setState({ sendState: "finished" }, () => {
              setTimeout(() => {
                  this.setState({ message: res.messages, editVisible: false, viewVisible: false, createVisible: false })
                  this.props.onSelect({
                      messages: res.messages,
                      // formEmployeeDataVisible: false,
                      // formInsuranceBPJSVisible: false,
                      formEmployeeDetailUpdateVisible: false
                  })
                  this.props.onFinishFetch()
              }, 500);
          })
      }, 500)
      })
    })
  }

  componentDidMount() {
    this.getAllInsurance(this.state.employeeData);
  }

  componentWillReceiveProps(newProps) {
    let { employeeData } = newProps
    this.setState({ employeeData })
    this.getAllInsurance(employeeData)
  }

  getAllInsurance(employeeData) {
    let dataTableInsurance = employeeData.employeeInsurances.map(
      value => {
        const {
          insuranceCardNumber,
          insuranceCardHolderName,
          insuranceCategory,
          insuranceType,
          insuranceFaskesClass,
          insuranceFaskesType
        } = value;
        return [
          insuranceType.bizparValue,
          insuranceCategory.bizparValue,
          insuranceCardNumber,
          insuranceCardHolderName,
          R.isNil(insuranceFaskesType.bizparValue) ? ('-') : insuranceFaskesType.bizparValue,
          R.isNil(insuranceFaskesClass.bizparValue) ? ('-') : insuranceFaskesClass.bizparValue
        ];
      }
    );
    this.setState({ dataTableInsurance });
  }

  openCloseCreate() {
    let savePopUpVisible = this.state.savePopUpVisible
      ? !this.state.savePopUpVisible
      : false;
    this.setState({
      createVisible: !this.state.createVisible,
      savePopUpVisible
    });
  }

  openCloseEdit(selectedIndex) {
    let savePopUpVisible = this.state.savePopUpVisible ? !this.state.savePopUpVisible : false;
    this.setState({ editVisible: !this.state.editVisible, selectedIndex,
       savePopUpVisible
     });
  }

  openCloseView(selectedIndex) {
    this.setState({ viewVisible: !this.state.viewVisible, selectedIndex });
  }

  openDeletePopup(index) {
    this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible, selectedIndex: index })
  };

  closeNotif() {
    this.setState({ notifVisible: false })
  }

  openSavePopup() {
    this.setState({ savePopUpVisible: !this.state.savePopUpVisible })
  };
  //insurance
  columnsInsurance = [
    "Insurance Type",
    "Insurance Category",
    "Card Number",
    "Participant Number",
    "Faskes",
    "FaskesType",
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

  // dataTableInsuranceBPJS = [
  //   ["BPJS", "KESEHATAN", "330281098302", "776826819639", "", "VIP"],
  //   ["ASKES", "KESEHATAN", "3302444498302", "77682644639", "", "VIP"],
  // ];

  handleSubmit(value, type = "") {
    this.setState({ sendState: "loading" })
    let { employeeInsurances, employeeID } = this.state.employeeData
    let data = Object.assign([], employeeInsurances)
    data = data.map((value, index) => {
      return {
        ...value,
        insuranceCategory: value.insuranceCategory.bizparKey,
        insuranceType: value.insuranceType.bizparKey,
        insuranceFaskesClass: value.insuranceFaskesClass.bizparKey,
        insuranceFaskesType: value.insuranceFaskesType.bizparKey,
      }
    })
    switch (type) {
      case "create":
        value = {
          ...value,
          employeeInsuranceID: "EMI-" + M(),
          insuranceCategory: value.insuranceCategory.bizparKey,
          insuranceType: value.insuranceType.bizparKey,
          insuranceFaskesClass: value.insuranceCategory.bizparKey === 'INSUR-001-INSCAT-001' ? value.insuranceFaskesClass.bizparKey : '',
          insuranceFaskesType: value.insuranceCategory.bizparKey === 'INSUR-001-INSCAT-001' ? value.insuranceFaskesType.bizparKey : '',
        }
        data.push(value)
        break;
      case "update":
        value = {
          ...value,
          insuranceCategory: value.insuranceCategory.bizparKey,
          insuranceType: value.insuranceType.bizparKey,
          insuranceFaskesClass: value.insuranceCategory.bizparKey === 'INSUR-001-INSCAT-001' ? value.insuranceFaskesClass.bizparKey : '',
          insuranceFaskesType: value.insuranceCategory.bizparKey === 'INSUR-001-INSCAT-001' ? value.insuranceFaskesType.bizparKey : '',
        }
        let status = R.findIndex(R.propEq('employeeInsuranceID', value.employeeInsuranceID))(data)
        if (status >= 0) {
          data[status] = value
        }
        break;
      case "delete":
        data.splice(this.state.selectedIndex, 1)
        break;
      default:
        break
    }

    employeeInsurances = data
    let payload = {
      employeeID,
      employeeInsurances,
      "updatedBy": this.state.auth.user.employeeID,
      "updatedDate": M().format("DD-MM-YYYY HH:mm:ss")
    }
    this.connectWebsocket()
    API.create('EMPLOYEE').updateEmployeeInsurance(payload).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            this.props.openSavePopUp()
            if (type !== "delete") {
              //this.setState({ createPopUpVisible: true })
              }
            else this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible })
            this.props.getEmployeeName({
              "params": {
                employeeName: this.props.name
              },
              "offset": 0,
              "limit": this.props.limit
            })
            if (type === "delete") {
              // this.props.backToPage()
            }
          } else {
            alert("Failed: " + res.data.message)
          }
        }
      }
    )
  }

  render() {
    return (
      <div className="vertical-tab-content-active" id="content-nav-5">
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
            <MuiThemeProvider theme={getMuiTheme()}>
              <MUIDataTable
                title={"Insurance"}
                subtitle={"lorem ipsum dolor"}
                data={this.state.dataTableInsurance}
                columns={this.columnsInsurance}
                options={options}
              />
            </MuiThemeProvider>
          </div>
        </form>

        {this.state.createVisible && (
          <FormInsurance
            type={"create"}
            sendState={this.state.sendState}
            bizparInsuranceCategory={this.state.bizparInsuranceCategory}
            bizparInsuranceType={this.state.bizparInsuranceType}
            bizparFamilyFaskes={this.state.bizparFamilyFaskes}
            bizparFamilyFaskesClass={this.state.bizparFamilyFaskesClass}
            backToPage={this.openEmployeeDetailUpdate}
            onClickSave={(value) => this.handleSubmit(value, "create")}
            onClickClose={this.openCloseCreate.bind(this)}

          />
        )}
        {this.state.editVisible && (
          <FormInsurance
            type={"update"}
            sendState={this.state.sendState}
            insuranceData={this.state.employeeData.employeeInsurances[this.state.selectedIndex]}
            bizparInsuranceCategory={this.state.bizparInsuranceCategory}
            bizparInsuranceType={this.state.bizparInsuranceType}
            bizparFamilyFaskes={this.state.bizparFamilyFaskes}
            bizparFamilyFaskesClass={this.state.bizparFamilyFaskesClass}
            backToPage={this.openEmployeeDetailUpdate}
            onClickSave={(value) => this.handleSubmit(value, "update")}
            onClickClose={this.openCloseEdit.bind(this)}

          />
        )}

        {this.state.viewVisible && (
          <FormInsurance
            type={"view"}
            insuranceData={this.state.employeeData.employeeInsurances[this.state.selectedIndex]}
            bizparInsuranceCategory={this.state.bizparInsuranceCategory}
            bizparInsuranceType={this.state.bizparInsuranceType}
            bizparFamilyFaskes={this.state.bizparFamilyFaskes}
            bizparFamilyFaskesClass={this.state.bizparFamilyFaskesClass}
            backToPage={this.openEmployeeDetailUpdate}
            onClickClose={this.openCloseView.bind(this)}

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
              //this.props.backToPage()
            }}
          />
        )}
        {this.state.deletePopUpVisible && (
          <PopUp
            type={"delete"}
            class={"app-popup app-popup-show"}
            onClick={this.openDeletePopup.bind(this)}
            onClickDelete={(value) => this.handleSubmit(value, "delete")}
          />
        )}
      </div>
    )
  }
};

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

export default connect(mapStateToProps, mapDispatchToProps)(formInsuranceBPJS);

