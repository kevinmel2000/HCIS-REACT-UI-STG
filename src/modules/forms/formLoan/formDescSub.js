import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";

var ct = require("../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class FormDescSub extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editForm: "app-popup"
    };
  }

  openDescEdit = () => {
    if (this.state.editForm === "app-popup app-popup-show") {
      this.setState({ editForm: "app-popup" });
    } else {
      this.setState({ editForm: "app-popup app-popup-show" });
    }
  };

  columns = [
    "No",
    "Detail",
    "Description",
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
                  onClick={() => this.openDescEdit(tableMeta.rowIndex)}
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
        <div className="padding-15px border-bottom">
          {/**Show Table */}
          <MuiThemeProvider theme={getMuiTheme()}>
            <MUIDataTable
              data={this.dataTable}
              columns={this.columns}
              options={options}
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
        {/* Popup Edit Form */}
        <div className={this.state.editForm}>
          <div className="padding-top-20px" />
          <div className="popup-content-mikro background-white border-radius">
            <div className="popup-panel grid grid-2x">
              <div className="col-1">
                <div className="popup-title">Description - Edit Form</div>
              </div>
              <div className="col-2 content-right">
                <button
                  type="button"
                  className="btn btn-circle btn-grey"
                  onClick={this.openDescEdit}
                >
                  <i className="fa fa-lg fa-times" />
                </button>
              </div>
            </div>

            <form className="padding-15px">
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>NIK</h4>
                  </div>
                </div>
                <input
                  readOnly
                  style={{ backgroundColor: "#E6E6E6" }}
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Detail</h4>
                  </div>
                </div>
                <input
                  readOnly
                  style={{ backgroundColor: "#E6E6E6" }}
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Description</h4>
                  </div>
                </div>
                <textarea
                  disabled={this.props.type === "view" ? true : false}
                  style={
                    this.props.type === "view"
                      ? { backgroundColor: "#E6E6E6", marginRight: 10 }
                      : { marginRight: 10 }
                  }
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                />
              </div>

              <div className="grid">
                <div className="content-right">
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
                    className="btn btn-primary"
                    type="button"
                    onClick={this.openDescEdit}
                  >
                    <span>CLOSE</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        {/* End Popup Edit Form*/}
      </div>
    );
  }
}

export default FormDescSub;
