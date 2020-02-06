import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import LoadingBar from "react-top-loading-bar";
import PopUp from "../pages/PopUpAlert";
import FormPlanDetail from "../../modules/forms/formTraining/plan/planDetail";
import FormParticipant from "../../modules/forms/formTraining/plan/planParticipant";
import FormFacilitator from "../../modules/forms/formTraining/plan/planFacilitator";
import FormBudget from "../../modules/forms/formTraining/plan/planBudget";
import FormDocument from "../../modules/forms/formTraining/plan/planDocument";
import FormCommittee from "../../modules/forms/formTraining/plan/planCommitte";
import FormApproval from "../../modules/forms/formTraining/plan/planApproval";
import DropDown from '../../modules/popup/DropDown';

var ct = require("../../modules/custom/customTable");

class plan extends Component {
  constructor() {
    super();
    this.state = {
      selectedIndex: null,
      rawData: [],

      createVisible: false,
      editVisible: false,

      printClass: "app-popup",
      savePopUpVisible: false,
      deletePopUpVisible: false,

      formDetailVisible: false,
      formParticipantVisible: false,
      formFacilitatorVisible: false,
      formBudgetVisible: false,
      formDocumentVisible: false,
      formCommitteeVisible: false,
      formApprovalVisible: false,
      activeTab: "",
      tabMenuCreate: ["Detail"],
      tabMenu: [
        "Detail",
        "Participant",
        "Facilitator",
        "Budget",
        "Document",
        "Committee",
        "Approval"
      ]
    };
    this.handleDelete = this.handleDelete.bind(this);
  }

  openCreateForm = index => {
    let { createVisible } = this.state;
    this.setState({
      createVisible: !createVisible,
      selectedIndex: !createVisible ? index : null,
      activeTab: !createVisible ? "Detail" : "",
      formDetailVisible: !createVisible ? true : false
    });
  };

  openEditForm = index => {
    let { editVisible } = this.state;
    this.setState({
      editVisible: !editVisible,
      selectedIndex: !editVisible ? index : null,
      activeTab: !editVisible ? "Detail" : "",
      formDetailVisible: !editVisible ? true : false,
      formParticipantVisible: false,
      formFacilitatorVisible: false,
      formBudgetVisible: false,
      formDocumentVisible: false,
      formCommitteeVisible: false,
      formApprovalVisible: false
    });
  };

  openPrint = () => {
    if (this.state.printClass === "app-popup app-popup-show") {
      this.setState({ printClass: "app-popup" });
    } else {
      this.setState({ printClass: "app-popup app-popup-show" });
    }
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

  getMuiTheme = () => createMuiTheme(ct.customTable());

  options = ct.customOptions();

  columns = [
    "No",
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              {val === "Mengajukan" ? (
                <button
                  type="button"
                  className="btnAct"
                  style={{ marginRight: 15, backgroundColor: 'transparent' }}
                  onClick={() => this.openEditForm(tableMeta.rowIndex)}
                >
                  <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                </button>
              ) : null}
              {val === "Mengajukan" ? (
                <button
                  type="button"
                  className="btnAct"
                  style={{ marginRight: 15, backgroundColor: 'transparent' }}
                  onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
                >
                  <i className="fa fa-lw fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }}/>
                </button>
              ) : null}
              {val === "Disetujui" ? (
                <button
                  type="button"
                  className="btnAct"
                  style={{ marginRight: 15, backgroundColor: 'transparent' }}
                  onClick={() => this.openEditForm(tableMeta.rowIndex)}
                >
                  <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }}/>
                </button>
              ) : null}
            </div>
          );
        }
      }
    },
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
    "Training Name",
    {
      name: "Training Detail",
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
              className="grid grid-6x"
              style={{
                backgroundColor: "#F6F6F6",
                color: "#555555",
                fontSize: 13,
                fontWeight: 1
              }}
            >
              <div className="col-1">{"Type"}</div>
              <div className="col-2">{"Sub Type 1"}</div>
              <div className="col-3">{"Sub Type 2"}</div>
              <div className="col-4">{"Sub Type 3"}</div>
              <div className="col-5">{"Sub Type 4"}</div>
              <div className="col-6">{"Sub Type 5"}</div>
            </div>
          </th>
        ),
        customBodyRender: val => {
          return (
            <div>
              <div className="grid grid-6x content-center">
                <div className="col-1">{val}</div>
                <div className="col-2">{val}</div>
                <div className="col-3">{val}</div>
                <div className="col-4">{val}</div>
                <div className="col-5">{val}</div>
                <div className="col-6">{val}</div>
              </div>
            </div>
          );
        }
      }
    },
    "Start Date",
    "End Date",
    "Time",
    "PIC",
    "Number of Participant",
    "Cost Total",
    {
      name: "Proposal",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              <button
                type="button"
                className="btnAct"
                style={{ marginRight: 15, backgroundColor: 'transparent' }}
                onClick={() => this.openPrint()}
              >
                {val}
                <i className="fa fa-lw fa-print" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }}  />
              </button>
            </div>
          );
        }
      }
    }
  ];

  data = [
    [
      "1",
      "Disetujui",
      "Disetujui",
      "Pelatih",
      "Basic 2",
      "01/02/2019",
      "01/02/2020",
      "06.00 sd 19.00",
      "Bambang",
      "2",
      "2.000.000"
    ],
    [
      "2",
      "Mengajukan",
      "Mengajukan",
      "Pelatih",
      "Basic 2",
      "01/02/2019",
      "01/02/2020",
      "06.00 sd 19.00",
      "Bambang",
      "2",
      "2.000.000"
    ]
  ];

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
      formParticipantVisible: false,
      formFacilitatorVisible: false,
      formBudgetVisible: false,
      formDocumentVisible: false,
      formCommitteeVisible: false,
      formApprovalVisible: false,
      activeTab: title
    };
    switch (title) {
      case "Detail":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formDetailVisible: true
        };
        break;
      case "Participant":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formParticipantVisible: true
        };
        break;
      case "Facilitator":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formFacilitatorVisible: true
        };
        break;
      case "Budget":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formBudgetVisible: true
        };
        break;
      case "Document":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formDocumentVisible: true
        };
        break;
      case "Committee":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formCommitteeVisible: true
        };
        break;
      case "Approval":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formApprovalVisible: true
        };
        break;
      default:
        break;
    }
    this.setState(allStateVisibleFalse);
  };

  render() {
    return (
      <div className="main-content">
        <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
        <div className="padding-15px grid grid-2x">
          <div className="col-1">
            <div className="txt-site txt-15 txt-bold txt-main">
              Data Training Plan
            </div>
            <div>
              <div className="margin-10px">
                <div className="display-flex-normal">
                  <div style={{width: '60px', position: 'relative', top: '10px'}}>
                    <span className="txt-site txt-12 txt-main-color">Year</span>
                  </div>
                  <div style={{width: '500px'}}>
                    <DropDown
                      title="-- please select component id --"
                      onChange={(dt) => console.log(dt)}
                      // type="bizpar"
                      // disabled={this.props.type === "update" ? true : false}
                      data={[
                        {id: '1', title: '2019', value: '2019'}, 
                        {id: '1', title: '2020', value: '2020'}]} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-2 content-right">
            <button
              type="button"
              className="btn btn-circle background-blue"
              style={{ marginRight: 5 }}
            >
              <i className="fa fa-1x fa-download" />
            </button>
            <button
              type="button"
              className="btn btn-circle background-blue"
              onClick={this.openCreateForm}
            >
              <i className="fa fa-1x fa-plus" />
            </button>
          </div>
        </div>
        <div className="padding-5px">
          <MuiThemeProvider theme={this.getMuiTheme()}>
            <MUIDataTable
              title='EMPLOYEE TRAINING - TRAINING PLAN'
              subtitle={'lorem ipsum dolor'}
              data={this.data}
              columns={this.columns}
              options={this.options}
            />
          </MuiThemeProvider>
        </div>

        <div className={this.state.printClass}>
          <div className="popup-content-mikro background-white border-radius post-center">
            <div className="popup-panel grid grid-2x">
              <div className="col-1">
                <div className="popup-title">
                  Report Viewer
                </div>
              </div>
              <div className="col-2 content-right" style={{marginTop:10}}>
                <i
                  className="fa fa-download"
                  style={{cursor : "pointer"}}
                />
              </div>
            </div>

            <div className="padding-15px">
              <div className="grid margin-top-15px">
                <div className="content-right">
                  <button
                    style={{ marginLeft: "15px"}}
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
                    Training Plan - Create Form
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

              <div className="display-flex-normal">
                {/* <div className="width width-300px">
                  <ul className="vertical-tab">
                    {this.state.tabMenuCreate.map((data, index) => {
                      return this.opNavigator(data, index);
                    })}
                  </ul>
                </div> */}
                <div className="popup-scroll width width-full">
                  {this.state.formDetailVisible && (
                    <FormPlanDetail
                      type={"create"}
                      onClickClose={this.openCreateForm}
                      onClickSave={this.handleUpdate}
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
                    Training Plan - Edit Form
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

              <div className="display-flex-normal">
                <div className="width width-300px">
                  <ul className="vertical-tab">
                    {this.state.tabMenu.map((data, index) => {
                      return this.opNavigator(data, index);
                    })}
                  </ul>
                </div>
                <div className="popup-scroll width width-full">
                  {this.state.formDetailVisible && (
                    <FormPlanDetail
                      type={"edit"}
                      onClickClose={this.openEditForm}
                    />
                  )}

                  {this.state.formParticipantVisible && (
                    <FormParticipant
                      type={"edit"}
                      onClickClose={this.openEditForm}
                      onClickSave={this.handleUpdate}
                    />
                  )}

                  {this.state.formFacilitatorVisible && (
                    <FormFacilitator
                      type={"edit"}
                      onClickClose={this.openEditForm}
                      onClickSave={this.handleUpdate}
                    />
                  )}

                  {this.state.formBudgetVisible && (
                    <FormBudget
                      type={"edit"}
                      onClickClose={this.openEditForm}
                      onClickSave={this.handleUpdate}
                    />
                  )}

                  {this.state.formDocumentVisible && (
                    <FormDocument
                      type={"edit"}
                      onClickClose={this.openEditForm}
                      onClickSave={this.handleUpdate}
                    />
                  )}

                  {this.state.formCommitteeVisible && (
                    <FormCommittee
                      type={"edit"}
                      onClickClose={this.openEditForm}
                      onClickSave={this.handleUpdate}
                    />
                  )}

                  {this.state.formApprovalVisible && (
                    <FormApproval
                      type={"edit"}
                      onClickClose={this.openEditForm}
                      onClickSave={this.handleUpdate}
                    />
                  )}
                </div>
              </div>
            </div>
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

export default plan;
