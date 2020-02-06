import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import LoadingBar from "react-top-loading-bar";
import PopUp from "../pages/PopUpAlert";
import FormRbiGeneral from "../../modules/forms/formLoan/formRbiGenereal";
import FormRbiDetail from "../../modules/forms/formLoan/formRbiDetail";
import FormRbiHistory from "../../modules/forms/formLoan/formRbiHistory";

var ct = require("../../modules/custom/customTable");

class Rbi extends Component {
  constructor() {
    super();
    this.state = {
      selectedIndex: null,
      rawData: [],
      dataTableLad: [],
      dataTableDoc: [],
      createVisible: false,
      editVisible: false,
      formVisible: false,
      formGeneralVisible: false,
      formDetailVisible: false,
      formHistoryVisible: false,
      activeTab: "",
      tabMenu: ["General", "Detail Table"],
      tabMenu2: ["General", "Detail Table", "History"],
      createClass: "app-popup",
      type: "create",
      updateClass: "app-popup",
      saveClass: "app-popup",
      deleteClass: "app-popup"
    };
  }

  openDetailForm = index => {
    let { formVisible } = this.state;
    this.setState({
      formVisible: !formVisible,
      selectedIndex: !formVisible ? index : null,
      activeTab: !formVisible ? "General" : "",
      formGeneralVisible: !formVisible ? true : false,
      formDetailVisible: false,
      formHistoryVisible: false
    });
  };

  openCreateForm = index => {
    let { createVisible } = this.state;
    this.setState({
      createVisible: !createVisible,
      selectedIndex: !createVisible ? index : null,
      activeTab: !createVisible ? "General" : "",
      formGeneralVisible: !createVisible ? true : false,
      formDetailVisible: false,
      formHistoryVisible: false
    });
  };

  openEditForm = index => {
    let { editVisible } = this.state;
    this.setState({
      editVisible: !editVisible,
      selectedIndex: !editVisible ? index : null,
      activeTab: !editVisible ? "General" : "",
      formGeneralVisible: !editVisible ? true : false,
      formDetailVisible: false,
      formHistoryVisible: false
    });
  };

  openSavePopUp = () => {
    if (
      (this.state.saveClass === "app-popup app-popup-show" &&
        this.state.createVisible) ||
      (this.state.saveClass === "app-popup app-popup-show" &&
        this.state.editVisible)
    ) {
      this.setState({
        saveClass: "app-popup",
        deleteClass: "app-popup",
        createVisible: false,
        editVisible: false,
        formGeneralVisible: false,
        formDetailVisible: false,
        formHistoryVisible: false
      });
    } else {
      this.setState({ saveClass: "app-popup app-popup-show" });
    }
  };

  openDeletePopup = index => {
    if (this.state.deleteClass === "app-popup app-popup-show") {
      this.setState({ deleteClass: "app-popup", selectedIndex: null });
    } else {
      this.setState({
        deleteClass: "app-popup app-popup-show",
        selectedIndex: index
      });
    }
  };

  getMuiTheme = () => createMuiTheme(ct.customTable());

  options = ct.customOptions();
  columns = [
    "No",
    "Request By",
    "SK Reference",
    "Loan Type",
    "New Bank Interest",
    "Effective Date",
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
                  onClick={() => this.openEditForm(tableMeta.rowIndex)}
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
              {val !== "Plan" ? (
                <button
                  type="button"
                  className="btn btn-blue btn-small-circle"
                  onClick={() => this.openDetailForm()}
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
      formGeneralVisible: false,
      formDetailVisible: false,
      formHistoryVisible: false,
      activeTab: title
    };
    switch (title) {
      case "General":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formGeneralVisible: true
        };
        break;
      case "Detail Table":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formDetailVisible: true
        };
        break;
      case "History":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formHistoryVisible: true
        };
        break;
      default:
        break;
    }
    this.setState(allStateVisibleFalse);
  };

  data = [
    [
      "1",
      "Ibu Lily",
      "005",
      "COP",
      "C001",
      "30/08/2019",
      "Approved",
      "Approved"
    ],
    ["1", "Ibu Lily", "005", "COP", "C001", "30/08/2019", "Revised", "Revised"],
    [
      "1",
      "Ibu Lily",
      "005",
      "COP",
      "C001",
      "30/08/2019",
      "Rejected",
      "Rejected"
    ],
    ["2", "Ibu Lily", "001", "COP", "C002", "30/07/2019", "Plan", "Plan"]
  ];

  render() {
    let { rawData, selectedIndex } = this.state;
    return (
      <div className="main-content">
        <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
        <div className="padding-5px grid grid-2x">
          <div className="col-1">
            <div className="txt-site txt-18 txt-bold txt-main padding-top-5px">
              {/* Loan - Review of Bank Interest */}
            </div>
          </div>
          <div className="col-2 content-right">
            <button
              type="button"
              className="btn btn-circle background-blue"
              onClick={() => this.openCreateForm()}
            >
              <i className="fa fa-1x fa-plus" />
            </button>
          </div>
        </div>
        <div className="padding-5px">
          <MuiThemeProvider theme={this.getMuiTheme()}>
            <MUIDataTable
              title="Review of Bank Interest"
              subtitle={'lorem ipsum dolor'}
              data={this.data}
              columns={this.columns}
              options={this.options}
            />
          </MuiThemeProvider>
        </div>

        {this.state.formVisible && (
          <div className="app-popup app-popup-show">
            <div className="padding-top-20px" />
            <div
              className="popup-content background-white border-radius"
              style={{ marginBottom: 10 }}
            >
              <div className="popup-panel grid grid-2x">
                <div className="col-1">
                  <div className="popup-title">
                    Review of Bank Interest - Detail
                  </div>
                </div>
                <div className="col-2 content-right">
                  <button
                    className="btn btn-circle btn-grey"
                    onClick={this.openDetailForm}
                  >
                    <i className="fa fa-lg fa-times" />
                  </button>
                </div>
              </div>

              <div className="grid grid-2x-col7 gap-10px">
                <div className="col-1">
                  <ul className="vertical-tab">
                    {this.state.tabMenu2.map((data, index) => {
                      return this.opNavigator(data, index);
                    })}
                  </ul>
                </div>
                <div className="col-2">
                  {this.state.formGeneralVisible && (
                    <FormRbiGeneral
                      leaveData={rawData[selectedIndex]}
                      onClickClose={this.openDetailForm}
                      onClickSave={this.openSavePopUp}
                      type={"view"}
                    />
                  )}

                  {this.state.formDetailVisible && (
                    <FormRbiDetail
                      leaveData={rawData[selectedIndex]}
                      onClickClose={this.openDetailForm}
                      // onClickSave={this.openSavePopUp}
                      type={"view"}
                    />
                  )}

                  {this.state.formHistoryVisible && (
                    <FormRbiHistory
                      leaveData={rawData[selectedIndex]}
                      onClickClose={this.openDetailForm}
                      type={"view"}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {this.state.createVisible && (
          <div className="app-popup app-popup-show">
            <div className="padding-top-20px" />
            <div
              className="popup-content background-white border-radius"
              style={{ marginBottom: 10 }}
            >
              <div className="popup-panel grid grid-2x">
                <div className="col-1">
                  <div className="popup-title">
                    Review of Bank Interest - Create Form
                  </div>
                </div>
                <div className="col-2 content-right">
                  <button
                    className="btn btn-circle btn-grey"
                    onClick={this.openCreateForm}
                  >
                    <i className="fa fa-lg fa-times" />
                  </button>
                </div>
              </div>

              <div className="grid grid-2x-col7 gap-10px">
                <div className="col-1">
                  <ul className="vertical-tab">
                    {this.state.tabMenu.map((data, index) => {
                      return this.opNavigator(data, index);
                    })}
                  </ul>
                </div>
                <div className="col-2">
                  {this.state.formGeneralVisible && (
                    <FormRbiGeneral
                      leaveData={rawData[selectedIndex]}
                      onClickClose={this.openCreateForm}
                      onClickSave={this.openSavePopUp}
                      type={"create"}
                    />
                  )}

                  {this.state.formDetailVisible && (
                    <FormRbiDetail
                      leaveData={rawData[selectedIndex]}
                      onClickClose={this.openCreateForm}
                      // onClickSave={this.openSavePopUp}
                      type={"create"}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {this.state.editVisible && (
          <div className="app-popup app-popup-show">
            <div className="padding-top-20px" />
            <div
              className="popup-content background-white border-radius"
              style={{ marginBottom: 10 }}
            >
              <div className="popup-panel grid grid-2x">
                <div className="col-1">
                  <div className="popup-title">
                    Review of Bank Interest - Edit Form
                  </div>
                </div>
                <div className="col-2 content-right">
                  <button
                    className="btn btn-circle btn-grey"
                    onClick={this.openEditForm}
                  >
                    <i className="fa fa-lg fa-times" />
                  </button>
                </div>
              </div>

              <div className="grid grid-2x-col7 gap-10px">
                <div className="col-1">
                  <ul className="vertical-tab">
                    {this.state.tabMenu.map((data, index) => {
                      return this.opNavigator(data, index);
                    })}
                  </ul>
                </div>
                <div className="col-2">
                  {this.state.formGeneralVisible && (
                    <FormRbiGeneral
                      leaveData={rawData[selectedIndex]}
                      onClickClose={this.openEditForm}
                      onClickSave={this.openSavePopUp}
                      type={"update"}
                    />
                  )}

                  {this.state.formDetailVisible && (
                    <FormRbiDetail
                      leaveData={rawData[selectedIndex]}
                      onClickClose={this.openEditForm}
                      // onClickSave={this.openSavePopUp}
                      type={"update"}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <PopUp
          type={"save"}
          class={this.state.saveClass}
          onClick={this.openSavePopUp}
        />

        <PopUp
          type={"delete"}
          class={this.state.deleteClass}
          onClickDelete={this.handleDelete}
          onClick={this.openDeletePopup}
        />
      </div>
    );
  }
}

export default Rbi;
