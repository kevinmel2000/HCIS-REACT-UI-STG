import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";

var ct = require("../../../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class TableCorGlobal extends Component {
  columns = [
    "No",
    "Policy ID",
    "Policy Type",
    {
      name: "Activation",
      options: {
        customBodyRender: val => {
          return (
            <div>
              <i
                className="fa fa-lw fa-circle"
                style={{
                  color: val === "YES" ? "green" : "brown",
                  marginRight: 10,
                  padding: "5px"
                }}
              />
              {val}
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
              <button
                className="btnAct"
                style={{ marginRight: 15 }}
                type="button"
                onClick={this.props.openSlide('slide-glob', this.props.rawDataCorGlobal[tableMeta.rowIndex])}
                >
                <i
                  className="fa fa-lw fa-pencil-alt"
                  style={{
                    backgroundColor: "transparent",
                    color: "#004c97",
                    fontSize: 20
                  }}
                />
              </button>
              <button
                className="btnAct"
                type="button"
                onClick={() =>
                  this.props.onClickDelete(
                    this.props.rawDataCorGlobal,
                    tableMeta.rowIndex,
                    "glob",
                    false
                  )
                }
              >
                <i
                  className="fa fa-lw fa-trash-alt"
                  style={{
                    backgroundColor: "transparent",
                    color: "red",
                    fontSize: 20
                  }}
                />
              </button>
            </div>
          );
        }
      }
    }
  ];

  render() {
    return (
      <div>
        <MuiThemeProvider theme={getMuiTheme()}>
          <MUIDataTable
            title={"Corporate Global Policy"}
            subtitle={"lorem ipsum dolor"}
            data={this.props.dataTableCorGlobal}
            columns={this.columns}
            options={options}
          />
        </MuiThemeProvider>
      </div>
    );
  }
}
export default TableCorGlobal;
