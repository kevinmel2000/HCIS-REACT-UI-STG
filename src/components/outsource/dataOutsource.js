import React, { Component } from "react";
import PopUp from "../../components/pages/PopUpAlert";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import FormCreateDO from "../../modules/forms/formOutsource/formDataOutsource/formCreateDO";
import FormDetailDO from "../../modules/forms/formOutsource/formDataOutsource/formDetailDO";
import FormOrgDO from "../../modules/forms/formOutsource/formDataOutsource/formOrgDO";
import FormEduDO from "../../modules/forms/formOutsource/formDataOutsource/formEduDO";
import FormOTDO from "../../modules/forms/formOutsource/formDataOutsource/formOTDO";
import FormIdentityDO from "../../modules/forms/formOutsource/formDataOutsource/formIdentityDO";
import FormPayroll from "../../modules/forms/formOutsource/formDataOutsource/formPayroll";
import FormMedical from "../../modules/forms/formOutsource/formDataOutsource/formMedical";

var ct = require("../../modules/custom/customTable");

class DataOutsource extends Component {
  constructor(props) {
    super(props);
    this.state = {
      savePopUpVisible: false,
      confirmPopUpVisible: false,
      deletePopUpVisible: false,
      createPopUpVisible: false,

      createVisible: false,
      viewVisible: false,
      editVisible: false,

      formDetailVisible: false,
      formIdentityVisible: false,
      formOSVisible: false,
      formPayrollVisible: false,
      formMCUVisible: false,
      formOTVisible: false,
      formFormalEduVisible: false,

      activeTab: "",
      tabMenu: [
        "Detail",
        "Identity",
        "Organization Structure",
        "Payroll",
        "Medical Check Up",
        "Official Travel",
        "Formal Education"
      ]
    };
  }

  openCreate = index => {
    this.setState({
      createVisible: !this.state.createVisible,
      selectedIndex: index
    });
  };

  openEdit = index => {
    let { editVisible } = this.state;
    this.setState({
      editVisible: !editVisible,
      selectedIndex: !editVisible ? index : null,
      activeTab: !editVisible ? "Detail" : "",
      formDetailVisible: !editVisible ? true : false,
      formIdentityVisible: false,
      formOSVisible: false,
      formPayrollVisible: false,
      formMCUVisible: false,
      formOTVisible: false,
      formFormalEduVisible: false
    });
  };

  openView = index => {
    let { viewVisible } = this.state;
    this.setState({
      viewVisible: !viewVisible,
      selectedIndex: !viewVisible ? index : null,
      activeTab: !viewVisible ? "Detail" : "",
      formDetailVisible: !viewVisible ? true : false,
      formIdentityVisible: false,
      formOSVisible: false,
      formPayrollVisible: false,
      formMCUVisible: false,
      formOTVisible: false,
      formFormalEduVisible: false
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
      formDetailVisible: false,
      formIdentityVisible: false,
      formOSVisible: false,
      formPayrollVisible: false,
      formMCUVisible: false,
      formOTVisible: false,
      formFormalEduVisible: false,
      activeTab: title
    };

    switch (title) {
      case "Detail":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formDetailVisible: true
        };
        break;
      case "Identity":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formIdentityVisible: true
        };
        break;
      case "Organization Structure":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formOSVisible: true
        };
        break;
      case "Payroll":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formPayrollVisible: true
        };
        break;
      case "Medical Check Up":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formMCUVisible: true
        };
        break;
      case "Official Travel":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formOTVisible: true
        };
        break;
      case "Formal Education":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formFormalEduVisible: true
        };
        break;
      default:
        break;
    }
    this.setState(allStateVisibleFalse);
  };

  getMuiTheme = () => createMuiTheme(ct.customTable());

  options = ct.customOptions();

  columns = [
    "No",
    "NIK",
    "Employee Name",
    "Vendor Name",
    "Gender",
    "Join Date",
    {
      name: <div style={{ float: "center" }}>Working Type</div>,
      options: {
        filter: false,
        customHeadRender: columnMeta => (
          <th
            key={3}
            style={{
              cursor: "pointer",
              backgroundColor: "#F6F6F6",
              color: "#555555",
              fontSize: 13,
              fontWeight: 1
            }}
          >
            <div style={{ borderBottom: "1px rgba(0,0,0,0.1) solid" }}>
              {columnMeta.name}
            </div>
            <div
              className="grid grid-2x"
              style={{
                backgroundColor: "#F6F6F6",
                color: "#555555",
                fontSize: 13,
                fontWeight: 1
              }}
            >
              <div className="col-1">{"Type"}</div>
              <div className="col-2">{"Category"}</div>
            </div>
          </th>
        ),
        customBodyRender: val => {
          return (
            <div>
              <div className="grid grid-2x content-center">
                <div className="col-1">{val}</div>
                <div className="col-2">{val}</div>
              </div>
            </div>
          );
        }
      }
    },
    {
      name: <div style={{ float: "center" }}>Training Detail</div>,
      options: {
        filter: false,
        customHeadRender: columnMeta => (
          <th
            key={3}
            style={{
              cursor: "pointer",
              backgroundColor: "#F6F6F6",
              color: "#555555",
              fontSize: 13,
              fontWeight: 1
            }}
          >
            <div style={{ borderBottom: "1px rgba(0,0,0,0.1) solid" }}>
              {columnMeta.name}
            </div>
            <div
              className="grid grid-4x"
              style={{
                backgroundColor: "#F6F6F6",
                color: "#555555",
                fontSize: 13,
                fontWeight: 1
              }}
            >
              <div className="col-1">{"Position"}</div>
              <div className="col-2">{"Branch"}</div>
              <div className="col-3">{"Effective Date Start"}</div>
              <div className="col-4">{"Effective Date Finish"}</div>
            </div>
          </th>
        ),
        customBodyRender: val => {
          return (
            <div>
              <div className="grid grid-4x content-center">
                <div className="col-1">{val}</div>
                <div className="col-2">{val}</div>
                <div className="col-3">{val}</div>
                <div className="col-4">{val}</div>
              </div>
            </div>
          );
        }
      }
    },
    "Active Status",
    "End Date",
    {
      name: "",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              <button
                type="button"
                className="btn btn-blue btn-small-circle"
                style={{ margin: 5 }}
                onClick={() => this.openEdit(tableMeta.rowIndex)}
              >
                <i className="fas fa-lw fa-pencil-alt" />
              </button>
              <button
                type="button"
                className="btn btn-blue btn-small-circle"
                style={{ margin: 5 }}
                onClick={() => this.openView(tableMeta.rowIndex)}
              >
                <i className="fas fa-lw fa-ellipsis-v" />
              </button>
            </div>
          );
        }
      }
    }
  ];

  dataTable = [
    ["1", "02312093829", "10002132", "23098123", "32312", "Rencana"]
  ];

  render() {
    return (
      <div className="main-content">
        <div className="padding-5px">
          <div className="col-2 content-right">
            <button
              type="button"
              className="btn btn-circle background-blue"
              onClick={() =>
                this.openCreate()
              }
            >
              <i className="fa fa-plus" />
            </button>
          </div>
        </div>
        <div className="padding-5px">
          <MuiThemeProvider theme={this.getMuiTheme()}>
            <MUIDataTable
              title='Data Outsource'
              data={this.dataTable}
              columns={this.columns}
              options={this.options}
            />
          </MuiThemeProvider>
        </div>

        {this.state.createVisible && (
          <FormCreateDO
            onClickSave={this.handleUpdate}
            onClickClose={this.openCreate}
          />
        )}

        {this.state.viewVisible && (
          <div className={"app-popup app-popup-show"}>
            <div className="padding-top-20px" />
            <div className="popup-content background-white border-radius">
              <div className="popup-panel grid grid-2x">
                <div className="col-1">
                  <div className="popup-title">
                    Outsource - Data Outsource - View Form
                        </div>
                </div>
                <div className="col-2 content-right">
                  <button
                    type="button"
                    className="btn btn-circle btn-grey"
                    onClick={this.openView}
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
                  {this.state.formDetailVisible && (
                    <FormDetailDO
                      onClickSave={this.handleUpdate}
                      onClickClose={this.openView}
                      type={"view"}
                    />
                  )}
                  {this.state.formIdentityVisible && (
                    <FormIdentityDO
                      onClickSave={this.handleUpdate}
                      onClickClose={this.openView}
                      type="view"
                    />
                  )}
                  {this.state.formOSVisible && (
                    <FormOrgDO onClickClose={this.openView} type="view" />
                  )}

                  {this.state.formPayrollVisible && (
                    <FormPayroll
                      onClickClose={this.openView}
                      type={"view"}
                    />
                  )}

                  {this.state.formMCUVisible && (
                    <FormMedical
                      onClickClose={this.openView}
                      type={"view"}
                    />
                  )}

                  {this.state.formOTVisible && (
                    <FormOTDO
                      onClickSave={this.handleUpdate}
                      onClickClose={this.openView}
                      onClickDelete={this.openDeletePopup}
                      type="view"
                    />
                  )}

                  {this.state.formFormalEduVisible && (
                    <FormEduDO onClickClose={this.openView} type="view" />
                  )}
                </div>
              </div>
            </div>
            <div className="padding-bottom-20px" />
          </div>
        )}

        {this.state.editVisible && (
          <div className={"app-popup app-popup-show"}>
            <div className="padding-top-20px" />
            <div className="popup-content background-white border-radius">
              <div className="popup-panel grid grid-2x">
                <div className="col-1">
                  <div className="popup-title">
                    Outsource - Data Outsource - Detail
                        </div>
                </div>
                <div className="col-2 content-right">
                  <button
                    type="button"
                    className="btn btn-circle btn-grey"
                    onClick={this.openEdit}
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
                  {this.state.formDetailVisible && (
                    <FormDetailDO
                      onClickSave={this.handleUpdate}
                      onClickClose={this.openEdit}
                      type={"update"}
                    />
                  )}

                  {this.state.formIdentityVisible && (
                    <FormIdentityDO
                      onClickSave={this.handleUpdate}
                      onClickClose={this.openEdit}
                      type={"update"}
                    />
                  )}

                  {this.state.formOSVisible && (
                    <FormOrgDO
                      onClickClose={this.openEdit}
                      type={"update"}
                    />
                  )}

                  {this.state.formPayrollVisible && (
                    <FormPayroll
                      onClickClose={this.openEdit}
                      type={"update"}
                    />
                  )}
                  {this.state.formMCUVisible && (
                    <FormMedical
                      onClickClose={this.openEdit}
                      type={"update"}
                    />
                  )}

                  {this.state.formOTVisible && (
                    <FormOTDO
                      onClickSave={this.handleUpdate}
                      onClickClose={this.openEdit}
                      onClickDelete={this.openDeletePopup}
                      type={"update"}
                    />
                  )}
                  {this.state.formFormalEduVisible && (
                    <FormEduDO
                      onClickClose={this.openEdit}
                      type={"update"}
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
      </div>
    );
  }
}

export default DataOutsource;
