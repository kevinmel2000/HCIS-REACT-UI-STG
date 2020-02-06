import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import LoadingBar from "react-top-loading-bar";

var ct = require("../../../modules/custom/customTable");

class formScore extends Component {
  componentDidMount() {
    this.onFinishFetch();
  }

  startFetch = () => {
    this.LoadingBar.continousStart();
  };

  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
  };

  getMuiTheme = () => createMuiTheme(ct.customTable());

  options = ct.customOptions();

  columns = ["No", "Training Name", "Start Date", "End Date", "Score"];

  data = [["1", "Basic Java", "09-09-2019", "09-09-2020", "100"]];
  render() {
    return (
      <div className={"app-popup app-popup-show"}>
        <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
        <div className="padding-top-20px" />
        <div
          className="popup-content background-white border-radius"
          style={{ marginBottom: 10 }}
        >
          <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="popup-title">Facilitator Evaluation - Detail</div>
            </div>
          </div>

          <form action="#">
            <div className="border-bottom padding-15px grid-mobile-none gap-20px">
              <div className="padding-5px" />
              <MuiThemeProvider theme={this.getMuiTheme()}>
                <MUIDataTable
                  data={this.data}
                  columns={this.columns}
                  options={this.options}
                />
              </MuiThemeProvider>
            </div>

            <div className="padding-15px">
              <div className="grid grid-2x">
                <div className="col-1" />
                <div className="col-2 content-right">
                  <button
                    style={{ marginLeft: "15px" }}
                    className="btn btn-btn-primary"
                    type="button"
                    onClick={this.props.onClickClose}
                  >
                    <span>CLOSE</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="padding-bottom-20px" />
      </div>
    );
  }
}

export default formScore;
