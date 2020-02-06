import React, { Component } from "react";
import LoadingBar from "react-top-loading-bar";
import { ExcelRenderer } from "react-excel-renderer";
import * as R from "ramda";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import CalendarPicker from "../../modules/popup/Calendar";
import M from "moment";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import AuthAction from '../../Redux/AuthRedux'
import IdleTimer from 'react-idle-timer'

var ct = require("../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class Absence extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: props.auth,
      dataLoaded: false,
      rows: null,
      cols: null,
      reportURL: "",
      startDate: M().format("YYYY-MM-DD"),
      endDate: M().format("YYYY-MM-DD"),
      timeout: 1000 * 100 * 9,
      isTimedOut: false
    }
    this.idleTimer = null
    this.fileHandler = this.fileHandler.bind(this);
    this.renderFile = this.renderFile.bind(this);
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

  renderFile = fileObj => {
    console.log(fileObj);
    //just pass the fileObj as parameter
    ExcelRenderer(fileObj, (err, resp) => {
      if (err) {
        console.log(err);
      } else {
        let judul = resp.rows[0];
        const isi = resp.rows;

        isi.shift();
        this.setState({
          dataLoaded: true,
          cols: judul,
          rows: isi
        });
      }
    });
  };

  componentDidMount() {
    if (!R.isNil(this.props.auth.user)) {
      this.fileHandler();
      this.startFetch();
    }
  }

  startFetch = () => {
    this.LoadingBar.continousStart();
  };

  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
  };

  handleSelectStartDate = date => {
    console.log("date start", date);
    this.setState({
      startDate: M(date).format("YYYY-MM-DD")
    });
  };

  handleSelectEndDate = date => {
    console.log("date end", date);
    this.setState({
      endDate: M(date).format("YYYY-MM-DD")
    });
  };

  async handleSubmit(event) {
    let response = await fetch(
      process.env.REACT_APP_HCIS_BE_API + "report/rpt/report.attendance/" +
      this.state.startDate +
      "/" +
      this.state.endDate,
      {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4"
        }
      }
    );

    console.log(response.status);

    response = await response.blob();
    this.renderFile(response);
    this.onFinishFetch();
    // event.preventDefault();
  }

  async downloadReport(value) {
    let res = await fetch(
      process.env.REACT_APP_HCIS_BE_API + "report/rpt/report.attendance/" +
      this.state.startDate +
      "/" +
      this.state.endDate,
      {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4"
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

  async fileHandler(event) {
    let response = await fetch(
      process.env.REACT_APP_HCIS_BE_API + "report/rpt/report.attendance/" +
      this.state.startDate +
      "/" +
      this.state.endDate,
      {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4"
        }
      }
    );

    console.log(response.status);

    response = await response.blob();
    this.renderFile(response);
    this.onFinishFetch();
  }
  render() {
    if (R.isNil(this.props.auth.user))
      return <Redirect to={{ pathname: "/" }}></Redirect>;
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
        <div className="card-navigator">
          <div className="c-n-top">
            <div className="grid grid-2x">
              <div className="col-1">
                <div className="txt-site c-n-title txt-18 txt-bold txt-main padding-top-5px">
                  Absence
                </div>
              </div>
              <div className="col-2 content-right">
                <button
                  type="button"
                  className="btn btn-circle background-blue"
                  onClick={() => this.downloadReport()}
                >
                  <i className="fa fa-1x fa-print" />
                </button>
              </div>
              <div className="display-flex-normal">
                <div style={{ marginRight: "10px", width: "200px" }}>
                  <div className="txt-site txt-bold txt-main txt-11 margin-bottom-5px">
                    <h4>Start Date : </h4>
                  </div>
                  <CalendarPicker
                    date={this.state.startDate}
                    onChange={e => {
                      this.handleSelectStartDate(e);
                    }}
                  />
                </div>
                <div style={{ marginRight: "10px", width: "200px" }}>
                  <div className="txt-site txt-bold txt-main txt-11 margin-bottom-5px">
                    <h4>End Date : </h4>
                  </div>
                  <CalendarPicker
                    date={this.state.endDate}
                    onChange={e => {
                      this.handleSelectEndDate(e);
                    }}
                  />
                </div>
                <div>
                  <div className="txt-site txt-bold txt-main txt-11 margin-bottom-5px">
                    <h4>Search</h4>
                  </div>
                  <button
                    type="button"
                    onClick={e => {
                      e.preventDefault();
                      if (R.isEmpty(this.state.startDate))
                        return alert("Start Date is Required.");
                      if (R.isEmpty(this.state.endDate))
                        return alert("End Date is Required.");
                      if (
                        !R.isEmpty(this.state.startDate) &&
                        !R.isEmpty(this.state.endDate) &&
                        this.state.endDate < this.state.startDate
                      )
                        return alert(
                          "End Date Should be Greater Than Start Date."
                        );
                      this.handleSubmit();
                    }}
                    className="btn btn-circle btn-blue"
                  >
                    <i className="fas fa-search" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          {this.state.dataLoaded && (
            <div>
              <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
              <div className="padding-15px">
                <MuiThemeProvider theme={getMuiTheme()}>
                  <MUIDataTable
                    data={this.state.rows}
                    columns={this.state.cols}
                    options={options}
                  />
                </MuiThemeProvider>
              </div>
            </div>
          )}
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

export default connect(mapStateToProps, mapDispatchToProps)(Absence);
