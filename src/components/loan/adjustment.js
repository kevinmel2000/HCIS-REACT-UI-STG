import React, { Component } from "react";
import PopUp from "../../components/pages/PopUpAlert";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import FormAdjustmentGeneral from "../../modules/forms/formLoan/formAdjustmentGeneral";
import FormAdjustmentHistory from "../../modules/forms/formLoan/formAdjustmentHistory";

var ct = require("../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class Adjustment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      savePopUpVisible: false,
      deletePopUpVisible: false,
      createPopUpVisible: false,

      formMonitoringDetailCreateVisible: false,
      formMonitoringDetailViewVisible: false,
      formMonitoringDetailEditVisible: false,

      formAdjustmentGeneralVisible: false,
      formAdjustmentHistoryVisible: false,
      activeTab: "",
      tabMenu: ["General", "History"],
      tabMenuEdit: ["General", "Detail", "History"]
    };
  }

  openMonitoringDetailCreate = index => {
    let { formMonitoringDetailCreateVisible } = this.state;
    this.setState({
      formMonitoringDetailCreateVisible: !formMonitoringDetailCreateVisible,
      selectedIndex: !formMonitoringDetailCreateVisible ? index : null,
      activeTab: !formMonitoringDetailCreateVisible ? "General" : "",
      formAdjustmentGeneralVisible: !formMonitoringDetailCreateVisible
        ? true
        : false
    });
  };

  openMonitoringDetailView = index => {
    let { formMonitoringDetailViewVisible } = this.state;
    this.setState({
      formMonitoringDetailViewVisible: !formMonitoringDetailViewVisible,
      selectedIndex: !formMonitoringDetailViewVisible ? index : null,
      activeTab: !formMonitoringDetailViewVisible ? "General" : "",
      formAdjustmentGeneralVisible: !formMonitoringDetailViewVisible
        ? true
        : false,
      formAdjustmentHistoryVisible: false
    });
  };

  openMonitoringDetailEdit = index => {
    let { formMonitoringDetailEditVisible } = this.state;
    this.setState({
      formMonitoringDetailEditVisible: !formMonitoringDetailEditVisible,
      selectedIndex: !formMonitoringDetailEditVisible ? index : null,
      activeTab: !formMonitoringDetailEditVisible ? "General" : "",
      formAdjustmentGeneralVisible: !formMonitoringDetailEditVisible
        ? true
        : false,
      formAdjustmentHistoryVisible: false
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
      formAdjustmentGeneralVisible: false,
      formAdjustmentHistoryVisible: false,
      activeTab: title
    };

    switch (title) {
      case "General":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formAdjustmentGeneralVisible: true
        };
        break;
      case "History":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formAdjustmentHistoryVisible: true
        };
        break;
      default:
        break;
    }
    this.setState(allStateVisibleFalse);
  };

  columns = [
    "No",
    "Request Number",
    "Request By",
    "Reference Number",
    "Loan Type",
    "Adjustment Type",
    "Employee Name",
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
      "ADJCL00193829",
      "LILLY Create date : 30/08/2019",
      "CL00198123",
      "COP",
      "PELUNASAN",
      "ERIC",
      "Plan",
      "Plan"
    ],
    [
      "2",
      "ADJCL00193829",
      "LILLY Create date : 30/08/2019",
      "CL00198123",
      "COP",
      "PELUNASAN",
      "ERIC",
      "Approved",
      "Approved"
    ]
  ];

  render() {
    return (
      <div className="main-content">
        {/* <div className="c-n-top">
              <div className="padding-1px grid grid-2x ">
                <div className="col-1">
                  <div className="txt-site txt-18 txt-bold txt-main padding-top-5px">
                    LOAN - ADJUSTMENT
                  </div>
                </div>
              </div>
            </div> */}
        <div className="padding-5px">
          <div className="col-2 content-right">
            <button
              type="button"
              className="btn btn-circle background-blue"
              onClick={this.openMonitoringDetailCreate.bind(this)}
            >
              <i className="fa fa-plus" />
            </button>
          </div>
        </div>

        <div className="padding-5px">
          <MuiThemeProvider theme={getMuiTheme()}>
            <MUIDataTable
              title="Adjustment"
              subtitle={'lorem ipsum dolor'}
              data={this.dataTable}
              columns={this.columns}
              options={options}
            />
          </MuiThemeProvider>
        </div>
        <div className="vertical-tab-content active">
          <form action="#">
            {this.state.formMonitoringDetailCreateVisible && (
              <div className={"app-popup app-popup-show"}>
                <div className="padding-top-20px" />
                <div
                  className="popup-content background-white border-radius"
                  style={{ marginBottom: 10 }}
                >
                  <div className="popup-panel">
                    <div className="popup-title">Adjustment - Create Form</div>
                  </div>
                  <div className="popup-content-grid">
                    <div className="popup-scroll popup-col-1">
                      <ul className="vertical-tab"></ul>
                    </div>
                    <div className="popup-scroll popup-col-2">
                      {/* General */}
                      {this.state.formAdjustmentGeneralVisible && (
                        <FormAdjustmentGeneral
                          type={"create"}
                          onClickClose={this.openMonitoringDetailCreate}
                          onClickSave={this.handleUpdate.bind(this)}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="padding-bottom-20px" />
              </div>
            )}

            {this.state.formMonitoringDetailViewVisible && (
              <div className={"app-popup app-popup-show"}>
                <div className="padding-top-20px" />
                <div
                  className="popup-content background-white border-radius"
                  style={{ marginBottom: 10 }}
                >
                  <div className="popup-panel">
                    <div className="popup-title">Adjustment - View Form</div>
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
                      {this.state.formAdjustmentGeneralVisible && (
                        <FormAdjustmentGeneral
                          type={"view"}
                          onClickClose={this.openMonitoringDetailView}
                          onClickSave={this.handleUpdate.bind(this)}
                        />
                      )}
                      {this.state.formAdjustmentHistoryVisible && (
                        <FormAdjustmentHistory
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
                  <div className="popup-panel">
                    <div className="popup-title">Adjustment - Edit Form</div>
                  </div>
                  <div className="popup-content-grid">
                    <div className="popup-scroll popup-col-1">
                      <ul className="vertical-tab"></ul>
                    </div>

                    <div className="popup-scroll popup-col-2">
                      {/* General */}
                      {this.state.formAdjustmentGeneralVisible && (
                        <FormAdjustmentGeneral
                          type={"edit"}
                          onClickClose={this.openMonitoringDetailEdit}
                          onClickSave={this.handleUpdate.bind(this)}
                        />
                      )}

                      {this.state.formAdjustmentHistoryVisible && (
                        <FormAdjustmentHistory
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

export default Adjustment;
