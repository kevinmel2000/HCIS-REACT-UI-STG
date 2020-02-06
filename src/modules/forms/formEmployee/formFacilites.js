import React, { Component } from 'react';
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import PopUp from "../../../components/pages/PopUpAlert";
import FormFacility from "../../../modules/forms/formEmployee/formFacilityCreate"
import { connect } from 'react-redux';
import EmployeeAction from '../../../Redux/EmployeeRedux'
import API from '../../../Services/Api'
import M from 'moment'
import * as R from 'ramda'
import AuthAction from '../../../Redux/AuthRedux'
import Stomp from 'stompjs'

var ct = require("../../../modules/custom/customTable");

class formFacilities extends Component {
  constructor(props) {
    super(props)
    let { employeeData, bizparFacilityCategory, bizparFacilityType } = this.props
    this.state = {
      deletePopUpVisible: false,
      createVisible: false,
      editVisible: false,
      viewVisible: false,
      savePopUpVisible: false,
      notifVisible:false,
      auth:props.auth,
      message:'',
      employeeData,
      bizparFacilityCategory,
      bizparFacilityType,
      sendState: ""

    }
  }

  connectWebsocket = async () => {
    let stompClient = Stomp.client(process.env.REACT_APP_HCIS_WEBSOCKET);
    let employeeID = this.props.auth.user.employeeID
    stompClient.debug = null;
    stompClient.connect({}, (frame) => {
      console.log('Connected: ' + frame)
      stompClient.subscribe('/topic/employee/put.employee.facility/' + employeeID, (message) => {
        let res = JSON.parse(message.body)
        console.log('messages: ' + res.messages)
        setTimeout(() => {
          this.setState({ sendState: "finished" }, () => {
              setTimeout(() => {
                  this.setState({ message: res.messages, editVisible: false, viewVisible: false, createVisible: false })
                  this.props.onSelect({
                      messages: res.messages,
                      // formEmployeeDataVisible: false,
                      // formFacilites: false,
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
    this.getAllFacilities(this.state.employeeData);
  }

  componentWillReceiveProps(newProps) {
    let { employeeData } = newProps
    this.setState({ employeeData })
    this.getAllFacilities(employeeData)
  }

  getAllFacilities(employeeData) {
    let dataTableFacilitiy = employeeData.employeeFacilities.map(
      value => {
        const {
          facilityQuantity,
          facilityDate,
          facilityNotes,
          isFacilityReturn,
          facilityReturnDate,
          facilityCategory,
          facilityType
        } = value;
        return [
          facilityType.bizparValue,
          facilityCategory.bizparValue,
          facilityQuantity,
          R.isNil(facilityDate) ? '' : M(facilityDate, 'DD-MM-YYYY').format('DD MMM YYYY'),
          facilityNotes,
          isFacilityReturn,
          R.isNil(facilityReturnDate) ? '' : M(facilityReturnDate, 'DD-MM-YYYY').format('DD MMM YYYY'),
        ];
      }
    );
    this.setState({ dataTableFacilitiy });
  }

  getMuiTheme = () => createMuiTheme(ct.customTable());

  options = ct.customOptions();

  openCloseCreate() {
    let savePopUpVisible = this.state.savePopUpVisible
      ? !this.state.savePopUpVisible
      : false;
    this.setState({
      createVisible: !this.state.createVisible,
      savePopUpVisible
    });
  }

  closeNotif() {
    this.setState({ notifVisible: false })
  }

  openCloseEdit(selectedIndex) {
    let savePopUpVisible = this.state.savePopUpVisible ? !this.state.savePopUpVisible : false;
    this.setState({ editVisible: !this.state.editVisible, selectedIndex, savePopUpVisible });
  }

  openCloseView(selectedIndex) {
    this.setState({ viewVisible: !this.state.viewVisible, selectedIndex });
  }

  openDeletePopup(index) {
    this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible, selectedIndex: index })
  };

  openSavePopup() {
    this.setState({ savePopUpVisible: !this.state.savePopUpVisible })
  };

  //facilites
  columnsFacilities = [
    "Facilities Type",
    "Facilities Category",
    "Quantity",
    "Facilities Date",
    "Information",
    {
      name: "Status Return",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            // this.props.type !== 'dum' ?
            <div className="margin-center content-center">
              <label className="Checkbox">
                <input type="Checkbox" disabled checked={val} />
                {/* <span className="slider round status-on-off" /> */}
              </label>
            </div>
            // : null
          );
        }
      }

    },
    "Return Date",
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
  handleSubmit(value, type = "") {
    this.setState({ sendState: "loading" })
    let { employeeFacilities, employeeID } = this.state.employeeData
    let data = Object.assign([], employeeFacilities)
    data = data.map((value, index) => {
      return {
        ...value,
        facilityType: value.facilityType.bizparKey,
        facilityCategory: value.facilityCategory.bizparKey,
      }
    })
    switch (type) {
      case "create":
        value = {
          ...value,
          employeeFacilityID: "EMF-" + M(),
          facilityDate: R.isEmpty(value.facilityDate) ? '' : M(value.facilityDate, 'YYYY-MM-DD').format('DD-MM-YYYY'),
          facilityReturnDate: R.isEmpty(value.facilityDate) ? '' : M(value.facilityDate, 'YYYY-MM-DD').format('DD-MM-YYYY'),
          facilityType: value.facilityType.bizparKey,
          facilityCategory: value.facilityCategory.bizparKey,
        }
        data.push(value)
        break;
      case "update":
        value = {
          ...value,
          facilityDate: R.isNil(value.facilityDate) || R.isEmpty(value.facilityDate) ? '' : M(value.facilityDate, 'YYYY-MM-DD').format('DD-MM-YYYY'),
          facilityReturnDate: R.isNil(value.facilityDate) || R.isEmpty(value.facilityDate) ? '' : M(value.facilityDate, 'YYYY-MM-DD').format('DD-MM-YYYY'),
          facilityType: value.facilityType.bizparKey,
          facilityCategory: value.facilityCategory.bizparKey,
        }
        let status = R.findIndex(R.propEq('employeeFacilityID', value.employeeFacilityID))(data)
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

    employeeFacilities = data
    let payload = {
      employeeID,
      employeeFacilities,
      "updatedBy": this.state.auth.user.employeeID,
      "updatedDate": M().format("DD-MM-YYYY HH:mm:ss")
    }
    this.connectWebsocket()
    API.create('EMPLOYEE').updateEmployeeFacility(payload).then(
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
            <MuiThemeProvider theme={this.getMuiTheme()}>
              <MUIDataTable
                title={"Facilities"}
                subtitle={"lorem ipsum dolor"}
                data={this.state.dataTableFacilitiy}
                columns={this.columnsFacilities}
                options={this.options}
              />
            </MuiThemeProvider>
          </div>
        </form>

        {this.state.createVisible && (
          <FormFacility
            type={"create"}
            sendState={this.state.sendState}
            bizparFacilityCategory={this.state.bizparFacilityCategory}
            bizparFacilityType={this.state.bizparFacilityType}
            onClickSave={(value) => this.handleSubmit(value, "create")}
            onClickClose={this.openCloseCreate.bind(this)}

          />
        )}
        {this.state.editVisible && (
          <FormFacility
            type={"update"}
            sendState={this.state.sendState}
            facilityData={this.state.employeeData.employeeFacilities[this.state.selectedIndex]}
            bizparFacilityCategory={this.state.bizparFacilityCategory}
            bizparFacilityType={this.state.bizparFacilityType}
            onClickSave={(value) => this.handleSubmit(value, "update")}
            onClickClose={this.openCloseEdit.bind(this)}

          />
        )}

        {this.state.viewVisible && (
          <FormFacility
            type={"view"}
            facilityData={this.state.employeeData.employeeFacilities[this.state.selectedIndex]}
            bizparFacilityCategory={this.state.bizparFacilityCategory}
            bizparFacilityType={this.state.bizparFacilityType}
            onClickClose={this.openCloseView.bind(this)}

          />
        )}

        {this.state.savePopUpVisible && (
          <PopUp
            type={"save"}
            class={"app-popup app-popup-show"}
            onClick={this.state.createVisible ? this.openCloseCreate.bind(this) : this.openCloseEdit.bind(this)}
          />
        )}

        {this.state.deletePopUpVisible && (
          <PopUp
            type={"delete"}
            class={"app-popup app-popup-show"}
            onClick={this.openDeletePopup.bind(this)}
            onClickDelete={this.openDeletePopup.bind(this)}
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

export default connect(mapStateToProps, mapDispatchToProps)(formFacilities);


