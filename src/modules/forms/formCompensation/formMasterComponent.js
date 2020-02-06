import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import PopUp from "../../../components/pages/PopUpAlert";
import FormMasterComponentCreate from "./formMasterComponentCreate";
import FormMasterComponentVariable from "./formMasterComponentVariable";
import FormMasterComponentVariableMulti from "./formMasterComponentVariableMulti";

var ct = require("../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class FormMasterComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formCreateVisible: false,
      formUpdateVisible: false,
      formDetailVisible: false,
      formVariableVisible: false,
      formVariableMultiVisible: false,
      savePopUpVisible: false,
      confirmPopUpVisible: false,
      deletePopUpVisible: false
    };
  }

  openCreateForm = () => {
    let savePopUpVisible = this.state.savePopUpVisible
      ? !this.state.savePopUpVisible
      : false;
    this.setState({
      formCreateVisible: !this.state.formCreateVisible,
      savePopUpVisible
    });
  };

  openUpdateForm = () => {
    let savePopUpVisible = this.state.savePopUpVisible
      ? !this.state.savePopUpVisible
      : false;
    this.setState({
      formUpdateVisible: !this.state.formUpdateVisible,
      savePopUpVisible
    });
  };

  openDetailForm = () => {
    this.setState({ formDetailVisible: !this.state.formDetailVisible });
  };

  openVariableForm = () => {
    this.setState({ formVariableVisible: !this.state.formVariableVisible });
  };

  openVariableMultiForm = () => {
    this.setState({
      formVariableMultiVisible: !this.state.formVariableMultiVisible
    });
  };

  openSavePopUp = () => {
    this.setState({
      savePopUpVisible: !this.state.savePopUpVisible,
      confirmPopUpVisible: false,
      formCreateVisible: false,
      formUpdateVisible: false,
      formDetailVisible: false
    });
  };

  openConfirmPopUp = () => {
    this.setState({ confirmPopUpVisible: !this.state.confirmPopUpVisible });
  };

  openDeletePopUp = () => {
    this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible });
  };

  columns = [
    "No",
    "Component ID",
    "Component Name",
    "Component Type",
    "Tax Type",
    "Component COA",
    {
      name: "Component Variable",
      options: {
        customBodyRender: val => {
          return (
            <div
              style={{ cursor: "pointer" }}
              onClick={() => this.openVariableForm()}
            >
              {val}
            </div>
          );
        }
      }
    },
    {
      name: "Component Variable Multi",
      options: {
        customBodyRender: val => {
          return (
            <div
              style={{ cursor: "pointer" }}
              onClick={() => this.openVariableMultiForm()}
            >
              {val}
            </div>
          );
        }
      }
    },
    {
      name: "Action",
      options: {
        customBodyRender: () => {
          return (
            <div>
              <button
                className="btn btn-red btn-small-circle"
                style={{ marginRight: 5 }}
                onClick={() => this.openUpdateForm()}
              >
                <i className="fa fa-lw fa-pencil-alt" />
              </button>
              <button
                style={{ marginRight: 5 }}
                className="btn btn-red btn-small-circle"
                onClick={this.openDeletePopUp}
              >
                <i className="fa fa-lw fa-trash-alt" />
              </button>
              <button
                className="btn btn-blue btn-small-circle"
                onClick={() => this.openDetailForm()}
              >
                <i className="fa fa-lw fa-ellipsis-v" />
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
      "ALLOCATION_ALLOWANCE",
      "Allocation Allowance",
      "PENERIMAAN",
      "GROSS UP",
      "61020108A",
      "0 data",
      "1 data"
    ],
    [
      "2",
      "ATTENDANCE_ALLOWANCE",
      "Attendance Allowance",
      "PENERIMAAN",
      "GROSS UP",
      "61020101F",
      "0 data",
      "8 data"
    ]
  ];

  render() {
    let {
      formCreateVisible,
      formUpdateVisible,
      formDetailVisible,
      formVariableVisible,
      formVariableMultiVisible,
      savePopUpVisible,
      confirmPopUpVisible,
      deletePopUpVisible
    } = this.state;
    return (
      <div>
        <div className="margin-bottom-10px col-2 content-right">
          <button
            type="button"
            className="btn btn-circle background-blue margin-right-5px"
            onClick={this.openCreateForm}
          >
            <i className="fa fa-1x fa-plus"></i>
          </button>
        </div>
        <MuiThemeProvider theme={getMuiTheme()}>
          <MUIDataTable
            title="Component"
            data={this.data}
            columns={this.columns}
            options={options}
          />
        </MuiThemeProvider>

        {formCreateVisible && (
          <FormMasterComponentCreate
            type={"create"}
            onClickSave={this.openConfirmPopUp.bind(this)}
            onClickClose={this.openCreateForm.bind(this)}
          />
        )}

        {formUpdateVisible && (
          <FormMasterComponentCreate
            type={"update"}
            onClickSave={this.openConfirmPopUp.bind(this)}
            onClickClose={this.openUpdateForm.bind(this)}
          />
        )}

        {formDetailVisible && (
          <FormMasterComponentCreate
            type={"detail"}
            onClickSave={this.openConfirmPopUp.bind(this)}
            onClickClose={this.openDetailForm.bind(this)}
          />
        )}

        {formVariableVisible && (
          <FormMasterComponentVariable
            onClickClose={this.openVariableForm.bind(this)}
          />
        )}

        {formVariableMultiVisible && (
          <FormMasterComponentVariableMulti
            onClickClose={this.openVariableMultiForm.bind(this)}
          />
        )}

        {savePopUpVisible && (
          <PopUp
            type={"save"}
            class={"app-popup app-popup-show"}
            onClick={this.openSavePopUp.bind(this)}
          />
        )}

        {confirmPopUpVisible && (
          <PopUp
            type={"simpan"}
            class={"app-popup app-popup-show"}
            onClick={this.openConfirmPopUp.bind(this)}
            onClickSimpan={this.openSavePopUp.bind(this)}
          />
        )}

        {deletePopUpVisible && (
          <PopUp
            type={"delete"}
            class={"app-popup app-popup-show"}
            onClick={this.openDeletePopUp.bind(this)}
            onClickDelete={this.openDeletePopUp.bind(this)}
          />
        )}
      </div>
    );
  }
}

export default FormMasterComponent;
