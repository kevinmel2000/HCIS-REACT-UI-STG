import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";

import FormProAppraisalComp from "../../forms/create/performance/formProAppraisalComp";

var ct = require("../../../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions5();

class TablePerfAppraisalComp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editVisible: false,
    };
  }

  openEdit = selectedIndex => {
    this.setState({ editVisible: !this.state.editVisible, selectedIndex });
  };

  data = [
    ["1", "ID-9292", "Component Name"],
    ["2", "ID-9292", "tblPerfAppraisalComp"]
  ];
  columns = [
    "No",
    "Component ID",
    "Component Name",
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
                onClick={() => this.props.onDeletePopUp(tableMeta.rowIndex)}
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
            title={"Appraisal Component Value"}
            data={this.props.dataTable}
            columns={this.columns}
            options={options}
          />
        </MuiThemeProvider>
        {this.state.editVisible && (
          <FormProAppraisalComp
            type={"update"}
            bizparAppaItemComponent={this.props.bizparAppaItemComponent}
            rawData={this.props.rawData[this.state.selectedIndex]}
            onClickSave={this.props.onClickSave.bind(this)}
            onClickClose={this.openEdit.bind(this)}
          />
        )}
      </div>
    );
  }
}
export default TablePerfAppraisalComp;
