import React, { Component } from "react"
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import MUIDataTable from "mui-datatables-bitozen"

var ct = require("../../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

class TableCNC extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataTable: props.dataTable
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.dataTable !== prevProps.dataTable) return this.setState({ dataTable: this.props.dataTable })
  } 

  columns = [
    "Template ID",
    "Template Name",
    {
      name: "Activation",
      options: {
        customBodyRender: val => {
          return (
            <div>
              <i className="fa fa-lw fa-circle" style={{ color: val === "YES" ? "green" : "brown", marginRight: 10, padding: "5px" }} />
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
                style={{ marginRight: 10 }}
                type="button"
                onClick={this.props.openSlide("slide-cnc", tableMeta.rowIndex)}>
                <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: "transparent", color: "#004c97", fontSize: 20 }} />
              </button>
              <button
                className="btnAct"
                type="button"
                onClick={() => this.props.onDeletePopup(tableMeta.rowIndex)}>
                <i className="fa fa-lw fa-trash-alt" style={{ backgroundColor: "transparent", color: "red", fontSize: 20 }} />
              </button>
            </div>
          );
        }
      }
    }
  ];

  render() {
    let { dataTable } = this.state
    return (
      <div>
        <MuiThemeProvider theme={getMuiTheme()}>
          <MUIDataTable
            title={"CNC Template"}
            subtitle={"lorem ipsum dolor"}
            data={dataTable}
            columns={this.columns}
            options={options}
          />
        </MuiThemeProvider>
      </div>
    );
  }
}
export default TableCNC;