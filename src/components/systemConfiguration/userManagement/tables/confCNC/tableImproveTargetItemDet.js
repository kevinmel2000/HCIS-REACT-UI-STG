import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import FormImproveDetail from "../../forms/create/cnc/formImproveDetail";

var ct = require("../../../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions5();

class TableImproveDet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editVisible: false,
      dataTableDetails: [],
      type: props.type,
      data: props.data
    };
  }

  componentDidMount = () => this.getDataTable()

  getDataTable() {
    let { data } = this.state
    let dataTableDetails = data.improveTargetItems.map((value) => {
      return [value.improveTargetItemID, value.improveTargetComponent ? value.improveTargetComponent : "-"]
    })
    this.setState({ dataTableDetails })
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
    let { data, dataTableDetails, selectedIndex } = this.state
    return (
      <div>
        <MuiThemeProvider theme={getMuiTheme()}>
          <MUIDataTable
            title={"Improve Target Sub Item"}
            data={dataTableDetails}
            columns={this.columns}
            options={options}
          />
        </MuiThemeProvider>
        {this.state.editVisible && (
          <FormImproveDetail
            type={"edit"}
            data={data.improveTargetItems[selectedIndex]}
            onClickSave={this.props.onClickSave.bind(this)}
            onClickClose={this.openEdit.bind(this)}
            onClick={this.props.onDeletePopUp}
          />
        )}
      </div>
    );
  }
}
export default TableImproveDet;
