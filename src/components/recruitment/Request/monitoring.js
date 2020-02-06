import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import LoadingBar from "react-top-loading-bar";
import API from '../../../Services/Api'
import FormMonitoringGeneral from "../../../modules/forms/formRecMonitoring/formMonitoringGeneral";
import FormMonitoringQualification from "../../../modules/forms/formRecMonitoring/formMonitoringQualification";
import FormMonitoringPosition from "../../../modules/forms/formRecMonitoring/formMonitoringPosition";
import FormMonitoringDocument from "../../../modules/forms/formRecMonitoring/formMonitoringDocument";
import FormMonitoringSelection from "../../../modules/forms/formRecMonitoring/formMonitoringSelection";
import FormMonitoringOther from "../../../modules/forms/formRecMonitoring/formMonitoringOther";
import FormMonitoringHistory from "../../../modules/forms/formRecMonitoring/formMonitoringHistory";
import * as R from 'ramda'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import AuthAction from '../../../Redux/AuthRedux'
import IdleTimer from 'react-idle-timer'

var ct = require("../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class Monitoring extends Component {
  constructor() {
    super();
    this.state = {
      detailVisible: false,
      qualificationVisible: false,
      positionVisible: false,
      documentVisible: false,
      selectionVisible: false,
      otherVisible: false,
      historyVisble: false,
      selectedIndex: null,
      activeTab: "",
      tabMenu: [
        "General",
        "Qualification",
        "Position",
        "Document",
        "Selection",
        "Other",
        "History"
      ],
      dataTable: [],
      rawData: [],
      timeout: 1000 * 100 * 9,
      isTimedOut: false
    }
    this.idleTimer = null
  }

  openDetailForm = (index) => {
    let { detailVisible } = this.state
    this.setState({
      detailVisible: !detailVisible,
      selectedIndex: !detailVisible ? index : null,
      activeTab: !detailVisible ? "General" : "",
      generalVisible: !detailVisible ? true : false,
      qualificationVisible: false,
      positionVisible: false,
      documentVisible: false,
      selectionVisible: false,
      otherVisible: false,
      historyVisble: false
    })
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

  componentDidMount() {
    if (!R.isNil(this.props.auth.user)) {
      this.startFetch();
      this.getDataRecruitment()
    }
  }

  getDataRecruitment() {
    let payload = {
      offset: 0,
      limit: 25
    }
    API.create('RECRUITMENT_QUERY').getRecruitmentReqAll(payload).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            this.onFinishFetch()
            let dataTable = res.data.data.map((value, index) => {
              const { recruitmentRequestID, recruitmentRequestDate, recruitmentRequestBy, recruitmentType, recruitmentCategory, recruitmentRequestType, recruitmentEmployeeStatus, recruitmentEmployeeStatusCategoryType, recruitmentPublishStartDate, recruitmentPublishEndDate, recruitmentRequestStatus } = value;
              return [
                index += 1,
                recruitmentRequestID + "|" + recruitmentRequestDate,
                recruitmentRequestBy.employeeID + "|" + recruitmentRequestBy.employeeName,
                (recruitmentType && !R.isNil(recruitmentType.bizparValue) ? recruitmentType.bizparValue : "") + " | " + (recruitmentCategory && !R.isNil(recruitmentCategory.bizparValue) ? recruitmentCategory.bizparValue : ""),
                recruitmentRequestType && !R.isNil(recruitmentRequestType.bizparValue) ? recruitmentRequestType.bizparValue : "",
                (recruitmentEmployeeStatus && !R.isNil(recruitmentEmployeeStatus.bizparValue) ? recruitmentEmployeeStatus.bizparValue : "") + " | " + (recruitmentEmployeeStatusCategoryType && !R.isNil(recruitmentEmployeeStatusCategoryType.bizparValue) ? recruitmentEmployeeStatusCategoryType.bizparValue : ""),
                recruitmentPublishStartDate + " - " + recruitmentPublishEndDate,
                recruitmentRequestStatus.replace(/_/g," "),
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
      })
  }

  startFetch = () => {
    this.LoadingBar.continousStart();
  };

  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
  };

  columnsGeneral = [
    "No",
    {
      name: "No Request",
      options: {
        customBodyRender: (val) => {
          return (
            <div>
              <div>
                {val.split("|")[0]}
              </div>
              <div>
                Tgl Buat: {val.split("|")[1]}
              </div>
            </div>
          );
        }
      }
    },
    {
      name: "Requestor",
      options: {
        customBodyRender: (val) => {
          return (
            <div>
              <div>
                {val.split("|")[0]}
              </div>
              <div>
                {val.split("|")[1]}
              </div>
            </div>
          );
        }
      }
    },
    "Recruitment (Type | Category)",
    "Request Type",
    "Employee Status (Type | Category)",
    "Publish Date",
    {
      name: "Last Known Status",
      options: {
        customBodyRender: val => {
          return (
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: 20}}>
              <div style={{ width: '20%'}}>
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
                  }}
                />
              </div> 
              <div style={{ width: '80%', textAlign: 'center' }}>
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
            <div>
              <button
                type='button'
                className="btnAct"
                style={{ backgroundColor: "transparent" }}
                onClick={() => this.openDetailForm(tableMeta.rowIndex)}
              >
                 <i className="fa fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }}/>
              </button>
            </div>
          );
        }
      }
    }
  ];

  // important
  // vertical tab function
  opNavigator = (title) => {
    let cl = title === this.state.activeTab ? 'c-n-link active' : 'c-n-link'
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
      generalVisible: false,
      qualificationVisible: false,
      positionVisible: false,
      documentVisible: false,
      selectionVisible: false,
      otherVisible: false,
      historyVisble: false,
      activeTab: title
    }
    switch (title) {
      case "General":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          generalVisible: true
        }
        break;
      case "Qualification":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          qualificationVisible: true
        }
        break;
      case "Position":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          positionVisible: true
        }
        break;
      case "Document":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          documentVisible: true
        }
        break;
      case "Selection":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          selectionVisible: true
        }
        break;
      case "Other":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          otherVisible: true
        }
        break;
      case "History":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          historyVisble: true
        }
        break;
      default:
        break;
    }
    this.setState(allStateVisibleFalse)
  };

  render() {
    if (R.isNil(this.props.auth.user)) return <Redirect to={{ pathname: "/" }} ></Redirect>
    let { rawData, selectedIndex, tabMenu, dataTable, detailVisible, generalVisible, positionVisible, qualificationVisible, documentVisible, selectionVisible, otherVisible, historyVisble } = this.state
    return (
      <div className="main-content">
        <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
        <IdleTimer
          ref={ref => { this.idleTimer = ref }}
          element={document}
          onActive={this.onActive.bind(this)}
          onIdle={this.onIdle.bind(this)}
          onAction={this.onAction.bind(this)}
          debounce={250}
          timeout={this.state.timeout} />

        <div className="padding-5px">
          <MuiThemeProvider theme={getMuiTheme()}>
            <MUIDataTable
              title={"Recruitment Request"}
              subtitle={'lorem ipsum dolor'}
              data={dataTable}
              columns={this.columnsGeneral}
              options={options}
            />
          </MuiThemeProvider>
        </div>

        {detailVisible && (
          <div className="app-popup app-popup-show">
            <div className="padding-top-20px" />
            <div className="popup-content background-white border-radius">
              <div className="popup-panel grid grid-2x">
                <div className="col-1">
                  <div className="popup-title">
                    Recruitment Request Detail - View Form
                </div>
                </div>
                <div className="col-2 content-right">
                  <button
                    className="btn btn-circle btn-grey"
                    onClick={this.openDetailForm}
                  >
                    <i className="fa fa-lg fa-times" />
                  </button>
                </div>
              </div>

              <div className="grid grid-2x-col7 gap-10px">

                <div className="col-1">
                  <ul className="vertical-tab">
                    {tabMenu.map((data, index) => { return this.opNavigator(data, index) })}
                  </ul>
                </div>

                <div className="col-2">
                  {generalVisible && (
                    <FormMonitoringGeneral
                      monitoringData={rawData[selectedIndex]}
                      onClickClose={this.openDetailForm.bind(this)}
                    />
                  )}
                  {qualificationVisible && (
                    <FormMonitoringQualification
                      monitoringData={rawData[selectedIndex]}
                      onClickClose={this.openDetailForm.bind(this)}
                    />
                  )}
                  {positionVisible && (
                    <FormMonitoringPosition
                      monitoringData={rawData[selectedIndex]}
                      onClickClose={this.openDetailForm.bind(this)}
                    />
                  )}
                  {documentVisible && (
                    <FormMonitoringDocument
                      monitoringData={rawData[selectedIndex]}
                      onClickClose={this.openDetailForm.bind(this)}
                    />
                  )}
                  {selectionVisible && (
                    <FormMonitoringSelection
                      monitoringData={rawData[selectedIndex]}
                      onClickClose={this.openDetailForm.bind(this)}
                    />
                  )}
                  {otherVisible && (
                    <FormMonitoringOther
                      monitoringData={rawData[selectedIndex]}
                      onClickClose={this.openDetailForm.bind(this)}
                    />
                  )}
                  {historyVisble && (
                    <FormMonitoringHistory
                      monitoringData={rawData[selectedIndex]}
                      onClickClose={this.openDetailForm.bind(this)}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="padding-bottom-20px" />
          </div>
        )}
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Monitoring);
