import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import PopUp from "../../../components/pages/PopUpAlert";
import FormEmergencyContact from "./formEmergencyContactEm";
import API from '../../../Services/Api';
import { connect } from 'react-redux';
import EmployeeAction from '../../../Redux/EmployeeRedux'
import M from 'moment'
import * as R from 'ramda'
import AuthAction from '../../../Redux/AuthRedux'
import Stomp from 'stompjs'

var ct = require("../../../modules/custom/customTable");

class formEmergencyContactEmployee extends Component {
  constructor(props) {
    super(props);
    let { employeeData } = this.props;

    this.state = {
      employeeData,
      dataTableEmergencyContact: [],
      createPopUpVisible: false,
      deletePopUpVisible: false,
      createVisible: false,
      editVisible: false,
      viewVisible: false,
      refreshing: false,
      fetching: false,
      notifVisible: false,
      message: "",
      auth: props.auth,
      sendState: ""
    };
  }

  componentDidMount() {
    this.getAllEmergencyContact(this.state.employeeData);
  }

  componentWillReceiveProps(newProps) {
    let { employeeData } = newProps
    this.setState({ employeeData })
    this.getAllEmergencyContact(employeeData)
  }

  connectWebsocket = async () => {
    let stompClient = Stomp.client(process.env.REACT_APP_HCIS_WEBSOCKET);
    let employeeID = this.props.auth.user.employeeID
    stompClient.debug = null;
    stompClient.connect({}, (frame) => {
      console.log('Connected: ' + frame)
      stompClient.subscribe('/topic/employee/put.employee.emergency.contact/' + employeeID, (message) => {
        let res = JSON.parse(message.body)
        console.log('messages: ' + res.messages)
        setTimeout(() => {
          this.setState({ sendState: "finished" }, () => {
              setTimeout(() => {
                  this.setState({ message: res.messages, editVisible: false, viewVisible: false, createVisible: false })
                  this.props.onSelect({
                      messages: res.messages,
                      // formEmployeeDataVisible: false,
                      // formEmergencyContactVisible: false,
                      formEmployeeDetailUpdateVisible: false
                  })
                  this.props.onFinishFetch()
              }, 500);
          })
      }, 500)
      })
    })
  }

  closeNotif() {
    this.setState({ notifVisible: false })
  }


  getAllEmergencyContact(employeeData) {
    let dataTableEmergencyContact = employeeData.employeeEmergencyContacts.map(
      value => {
        const {
          employeeEmergencyContactID,
          emergencyContactPersonName,
          emergencyContactPersonAddress,
          emergencyContactPersonTelpNumber,
          emergencyContactPersonPosition,
          emergencyContactPersonRelationship
        } = value;
        return [
          employeeEmergencyContactID,
          emergencyContactPersonName,
          emergencyContactPersonAddress,
          emergencyContactPersonTelpNumber,
          emergencyContactPersonPosition,
          emergencyContactPersonRelationship
        ];
      }
    );
    this.setState({ dataTableEmergencyContact });
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
    let createPopUpVisible = this.state.createPopUpVisible
      ? !this.state.createPopUpVisible
      : false;
    this.setState({ editVisible: !this.state.editVisible, selectedIndex, createPopUpVisible });
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

  handleSubmit(value, type = "") {
    this.setState({ sendState: "loading" })
    this.connectWebsocket( )
    let { employeeEmergencyContacts, employeeID } = this.state.employeeData
    let data = Object.assign([], employeeEmergencyContacts)

    switch (type) {
      case "create":
        value = {
          ...value,
          employeeEmergencyContactID: "EC-" + M(),
        }
        data.push(value)
        break;
      case "edit":
        let status = R.findIndex(R.propEq('employeeEmergencyContactID', value.employeeEmergencyContactID))(data)
        if (status >= 0) {
          data[status] = value
        }
        break;
      case "delete":
        data.splice(this.state.selectedIndex, 1)
        break;
      default:
        break;
    }

    employeeEmergencyContacts = data
    let payload = {
      employeeEmergencyContacts,
      employeeID,
      "updatedBy": this.state.auth.user.employeeID,
      "updatedDate": M().format("DD-MM-YYYY HH:mm:ss")
    }

    API.create('EMPLOYEE').updateEmployeeEmergencyContact(payload).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            this.props.openSavePopUp()
            console.log(res.data)
            if(type !== "delete") {
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
            console.log(res);
            alert("Failed: " + res.data.message)
          }
        } else {
          console.log(res)
        }
      })
  }

  getMuiTheme = () => createMuiTheme(ct.customTable());

  options = ct.customOptions();

  //emergency contact
  columnsEmergencyContact = [
    "Emergency Number",
    "Name",
    "Address",
    "Phone",
    "Position",
    "Relationship",
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            this.props.type !== 'view' ?
              <div>
                <button
                  type="button"
                  className="btnAct"
                  style={{ marginRight: 15 }}
                  onClick={() => this.openCloseEdit(tableMeta.rowIndex)}
                >
                  <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                </button>
                <button
                  type="button"
                  className="btnAct"
                  style={{ marginRight: 15 }}
                  onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
                >
                  <i className="fa fa-lw fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                </button>
                <button
                  type="button"
                  className="btnAct"
                  onClick={() => this.openCloseView(tableMeta.rowIndex)}
                >
                  <i className="fa fa-lw fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                </button>
              </div> :
                 <button
                  type="button"
                  className="btnAct"
                  onClick={() => this.openCloseView(tableMeta.rowIndex)}
                >
                  <i className="fa fa-lw fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }}/>
                </button>
          );
        }
      }
    }
  ];

  render() {
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
                subtitle={"lorem ipsum dolor"}
                title='Emergency Contact'
                data={this.state.dataTableEmergencyContact}
                columns={this.columnsEmergencyContact}
                options={this.options}
              />
            </MuiThemeProvider>
          </div>
        </form>
        {this.state.createVisible && (
          <FormEmergencyContact
            onClickSave={(value) => this.handleSubmit(value, "create")}
            type={"create"}
            sendState={this.state.sendState}
            onClickClose={this.openCloseCreate.bind(this)}
          />
        )}
        {this.state.editVisible && (
          <FormEmergencyContact
            onClickSave={(value) => this.handleSubmit(value, "edit")}
            type={"update"}
            sendState={this.state.sendState}
            onClickClose={this.openCloseEdit.bind(this)}
            employeeDataEmergency={this.state.employeeData.employeeEmergencyContacts[this.state.selectedIndex]}
          />
        )}

        {this.state.viewVisible && (
          <FormEmergencyContact
            type={"view"}
            onClickClose={this.openCloseView.bind(this)}
            employeeDataEmergency={this.state.employeeData.employeeEmergencyContacts[this.state.selectedIndex]}
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

export default connect(mapStateToProps, mapDispatchToProps)(formEmergencyContactEmployee);



