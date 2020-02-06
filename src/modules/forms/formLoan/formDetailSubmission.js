import React, { Component } from "react";
import PopUp from "../../../components/pages/PopUpAlert";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import FormGeneral from "./formGeneralSub";
import FormEmployeeDetail from "./formEmpDetailSub";
import FormLoanDetail from "./formLoanDetailSub";
import FormDescription from "./formDescSub";
import FormDocument from "./formDocSub";
import FormInsurance from "./formInsuranceSub";
import FormRepayment from "./formRepaymentSub";

var ct = require("../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class FormDetailSubmission extends Component {
  constructor(props) {
    super(props);
    this.state = {
      savePopUpVisible: false,
      deletePopUpVisible: false,
      createPopUpVisible: false,
      printClass: "app-popup",

      formSubDetailCreateVisible: false,
      formSubDetailEditVisible: false,
      formSubDetailViewVisible: false,

      formGeneralSubVisible: false,
      formEmpDetailSubVisible: false,
      formLoanDetailSubVisible: false,
      formDescSubVisible: false,
      formDocumentSubVisible: false,
      formInsuranceSubVisible: false,
      formRepaymentSubVisible: false,
      activeTab: "",
      tabMenu: ["General", "Employee Detail", "Loan Detail"],
      tabMenuEdit: [
        "General",
        "Employee Detail",
        "Loan Detail",
        "Description",
        "Document",
        "Insurance",
        "Repayment"
      ]
    };
  }

  openPrint = () => {
    if (this.state.printClass === "app-popup app-popup-show") {
      this.setState({ printClass: "app-popup" });
    } else {
      this.setState({ printClass: "app-popup app-popup-show" });
    }
  };

  openSubDetailCreate = index => {
    let { formSubDetailCreateVisible } = this.state;
    this.setState({
      formSubDetailCreateVisible: !formSubDetailCreateVisible,
      selectedIndex: !formSubDetailCreateVisible ? index : null,
      activeTab: !formSubDetailCreateVisible ? "General" : "",
      formGeneralSubVisible: !formSubDetailCreateVisible ? true : false,
      formEmpDetailSubVisible: false,
      formLoanDetailSubVisible: false
    });
  };

  openSubDetailEdit = index => {
    let { formSubDetailEditVisible } = this.state;
    this.setState({
      formSubDetailEditVisible: !formSubDetailEditVisible,
      selectedIndex: !formSubDetailEditVisible ? index : null,
      activeTab: !formSubDetailEditVisible ? "General" : "",
      formGeneralSubVisible: !formSubDetailEditVisible ? true : false,
      formEmpDetailSubVisible: false,
      formLoanDetailSubVisible: false,
      formDescSubVisible: false,
      formDocumentSubVisible: false,
      formInsuranceSubVisible: false,
      formRepaymentSubVisible: false
    });
  };

  openSubDetailView = index => {
    let { formSubDetailViewVisible } = this.state;
    this.setState({
      formSubDetailViewVisible: !formSubDetailViewVisible,
      selectedIndex: !formSubDetailViewVisible ? index : null,
      activeTab: !formSubDetailViewVisible ? "General" : "",
      formGeneralSubVisible: !formSubDetailViewVisible ? true : false,
      formEmpDetailSubVisible: false,
      formLoanDetailSubVisible: false,
      formDescSubVisible: false,
      formDocumentSubVisible: false,
      formInsuranceSubVisible: false,
      formRepaymentSubVisible: false
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
      formGeneralSubVisible: false,
      formEmpDetailSubVisible: false,
      formLoanDetailSubVisible: false,
      formDescSubVisible: false,
      formDocumentSubVisible: false,
      formInsuranceSubVisible: false,
      formRepaymentSubVisible: false,
      activeTab: title
    };

    switch (title) {
      case "General":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formGeneralSubVisible: true
        };
        break;
      case "Employee Detail":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formEmpDetailSubVisible: true
        };
        break;
      case "Loan Detail":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formLoanDetailSubVisible: true
        };
        break;
      case "Description":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formDescSubVisible: true
        };
        break;
      case "Document":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formDocumentSubVisible: true
        };
        break;
      case "Insurance":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formInsuranceSubVisible: true
        };
        break;
      case "Repayment":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formRepaymentSubVisible: true
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
    "Employee Name",
    "Loan Type",
    "Approval Value",
    {
      name: "Document Status",
      options: {
        customBodyRender: val => {
          return (
            <div>
              <label
                style={{
                  backgroundColor: "brown",
                  color: "white",
                  padding: "2px",
                  borderRadius: 2,
                  border: "4px solid brown"
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
      name: "SPPP",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              <button
                type="button"
                className="btn btn-blue btn-small-circle"
                style={{ marginRight: 5 }}
                onClick={() => this.openPrint(tableMeta.rowIndex)}
              >
                <i className="fa fa-lw fa-print" />
              </button>
            </div>
          );
        }
      }
    },
    {
      name: "SPK",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              <button
                type="button"
                className="btn btn-blue btn-small-circle"
                style={{ marginRight: 5 }}
                onClick={() => this.openPrint(tableMeta.rowIndex)}
              >
                <i className="fa fa-lw fa-print" />
              </button>
            </div>
          );
        }
      }
    },
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta, rowIndex) => {
          return (
            <div>
              {val === "Rencana" ? (
                <button
                  type="button"
                  className="btn btn-blue btn-small-circle fa fa-lw fa-pencil-alt"
                  style={{ marginRight: 5 }}
                  onClick={() => this.openSubDetailEdit(tableMeta.rowIndex)}
                ></button>
              ) : null}
              {val === "Rencana" ? (
                <button
                  type="button"
                  className="btn btn-red btn-small-circle fa fa-lw fa-trash-alt"
                  onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
                ></button>
              ) : null}
              {console.log(val)}
              {val === "Disetujui" ? (
                <button
                  type="button"
                  className="btn btn-blue btn-small-circle"
                  onClick={() => this.openSubDetailView(tableMeta.rowIndex)}
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
      "02312093829",
      "Liliyana Tan",
      "Liliyana Tan",
      "BN",
      "50.0000",
      "Disetujui",
      "Disetujui",
      "Disetujui",
      "Disetujui"
    ],
    [
      "2",
      "02312093829",
      "Liliyana Tan",
      "Liliyana Tan",
      "BN",
      "50.0000",
      "Rencana",
      "Rencana",
      "Rencana",
      "Rencana"
    ]
  ];

  renderFooter = () => (
    <div className="padding-15px">
      <div className="grid grid-2x">
        <div className="col-1" />
        <div className="col-2 content-right">
          {this.props.type === "update" ? (
            <button
              style={{ marginLeft: "15px" }}
              className="btn btn-blue"
              type="button"
              onClick={() =>
                this.setState({
                  createPopUpVisible: !this.state.createPopUpVisible
                })
              }
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
  );
  render() {
    return (
      <div className="vertical-tab-content active">
        <form action="#">
          <div className="border-bottom padding-15px">
            <div className="col-1 content-right">
              {this.props.type !== "view" ? (
                <button
                  type="button"
                  className="btn btn-circle background-blue"
                  onClick={() => this.openSubDetailCreate()}
                >
                  <i className="fa fa-1x fa-plus" />
                </button>
              ) : null}
            </div>
            <div className="padding-5px" />
            <MuiThemeProvider theme={getMuiTheme()}>
              <MUIDataTable
                data={this.dataTable}
                columns={this.columns}
                options={options}
              />
            </MuiThemeProvider>
          </div>

          {this.state.formSubDetailCreateVisible && (
            <div className={"app-popup app-popup-show"}>
              <div className="padding-top-20px" />
              <div
                className="popup-content background-white border-radius"
                style={{ marginBottom: 10 }}
              >
                <div className="popup-panel grid grid-2x">
                  <div className="col-1">
                    <div className="popup-title">Submission - Create Form</div>
                  </div>
                  <div className="col-2 content-right">
                    <button
                      type="button"
                      className="btn btn-circle btn-grey"
                      onClick={this.openSubDetailCreate}
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
                    {this.state.formGeneralSubVisible && (
                      <FormGeneral
                        type={"create"}
                        onClickClose={this.openSubDetailCreate}
                        onClickSave={this.handleUpdate.bind(this)}
                      />
                    )}

                    {this.state.formEmpDetailSubVisible && (
                      <FormEmployeeDetail
                        type={"create"}
                        onClickClose={this.openSubDetailCreate}
                        onClickSave={this.handleUpdate.bind(this)}
                      />
                    )}

                    {this.state.formLoanDetailSubVisible && (
                      <FormLoanDetail
                        type={"create"}
                        onClickClose={this.openSubDetailCreate}
                        onClickSave={this.handleUpdate.bind(this)}
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="padding-bottom-20px" />
            </div>
          )}

          {this.state.formSubDetailEditVisible && (
            <div className={"app-popup app-popup-show"}>
              <div className="padding-top-20px" />
              <div
                className="popup-content background-white border-radius"
                style={{ marginBottom: 10 }}
              >
                <div className="popup-panel grid grid-2x">
                  <div className="col-1">
                    <div className="popup-title">Submission - Edit Form</div>
                  </div>
                  <div className="col-2 content-right">
                    <button
                      className="btn btn-circle btn-grey"
                      onClick={this.openSubDetailEdit}
                    >
                      <i className="fa fa-lg fa-times" />
                    </button>
                  </div>
                </div>

                <div className="popup-content-grid">
                  <div className="popup-scroll popup-col-1">
                    <ul className="vertical-tab">
                      {this.state.tabMenuEdit.map((data, index) => {
                        return this.opNavigator(data);
                      })}
                    </ul>
                  </div>

                  <div className="popup-scroll popup-col-2">
                    {/* General */}
                    {this.state.formGeneralSubVisible && (
                      <FormGeneral
                        type={"edit"}
                        onClickClose={this.openSubDetailEdit}
                        onClickSave={this.handleUpdate.bind(this)}
                      />
                    )}

                    {this.state.formEmpDetailSubVisible && (
                      <FormEmployeeDetail
                        type={"edit"}
                        onClickClose={this.openSubDetailEdit}
                        onClickSave={this.handleUpdate.bind(this)}
                      />
                    )}

                    {this.state.formLoanDetailSubVisible && (
                      <FormLoanDetail
                        type={"edit"}
                        onClickClose={this.openSubDetailEdit}
                        onClickSave={this.handleUpdate.bind(this)}
                      />
                    )}

                    {this.state.formDescSubVisible && (
                      <FormDescription
                        type={"edit"}
                        onClickClose={this.openSubDetailEdit}
                        onClickSave={this.handleUpdate.bind(this)}
                      />
                    )}

                    {this.state.formDocumentSubVisible && (
                      <FormDocument
                        type={"edit"}
                        onClickClose={this.openSubDetailEdit}
                        onClickSave={this.handleUpdate.bind(this)}
                      />
                    )}
                    {this.state.formInsuranceSubVisible && (
                      <FormInsurance
                        type={"edit"}
                        onClickClose={this.openSubDetailEdit}
                        onClickSave={this.handleUpdate.bind(this)}
                      />
                    )}
                    {this.state.formRepaymentSubVisible && (
                      <FormRepayment
                        type={"edit"}
                        onClickClose={this.openSubDetailEdit}
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="padding-bottom-20px" />
            </div>
          )}

          {this.state.formSubDetailViewVisible && (
            <div className={"app-popup app-popup-show"}>
              <div className="padding-top-20px" />
              <div
                className="popup-content background-white border-radius"
                style={{ marginBottom: 10 }}
              >
                <div className="popup-panel grid grid-2x">
                  <div className="col-1">
                    <div className="popup-title">Submission - Detail Form</div>
                  </div>
                  <div className="col-2 content-right">
                    <button
                      className="btn btn-circle btn-grey"
                      onClick={this.openSubDetailView}
                    >
                      <i className="fa fa-lg fa-times" />
                    </button>
                  </div>
                </div>

                <div className="popup-content-grid">
                  <div className="popup-scroll popup-col-1">
                    <ul className="vertical-tab">
                      {this.state.tabMenuEdit.map((data, index) => {
                        return this.opNavigator(data);
                      })}
                    </ul>
                  </div>

                  <div className="popup-scroll popup-col-2">
                    {/* General */}
                    {this.state.formGeneralSubVisible && (
                      <FormGeneral
                        type={"view"}
                        onClickClose={this.openSubDetailView}
                      />
                    )}

                    {this.state.formEmpDetailSubVisible && (
                      <FormEmployeeDetail
                        type={"view"}
                        onClickClose={this.openSubDetailView}
                      />
                    )}

                    {this.state.formLoanDetailSubVisible && (
                      <FormLoanDetail
                        type={"view"}
                        onClickClose={this.openSubDetailView}
                      />
                    )}

                    {this.state.formDescSubVisible && (
                      <FormDescription
                        type={"view"}
                        onClickClose={this.openSubDetailView}
                      />
                    )}

                    {this.state.formDocumentSubVisible && (
                      <FormDocument
                        type={"view"}
                        onClickClose={this.openSubDetailView}
                      />
                    )}
                    {this.state.formInsuranceSubVisible && (
                      <FormInsurance
                        type={"view"}
                        onClickClose={this.openSubDetailView}
                      />
                    )}
                    {this.state.formRepaymentSubVisible && (
                      <FormRepayment
                        type={"view"}
                        onClickClose={this.openSubDetailView}
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
          {/* Popup Print */}
          <div className={this.state.printClass}>
            <div
              className="popup-content-mikro background-white border-radius post-center"
              style={{ marginBottom: 10 }}
            >
              <div className="popup-panel grid grid-2x">
                <div className="col-1">
                  <div className="popup-title">Report Viewer</div>
                </div>
                <div className="col-2 content-right" style={{ marginTop: 10 }}>
                  <i className="fa fa-download" style={{ cursor: "pointer" }} />
                </div>
              </div>

              <div className="padding-15px background-white">
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
          {/* End Popup Print */}
        </form>
        {this.renderFooter()}
      </div>
    );
  }
}

export default FormDetailSubmission;
