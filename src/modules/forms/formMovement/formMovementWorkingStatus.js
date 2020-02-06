import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import FormSearchWork from "./formSearchWorkStat";

let ct = require("../../custom/customTable");

class FormMovementWorkingStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formSearchWorkStatVisible: false
    };
  }

  openSearch() {
    this.setState({
      formSearchWorkStatVisible: !this.state.formSearchWorkStatVisible
    });
  }

  getMuiTheme = () => createMuiTheme(ct.customTable());

  options = ct.customOptions();

  columnsBefore = [
    {
      name: "BEFORE",
      options: {
        filter: false,
        customHeadRender: (columnMeta, updateDirection) => (
          <th
            key={columnMeta.index}
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
              className="grid grid-4x"
              style={{
                backgroundColor: "#F6F6F6",
                color: "#555555",
                fontSize: 13,
                fontWeight: 1
              }}
            >
              <div className="col-1">{"Work Status"}</div>
              <div className="col-2">{"Work Status Category"}</div>
              <div className="col-3">{"Join Date"}</div>
              <div className="col-4">{"End Date"}</div>
            </div>
          </th>
        ),
        customBodyRender: val => (
          <div className="grid grid-4x">
            <div className="col-1">{val.split("|")[0]}</div>
            <div className="col-2">{val.split("|")[1]}</div>
            <div className="col-3">{val.split("|")[2]}</div>
            <div className="col-4">{val.split("|")[3]}</div>
          </div>
        )
      }
    },
    "Work Status"
  ];

  columnsAfter = [
    {
      name: "AFTER",
      options: {
        filter: false,
        customHeadRender: (columnMeta, updateDirection) => (
          <th
            key={columnMeta.index}
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
              className="grid grid-4x"
              style={{
                backgroundColor: "#F6F6F6",
                color: "#555555",
                fontSize: 13,
                fontWeight: 1
              }}
            >
              <div className="col-1">{"Work Status"}</div>
              <div className="col-2">{"Work Status Category"}</div>
              <div className="col-3">{"Join Date"}</div>
              <div className="col-4">{"End Date"}</div>
            </div>
          </th>
        ),
        customBodyRender: val => (
          <div className="grid grid-4x">
            <div className="col-1">{val.split("|")[0]}</div>
            <div className="col-2">{val.split("|")[1]}</div>
            <div className="col-3">{val.split("|")[2]}</div>
            <div className="col-4">{val.split("|")[3]}</div>
          </div>
        )
      }
    },
    "Work Status"
  ];

  render() {
    const dataBefore = [
      ["TETAP | TETAP | 04/04/2019 | 31/12/2020", "TETAP"],
      ["TETAP | TRAINER | 04/04/2019 | 31/12/2020", "TETAP"],
      ["TETAP | TRAINER | 04/04/2019 | 31/12/2020", "TETAP"]
    ];

    const dataAfter = [
      ["TETAP | TETAP | 04/04/2019 | 31/12/2020", "TETAP"],
      ["TETAP | TRAINER | 04/04/2019 | 31/12/2020", "TETAP"],
      ["TETAP | TRAINER | 04/04/2019 | 31/12/2020", "TETAP"]
    ];
    return (
      <div className="vertical-tab-content active">
        <form action="#">
          {this.state.formSearchWorkStatVisible && (
            <FormSearchWork onClickClose={this.openSearch.bind(this)} />
          )}
          <div className="padding-15px grid-mobile-none gap-10px">
            <div className="column-1">
              <div className="padding-15px">
                <div className="txt-site txt-18 txt-bold txt-main padding-top-5px">
                  WORKING STATUS BEFORE
                </div>
              </div>
              <div className="padding-5px">
                <MuiThemeProvider theme={this.getMuiTheme()}>
                  <MUIDataTable
                    data={dataBefore}
                    columns={this.columnsBefore}
                    options={this.options}
                  />
                </MuiThemeProvider>
              </div>
            </div>
            <div className="column-2">
              <div className="padding-15px grid grid-2x">
                <div className="col-1">
                  <div className="txt-site txt-18 txt-bold txt-main padding-top-5px">
                    WORKING STATUS AFTER
                  </div>
                </div>
                <div className="col-2 content-right">
                  {this.props.type !== "view" ? (
                    <button
                      style={{ marginLeft: "15px" }}
                      onClick={() => this.openSearch()}
                      className="btn btn-blue"
                      type="button"
                    >
                      <span>EDIT</span>
                    </button>
                  ) : null}
                </div>
              </div>
              <div className="padding-5px">
                <MuiThemeProvider theme={this.getMuiTheme()}>
                  <MUIDataTable
                    data={dataAfter}
                    columns={this.columnsAfter}
                    options={this.options}
                  />
                </MuiThemeProvider>
              </div>
            </div>
          </div>
          <div className="padding-15px">
            <div className="grid grid-2x">
              <div className="col-1" />
              <div className="col-2 content-right">
                {this.props.type !== "view" ? (
                  <button
                    style={{ marginLeft: "15px" }}
                    onClick={this.props.onSave}
                    className="btn btn-blue"
                    type="button"
                  >
                    <span>SAVE</span>
                  </button>
                ) : null}
                {this.props.type === "edit" ? (
                  <button
                    style={{ marginLeft: "15px" }}
                    onClick={this.props.onSave}
                    className="btn btn-blue"
                    type="button"
                  >
                    <span>PROCESS</span>
                  </button>
                ) : null}
                <button
                  style={{ marginLeft: "15px" }}
                  onClick={this.props.onClickClose}
                  className="btn btn-blue"
                  type="button"
                >
                  <span>CLOSE</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default FormMovementWorkingStatus;
