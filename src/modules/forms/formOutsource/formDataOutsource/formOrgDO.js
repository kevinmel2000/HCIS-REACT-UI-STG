import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import PopUp from "../../../../components/pages/PopUpAlert";

import DropDown from '../../../../modules/popup/DropDown';
import CalendarPicker from '../../../../modules/popup/Calendar';

var ct = require("../../../custom/customTable");

class FormOrgDO extends Component {
  constructor() {
    super();
    this.state = {
      selectedIndex: null,
      rawData: [],

      createVisible: false,
      deletePopUpVisible: false,
      savePopUpVisible: false,
      createClass: "app-popup"
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

  openCreate = () => {
    if (this.state.createClass === "app-popup app-popup-show") {
      this.setState({ createClass: "app-popup" });
    } else {
      this.setState({
        createClass: "app-popup app-popup-show",
        applicantData: this.defaultApplicant,
        dataRecruitment: "",
        record: ""
      });
    }
  };

  openDeletePopup = index => {
    this.setState({
      deletePopUpVisible: !this.state.deletePopUpVisible,
      selectedIndex: index
    });
  };

  openSavePopUp = () => {
    this.setState({ savePopUpVisible: !this.state.savePopUpVisible });
  };

  handleUpdate = () => {
    this.openSavePopUp();
  };

  options = ct.customOptions();

  columns = [
    {
      name: "No",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              <button
                type="button"
                style={{ cursor: "pointer", backgroundColor: "#fff" }}
                onClick={() => this.openCreate(tableMeta.rowIndex)}
                disabled={this.props.type === "update" ? true : false}
              >
                {val}
              </button>
            </div>
          );
        }
      }
    },
    "Organization Structure",
    "Start Date",
    "Finish Date",
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              {this.props.type !== "view" ? (
                <button
                  type="button"
                  className="btn btn-red btn-small-circle"
                  onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
                  disabled={this.props.type === "view" ? true : false}
                >
                  <i className="fa fa-lw fa-trash-alt" />
                </button>
              ) : null}
            </div>
          );
        }
      }
    }
  ];

  dataOrg = [["1", "101", "10/07/2019", "31/07/2019"]];

  render() {
    return (
      <div className="padding-10px">
        <div className="margin-bottom-10px">
          <div className="col-2 content-right">
            {this.props.type !== "view" ? (
              <button
                type="button"
                className="btn btn-circle background-blue"
                onClick={() => this.openCreate()}
              >
                <i className="fa fa-plus" />
              </button>
            ) : null}
          </div>
        </div>

        <div className={this.state.createClass}>
          <div className="app-popup app-popup-show ">
            <div className="padding-top-20px" />
            <div className="popup-content-mikro background-white border-radius">
              <div className="popup-panel grid grid-2x">
                <div className="popup-title">
                  {this.props.type === "update"
                    ? "Outsource - Organization Structure - Create Form"
                    : this.props.type === "view"
                    ? "Outsource - Organization Structure - View Form"
                    : null}
                </div>
              </div>
              <form action="#">
                <div className="border-bottom padding-15px">
                  <div className="margin-bottom-20px">
                    <div className="margin-5px">
                      <div className="txt-site txt-11 txt-main txt-bold">
                        <h4>Positon <span style={{ color: "red" }}>*</span></h4>
                      </div>
                    </div>
                    <DropDown
                      title="-- please select position --"
                      onChange={(dt) => console.log(dt)}
                      // type="bizpar"
                      disabled={this.props.type === "view"}
                      data={[
                        {id: '1', title: 'COP', value: 'COP'}
                      ]} />
                    {/*<select
                      className="cf-select slc slc-sekunder"
                      style={
                        this.props.type === "view"
                          ? { backgroundColor: "#E6E6E6" }
                          : null
                      }
                      disabled={this.props.type === "view" ? true : false}
                    >
                      <option value="1">-- please select position --</option>
                      <option value="1">COP</option>
                    </select>*/}
                  </div>

                  <div className="margin-bottom-5px">
                    <div className="margin-5px">
                      <div className="txt-site txt-11 txt-main txt-bold">
                        <h4>Start Date and End Date <span style={{ color: "red" }}>*</span></h4>
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
                            this.props.type === "view"
                              ? { backgroundColor: "#E6E6E6" }
                              : null
                          }
                          disabled={this.props.type === "view" ? true : false}
                        />
                      </div>
                      <div className="column-2">
                        <p align="center" className="padding-5px">
                          to
                        </p>
                      </div>
                      <div className="column-3">
                        <input
                          type="date"
                          className="txt txt-sekunder-color"
                          placeholder=""
                          required
                          style={
                            this.props.type === "view"
                              ? { backgroundColor: "#E6E6E6" }
                              : null
                          }
                          disabled={this.props.type === "view" ? true : false}
                        />
                      </div>
                    </div> */}
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
                          onClick={() => this.handleUpdate()}
                        >
                          <span>SAVE</span>
                        </button>
                      ) : null}
                      <button
                        style={{ marginLeft: "15px" }}
                        className="btn btn-primary"
                        type="button"
                        onClick={this.openCreate}
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
        </div>
        
        <div className="margin-bottom-20px">
          <MuiThemeProvider theme={this.getMuiTheme()}>
            <MUIDataTable
              data={this.dataOrg}
              columns={this.columns}
              options={this.options}
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

        {this.state.deletePopUpVisible && (
          <PopUp
            type={"delete"}
            class={"app-popup app-popup-show"}
            onClickDelete={this.handleDelete}
            onClick={this.openDeletePopup}
          />
        )}
        {this.state.savePopUpVisible && (
          <PopUp
            type={"save"}
            class={"app-popup app-popup-show"}
            onClick={this.openSavePopUp}
          />
        )}
      </div>
    );
  }
}

export default FormOrgDO;
