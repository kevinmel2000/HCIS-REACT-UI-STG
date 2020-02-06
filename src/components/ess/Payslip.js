import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import LoadingBar from "react-top-loading-bar";
import { PDFReader } from "reactjs-pdf-reader";
import M from "moment";
import API from "../../Services/Api";
import { connect } from "react-redux";
import * as R from "ramda";
import { Redirect } from "react-router-dom";
import AuthAction from "../../Redux/AuthRedux";
import IdleTimer from "react-idle-timer";

var ct = require("../../modules/custom/customTable");

class Payslip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailVisible: false,
      selectedIndex: null,
      printClass: "app-popup",
      reportVisible: false,
      reportVisibleCurrent: false,
      reportURL: "",
      rawData: [],
      dataTablePayroll: [],
      auth: this.props.auth,
      type: "",
      timeout: 1000 * 100 * 9,
      isTimedOut: false
    };
    this.idleTimer = null;
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

  componentDidMount() {
    if (!R.isNil(this.props.auth.user)) {
      this.startFetch();
      this.getDataPayroll();
    }
  }

  startFetch = () => {
    this.LoadingBar.continousStart();
  };

  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
  };

  getMuiTheme = () => createMuiTheme(ct.customTable());

  options = ct.customOptions();

  columns = [
    "No",
    "Period",
    {
      name: "Month",
      options: {
        customBodyRender: val => {
          return (
            <div>
              <div>{M(val, "M").format("MMMM")}</div>
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
                className="btnAct"
                style={{ marginRight: 15, backgroundColor: 'transparent' }}
                onClick={() => this.openReportPayslip(tableMeta.rowIndex)}
              >
                <i className="fa fa-lw fa-print" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }}/>
              </button>
            </div>
          );
        }
      }
    }
  ];

  async getDataPayroll() {
    let payload = {
      limit: 200,
      offset: 0,
      params: {
        employeeID: this.state.auth.user.employeeID
      }
    };
    API.create("CNB_QUERY")
      .getPayrollByEmployeeId(payload)
      .then(res => {
        if (res.status === 200) {
          if (res.data.status === "S") {
            console.log(res.data);
            this.onFinishFetch();
            let dataTablePayroll = res.data.data.map((value, index) => {
              const { payrollYear, payrollMonth } = value;
              return [(index += 1), payrollYear, payrollMonth];
            });
            this.setState({
              rawData: res.data.data,
              dataTablePayroll
            });
          } else {
            alert("Failed: " + res.data.message);
          }
        } else if (res.status === 504) {
          alert("504 - Time Out");
          this.onFinishFetch();
        } else {
          alert("Failed: " + res.data.message);
          this.onFinishFetch();
        }
      });
  }

  async openReportPayslip(index) {
    this.setState({ selectedIndex: index, type: "" });
    let { auth, rawData } = this.state;
    let employeeID = auth.user.employeeID;
    let month = M(rawData[index].payrollMonth, "MM").format("MM");
    let year = M(rawData[index].payrollYear, "YYYY").format("YYYY");

    let response = await fetch(
      process.env.REACT_APP_HCIS_BE_API + "report/po/payslip/" +
        employeeID +
        "/" +
        month +
        "/" +
        year,
      {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4",
          "Content-Type": "application/pdf"
        }
      }
    );

    console.log(response);
    response = await response.blob();
    console.log(response);
    if (response.size > 0) {
      response = URL.createObjectURL(response);
      this.setState({
        reportURL: response,
        reportVisible: !this.state.reportVisible
      });
    } else {
      alert("Report Not Found");
    }
  }

  async openReportPayslipCurrent(type) {
    this.setState({ type });
    let { auth, rawData } = this.state;
    let employeeID = auth.user.employeeID;
    let month = M(rawData.payrollMonth).format("MM") - 1;
    let year = M().format("YYYY");

    let response = await fetch(
      process.env.REACT_APP_HCIS_BE_API + "report/po/payslip/" +
        employeeID +
        "/" +
        month +
        "/" +
        year,
      {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4",
          "Content-Type": "application/pdf"
        }
      }
    );

    console.log(response);
    response = await response.blob();
    console.log(response);
    if (response.size > 0) {
      response = URL.createObjectURL(response);
      this.setState({
        reportURL: response,
        reportVisible: !this.state.reportVisible
      });
    } else {
      alert("Report Not Found");
    }
  }

  closeReport() {
    this.setState({ reportVisible: !this.state.reportVisible });
  }

  async downloadReport() {
    let { auth, rawData, selectedIndex } = this.state;
    let type = this.state.type;
    let employeeID = auth.user.employeeID;
    let year;
    let month;

    switch (type) {
      case "current":
        month = M().format("MM") - 1;
        year = M().format("YYYY");
        break;
      default:
        month = M(rawData[selectedIndex].payrollMonth, "MM").format("MM");
        year = M(rawData[selectedIndex].payrollYear, "YYYY").format("YYYY");
        break;
    }

    let res = await fetch(
      process.env.REACT_APP_HCIS_BE_API + "report/po/payslip/" +
        employeeID +
        "/" +
        month +
        "/" +
        year,
      {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4",
          "Content-Type": "application/pdf"
        }
      }
    );
    res = await res.blob();

    console.log(res);
    if (res.size > 0) {
      res = URL.createObjectURL(res);
      window.open(res);
    }
  }

  handlePopUp = () => {
    this.setState({
      savePopUpVisible: false
    });
  };

  render() {
    if (R.isNil(this.props.auth.user))
      return <Redirect to={{ pathname: "/" }}></Redirect>;
    return (
      <div className="main-content">
        <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
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
          <div className="padding-5px">
            <div className="grid grid-2x">
              <div className="col-1">
                {/* <div className="txt-site txt-18 txt-bold txt-main padding-top-10px">
                  Employee Self Service - Payslip
                </div> */}
              </div>
              <div className="col-2 content-right">
                <button
                  onClick={() => this.openReportPayslipCurrent("current")}
                  className="btn btn-blue btn-radius"
                >
                  <i className="fa fa-lg fa-print" /> CURRENT PAYSLIP
                </button>
              </div>
            </div>
          </div>

          <div className="padding-5px">
            {this.state.reportVisible && (
              <div className="app-popup app-popup-show">
                <div className="padding-top-20px" />
                <div className="popup-content background-white border-radius">
                  <div className="popup-panel grid grid-2x">
                    <div className="col-1">
                      <div className="popup-title">Report Viewer</div>
                    </div>
                    <div className="col-2 content-right">
                      <button
                        className="btn background-transaparant"
                        onClick={() => this.downloadReport()}
                      >
                        <i
                          className="fa fa-download"
                          style={{ cursor: "pointer" }}
                        />
                      </button>
                    </div>
                  </div>
                  <PDFReader url={this.state.reportURL} />
                  <div className="padding-15px">
                    <div className="grid margin-top-15px">
                      <div className="content-right">
                        <button
                          style={{ marginLeft: "15px" }}
                          className="btn btn-primary"
                          type="button"
                          onClick={this.closeReport.bind(this)}
                        >
                          <span>CLOSE</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="margin-bottom-20px" />
              </div>
            )}

            <div>
              <MuiThemeProvider theme={this.getMuiTheme()}>
                <MUIDataTable
                  title="Employee Self Service - Payslip"
                  subtitle={'lorem ipsum dolor'}
                  data={this.state.dataTablePayroll}
                  columns={this.columns}
                  options={this.options}
                />
              </MuiThemeProvider>
            </div>
          </div>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Payslip);
