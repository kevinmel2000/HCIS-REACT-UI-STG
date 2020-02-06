import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";

var ct = require("../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class FormRepaymentSub extends Component {
  constructor(props) {
    super(props);
    this.state = {
      printClass: "app-popup"
    };
  }

  openPrint = () => {
    if (this.state.printClass === "app-popup app-popup-show") {
      this.setState({ printClass: "app-popup" });
    } else {
      this.setState({ printClass: "app-popup app-popup-show" });
    }
  };

  columns = [
    "Bulan",
    "Angs ke",
    "Bunga (%)",
    "Jangka Waktu",
    "Pokok",
    "Bunga",
    "Total Cicilan",
    "Outstanding"
  ];

  dataTable = [["1", "cc", "tes"]];

  render() {
    return (
      <div className="vertical-tab-content active">
        <div className="padding-15px">
          <div className="col-2 content-right padding-bottom-10px">
            <button
              type="button"
              className="btn btn-circle btn-blue"
              onClick={this.openPrint.bind(this)}
            >
              <i className="fa fa-print" />
            </button>
          </div>
          <div className="padding-bottom-15px">
            <MuiThemeProvider theme={getMuiTheme()}>
              <MUIDataTable
                data={this.dataTable}
                columns={this.columns}
                options={options}
              />
            </MuiThemeProvider>
          </div>
          <div className="grid grid-2x">
            <div className="col-1" />
            <div className="col-2 content-right">
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
        {/* Popup Print */}
        <div className={this.state.printClass}>
          <div
            className="popup-content-mikro background-white border-radius post-center"
            style={{ marginBottom: 10 }}
          >
            <div className="popup-panel grid grid-2x">
              <div className="col-1">
                <div className="popup-title">Report Viewer</div>
              </div>
              <div className="col-2 content-right" style={{ marginTop: 10 }}>
                <i className="fa fa-download" style={{ cursor: "pointer" }} />
              </div>
            </div>
            <div className="padding-15px background-grey">
              <div className="grid margin-top-15px">
                <div className="content-right">
                  <button
                    style={{ marginLeft: "15px" }}
                    className="btn background-grey"
                    type="button"
                    onClick={this.openPrint}
                  >
                    <span>CLOSE</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* End Popup Print */}
      </div>
    );
  }
}

export default FormRepaymentSub;
