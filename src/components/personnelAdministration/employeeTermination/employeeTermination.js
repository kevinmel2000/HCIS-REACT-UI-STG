import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import LoadingBar from "react-top-loading-bar";
import FormEmpTermination from "../../../modules/forms/formEmployee/formEmployeeTermination";
import FormEmpTerminationDetail from "../../../modules/forms/formEmployee/formEmployeeTerminationDetail";
import FormEmpTerminationDocument from "../../../modules/forms/formEmployee/formEmployeeTerminationDocument";
import FormEmpTerminationHistory from "../../../modules/forms/formEmployee/formEmployeeTerminationHistory";
import PopUp from "../../pages/PopUpAlert";
import API from "../../../Services/Api";
import FormTerminationCreate from "../../../modules/forms/formEmployeeTermination/formEmployeeTerminationCreate";
import FileViewer from 'react-file-viewer'
import ResizeSlider from '../../../modules/resize/Slider'
import SplitPaneSecond from 'react-split-pane'
import ReactTooltip from 'react-tooltip'
import * as R from 'ramda'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import AuthAction from '../../../Redux/AuthRedux'
import IdleTimer from 'react-idle-timer'
import FormEmployeeTerminationOrg from "../../../modules/forms/formEmployeeTermination/formEmployeeTerminationOrg";
import Stomp from 'stompjs'
import WebsocketNotif from '../../../modules/popup/WebsocketNotif'

const clSlidePage = 'a-s-p-main'
var ct = require("../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class employeeTermination extends Component {
  constructor() {
    super();
    this.state = {
      savePopUpVisible: false,
      deletePopUpVisible: false,
      createPopUpVisible: false,
      createVisible: false,
      viewVisible: false,
      updateVisible: false,
      formEmployeeDetailVisible: false,
      formEmployeeUpdateVisible: false,
      formEmployeeCreateVisible: false,
      formEmployeeGeneralVisible: false,
      formTerminationDetailVisible: false,
      formDocumentVisible: false,
      formHistoryVisible: false,
      bizparTerminationCategory: [],
      bizparTerminationType: [],
      fileUrl: "",
      fileType: "",
      formFileVisible: false,
      tabMenu: ["General", "Detail", "Document", "History"],
      notifVisible: false,
      message: '',
      sendState: "",
      // important for resize pane
      allowResize: false,
      defaultSize: 0,
      minSize: 0,
      maxSize: 0,
      slideTermination: false,
      classAppSlidePage: 'app-side-page',
      classAppSlidePageMain: clSlidePage,
      timeout: 1000 * 100 * 9,
      isTimedOut: false,
      terminationCount: 0,
      table_limit: 5,
      table_page: 0,
      table_query: "",
    }
    this.idleTimer = null
    this.handleChange = this.handleChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  logout() {
    this.props.authLogout()
    return <Redirect to={{ pathname: "/" }} ></Redirect>
  }

  onAction() {
    this.setState({ isTimedOut: false })
  }

  onActive() {
    this.setState({ isTimedOut: false })
  }

  onIdle() {
    const isTimedOut = this.state.isTimedOut
    if (isTimedOut) {
      alert("Your session has timed out. Please log in again")
      this.logout()
    } else {
      this.idleTimer.reset();
      this.setState({ isTimedOut: true })
    }
  }

  opResizePane = () => {
    this.setState({
      allowResize: true,
      defaultSize: 370,
      minSize: 370,
      maxSize: 870
    })
  }

  clResizePane = () => {
    this.setState({
      slideTermination: false,
      allowResize: false,
      defaultSize: 0,
      minSize: 0,
      maxSize: 0
    })
  }

  opSidePage = (menu, data) => (e) => {
    e.preventDefault()
    this.setState({
      classAppSlidePage: 'app-side-page op-app-side',
      slideTermination: false,
    })

    this.opResizePane()

    switch (menu) {
      case 'viewForm':
        this.setState({
          slideTermination: true,
          selectedIndex: data,
          slideType: 'view'
        })
        break
      case 'editForm':
        this.setState({
          slideTermination: true,
          selectedIndex: data,
          slideType: 'update'
        })
        break
      default:
        break
    }

  }

  clSidePage = () => {
    this.setState({ classAppSlidePage: 'app-side-page' })
  }

  handleChange(event) {
    this.setState({
      file: URL.createObjectURL(event.target.files[0])
    });
  }

  connectWebsocket = async (method) => {
    let stompClient = Stomp.client(process.env.REACT_APP_HCIS_WEBSOCKET);
    let employeeID = this.props.auth.user.employeeID
    stompClient.debug = null;
    stompClient.connect({}, (frame) => {
      console.log('Connected: ' + frame)
      stompClient.subscribe('/topic/termination/' + method + employeeID,
        (message) => {
          let res = JSON.parse(message.body)
          console.log('messages: ' + res.messages)
          setTimeout(() => {
            this.setState({ sendState: "finished" })
            setTimeout(() => {
              this.setState({ notifVisible: true, message: res.messages, formEmployeeCreateVisible: false, FormTerminationCreate: false, })
              this.clResizePane()
              setTimeout(() => {
                this.setState({ notifVisible: false, sendState: "" })
              }, 2000)
            }, 500);
          }, 500);
          setTimeout(() => {
            this.setState({
              notifVisible: false, message: res.messages, formEmployeeCreateVisible: false, FormTerminationCreate: false, sendState: ""
            })
            this.clResizePane()
          }, 4000);
        })
    })
  }

  closeNotif() {
    this.setState({ notifVisible: false })
  }

  componentDidMount() {
    if (!R.isNil(this.props.auth.user)) {
      this.startFetch();
      this.getBizparByCategory();
      this.getAllTermination(this.state.table_page, this.state.table_limit);
    }
  }

  getAllTermination(page, limit) {
    let payload = {
      offset: page,
      limit: limit
    };
    let name = {
      limit: limit,
      offset: page,
      params: {
        employeeName: this.state.table_query
      }
    }
    if (!R.isEmpty(this.state.table_query)) {
      API.create('TERMINATION_QUERY').getCountTerminationByName(this.state.table_query).then(res => {
        if (res.ok) {
          this.setState({ terminationCount: res.data.data })
        }
      })
      API.create('TERMINATION_QUERY').getAllTerminationByName(name).then(response => {
        if (response.data && response.data.status === "S") {
          if (response.data.data === null) {
            this.setState({
              dataTableMove: []
            })
          } else {
            let dataTableTermination = response.data.data.map((value, index) => {
              if (value === null) return ["", "", "", "", "", ""]
              const {
                terminationID,
                terminationType,
                terminationCategory,
                terminationReason,
                employee,
                terminationStatus
              } = value;

              return [
                index += 1,
                terminationID,
                terminationType ? terminationType.bizparValue : "-",
                terminationCategory ? terminationCategory.bizparValue : "-",
                terminationReason ? terminationReason.bizparValue : "-",
                employee ? employee.employeeName : "-",
                terminationStatus.replace(/_/g, " "),
                terminationStatus
              ]
            });
            this.setState({
              rawData: response.data.data,
              dataTableTermination
            });
          }
        }
      })
    } else {
      API.create('TERMINATION_QUERY').getCountAllTermination().then(response => {
        console.log(response)
        this.setState({ terminationCount: response.data.data })
      })
      API.create("TERMINATION_QUERY")
        .getAllTermination(payload)
        .then(res => {
          if (res.status === 200) {
            if (res.data.status === "S") {
              this.onFinishFetch();
              let dataTableTermination = res.data.data.map((value, index) => {
                if (value === null) return ["", "", "", "", "", ""]
                const {
                  terminationID,
                  terminationType,
                  terminationCategory,
                  terminationReason,
                  employee,
                  terminationStatus
                } = value;

                return [
                  index += 1,
                  terminationID,
                  terminationType ? terminationType.bizparValue : "-",
                  terminationCategory ? terminationCategory.bizparValue : "-",
                  terminationReason ? terminationReason.bizparValue : "-",
                  employee ? employee.employeeName : "-",
                  terminationStatus.replace(/_/g, " "),
                  terminationStatus
                ]
              });
              this.setState({
                rawData: res.data.data,
                dataTableTermination
              });
            }
          }
        });
    }
  }

  getBizparByCategory() {
    let payloadType = {
      params: {
        bizparCategory: "TERMINATION_TYPE"
      },
      offset: 0,
      limit: 100
    };

    let payloadCategory = {
      params: {
        bizparCategory: "TERMINATION_CATEGORY"
      },
      offset: 0,
      limit: 100
    };
    let payloadReason = {
      params: {
        bizparCategory: "TERMINATION_REASON"
      },
      offset: 0,
      limit: 100
    };
    API.create("BIZPAR")
      .getBizparByCategory(payloadReason)
      .then(res => {
        if (res.status === 200) {
          if (res.data.status === "S") {
            this.setState({
              bizparTerminationReason: res.data.data
            });
          }
        }
      });
    API.create("BIZPAR")
      .getBizparByCategory(payloadType)
      .then(res => {
        if (res.status === 200) {
          if (res.data.status === "S") {
            this.setState({
              bizparTerminationType: res.data.data
            });
          }
        }
      });
    API.create("BIZPAR")
      .getBizparByCategory(payloadCategory)
      .then(res => {
        if (res.status === 200) {
          if (res.data.status === "S") {
            this.setState({
              bizparTerminationCategory: res.data.data
            });
          }
        }
      });
  }

  startFetch = () => {
    this.LoadingBar.continousStart();
  };

  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
  };

  openTerminationDetail = index => {
    let { formEmployeeDetailVisible } = this.state;
    this.setState({
      formEmployeeDetailVisible: !formEmployeeDetailVisible,
      selectedIndex: !formEmployeeDetailVisible ? index : null,
      activeTab: !formEmployeeDetailVisible ? "General" : "",
      formEmployeeGeneralVisible: !formEmployeeDetailVisible ? true : false,
      formTerminationDetailVisible: false,
      formDocumentVisible: false,
      formHistoryVisible: false
    });
  };

  openTerminationUpdate = index => {
    let { formEmployeeUpdateVisible } = this.state;
    this.setState({
      formEmployeeUpdateVisible: !formEmployeeUpdateVisible,
      selectedIndex: !formEmployeeUpdateVisible ? index : null,
      activeTab: !formEmployeeUpdateVisible ? "General" : "",
      formEmployeeGeneralVisible: !formEmployeeUpdateVisible ? true : false,
      formTerminationDetailVisible: false,
      formDocumentVisible: false,
      formHistoryVisible: false
    });
  };

  openTerminationCreate = index => {
    this.clResizePane()
    let { formEmployeeCreateVisible } = this.state;
    this.setState({
      formEmployeeCreateVisible: !formEmployeeCreateVisible,
      selectedIndex: !formEmployeeCreateVisible ? index : null,
      activeTab: !formEmployeeCreateVisible ? "General" : "",
      formEmployeeGeneralVisible: !formEmployeeCreateVisible ? true : false,
      formTerminationDetailVisible: false,
      formDocumentVisible: false
      // formHistoryVisible: false
    });
  };

  opNavigator = (title, index) => {
    let cl = title === this.state.activeTab ? "c-n-link active" : "c-n-link";
    return (
      <li key={index} className={cl} onClick={this.opContent(title)}>
        {title}
      </li>
    );
  };

  opContent = title => e => {
    e.preventDefault();

    let allStateVisibleFalse = {
      ...this.state,
      formEmployeeGeneralVisible: false,
      formTerminationDetailVisible: false,
      formDocumentVisible: false,
      formHistoryVisible: false,
      activeTab: title
    };

    switch (title) {
      case "General":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formEmployeeGeneralVisible: true
        };
        break;
      case "Detail":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formTerminationDetailVisible: true
        };
        break;
      case "Document":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formDocumentVisible: true
        };
        break;
      case this.state.formEmployeeCreateVisible ? null : "History":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formHistoryVisible: true
        };
        break;
      default:
        break;
    }
    this.setState(allStateVisibleFalse);
  };

  async handleSubmit(payload) {
    this.setState({ sendState: "loading" })
    this.connectWebsocket('post/')
    console.log(JSON.stringify(payload));
    API.create("TERMINATION")
      .postTermination(payload)
      .then(res => {
        if (res.status === 200) {
          if (res.data.status === "S") {
            this.openSavePopUp()
            this.getAllTermination(0, 5);
          } else {
            alert("Failed: " + res.data.message);
          }
        } else {
          alert("Failed: " + res.data.message);
        }
      });
  }

  async handleUpdate(payload) {
    this.setState({ sendState: "loading" })
    this.connectWebsocket('put/')
    payload = {
      ...payload,
      updatedBy: this.props.auth.user.employeeID,
    }
    console.log(JSON.stringify(payload));
    API.create("TERMINATION")
      .updateTermination(payload)
      .then(res => {
        if (res.status === 200) {
          if (res.data.status === "S") {
            this.openSavePopUp()
            this.clResizePane()
            this.getAllTermination(0, 5);
          } else {
            alert("Failed: " + res.data.message);
          }
        } else {
          alert("Failed: " + res.data.message);
        }
      });
  }

  getData() {
    this.getAllTermination(0,5);
    this.setState({ dataTable: [] })
  }

  async submitTermintation(payload) {
    console.log(JSON.stringify(payload));
    API.create('BPM').submitTermination(payload).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === "S") {
            this.setState({ savePopUpVisible: true });
            this.clResizePane()
            this.getAllTermination(0, 5);
          } else {
            alert("Failed: " + res.data.message);
          }
        } else {
          alert("Failed: " + res.data.message);
        }
      }
    )
  }

  deleteTermination() {
    let payload = {
      terminationID: this.state.rawData[this.state.selectedIndex].terminationID,
      updatedBy: this.props.auth.user.employeeID
    };
    this.connectWebsocket('delete/')
    API.create("TERMINATION")
      .deleteTermination(payload)
      .then(res => {
        if (res.status === 200) {
          if (res.data.status === "S") {
            this.setState({ deletePopUpVisible: false, dataTable: [] });
            this.getAllTermination(0, 5);
          } else {
            alert("Failed: " + res.data.message);
          }
        } else {
          alert("Failed: " + res.data.message);
        }
      });
  }

  handleDelete = () => {
    this.deleteTermination();
  };

  openCreate() {
    let createPopUpVisible = this.state.createPopUpVisible
      ? !this.state.createPopUpVisible
      : false;
    this.setState({
      createVisible: !this.state.createVisible,
      createPopUpVisible
    });
  }

  openView(selectedIndex) {
    this.setState({ viewVisible: !this.state.viewVisible, selectedIndex });
  }

  openUpdate(selectedIndex) {
    let createPopUpVisible = this.state.createVisible
      ? !this.state.createPopUpVisible
      : false;
    this.setState({
      updateVisible: !this.state.updateVisible,
      selectedIndex,
      createPopUpVisible
    });
  }

  openSavePopUp = () => {
    this.setState({ 
      savePopUpVisible: !this.state.savePopUpVisible,
      confirmPopUpVisible: false,
      confirmPopUpVisibleSubmit: false,
      formEmployeeCreateVisible: false,
      formTerminationDetailVisible: false
    });
  };

  openDeletePopup = index => {
    this.setState({
      deletePopUpVisible: !this.state.deletePopUpVisible,
      selectedIndex: index
    });
  };

  openFileView() {
    this.setState({ formFileVisible: !this.state.formFileVisible })
  }

  async openReport(index) {
    let { rawData } = this.state
    let response = await fetch(process.env.REACT_APP_HCIS_BE_API + 'report/po/terminasi.by.termination.id/' + rawData[index].terminationID, {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4'
      }
    })
    response = await response.blob()
    if (response.size > 0) {
      response = URL.createObjectURL(response)
      this.setState({
        fileUrl: response,
        fileType: "pdf",
        formFileVisible: !this.state.formFileVisible
      });
    } else {
      alert("Failed: Report Not Found")
    }
  }

  columnsEmpTerminator = [
    "No",
    "Request Number",
    "Termination Type",
    "Termination Category",
    "Reason",
    "Employee Name",
    {
      name: "Status",
      options: {
        customHeadRender: (columnMeta) => (
          <th key={columnMeta.index} style={{ cursor: 'pointer', borderBottom: "1px rgba(0,0,0,0.1) solid", fontSize: 13, fontWeight: 1, textAlign: "center", top: 0, position: "sticky", backgroundColor: "#fff", zIndex: 100 }} scope="col">
            {columnMeta.name}
          </th>
        ),
        customBodyRender: val => {
          return (
            <div className="grid grid-2x content-center">
              <div className="column-1">
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
              </div>
              <div className="column-2">
                {val}
              </div>
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
            <div className="padding-15px grid grid-4x">
              <div className="column-1">
                {val === "INITIATE" ?
                  <button
                    className="btnAct"
                    style={{ marginRight: 15 }}
                    onClick={this.opSidePage('editForm', tableMeta.rowIndex)}>
                    <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                  </button> : null}
              </div>
              <div className="column-2">
                {val === "INITIATE" ?
                  <button
                    className="btnAct"
                    style={{ marginRight: 15 }}
                    onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
                  >
                    <i className="fa fa-lw fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                  </button> : null}
              </div>
              <div className={val === "INITIATE" ? "column-3" : "column-1"}>
                <button className="btnAct" style={{ marginRight: 15 }} onClick={() => this.openReport(tableMeta.rowIndex)}>
                  <i className="fa fa-lw fa-print" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                </button>
              </div>
              <div className={val === "INITIATE" ? "column-4" : "column-2"}>
                <button
                  className="btnAct"
                  onClick={this.opSidePage('viewForm', tableMeta.rowIndex)}>
                  <i className="fa fa-lw fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                </button>
              </div>
            </div>
          );
        }
      }
    }
  ];

  renderFile = () => {
    return (
      <div className="app-popup app-popup-show">
        <div className="padding-top-20px" />
        <div className="popup-content-small background-white border-radius">
          <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="popup-title">
                Report Viewer
              </div>
            </div>
            <div className="col-2 content-right">
              <button
                className="btn btn-circle btn-grey"
                onClick={this.openFileView.bind(this)}
              >
                <i className="fa fa-lg fa-times" />
              </button>
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            {
              this.state.fileType === "jpg" ||
                this.state.fileType === "png" ||
                this.state.fileType === "jpeg" ?
                (
                  <img src={this.state.fileUrl} width={"50%"} alt="" />
                ) : (
                  <FileViewer
                    fileType={this.state.fileType}
                    filePath={this.state.fileUrl} />
                )}
          </div>
          <div className="padding-15px background-grey">
            <div className="grid margin-top-15px">
              <div className="content-right">
                <button
                  style={{ marginLeft: "15px" }}
                  className="btn btn-primary"
                  type="button"
                  onClick={this.openFileView.bind(this)}
                >
                  <span>CLOSE</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="margin-bottom-20px"></div>
      </div>
    )
  }

  render() {
    if (R.isNil(this.props.auth.user)) return <Redirect to={{ pathname: "/" }} ></Redirect>
    let { terminationCount, table_query } = this.state
    let tableOptions = {
      ...options,
      serverSide: true,
      count: terminationCount,
      searchText: table_query,
      onTableChange: (action, tableState) => {
        switch (action) {
          case 'changePage':
            this.setState({ table_page: tableState.page })
            this.getAllTermination(tableState.page, tableState.rowsPerPage);
            break;
          case 'changeRowsPerPage':
            this.setState({ table_limit: tableState.rowsPerPage })
            this.getAllTermination(tableState.page, tableState.rowsPerPage);
            break;
          case 'search':
            let searchText = tableState.searchText ? tableState.searchText : ""
            this.setState({ table_query: searchText }, () => {
              this.getAllTermination(tableState.page, tableState.rowsPerPage)
            })
            break;
          default:
            break;
        }
      }
    }
    return (
      <SplitPaneSecond
        split="vertical"
        defaultSize={0}
        minSize={0}
        maxSize={0}
        primary="first"
        className="main-slider"
        style={{ height: 'calc(100vh - 50px)' }}>
        <div className='col-1'></div>
        <div className='col-2'>
          <IdleTimer
            ref={ref => { this.idleTimer = ref }}
            element={document}
            onActive={this.onActive.bind(this)}
            onIdle={this.onIdle.bind(this)}
            onAction={this.onAction.bind(this)}
            debounce={250}
            timeout={this.state.timeout} />
          <div>
            <ResizeSlider
              allowResize={this.state.allowResize}
              defaultSize={this.state.defaultSize}
              minSize={this.state.minSize}
              maxSize={this.state.maxSize}
              main={(
                <div className='a-s-p-mid no-header'>
                  <div>
                    <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
                    <div className="padding-5px grid grid-2x">
                      <div className="col-1">
                        <div className="txt-site txt-18 txt-bold txt-main padding-top-5px">
                          {/* EMPLOYEE TERMINATION */}
                        </div>
                      </div >
                      <div className="col-2 content-right">
                        <button
                          type="button"
                          className="btn btn-circle background-blue"
                          onClick={this.openTerminationCreate}
                        >
                          <i className="fa fa-1x fa-plus"></i>
                        </button>
                      </div>
                    </div >

                    <div className="padding-5px">
                      <MuiThemeProvider theme={getMuiTheme()}>
                        <MUIDataTable
                          key={terminationCount}
                          title={'Employee Termination'}
                          subtitle={"lorem ipsum dolor"}
                          data={this.state.dataTableTermination}
                          columns={this.columnsEmpTerminator}
                          options={tableOptions}
                        />
                      </MuiThemeProvider>
                    </div>

                    {/* {
                      this.state.formEmployeeDetailVisible && (
                        <div className="app-popup app-popup-show">
                          <div className="padding-top-20px" />
                          <div className="popup-content background-white border-radius">
                            <div className="popup-panel grid grid-2x">
                              <div className="col-1">
                                <div className="popup-title">
                                  Termination - View Form
                                 </div>
                              </div>
                              <div className="col-2 content-right">
                                <button
                                  className="btn btn-circle btn-grey"
                                  onClick={this.openTerminationDetail}
                                >
                                  <i className="fa fa-lg fa-times" />
                                </button>
                              </div>
                            </div>

                            <div className="popup-content-grid">
                              <div className="popup-scroll popup-col-1">
                                <ul className="vertical-tab">
                                  {this.state.tabMenu.map((data, index) => {
                                    return this.opNavigator(data, index);
                                  })}
                                </ul>
                              </div>

                              <div className="popup-scroll popup-col-2">
           
                                {this.state.formEmployeeGeneralVisible && (
                                  <FormEmpTermination-- please select termination type --
                                    type={"view"}
                                    bizparTerminationCategory={
                                      this.state.bizparTerminationCategory
                                    }
                                    bizparTerminationType={this.state.bizparTerminationType}
                                    bizparTerminationReason={
                                      this.state.bizparTerminationReason
                                    }
                                    rawData={this.state.rawData[this.state.selectedIndex]}
                                    onClickClose={this.openTerminationDetail}
                                  />
                                )}

                                {this.state.formTerminationDetailVisible && (
                                  <FormEmpTerminationDetail
                                    type={"view"}
                                    rawData={this.state.rawData[this.state.selectedIndex]}
                                    onClickClose={this.openTerminationDetail}
                                  />
                                )}

                                {this.state.formDocumentVisible && (
                                  <FormEmpTerminationDocument
                                    type={"view"}
                                    rawData={this.state.rawData[this.state.selectedIndex]}
                                    onClickClose={this.openTerminationDetail}
                                  />
                                )}

                             
                                {this.state.formHistoryVisible && (
                                  <FormEmpTerminationHistory
                                    type={"view"}
                                    onClickClose={this.openTerminationDetail}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    } */}

                    {
                      this.state.formEmployeeUpdateVisible && (
                        <div className="app-popup app-popup-show">
                          <div className="padding-top-20px" />
                          <div className="popup-content background-white border-radius">
                            <div className="popup-panel grid grid-2x">
                              <div className="col-1">
                                <div className="popup-title">
                                  Termination - Edit Form
                                 </div>
                              </div>
                              <div className="col-2 content-right">
                                <button
                                  className="btn btn-circle btn-grey"
                                  onClick={this.openTerminationUpdate}
                                >
                                  <i className="fa fa-lg fa-times" />
                                </button>
                              </div>
                            </div>

                            <div className="popup-content-grid">
                              <div className="popup-scroll popup-col-1">
                                <ul className="vertical-tab">
                                  {this.state.tabMenu.map((data, index) => {
                                    return this.opNavigator(data, index);
                                  })}
                                </ul>
                              </div>

                              <div className="popup-scroll popup-col-2">
                                {/* General */}
                                {this.state.formEmployeeGeneralVisible && (
                                  <FormEmpTermination
                                    sendState={this.state.sendState}
                                    type={"update"}
                                    bizparTerminationCategory={
                                      this.state.bizparTerminationCategory
                                    }
                                    bizparTerminationType={this.state.bizparTerminationType}
                                    bizparTerminationReason={
                                      this.state.bizparTerminationReason
                                    }
                                    rawData={this.state.rawData[this.state.selectedIndex]}
                                    onClickClose={this.openTerminationUpdate}
                                    onSave={this.handleUpdate.bind(this)}
                                    onSubmit={this.submitTermintation.bind(this)}
                                  />
                                )}

                                {/* Detail */}
                                {this.state.formTerminationDetailVisible && (
                                  <FormEmpTerminationDetail
                                    type={"update"}
                                    sendState={this.state.sendState}
                                    rawData={this.state.rawData[this.state.selectedIndex]}
                                    onClickClose={this.openTerminationUpdate}
                                    onSave={this.handleUpdate.bind(this)}
                                    onSubmit={this.submitTermintation.bind(this)}
                                  />
                                )}

                                {/* Document */}
                                {this.state.formDocumentVisible && (
                                  <FormEmpTerminationDocument
                                    type={"update"}
                                    sendState={this.state.sendState}
                                    rawData={this.state.rawData[this.state.selectedIndex]}
                                    onClickClose={this.openTerminationUpdate}
                                    onClickSave={this.handleUpdate.bind(this)}
                                    onSubmit={this.submitTermintation.bind(this)}
                                  />
                                )}

                                {/* History */}
                                {this.state.formHistoryVisible && (
                                  <FormEmpTerminationHistory
                                    type={"update"}
                                    rawData={this.state.rawData[this.state.selectedIndex]}
                                    onClickClose={this.openTerminationUpdate}
                                    onClickSave={this.openSavePopUp.bind(this)}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    }

                    {
                      this.state.formEmployeeCreateVisible && (
                        <FormTerminationCreate
                          sendState={this.state.sendState}
                          type={"create"}
                          bizparTerminationCategory={this.state.bizparTerminationCategory}
                          bizparTerminationType={this.state.bizparTerminationType}
                          bizparTerminationReason={this.state.bizparTerminationReason}
                          onClickClose={this.openTerminationCreate}
                          onSave={this.handleSubmit.bind(this)}
                        />
                      )
                    }

                    {this.state.formFileVisible && this.renderFile()}

                    {this.state.notifVisible && (<WebsocketNotif message={this.state.message} type={"float"} onClickClose={this.closeNotif.bind(this)} />
                    )}

                    {
                      this.state.savePopUpVisible && (
                        <PopUp
                          type={"save"}
                          class={"app-popup app-popup-show"}
                          onClick={() => {
                            this.setState({
                              formEmployeeDetailVisible: false,
                              formEmployeeUpdateVisible: false,
                              formEmployeeCreateVisible: false,
                              formEmployeeGeneralVisible: false,
                              formTerminationDetailVisible: false,
                              formDocumentVisible: false,
                              formHistoryVisible: false,
                              savePopUpVisible: false
                            });
                          }}
                        />
                      )
                    }
                    {
                      this.state.deletePopUpVisible && (
                        <PopUp
                          type={"delete"}
                          class={"app-popup app-popup-show"}
                          onClickDelete={this.handleDelete}
                          onClick={this.openDeletePopup}
                        />
                      )
                    }
                  </div >
                </div>
              )}
              side={(
                <div className="a-s-p-side">
                  {/* edit */}
                  {this.state.slideTermination && (
                    <div>
                      <div className="a-s-p-place active">
                        <div className="a-s-p-top">
                          <div className="grid grid-2x">
                            <div className="col-1">
                              <div className="display-flex-normal margin-top-10px">
                                <i className="fa fa-1x fa-user-times"></i>
                                <span className="txt-site txt-11 txt-main margin-left-10px">
                                  Termination - {this.state.slideType === 'view' ? 'View' : 'Edit'} Forms
                                  </span>
                              </div>
                            </div>
                            <div className="col-2 content-right">
                              <button
                                onClick={() => this.clResizePane()}
                                className="btn btn-circle btn-grey">
                                <i className="fa fa-lg fa-arrow-right" />
                              </button>
                            </div>
                          </div>
                        </div>
                        <form action="#">
                          <div className="a-s-p-mid a-s-p-pad border-top">
                            <div className="padding-5px">
                              <div className="app-open-close margin-bottom-20px">
                                <input
                                  type="checkbox"
                                  name="navmenu"
                                  className="app-open-close-input"
                                  id="navmenu-ch" />
                                <div className="grid grid-2x margin-bottom-10px">
                                  <div className="col-1">
                                    <div className="display-flex-normal margin-top-10px">
                                      <i className="fa fa-1x fa-user-times margin-right-5px"></i>
                                      <span className="txt-site txt-11 txt-main">Termination General</span>
                                    </div>
                                  </div>
                                  <div className="col-2 content-right">
                                    <label htmlFor="navmenu-ch">
                                      <div className="app-open-close-icon"></div>
                                    </label>
                                  </div>
                                </div>
                                <div className="app-open-close-content">
                                  <FormEmpTermination
                                    type={this.state.slideType}
                                    sendState={this.state.sendState}
                                    bizparTerminationCategory={
                                      this.state.bizparTerminationCategory
                                    }
                                    bizparTerminationType={this.state.bizparTerminationType}
                                    bizparTerminationReason={
                                      this.state.bizparTerminationReason
                                    }
                                    rawData={this.state.rawData[this.state.selectedIndex]}
                                    onClickClose={() => this.clResizePane()}
                                    onSave={this.handleUpdate.bind(this)}
                                    onSubmit={this.submitTermintation.bind(this)}
                                  />
                                </div>
                              </div>
                              <div className="app-open-close margin-bottom-20px">
                                <input
                                  type="checkbox"
                                  name="navmenu"
                                  className="app-open-close-input"
                                  id="navmenu-ch1" />
                                <div className="grid grid-2x margin-bottom-10px">
                                  <div className="col-1">
                                    <div className="display-flex-normal margin-top-10px">
                                      <i className="fa fa-1x fa-user-times margin-right-5px"></i>
                                      <span className="txt-site txt-11 txt-main">Termination Detail</span>
                                    </div>
                                  </div>
                                  <div className="col-2 content-right">
                                    <label htmlFor="navmenu-ch1">
                                      <div className="app-open-close-icon"></div>
                                    </label>
                                  </div>
                                </div>
                                <div className="app-open-close-content">
                                  <FormEmpTerminationDetail
                                    type={this.state.slideType}
                                    sendState={this.state.sendState}
                                    rawData={this.state.rawData[this.state.selectedIndex]}
                                    onClickClose={() => this.clResizePane()}
                                    onSave={this.handleUpdate.bind(this)}
                                    onSubmit={this.submitTermintation.bind(this)}
                                  />
                                </div>
                              </div>
                              <div className="app-open-close margin-bottom-20px">
                                <input
                                  type="checkbox"
                                  name="navmenu"
                                  className="app-open-close-input"
                                  id="navmenu-ch4" />
                                <div className="grid grid-2x margin-bottom-10px">
                                  <div className="col-1">
                                    <div className="display-flex-normal margin-top-10px">
                                      <i className="fa fa-1x fa-user-times margin-right-5px"></i>
                                      <span className="txt-site txt-11 txt-main">Termination Form</span>
                                    </div>
                                  </div>
                                  <div className="col-2 content-right">
                                    <label htmlFor="navmenu-ch4">
                                      <div className="app-open-close-icon"></div>
                                    </label>
                                  </div>
                                </div>
                                <div className="app-open-close-content">
                                  <FormEmployeeTerminationOrg
                                    type={this.state.slideType}
                                    rawData={this.state.rawData[this.state.selectedIndex]}
                                    onClickClose={() => this.clResizePane()}
                                  />
                                </div>
                              </div>
                              <div className="app-open-close margin-bottom-20px">
                                <input
                                  type="checkbox"
                                  name="navmenu"
                                  className="app-open-close-input"
                                  id="navmenu-ch3" />
                                <div className="grid grid-2x margin-bottom-10px">
                                  <div className="col-1">
                                    <div className="display-flex-normal margin-top-10px">
                                      <i className="fa fa-1x fa-user-times margin-right-5px"></i>
                                      <span className="txt-site txt-11 txt-main">Termination Document</span>
                                    </div>
                                  </div>
                                  <div className="col-2 content-right">
                                    <label htmlFor="navmenu-ch3">
                                      <div className="app-open-close-icon"></div>
                                    </label>
                                  </div>
                                </div>
                                <div className="app-open-close-content">
                                  <FormEmpTerminationDocument
                                    type={this.state.slideType}
                                    sendState={this.state.sendState}
                                    rawData={this.state.rawData[this.state.selectedIndex]}
                                    onClickClose={() => this.clResizePane()}
                                    onClickSave={this.handleUpdate.bind(this)}
                                    getData={this.getData.bind(this)}
                                    onSubmit={this.submitTermintation.bind(this)}
                                  />
                                </div>
                              </div>
                              <div className="app-open-close margin-bottom-20px">
                                <input
                                  type="checkbox"
                                  name="navmenu"
                                  className="app-open-close-input"
                                  id="navmenu-ch2" />
                                <div className="grid grid-2x margin-bottom-10px">
                                  <div className="col-1">
                                    <div className="display-flex-normal margin-top-10px">
                                      <i className="fa fa-1x fa-user-times margin-right-5px"></i>
                                      <span className="txt-site txt-11 txt-main">Termination History</span>
                                    </div>
                                  </div>
                                  <div className="col-2 content-right">
                                    <label htmlFor="navmenu-ch2">
                                      <div className="app-open-close-icon"></div>
                                    </label>
                                  </div>
                                </div>
                                <div className="app-open-close-content">
                                  <FormEmpTerminationHistory
                                    type={this.state.slideType}
                                    rawData={this.state.rawData[this.state.selectedIndex]}
                                    onClickClose={() => this.clResizePane()}
                                    onClickSave={this.openSavePopUp.bind(this)}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                      <ReactTooltip />
                    </div>

                  )}
                </div>
              )}>
              >
            </ResizeSlider>
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

export default connect(mapStateToProps, mapDispatchToProps)(employeeTermination);
