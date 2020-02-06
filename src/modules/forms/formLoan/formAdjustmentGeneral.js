import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";

import DropDown from "../../../modules/popup/DropDown";

var ct = require("../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class FormAdjustmentGeneral extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchClass: "app-popup"
    };
  }

  openSearch = () => {
    if (this.state.searchClass === "app-popup app-popup-show") {
      this.setState({ searchClass: "app-popup" });
    } else {
      this.setState({ searchClass: "app-popup app-popup-show" });
    }
  };

  dataTableSearch = [
    [
      "098327",
      "LILLY",
      "HUTANG",
      "3.000.000",
      "0",
      "0",
      "0",
      "3.000.000",
      "Juli 2019",
      "6"
    ]
  ];

  columnsSearch = [
    "Reference Number",
    "Employee Name",
    "Loan Type",
    "Loan Total",
    "Adjustment Number",
    "Outstanding Total",
    "Remaining Period",
    "Adjustment Amount",
    "Adjustment Period",
    "Period Total",
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              <button
                type="button"
                className="btn btn-blue btn-small-circle fa fa-plus"
                style={{ marginRight: 5 }}
                onClick={() => this.openSearch(tableMeta.rowIndex)}
              >
                <i className="fa fa-lw fa-Plus" />
              </button>
            </div>
          );
        }
      }
    }
  ];

  render() {
    return (
      <div className="vertical-tab-content active">
        <div className={this.state.searchClass}>
        <div className="padding-top-20px" />
          <div className="popup-content background-white border-radius ">
            <div className="popup-panel grid grid-2x border-bottom ">
              <div className="col-1">
                <div className="popup-title">
                  Training Name - Search Form
                </div>
              </div>
            </div>
            <div className="padding-15px">
              <MuiThemeProvider theme={getMuiTheme()}>
                <MUIDataTable
                  data={this.dataTableSearch}
                  columns={this.columnsSearch}
                  options={options}
                />
              </MuiThemeProvider>
              <div className="content-right padding-top-15px">
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={this.openSearch}
                >
                  <span>CLOSE</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <form action="#">
          <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-20px">
            <div className="margin-5px">
              <span className="txt-site txt-15 txt-main txt-bold">
                REQUESTOR
              </span>
            </div>
            <div className="column-1">
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>NIK</h4>
                  </div>
                </div>
                <input
                  readOnly
                  style={{ backgroundColor: "#E6E6E6" }}
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                />
              </div>

              <div className="card-date-picker margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Employee Name</h4>
                  </div>
                </div>
                <div className='double'>
                <input
                  style={{ backgroundColor: "#E6E6E6" }}
                  readOnly
                  className="input"
                  type="text"
                  placeholder=""
                ></input>
                <button
                  className="btn btn-grey border-left btn-no-radius fas fa-search"
                  type="button"
                ></button>
                </div>
              </div>
            </div>

            <div className="column-2">
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Division</h4>
                  </div>
                </div>
                <input
                  readOnly
                  style={{ backgroundColor: "#E6E6E6" }}
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Position</h4>
                  </div>
                </div>
                <input
                  readOnly
                  style={{ backgroundColor: "#E6E6E6" }}
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                />
              </div>
            </div>
          </div>
          <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-20px">
            <div className="margin-5px">
              <span className="txt-site txt-15 txt-main txt-bold">HEAD</span>
            </div>
            <div className="column-1">
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Employee Name</h4>
                  </div>
                </div>
                <input
                  readOnly
                  style={{ backgroundColor: "#E6E6E6" }}
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Division</h4>
                  </div>
                </div>
                <input
                  readOnly
                  style={{ backgroundColor: "#E6E6E6" }}
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                />
              </div>
            </div>

            <div className="column-2">
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Position</h4>
                  </div>
                </div>
                <input
                  readOnly
                  style={{ backgroundColor: "#E6E6E6" }}
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                />
              </div>
            </div>
          </div>

          <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-20px">
            <div className="margin-5px">
              <span className="txt-site txt-15 txt-main txt-bold">HEADER</span>
            </div>
            <div className="column-1">
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Request Number</h4>
                  </div>
                </div>
                <input
                  readOnly
                  style={{ backgroundColor: "#E6E6E6" }}
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Adjustment Type</h4>
                  </div>
                </div>
                <DropDown
                  title="-- please select adjustment type --"
                  onChange={dt => console.log(dt)}
                  // type="bizpar"
                  disabled={this.props.type === "view" ? true : false}
                  data={[{ id: "1", title: "Pelunasan", value: "bs-1" }]}
                />
                {/*<select
                  className="cf-select slc slc-sekunder"
                  disabled={this.props.type === "view" ? true : false}
                  style={
                    this.props.type === "view"
                      ? { backgroundColor: "#E6E6E6" }
                      : null
                  }
                  required
                >
                  <option value="1">-- please select adjustment type --</option>
                  <option value="1">PELUNASAN</option>
                </select>*/}
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Loan Type</h4>
                  </div>
                </div>
                <DropDown
                  title="-- please select loan type --"
                  onChange={dt => console.log(dt)}
                  // type="bizpar"
                  disabled={this.props.type === "view" ? true : false}
                  data={[{ id: "1", title: "COP", value: "bs-1" }]}
                />
                {/*<select
                  className="cf-select slc slc-sekunder"
                  disabled={this.props.type !== "create" ? true : false}
                  style={
                    this.props.type !== "create"
                      ? { backgroundColor: "#E6E6E6" }
                      : null
                  }
                  required
                >
                  <option value="1">-- please select loan type --</option>
                  <option value="1">COP</option>
                </select>*/}
              </div>

              <div className="card-date-picker margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Reference No</h4>
                  </div>
                </div>
                <div className='double'>
                  <input
                    style={{ backgroundColor: "#E6E6E6" }}
                    readOnly
                    className='input'
                    type="text"
                    placeholder=""
                  ></input>
                  <button
                    className="btn btn-grey border-left btn-no-radius fas fa-search"
                    type="button"
                    disabled={this.props.type !== "create" ? true : false}
                    onClick={this.openSearch}
                  ></button>
                </div>
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Adjustment to-</h4>
                  </div>
                </div>
                <input
                  readOnly
                  style={{ backgroundColor: "#E6E6E6" }}
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                />
              </div>
            </div>

            <div className="column-2">
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Loan Total</h4>
                  </div>
                </div>
                <input
                  readOnly
                  style={{ backgroundColor: "#E6E6E6" }}
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Outstanding Total</h4>
                  </div>
                </div>
                <input
                  readOnly
                  style={{ backgroundColor: "#E6E6E6" }}
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Period Total</h4>
                  </div>
                </div>
                <input
                  readOnly
                  style={{ backgroundColor: "#E6E6E6" }}
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Remaining Period</h4>
                  </div>
                </div>
                <input
                  readOnly
                  style={{ backgroundColor: "#E6E6E6" }}
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Repayment Amount</h4>
                  </div>
                </div>
                <input
                  readOnly
                  style={{ backgroundColor: "#E6E6E6" }}
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                />
              </div>
            </div>
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
        </form>
      </div>
    );
  }
}

export default FormAdjustmentGeneral;
