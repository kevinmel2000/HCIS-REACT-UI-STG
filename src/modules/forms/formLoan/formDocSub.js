import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import FormDocEdit from "./formDocEdit";

var ct = require("../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class FormDocSub extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createVisible: false,
      editVisible: false
    };
  }

  openDocCreate() {
    let savePopUpVisible = this.state.savePopUpVisible
      ? !this.state.savePopUpVisible
      : false;
    this.setState({
      createVisible: !this.state.createVisible,
      savePopUpVisible
    });
  }

  openDocEdit() {
    let savePopUpVisible = this.state.savePopUpVisible
      ? !this.state.savePopUpVisible
      : false;
    this.setState({ editVisible: !this.state.editVisible, savePopUpVisible });
  }

  columns = [
    "No",
    "Document Name",
    "File",
    {
      name: "Status",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              <input type="checkbox"></input>
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
              {this.props.type !== "view" ? (
                <button
                  type="button"
                  className="btn btn-blue btn-small-circle"
                  style={{ marginRight: 5 }}
                  onClick={() => this.openDocEdit(tableMeta.rowIndex)}
                >
                  <i className="fa fa-lw fa-pencil-alt" />
                </button>
              ) : null}
            </div>
          );
        }
      }
    }
  ];

  dataTable = [["1", "cc", "tes"]];

  render() {
    return (
      <div className="vertical-tab-content active">
        <div className="padding-15px">
          <div className="col-2 content-right padding-bottom-10px">
            {this.props.type !== "view" ? (
              <button
                type="button"
                className="btn btn-circle background-blue"
                onClick={this.openDocCreate.bind(this)}
              >
                <i className="fa fa-plus" />
              </button>
            ) : null}
          </div>
          <div className="padding-bottom-15px">
            <MuiThemeProvider theme={getMuiTheme()}>
              <MUIDataTable
                data={this.dataTable}
                columns={this.columns}
                options={options}
              />
            </MuiThemeProvider>
          </div>
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
        {/*Open Form Doc Create and Edit */}
        {this.state.createVisible && (
          <FormDocEdit
            type={"create"}
            onSave={() => this.props.onClickSave()}
            onClickClose={this.openDocCreate.bind(this)}
          />
        )}

        {this.state.editVisible && (
          <FormDocEdit
            type={"edit"}
            onSave={() => this.props.onClickSave()}
            onClickClose={this.openDocEdit.bind(this)}
          />
        )}
      </div>
    );
  }
}

export default FormDocSub;
