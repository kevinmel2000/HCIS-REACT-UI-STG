import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import LoadingBar from "react-top-loading-bar";
import PopUp from "../pages/PopUpAlert";
import FormScheduleCreate from "../../modules/forms/formTraining/TrainingSchedule/formTrainingScheduleCreate";

var ct = require("../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class TrainingSechedule extends Component {
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
      formRequirementVisible: false,
      formParticipantVisible: false,
      formPeriodeVisible: false,
      activeTab: "",
      createClass: "app-popup",
      type: "create",
      updateClass: "app-popup",
      saveClass: "app-popup",
      deleteClass: "app-popup",
      savePopUpVisible: false,
      deletePopUpVisible: false
    };
  }

  handleUpdate = () => {
    this.openSavePopUp();
  };

  handleDelete = () => {
    this.setState({ deletePopUpVisible: false });
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

  openCreateForm = index => {
    let { createVisible } = this.state;
    this.setState({
      createVisible: !createVisible,
      selectedIndex: !createVisible ? index : null,
      activeTab: !createVisible ? "General" : "",
      formRequirementVisible: !createVisible ? true : false,
      formParticipantVisible: false,
      formPeriodeVisible: false
    });
  };

  openEditForm = index => {
    let { editVisible } = this.state;
    this.setState({
      editVisible: !editVisible,
      selectedIndex: !editVisible ? index : null,
      activeTab: !editVisible ? "General" : "",
      formRequirementVisible: !editVisible ? true : false,
      formParticipantVisible: false,
      formPeriodeVisible: false
    });
  };

  columns = [
    "No",
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              <button
                className="btnAct"
                style={{ marginRight: 15, backgroundColor: 'transparent' }}
                type="button"
                onClick={() => this.openEditForm(tableMeta.rowIndex)}
              >
                <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
              </button>

              <button
                className="btnAct"
                style={{ marginRight: 15, backgroundColor: 'transparent' }}
                onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
              >
                <i className="fa fa-lw fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
              </button>

              <button
                type="button"
                style={{ marginTop: 7 }}
                className="btn btn-primary-blue btn-small"
                onClick={this.handleUpdate}
              >
                Bagikan
              </button>
            </div>
          );
        }
      }
    },
    "Training Name",
    "Type",
    "Sub Type 1",
    "Sub Type 2",
    "Sub Type 3",
    "Sub Type 4",
    "Sub Type 5",
    "Year",
    "Quota Participant per Activity",
    "Annual Quota Participant",
    "Quota of Used Participant",
    "Leftovers",
    "Requirements",
    "Participant",
    "Period"
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
      formRequirementVisible: false,
      formParticipantVisible: false,
      formPeriodeVisible: false,
      activeTab: title
    };
    switch (title) {
      case "Requirement":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formRequirementVisible: true
        };
        break;
      case "Participant":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formParticipantVisible: true
        };
        break;
      case "Periode":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formPeriodeVisible: true
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
      "",
      "FULL TEST",
      "S1",
      "TEST 1",
      "TEST",
      "WRITING",
      "SPEAKING",
      "-",
      "2021",
      "10",
      "100",
      "0",
      "1 Data",
      "0 Data",
      "0 Data",
      "1 Data"
    ],
    [
      "2",
      "",
      "ORIENTASI KARYAWAN",
      "OKB",
      "TEST 1",
      "TEST",
      "WRITING",
      "SPEAKING",
      "-",
      "2021",
      "10",
      "100",
      "0",
      "1 Data",
      "0 Data",
      "0 Data",
      "1 Data"
    ]
  ];

  render() {
    return (
      <div className="main-content">
        <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
        <div className="padding-5px grid grid-2x">
          <div className="col-1">
            <div className="txt-site txt-18 txt-bold txt-main padding-top-5px">
              {/* EMPLOYEE TRAINING - TRAINING SCHEDULE */}
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
          <MuiThemeProvider theme={getMuiTheme()}>
            <MUIDataTable
              title="Training Schedule"
              subtitle={'lorem ipsum dolor'}
              data={this.data}
              columns={this.columns}
              options={options}
            />
          </MuiThemeProvider>
        </div>

        {this.state.createVisible && (
          <div className="app-popup app-popup-show">
            <div className="padding-top-20px" />
            <div
              className="popup-content-small background-white border-radius"
              style={{ marginBottom: 10 }}
            >
              <div className="popup-panel grid grid-2x">
                <div className="col-1">
                  <div className="popup-title">
                    Training Schedule - Create Form
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

              <FormScheduleCreate
                onClickClose={this.openCreateForm}
                onClickSave={this.handleUpdate}
                type={"create"}
              />
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
                    Training Schedule - Edit Form
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

              <FormScheduleCreate
                onClickClose={this.openEditForm}
                onClickSave={this.handleUpdate}
                type={"update"}
              />
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

export default TrainingSechedule;
