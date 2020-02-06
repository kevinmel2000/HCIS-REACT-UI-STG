import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import FormIPPComSectionDetail from "../../forms/create/performance/formIppComSectionDetail";

var ct = require("../../../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions5();

class TableIppComSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editVisible: false,
      travelData: props.rawData,
      dataTableDetails: []
    };
  }

  openEdit = selectedIndex => {
    this.setState({ editVisible: !this.state.editVisible, selectedIndex });
  };

  data = [
    ["1", "A. Hasil Kerja", "60", "0", "0"],
    ["2", "A. Hasil Kerja", "40", "0", "0"]
  ];
  columns = [
    "No",
    "Component Type",
    "Weight",
    "Value",
    "Total Value",
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
                onClick={() => this.openEdit(tableMeta.rowIndex)}
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
                onClick={() => this.props.onClickDelete(tableMeta.rowIndex)}
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
            title={"Criteria Value"}
            data={this.props.dataTable}
            columns={this.columns}
            options={options}
          />
        </MuiThemeProvider>
        {this.state.editVisible && (
          <FormIPPComSectionDetail
            type={"update"}
            bizparActivityPlanSection={this.props.bizparActivityPlanSection}
            rawData={this.props.rawData[this.state.selectedIndex]}
            onClickSave={this.props.onClickSave.bind(this)}
            onClickClose={this.openEdit.bind(this)}
          />
        )}
      </div>
    );
  }
}
export default TableIppComSection;
