import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import PopUp from "../../../../components/pages/PopUpAlert";
import FormBudgetDetail from "./planBudgetDetail";

var ct = require("../../../custom/customTable");

class budget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createVisible: false,
      editVisible: false,
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
    "Budget Name",
    {
      name: "Budget Detail",
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
    "Cost Total",
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              <button
                type="button"
                className="btnAct"
                style={{ marginRight: 15, backgroundColor: 'transparent' }}
                onClick={() => this.openEditForm(tableMeta.rowIndex)}
              >
                <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
              </button>
              <button
                type="button"
                className="btnAct"
                style={{ marginRight: 15, backgroundColor: 'transparent' }}
                onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
              >
                <i className="fa fa-lw fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }}/>
              </button>
            </div>
          );
        }
      }
    }
  ];

  data = [["1", "Materi", "1", "2", "3", "4", "5", "6", "7"]];

  render() {
    return (
      <div className="vertical-tab-content active">
        <form action="#">
          <div className="border-bottom padding-15px grid-mobile-none gap-20px">
            <div className="col-1 content-right">
              <button
                type="button"
                className="btn btn-circle background-blue"
                onClick={this.openCreateForm}
              >
                <i className="fa fa-1x fa-plus" />
              </button>
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
                  className="btn btn-blue"
                  type="button"
                  onClick={() => this.props.onClickSave()}
                >
                  <span>SAVE</span>
                </button>
                <button
                  style={{ marginLeft: "15px" }}
                  className="btn btn-blue"
                  type="button"
                  onClick={() => this.props.onClickSave()}
                >
                  <span>PROCESS</span>
                </button>
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
          <FormBudgetDetail
            type={"create"}
            onClickClose={this.openCreateForm.bind(this)}
            onClickSave={this.handleUpdate}
          />
        )}

        {this.state.editVisible && (
          <FormBudgetDetail
            type={"edit"}
            onClickClose={this.openEditForm.bind(this)}
            onClickSave={this.handleUpdate}
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

export default budget;
