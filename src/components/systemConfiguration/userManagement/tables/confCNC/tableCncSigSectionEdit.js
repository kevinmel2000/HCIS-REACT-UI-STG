import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import FormCncSigSectionDetail from "../../forms/create/cnc/formCncSigSectionDetail";

var ct = require("../../../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions5();

class TableCncSigSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editVisible: false,
      dataTableItems: props.dataTableDetail ? props.dataTableDetail : [],
      data: props.data
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.dataTableDetail !== prevProps.dataTableDetail) return this.setState({ dataTableItems: this.props.dataTableDetail, data: this.props.data })
  }

  openEdit = selectedIndex => this.setState({ editVisible: !this.state.editVisible, selectedIndex })

  columns = [
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
                onClick={() => this.props.onDeletePopUp}
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
            title={"Signage Item"}
            subtitle={"Signage Item"}
            data={this.state.dataTableItems}
            columns={this.columns}
            options={options}
          />
        </MuiThemeProvider>
        {this.state.editVisible && (
          <FormCncSigSectionDetail
            type={"edit"}
            data={this.state.data[this.state.selectedIndex]}
            onClickSave={this.props.onClickSave.bind(this)}
            onClickClose={this.openEdit.bind(this)}
            onClick={this.props.onDeletePopUp}
          />
        )}
      </div>
    );
  }
}
export default TableCncSigSection;
