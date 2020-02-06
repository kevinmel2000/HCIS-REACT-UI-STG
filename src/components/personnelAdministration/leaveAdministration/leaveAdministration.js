import React, { Component } from "react"
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import MUIDataTable from "mui-datatables-bitozen"
import LoadingBar from "react-top-loading-bar"
import M from 'moment'
import API from '../../../Services/Api'
import DropDown from '../../../modules/popup/DropDown'
import CalendarPicker from '../../../modules/popup/Calendar'
import ResizeSlider from '../../../modules/resize/Slider'
import SplitPaneSecond from 'react-split-pane'
import * as R from 'ramda'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import AuthAction from '../../../Redux/AuthRedux'
import IdleTimer from 'react-idle-timer'
import FileViewer from 'react-file-viewer'


var ct = require("../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()
const options4 = ct.customOptions4()

class leave extends Component {
  constructor() {
    super();
    this.state = {
      selectedIndex: null,
      rawData: [],
      dataTableLad: [],
      dataTableDoc: [],
      formVisible: false,
      formDocVisible:false,
      allowResize: false,
      fileType:'',
      reportURL:'',
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

  openDetailForm = (index) => {
    let { formVisible } = this.state
    this.setState({
      formVisible: !formVisible,
      selectedIndex: !formVisible ? index : null,
    })
  };
  

  opSidePage = (menu, data) => (e) => {
    e.preventDefault()
    let selectedIndex = data
    this.setState({ formVisible: false })
    this.opResizePane()
    switch (menu) {
      case 'slide-leave':
        let { rawData } = this.state
        let dataTableDoc = []
        dataTableDoc.push([
            rawData[selectedIndex].leaveDocumentURL.split("document/leave_doc/")
        ])
        this.setState({ formVisible: true, selectedIndex ,dataTableDoc})
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

  getDataLeave() {
    let payload = {
      offset: 0,
      limit: 100
    }
    API.create('TIME_QUERY').getAllLeave(payload).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            this.onFinishFetch()
            let dataTableLad = res.data.data.map((value, index) => {
              const { leaveID, leaveDays, leaveReason, employee, leaveType, leaveStartDate, leaveEndDate } = value;
              return [
                index += 1,
                leaveID,
                employee.employeeID,
                employee.employeeName,
                leaveStartDate,
                leaveEndDate,
                leaveDays,
                leaveType.bizparValue,
                leaveReason
              ]
            })
            this.setState({
              rawData: res.data.data,
              dataTableLad
            })
          }
        }
      }
    )
  }

  componentDidMount() {
    if (!R.isNil(this.props.auth.user)) {
      this.startFetch();
      this.getDataLeave();
    }
  }

  openReport() {
    this.setState({ formDocVisible: !this.state.formDocVisible });
  }

  async getReport() {
    let { rawData, selectedIndex } = this.state
    let leaveID = rawData[selectedIndex].leaveID;
    let length = rawData[selectedIndex].leaveDocumentURL.split(".").length;
    let response = await fetch(process.env.REACT_APP_HCIS_BE_API + "tmcmd/api/leave.document.get/" + leaveID, {
        headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4'
        }
    })
    response = await response.blob()
    if (response.size > 0) {
        response = URL.createObjectURL(response)
        this.setState({
            reportURL: response,
            fileType: rawData[selectedIndex].leaveDocumentURL.split(".")[length - 1],
            formDocVisible: !this.state.formDocVisible
        });
    } else {
        alert("Failed: Document Not Found")
    }
}

  startFetch = () => {
    this.LoadingBar.continousStart();
  };

  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
  };

  columnsDocument = [
    {
      name: "Document",
      options: {
        customBodyRender: val => {
          return (
            <div>
              <i className="fa fa-lw fa-file" style={{ marginRight: 5 }} />
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
              <button
                type="button"
                className="btnAct"
                style={{ marginRight: 15 }}
                onClick={() => this.getReport()}
              >
                {val}
                <i className="fa fa-lw fa-print" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
              </button>
            </div>
          );
        }
      }
    }
  ];

  columns = [
    "No",
    "Leave ID",
    "NIK",
    "Employee Name",
    "Start Date",
    "End Date",
    "Number of Days",
    "Leave Type",
    "Reason",
    {
      name: "Detail",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              <button
                className="btnAct"
                style={{ backgroundColor: "transparent" }}
                onClick={this.opSidePage("slide-leave", tableMeta.rowIndex)}
              >
                <i className="fas fa-lw fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }}/>
              </button>
            </div>
          );
        }
      }
    }
  ];

  dataTable = []

  renderReport = () => {
    return (
      <div className="app-popup app-popup-show">
        <div className="padding-top-20px" />
        <div className="popup-content background-white border-radius">
          <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="popup-title">Document Viewer</div>
            </div>
          </div>
          <div style={{ textAlign: "center", margin: 20 }}>
            {
              this.state.fileType === "png" ||
                this.state.fileType === "jpg" ? (
                  <img src={this.state.reportURL} width={"50%"} alt="" />
                ) : (
                  <FileViewer
                    fileType={this.state.fileType}
                    filePath={this.state.reportURL}
                  />
                )}
          </div>
          <div className="padding-15px background-white">
            <div className="grid margin-top-15px">
              <div className="content-right">
                <button
                  style={{ marginLeft: "15px" }}
                  className="btn btn-primary"
                  type="button"
                  onClick={this.openReport.bind(this)}
                >
                  <span>CLOSE</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="margin-bottom-20px" />
      </div>
    );
  };


  render() {
    if (R.isNil(this.props.auth.user)) return <Redirect to={{ pathname: "/" }} ></Redirect>
    let { rawData, selectedIndex } = this.state
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
                        title={'Leave'}
                        subtitle={"lorem ipsum dolor"}
                        data={this.state.dataTableLad}
                        columns={this.columns}
                        options={options}
                      />
                    </MuiThemeProvider>
                  </div>
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
                                <i className="fa fa-1x fa-sign-out-alt"></i>
                                <span className="txt-site txt-11 txt-main margin-left-10px">
                                  Leave - Detail Form
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
                              <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                  <span className="txt-site txt-11 txt-main txt-bold">
                                    <h4> Employee Name </h4>
                                  </span>
                                </div>
                                <input
                                  style={{ marginRight: 10, backgroundColor: '#E6E6E6' }}
                                  className="txt txt-sekunder-color"
                                  value={rawData && rawData[selectedIndex].employee.employeeName}
                                  type="text"
                                  placeholder=""
                                ></input>
                              </div>
                              <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                  <span className="txt-site txt-11 txt-main txt-bold">
                                    <h4> NIK </h4>
                                  </span>
                                </div>
                                <input
                                  style={{ backgroundColor: '#E6E6E6' }}
                                  className="txt txt-sekunder-color"
                                  value={rawData && rawData[selectedIndex].employee.employeeID}
                                  type="text"
                                  placeholder=""
                                ></input>
                              </div>
                              <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                  <span className="txt-site txt-11 txt-main txt-bold">
                                    <h4> Leave type <span style={{ color: "red" }}>*</span> </h4>
                                  </span>
                                </div>
                                <DropDown title={rawData && rawData[selectedIndex].leaveType ? rawData[selectedIndex].leaveType.bizparValue : "-"} bizValue={rawData && rawData[selectedIndex].leaveType ? rawData[selectedIndex].leaveType.bizparValue : "-"} disabled />
                              </div>

                              <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                  <span className="txt-site txt-11 txt-main txt-bold">
                                    <h4> Start Date <span style={{ color: "red" }}>*</span> </h4>
                                  </span>
                                </div>
                                <CalendarPicker disabled date={rawData ? M(rawData[selectedIndex].leaveStartDate, 'DD-MM-YYYY').format('YYYY-MM-DD') : "DD-MM-YYYY"} />
                              </div>

                              <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                  <span className="txt-site txt-11 txt-main txt-bold">
                                    <h4> End Date <span style={{ color: "red" }}>*</span> </h4>
                                  </span>
                                </div>
                                <CalendarPicker disabled date={rawData ? M(rawData[selectedIndex].leaveEndDate, 'DD-MM-YYYY').format('YYYY-MM-DD') : "DD-MM-YYYY"} />
                              </div>

                              <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                  <span className="txt-site txt-11 txt-main txt-bold">
                                    <h4> Reason <span style={{ color: "red" }}>*</span> </h4>
                                  </span>
                                </div>
                                <textarea
                                  style={{ marginRight: 10, backgroundColor: '#E6E6E6' }}
                                  type="text"
                                  className="txt txt-sekunder-color"
                                  placeholder=""
                                  value={rawData && rawData[selectedIndex].leaveReason}
                                  rows={4}
                                />
                              </div>

                              <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                    <MuiThemeProvider theme={getMuiTheme()}>
                                        <MUIDataTable
                                            data={this.state.dataTableDoc !== "" && rawData[selectedIndex].leaveDocumentURL !== '' ? this.state.dataTableDoc : this.dataTable}
                                            columns={this.columnsDocument}
                                            options={options4}
                                        />
                                    </MuiThemeProvider>
                                </div>
                            </div>

                            </div>
                            <div className="border-top padding-top-20px">
                              <div className="grid grid-2x">
                                <div className="col-1" />
                                <div className="col-2 content-right">
                                  <button style={{ marginLeft: "15px" }} className="btn btn-primary" type="button" onClick={this.clResizePane.bind(this)}>
                                    <span>CLOSE</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  { this.state.formDocVisible ? this.renderReport() : null}
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

export default connect(mapStateToProps, mapDispatchToProps)(leave);
