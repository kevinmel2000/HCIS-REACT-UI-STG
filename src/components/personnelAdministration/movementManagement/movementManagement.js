import React, { Component } from "react"
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import MUIDataTable from "mui-datatables-bitozen"
import LoadingBar from "react-top-loading-bar"
import FormMovement from "../../../modules/forms/formMovement/formMovement"
import FormMovementDetail from "../../../modules/forms/formMovement/formMovementDetail"
import FormMovementDocument from "../../../modules/forms/formMovement/formMovementDocument"
import FormMovementHistory from "../../../modules/forms/formMovement/formMovementHistory"
import PopUp from "../../pages/PopUpAlert"
import API from "../../../Services/Api"
import FormMovementCreate from "../../../modules/forms/formMovement/formMovementCreate"
import FileViewer from 'react-file-viewer'
import ResizeSlider from '../../../modules/resize/Slider'
import SplitPaneSecond from 'react-split-pane'
import ReactTooltip from 'react-tooltip'
import * as R from 'ramda'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import AuthAction from '../../../Redux/AuthRedux'
import IdleTimer from 'react-idle-timer'
import FormMovementOrgStructure from "../../../modules/forms/formMovement/formMovementOrgStructure"
import Stomp from 'stompjs'
import WebsocketNotif from '../../../modules/popup/WebsocketNotif'

const clSlidePage = 'a-s-p-main'
var ct = require("../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

class movement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createPopUpVisible: false,
      createVisible: false,
      rawData: [],
      dataTableMove: [],
      fetching: false,
      refreshing: false,
      bizparMovementCategory: [],
      bizparMovementType: [],
      dataEmployee: [],
      sendState: "",

      formMovementViewVisible: false,
      formMovementDetailVisible: false,
      deleteClass: "app-popup",
      saveClass: "app-popup",
      type: "",
      fileUrl: "",
      fileType: "",
      formFileVisible: false,
      notifVisible: false,
      message: '',

      formGeneral: false,
      formGeneralVisible: false,
      formCreateVisible: false,
      formDetail: false,
      formDocument: false,
      formHistory: false,
      activeTab: "",
      tabMenu: [
        "General",
        "Detail",
        "Document",
        "History"
      ],
      tabMenuCreate: ["General", "Detail", "Document"],
      // important for resize pane
      allowResize: false,
      defaultSize: 0,
      minSize: 0,
      maxSize: 0,
      slideMovement: false,
      classAppSlidePage: 'app-side-page',
      classAppSlidePageMain: clSlidePage,
      timeout: 1000 * 100 * 9,
      isTimedOut: false,
      movementCount: 0,
      table_limit: 5,
      table_page: 0,
      table_query: "",
      user: this.props.auth.user,
    }
    this.idleTimer = null
    this.handleDelete = this.handleDelete.bind(this)
  }

  logout() {
    this.props.authLogout()
    return <Redirect to={{ pathname: "/" }} ></Redirect>
  }

  onAction() {
    this.setState({ isTimedOut: false })
  }

  connectWebsocket = async (method) => {
    let stompClient = Stomp.client(process.env.REACT_APP_HCIS_WEBSOCKET);
    let employeeID = this.props.auth.user.employeeID
    stompClient.debug = null;
    stompClient.connect({}, (frame) => {
      console.log('Connected: ' + frame)
      stompClient.subscribe('/topic/movement/' + method + employeeID,
        (message) => {
          let res = JSON.parse(message.body)
          console.log('messages: ' + res.messages)
          setTimeout(() => {
            this.setState({ sendState: "finished" })
            setTimeout(() => {
              this.setState({ notifVisible: true, message: res.messages, formCreateVisible: false, formGeneralVisible: false, })
              this.clResizePane()
              setTimeout(() => {
                this.setState({ notifVisible: false, sendState: "" })
              }, 2000)
            }, 500);
          }, 500);
          setTimeout(() => {
            this.setState({
              notifVisible: false, message: res.messages, formCreateVisible: false, formGeneralVisible: false, sendState: ""
            })
            this.clResizePane()
          }, 4000);
        })
    })
  }

  closeNotif() {
    this.setState({ notifVisible: false })
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
      slideMovement: false,
      allowResize: false,
      defaultSize: 0,
      minSize: 0,
      maxSize: 0
    })
  }

  getDataByID(value) {
    API.create('MOVEMENT_QUERY').getMovementByID(value).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            console.log(res.data);
            this.onFinishFetch()
            this.setState({
              dataByID: res.data.data,
            })
          }
        }
      }
    )
  }

  opSidePage = (menu, data) => (e) => {
    e.preventDefault()
    this.setState({
      classAppSlidePage: 'app-side-page op-app-side',
      slideMovement: false,
    })

    let id = this.state.rawData[data].movementID
    API.create('MOVEMENT_QUERY').getMovementByID(id).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            console.log(res.data);
            this.onFinishFetch()
            this.setState({
              dataByID: res.data.data,
              slideMovement: true,
            })
          }
        }
      }
    )

    this.opResizePane()

    switch (menu) {
      case 'viewForm':
        this.setState({
          // slideMovement: true,
          selectedIndex: data,
          slideType: 'view'
        })
        break
      case 'editForm':
        this.setState({
          // slideMovement: true,
          selectedIndex: data,
          slideType: 'edit'
        })
        break
      default:
        break
    }

  }

  clSidePage = () => {
    this.setState({ classAppSlidePage: 'app-side-page' })
  }

  componentDidMount() {
    if (!R.isNil(this.props.auth.user)) {
      this.startFetch();
      this.getDataMovement(this.state.table_page, this.state.table_limit);
      this.getBizparMovementType();
      this.getBizparMovementCategory();
    }
  }

  getDataMovement(page, limit) {
    console.log('masuk sini')
    let payload = {
      offset: page,
      limit: limit,
      params: {}
    }
    let status = {
      limit: limit,
      offset: page,
      params: {
        movementStatus: this.state.table_query
      }
    }
    let name = {
      limit: limit,
      offset: page,
      params: {
        employeeName: this.state.table_query
      }
    }
    if (!R.isEmpty(this.state.table_query)) {
      API.create('MOVEMENT_QUERY').getCountMovementByName(this.state.table_query).then(res => {
        if (res.ok) {
          this.setState({ movementCount: res.data.data })
        }
      })
      API.create('MOVEMENT_QUERY').getAllMovementByName(name).then(response => {
        if (response.data && response.data.status === "S") {
          if (response.data.data === null) {
            this.setState({
              dataTableMove: []
            })
          } else {
            let dataTableMove = response.data.data.map((value, index) => {
              const { movementID, movementType, movementCategory, employee, movementStatus } = value;

              return [
                index += 1,
                movementID,
                movementType ? movementType.bizparValue : "-",
                movementCategory ? movementCategory.bizparValue : "-",
                employee ? employee.employeeName : "-",
                movementStatus.replace(/_/g, " "),
                movementStatus
              ]
            })
            this.setState({
              rawData: response.data.data,
              dataTableMove
            })
          }
        }
      })
      if (this.state.table_query === "INITIATE" || this.state.table_query === "APPROVED" || this.state.table_page === "REJECTED") {
        API.create('MOVEMENT_QUERY').getCountMovementByStatus(this.state.table_query).then(count => {
          this.setState({ movementCount: count.data.data })
        })
        API.create('MOVEMENT_QUERY').getAllMovementByStatus(status).then(res => {
          console.log(limit, page)
          if (res.ok) {
            if (res.data.status === 'S') {
              this.onFinishFetch()
              let dataTableMove = res.data.data.map((value, index) => {
                const { movementID, movementType, movementCategory, employee, movementStatus } = value;

                return [
                  index += 1,
                  movementID,
                  movementType ? movementType.bizparValue : "-",
                  movementCategory ? movementCategory.bizparValue : "-",
                  employee ? employee.employeeName : "-",
                  movementStatus.replace(/_/g, " "),
                  movementStatus
                ]
              })
              this.setState({
                rawData: res.data.data,
                dataTableMove
              })
            }
          }
        })
      }
    } else {
      API.create('MOVEMENT_QUERY').getCountAllMovement().then(res => {
        this.setState({ movementCount: res.data.data })
      })
      console.log(page, limit)
      API.create('MOVEMENT_QUERY').getAllMovement(payload).then(
        (res) => {
          if (res.status === 200) {
            if (res.data.status === 'S') {
              console.log(res.data);
              this.onFinishFetch()
              let dataTableMove = res.data.data.map((value, index) => {
                const { movementID, movementType, movementCategory, employee, movementStatus } = value;

                return [
                  index += 1,
                  movementID,
                  movementType ? movementType.bizparValue : "-",
                  movementCategory ? movementCategory.bizparValue : "-",
                  employee ? employee.employeeName : "-",
                  movementStatus.replace(/_/g, " "),
                  movementStatus
                ]
              })
              this.setState({
                rawData: res.data.data,
                dataTableMove
              })
            } else {
              alert("Failed: " + res.data.message)
            }
          }
        }
      )
    }
  }

  async getBizparMovementType() {
    let payloadGender = {
      params: {
        bizparCategory: "MOVEMENT_TYPE"
      },
      offset: 0,
      limit: 5
    }
    API.create('BIZPAR').getBizparByCategory(payloadGender).then(
      (res) => {
        if (res.status === 200) {
          console.log(res.data);
          if (res.data.status === 'S') {
            this.setState({
              bizparMovementType: res.data.data
            })
          }
        }
      }
    )
  }

  async getBizparMovementCategory() {
    let payloadGender = {
      params: {
        bizparCategory: "MOVEMENT_CATEGORY"
      },
      offset: 0,
      limit: 5
    }
    API.create('BIZPAR').getBizparByCategory(payloadGender).then(
      (res) => {
        if (res.status === 200) {
          console.log(res.data);
          if (res.data.status === 'S') {
            this.setState({
              bizparMovementCategory: res.data.data
            })
          }
        }
      }
    )
  }

  startFetch = () => {
    this.LoadingBar.continousStart();
  };

  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
  };

  openCreateForm = () => {
    this.clResizePane()
    this.setState({ formCreateVisible: !this.state.formCreateVisible })
  };

  openGeneralVisible = index => {
    let { formGeneralVisible } = this.state;
    this.setState({
      formGeneralVisible: !formGeneralVisible,
      selectedIndex: !formGeneralVisible ? index : null,
      activeTab: !formGeneralVisible ? "General" : "",
      formGeneral: !formGeneralVisible ? true : false,
      formDetail: false,
      formDocument: false,
      formHistory: false,
      type: "edit"
    });
  };

  openMovementDetailView = index => {
    let { formGeneralVisible } = this.state;
    this.setState({
      formGeneralVisible: !formGeneralVisible,
      selectedIndex: !formGeneralVisible ? index : null,
      activeTab: !formGeneralVisible ? "General" : "",
      formGeneral: !formGeneralVisible ? true : false,
      formDetail: false,
      formDocument: false,
      formHistory: false,
      type: "view"
    });
  };

  async openReport(index) {
    let { rawData } = this.state
    let response = await fetch(process.env.REACT_APP_HCIS_BE_API + 'report/po/movement.pengangkatan.karyawan/' + rawData[index].movementID, {
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

  openCloseCreate() {
    let createPopUpVisible = this.state.createPopUpVisible
      ? !this.state.createPopUpVisible
      : false;
    this.setState({
      createVisible: !this.state.createVisible,
      createPopUpVisible
    });
  }

  opDeleteAble = () => {
    alert("delete");
  };

  opNavigator = title => {
    let cl = title === this.state.activeTab ? "c-n-link active" : "c-n-link";
    return (
      <li key={title} className={cl} onClick={this.opContent(title)}>
        {title}
      </li>
    );
  };

  opContent = title => e => {
    e.preventDefault();

    let allStateVisibleFalse = {
      ...this.state,
      formGeneral: false,
      formDetail: false,
      formDocument: false,
      formHistory: false,
      activeTab: title
    };

    switch (title) {
      case "General":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formGeneral: true
        };
        break;
      case "Detail":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formDetail: true
        };
        break;
      case "Document":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formDocument: true
        };
        break;
      case "History":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formHistory: true
        };
        break;
      default:
        break;
    }
    this.setState(allStateVisibleFalse);
  };

  openDeletePopup = (index) => {
    if (this.state.deleteClass === "app-popup app-popup-show") {
      this.setState({ deleteClass: "app-popup", selectedIndex: null });
    } else {
      this.setState({ deleteClass: "app-popup app-popup-show", selectedIndex: index });
    }
  };

  openSearchForm = (searchType = "employee") => {
    if (this.state.searchClass === "app-popup app-popup-show") {
      this.setState({ searchClass: "app-popup", searchType });
    } else {
      this.setState({ searchClass: "app-popup app-popup-show", searchType });
    }
  };

  openFileView() {
    this.setState({ formFileVisible: !this.state.formFileVisible })
  }

  openSavePopUp = () => {
    if (this.state.saveClass === "app-popup app-popup-show") {
      this.setState({
        saveClass: "app-popup",
        formCreateVisible: false,
        formGeneralVisible: false,
      })
    } else {
      this.setState({ saveClass: "app-popup app-popup-show" });
      
    }
  };

  async handleSubmit(payload) {
    this.setState({ sendState: "loading" })
    this.connectWebsocket('post/')
    API.create('MOVEMENT').postMovement(payload).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            // this.clResizePane()
            this.openSavePopUp()
            this.getDataMovement({
              offset: 0,
              limit: 200
            });
          } else {
            console.log(res);
            alert("Failed: " + res.data.message)
          }
        } else {
          console.log(res)
        }
      })
  }

  async handleUpdate(payload) {
    this.setState({ sendState: "loading" })
    this.connectWebsocket('put/')
    payload = {
      ...payload,
      updatedBy: this.props.auth.user.employeeID,
    }
    API.create('MOVEMENT').updateMovement(payload).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            this.openSavePopUp()
          } else {
            console.log(res);
            alert("Failed: " + res.data.message)
          }
        } else {
          console.log(res)
        }
      })
  }

  async submitMovement(payload) {
    console.log(JSON.stringify(payload))
    API.create('BPM').submitMovement(payload).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            this.clResizePane()
            this.openSavePopUp()
          } else {
            console.log(res);
            alert("Failed: " + res.data.message)
          }
        } else {
          console.log(res)
        }
      }
    )
  }

  deleteCompany() {
    let payload = {
      movementID: this.state.rawData[this.state.selectedIndex].movementID,
      updatedBy: this.props.auth.user.employeeID
    }
    this.connectWebsocket('delete/')
    API.create('MOVEMENT').deleteMovement(payload).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            console.log(res.data)
            this.setState({ deleteClass: 'app-popup', dataTable: [] })
            this.getDataMovement(0,5);
          } else {
            alert("Failed: " + res.data.message)
          }
        } else {
          console.log(res)
        }
      })
  }

  handleDelete() {
    this.deleteCompany()
  }

  columns = [
    "No",
    "Request Number",
    "Movement Type",
    "Movement Category",
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
            <div className="grid grid-4x">
              <div className="column-1">
                {val === "INITIATE" ?
                  <button
                    onClick={this.opSidePage('editForm', tableMeta.rowIndex)}
                    style={{ marginRight: 15 }}
                    className="btnAct"
                  >
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
    let { movementCount, table_query } = this.state
    let tableOptions = {
      ...options,
      serverSide: true,
      count: movementCount,
      searchText: table_query,
      onTableChange: (action, tableState) => {
        switch (action) {
          case 'changePage':
            this.setState({ table_page: tableState.page })
            this.getDataMovement(tableState.page, tableState.rowsPerPage);
            break;
          case 'changeRowsPerPage':
            this.setState({ table_limit: tableState.rowsPerPage })
            this.getDataMovement(tableState.page, tableState.rowsPerPage);
            break;
          case 'search':
            let searchText = tableState.searchText ? tableState.searchText : ""
            this.setState({ table_query: searchText }, () => {
              this.getDataMovement(tableState.page, tableState.rowsPerPage)
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
                      <div className="txt-site txt-18 txt-bold txt-main padding-top-5px margin-left-5px margin-bottom-5px">
                        {/* Employee Movement */}
                      </div>
                      <div className="col-2 content-right">
                        <button
                          type="button"
                          className="btn btn-circle background-blue"
                          onClick={this.openCreateForm}
                        >
                          <i className="fa fa-1x fa-plus"></i>
                        </button>
                      </div>
                    </div>
                    <div className="padding-5px">
                      <MuiThemeProvider theme={getMuiTheme()}>
                        <MUIDataTable
                          key={movementCount}
                          title='Employee Movement'
                          subtitle={"lorem ipsum dolor"}
                          data={this.state.dataTableMove}
                          columns={this.columns}
                          options={tableOptions}
                        />
                      </MuiThemeProvider>
                    </div>

                    {this.state.formCreateVisible && (
                      <FormMovementCreate
                        type={"create"}
                        sendState={this.state.sendState}
                        bizparMovementCategory={this.state.bizparMovementCategory}
                        bizparMovementType={this.state.bizparMovementType}
                        onSave={this.handleSubmit.bind(this)}
                        onClickClose={this.openCreateForm.bind(this)}
                      />
                    )}

                    {this.state.formGeneralVisible && (
                      <div className="app-popup app-popup-show">
                        <div className="padding-top-20px" />
                        <div className="popup-content background-white border-radius">
                          <div className="popup-panel grid grid-2x">
                            <div className="col-1">
                              <div className="popup-title">
                                {this.state.type === "edit"
                                  ? "Movement - Edit Form"
                                  : this.state.type === "create"
                                    ? "Movement - Create Form"
                                    : "Movement - View Form"}
                              </div>
                            </div>
                            <div className="col-2 content-right">
                              <button
                                className="btn btn-circle btn-grey"
                                onClick={this.openGeneralVisible}
                              >
                                <i className="fa fa-lg fa-times" />
                              </button>
                            </div>
                          </div>
                          <div className="popup-content-grid">
                            <div className="popup-col-1">
                              <ul className="vertical-tab">
                                {this.state.type === "create"
                                  ? this.state.tabMenuCreate.map((data, index) => {
                                    return this.opNavigator(data, index);
                                  })
                                  : this.state.tabMenu.map((data, index) => {
                                    return this.opNavigator(data, index);
                                  })}
                                {/* {this.state.tabMenu.map((data, index) => { return this.opNavigator(data, index) } )} */}
                              </ul>
                            </div>
                            <div className="popup-col-2">
                              {/* Movement General*/}
                              {this.state.formGeneral && (
                                <FormMovement
                                  type={this.state.type}
                                  sendState={this.state.sendState}
                                  movementData={this.state.type !== 'create' ? this.state.dataByID : null}
                                  onClickClose={this.openMovementDetailView.bind(this)}
                                  onClickSearch={this.openSearchForm}
                                  searchType={this.state.searchType}
                                  onSave={this.handleUpdate.bind(this)}
                                  bizparMovementCategory={this.state.bizparMovementCategory}
                                  bizparMovementType={this.state.bizparMovementType}
                                  onClickSave={this.submitMovement.bind(this)}
                                />
                              )}
                              {/* Movement Detail*/}
                              {this.state.formDetail && (
                                <FormMovementDetail
                                  type={this.state.type}
                                  sendState={this.state.sendState}
                                  movementData={this.state.type !== 'create' ? this.state.dataByID : null}
                                  onClickClose={this.openMovementDetailView.bind(this)}
                                  onSave={this.handleUpdate.bind(this)}
                                  onClickSave={this.submitMovement.bind(this)}
                                />
                              )}
                              {/* Movement Document*/}
                              {this.state.formDocument && (
                                <FormMovementDocument
                                  type={this.state.type}
                                  sendState={this.state.sendState}
                                  movementData={this.state.type !== 'create' ? this.state.dataByID : null}
                                  onClickClose={this.openMovementDetailView.bind(this)}
                                  onClickSave={() => {
                                    this.setState({ dataTable: [] })
                                    this.getDataMovement(0,5)
                                    this.openMovementDetailView()
                                  }}
                                  onClickDelete={this.handleUpdate.bind(this)}
                                  onDelete={this.openDeletePopup.bind(this)}
                                  onClickSubmit={this.submitMovement.bind(this)}
                                />
                              )}
                              {/* Movement History*/}
                              {this.state.formHistory && (
                                <FormMovementHistory
                                  type={this.state.type}
                                  onClickClose={this.openMovementDetailView.bind(this)}
                                  onSave={this.openSavePopUp.bind(this)}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="padding-top-20px" />
                      </div>
                    )}

                    {this.state.notifVisible && (<WebsocketNotif message={this.state.message} type={"float"} onClickClose={this.closeNotif.bind(this)} />
                    )}

                    {this.state.formFileVisible && this.renderFile()}

                    <PopUp
                      type={"delete"}
                      class={this.state.deleteClass}
                      onClick={this.openDeletePopup}
                      onClickDelete={this.handleDelete}
                    />
                    <PopUp
                      type={"save"}
                      class={this.state.saveClass}
                      onClick={this.openSavePopUp}
                    />
                  </div>
                </div>
              )}
              side={(
                <div className="a-s-p-side">
                  {/* edit */}
                  {this.state.slideMovement && (
                    <div>
                      <div className="a-s-p-place active">
                        <div className="a-s-p-top">
                          <div className="grid grid-2x">
                            <div className="col-1">
                              <div className="display-flex-normal margin-top-10px">
                                <i className="fa fa-1x fa-suitcase-rolling"></i>
                                <span className="txt-site txt-11 txt-main margin-left-10px">
                                  Movement - {this.state.slideType === 'view' ? 'View' : 'Edit'} Forms
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
                                      <i className="fa fa-1x fa-suitcase-rolling margin-right-5px"></i>
                                      <span className="txt-site txt-11 txt-main">Movement General</span>
                                    </div>
                                  </div>
                                  <div className="col-2 content-right">
                                    <label htmlFor="navmenu-ch">
                                      <div className="app-open-close-icon"></div>
                                    </label>
                                  </div>
                                </div>
                                <div className="app-open-close-content">
                                  <FormMovement
                                    type={this.state.slideType}
                                    sendState={this.state.sendState}
                                    movementData={this.state.type !== 'create' ? this.state.dataByID : null}
                                    onClickClose={() => this.clResizePane()}
                                    onClickSearch={this.openSearchForm}
                                    searchType={this.state.searchType}
                                    onSave={this.handleUpdate.bind(this)}
                                    bizparMovementCategory={this.state.bizparMovementCategory}
                                    bizparMovementType={this.state.bizparMovementType}
                                    onClickSave={this.submitMovement.bind(this)}
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
                                      <i className="fa fa-1x fa-suitcase-rolling margin-right-5px"></i>
                                      <span className="txt-site txt-11 txt-main">Movement Detail</span>
                                    </div>
                                  </div>
                                  <div className="col-2 content-right">
                                    <label htmlFor="navmenu-ch1">
                                      <div className="app-open-close-icon"></div>
                                    </label>
                                  </div>
                                </div>
                                <div className="app-open-close-content">
                                  <FormMovementDetail
                                    type={this.state.slideType}
                                    sendState={this.state.sendState}
                                    movementData={this.state.type !== 'create' ? this.state.dataByID : null}
                                    onClickClose={() => this.clResizePane()}
                                    onSave={this.handleUpdate.bind(this)}
                                    onClickSave={this.submitMovement.bind(this)}
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
                                      <i className="fa fa-1x fa-suitcase-rolling margin-right-5px"></i>
                                      <span className="txt-site txt-11 txt-main">Movement Form</span>
                                    </div>
                                  </div>
                                  <div className="col-2 content-right">
                                    <label htmlFor="navmenu-ch4">
                                      <div className="app-open-close-icon"></div>
                                    </label>
                                  </div>
                                </div>
                                <div className="app-open-close-content">
                                  <FormMovementOrgStructure
                                    type={this.state.slideType}
                                    auth={this.props.auth}
                                    sendState={this.state.sendState}
                                    movementData={this.state.type !== 'create' ? this.state.dataByID : null}
                                    onClickClose={() => this.clResizePane()}
                                    onSave={this.handleUpdate.bind(this)}
                                    onClickSave={this.submitMovement.bind(this)}
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
                                      <i className="fa fa-1x fa-suitcase-rolling margin-right-5px"></i>
                                      <span className="txt-site txt-11 txt-main">Movement Document</span>
                                    </div>
                                  </div>
                                  <div className="col-2 content-right">
                                    <label htmlFor="navmenu-ch3">
                                      <div className="app-open-close-icon"></div>
                                    </label>
                                  </div>
                                </div>
                                <div className="app-open-close-content">
                                  <FormMovementDocument
                                    type={this.state.slideType}
                                    sendState={this.state.sendState}
                                    movementData={this.state.type !== 'create' ? this.state.dataByID : null}
                                    onClickClose={() => this.clResizePane()}
                                    onClickSave={() => {
                                      this.setState({ dataTable: [] })
                                      this.getDataMovement()
                                      this.openMovementDetailView()
                                    }}
                                    getData={this.getDataByID.bind(this)}
                                    onClickDelete={this.handleUpdate.bind(this)}
                                    onDelete={this.openDeletePopup.bind(this)}
                                    onClickSubmit={this.submitMovement.bind(this)}
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
                                      <i className="fa fa-1x fa-suitcase-rolling margin-right-5px"></i>
                                      <span className="txt-site txt-11 txt-main">Movement History</span>
                                    </div>
                                  </div>
                                  <div className="col-2 content-right">
                                    <label htmlFor="navmenu-ch2">
                                      <div className="app-open-close-icon"></div>
                                    </label>
                                  </div>
                                </div>
                                <div className="app-open-close-content">
                                  <FormMovementHistory
                                    type={this.state.slideType}
                                    onClickClose={() => this.clResizePane()}
                                    onSave={this.openSavePopUp.bind(this)}
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

export default connect(mapStateToProps, mapDispatchToProps)(movement);
