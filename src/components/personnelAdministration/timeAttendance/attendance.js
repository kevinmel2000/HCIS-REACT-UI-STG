import React, { Component } from "react"
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import MUIDataTable from "mui-datatables-bitozen"
import LoadingBar from "react-top-loading-bar"
import API from '../../../Services/Api'
import ResizeSlider from '../../../modules/resize/Slider'
import SplitPaneSecond from 'react-split-pane'
import * as R from 'ramda'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import AuthAction from '../../../Redux/AuthRedux'
import IdleTimer from 'react-idle-timer'
import M from 'moment'

var ct = require("../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

const standardTime = {
  "timeIn": '09:00:00',
  "timeOut": '18:00:00'
}

class attendance extends Component {
  constructor() {
    super();
    this.state = {
      standardTime: standardTime,
      formVisible: false,
      formReport: false,
      selectedIndex: null,
      rawData: [],
      dataTableAtd: [],
      dataTableDetail: [],
      formPhotoVisible: false,
      fileType: "",
      photoURL: "",
      allowResize: false,
      defaultSize: 0,
      minSize: 0,
      maxSize: 0,
      timeout: 1000 * 100 * 9,
      isTimedOut: false
    }
    this.idleTimer = null
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

  getDataAttendenceTask(data, date) {
    let payload = {
      "limit": 100,
      "offset": 0,
      "params": {
        "employeeID": data,
        "timesheetTaskStartDate": date
      }
    }
    API.create('TIME_QUERY').getTimesheetTaskByIdDate(payload).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            let dataTableDetail = res.data.data.map((value) => {
              const { timesheetTaskID, timesheetTaskName, timesheetTaskStartDate, timesheetTaskEndDate } = value;
              return [
                timesheetTaskID,
                timesheetTaskName,
                timesheetTaskStartDate,
                timesheetTaskEndDate
              ]
            })
            this.setState({
              dataTableDetail
            })
          }
        }
      }
    )
  }

  getDataAttendence() {
    let payload = {
      offset: 0,
      limit: 100
    }
    API.create('TIME_QUERY').getAllTimesheet(payload).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            this.onFinishFetch()
            let dataTableAtd = res.data.data.map((value, index) => {
              const { employee, timesheetID, timesheetCheckIn, timesheetCheckOut, timesheetLatitude, timesheetLongitude, timesheetPhotoUrl } = value;
              return [
                index += 1,
                timesheetID,
                employee.employeeID,
                employee.employeeName,
                timesheetCheckIn,
                timesheetCheckOut,
                timesheetLatitude,
                timesheetLongitude,
                "-",
                timesheetPhotoUrl
              ]
            })
            this.setState({
              rawData: res.data.data,
              dataTableAtd
            })
          } else {
            alert("Failed: " + res.data.message)
            this.onFinishFetch()
          }
        }
      }
    )
  }

  async getPhoto(selectedIndex) {
    let { rawData } = this.state
    let length = rawData[selectedIndex].timesheetPhotoUrl.split(".").length
    let timesheetID = rawData[selectedIndex].timesheetID
    let url = process.env.REACT_APP_HCIS_BE_API + "tmcmd/api/timesheet.photo.get/" + timesheetID
    let response = await fetch(url, {
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4",
        "Content-Type": "application/json"
      }
    })
    response = await response.blob()
    if (response.size > 0) {
      response = URL.createObjectURL(response);
      this.setState({
        photoURL: response,
        fileType: rawData[selectedIndex].timesheetPhotoUrl.split(".")[length - 1],
        formPhotoVisible: !this.state.formPhotoVisible
      });
    } else {
      alert("Photo Not Found")
    }
  }

  openPrint = () => {
    this.setState({ formReport: !this.state.formReport })
  };

  opSidePage = (menu, data) => (e) => {
    e.preventDefault()
    let selectedIndex = data
    this.setState({ formVisible: false })
    this.opResizePane()
    switch (menu) {
      case 'slide-attendance':
        this.setState({ formVisible: true, selectedIndex })
        this.getDataAttendenceTask(this.state.rawData[selectedIndex].employee.employeeID, M(this.state.rawData[selectedIndex].timesheetCheckIn, "DD-MM-YYYY HH:mm:ss").format("DD-MM-YYYY"))
        break
      default:
        break
    }
  }

  opResizePane = () => {
    this.setState({
      allowResize: true,
      defaultSize: 370,
      minSize: 370,
      maxSize: 850
    })
  }

  clResizePane = () => {
    this.setState({
      slideBizpar: false,
      allowResize: false,
      defaultSize: 0,
      minSize: 0,
      maxSize: 0
    })
  }

  openAtdetailForm(selectedIndex) {
    this.setState({ formVisible: !this.state.formVisible, selectedIndex })
  };

  openPhoto = () => {
    this.setState({ formPhotoVisible: !this.state.formPhotoVisible })
  }

  componentDidMount() {
    if (!R.isNil(this.props.auth.user)) {
      this.startFetch();
      this.getDataAttendence();
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
    "Attendance ID",
    "Employee ID",
    "Employee Name",
    "Check In",
    "Check Out",
    "Latitude",
    "Longitude",
    "Source",
    {
      name: "Photo URL",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              <button
                className="btnAct"
                style={{ backgroundColor: "transparent" }}
                onClick={() => this.getPhoto(tableMeta.rowIndex)}
              >
                <i className="fas fa-lw fa-print" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
              </button>
            </div>
          );
        }
      }
    },
    {
      name: "Detail",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              <button
                className="btnAct"
                style={{ backgroundColor: "transparent" }}
                onClick={this.opSidePage("slide-attendance", tableMeta.rowIndex)}
              >
                <i className="fas fa-lw fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
              </button>
            </div>
          );
        }
      }
    }
  ];

  //attendance detail
  columnsDetail = ["Task ID", "Task Name", "Start", "Stop"];

  renderPhoto = () => {
    return (
      <div className="app-popup app-popup-show">
        <div className="padding-top-20px" />
        <div className="popup-content-small background-white border-radius">
          <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="popup-title">
                Photo Viewer
              </div>
            </div>
            <div className="col-2 content-right">
              <button
                className="btn btn-circle btn-grey"
                onClick={this.openPhoto.bind(this)}
              >
                <i className="fa fa-lg fa-times" />
              </button>
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <img src={this.state.photoURL} width={'50%'} alt="" />
          </div>
          <div className="padding-15px background-grey">
            <div className="grid margin-top-15px">
              <div className="content-right">
                <button
                  style={{ marginLeft: "15px" }}
                  className="btn btn-grey"
                  type="button"
                  onClick={this.openPhoto.bind(this)}
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
                  <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
                  <div className="padding-15px">
                    <MuiThemeProvider theme={getMuiTheme()}>
                      <MUIDataTable
                        title={"Attendance"}
                        subtitle={"lorem ipsum dolor"}
                        data={this.state.dataTableAtd}
                        columns={this.columns}
                        options={options}
                      />
                    </MuiThemeProvider>
                  </div>
                  {this.state.formPhotoVisible && this.renderPhoto()}
                </div>
              )}
              side={(
                <div className="a-s-p-side">
                  {this.state.formVisible && (
                    <div>
                      <div className="a-s-p-place active">
                        <div className="a-s-p-top">
                          <div className="grid grid-2x">
                            <div className="col-1" style={{ width: "140%" }}>
                              <div className="display-flex-normal margin-top-10px">
                                <i className="fa fa-1x fa-clock"></i>
                                <span className="txt-site txt-11 txt-main margin-left-10px">
                                  Attendance - Detail Task
                                </span>
                              </div>
                            </div>
                            <div className="col-2 content-right">
                              <button
                                onClick={this.clResizePane.bind(this)}
                                className="btn btn-circle btn-grey">
                                <i className="fa fa-lg fa-arrow-right" />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="a-s-p-mid a-s-p-pad border-top">
                          <div className="display-flex-normals margin-bottom-10px">
                            <div className="padding-top-15px padding-bottom-15px">
                              <div className="col-2 content-right">
                                <button className="btnAct" type="button" onClick={this.openPrint.bind(this)}>
                                  <i className="fa fa-lg fa-print" style={{ fontSize: "20px",color: '#004c97' }} />
                                </button>
                              </div>
                              <div className="margin-15px">
                                <MuiThemeProvider theme={getMuiTheme()}>
                                  <MUIDataTable
                                    title={"Attendance Detail"}
                                    subtitle={"lorem ipsum dolor"}
                                    data={this.state.dataTableDetail}
                                    columns={this.columnsDetail}
                                    options={options}
                                  />
                                </MuiThemeProvider>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            />
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

export default connect(mapStateToProps, mapDispatchToProps)(attendance);
