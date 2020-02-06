import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import FormInsGeneral from "../../../modules/forms/formLoan/formInsGeneral";

var ct = require("../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class FormOvertimeHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sppdData: props.sppdData,
      tabMenu: ["General"],
      editVisible: false,
      formVisible: false,
      createVisible: false
    };
  }

  openDetailForm = index => {
    let { formVisible } = this.state;
    this.setState({
      formVisible: !formVisible,
      selectedIndex: !formVisible ? index : null,
      activeTab: !formVisible ? "General" : "",
      formGeneralVisible: !formVisible ? true : false
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
      formGeneralVisible: !editVisible ? true : false
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

  columnsHistory = [
    "No",
    "NIK",
    "Employee Name",
    "Component",
    "Total",
    "Subsidion",
    "Subsidion Amount",
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return this.props.type !== "view" ? (
            <div>
              <button
                type="button"
                className="btn btn-blue btn-small-circle"
                onClick={() => this.openEditForm(tableMeta.rowIndex)}
              >
                <i className="fa fa-lw fa-pencil-alt" />
              </button>
              <button
                type="button"
                className="btn btn-red btn-small-circle"
                onClick={this.props.onClickDelete}
              >
                <i className="fa fa-lw fa-trash-alt" />
              </button>
              <button
                type="button"
                className="btn btn-blue btn-small-circle"
                onClick={() => this.openDetailForm(tableMeta.rowIndex)}
              >
                <i className="fa fa-lw fa-ellipsis-v" />
              </button>
            </div>
          ) : null;
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
      default:
        break;
    }
    this.setState(allStateVisibleFalse);
  };

  dataHistory = [
    [
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
        <form action="#">
          <div className="border-bottom padding-15px">
            <div className="content-right padding-bottom-10px">
              {this.props.type === "view" ? (
                ""
              ) : (
                <button
                  className="btn btn-circle background-blue"
                  onClick={this.props.onClickPlus}
                >
                  <i className="fa fa-lg fa-plus" />
                </button>
              )}
            </div>
            <MuiThemeProvider theme={getMuiTheme()}>
              <MUIDataTable
                data={this.dataHistory}
                columns={this.columnsHistory}
                options={options}
              />
            </MuiThemeProvider>
          </div>
          <div className="padding-15px">
            <div className="grid grid-2x">
              <div className="col-1" />
              <div className="col-2 content-right">
                {this.props.type === "update" ? (
                  <button
                    style={{ marginLeft: "15px" }}
                    className="btn btn-blue"
                    type="button"
                    onClick={() => {
                      this.props.onClickSave();
                    }}
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
                    <FormInsGeneral
                      // leaveData={rawData[selectedIndex]}
                      onClickClose={this.openCreateForm}
                      onClickSave={this.props.onClickSave2}
                      type={"create"}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {this.state.formVisible && (
          <div className={"app-popup app-popup-show"}>
            <div className="padding-top-20px" />
            <div
              className="popup-content background-white border-radius"
              style={{ marginBottom: 10 }}
            >
              <div className="popup-panel grid grid-2x">
                <div className="col-1">
                  <div className="popup-title">Detail - View Form</div>
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
                  {this.state.formVisible && (
                    <FormInsGeneral
                      type={"view"}
                      onClickClose={this.openDetailForm}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="padding-bottom-20px" />
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
                  <div className="popup-title">Deatil - Edit Form</div>
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
                    <FormInsGeneral
                      // leaveData={rawData[selectedIndex]}
                      onClickClose={this.openEditForm}
                      onClickSave={this.props.onClickSave2}
                      type={"update"}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default FormOvertimeHistory;
