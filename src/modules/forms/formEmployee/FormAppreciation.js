import React, { Component } from 'react';
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import LoadingBar from "react-top-loading-bar";
import FormAppreciationCreate from './formAppreciationCreate';
import PopUp from "../../../components/pages/PopUpAlert";
import { connect } from 'react-redux';
import EmployeeAction from '../../../Redux/EmployeeRedux'
import API from '../../../Services/Api'
import M from 'moment'
import * as R from 'ramda'
import AuthAction from '../../../Redux/AuthRedux'
import Stomp from 'stompjs'

var ct = require("../../../modules/custom/customTable");

class formAppreciation extends Component {
  constructor(props) {
    super(props)
    let { employeeData, bizparAppreciationType } = this.props
    this.state = {
      employeeData,
      bizparAppreciationType,
      createVisible: false,
      editVisible: false,
      viewVisible: false,
      createPopUpVisible: false,
      deletePopUpVisible: false,
      notifVisible: false,
      message: "",
      auth: props.auth,
      sendState: "",
    };
  }

  componentDidMount() {
    this.getAllAppreciation(this.state.employeeData);
  }

  componentWillReceiveProps(newProps) {
    let { employeeData } = newProps
    this.setState({ employeeData })
    this.getAllAppreciation(employeeData)
  }

  connectWebsocket = async () => {
    let stompClient = Stomp.client(process.env.REACT_APP_HCIS_WEBSOCKET);
    let employeeID = this.props.auth.user.employeeID
    stompClient.debug = null;
    stompClient.connect({}, (frame) => {
      console.log('Connected: ' + frame)
      stompClient.subscribe('/topic/employee/put.employee.appreciation/' + employeeID, (message) => {
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

  getAllAppreciation(employeeData) {
    let dataTableAppreciation = employeeData.employeeAppreciations.map(
      value => {
        const {
          appreciationName,
          appreciationNotes,
          appreciationDate,
          appreciationDocumentURL,
          appreciationType
        } = value;
        return [
          R.isNil(appreciationDate) ? '' : M(appreciationDate, 'DD-MM-YYYY').format('DD/MM/YYYY'),
          appreciationType.bizparValue,
          appreciationName,
          appreciationNotes,
          R.isNil(appreciationDocumentURL) ? '' : appreciationDocumentURL.split("document/emp_doc/app/")
        ];
      }
    );
    this.setState({ dataTableAppreciation });
  }


  openCloseCreate(index) {
    let createPopUpVisible = this.state.createPopUpVisible ? !this.state.createPopUpVisible : false;
    this.setState({ createVisible: !this.state.createVisible, createPopUpVisible, selectedindex: index })
  }

  openCloseEdit(index) {
    let createPopUpVisible = this.state.createPopUpVisible ? !this.state.createPopUpVisible : false;
    this.setState({ editVisible: !this.state.editVisible, createPopUpVisible, selectedindex: index })
  }

  openCloseView(index) {
    this.setState({ viewVisible: !this.state.viewVisible, selectedindex: index })
  }

  openDeletePopup(index) {
    this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible, selectedIndex: index })
  };
  
  openSavePopup() {
    this.setState({ createPopUpVisible: !this.state.createPopUpVisible })
  };

  startFetch = () => {
    this.LoadingBar.continousStart();
  };

  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
  };

  getMuiTheme = () => createMuiTheme(ct.customTable());

  options = ct.customOptions();

  columnAppreciation = [
    "Period",
    "Appreciation Type",
    "Appreciation Name",
    "Information",
    "Document",
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            this.props.type !== "view" ?
              <div className="grid grid-3x">
                <div className="col-1">
                  <button
                    className="btnAct"
                    style={{ marginRight: 15 }}
                    onClick={() => this.openCloseEdit(tableMeta.rowIndex)}
                    >
                    <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                  </button>
                </div>
                <div className="col-2">
                  <button
                    className="btnAct"
                    style={{ marginRight: 15 }}
                    onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
                  >
                    <i className="fa fa-lw fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                  </button>
                </div>
                <div className="col-3">
                  <button
                    className="btnAct"
                    onClick={() => this.openCloseView(tableMeta.rowIndex)}
                  >
                    <i className="fa fa-lw fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                  </button>
                </div>
              </div> :
                <button
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

  handlePopUp = () => {
    this.setState({
      savePopUpVisible: false

    })
  }

  handleSubmit(value, type = "") {
    this.setState({ sendState: "loading" })
    this.connectWebsocket()
    let { employeeAppreciations, employeeID } = this.state.employeeData
    let data = Object.assign([], employeeAppreciations)
    data = data.map((value, index) => {
      return {
        ...value,
        appreciationType: value.appreciationType.bizparKey,
      }
    })
    switch (type) {
      case "create":
        value = {
          ...value,
          employeeAppreciationID: "EMA-" + M(),
          appreciationDate: R.isEmpty(value.appreciationDate) ? '' : M(value.appreciationDate, 'YYYY-MM-DD').format('DD-MM-YYYY'),
          appreciationType: value.appreciationType.bizparKey,
        }
        data.push(value)
        break;
      case "update":
        value = {
          ...value,
          appreciationDate: value.appreciationDate === 'Invalid date' || R.isNil(value.appreciationDate) || R.isEmpty(value.appreciationDate) ? '' : M(value.appreciationDate, 'YYYY-MM-DD').format('DD-MM-YYYY'),
          appreciationType: value.appreciationType.bizparKey,
        }
        let status = R.findIndex(R.propEq('employeeAppreciationID', value.employeeAppreciationID))(data)
        if (status >= 0) {
          data[status] = value
        }
        break;
      case "delete":
        // return console.log(this.state.selectedIndex)
        data.splice(this.state.selectedIndex, 1)
        break;
      default:
        break
    }

    employeeAppreciations = data
    let payload = {
      employeeID,
      employeeAppreciations,
      "updatedBy": this.state.auth.user.employeeID,
      "updatedDate": M().format("DD-MM-YYYY HH:mm:ss")
    }
    // return console.log(payload)
    API.create('EMPLOYEE').updateEmployeeAppreciation(payload).then(
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
      <div className="vertical-tab-content active" id="content-nav-3">
        <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
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
              title='Appreciation'
              subtitle={"lorem ipsum dolor"}
              data={this.state.dataTableAppreciation}
              columns={this.columnAppreciation}
              options={this.options}
            />
          </MuiThemeProvider>
        </div>

        {this.state.createVisible && (
          <FormAppreciationCreate
            type={"create"}
            sendState={this.state.sendState}
            employeeID={this.state.employeeData.employeeID}
            bizparAppreciationType={this.state.bizparAppreciationType}
            onClickSave={(value) => this.handleSubmit(value, "create")}
            onClickClose={this.openCloseCreate.bind(this)}
          />
        )}

        {this.state.editVisible && (
          <FormAppreciationCreate
            type={"edit"}
            sendState={this.state.sendState}
            employeeID={this.state.employeeData.employeeID}
            appreciationData={this.state.employeeData.employeeAppreciations[this.state.selectedindex]}
            bizparAppreciationType={this.state.bizparAppreciationType}
            onClickSave={(value) => this.handleSubmit(value, "update")}
            onClickClose={this.openCloseEdit.bind(this)}
          />
        )}

        {this.state.viewVisible && (
          <FormAppreciationCreate
            type={"view"}
            sendState={this.state.sendState}
            employeeID={this.state.employeeData.employeeID}
            appreciationData={this.state.employeeData.employeeAppreciations[this.state.selectedindex]}
            bizparAppreciationType={this.state.bizparAppreciationType}
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

export default connect(mapStateToProps, mapDispatchToProps)(formAppreciation);
