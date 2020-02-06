import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import PopUp from "../../../../components/pages/PopUpAlert";
import FormEduDetail from "./formEduDetail";

var ct = require("../../../custom/customTable");

class FormEduDO extends Component {
  constructor() {
    super();
    this.state = {
      selectedIndex: null,
      rawData: [],
      dataTableFamily: [],

      createVisible: false,
      editVisible: false,
      viewVisible: false,

      deletePopUpVisible: false,
      savePopUpVisible: false,
      createClass: "app-popup",
      editClass: "app-popup",
      viewClass: "app-popup"
    };
  }

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

  openCreateForm = () => {
    this.setState({ createVisible: !this.state.createVisible });
  };

  openEditForm = (index = null) => {
    this.setState({
      editVisible: !this.state.editVisible,
      selectedIndex: index
    });
  };

  openViewForm = (index = null) => {
    this.setState({
      viewVisible: !this.state.viewVisible,
      selectedIndex: index
    });
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

  handleUpdate = () => {
    this.openSavePopUp();
  };

  options = ct.customOptions();

  columns = [
    {
      name: "No",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              <button
                type="button"
                style={{ cursor: "pointer", backgroundColor: "#fff" }}
                onClick={() => this.openViewForm(tableMeta.rowIndex)}
              >
                {val}
              </button>
            </div>
          );
        }
      }
    },
    "Start Date",
    "Finish Date",
    "Level of Education",
    "Department",
    "Institution",
    "Ijazah ID",
    "Ijazah Date",
    "GPA",
    "Education Cost",
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
                disabled={this.props.type === "view" ? true : false}
              >
                <i className="fa fa-lw fa-pencil-alt" />
              </button>
              <button
                type="button"
                className="btn btn-red btn-small-circle"
                onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
                disabled={this.props.type === "view" ? true : false}
              >
                <i className="fa fa-lw fa-trash-alt" />
              </button>
            </div>
          ) : null;
        }
      }
    }
  ];

  dataOrg = [
    ["1", "101", "10/07/2019", "31/07/2019", "2", "3", "4", "5", "9", "10"]
  ];

  render() {
    return (
      <div className="padding-15px">
        <div className="margin-bottom-10px">
          <div className="col-2 content-right">
            {this.props.type !== "view" ? (
              <button
                type="button"
                className="btn btn-circle background-blue"
                onClick={() => this.openCreateForm()}
              >
                <i className="fa fa-plus" />
              </button>
            ) : null}
          </div>
        </div>

        <div className="margin-bottom-15px">
          <MuiThemeProvider theme={this.getMuiTheme()}>
            <MUIDataTable
              data={this.dataOrg}
              columns={this.columns}
              options={this.options}
            />
          </MuiThemeProvider>
        </div>

        <div>
          <div className="grid grid-2x">
            <div className="col-1" />
            <div className="col-2 content-right">
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
        {this.state.createVisible && (
          <FormEduDetail
            type={"create"}
            onClickClose={this.openCreateForm}
            onClickSave={this.handleUpdate}
          />
        )}
        {this.state.editVisible && (
          <FormEduDetail
            type={"edit"}
            onClickClose={this.openEditForm}
            onClickSave={this.handleUpdate}
          />
        )}
        {this.state.viewVisible && (
          <FormEduDetail type={"view"} onClickClose={this.openViewForm} />
        )}
        {this.state.deletePopUpVisible && (
          <PopUp
            type={"delete"}
            class={"app-popup app-popup-show"}
            onClickDelete={this.handleDelete}
            onClick={this.openDeletePopup}
          />
        )}
        {this.state.savePopUpVisible && (
          <PopUp
            type={"save"}
            class={"app-popup app-popup-show"}
            onClick={this.openSavePopUp}
          />
        )}
      </div>
    );
  }
}

export default FormEduDO;
