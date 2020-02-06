import React, { Component } from "react";
import PopUp from "../../components/pages/PopUpAlert";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import API from "../../Services/Api";
import LoadingBar from "react-top-loading-bar";
import { connect } from "react-redux";
import M from "moment";
import FormOvertime from "../../modules/formEss/formOvertime";
import { Redirect } from "react-router-dom";
import AuthAction from "../../Redux/AuthRedux";
import IdleTimer from "react-idle-timer";
import * as R from "ramda";
import ResizeSlider from "../../modules/resize/Slider";
import SplitPaneSecond from "react-split-pane";
import WebsocketNotif from '../../modules/popup/WebsocketNotif'
import Stomp from 'stompjs'

var ct = require("../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class Overtime extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmPopUpVisible: false,
      confirmPopUpVisibleSubmit: false,
      savePopUpVisible: false,
      deletePopUpVisible: false,
      rawData: [],
      rawDataHead: [],
      rawDataEmp: [],
      selectedIndex: [],
      dataTableOvertime: [],
      bizparOvertimeType: [],
      createVisible: false,
      editVisible: false,
      viewVisible: false,
      auth: props.auth,
      timeout: 1000 * 100 * 9,
      isTimedOut: false,
      allowResize: false,
      defaultSize: 0,
      minSize: 0,
      maxSize: 0,
      notifVisible: false,
      messages: "",
      sendState: ""
    };
    this.idleTimer = null;
    this.handleSave = this.handleSave.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
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
      case "slide-overtime-edit":
        this.setState({
          editVisible: true,
          selectedIndex: index
        });
        break;
      case "slide-overtime-view":
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

  componentDidMount() {
    if (!R.isNil(this.props.auth.user)) {
      this.startFetch();
      this.getDataHead();
      this.getDataOvertime();
      this.getBizparOvertimeType();
      this.getEmployee();
    }
  }

  connectWebsocket(method) {
    let stompClient = Stomp.client(process.env.REACT_APP_HCIS_WEBSOCKET);
    let employeeID = this.props.auth.user.employeeID
    stompClient.debug = null;
    stompClient.connect({}, (frame) => {
      console.log('Connected: ' + frame)
      stompClient.subscribe('/topic/overtime/' + method + employeeID, (message) => {
        let res = JSON.parse(message.body)
        console.log('messages: ' + res.messages)
        setTimeout(() => {
          this.setState({ sendState: "finished" })
          setTimeout(() => {
            this.setState({ notifVisible: true, messages: res.messages, createVisible: false, editVisible: false })
            this.clResizePane()
            this.getDataOvertime()
            setTimeout(() => {
              this.setState({ notifVisible: false, sendState: "" })
            }, 2000)
          }, 500);
        }, 500);
      })
    })
  }

  startFetch = () => {
    this.LoadingBar.continousStart();
  };

  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
  };

  closeNotif() {
    this.setState({ notifVisible: false })
  }

  async getDataHead() {
    let payload = {
      offset: 0,
      limit: 100,
      params: {
        employeeID: this.state.auth.user.employeeID
      }
    };
    API.create("EMPLOYEE_QUERY")
      .getEmployeeHead(payload)
      .then(res => {
        if (res.status === 200) {
          console.log(res.data);
          if (res.data.status === "S") {
            this.setState({
              rawDataHead: res.data.data
            });
          }
        }
      });
  }

  getDataOvertime() {
    let payload = {
      offset: 0,
      limit: 100,
      params: {
        employeeID: this.state.auth.user.employeeID
      }
    };
    API.create("TIME_QUERY")
      .getOvertimeByID(payload)
      .then(res => {
        if (res.status === 200) {
          if (res.data.status === "S") {
            this.onFinishFetch();
            let dataTableOvertime = res.data.data.map((value, index) => {
              const {
                overtimeDate,
                overtimeStartDate,
                overtimeEndDate,
                approvalManagers,
                overtimeNotes,
                overtimeStatus
              } = value;
              return [
                (index += 1),
                overtimeDate,
                M(overtimeStartDate, "DD-MM-YYYY HH:mm:ss").format("HH:mm"),
                M(overtimeEndDate, "DD-MM-YYYY HH:mm:ss").format("HH:mm"),
                approvalManagers && approvalManagers[0]
                  ? approvalManagers[0].employeeName
                  : "-",
                overtimeNotes,
                overtimeStatus.replace(/_/g, " ")
              ];
            });
            this.setState({
              rawData: res.data.data,
              dataTableOvertime
            });
          } else {
            // alert("Failed: " + res.data.message);
            this.onFinishFetch();
          }
        } else if (res.status === 504) {
          alert("504 - Time Out");
          this.onFinishFetch();
        } else {
          // alert("Failed: " + res.message);
          this.onFinishFetch();
        }
      });
  }

  async getEmployee() {
    let payload = {
      employeeID: this.state.auth.user.employeeID
    };
    API.create("EMPLOYEE_QUERY")
      .getEmployeeById(payload)
      .then(res => {
        if (res.status === 200) {
          console.log(res.data);
          if (res.data.status === "S") {
            this.setState({
              rawDataEmp: res.data.data
            });
          }
        } else {
          alert("Failed: " + res.data.message);
          this.onFinishFetch();
        }
      });
  }

  async getBizparOvertimeType() {
    let payload = {
      params: {
        esID: this.state.auth.user.companyID
      },
      offset: 0,
      limit: 100
    };
    API.create("CFG")
      .getCorporateOvertimeByEsId(payload)
      .then(res => {
        if (res.status === 200) {
          console.log(res.data);
          if (res.data.status === "S") {
            let bizparOvertimeType = res.data.data.map((value, index) => {
              return {
                bizparKey: value.corporateOvertimeID,
                bizparValue: value.corporateOvertimeName
              };
            });
            this.setState({
              bizparOvertimeType
            });
          }
        }
      });
  }

  openCreate() {
    this.clResizePane();
    // let savePopUpVisible = this.state.savePopUpVisible
    //   ? !this.state.savePopUpVisible
    //   : false;
    this.setState({
      createVisible: !this.state.createVisible,
      // savePopUpVisible
    });
  }

  openDeletePopup = index => {
    this.setState({
      deletePopUpVisible: !this.state.deletePopUpVisible,
      selectedIndex: index
    });
  };

  openSavePopUp = () => {
    this.clResizePane();
    this.setState({
      savePopUpVisible: !this.state.savePopUpVisible,
      confirmPopUpVisible: false,
      confirmPopUpVisibleSubmit: false,
      createVisible: false,
      editVisible: false
    }, () => this.getDataOvertime());
  };

  openConfirmPopUp = data => {
    if (this.state.confirmPopUpVisible) this.getDataOvertime();
    this.setState({
      dataPayload: data,
      confirmPopUpVisible: !this.state.confirmPopUpVisible
    });
  };

  openConfirmPopUpSubmit = data => {
    if (this.state.confirmPopUpVisibleSubmit) this.getDataOvertime();
    this.setState({
      dataPayload: data,
      confirmPopUpVisibleSubmit: !this.state.confirmPopUpVisibleSubmit
    });
  };

  async handleSave(value) {
    this.setState({ sendState: "loading" })
    value = {
      ...value,
      employeeID: this.state.auth.user.employeeID,
      overtimeType: value.overtimeType.bizparKey,
      createdBy: this.state.auth.user.employeeID,
      updatedBy: this.state.auth.user.employeeID,
      overtimeStartDate: M(value.overtimeStartDate, " HH:mm").format(
        "DD-MM-YYYY HH:mm:ss"
      ),
      overtimeEndDate: M(value.overtimeEndDate, "HH:mm").format(
        "DD-MM-YYYY HH:mm:ss"
      )
    };
    this.connectWebsocket("post/")
    let response = await API.create("TIME").postOvertime(value);
    console.log(response);
    if (response.ok && response.data.status === "S") {
      this.openSavePopUp()
      this.setState({
        confirmPopUpVisible: false,
      })

    }
  }

  async handleUpdate(value) {
    this.setState({ sendState: "loading" })
    value = {
      overtimeID: value.overtimeID,
      overtimeType:
        value.overtimeType === null
          ? ""
          : value.overtimeType.corporateOvertimeID,
      overtimeDate: M(value.overtimeDate).format("DD-MM-YYYY"),
      overtimeStartDate: M(value.overtimeStartDate, " HH:mm").format(
        "DD-MM-YYYY HH:mm:ss"
      ),
      overtimeEndDate: M(value.overtimeEndDate, " HH:mm").format(
        "DD-MM-YYYY HH:mm:ss"
      ),
      overtimeStatus: value.overtimeStatus,
      employeeID: this.state.auth.user.employeeID,
      overtimeDocumentURL: value.overtimeDocumentURL,
      overtimeNotes: value.overtimeNotes,
      updatedBy: this.state.auth.user.employeeID,
      updatedDate: M().format("DD-MM-YYYY HH:mm:ss"),
      recordID: value.recordID
    };
    this.connectWebsocket("put/")
    let response = await API.create("TIME").updateOvertime(value);
    console.log(response);
    if (response.ok && response.data.status === "S") {
      this.openSavePopUp()
      this.setState({
        confirmPopUpVisible: false,
      })
    }
  }

  async handleSubmit(value) {
    value = {
      taskID: "",
      senderUserID: this.state.auth.user.userID,
      senderEmpID: this.state.auth.user.employeeID,
      senderNotes: "",
      senderBPMStatus: "INITIATE",
      data: {
        overtimeID: value.overtimeID,
        overtimeType:
          value.overtimeType === null
            ? ""
            : value.overtimeType.corporateOvertimeID,
        overtimeDate: M(value.overtimeDate).format("DD-MM-YYYY"),
        overtimeStartDate: M(value.overtimeStartDate, " HH:mm").format(
          "DD-MM-YYYY HH:mm:ss"
        ),
        overtimeEndDate: M(value.overtimeEndDate, " HH:mm").format(
          "DD-MM-YYYY HH:mm:ss"
        ),
        overtimeStatus: value.overtimeStatus,
        employeeID: this.state.auth.user.employeeID,
        overtimeDocumentURL: value.overtimeDocumentURL,
        overtimeTaskDescription: value.overtimeTaskDescription,
        overtimeNotes: value.overtimeNotes,
        createdBy: value.overtimeCreationalDTO.createdBy,
        createdDate: value.overtimeCreationalDTO.createdDate,
        updatedBy: this.state.auth.user.employeeID,
        updatedDate: M().format("DD-MM-YYYY HH:mm:ss")
      }
    };
    console.log(JSON.stringify(value))
    let response = await API.create("BPM").submitOvertime(value);
    console.log(response);
    if (response.ok && response.data.status === "S") {
      this.openSavePopUp();
    }
  }

  deleteOvertime() {
    let payload = {
      overtimeID: this.state.rawData[this.state.selectedIndex].overtimeID,
      updatedBy: this.state.auth.user.employeeID
    };
    this.connectWebsocket("delete/")
    API.create("TIME").deleteOvertime(payload).then(res => {
      if (res.status === 200) {
        if (res.data.status === "S") {
          console.log(res.data);
          this.setState({
            deletePopUpVisible: false, dataTable: [],
          })
        } else {
          alert("Failed: " + res.data.message);
        }
      } else {
        console.log(res);
      }
    });
  }

  handleDelete = () => {
    this.deleteOvertime();
  };

  columns = [
    "No",
    "Date",
    "Start Time",
    "End Time",
    "Head",
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
              {String(tableMeta.rowData).includes("INITIATE") ? (
                <button
                  type="button"
                  style={{ marginRight: 15, backgroundColor: 'transparent' }}
                  className='btnAct'
                  onClick={this.opSidePage(
                    "slide-overtime-edit",
                    tableMeta.rowIndex
                  )}
                >
                  <i className="fa fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                </button>
              ) : (
                  <div />
                )}
              {String(tableMeta.rowData).includes("INITIATE") ? (
                <button
                  type="button"
                  style={{ marginRight: 15, backgroundColor: 'transparent' }}
                  className='btnAct'
                  onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
                >
                  <i className="fa fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                </button>
              ) : (
                  <div />
                )}
              <button
                type="button"
                style={{ marginRight: 15, backgroundColor: 'transparent' }}
                className='btnAct'
                onClick={this.opSidePage(
                  "slide-overtime-view",
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
    let {
      rawDataHead,
      rawData,
      rawDataEmp,
      selectedIndex,
      bizparOvertimeType
    } = this.state;
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
        <div className="col-1 backgorund-white"></div>
        <div className="col-2 background-white">
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
                          onClick={() => this.openCreate()}
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
                                title="Employee Self Service - Overtime"
                                subtitle={'lorem ipsum dolor'}
                                data={this.state.dataTableOvertime}
                                columns={this.columns}
                                options={options}
                              />
                            </MuiThemeProvider>
                          </div>
                        </div>
                      </div>
                      {this.state.createVisible && (
                        <FormOvertime
                          type="create"
                          sendState={this.state.sendState}
                          dataEmp={rawDataEmp}
                          dataHead={rawDataHead ? rawDataHead[0] : ""}
                          bizparOvertimeType={bizparOvertimeType}
                          onClickSave={this.openConfirmPopUp.bind(this)}
                          onClickClose={() => this.openCreate()}
                        />
                      )}
                    </div>
                  </div>
                </div>
              }
              side={
                <div className="a-s-p-side">
                  {this.state.editVisible && (
                    <FormOvertime
                      type="edit"
                      sendState={this.state.sendState}
                      data={this.state.rawData[selectedIndex]}
                      dataEmp={rawDataEmp}
                      dataHead={
                        rawData && rawData[selectedIndex].approvalManagers
                          ? rawData[selectedIndex].approvalManagers[0]
                          : ""
                      }
                      bizparOvertimeType={bizparOvertimeType}
                      onClickSubmit={this.openConfirmPopUpSubmit.bind(this)}
                      onClickSave={this.openConfirmPopUp.bind(this)}
                      closeSlide={this.clResizePane}
                      getData={this.getDataOvertime.bind(this)}
                    />
                  )}
                  {this.state.viewVisible && (
                    <FormOvertime
                      type="view"
                      data={rawData[selectedIndex]}
                      dataEmp={rawDataEmp}
                      dataHead={
                        rawData && rawData[selectedIndex].approvalManagers
                          ? rawData[selectedIndex].approvalManagers[0]
                          : ""
                      }
                      bizparOvertimeType={bizparOvertimeType}
                      closeSlide={this.clResizePane}
                    />
                  )}
                </div>
              }
            />
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
            {this.state.notifVisible && (
              <WebsocketNotif message={this.state.messages} type={"float"} onClickClose={this.closeNotif.bind(this)} />
            )}
            {this.state.confirmPopUpVisibleSubmit && (
              <PopUp
                type={"simpan"}
                class={"app-popup app-popup-show"}
                onClick={this.openConfirmPopUpSubmit.bind(this)}
                onClickSimpan={() => this.handleSubmit(this.state.dataPayload)}
              />
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

export default connect(mapStateToProps, mapDispatchToProps)(Overtime);
