import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import LoadingBar from "react-top-loading-bar";
var ct = require("../../../modules/custom/customTable");

class FormOutstandingGeneral extends Component {
  constructor() {
    super();
    this.state = {
      detailVisible: false,
      selectedIndex: null,
      rawData: [],
      dataTableOut: []
    };
  }

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

  columns = [
    "Import ID",
    "Employee NIK",
    "Employee Name",
    "Amount",
    "Outstanding Old",
    "Outstanding New"
  ];

  dataOut = [["1", "2", "5"]];

  handlePopUp = () => {
    this.setState({
      savePopUpVisible: false
    });
  };

  render() {
    return (
      <div className="vertical-tab-content active">
        <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
        <div className="padding-15px border-bottom">
          <MuiThemeProvider theme={this.getMuiTheme()}>
            <MUIDataTable
              data={this.dataOut}
              columns={this.columns}
              options={this.options}
            />
          </MuiThemeProvider>
        </div>
        <div className="padding-15px">
          <div className="grid grid-2x">
            <div className="col-1" />
            <div className="col-2 content-right">
              {this.props.type === "create" ? (
                <button
                  style={{ marginLeft: "15px" }}
                  className="btn btn-blue"
                  type="button"
                  onClick={() => this.props.onClickSave()}
                >
                  <span>SAVE</span>
                </button>
              ) : null}
              {this.props.type === "edit" ? (
                <button
                  style={{ marginLeft: "15px" }}
                  className="btn btn-blue"
                  type="button"
                  onClick={() => this.props.onClickSave()}
                >
                  <span>PROCESS</span>
                </button>
              ) : null}
              <button
                style={{ marginLeft: "15px" }}
                className="btn btn-primary"
                type="button"
                onClick={this.props.onClickClose}
              >
                <span>CLOSE</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FormOutstandingGeneral;
