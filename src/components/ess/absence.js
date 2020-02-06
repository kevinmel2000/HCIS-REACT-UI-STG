import React, { Component } from "react";
import PopUp from "../../components/pages/PopUpAlert";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import LoadingBar from "react-top-loading-bar";
import FormAbsenceDetail from "../../modules/formEss/formAbsenceDetail";
import API from "../../Services/Api";
import { connect } from "react-redux";
import M from "moment";
import ResizeSlider from "../../modules/resize/Slider";
import SplitPaneSecond from "react-split-pane";
import { Redirect } from "react-router-dom";
import * as R from "ramda";
import AuthAction from "../../Redux/AuthRedux";
import IdleTimer from "react-idle-timer";
import WebsocketNotif from '../../modules/popup/WebsocketNotif'
import Stomp from 'stompjs'

var ct = require("../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class absence extends Component {
  constructor(props) {
    super(props);
    this.state = {
      savePopUpVisible: false,
      deletePopUpVisible: false,
      confirmPopUpVisible: false,
      confirmPopUpVisibleSubmit: false,
      createVisible: false,
      editVisible: false,
      viewVisible: false,
      auth: props.auth,
      rawData: [],
      selectedIndex: null,
      allowResize: false,
      defaultSize: 0,
      minSize: 0,
      maxSize: 0,
      timeout: 1000 * 100 * 9,
      isTimedOut: false,
      notifVisible: false,
      messages: "",
      sendState:""
    };
    this.idleTimer = null;
    this.handleSave = this.handleSave.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  logout() {
    this.props.authLogout();
    return <Redirect to={{ pathname: "/" }}></Redirect>;
  }

  onAction() {
    this.setState({ isTimedOut: false });
  }

  onActive() {
    this.setState({ isTimedOut: false });
  }

  onIdle() {
    const isTimedOut = this.state.isTimedOut;
    if (isTimedOut) {
      alert("Your session has timed out. Please log in again");
      this.logout();
    } else {
      this.idleTimer.reset();
      this.setState({ isTimedOut: true });
    }
  }

  opResizePane = () => {
    this.setState({
      allowResize: true,
      defaultSize: 370,
      minSize: 370,
      maxSize: 870
    });
  };

  opSidePage = (menu, index) => e => {
    e.preventDefault();
    this.setState({
      editVisible: false,
      viewVisible: false
    });

    this.opResizePane();

    switch (menu) {
      case "slide-timesheet":
        this.setState({
          editVisible: true,
          selectedIndex: index
        });
        break;
      case "slide-timesheet-view":
        this.setState({
          viewVisible: true,
          selectedIndex: index
        });
        break;
      default:
        break;
    }
  };

  clResizePane = () => {
    this.setState({
      allowResize: false,
      defaultSize: 0,
      minSize: 0,
      maxSize: 0
    });
  };

  connectWebsocket(method) {
    let stompClient = Stomp.client(process.env.REACT_APP_HCIS_WEBSOCKET);
    let employeeID = this.props.auth.user.employeeID
    stompClient.debug = null;
    stompClient.connect({}, (frame) => {
      console.log('Connected: ' + frame)
      stompClient.subscribe('/topic/hcis.request/' + method + employeeID, (message) => {
        let res = JSON.parse(message.body)
        console.log('messages: ' + res.messages)
        setTimeout(() => {
          this.setState({ sendState: "finished" })
          setTimeout(() => {
            this.setState({ notifVisible: true, messages: res.messages, editVisible: false, viewVisible: false, createVisible: false })
            this.clResizePane()
            this.getTimesheet()
            setTimeout(() => {
              this.setState({ notifVisible: false, sendState: "" })
            }, 2000)
          }, 500);
        }, 500);
      })
    })
  }

  
  closeNotif() {
    this.setState({ notifVisible: false })
  }


  getTimesheet() {
    let payload = {
      limit: 100,
      offset: 0,
      params: {
        hcisRequestBy: this.state.auth.user.employeeID
      }
    };
    API.create("REQUEST_QUERY")
      .getRequestByType(payload)
      .then(res => {
        if (res.status === 200) {
          if (res.data.status === "S") {
            this.onFinishFetch();
            let dataTableTime = res.data.data.map((payload, index) => {
              const {
                hcisRequestID,
                hcisRequestPayload,
                requestStatus,
                hcisRequestDate
              } = payload;

              return [
                (index += 1),
                hcisRequestID,
                hcisRequestDate.split(" ")[0] + " | " + hcisRequestDate.split(" ")[1],
                hcisRequestPayload.absenceType.split("_").join(" "),
                hcisRequestPayload.absenceReason,
                requestStatus.replace(/_/g, " ")
              ];
            });
            this.setState({
              rawData: res.data.data,
              dataTableTime
            });
          } else {
            alert("Failed: " + res.data.message);
            this.onFinishFetch();
          }
        } else if (res.status === 504) {
          alert("504 - Time Out");
          this.onFinishFetch();
        } else {
          alert("Failed: " + res.message);
          this.onFinishFetch();
        }
      });
  }

  async handleSave(payload) {
    this.setState({ sendState: "loading" })
    payload = {
      ...payload,
      hcisRequestDate: payload.createdDate,
      hcisRequestPayload: {
        employeeID: this.state.auth.user.employeeID,
        absenceTime: payload.createdDate,
        absenceType: payload.hcisRequestPayload.absenceType,
        absenceReason: payload.hcisRequestPayload.absenceReason
      },
      createdBy: this.state.auth.user.employeeID,
      updatedBy: this.state.auth.user.employeeID,
      createdDate: payload.createdDate,
      hcisRequestBy: this.state.auth.user.employeeID,
      esID: this.state.auth.user.companyID
    };
    this.connectWebsocket("post/")
    console.log(JSON.stringify(payload))
    let response = await API.create("REQUEST").postTimesheet(payload);
    console.log(response);
    if (response.ok && response.data.status === "S") {
      this.openSavePopUp(); 
      this.setState({
        confirmPopUpVisible: false
      })
    }
  }

  async handleSubmit(payload) {
    payload = {
      taskID: "",
      senderUserID: this.state.auth.user.userID,
      senderEmpID: this.state.auth.user.employeeID,
      senderNotes: "",
      senderBPMStatus: "INITIATE",
      data: {
        hcisRequestID: payload.hcisRequestID,
        hcisRequestDate:
          payload.hcisRequestDate !== ""
            ? payload.hcisRequestDate
            : M().format("DD-MM-YYYY HH:mm:ss"),
        hcisRequestPayload: {
          employeeID: this.state.auth.user.employeeID,
          absenceTime:
            payload.hcisRequestPayload.absenceTime !== ""
              ? payload.hcisRequestPayload.absenceTime
              : M().format("DD-MM-YYYY HH:mm:ss"),
          absenceType: payload.hcisRequestPayload.absenceType,
          absenceReason: payload.hcisRequestPayload.absenceReason
        },
        hcisRequestBy: this.state.auth.user.employeeID,
        esID: this.state.auth.user.companyID,
        requestType: "ABSENCE_REQUEST",
        requestStatus: payload.requestStatus,
        createdDate:
          payload.hcisRequestCreationalDTO !== undefined
            ? payload.hcisRequestCreationalDTO.createdDate
            : M().format("DD-MM-YYYY HH:mm:ss"),
        updatedBy: this.state.auth.user.employeeID,
        updatedDate: null
      }
    };
    let response = await API.create("BPM").submitTimesheet(payload);
    console.log(response);
    if (response.ok && response.data.status === "S") {
      this.openSavePopUp();
    }
  }

  async updateAbsence(payload) {
    this.setState({ sendState: "loading" })
    payload = {
      ...payload,
      hcisRequestBy: payload.hcisRequestBy.employeeID,
      hcisRequestPayload: {
        employeeID: payload.hcisRequestPayload.employeeID,
        absenceTime: payload.hcisRequestPayload.absenceTime,
        absenceReason: payload.hcisRequestPayload.absenceReason,
        absenceType: payload.hcisRequestPayload.absenceType
      },
      esID: payload.esID === null ? "" : payload.esID.esID,
      createdBy: this.state.auth.user.employeeID,
      updatedBy: this.state.auth.user.employeeID,
      updatedDate: M().format("DD-MM-YYYY HH:mm:ss")
    };
    this.connectWebsocket("put/")
    let response = await API.create("REQUEST").updateTimesheet(payload);
    console.log(response);
    if (response.ok && response.data.status === "S") {
      this.openSavePopUp(); 
      this.setState({
        confirmPopUpVisible: false
      })
    }
  }

  handleUpdate = payload => {
    this.updateAbsence(payload);
  };

  deleteTimesheet() {
    let payload = {
      hcisRequestID: this.state.rawData[this.state.selectedIndex].hcisRequestID,
      updatedBy: this.state.auth.user.employeeID
    };
    this.connectWebsocket("delete/")
    API.create("REQUEST")
      .deleteTimesheet(payload)
      .then(res => {
        if (res.status === 200) {
          if (res.data.status === "S") {
            this.setState({ deletePopUpVisible: false, dataTable: [] });
            this.clResizePane();
            this.getTimesheet({
              offset: 0,
              limit: 100
            });
          } else {
            alert("Failed: " + res.data.message);
          }
        } else {
          console.log(res);
        }
      });
  }

  handleDelete = () => {
    this.deleteTimesheet();
  };

  openCreateForm = (index = null) => {
    this.clResizePane();
    this.setState({
      createVisible: !this.state.createVisible,
      selectedIndex: index
    });
  };

  openSavePopUp = () => {
    if (this.state.savePopUpVisible) this.getTimesheet();
    this.clResizePane();
    this.setState({
      savePopUpVisible: !this.state.savePopUpVisible,
      confirmPopUpVisible: false,
      confirmPopUpVisibleSubmit: false,
      createVisible: false,
      editVisible: false
    });
  };

  openConfirmPopUp = data => {
    if (this.state.confirmPopUpVisible) this.getTimesheet();
    this.setState({
      dataPayload: data,
      confirmPopUpVisible: !this.state.confirmPopUpVisible
    });
  };

  openConfirmPopUpSubmit = data => {
    if (this.state.confirmPopUpVisibleSubmit) this.getTimesheet();
    this.setState({
      dataPayload: data,
      confirmPopUpVisibleSubmit: !this.state.confirmPopUpVisibleSubmit
    });
  };

  openDeletePopup = index => {
    this.setState({
      deletePopUpVisible: !this.state.deletePopUpVisible,
      selectedIndex: index
    });
  };

  componentDidMount() {
    if (!R.isNil(this.props.auth.user)) {
      this.startFetch();
      this.getTimesheet();
    }
  }

  startFetch = () => {
    this.LoadingBar.continousStart();
  };

  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
  };

  columns = [
    "No",
    "Request ID",
    "Current Date & Time",
    "Absence Type",
    "Reason",
    {
      name: "Status",
      options: {
        customBodyRender: val => {
          return (
            <div>
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
                  marginRight: 10,
                  padding: "5px"
                }}
              />
              {val}
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
            <div>
              {String(tableMeta.rowData).includes("INITIATE") ?
                <button
                  type="button"
                  className="btnAct"
                  style={{ marginRight: 15, backgroundColor: 'transparent' }}
                  onClick={this.opSidePage("slide-timesheet", tableMeta.rowIndex)}
                >
                  <i className="fa fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                </button> :
                <div />
              }
              {String(tableMeta.rowData).includes("INITIATE") ?
                <button
                  type="button"
                  className="btnAct"
                  style={{ marginRight: 15, backgroundColor: 'transparent' }}
                  onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
                >
                  <i className="fa fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                </button> :
                <div />
              }
              <button
                className="btnAct"
                style={{ marginRight: 15, backgroundColor: 'transparent' }}
                onClick={this.opSidePage(
                  "slide-timesheet-view",
                  tableMeta.rowIndex
                )}
              >
                <i className="fa fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
              </button>
            </div>
          );
        }
      }
    }
  ];

  render() {
    if (R.isNil(this.props.auth.user))
      return <Redirect to={{ pathname: "/" }}></Redirect>;
    return (
      <SplitPaneSecond
        split="vertical"
        defaultSize={0}
        minSize={0}
        maxSize={0}
        primary="first"
        className="main-slider"
        style={{ height: "calc(100vh - 50px)" }}
      >
        <div className="col-1"></div>
        <div className="col-2">
          <IdleTimer
            ref={ref => {
              this.idleTimer = ref;
            }}
            element={document}
            onActive={this.onActive.bind(this)}
            onIdle={this.onIdle.bind(this)}
            onAction={this.onAction.bind(this)}
            debounce={250}
            timeout={this.state.timeout}
          />
          <div>
            <ResizeSlider
              allowResize={this.state.allowResize}
              defaultSize={this.state.defaultSize}
              minSize={this.state.minSize}
              maxSize={this.state.maxSize}
              main={
                <div>
                  <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
                  <div className="a-s-p-place a-s-p-content active">
                    <div className="a-s-p-top">
                      <div className="col-2 content-right">
                        <button
                          type="button"
                          className="btn btn-circle background-blue"
                          style={{ marginRight: 10 }}
                          onClick={() => this.openCreateForm()}
                        >
                          <i className="fa fa-1x fa-plus" />
                        </button>
                      </div>
                    </div>
                    <div className="a-s-p-mid">
                      <div className="padding-10px">
                        <div className="app-open-close margin-bottom-20px">
                          <div className="app-open-close-content">
                            <MuiThemeProvider theme={getMuiTheme()}>
                              <MUIDataTable
                                title="Employee Self Service - Timesheet"
                                subtitle={'lorem ipsum dolor'}
                                data={this.state.dataTableTime}
                                columns={this.columns}
                                options={options}
                              />
                            </MuiThemeProvider>
                          </div>
                        </div>
                      </div>
                      {this.state.createVisible && (
                        <FormAbsenceDetail
                          type={"create"}
                          sendState={this.state.sendState}
                          onClickClose={this.openCreateForm}
                          onClickSave={this.openConfirmPopUp.bind(this)}
                          onClickSubmit={this.openConfirmPopUpSubmit.bind(this)}
                        />
                      )}
                    </div>
                  </div>
                </div>
              }
              side={
                <div className="a-s-p-side">
                  {/* edit */}
                  {this.state.editVisible && (
                    <FormAbsenceDetail
                      type={"edit"}
                      sendState={this.state.sendState}
                      data={this.state.rawData[this.state.selectedIndex]}
                      onClickSave={this.openConfirmPopUp.bind(this)}
                      onClickSubmit={this.openConfirmPopUpSubmit.bind(this)}
                      closeSlide={this.clResizePane}
                    />
                  )}
                  {/* view */}
                  {this.state.viewVisible && (
                    <FormAbsenceDetail
                      type={"view"}
                      data={this.state.rawData[this.state.selectedIndex]}
                      closeSlide={this.clResizePane}
                    />
                  )}
                </div>
              }
            ></ResizeSlider>

            {this.state.confirmPopUpVisible && (
              <PopUp
                type={"simpan"}
                class={"app-popup app-popup-show"}
                onClick={this.openConfirmPopUp.bind(this)}
                onClickSimpan={
                  this.state.createVisible === true
                    ? () => this.handleSave(this.state.dataPayload)
                    : () => this.handleUpdate(this.state.dataPayload)
                }
              />
            )}

            {this.state.confirmPopUpVisibleSubmit && (
              <PopUp
                type={"simpan"}
                class={"app-popup app-popup-show"}
                onClick={this.openConfirmPopUpSubmit.bind(this)}
                onClickSimpan={() => this.handleSubmit(this.state.dataPayload)}
              />
            )}


            {this.state.notifVisible && (
              <WebsocketNotif message={this.state.messages} type={"float"} onClickClose={this.closeNotif.bind(this)} />
            )}

            {this.state.savePopUpVisible && (
              <PopUp
                type={"save"}
                class={"app-popup app-popup-show"}
                onClick={this.openSavePopUp.bind(this)}
              />
            )}

            {this.state.deletePopUpVisible && (
              <PopUp
                type={"delete"}
                class={"app-popup app-popup-show"}
                onClickDelete={this.handleDelete}
                onClick={this.openDeletePopup}
              />
            )}
          </div>
        </div>
      </SplitPaneSecond>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    authLogout: () => dispatch(AuthAction.authLogout())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(absence);
