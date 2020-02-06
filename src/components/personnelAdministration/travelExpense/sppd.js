import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import LoadingBar from "react-top-loading-bar";
import API from "../../../Services/Api"
import FormSppdDetail from "../../../modules/forms/formTravelExpense/FormSppdDetail";
import FormSppdHistory from "../../../modules/forms/formTravelExpense/FormSppdHistory";
import M from 'moment'
import ResizeSlider from '../../../modules/resize/Slider'
import SplitPaneSecond from 'react-split-pane'
import * as R from 'ramda'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import AuthAction from '../../../Redux/AuthRedux'
import IdleTimer from 'react-idle-timer'

var ct = require("../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class sppd extends Component {
  constructor() {
    super();
    this.state = {
      rawData: [],
      dataTable: [],
      selectedIndex: null,
      formVisible: false,
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

  opSidePage = (menu, data) => (e) => {
    e.preventDefault()
    let selectedIndex = data
    this.setState({ formVisible: false })
    this.opResizePane()
    switch (menu) {
      case 'slide-sppd':
        this.setState({ formVisible: true, selectedIndex, sppdData: this.state.rawData[selectedIndex] })
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

  componentDidMount() {
    if (!R.isNil(this.props.auth.user)) {
      this.startFetch();
      this.getDataSPPD();
    }
  }

  startFetch = () => {
    this.LoadingBar.continousStart();
  };

  getDataSPPD() {
    let payload = {
      offset: 0,
      limit: 100
    }
    API.create('TIME_QUERY').getAllSppd(payload).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            console.log(res.data);
            this.onFinishFetch();
            let dataTable = res.data.data.map((value, index) => {
              const {
                sppdID,
                sppdStartDate,
                sppdRequestBy,
                sppdEndDate,
                sppdDestinationPlace,
                employee,
                sppdReason
              } = value;
              return [
                index += 1,
                sppdID,
                employee ? employee.employeeID : "-",
                employee ? employee.employeeName : "-",
                sppdStartDate ? M(sppdStartDate, "DD-MM-YYYY").format("YYYY") : "-",
                sppdStartDate,
                sppdEndDate,
                sppdRequestBy ? sppdRequestBy.employeeName : "-",
                sppdReason,
                sppdDestinationPlace
              ]
            });

            this.setState({
              rawData: res.data.data,
              dataTable
            });
          }
        }
      }
    )
  }

  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
  };

  columns = [
    "No",
    "Expense ID",
    "NIK",
    "Employee Name",
    "Period",
    "Start Date",
    "End Date",
    "Head",
    "Task",
    "Destination",
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              <button
                className="btnAct"
                style={{ backgroundColor: "transparent" }}
                onClick={this.opSidePage("slide-sppd", tableMeta.rowIndex)}
              >
                <i className="fas fa-lw fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }}/>
              </button>
            </div>
          );
        }
      }
    }
  ];

  render() {
    if (R.isNil(this.props.auth.user)) return <Redirect to={{ pathname: "/" }} ></Redirect>
    let { sppdData } = this.state
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
                        title={"Travel Expense"}
                        subtitle={"lorem ipsum dolor"}
                        data={this.state.dataTable}
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
                                <i className="fa fa-1x fa-luggage-cart"></i>
                                <span className="txt-site txt-11 txt-main margin-left-10px">
                                  Travel Expense - Request Detail
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
                          <div className="app-open-close margin-bottom-20px">
                            <input
                              type="checkbox"
                              name="navmenu"
                              className="app-open-close-input"
                              id="navmenu-ch" />
                            <div className="grid grid-2x margin-bottom-10px">
                              <div className="col-1">
                                <div className="display-flex-normal margin-top-15px">
                                  <i className="fa fa-1x fa-luggage-cart margin-right-5px"></i>
                                  <span className="txt-site txt-11 txt-main">Travel Expense - Detail</span>
                                </div>
                              </div>
                              <div className="col-2 content-right margin-top-5px">
                                <label htmlFor="navmenu-ch">
                                  <div className="app-open-close-icon"></div>
                                </label>
                              </div>
                            </div>
                            <div className="app-open-close-content">
                              <FormSppdDetail
                                sppdData={sppdData}
                                onClickClose={this.clResizePane.bind(this)}
                              />
                            </div>
                          </div>

                          <div className="app-open-close margin-bottom-20px">
                            <input
                              type="checkbox"
                              name="navmenu"
                              className="app-open-close-input"
                              id="navmenu-chh" />
                            <div className="grid grid-2x margin-bottom-10px">
                              <div className="col-1">
                                <div className="display-flex-normal margin-top-10px">
                                  <i className="fa fa-1x fa-luggage-cart margin-right-5px"></i>
                                  <span className="txt-site txt-11 txt-main">Travel Expense - History</span>
                                </div>
                              </div>
                              <div className="col-2 content-right">
                                <label htmlFor="navmenu-chh">
                                  <div className="app-open-close-icon"></div>
                                </label>
                              </div>
                            </div>
                            <div className="app-open-close-content">
                              <FormSppdHistory
                                sppdData={sppdData}
                              />
                            </div>
                          </div>
                          <div className="border-top padding-top-15px margin-bottom-15px">
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

export default connect(mapStateToProps, mapDispatchToProps)(sppd);
