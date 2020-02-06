import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import FormSearchEmployee from "../../formEmployee/formSearchEmployee";
import DropDown from '../../../../modules/popup/DropDown';
import CalendarPicker from '../../../../modules/popup/Calendar';
import TimePicker from '../../../../modules/popup/Time';

var ct = require("../../../custom/customTable");

class formPlanDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchClassTraining: "app-popup",
      formSearchEmpVisible: false
    };
  }

  openSearcTraining = () => {
    if (this.state.searchClassTraining === "app-popup app-popup-show") {
      this.setState({ searchClassTraining: "app-popup" });
    } else {
      this.setState({ searchClassTraining: "app-popup app-popup-show" });
    }
  };

  openSearch() {
    this.setState({ formSearchEmpVisible: !this.state.formSearchEmpVisible });
  }

  getMuiTheme = () => createMuiTheme(ct.customTable());
  options = ct.customOptions();
  dataTableSearchTraining = [["1", "Java", "S1", "IT", "IT", "IT", "IT", "IT"]];

  columnsSearchTraining = [
    "No",
    "Training Name",
    "Type",
    "Sub Type 1",
    "Sub Type 2",
    "Sub Type 3",
    "Sub Type 4",
    "Sub Type 5",
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              <button
                className="btnAct"
                style={{ marginRight: 15, backgroundColor: 'transparent' }}
                onClick={() => this.openSearch(tableMeta.rowIndex)}
              >
                <i className="fa fa-lw fa-Plus" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
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
        <div className={this.state.searchClassTraining}>
          <div className="padding-top-20px" />
          <div className="popup-content background-white border-radius">
            <div className="popup-panel grid grid-2x">
              <div className="col-1">
                <div className="popup-title">
                  Training Name - Search Form
                </div>
              </div>
            </div>
            <div className="padding-5px">
              <MuiThemeProvider theme={this.getMuiTheme()}>
                <MUIDataTable
                  data={this.dataTableSearchTraining}
                  columns={this.columnsSearchTraining}
                  options={this.options}
                />
              </MuiThemeProvider>
            </div>
            <div className="content-right padding-bottom-10px">
              <button
                style={{ marginRight: "15px" }}
                className="btn btn-primary"
                type="button"
                onClick={this.openSearcTraining}
              >
                <span>CLOSE</span>
              </button>
            </div>
          </div>
        </div>

        {this.state.formSearchEmpVisible && (
          <FormSearchEmployee
            onClickClose={this.openSearch.bind(this)}
          // onClickEmp={this.addEmployeeHandler.bind(this)}
          />
        )}

        <form action="#">
          <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-20px">
            <div className="column-1">
              <div className="card-date-picker margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Training Name</h4>
                  </div>
                </div>
                <div className="double">
                  <input
                    style={{ backgroundColor: "#E6E6E6" }}
                    readOnly
                    className='input'
                    type="text"
                  />
                  <button
                    disabled={this.props.type !== "create"}
                    className="btn btn-grey border-left btn-no-radius"
                    type="button"
                    onClick={this.openSearcTraining}
                  >
                    <i className="fa fa-lg fa-search" />
                  </button>
                </div>
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Type</h4>
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
                    <h4>Sub Type 1</h4>
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
                    <h4>Sub Type 2</h4>
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
                    <h4>Sub Type 3</h4>
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
                    <h4>Sub Type 4</h4>
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
                    <h4>Sub Type 5</h4>
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
                    <h4>Period</h4>
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
                    <h4>Participant</h4>
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

              <div className="card-date-picker" style={{ marginBottom: 17 }}>
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>PIC <span style={{ color: "red" }}>*</span></h4>
                  </div>
                </div>
                <div className="double">
                  <input
                    style={{ backgroundColor: "#E6E6E6" }}
                    readOnly
                    className='input'
                    type="text"
                  ></input>
                  <button
                    disabled={this.props.type !== "create"}
                    className="btn btn-grey border-left btn-no-radius"
                    type="button"
                    onClick={() => this.openSearch()}
                  >
                    <i className="fa fa-lg fa-search"></i>
                  </button>
                </div>
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Extention <span style={{ color: "red" }}>*</span></h4>
                  </div>
                </div>
                <input
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                  style={
                    this.props.type !== "create"
                      ? {
                        backgroundColor: "#E6E6E6",
                        marginRight: 5
                      }
                      : {
                        marginRight: 5
                      }
                  }
                  readOnly={this.props.type !== "create"}
                />
              </div>
            </div>

            <div className="column-2">
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Date (dd-mm-yyyy) <span style={{ color: "red" }}>*</span></h4>
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
                      style={
                        this.props.type !== "create"
                          ? {
                              backgroundColor: "#E6E6E6",
                              marginRight: 5
                            }
                          : null
                      }
                      readOnly={this.props.type !== "create"}
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
                      style={
                        this.props.type !== "create"
                          ? {
                              backgroundColor: "#E6E6E6",
                              marginRight: 5
                            }
                          : null
                      }
                      readOnly={this.props.type !== "create"}
                    />
                  </div>
                </div> */}
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Day Amount</h4>
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
                    <h4>Time(hh:mm) <span style={{ color: "red" }}>*</span></h4>
                  </div>
                </div>
                <div className="display-flex-normal width width-full">
                  <TimePicker
                    // disabled={this.props.type === 'view' ? true : false}
                    // date={this.state.employeeDataWorkExp.workExperienceStartDate}
                    onChange={(e) => {
                      console.log(e)
                    }} />
                  <div className="txt-site txt-11 txt-primary txt-center margin-10px margin-left-10px margin-right-10px">
                    To
										</div>
                  <TimePicker
                    // disabled={this.props.type === 'view' ? true : false}
                    // date={this.state.employeeDataWorkExp.workExperienceEndDate}
                    onChange={(e) => {
                      console.log(e)
                    }} />
                </div>
                {/* <div className="grid grid-3x grid-mobile-none gap-20px">
                  <div className="column-1">
                    <input
                      style={
                        this.props.type !== "create"
                          ? {
                              backgroundColor: "#E6E6E6",
                              width: "20%"
                            }
                          : { width: "20%" }
                      }
                      readOnly={this.props.type !== "create"}
                      type="number"
                      min="0"
                      max="9"
                      className="txt txt-sekunder-color"
                      placeholder=""
                      required
                    />
                    :
                    <input
                      style={
                        this.props.type !== "create"
                          ? {
                              backgroundColor: "#E6E6E6",
                              width: "20%"
                            }
                          : { width: "20%" }
                      }
                      readOnly={this.props.type !== "create"}
                      min="0"
                      max="9"
                      type="number"
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
                      style={
                        this.props.type !== "create"
                          ? {
                              backgroundColor: "#E6E6E6",
                              width: "20%"
                            }
                          : { width: "20%" }
                      }
                      readOnly={this.props.type !== "create"}
                      min="0"
                      max="9"
                      type="number"
                      className="txt txt-sekunder-color"
                      placeholder=""
                      required
                    />
                    :
                    <input
                      style={
                        this.props.type !== "create"
                          ? {
                              backgroundColor: "#E6E6E6",
                              width: "20%"
                            }
                          : { width: "20%" }
                      }
                      readOnly={this.props.type !== "create"}
                      min="0"
                      max="9"
                      type="number"
                      className="txt txt-sekunder-color"
                      placeholder=""
                      required
                    />
                  </div>
                </div> */}
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Modul <span style={{ color: "red" }}>*</span></h4>
                  </div>
                </div>
                <input
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                  style={
                    this.props.type !== "create"
                      ? { backgroundColor: "#E6E6E6" }
                      : null
                  }
                  readOnly={this.props.type !== "create"}
                />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Purpose <span style={{ color: "red" }}>*</span></h4>
                  </div>
                </div>
                <input
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                  style={
                    this.props.type !== "create"
                      ? { backgroundColor: "#E6E6E6" }
                      : null
                  }
                  readOnly={this.props.type !== "create"}
                />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Goal <span style={{ color: "red" }}>*</span></h4>
                  </div>
                </div>
                <input
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                  style={
                    this.props.type !== "create"
                      ? { backgroundColor: "#E6E6E6" }
                      : null
                  }
                  readOnly={this.props.type !== "create"}
                />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Destination Area</h4>
                  </div>
                </div>
                <DropDown
                  title="-- please select component id --"
                  onChange={(dt) => console.log(dt)}
                  // type="bizpar"
                  // disabled={this.props.type === "update" ? true : false}
                  data={[
                    { id: '1', title: 'bandung', value: 'bandung' },
                    { id: '2', title: 'jakarta', value: 'jakarta' }]} />
                {/*<select
                  className="cf-select slc slc-sekunder"
                  required
                  style={
                    this.props.type !== "create"
                      ? { backgroundColor: "#E6E6E6" }
                      : null
                  }
                  disabled={this.props.type !== "create"}
                >
                  <option value="1">
                    -- please select destination area --
                  </option>
                  <option value="1">Jakarta</option>
                </select>*/}
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Location <span style={{ color: "red" }}>*</span></h4>
                  </div>
                </div>
                <input
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                  style={
                    this.props.type !== "create"
                      ? { backgroundColor: "#E6E6E6" }
                      : null
                  }
                  readOnly={this.props.type !== "create"}
                />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Participant Description{" "}</h4>
                  </div>
                </div>
                <input
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                  style={
                    this.props.type !== "create"
                      ? { backgroundColor: "#E6E6E6" }
                      : null
                  }
                  readOnly={this.props.type !== "create"}
                />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Cost Description <span style={{ color: "red" }}>*</span></h4>
                  </div>
                </div>
                <input
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                  style={
                    this.props.type !== "create"
                      ? { backgroundColor: "#E6E6E6" }
                      : null
                  }
                  readOnly={this.props.type !== "create"}
                />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Header Editor <span style={{ color: "red" }}>*</span></h4>
                  </div>
                </div>
                <input
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                  style={
                    this.props.type !== "create"
                      ? { backgroundColor: "#E6E6E6" }
                      : null
                  }
                  readOnly={this.props.type !== "create"}
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

export default formPlanDetail;
