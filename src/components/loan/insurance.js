import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import LoadingBar from "react-top-loading-bar";
import PopUp from "../pages/PopUpAlert";
import FormInsGeneral from "../../modules/forms/formLoan/formInsGeneral";
import FormInsGeneralEdt from "../../modules/forms/formLoan/formInsGeneralEd";
import FormInsDetail from "../../modules/forms/formLoan/FormInsDetail";
import FormInsHistory from "../../modules/forms/formLoan/formInsHistory";

var ct = require("../../modules/custom/customTable");

class Insurance extends Component {
  constructor() {
    super();
    this.state = {
      selectedIndex: null,
      rawData: [],
      dataTableLad: [],
      dataTableDoc: [],
      createVisible: false,
      createEditVisible: false,
      editVisible: false,
      formVisible: false,
      formGeneralVisible: false,
      formDetailVisible: false,
      formHistoryVisible: false,
      deletePopUpVisible: false,
      activeTab: "",
      tabMenu: ["General"],
      tabMenu2: ["General", "Detail"],
      tabMenu3: ["General", "Detail", "History"],
      createClass: "app-popup",
      type: "create",
      updateClass: "app-popup",
      saveClass: "app-popup",
      deleteClass: "app-popup"
    };
  }

  handleDelete = () => {
    this.setState({ deletePopUpVisible: false });
  };

  openDeletePopup = index => {
    this.setState({
      deletePopUpVisible: !this.state.deletePopUpVisible,
      selectedIndex: index
    });
  };

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

  openCreateFormEdit = index => {
    let { createEditVisible } = this.state;
    this.setState({
      type: "create",
      createEditVisible: !createEditVisible,
      selectedIndex: !createEditVisible ? index : null,
      activeTab: !createEditVisible ? "General" : "",
      formGeneralVisible: !createEditVisible ? true : false,
      formDetailVisible: false,
      formHistoryVisible: false,
      editVisible: false
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
        this.state.editVisible) ||
      (this.state.saveClass === "app-popup app-popup-show" &&
        this.state.createEditVisible)
    ) {
      this.setState({
        saveClass: "app-popup",
        createEditVisible: false,
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

  getMuiTheme = () => createMuiTheme(ct.customTable());

  options = ct.customOptions();
  columns = [
    "No",
    {
      name: "Request By",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => this.openDetailForm(tableMeta.rowIndex)}
              >
                {val}
              </div>
            </div>
          );
        }
      }
    },
    "Loan Type",
    "Loan Name",
    "Loan Number",
    "Asurance Type",
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
                      : val === "Process"
                      ? "orange"
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
      case "Detail":
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
    ["1", "Lily", "COP", "Anwar", "C001", "", "Approved", "Approved"],
    ["1", "Lily", "COP", "Anwar", "C001", "", "Rejected", "Rejected"],
    ["1", "Lily", "COP", "Anwar", "C001", "", "Process", "Process"],
    ["2", "Lily", "COP", "Joko", "C002", "", "Plan", "Plan"]
  ];

  render() {
    let { rawData, selectedIndex } = this.state;
    return (
      <div className="main-content">
        <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
        <div className="padding-5px grid grid-2x">
          <div className="col-1">
            <div className="txt-site txt-18 txt-bold txt-main padding-top-5px">
              {/* Loan - Insurance */}
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
              title="Insurance"
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
                  <div className="popup-title">Insurance - Detail</div>
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
                    {this.state.tabMenu3.map((data, index) => {
                      return this.opNavigator(data, index);
                    })}
                  </ul>
                </div>
                <div className="col-2">
                  {this.state.formGeneralVisible && (
                    <FormInsGeneralEdt
                      leaveData={rawData[selectedIndex]}
                      onClickClose={this.openDetailForm}
                      onClickSave={this.openSavePopUp}
                      type={"view"}
                    />
                  )}

                  {this.state.formDetailVisible && (
                    <FormInsDetail
                      leaveData={rawData[selectedIndex]}
                      onClickClose={this.openDetailForm}
                      onClickSave={this.openSavePopUp}
                      type={"view"}
                    />
                  )}

                  {this.state.formHistoryVisible && (
                    <FormInsHistory
                      leaveData={rawData[selectedIndex]}
                      onClickClose={this.openDetailForm}
                      onClickSave={this.openSavePopUp}
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
                  <div className="popup-title">Insurance - Create Form</div>
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

              <div className="popup-content-grid">
                <div className="popup-scroll popup-col-1">
                  <ul className="vertical-tab">
                    {this.state.tabMenu.map((data, index) => {
                      return this.opNavigator(data, index);
                    })}
                  </ul>
                </div>
                <div className="popup-scroll popup-col-2">
                  {this.state.formGeneralVisible && (
                    <FormInsGeneral
                      leaveData={rawData[selectedIndex]}
                      onClickClose={this.openCreateForm}
                      onClickSave={this.openSavePopUp}
                      type={"create"}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {this.state.createEditVisible && (
          <div className="app-popup app-popup-show">
            <div className="padding-top-20px" />
            <div
              className="popup-content background-white border-radius"
              style={{ marginBottom: 10 }}
            >
              <div className="popup-panel grid grid-2x">
                <div className="col-1">
                  <div className="popup-title">Insurance - Create Form</div>
                </div>
                <div className="col-2 content-right">
                  <button
                    className="btn btn-circle btn-grey"
                    onClick={this.openCreateFormEdit}
                  >
                    <i className="fa fa-lg fa-times" />
                  </button>
                </div>
              </div>

              <div className="popup-content-grid">
                <div className="popup-scroll popup-col-1">
                  <ul className="vertical-tab">
                    {this.state.tabMenu.map((data, index) => {
                      return this.opNavigator(data, index);
                    })}
                  </ul>
                </div>
                <div className="popup-scroll popup-col-2">
                  {this.state.formGeneralVisible && (
                    <FormInsGeneral
                      leaveData={rawData[selectedIndex]}
                      onClickClose={this.openCreateFormEdit}
                      onClickSave={this.openSavePopUp}
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
                  <div className="popup-title">Insurance - Edit Form</div>
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

              <div className="popup-content-grid">
                <div className="popup-scroll popup-col-1">
                  <ul className="vertical-tab">
                    {this.state.tabMenu2.map((data, index) => {
                      return this.opNavigator(data, index);
                    })}
                  </ul>
                </div>
                <div className="popup-scroll popup-col-2">
                  {this.state.formGeneralVisible && (
                    <FormInsGeneralEdt
                      type={"update"}
                      leaveData={rawData[selectedIndex]}
                      onClickClose={this.openEditForm}
                      onClickSave={this.openSavePopUp}
                    />
                  )}
                  {this.state.formDetailVisible && (
                    <FormInsDetail
                      leaveData={rawData[selectedIndex]}
                      onClickClose={this.openEditForm}
                      onClickPlus={this.openCreateFormEdit}
                      onClickSave={this.openSavePopUp}
                      onClickSave2={this.openSavePopUp}
                      onClickDelete={this.openDeletePopup}
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

        {this.state.deletePopUpVisible && (
          <PopUp
            type={"delete"}
            class={"app-popup app-popup-show"}
            onClickDelete={this.handleDelete}
            onClick={this.openDeletePopup}
          />
        )}
      </div>
    );
  }
}

export default Insurance;
