import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import MUIDataTable from "mui-datatables-bitozen"
import LoadingBar from "react-top-loading-bar"
import API from '../../../Services/Api'
import FormOvertimeGeneral from "../../../modules/forms/formOvertime/FormOvertimeGeneral"
import ResizeSlider from '../../../modules/resize/Slider'
import SplitPaneSecond from 'react-split-pane'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import * as R from 'ramda'
import AuthAction from '../../../Redux/AuthRedux'
import IdleTimer from 'react-idle-timer'

var ct = require("../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

class overtime extends Component {
  constructor() {
    super();
    this.state = {
      selectedIndex: null,
      rowData: [],
      dataTable: [],
      formVisible: false,
      formGeneralVisible: false,
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

  getDataOvertime() {
    let payload = {
      offset: 0,
      limit: 100
    }
    API.create('TIME_QUERY').getAllOvertime(payload).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            this.onFinishFetch()
            let dataTable = res.data.data.map((value, index) => {
              const { overtimeID, overtimeDate, employee, overtimeStartDate, overtimeEndDate, overtimeNotes, approvalManagers, overtimeType } = value;
              return [
                index += 1,
                overtimeID,
                employee && employee.employeeID,
                employee && employee.employeeName,
                approvalManagers && approvalManagers.length > 0 ? approvalManagers[0].employeeName : "-",
                overtimeType ? overtimeType.corporateOvertimeName : "-",
                overtimeDate,
                overtimeStartDate,
                overtimeEndDate,
                overtimeNotes
              ]
            })
            this.setState({
              rawData: res.data.data,
              dataTable
            })
          } else {
            this.onFinishFetch()
            alert("Failed: " + res.data.message)
          }
        }
      }
    )
  }

  openDetailForm = (index) => {
    let { formVisible } = this.state
    this.setState({
      formVisible: !formVisible,
      selectedIndex: !formVisible ? index : null,
      formGeneralVisible: !formVisible ? true : false,
    })
  };

  componentDidMount() {
    if (!R.isNil(this.props.auth.user)) {
      this.startFetch();
      this.getDataOvertime();
    }
  }

  startFetch = () => {
    this.LoadingBar.continousStart();
  };

  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
  };


  opResizePane = () => {
    this.setState({
      allowResize: true,
      defaultSize: 370,
      minSize: 370,
      maxSize: 850
    })
  }

  opSidePage = (menu, index) => (e) => {
    this.setState({
      formGeneralVisible: false,
      selectedIndex: index
    })

    this.opResizePane()

    switch (menu) {
      case 'slide-overtime':
        this.setState({
          formGeneralVisible: true,
          overtimeData: this.state.rawData[index]
        })
        break
      default:
        break
    }
  }

  clResizePane = () => {
    this.setState({
      allowResize: false,
      defaultSize: 0,
      minSize: 0,
      maxSize: 0
    })
  }

  columns = [
    "No",
    "Overtime ID",
    "NIK",
    "Employee Name",
    "Head Employee Name",
    "Overtime Type",
    "Date",
    "Start Time",
    "End Time",
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
                onClick={this.opSidePage("slide-overtime", tableMeta.rowIndex)}
              >
                <i className="fas fa-lw fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
              </button>
            </div>
          );
        }
      }
    }
  ];

  render() {
    if (R.isNil(this.props.auth.user)) return <Redirect to={{ pathname: "/" }}></Redirect>
    let { overtimeData } = this.state
    return (
      <SplitPaneSecond
        split="vertical"
        defaultSize={0}
        minSize={0}
        maxSize={0}
        primary="first"
        className="main-slider"
        style={{ height: 'calc(100vh - 50px)' }}>
        <div className="col-1 backgorund-white"></div>
        <div className="col-2 background-white">
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
                <div className="a-s-p-mid no-header">
                  <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
                  <div className="padding-15px">
                    <MuiThemeProvider theme={getMuiTheme()}>
                      <MUIDataTable
                        title={"Overtime"}
                        subtitle={"lorem ipsum dolor"}
                        data={this.state.dataTable}
                        columns={this.columns}
                        options={options} />
                    </MuiThemeProvider>
                  </div>
                </div>
              )}
              side={(
                <div className="a-s-p-side">
                  {this.state.formGeneralVisible &&
                    <FormOvertimeGeneral
                      overtimeData={overtimeData}
                      closeSlide={this.clResizePane}
                    />
                  }
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

export default connect(mapStateToProps, mapDispatchToProps)(overtime);
