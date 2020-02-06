import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";

import DropDown from "../../../modules/popup/DropDown";
import CalendarPicker from "../../../modules/popup/Calendar";

var ct = require("../../../modules/custom/customTable");

class FormOutsourceSdm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      printClass: "app-popup",
      detailClass: "app-popup",
      searchClass: "app-popup"
    };
  }
  getMuiTheme = () => createMuiTheme(ct.customTable());
  options = ct.customOptions();

  openPrint = () => {
    if (this.state.printClass === "app-popup app-popup-show") {
      this.setState({ printClass: "app-popup" });
    } else {
      this.setState({ printClass: "app-popup app-popup-show" });
    }
  };

  openDetail = () => {
    if (this.state.detailClass === "app-popup app-popup-show") {
      this.setState({ detailClass: "app-popup" });
    } else {
      this.setState({ detailClass: "app-popup app-popup-show" });
    }
  };

  openSearch = () => {
    if (this.state.searchClass === "app-popup app-popup-show") {
      this.setState({ searchClass: "app-popup" });
    } else {
      this.setState({ searchClass: "app-popup app-popup-show" });
    }
  };

  dataTableSearch = [
    ["1", "324234", "LILLY", "DEPOK", "0", "0", "0", "3.000.000", "2", "6"]
  ];
  columnsSearch = [
    "No",
    "Vendor ID",
    "Vendor Name",
    "Address",
    "Start Contract Date",
    "Finish Contract Date",
    "Phone Number",
    "HP Number",
    "Email",
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              <button
                className="btn btn-blue btn-small-circle fa fa-plus"
                style={{ marginRight: 5 }}
              >
                <i className="fa fa-lw fa-Plus" />
              </button>
            </div>
          );
        }
      }
    }
  ];

  columns = [
    "No",
    "Evaluation Type",
    "Factor Type",
    "Factor Category",
    "Score",
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              <button
                type="button"
                className="btn btn-blue btn-small-circle"
                style={{ marginRight: 5 }}
                onClick={() => this.openDetail()}
              >
                <i className="fa fa-lw fa-ellipsis-v" />
              </button>
            </div>
          );
        }
      }
    }
  ];

  dataPPh = [["1", "2", "3", "4", "5"]];

  render() {
    return (
      <div className="app-popup app-popup-show ">
        <div className="padding-top-20px" />
        <div
          className="popup-content-small background-white border-radius"
          style={{ marginBottom: 10 }}
        >
          <div className="vertical-tab-content active">
            <div className="popup-panel grid grid-2x">
              <div className="col-1">
                <div className="popup-title">
                  {this.props.type === "create"
                    ? "SDM Assessment - Create Form"
                    : this.props.type === "edit"
                      ? "SDM Assessment - Edit Form"
                      : "SDM Assessment - View Form"}
                </div>
              </div>
              <div className="col-2 content-right">
                <button
                  className="btn btn-circle btn-grey"
                  onClick={this.props.onClickClose}
                >
                  <i className="fa fa-lg fa-times" />
                </button>
              </div>
            </div>

            <form action="#">
              <div className="padding-15px border-bottom">
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Vendor ID</h4>
                    </div>
                  </div>
                  <input
                    style={
                      this.props.type !== "view"
                        ? {
                          backgroundColor: "#E6E6E6",
                          width: "calc(100% - 85px)",
                          marginRight: "10px"
                        }
                        : { backgroundColor: "#E6E6E6", width: "95.5%" }
                    }
                    readOnly
                    className="txt txt-sekunder-color"
                    type="text"
                    placeholder=""
                  ></input>
                  {this.props.type !== "view" ? (
                    <button
                      className="btn btn-blue fa fa-search"
                      type="button"
                      onClick={this.openSearch}
                      disabled={this.props.type !== "create"}
                    ></button>
                  ) : null}
                </div>
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Vendor Name</h4>
                    </div>
                  </div>
                  <input
                    readOnly
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : this.props.type === "edit"
                          ? { backgroundColor: "#E6E6E6" }
                          : { backgroundColor: "#E6E6E6" }
                    }
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                  />
                </div>
                <div className="margin-bottom-5px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Assessment Date</h4>
                    </div>
                  </div>
                  <CalendarPicker
                    disabled={this.props.type === "view" ? true : false}
                    // date={this.state.employeeDataWorkExp.workExperienceStartDate}
                    onChange={e => {
                      console.log(e);
                    }}
                  />
                  {/* <input
                                            style={this.props.type === "view" ? {  backgroundColor: "#E6E6E6"}:
                                                this.props.type === "edit" ? { } :null}
                                            className="txt txt-sekunder-color"
                                            type="date"
                                            placeholder=""
                                            disabled={this.props.type === "view"}
                                        >
                                        </input> */}
                </div>
              </div>
              {this.props.type === "edit" ? (
                <div className="content-right margin-right-15px margin-top-15px">
                  <button
                    type="button"
                    className="btn btn-blue btn-small-circle"
                    onClick={this.openPrint}
                  >
                    <i className="fa fa-lw fa-print" />
                  </button>
                </div>
              ) : null}

              <div className={this.state.searchClass}>
                <div className="padding-top-20px" />
                <div className="popup-content background-white border-radius">
                  <div className="popup-panel grid grid-2x">
                    <div className="col-1">
                      <div className="popup-title">Vendor - Search</div>
                    </div>
                  </div>
                  <div className="padding-5px">
                    <MuiThemeProvider theme={this.getMuiTheme()}>
                      <MUIDataTable
                        data={this.dataTableSearch}
                        columns={this.columnsSearch}
                        options={this.options}
                      />
                    </MuiThemeProvider>
                  </div>
                  <div className="content-right padding-bottom-10px">
                    <button
                      style={{ marginRight: "15px" }}
                      className="btn btn-primary"
                      type="button"
                      onClick={this.openSearch}
                    >
                      <span>CLOSE</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className={this.state.printClass}>
                <div className="popup-content-mikro background-white border-radius post-center">
                  <div className="popup-panel grid grid-2x">
                    <div className="col-1">
                      <div className="popup-title">Report Viewer</div>
                    </div>
                    <div className="content-right">
                      <button className="btn background-transaparant">
                        <i className="fa fa-download" />
                      </button>
                    </div>
                  </div>
                  <div className="padding-15px">
                    <div className="grid margin-top-15px">
                      <div className="content-right">
                        <button
                          style={{ marginLeft: "15px" }}
                          className="btn btn-primary"
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

              <div className={this.state.detailClass}>
                <div className="padding-top-20px" />
                <div
                  className="popup-content-small background-white border-radius"
                  style={{ marginBottom: 10 }}
                >
                  <div className="popup-panel">
                    <div className="popup-title">
                      SDM Assessment - Edit Detail Form
                    </div>
                  </div>
                  <div className="border-bottom padding-15px grid grid-mobile-none gap-20px">
                    <div className="margin-bottom-20px">
                      <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                          <h4>Evaluation Type</h4>
                        </div>
                      </div>
                      <DropDown
                        title="-- please select evaluation type --"
                        onChange={dt => console.log(dt)}
                        // type="bizpar"
                        disabled={this.props.type === "view"}
                        data={[
                          { id: "1", title: "201928918", value: "201928918" },
                          { id: "2", title: "123123123", value: "123123123" }
                        ]}
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
                                                <option value="1">201928918</option>
                                                <option value="1">12321321</option>
                                            </select>*/}
                    </div>
                    <div className="margin-bottom-20px">
                      <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                          <h4>Factor Type</h4>
                        </div>
                      </div>
                      <DropDown
                        title="-- please select factor type --"
                        onChange={dt => console.log(dt)}
                        // type="bizpar"
                        disabled={this.props.type === "view"}
                        data={[
                          { id: "1", title: "AHM", value: "AHM" },
                          { id: "2", title: "CMD", value: "CMD" }
                        ]}
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
                                                <option value="1">AHM</option>
                                                <option value="1">AHM</option>
                                            </select>*/}
                    </div>
                    <div className="margin-bottom-20px">
                      <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                          <h4>Factory Category</h4>
                        </div>
                      </div>
                      <DropDown
                        title="-- please select factor category --"
                        onChange={dt => console.log(dt)}
                        // type="bizpar"
                        disabled={this.props.type === "view"}
                        data={[
                          { id: "1", title: "06/08/2019", value: "06/08/2019" },
                          { id: "2", title: "06/08/2019", value: "06/08/2019" }
                        ]}
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
                                                <option value="1">06/08/2019</option>
                                                <option value="1">06/08/2019</option>
                                            </select>*/}
                    </div>
                    <div className="margin-bottom-20px">
                      <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                          <h4>Score</h4>
                        </div>
                      </div>
                      <input
                        type="text"
                        className="txt txt-sekunder-color"
                        placeholder="89"
                        required
                      />
                    </div>
                  </div>
                  <div className="padding-15px">
                    <div className="grid margin-top-15px">
                      <div className="content-right">
                        <button
                          style={{ marginLeft: "15px" }}
                          className="btn btn-blue"
                          type="button"
                          onClick={() => this.props.onClickSave()}
                        >
                          <span>SAVE</span>
                        </button>
                        <button
                          style={{ marginLeft: "15px" }}
                          className="btn btn-primary"
                          type="button"
                          onClick={this.openDetail}
                        >
                          <span>CLOSE</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {this.props.type !== "create" ? (
                <div className="padding-15px border-bottom">
                  <MuiThemeProvider theme={this.getMuiTheme()}>
                    <MUIDataTable
                      data={this.dataPPh}
                      columns={this.columns}
                      options={this.options}
                    />
                  </MuiThemeProvider>
                </div>
              ) : null}
            </form>
          </div>
          <div className="padding-15px">
            <div className="grid grid-2x">
              <div className="col-1" />
              <div className="col-2 content-right">
                <button
                  style={{ marginLeft: "15px" }}
                  className="btn btn-blue"
                  type="button"
                  onClick={() => this.props.onClickSave()}
                >
                  <span>SAVE</span>
                </button>
                <button
                  style={{ marginLeft: "15px" }}
                  onClick={this.props.onClickClose}
                  className="btn btn-primary"
                  type="button"
                >
                  <span>CLOSE</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="padding-top-20px" />
      </div>
    );
  }
}

export default FormOutsourceSdm;
