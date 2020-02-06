import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";

import DropDown from '../../../../modules/popup/DropDown';
import CalendarPicker from '../../../../modules/popup/Calendar';

var ct = require("../../../custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class FormCreateDO extends Component {
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
      "1800",
      "Pelatihan Pemrograman",
      "Sertifikasi",
      "IT",
      "Basic 2",
      "Basic 3",
      "Basic 4",
      "Basic 5"
    ]
  ];

  //Data table untuk Search Form
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
    "Action",
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              <button
                className="btn btn-blue btn-small-circle fa fa-plus"
                style={{ marginRight: 5 }}
                disabled
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
      <div className="app-popup app-popup-show ">
        <div className="padding-top-20px" />
        <div className="popup-content background-white border-radius">
          <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="popup-title">
                Outsource - Data Outsource - Create Form
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

          {/*Popup Search*/}
          <div className={this.state.searchClass}>
            <div className="padding-top-20px" />
            <div className="popup-content background-white border-radius">
              <div className="popup-panel grid grid-2x ">
                <div className="col-1">
                  <div className="popup-title">
                    Vendor - Search
                  </div>
                </div>
              </div>
              <div className="padding-5px">
                <MuiThemeProvider theme={getMuiTheme()}>
                  <MUIDataTable
                    data={this.dataTableSearch}
                    columns={this.columnsSearch}
                    options={options}
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
          {/*End Popup Search*/}
          <form action="#">
            <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-15px">
              <div className="margin-5px">
                <span className="txt-site txt-15 txt-main txt-bold">
                  Data-Organization Structure
                </span>
              </div>
              <div className="column-1">
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Id Vendor <span style={{ color: "red" }}>*</span></h4>
                    </div>
                  </div>
                  <div class="input-grey input-border">
                    <input
                      class="txt txt-transparant text-no-radius text-no-shadow"
                      name="search"
                      style={{ backgroundColor: "#E6E6E6" }}
                      readOnly
                    ></input>
                  </div>
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Vendor Name <span style={{ color: "red" }}>*</span></h4>
                    </div>
                  </div>
                  <div class="input-group txt-sekunder-color">
                    <input
                      class="txt txt txt-sekunder-color"
                      name="search"
                      style={{ backgroundColor: "#E6E6E6" }}
                      readOnly
                      placeholder="Vendor Name ...."
                    ></input>
                    <button
                      className="btn btn-blue fa fa-search"
                      type="button"
                      disabled={this.props.type === "view" ? true : false}
                      onClick={this.openSearch}
                    ></button>
                  </div>
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Employee Name</h4>
                    </div>
                  </div>
                  <input
                    class="txt txt-sekunder-color text-no-radius text-no-shadow"
                    type="text"
                    required
                    placeholder=""
                  />
                </div>
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Birth Place</h4>
                    </div>
                  </div>
                  <input
                    type="text"
                    required
                    className="txt txt-sekunder-color"
                    placeholder=""
                  />
                </div>
              </div>

              <div className="column-2">
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Date of Birth</h4>
                    </div>
                  </div>
                  <CalendarPicker
                    // disabled={this.props.type === 'view' ? true : false}
                    // date={this.state.employeeDataWorkExp.workExperienceStartDate}
                    onChange={(e) => {
                      console.log(e)
                    }} />
                  {/* <input
                    type="date"
                    required
                    className="txt txt-sekunder-color"
                    placeholder=""
                  /> */}
                </div>
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Gender</h4>
                    </div>
                  </div>
                  <DropDown
                    title="-- please select gender --"
                    onChange={(dt) => console.log(dt)}
                    // type="bizpar"
                    // disabled={this.props.type === "update" ? true : false}
                    data={[
                      { id: '1', title: 'Male', value: 'male' },
                      { id: '2', title: 'Female', value: 'female' }
                    ]} />
                  {/*<select className="cf-select slc slc-sekunder">
                    <option>-- please select gender --</option>
                  </select>*/}
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>NIK</h4>
                    </div>
                  </div>
                  <input
                    type="text"
                    required
                    className="txt txt-sekunder-color"
                    placeholder=""
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Position</h4>
                    </div>
                  </div>
                  <input
                    type="text"
                    required
                    className="txt txt-sekunder-color"
                    placeholder=""
                  />
                </div>
              </div>
            </div>
            {/**baris group ke 2 */}
            <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-15px">
              <div className="margin-5px">
                <span className="txt-site txt-15 txt-main txt-bold">
                  Employee Agreement
                </span>
              </div>
              <div className="column-1">
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Join Date <span style={{ color: "red" }}>*</span></h4>
                    </div>
                  </div>
                  <CalendarPicker
                    // disabled={this.props.type === 'view' ? true : false}
                    // date={this.state.employeeDataWorkExp.workExperienceStartDate}
                    onChange={(e) => {
                      console.log(e)
                    }} />
                  {/* <input
                    type="date"
                    required
                    className="txt txt-sekunder-color"
                    placeholder=""
                  /> */}
                </div>
              </div>
              <div className="column-2">
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Start Date Finish <span style={{ color: "red" }}>*</span></h4>
                    </div>
                  </div>
                  <div className="display-flex-normal width width-full">
                    <CalendarPicker
                      // disabled={this.props.type === 'view' ? true : false}
                      // date={this.state.employeeDataWorkExp.workExperienceStartDate}
                      onChange={(e) => {
                        console.log(e)
                      }} />
                    <div className="txt-site txt-11 txt-primary txt-center margin-10px margin-left-10px margin-right-10px">
                      To
										</div>
                    <CalendarPicker
                      // disabled={this.props.type === 'view' ? true : false}
                      // date={this.state.employeeDataWorkExp.workExperienceEndDate}
                      onChange={(e) => {
                        console.log(e)
                      }} />
                  </div>
                  {/* <div className="grid grid-3x grid-mobile-none gap-20px">
                    <div className="column-1">
                      <input
                        type="date"
                        className="txt txt-sekunder-color"
                        placeholder=""
                        required
                      />
                    </div>
                    <div className="column-2">
                      <p align="center" className="padding-5px">
                        To
                      </p>
                    </div>
                    <div className="column-3">
                      <input
                        type="date"
                        className="txt txt-sekunder-color"
                        placeholder=""
                        required
                      />
                    </div>
                  </div> */}
                </div>
              </div>
            </div>

            <div className="padding-15px">
              <div className="grid grid-2x">
                <div className="col-1" />
                <div className="col-2 content-right">
                  {this.props.type !== "view" ? (
                    <button
                      style={{ marginLeft: "15px" }}
                      className="btn btn-blue"
                      type="button"
                      onClick={() => this.props.onClickSave()}
                    >
                      <span>SAVE</span>
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
        <div className="padding-bottom-20px" />
      </div>
    );
  }
}

export default FormCreateDO;
