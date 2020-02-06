import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";

var ct = require("../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class ImportDataDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      downloadVisible: false
    };
  }

  openPrint = () => {
    this.setState({ downloadVisible: !this.state.downloadVisible });
  };
  columns = ["NIK", "Employee Name", "Amount"];
  data = [["100007", "LILYANA TAN", "LILYANA TAN"]];

  render() {
    let { downloadVisible } = this.state;
    return (
      <div className="app-popup app-popup-show">
        <div className="padding-top-20px"></div>
        <div className="popup-content background-white border-radius">
          <div className="padding-15px background-blue grid grid-2x">
            <div className="col-1">
              <div className="txt-site txt-12 txt-bold post-center">
                Payroll Structure - History
              </div>
            </div>
            <div className="col-2 content-right">
              <button
                className="btn btn-circle background-blue"
                onClick={this.props.onClickClose}
              >
                <i className="fa fa-lg fa-times"></i>
              </button>
            </div>
          </div>
          <div className="padding-15px">
            <div className="col-2 content-right">
              <button
                type="button"
                className="btn btn-circle background-primary"
                style={{ marginRight: 5 }}
                onClick={this.openPrint}
              >
                <i className="fa fa-1x fa-print"></i>
              </button>
            </div>
          </div>

          <div className="padding-5px">
            <MuiThemeProvider theme={getMuiTheme()}>
              <MUIDataTable
                title="Detail"
                data={this.data}
                columns={this.columns}
                options={options}
              />
            </MuiThemeProvider>
          </div>

          {downloadVisible && (
            <div className="app-popup app-popup-show">
              <div className="padding-top-20px" />
              <div className="popup-content-mikro background-white border-radius post-center">
                <div className="padding-15px background-white border-bottom grid grid-2x">
                  <div className="col-1">
                    <div className="txt-site txt-12 txt-bold post-center">
                      REPORT VIEWER
                    </div>
                  </div>
                  <div className="content-right">
                    <button
                      className="btn"
                    >
                      <i className="fa fa-lw fa-print" />
                    </button>
                  </div>
                </div>
                <div className="padding-15px background-grey">
                  <div className="grid margin-top-15px">
                    <div className="content-right">
                      <button
                        style={{ marginLeft: "15px" }}
                        className="btn btn-blue"
                        type="button"
                        onClick={this.openPrint.bind(this)}
                      >
                        <span>CLOSE</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="padding-15px">
            <div className="grid grid-2x">
              <div className="col-1"></div>
              <div className="col-2 content-right">
                <button
                  style={{ marginLeft: "15px" }}
                  className="btn btn-blue"
                  type="button"
                  onClick={this.props.onClickClose}
                >
                  <span>CLOSE</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ImportDataDetail;
