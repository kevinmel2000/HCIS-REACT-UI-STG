import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import LoadingBar from "react-top-loading-bar";
import API from "../../Services/Api";
import { connect } from "react-redux";
import PopUp from "../pages/PopUpAlert";
import FormLeaveEss from "../../modules/formEss/formLeaveEss";
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

class leave extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createVisible: false,
      editVisible: false,
      viewVisible: false,
      rawData: [],
      dataTableLeave: [],
      bizparLeaveType: [],
      deleteClass: "app-popup",
      saveClass: "app-popup",
      type: "",
      savePopUpVisible: false,
      confirmPopUpVisible: false,
      ProcessPopUpVisibe: false,
      notifVisible: false,
      messages: "",
      allowResize: false,
      defaultSize: 0,
      minSize: 0,
      maxSize: 0,
      auth: props.auth,
      timeout: 1000 * 100 * 9,
      isTimedOut: false,
      sendState: "",
      defaultPayload: []
    };
    this.idleTimer = null;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleProcess = this.handleProcess.bind(this);
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

  handleDelete = () => {
    this.deleteLeave();
  };

  openCreateForm = index => {
    let { createVisible } = this.state;
    this.setState({
      createVisible: !createVisible,
      selectedIndex: !createVisible ? index : null
    });
  };

  opSidePage = (menu, index) => e => {
    e.preventDefault();
    this.setState({ editVisible: false, viewVisible: false });

    this.opResizePane();

    switch (menu) {
      case "slide-leave":
        this.setState({ editVisible: true, selectedIndex: index });
        break;
      case "slide-leave-view":
        this.setState({ viewVisible: true, selectedIndex: index });
        break;
      default:
        break;
    }
  };

  opResizePane = () => {
    this.setState({
      allowResize: true,
      defaultSize: 370,
      minSize: 370,
      maxSize: 850
    });
  };

  clResizePane = () => {
    this.setState({
      slideBizpar: false,
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
      stompClient.subscribe('/topic/leave/' + method + employeeID, (message) => {
        let res = JSON.parse(message.body)
        console.log('messages: ' + res.messages)
        setTimeout(() => {
          this.setState({ sendState: "finished" })
          setTimeout(() => {
            this.setState({ notifVisible: true, messages: res.messages, editVisible: false, viewVisible: false, createVisible: false })
            this.clResizePane()
            this.getDataLeave()
            setTimeout(() => {
              this.setState({ notifVisible: false, sendState: "" })
            }, 2000)
          }, 500);
        }, 500);
      })
    })
  }

  getMuiTheme = () => createMuiTheme(ct.customTable());

  columns = [
    "No",
    "Start Date",
    "End Date",
    "Leave Type",
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
                  style={{ marginRight: 15, backgroundColor: 'transparent' }}
                  onClick={this.opSidePage("slide-leave", tableMeta.rowIndex)}
                  className='btnAct'
                >
                  <i className="fa fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                </button> :
                <div />
              }
              {String(tableMeta.rowData).includes("INITIATE") ?
                <button
                  style={{ marginRight: 15, backgroundColor: 'transparent' }}
                  onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
                  className='btnAct'
                >
                  <i className="fa fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                </button> :
                <div />
              }
              <button
                style={{ marginRight: 15, backgroundColor: 'transparent' }}
                className='btnAct'
                onClick={this.opSidePage(
                  "slide-leave-view",
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

  async getDataLeave() {
    let payload = {
      limit: 100,
      offset: 0,
      params: {
        employeeID: this.state.auth.user.employeeID
      }
    };
    API.create("TIME_QUERY")
      .getLeaveByEmployeeId(payload)
      .then(res => {
        if (res.status === 200) {
          if (res.data.status === "S") {
            console.log(res.data);
            this.onFinishFetch();
            let dataTableLeave = res.data.data.map((value, index) => {
              const {
                leaveStartDate,
                leaveEndDate,
                leaveType,
                leaveReason,
                leaveStatus
              } = value;

              return [
                (index += 1),
                leaveStartDate,
                leaveEndDate,
                leaveType.bizparValue,
                leaveReason,
                leaveStatus.replace(/_/g, " ")
              ];
            });
            this.setState({
              rawData: res.data.data,
              dataTableLeave
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

  async getBizparLeaveType() {
    let payloadLeave = {
      params: {
        bizparCategory: "LEAVE_TYPE"
      },
      offset: 0,
      limit: 5
    };
    API.create("BIZPAR")
      .getBizparByCategory(payloadLeave)
      .then(res => {
        if (res.status === 200) {
          console.log(res.data);
          if (res.data.status === "S") {
            this.setState({
              bizparLeaveType: res.data.data
            });
          }
        }
      });
  }

  openDeletePopup = index => {
    if (this.state.deleteClass === "app-popup app-popup-show") {
      this.setState({ deleteClass: "app-popup", selectedIndex: null });
    } else {
      this.setState({
        deleteClass: "app-popup app-popup-show",
        selectedIndex: index
      });
    }
  };

  openSavePopUp = () => {
    if (this.state.savePopUpVisible) this.getDataLeave();
    this.clResizePane();
    this.setState({
      savePopUpVisible: !this.state.savePopUpVisible,
      ProcessPopUpVisibe: false,
      confirmPopUpVisible: false,
      createVisible: false,
      editVisible: false
    });
  };

  openConfirmPopUp = data => {
    if (this.state.confirmPopUpVisible) this.getDataLeave();
    this.setState({
      dataPayload: data,
      confirmPopUpVisible: !this.state.confirmPopUpVisible
    });
  };

  openProcessPopUp = data => {
    if (this.state.ProcessPopUpVisibe) this.getDataLeave();
    this.setState({
      dataPayload: data,
      ProcessPopUpVisibe: !this.state.ProcessPopUpVisibe
    });
  };

  async handleSubmit(payload) {
    this.setState({ sendState: "loading", defaultPayload: payload })
    payload = {
      ...payload,
      createdBy: this.props.auth.user.employeeID
    }
    this.connectWebsocket("post/")
    API.create("TIME").postLeaveEss(payload).then(res => {
      console.log(res);
      if (res.ok && res.data.status === "S") {
        this.openSavePopUp();
        this.setState({
          confirmPopUpVisible: false
        })
      }
    });
  }

  async handleUpdate(payload) {
    this.setState({ sendState: "loading", defaultPayload: payload })
    console.log(JSON.stringify(payload))
    this.connectWebsocket("put/", payload)
    API.create("TIME").updateLeaveEss(payload).then(res => {
      console.log(res);
      if (res.ok && res.data.status === "S") {
        this.openSavePopUp();
        this.setState({
          confirmPopUpVisible: false
        })
      }
    });
  }

  async handleProcess(payload) {
    API.create("BPM")
      .submitLeave(payload)
      .then(res => {
        console.log(res);
        if (res.ok && res.data.status === "S") {
          this.openSavePopUp();
        }
      });
  }

  deleteLeave() {
    let payload = {
      leaveID: this.state.rawData[this.state.selectedIndex].leaveID,
      updatedBy: this.state.auth.user.employeeID
    };
    this.setState({ defaultPayload: payload })
    this.connectWebsocket("delete/")
    API.create("TIME")
      .deleteLeaveEss(payload)
      .then(res => {
        if (res.status === 200) {
          if (res.data.status === "S") {
            console.log(res.data);
            this.setState({
              deleteClass: "app-popup", dataTable: []
            })
            this.clResizePane();
            this.getDataLeave({
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

  handleDelete() {
    this.deleteLeave();
  }

  componentDidMount() {
    if (!R.isNil(this.props.auth.user)) {
      this.startFetch();
      this.getDataLeave();
      this.getBizparLeaveType();
    }
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

  render() {
    if (R.isNil(this.props.auth.user))
      return <Redirect to={{ pathname: "/" }}></Redirect>;
    let { rawData, selectedIndex } = this.state;
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
                          onClick={this.openCreateForm.bind(this)}
                        >
                          <i className="fa fa-1x fa-plus"></i>
                        </button>
                      </div>
                    </div>
                    <div className="a-s-p-mid">
                      <div className="padding-10px">
                        <div className="app-open-close margin-bottom-20px">
                          <div className="app-open-close-content">
                            <MuiThemeProvider theme={getMuiTheme()}>
                              <MUIDataTable
                                title="Employee Self Service - Leave"
                                subtitle={'lorem ipsum dolor'}
                                data={this.state.dataTableLeave}
                                columns={this.columns}
                                options={options}
                              />
                            </MuiThemeProvider>
                          </div>
                        </div>
                      </div>
                      {this.state.createVisible && (
                        <FormLeaveEss
                          sendState={this.state.sendState}
                          type={"create"}
                          bizparLeaveType={this.state.bizparLeaveType}
                          onClickClose={this.openCreateForm.bind(this)}
                          onClickSave={this.openConfirmPopUp.bind(this)}
                          onClickProcess={this.openProcessPopUp.bind(this)}
                        />
                      )}
                    </div>
                  </div>
                </div>
              }
              side={
                <div className="a-s-p-side">
                  {this.state.editVisible && (
                    <FormLeaveEss
                      sendState={this.state.sendState}
                      type={"edit"}
                      leaveData={this.state.rawData[selectedIndex]}
                      bizparLeaveType={this.state.bizparLeaveType}
                      closeSlide={this.clResizePane}
                      onClickSave={this.openConfirmPopUp.bind(this)}
                      onClickProcess={this.openProcessPopUp.bind(this)}
                      getData={this.getDataLeave.bind(this)}
                    />
                  )}
                  {this.state.viewVisible && (
                    <FormLeaveEss
                      type={"view"}
                      leaveData={rawData[selectedIndex]}
                      bizparLeaveType={this.state.bizparLeaveType}
                      closeSlide={this.clResizePane}
                    />
                  )}
                </div>
              }
            />

            <PopUp
              type={"delete"}
              class={this.state.deleteClass}
              onClick={this.openDeletePopup}
              onClickDelete={this.handleDelete}
            />

            {this.state.confirmPopUpVisible && (
              <PopUp
                type={"simpan"}
                class={"app-popup app-popup-show"}
                onClick={this.openConfirmPopUp.bind(this)}
                onClickSimpan={
                  this.state.createVisible === true
                    ? () => this.handleSubmit(this.state.dataPayload)
                    : () => this.handleUpdate(this.state.dataPayload)
                }
              />
            )}


            {this.state.notifVisible && (
              <WebsocketNotif message={this.state.messages} type={"float"} onClickClose={this.closeNotif.bind(this)} />
            )}

            {this.state.ProcessPopUpVisibe && (
              <PopUp
                type={"simpan"}
                class={"app-popup app-popup-show"}
                onClick={this.openProcessPopUp.bind(this)}
                onClickSimpan={() => this.handleProcess(this.state.dataPayload)}
              />
            )}

            {this.state.savePopUpVisible && (
              <PopUp
                type={"save"}
                class={"app-popup app-popup-show"}
                onClick={this.openSavePopUp.bind(this)}
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

export default connect(mapStateToProps, mapDispatchToProps)(leave);
