import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import PopUp from "../../../../components/pages/PopUpAlert";
import FormMedical from "./formMedicalDetail";

var ct = require("../../../custom/customTable");

class medical extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createVisible: false,
      editVisible: false,
      detailVisible: false,
      savePopUpVisible: false,
      deletePopUpVisible: false
    };
  }

  openCreateForm = () => {
    this.setState({ createVisible: !this.state.createVisible });
  };

  openEditForm = (index = null) => {
    this.setState({
      editVisible: !this.state.editVisible,
      selectedIndex: index
    });
  };

  openDetailForm = index => {
    this.setState({
      detailVisible: !this.state.detailVisible,
      selectedIndex: index
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

  getMuiTheme = () => createMuiTheme(ct.customTable());

  options = ct.customOptions();

  columns = [
    "No",
    "NIP",
    "Employee Name",
    "Period",
    "Join Date",
    "Finish Date",
    "Position",
    "Branch",
    "MCU Cost",
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return this.props.type !== "view" ? (
            <div>
              <button
                type="button"
                className="btn btn-blue btn-small-circle"
                style={{ marginRight: 5 }}
                onClick={() => this.openEditForm(tableMeta.rowIndex)}
              >
                <i className="fa fa-lw fa-pencil-alt" />
              </button>
              <button
                type="button"
                className="btn btn-red btn-small-circle"
                onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
              >
                <i className="fa fa-lw fa-trash-alt" />
              </button>
              <button
                type="button"
                className="btn btn-blue btn-small-circle"
                onClick={() => this.openDetailForm(tableMeta.rowIndex)}
                disabled={this.props.type === "update" ? true : false}
              >
                <i className="fa fa-lw fa-ellipsis-v" />
              </button>
            </div>) :
            <button
              type="button  "
              className="btn btn-blue btn-small-circle"
              onClick={() => this.openDetailForm(tableMeta.rowIndex)}
              disabled={this.props.type === "update" ? true : false}
            >
              <i className="fa fa-lw fa-ellipsis-v" />
            </button>;

        }
      }
    }
  ];

  data = [
    ["1", "1231023", "Udin", "01/02/19", "02/02/20", "CEO", "Jaksel", "120.000"]
  ];

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
                  onClick={this.openCreateForm}
                >
                  <i className="fa fa-1x fa-plus" />
                </button>
              ) : null}
            </div>
            <div className="padding-5px" />
            <MuiThemeProvider theme={this.getMuiTheme()}>
              <MUIDataTable
                data={this.data}
                columns={this.columns}
                options={this.options}
              />
            </MuiThemeProvider>
          </div>

          <div className="padding-15px">
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
        </form>

        {this.state.createVisible && (
          <FormMedical
            type={"create"}
            onClickClose={this.openCreateForm}
            onClickSave={this.handleUpdate}
          />
        )}

        {this.state.editVisible && (
          <FormMedical
            type={"edit"}
            onClickSave={this.handleUpdate}
            onClickClose={this.openEditForm}
          />
        )}

        {this.state.detailVisible && (
          <FormMedical
            type={"view"}
            onClickClose={this.openDetailForm}
          />
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

export default medical;
