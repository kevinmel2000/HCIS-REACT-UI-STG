import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";

var ct = require("../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class FormOvertimeHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  columnsHistory = [
    "Request Number",
    "Loan Type",
    "NIK",
    "Employee Name",
    "Loan Amount",
    "Total Outstanding",
    "Due Date",
    "Interest",
    "Total Installment"
  ];

  dataHistory = [
    [
      "DATA DUMMY",
      "DATA DUMMY",
      "DATA DUMMY",
      "DATA DUMMY",
      "DATA DUMMY",
      "DATA DUMMY",
      "DATA DUMMY",
      "DATA DUMMY",
      "DATA DUMMY"
    ]
  ];

  render() {
    return (
      <div className="vertical-tab-content active">
        <form action="#" className="padding-15px">
          <div className="padding-bottom-15px">
            <MuiThemeProvider theme={getMuiTheme()}>
              <MUIDataTable
                title="History"
                data={this.dataHistory}
                columns={this.columnsHistory}
                options={options}
              />
            </MuiThemeProvider>
          </div>
          <div>
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
        </form>
      </div>
    );
  }
}

export default FormOvertimeHistory;
