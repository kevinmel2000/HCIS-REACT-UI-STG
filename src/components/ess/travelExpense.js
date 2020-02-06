import React, { Component } from "react";
import PopUp from "../../components/pages/PopUpAlert";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import LoadingBar from "react-top-loading-bar";
import MUIDataTable from "mui-datatables-bitozen";
import FormTravDetail from "../../modules/formEss/formTravelExDetail";
import ResizeSlider from "../../modules/resize/Slider";
import SplitPaneSecond from "react-split-pane";
import API from "../../Services/Api";
import { connect } from "react-redux";
import M from "moment";
import * as R from "ramda";
import { Redirect } from "react-router-dom";
import AuthAction from "../../Redux/AuthRedux";
import IdleTimer from "react-idle-timer";
import WebsocketNotif from '../../modules/popup/WebsocketNotif'
import Stomp from 'stompjs'

var ct = require("../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class travelEx extends Component {
  constructor(props) {
    super(props);
    this.state = {
      savePopUpVisible: false,
      confirmPopUpVisible: false,
      submitPopUpVisible: false,
      deletePopUpVisible: false,
      rawData: [],
      selectedIndex: [],
      dataTableSppd: [],
      head: [],
      createVisible: false,
      editVisible: false,
      detailVisible: false,
      auth: props.auth,
      dataPayload: [],
      allowResize: false,
      defaultSize: 0,
      minSize: 0,
      maxSize: 0,
      timeout: 1000 * 100 * 9,
      isTimedOut: false,
      notifVisible: false,
      messages: "",
      isWeb: false,
      sendState: "",
    };
    this.idleTimer = null;
    this.handleCreate = this.handleCreate.bind(this);
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

  getDataSppd() {
    let payload = {
      offset: 0,
      limit: 100,
      params: {
        employeeID: this.state.auth.user.employeeID
      }
    };
    API.create("TIME_QUERY")
      .getSppdByEmpId(payload)
      .then(res => {
        if (res.status === 200) {
          if (res.data.status === "S") {
            console.log(res.data);
            this.onFinishFetch();
            let rawData = res.data.data.map((data, index) => {
              return {
                ...data,
                sppdTripType: data ? data.sppdTripType.bizparKey : "",
                sppdType: data ? data.sppdType.bizparKey : "",
                sppdCategory: data ? data.sppdCategory.bizparKey : "",
                sppdCurrency: data ? data.sppdCurrency.bizparKey : "",
                employee: data.employee.employeeID,
                sppdStartDate: M(data.sppdStartDate, "DD-MM-YYYY").format(
                  "YYYY-MM-DD"
                ),
                sppdEndDate: M(data.sppdEndDate, "DD-MM-YYYY").format(
                  "YYYY-MM-DD"
                )
              };
            });
            let dataTableSppd = res.data.data.map((value, index) => {
              const {
                sppdStartDate,
                sppdEndDate,
                sppdRequestBy,
                sppdDestinationPlace,
                sppdReason,
                sppdStatus
              } = value;
              return [
                (index += 1),
                M(sppdStartDate, "DD-MM-YYYY").format("YYYY"),
                M(sppdStartDate, "DD-MM-YYYY").format("DD-MM-YYYY"),
                M(sppdEndDate, "DD-MM-YYYY").format("DD-MM-YYYY"),
                sppdRequestBy !== null ? sppdRequestBy.employeeName : "-",
                sppdReason,
                sppdDestinationPlace,
                sppdStatus.replace(/_/g, " ")
              ];
            });
            this.setState({
              rawData,
              dataTableSppd
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

  async getHead() {
    let payloadHead = {
      params: {
        employeeID: this.state.auth.user.employeeID
      },
      offset: 0,
      limit: 50
    };
    API.create("EMPLOYEE_QUERY")
      .getEmployeeHead(payloadHead)
      .then(res => {
        if (res.status === 200) {
          console.log(res.data);
          if (res.data.status === "S") {
            this.setState({
              head: res.data.data
            });
          }
        } else {
          alert("Failed: " + res.data.message);
          this.onFinishFetch();
        }
      });
  }

  openCreateForm() {
    this.clResizePane();
    let savePopUpVisible = this.state.savePopUpVisible
      ? !this.state.savePopUpVisible
      : false;
    this.setState({
      createVisible: !this.state.createVisible,
      savePopUpVisible
    });
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
      detailVisible: false
    });

    this.opResizePane();

    switch (menu) {
      case "slide-biztrip":
        this.setState({
          editVisible: true,
          selectedIndex: index
        });
        break;
      case "slide-biztrip-view":
        this.setState({
          detailVisible: true,
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

  openDeletePopup = index => {
    this.setState({
      deletePopUpVisible: !this.state.deletePopUpVisible,
      selectedIndex: index
    });
  };

  openSavePopUp = () => {
    if (this.state.savePopUpVisible) this.getDataSppd();
    this.clResizePane();
    this.setState({
      savePopUpVisible: !this.state.savePopUpVisible,
      submitPopUpVisible: false,
      confirmPopUpVisible: false,
      createVisible: false,
      editVisible: false
    });
  };

  openConfirmPopUp = data => {
    if (this.state.confirmPopUpVisible) this.getDataSppd();
    this.setState({
      dataPayload: data,
      confirmPopUpVisible: !this.state.confirmPopUpVisible
    });
  };

  openSubmitPopUp = data => {
    if (this.state.submitPopUpVisible) this.getDataSppd();
    this.setState({
      dataPayload: data,
      submitPopUpVisible: !this.state.submitPopUpVisible
    });
  };

  async postBiztrip(value) {
    this.setState({ sendState: "loading" })
    value = {
      ...value,
      employeeID: this.state.auth.user.employeeID,
      sppdRequestBy:
        this.state.head && this.state.head !== null
          ? this.state.head[0].employeeID
          : "",
      sppdStartDate: M(value.sppdStartDate).format("DD-MM-YYYY"),
      sppdEndDate: M(value.sppdEndDate).format("DD-MM-YYYY"),
      createdBy: this.state.auth.user.employeeID,
      updatedBy: this.state.auth.user.employeeID,
    };
    this.connectWebsocket("post/", value)
    let response = await API.create("TIME").postSppd(value);
    console.log(value);
    if (response.ok && response.data.status === "S") {
      this.openSavePopUp()
      this.setState({
        confirmPopUpVisible: false
      })
    }
  }

  async putBiztrip(value) {
    this.setState({ sendState: "loading" })
    value = {
      ...value,
      employeeID: this.state.auth.user.employeeID,
      sppdRequestBy:
        value.sppdRequestBy === null ? "" : value.sppdRequestBy.employeeID,
      sppdTripType:
        value.sppdTripType !== undefined && null
          ? value.sppdTripType.bizparKey
          : "",
      sppdType:
        value.sppdType !== undefined && null ? value.sppdType.bizparKey : "",
      sppdCategory:
        value.sppdCategory !== undefined && null
          ? value.sppdCategory.bizparKey
          : "",
      sppdCurrency:
        value.sppdCurrency !== undefined && null
          ? value.sppdCurrency.bizparKey
          : "",
      sppdFacilities: [],
      sppdStartDate: M(value.sppdStartDate).format("DD-MM-YYYY"),
      sppdEndDate: M(value.sppdEndDate).format("DD-MM-YYYY"),
      updatedBy: this.state.auth.user.employeeID,
      updatedDate: M().format("DD-MM-YYYY HH:mm:ss"),
      createdBy: this.state.auth.user.employeeID,
    };
    this.connectWebsocket("put/", value)
    console.log(JSON.stringify(value))
    let response = await API.create("TIME").updateSppd(value);
    console.log(response);
    if (response.ok && response.data.status === "S") {
      this.openSavePopUp()
      this.setState({
        confirmPopUpVisible: false
      })
    }
  }

  async submitBiztrip(value) {
    value = {
      taskID: "",
      senderUserID: this.state.auth.user.userID,
      senderEmpID: this.state.auth.user.employeeID,
      senderNotes: "",
      senderBPMStatus: "INITIATE",
      data: {
        sppdID: value.sppdID,
        sppdStartDate: M(value.sppdStartDate).format("DD-MM-YYYY"),
        sppdEndDate: M(value.sppdEndDate).format("DD-MM-YYYY"),
        sppdDeparturePlace: "",
        sppdDestinationPlace: value.sppdDestinationPlace,
        sppdReason: value.sppdReason,
        sppdStatus: value.sppdStatus,
        employeeID: this.state.auth.user.employeeID,
        sppdNotes: value.sppdNotes,
        sppdDocumentURL: value.sppdDocumentURL,
        sppdRequestBy:
          value.sppdRequestBy === null ? "" : value.sppdRequestBy.employeeID,
        sppdTripType:
          value.sppdTripType !== undefined && null
            ? value.sppdTripType.bizparKey
            : "",
        sppdType:
          value.sppdType !== undefined && null ? value.sppdType.bizparKey : "",
        sppdCategory:
          value.sppdCategory !== undefined && null
            ? value.sppdCategory.bizparKey
            : "",
        sppdCurrency:
          value.sppdCurrency !== undefined && null
            ? value.sppdCurrency.bizparKey
            : "",
        sppdFacilities: [],
        createdBy: value.sppdCreationalDTO.createdBy,
        createdDate: value.sppdCreationalDTO.createdDate,
        updatedBy: this.state.auth.user.employeeID,
        updatedDate: M().format("DD-MM-YYYY HH:mm:ss")
      }
    };
    let response = await API.create("BPM").submitBiztrip(value);
    console.log(response);
    if (response.ok && response.data.status === "S") {
      this.openSavePopUp();
    } else {
      alert("Failed" + response.message);
    }
  }

  deleteBiztrip() {
    let payload = {
      sppdID: this.state.rawData[this.state.selectedIndex].sppdID,
      updatedBy: this.state.auth.user.employeeID
    };
    this.connectWebsocket("delete/")
    API.create("TIME")
      .deleteSppd(payload)
      .then(res => {
        if (res.status === 200) {
          if (res.data.status === "S") {
            console.log(res.data);
            this.setState({
              deletePopUpVisible: false, dataTable: [], isWeb: !this.state.isWeb
            }, () => this.state.isWeb === true ? this.deleteBiztrip() : this.setState({ isWeb: !this.state.isWeb }));
            this.clResizePane();
            this.getDataSppd({
              offset: 0,
              limit: 100
            });
            setTimeout(() => {
              this.setState({ notifVisible: false })
            }, 2000);
          } else {
            alert("Failed: " + res.data.message);
          }
        } else {
          console.log(res);
        }
      });
  }

  handleCreate = value => {
    this.postBiztrip(value);
  };

  handleUpdate = value => {
    this.putBiztrip(value);
  };

  handleSubmit = value => {
    this.submitBiztrip(value);
  };

  handleDelete = () => {
    this.deleteBiztrip();
  };

  componentDidMount() {
    if (!R.isNil(this.props.auth.user)) {
      this.startFetch();
      this.getDataSppd();
      this.getHead();
    }
  }

  connectWebsocket(method, value) {
    this.setState({
      isWeb: !this.state.isWeb
    }, () => this.state.isWeb === true && method === "post/" ? this.postBiztrip(value) : this.state.isWeb === true && method === "put/" ? this.putBiztrip(value) : this.setState({ isWeb: !this.state.isWeb }))
    let stompClient = Stomp.client(process.env.REACT_APP_HCIS_WEBSOCKET);
    let employeeID = this.props.auth.user.employeeID
    stompClient.debug = null;
    stompClient.connect({}, (frame) => {
      console.log('Connected: ' + frame)
      stompClient.subscribe('/topic/sppd/' + method + employeeID, (message) => {
        let res = JSON.parse(message.body)
        console.log('messages: ' + res.messages)
        setTimeout(() => {
          this.setState({ sendState: "finished" })
          setTimeout(() => {
            this.setState({ notifVisible: true, messages: res.messages, createVisible: false, editVisible: false, detailVisible: false })
            this.clResizePane()
            this.getDataSppd()
            setTimeout(() => {
              this.setState({ notifVisible: false, isWeb: false, sendState: "" })
            }, 2000)
          }, 500);
        }, 500);
      })
    })
  }

  closeNotif() {
    this.setState({ notifVisible: false })
  }

  startFetch = () => {
    this.LoadingBar.continousStart();
  };

  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
  };

  columns = [
    "No",
    "Period",
    "Start Date",
    "End Date",
    "Head",
    "Task",
    "Location",
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
            <div style={{}}>
              {String(tableMeta.rowData).includes("INITIATE") ? (
                <button
                  type="button"
                  style={{ marginRight: 15, backgroundColor: 'transparent' }}
                  className='btnAct'
                  onClick={this.opSidePage("slide-biztrip", tableMeta.rowIndex)}
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
                style={{ backgroundColor: 'transparent', color: '#004c97' }}
                className='btnAct'
                onClick={this.opSidePage(
                  "slide-biztrip-view",
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
    let { head, rawData, selectedIndex } = this.state;
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
                                title="Employee Self Service - Business Trip"
                                subtitle={'lorem ipsum dolor'}
                                data={this.state.dataTableSppd}
                                columns={this.columns}
                                options={options}
                              />
                            </MuiThemeProvider>
                          </div>
                        </div>
                      </div>
                      {this.state.createVisible && (
                        <FormTravDetail
                          sendState={this.state.sendState}
                          type={"create"}
                          head={head ? head[0] : ""}
                          onClickClose={this.openCreateForm.bind(this)}
                          onClickSave={this.openConfirmPopUp.bind(this)}
                        />
                      )}
                    </div>
                  </div>
                </div>
              }
              side={
                <div className="a-s-p-side">
                  {this.state.editVisible && (
                    <FormTravDetail
                      type={"edit"}
                      sendState={this.state.sendState}
                      head={head ? head[0] : ""}
                      data={this.state.rawData[this.state.selectedIndex]}
                      onClickSave={this.openConfirmPopUp.bind(this)}
                      onClickProcess={this.openSubmitPopUp.bind(this)}
                      closeSlide={this.clResizePane}
                      getData={this.getDataSppd.bind(this)}

                    />
                  )}

                  {this.state.detailVisible && (
                    <FormTravDetail
                      type={"view"}
                      head={head ? head[0] : ""}
                      data={rawData[selectedIndex]}
                      closeSlide={this.clResizePane}
                    />
                  )}
                </div>
              }
            />
            {this.state.savePopUpVisible && (
              <PopUp
                type={"save"}
                class={"app-popup app-popup-show"}
                onClick={this.openSavePopUp.bind(this)}
              />
            )}

            {this.state.notifVisible && (
              <WebsocketNotif message={this.state.messages} type={"float"} onClickClose={this.closeNotif.bind(this)} />
            )}

            {this.state.confirmPopUpVisible && (
              <PopUp
                type={"simpan"}
                class={"app-popup app-popup-show"}
                onClick={this.openConfirmPopUp.bind(this)}
                onClickSimpan={
                  this.state.createVisible === true
                    ? () => this.handleCreate(this.state.dataPayload)
                    : () => this.handleUpdate(this.state.dataPayload)
                }
              />
            )}

            {this.state.submitPopUpVisible && (
              <PopUp
                type={"simpan"}
                class={"app-popup app-popup-show"}
                onClick={this.openSubmitPopUp.bind(this)}
                onClickSimpan={() => this.handleSubmit(this.state.dataPayload)}
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

export default connect(mapStateToProps, mapDispatchToProps)(travelEx);
