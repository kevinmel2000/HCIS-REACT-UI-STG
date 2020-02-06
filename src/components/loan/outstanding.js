import React, { Component } from "react";
import PopUp from "../../components/pages/PopUpAlert";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import FormOutstandingGeneral from "../../modules/forms/formLoan/formOutstandingGeneral";
import FormOutstandingHistory from "../../modules/forms/formLoan/formOutstandingHistory";

import DropDown from "../../modules/popup/DropDown";
import CalendarPicker from "../../modules/popup/Calendar";

var ct = require("../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class Outstanding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      savePopUpVisible: false,
      deletePopUpVisible: false,
      createPopUpVisible: false,
      createClass: "app-popup",
      printClass: "app-popup",

      formMonitoringDetailCreateVisible: false,
      formMonitoringDetailViewVisible: false,
      formMonitoringDetailEditVisible: false,

      formOutstandingGeneralVisible: false,
      formOutstandingHistoryVisible: false,
      activeTab: "",
      tabMenu: ["Outstanding", "History"],
      tabMenuEdit: ["Outstanding", "Detail", "History"]
    };
  }

  openMonitoringDetailCreate = index => {
    let { formMonitoringDetailCreateVisible } = this.state;
    this.setState({
      formMonitoringDetailCreateVisible: !formMonitoringDetailCreateVisible,
      selectedIndex: !formMonitoringDetailCreateVisible ? index : null,
      activeTab: !formMonitoringDetailCreateVisible ? "Outstanding" : "",
      formOutstandingGeneralVisible: !formMonitoringDetailCreateVisible
        ? true
        : false
    });
  };

  openCreateForm = () => {
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

  openPrint = () => {
    if (this.state.printClass === "app-popup app-popup-show") {
      this.setState({ printClass: "app-popup" });
    } else {
      this.setState({ printClass: "app-popup app-popup-show" });
    }
  };

  openMonitoringDetailView = index => {
    let { formMonitoringDetailViewVisible } = this.state;
    this.setState({
      formMonitoringDetailViewVisible: !formMonitoringDetailViewVisible,
      selectedIndex: !formMonitoringDetailViewVisible ? index : null,
      activeTab: !formMonitoringDetailViewVisible ? "Outstanding" : "",
      formOutstandingGeneralVisible: !formMonitoringDetailViewVisible
        ? true
        : false,
      formOutstandingHistoryVisible: false
    });
  };

  openMonitoringDetailEdit = index => {
    let { formMonitoringDetailEditVisible } = this.state;
    this.setState({
      formMonitoringDetailEditVisible: !formMonitoringDetailEditVisible,
      selectedIndex: !formMonitoringDetailEditVisible ? index : null,
      activeTab: !formMonitoringDetailEditVisible ? "Outstanding" : "",
      formOutstandingGeneralVisible: !formMonitoringDetailEditVisible
        ? true
        : false,
      formOutstandingHistoryVisible: false
    });
  };

  handleUpdate = () => {
    this.openSavePopUp();
  };

  handleDelete = () => {
    this.setState({ deletePopUpVisible: false });
  };
  openSavePopUp = () => {
    this.setState({ savePopUpVisible: !this.state.savePopUpVisible });
  };

  openDeletePopup = index => {
    this.setState({
      deletePopUpVisible: !this.state.deletePopUpVisible,
      selectedIndex: index
    });
  };

  componentDidMount() {
    this.onFinishFetch();
  }

  startFetch = () => {
    this.LoadingBar.continousStart();
  };

  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
  };

  handleUpdate() {
    this.openSavePopUp();
  }
  handlePopUp = () => {
    this.setState({
      savePopUpVisible: false
    });
  };
  // important
  // vertical tab function
  opNavigator = title => {
    let cl = title === this.state.activeTab ? "c-n-link active" : "c-n-link";
    return (
      <li key={title} className={cl} onClick={this.opContent(title)}>
        {title}
      </li>
    );
  };

  opContent = title => e => {
    e.preventDefault();

    let allStateVisibleFalse = {
      ...this.state,
      formOutstandingGeneralVisible: false,
      formOutstandingHistoryVisible: false,
      activeTab: title
    };

    switch (title) {
      case "Outstanding":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formOutstandingGeneralVisible: true
        };
        break;
      case "History":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formOutstandingHistoryVisible: true
        };
        break;
      default:
        break;
    }
    this.setState(allStateVisibleFalse);
  };

  columns = [
    "Import Id",
    "Request By",
    "Effective Date",
    "Loan Type",
    "Sk Reference",
    "Total Data",
    {
      name: "File Data",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              <button
                type="button"
                className="btn btn-blue btn-small-circle"
                style={{ marginRight: 5 }}
                onClick={this.openPrint}
              >
                <i className="fa fa-lw fa-print" />
              </button>
            </div>
          );
        }
      }
    },
    "Description",
    {
      name: "Document Status",
      options: {
        customBodyRender: val => {
          return (
            <div>
              <label
                style={{
                  backgroundColor:
                    val === "" || val === null
                      ? null
                      : val === "Plan"
                      ? "grey"
                      : "brown",
                  color: "white",
                  padding: "5px",
                  borderRadius: 4,
                  fontSize: "14px",
                  border: "4px white"
                }}
              >
                {val}
              </label>
            </div>
          );
        }
      }
    },
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              {val === "Plan" ? (
                <button
                  type="button"
                  className="btn btn-blue btn-small-circle"
                  style={{ marginRight: 5 }}
                  onClick={() =>
                    this.openMonitoringDetailEdit(tableMeta.rowIndex)
                  }
                >
                  <i className="fa fa-lw fa-pencil-alt" />
                </button>
              ) : null}
              {val === "Plan" ? (
                <button
                  type="button"
                  className="btn btn-red btn-small-circle"
                  onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
                >
                  <i className="fa fa-lw fa-trash-alt" />
                </button>
              ) : null}
              {val === "Approved" ? (
                <button
                  type="button"
                  className="btn btn-blue btn-small-circle"
                  onClick={() => this.openMonitoringDetailView()}
                >
                  <i className="fa fa-lw fa-ellipsis-v" />
                </button>
              ) : null}
            </div>
          );
        }
      }
    }
  ];

  dataTable = [
    [
      "1",
      "LILLY Create date : 30/08/2019",
      "07/07/2019",
      "COP",
      "004",
      "0",
      "",
      "test",
      "Plan",
      "Plan"
    ],
    [
      "2",
      "LILLY Create date : 30/08/2019",
      "07/07/2019",
      "COP",
      "004",
      "0",
      "",
      "test",
      "Approved",
      "Approved"
    ]
  ];

  render() {
    return (
      <div className="main-content">
        <div className="padding-5px">
          <div className="col-2 content-right">
            <button
              type="button"
              className="btn btn-circle background-blue"
              onClick={this.openCreateForm}
            >
              <i className="fa fa-plus" />
            </button>
          </div>
        </div>

        <div className="padding-5px">
          <MuiThemeProvider theme={getMuiTheme()}>
            <MUIDataTable
              title="Outstanding"
              subtitle={'lorem ipsum dolor'}
              data={this.dataTable}
              columns={this.columns}
              options={options}
            />
          </MuiThemeProvider>
        </div>

        <div className="vertical-tab-content active">
          <form action="#">
            <div className={this.state.createClass}>
              <div className="padding-top-20px" />
              <div
                className="popup-content background-white border-radius"
                style={{ marginBottom: 10 }}
              >
                <div className="popup-panel grid grid-2x">
                  <div className="col-1">
                    <div className="popup-title">Outstanding - Create Form</div>
                  </div>
                  <div className="col-2 content-right">
                    <button
                      type="button"
                      className="btn btn-circle btn-grey"
                      onClick={this.openCreateForm}
                    >
                      <i className="fa fa-lg fa-times" />
                    </button>
                  </div>
                </div>

                {/* <div className="padding-15px border-bottom background-white grid grid-2x">

                      <div className="txt-site txt-12 txt-bold post-center">
                        OUTSTANDING - CREATE FORM
                      </div>

                    </div> */}
                <form action="#">
                  <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-15px">
                    <div className="column-1">
                      <div className="margin-bottom-20px">
                        <div className="margin-5px">
                          <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>Download Template</h4>
                          </div>
                        </div>
                        <button className="btn btn-grey">
                          <i className="fa fa-file-alt fa-3x" />
                        </button>
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
                          // disabled={this.props.type === "update" ? true : false}
                          data={[{ id: "1", title: "COP", value: "bs-1" }]}
                        />
                        {/*<select
                              className="cf-select slc slc-sekunder"
                            >
                              <option value="1">-- please select type --</option>
                              <option value="1">COP</option>
                            </select>*/}
                      </div>

                      <div className="margin-bottom-20px">
                        <div className="margin-5px">
                          <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>SK Reference</h4>
                          </div>
                        </div>
                        <DropDown
                          title="-- please select sk reference --"
                          onChange={dt => console.log(dt)}
                          // type="bizpar"
                          // disabled={this.props.type === "update" ? true : false}
                          data={[{ id: "1", title: "COP", value: "bs-1" }]}
                        />
                        {/*<select
                              className="cf-select slc slc-sekunder"
                            >
                              <option value="1">-- please select loan type --</option>
                              <option value="1">COP</option>
                            </select>*/}
                      </div>

                      <div className="margin-bottom-20px">
                        <div className="margin-5px">
                          <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>Effective Date</h4>
                          </div>
                        </div>
                        <CalendarPicker
                          // date={this.state.applicantDataDeficiency.weaknessDate}
                          disabled={this.props.type === "view" ? true : false}
                          onChange={e => {
                            console.log(e);
                          }}
                        />
                        {/* <input
                              style={{
                                width: "85%",
                                marginRight: 5
                              }
                              }

                              className="txt txt-sekunder-color"
                              type="date"
                              placeholder=""
                            >
                            </input> */}
                      </div>
                    </div>
                    <div className="column-2">
                      <div className="margin-bottom-20px">
                        <div className="margin-5px">
                          <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>Upload Excel</h4>
                          </div>
                        </div>

                        <div className="padding-15px">
                          <input
                            type="file"
                            id="upload-image"
                            style={{ display: "none" }}
                            onChange={this.handleChange}
                          />

                          <input
                            type="file"
                            id="upload-image"
                            style={{ display: "none" }}
                            onChange={this.handleChange}
                          />

                          <div className="upload-image">
                            <div className="u-i-info">
                              <div className="u-i-icon">
                                <i className="fa fa-lg fa-images" />
                              </div>
                              <div className="u-i-label">Upload a file</div>
                            </div>

                            <div
                              className="u-i-image image image-all"
                              style={{
                                backgroundImage: "url(" + this.state.file + ")"
                              }}
                            >
                              <div className="u-i-btn">
                                <label htmlFor="upload-image">
                                  <div className="btn btn-circle-div btn-green border-all">
                                    <i className="fa fa-lg fa-plus" />
                                  </div>
                                </label>
                                <button
                                  onClick={this.removeChange}
                                  type="button"
                                  className="btn btn-circle btn-red border-all"
                                >
                                  <i className="fa fa-lg fa-trash-alt" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="margin-bottom-20px">
                        <div className="margin-5px">
                          <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>Description</h4>
                          </div>
                        </div>
                        <div class="input-border form-group">
                          <textarea
                            class="form-control rounded-0"
                            type="text"
                            required
                            placeholder=""
                            cols="80"
                            rows="5"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="padding-15px">
                    <div className="grid grid-2x">
                      <div className="col-1" />
                      <div className="col-2 content-right">
                        <button
                          style={{ marginLeft: "15px" }}
                          className="btn btn-blue"
                          type="button"
                          onClick={() => this.handleUpdate()}
                        >
                          <span>DO IMPORT</span>
                        </button>
                        <button
                          style={{ marginLeft: "15px" }}
                          className="btn btn-primary"
                          type="button"
                          onClick={this.openCreateForm}
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
            <div className={this.state.printClass}>
              <div
                className="popup-content-mikro background-white border-radius post-center"
                style={{ marginBottom: 10 }}
              >
                <div className="popup-panel grid grid-2x">
                  <div className="col-1">
                    <div className="popup-title">Report Viewer</div>
                  </div>
                  <div
                    className="col-2 content-right"
                    style={{ marginTop: 10 }}
                  >
                    <i
                      className="fa fa-download"
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                </div>

                <div className="padding-15px background-white">
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

            {this.state.formMonitoringDetailViewVisible && (
              <div className={"app-popup app-popup-show"}>
                <div className="padding-top-20px" />
                <div
                  className="popup-content background-white border-radius"
                  style={{ marginBottom: 10 }}
                >
                  <div className="popup-panel grid grid-2x">
                    <div className="col-1">
                      <div className="popup-title">
                        Outstanding - Detail Form
                      </div>
                    </div>
                    <div className="col-2 content-right">
                      <button
                        type="button"
                        className="btn btn-circle btn-grey"
                        onClick={this.openMonitoringDetailView}
                      >
                        <i className="fa fa-lg fa-times" />
                      </button>
                    </div>
                  </div>

                  {/* <div className="padding-15px background-white border-bottom grid grid-2x">
                        <div className="txt-site txt-12 txt-bold post-center">
                          OUTSTANDING - DETAIL FORM
                        </div>
                      </div> */}

                  <div className="popup-content-grid">
                    <div className="popup-scroll popup-col-1">
                      <ul className="vertical-tab">
                        {this.state.tabMenu.map((data, index) => {
                          return this.opNavigator(data);
                        })}
                      </ul>
                    </div>

                    <div className="popup-scroll popup-col-2">
                      {/* General */}
                      {this.state.formOutstandingGeneralVisible && (
                        <FormOutstandingGeneral
                          type={"view"}
                          onClickClose={this.openMonitoringDetailView}
                          onClickSave={this.handleUpdate.bind(this)}
                        />
                      )}

                      {this.state.formOutstandingHistoryVisible && (
                        <FormOutstandingHistory
                          type={"view"}
                          onClickClose={this.openMonitoringDetailView}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="padding-bottom-20px" />
              </div>
            )}

            {this.state.formMonitoringDetailEditVisible && (
              <div className={"app-popup app-popup-show"}>
                <div className="padding-top-20px" />
                <div
                  className="popup-content background-white border-radius"
                  style={{ marginBottom: 10 }}
                >
                  <div className="popup-panel grid grid-2x">
                    <div className="col-1">
                      <div className="popup-title">Outstanding - Edit Form</div>
                    </div>
                    <div className="col-2 content-right">
                      <button
                        type="button"
                        className="btn btn-circle btn-grey"
                        onClick={this.openMonitoringDetailEdit}
                      >
                        <i className="fa fa-lg fa-times" />
                      </button>
                    </div>
                  </div>

                  {/* <div className="padding-15px background-white border-bottom grid grid-2x">
                        <div className="txt-site txt-12 txt-bold post-center">
                          OUTSTANDING - EDIT FORM
                        </div>
                      </div> */}

                  <div>
                    {/* <div className="popup-scroll popup-col-1">
                          <ul className="vertical-tab">
                          </ul>
                        </div> */}

                    <div>
                      {/* General */}
                      {this.state.formOutstandingGeneralVisible && (
                        <FormOutstandingGeneral
                          type={"edit"}
                          onClickClose={this.openMonitoringDetailEdit}
                          onClickSave={this.handleUpdate.bind(this)}
                        />
                      )}
                      {this.state.formOutstandingHistoryVisible && (
                        <FormOutstandingHistory
                          type={"edit"}
                          onClickClose={this.openMonitoringDetailEdit}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="padding-bottom-20px" />
              </div>
            )}

            {this.state.savePopUpVisible && (
              <PopUp
                type={"save"}
                class={"app-popup app-popup-show"}
                onClick={this.openSavePopUp}
              />
            )}

            {this.state.deletePopUpVisible && (
              <PopUp
                type={"delete"}
                class={"app-popup app-popup-show"}
                onClickDelete={this.handleDelete}
                onClick={this.openDeletePopup}
              />
            )}
          </form>
        </div>
      </div>
    );
  }
}

export default Outstanding;
