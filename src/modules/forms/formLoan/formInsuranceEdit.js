import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";

var ct = require("../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class FormInsuranceEdit extends Component {
  constructor() {
    super();
    this.state = {
      file: null
    };
  }

  dataTable = [["document.pdf"]];

  columns = [
    "Document",
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              <button
                type="button"
                className="btn btn-blue btn-small-circle"
                style={{ marginRight: 5 }}
              >
                <i className="fa fa-lw fa-print" />
              </button>
              <button
                type="button"
                className="btn btn-red btn-small-circle"
                style={{ marginRight: 5 }}
              >
                <i className="fa fa-lw fa-times" />
              </button>
            </div>
          );
        }
      }
    }
  ];
  render() {
    return (
      <div className="app-popup app-popup-show">
        <div className="padding-10px" />
        <div
          className="popup-content-small background-white border-radius"
          style={{ marginBottom: 10 }}
        >
          <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="popup-title">
                {this.props.type === "create"
                  ? "Insurance - Create Form"
                  : this.props.type === "edit"
                  ? "Insurance - Edit Form"
                  : "Insurance - View Form"}
                {console.log(this.props.type)}
              </div>
            </div>
            <div className="content-right">
              <button
                type="button"
                className="btn btn-circle btn-grey"
                onClick={this.props.onClickClose}
              >
                <i className="fa fa-lg fa-times" />
              </button>
            </div>
          </div>
          <form action="#" className="padding-15px">
            <div className="margin-bottom-20px">
              <div className="margin-5px">
                <div className="txt-site txt-11 txt-main txt-bold">
                  <h4>Guarantee Item</h4>
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
              <MuiThemeProvider theme={getMuiTheme()}>
                <MUIDataTable
                  title="Detail"
                  data={this.dataTable}
                  columns={this.columns}
                  options={options}
                />
              </MuiThemeProvider>
            </div>

            <div className="margin-bottom-20px">
              <input
                type="file"
                id="upload-image"
                style={{ display: "none" }}
                onChange={this.handleChange}
              />

              <input
                type="file"
                id="upload-image"
                style={{ display: "none" }}
                onChange={this.handleChange}
              />

              <div className="upload-image">
                <div className="u-i-info">
                  <div className="u-i-icon">
                    <i className="fa fa-lg fa-images" />
                  </div>
                  <div className="u-i-label">Upload a file</div>
                </div>

                <div
                  className="u-i-image image image-all"
                  style={{ backgroundImage: "url(" + this.state.file + ")" }}
                >
                  <div className="u-i-btn">
                    <label htmlFor="upload-image">
                      <div className="btn btn-circle-div btn-green border-all">
                        <i className="fa fa-lg fa-plus" />
                      </div>
                    </label>
                    <button
                      onClick={this.removeChange}
                      type="button"
                      className="btn btn-circle btn-red border-all"
                    >
                      <i className="fa fa-lg fa-trash-alt" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="margin-bottom-20px">
              <div className="margin-5px">
                <div className="txt-site txt-11 txt-main txt-bold">
                  <h4>Status</h4>
                </div>
              </div>
              <div className="margin-15px">
                <label className="radio">
                  <input type="checkbox" checked disabled />
                  <span className="checkmark" />
                  <div className="txt-site txt-11 txt-bold txt-main">
                    <h4>Active</h4>
                  </div>
                </label>
              </div>
            </div>

            <div className="grid">
              <div className="content-right">
                <button
                  style={{ marginLeft: "15px" }}
                  className="btn btn-blue"
                  type="button"
                  onClick={() => this.props.onSave()}
                >
                  <span>SAVE</span>
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
          </form>
        </div>

        <div className="padding-10px"></div>
      </div>
    );
  }
}

export default FormInsuranceEdit;
