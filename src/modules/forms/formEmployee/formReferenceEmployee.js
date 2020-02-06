import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import FormReference from '../../forms/formEmployee/formReference';
import PopUp from '../../../components/pages/PopUpAlert'
import { connect } from 'react-redux';
import EmployeeAction from '../../../Redux/EmployeeRedux'
import API from '../../../Services/Api'
import * as R from 'ramda'
import M from 'moment'
import AuthAction from '../../../Redux/AuthRedux'
import Stomp from 'stompjs'

var ct = require("../../custom/customTable");

class FormReferenceEmployee extends Component {
  constructor(props) {
    super(props)
    let { employeeData } = this.props

    this.state = {
      createVisible: false,
      editVisible: false,
      viewVisible: false,
      createPopUpVisible: false,
      deletePopUpVisible: false,
      employeeData,
      auth: props.auth,
      dataTableReference: [],
      notifVisible: false,
      message: "",
      sendState: ""
    }
  }

  componentDidMount() {
    this.getBizparReference()
    this.getDataReference(this.state.employeeData)
  }

  componentWillReceiveProps(newProps) {
    let { employeeData } = newProps
    this.setState({ employeeData })
    this.getDataReference(employeeData)
  }

  connectWebsocket = async () => {
    let stompClient = Stomp.client(process.env.REACT_APP_HCIS_WEBSOCKET);
    let employeeID = this.props.auth.user.employeeID
    stompClient.debug = null;
    stompClient.connect({}, (frame) => {
      console.log('Connected: ' + frame)
      stompClient.subscribe('/topic/employee/put.employee.reference/' + employeeID, (message) => {
        let res = JSON.parse(message.body)
        console.log('messages: ' + res.messages)
        setTimeout(() => {
          this.setState({ sendState: "finished" }, () => {
              setTimeout(() => {
                  this.setState({ message: res.messages, editVisible: false, viewVisible: false, createVisible: false })
                  this.props.onSelect({
                      messages: res.messages,
                      // formEmployeeDataVisible: false,
                      // formReferenceVisible: false,
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

  getBizparReference() {
    let payloadReference = {
      params: {
        bizparCategory: "REFERENCE_TYPE"
      },
      offset: 0,
      limit: 10
    }
    API.create('BIZPAR').getBizparByCategory(payloadReference).then(
      (res) => {
        if (res.status === 200) {
          console.log(res.data);
          if (res.data.status === 'S') {
            console.log(res.data)
            this.setState({
              bizparReference: res.data.data
            })
          }
        }
      }
    )
  }

  getDataReference(employeeData) {
    let dataTableReference = employeeData.employeeReferences.map((value) => {
      const { employeeReferenceID, referenceType, referencePersonName, referencePersonAddress, referencePersonTelpNumber, referencePersonOccupation, referencePersonRelationship, referenceNotes } = value;
      return [
        employeeReferenceID,
        referenceType.bizparValue,
        referencePersonName,
        referencePersonAddress,
        referencePersonTelpNumber,
        referencePersonOccupation,
        referencePersonRelationship,
        referenceNotes
      ]
    })
    this.setState({ dataTableReference })
  }

  openCloseCreate() {
    let createPopUpVisible = this.state.createPopUpVisible ? !this.state.createPopUpVisible : false;
    this.setState({ createVisible: !this.state.createVisible, createPopUpVisible });
  }

  openCloseEdit(selectedIndex) {
    let createPopUpVisible = this.state.createPopUpVisible ? !this.state.createPopUpVisible : false;
    this.setState({ editVisible: !this.state.editVisible, createPopUpVisible, selectedIndex });
  }

  openCloseView(selectedIndex) {
    this.setState({ viewVisible: !this.state.viewVisible, selectedIndex });
  }

  openDeletePopup(selectedIndex) {
    this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible, selectedIndex })
  }

  handleSubmit(value, type = "") {
    this.setState({ sendState: "loading" })
    this.connectWebsocket()
    let { employeeReferences, employeeID } = this.state.employeeData
    let data = Object.assign([], employeeReferences)
    data = data.map((value, index) => {
      return {
        ...value,
        referenceType: value.referenceType.bizparKey
      }
    })

    switch (type) {
      case "create":
        value = {
          ...value,
          employeeReferenceID: "R-" + M(),
          referenceType: value.referenceType.bizparKey
        }
        data.push(value)
        break;
      case "edit":
        value = {
          ...value,
          referenceType: value.referenceType.bizparKey
        }
        let status = R.findIndex(R.propEq('employeeReferenceID', value.employeeReferenceID))(data)
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

    employeeReferences = data
    let payload = {
      employeeID,
      employeeReferences,
      "updatedBy": this.state.auth.user.employeeID,
      "updatedDate": M().format("DD-MM-YYYY HH:mm:ss")
    }

    API.create('EMPLOYEE').updateEmployeeReference(payload).then(
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

  columnsReference = [
    "Reference Number",
    "Reference Type",
    "Name",
    "Address",
    "Phone",
    "Job/Position",
    "Relationship",
    "Information",
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            this.props.type !== 'view' ?
              <div className="grid grid-3x">
                <div className="col-1">
                  <button
                    type="button"
                    className="btnAct"
                    style={{ marginRight: 15 }}
                    onClick={() => this.openCloseEdit(tableMeta.rowIndex)}
                  >
                    <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                  </button>
                </div>
                <div className="col-2">
                  <button
                    type="button"
                    className="btnAct"
                    style={{ marginRight: 15 }}
                    onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
                  >
                    <i className="fa fa-lw fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                  </button>
                </div>
                <div className="col-3">
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
    return (
      <div className="vertical-tab-content active">
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
                title='Reference'
                subtitle={"lorem ipsum dolor"}
                data={this.state.dataTableReference}
                columns={this.columnsReference}
                options={this.options}
              />
            </MuiThemeProvider>
          </div>
          


          {this.state.createVisible && (
            <FormReference
              type={"create"}
              sendState={this.state.sendState}
              bizparReference={this.state.bizparReference}
              onClickClose={this.openCloseCreate.bind(this)}
              onClickSave={(value) => this.handleSubmit(value, "create")}
            />
          )}

          {this.state.editVisible && (
            <FormReference
              type={"update"}
              sendState={this.state.sendState}
              bizparReference={this.state.bizparReference}
              onClickClose={this.openCloseEdit.bind(this)}
              onClickSave={(value) => this.handleSubmit(value, "edit")}
              employeeDataReference={this.state.employeeData.employeeReferences[this.state.selectedIndex]}
            />

          )}
          {this.state.viewVisible && (
            <FormReference
              type={"view"}
              bizparReference={this.state.bizparReference}
              onClickClose={this.openCloseView.bind(this)}
              employeeDataReference={this.state.employeeData.employeeReferences[this.state.selectedIndex]}
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

        </form>
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

export default connect(mapStateToProps, mapDispatchToProps)(FormReferenceEmployee)