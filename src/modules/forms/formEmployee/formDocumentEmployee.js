import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import PopUp from "../../../components/pages/PopUpAlert";
import FormDocument from "./formDocumentEm";
import API from '../../../Services/Api';
import { connect } from 'react-redux';
import EmployeeAction from '../../../Redux/EmployeeRedux'
import M from 'moment'
import * as R from 'ramda'
import AuthAction from '../../../Redux/AuthRedux'
import Stomp from 'stompjs'

var ct = require("../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

class formDocumentEmployee extends Component {
  constructor(props) {
    super(props);
    let { employeeData, bizparDocument } = this.props;

    this.state = {
      employeeData,
      dataTableDocument: [],
      createVisible: false,
      createPopUpVisible: false,
      deletePopUpVisible: false,
      editVisible: false,
      viewVisible: false,
      refreshing: false,
      fetching: false,
      notifVisible: false,
      message: "",
      auth: props.auth,
      bizparDocument,
      sendState: "",
      isWeb: false,
      defaultValue: []
    };
  }

  componentDidMount() {
    this.getAllDocument(this.state.employeeData);
  }

  componentWillReceiveProps(newProps) {
    let { employeeData } = newProps
    this.setState({ employeeData })
    this.getAllDocument(employeeData)
  }

  connectWebsocket = async (type) => {
    let stompClient = Stomp.client(process.env.REACT_APP_HCIS_WEBSOCKET);
    let employeeID = this.props.auth.user.employeeID
    stompClient.debug = null;
    stompClient.connect({}, (frame) => {
      console.log('Connected: ' + frame)
      stompClient.subscribe('/topic/employee/put.employee.document/' + employeeID, (message) => {
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
        }, 500);
      })
    })
  }

  closeNotif() {
    this.setState({ notifVisible: false })
  }

  getAllDocument(employeeData) {
    let dataTableDocument = employeeData.employeeDocuments.map(value => {
      const {
        employeeDocumentID,
        documentType,
        documentNotes
      } = value;
      return [
        employeeDocumentID,
        documentType && documentType.bizparValue,
        documentNotes
      ];
    });
    this.setState({ dataTableDocument });
  }

  handleSubmit(value, type = "") {
    this.setState({ sendState: "loading", defaultValue: value })
    this.connectWebsocket(type)
    let { employeeDocuments, employeeID } = this.state.employeeData
    let data = Object.assign([], employeeDocuments)
    data = data.map((value, index) => {
      return {
        ...value,
        documentType: value.documentType.bizparKey
      }
    })

    switch (type) {
      case "create":
        value = {
          ...value,
          employeeDocumentID: "DOC-" + M(),
          documentType: value.documentType.bizparKey
        }
        data.push(value)
        break;
      case "edit":
        value = {
          ...value,
          documentType: value.documentType.bizparKey
        }
        let status = R.findIndex(R.propEq('employeeDocumentID', value.employeeDocumentID))(data)
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

    employeeDocuments = data
    let payload = {
      employeeID,
      employeeDocuments,
      "updatedBy": this.state.auth.user.employeeID,
      "updatedDate": M().format("DD-MM-YYYY HH:mm:ss")
    }

    console.log('payload =>', JSON.stringify(payload))

    API.create('EMPLOYEE').updateEmployeeDocument(payload).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            console.log(res.data)
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

  async getReport(selectedIndex) {
    let { employeeData } = this.state
    let employeeID = employeeData.employeeID
    let documentType = employeeData.employeeDocuments[selectedIndex].documentType.bizparKey
    let response = await fetch(process.env.REACT_APP_HCIS_BE_API + "emcmd/api/employee.document.get/" + employeeID + "/" + documentType, {
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4",
        "Content-Type": "application/pdf"
      }
    })
    response = await response.blob()
    if (response.size > 0) {
      response = URL.createObjectURL(response);
      // window.open(response);
      let a = document.createElement('a');
      a.href = response;
      a.download = employeeData.employeeDocuments[selectedIndex].documentURL;
      a.click()
    } else {
      alert("Failed: Document Not Found")
    }
  }

  handleDelete() {
    this.deleteDocument();
  }

  //document
  columnsDocument = [
    "Document Number",
    "Type",
    "Information",
    {
      name: "Document",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              <button
                type="button"
                className="btnAct"
                style={{ marginRight: 15 }}
                onClick={() => this.getReport(tableMeta.rowIndex)}
              >
                <i className="fa fa-1x fa-download" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
              </button>
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
                <i className="fa fa-lw fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
              </button>
          );
        }
      }
    }
  ];

  dataDocument = [["001", "SIM C", "322322322322"]];

  render() {
    let { selectedIndex } = this.state;
    return (
      <div className="vertical-tab-content active" id="content-nav-3">
        <form action="#">
          <div className="padding-10px  grid-mobile-none gap-20px">
            <div className="col-1 content-right">
              {this.props.type !== 'view' ?
                <button
                  onClick={this.openCloseCreate.bind(this)}
                  type="button"
                  className="btn btn-circle background-blue"
                >
                  <i className="fa fa-1x fa-plus" />
                </button>
                : null}
            </div>
            <div className="padding-5px" />
            <MuiThemeProvider theme={getMuiTheme()}>
              <MUIDataTable
                title='Document'
                subtitle={"lorem ipsum dolor"}
                data={this.state.dataTableDocument}
                columns={this.columnsDocument}
                options={options}
              />
            </MuiThemeProvider>
          </div>
        </form>
        {this.state.createVisible && (
          <FormDocument
            type={"create"}
            sendState={this.state.sendState}
            bizparDocument={this.state.bizparDocument}
            onClickSave={(value) => this.handleSubmit(value, "create")}
            onClickClose={this.openCloseCreate.bind(this)}
            employeeData={this.state.employeeData}
          />
        )}
        {this.state.editVisible && (
          <FormDocument
            type={"update"}
            sendState={this.state.sendState}
            onClickSave={(value) => this.handleSubmit(value, "edit")}
            onClickClose={this.openCloseEdit.bind(this)}
            bizparDocument={this.state.bizparDocument}
            employeeData={this.state.employeeData}
            employeeDataDocuments={this.state.employeeData.employeeDocuments[selectedIndex]}
          />
        )}
        {this.state.viewVisible && (
          <FormDocument
            type={"view"}
            sendState={this.state.sendState}
            onClickClose={this.openCloseView.bind(this)}
            bizparDocument={this.state.bizparDocument}
            employeeData={this.state.employeeData}
            employeeDataDocuments={this.state.employeeData.employeeDocuments[selectedIndex]}
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

export default connect(mapStateToProps, mapDispatchToProps)(formDocumentEmployee);




