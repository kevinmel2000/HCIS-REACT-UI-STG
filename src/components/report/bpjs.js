import React, { Component } from "react";
import LoadingBar from "react-top-loading-bar";
import { ExcelRenderer } from "react-excel-renderer";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import DropDown from "../../modules/popup/DropDown";
import * as R from "ramda";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import AuthAction from '../../Redux/AuthRedux'
import IdleTimer from 'react-idle-timer'

var ct = require("../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();
const year = new Date().getFullYear();

class Bpjs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: props.auth,
      dataLoaded: false,
      rows: null,
      cols: null,
      reportURL: "",
      year: new Date().getFullYear(),
      month: "1",
      timeout: 1000 * 100 * 9,
      isTimedOut: false
    }
    this.idleTimer = null
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fileHandler = this.fileHandler.bind(this);
    this.renderFile = this.renderFile.bind(this);
    this.years = Array.from(new Array(2), (val, index) => year - index);
    this.month = Array.from(new Array(12), (val, index) => index + 1);
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

  async handleSubmit(event) {
    console.log(event);
    let response = await fetch(
      process.env.REACT_APP_HCIS_BE_API + "report/rpt/bpjs.ks/" +
      this.state.month +
      "/" +
      this.state.year,
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
    event.preventDefault();
  }

  async downloadReport(value) {
    let res = await fetch(
      process.env.REACT_APP_HCIS_BE_API + "report/rpt/bpjs.ks/" +
      this.state.month +
      "/" +
      this.state.year,
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
      process.env.REACT_APP_HCIS_BE_API + "report/rpt/bpjs.ks/" +
      this.state.month +
      "/" +
      this.state.year,
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
    if (R.isNil(this.props.auth.user)) return <Redirect to={{ pathname: "/" }}></Redirect>;
    let months = this.month.map((month, index) => {
      return {
        bizparKey: month,
        bizparValue: month
      };
    });
    let years = this.years.map((year, index) => {
      return {
        bizparKey: year,
        bizparValue: year
      };
    });

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
                  BPJS Info
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
              <form onSubmit={this.handleSubmit}>
                <div className="display-flex-normal">
                  <div style={{ marginRight: "10px", width: "200px" }}>
                    <div className="txt-site txt-bold txt-main txt-11 margin-bottom-5px">
                      <h4>Month : </h4>
                    </div>
                    <DropDown
                      title="-- select month --"
                      onChange={dt =>
                        this.setState({
                          month: dt
                        })
                      }
                      type="bizpar"
                      data={months}
                      value={this.state.month}
                    />
                  </div>
                  <div style={{ marginRight: "10px", width: "200px" }}>
                    <div className="txt-site txt-bold txt-main txt-11 margin-bottom-5px">
                      <h4>Year : </h4>
                    </div>
                    <DropDown
                      title="-- select year --"
                      onChange={dt =>
                        this.setState({
                          year: dt
                        })
                      }
                      type="bizpar"
                      data={years}
                      value={this.state.years}
                    />
                  </div>
                  <div>
                    <div className="txt-site txt-bold txt-main txt-11 margin-bottom-5px">
                      <h4>Search</h4>
                    </div>
                    <button type="submit" className="btn btn-circle btn-blue">
                      <i className="fas fa-search" />
                    </button>
                  </div>
                </div>
              </form>
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

export default connect(mapStateToProps, mapDispatchToProps)(Bpjs);
