import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import FormIPPCompHeader from "../../forms/create/performance/formIppCompHead"

var ct = require("../../../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions5();

class TableIppCompHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editVisible: false,
      dataTableDetails: [],
      data: props.rawData
    };
  }

  componentDidMount() {
    this.getTable()
  }

  getTable() {
    let { headerComponents } = this.state.data
    let dataTableDetails = []
    if (headerComponents) {
      dataTableDetails = headerComponents.map((value, index) => {
        const { headerDetailID, headerDetailComponent } = value
        return [
          index += 1,
          headerDetailID,
          headerDetailComponent ? headerDetailComponent.bizparValue : ''
        ]
      })
    }
    this.setState({ dataTableDetails, rawData: headerComponents })
  }

  openEdit = selectedIndex => {
    this.setState({ editVisible: !this.state.editVisible, selectedIndex });
  };

  data = [
    ["1", "ID-9292", "DIVISI"],
    ["2", "ID-9292", "NAMA"]
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
                onClick={() => this.props.openDeletePopUp(tableMeta.rowIndex, 'header')}
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
            title={"IPP Component Header"}
            data={this.state.dataTableDetails}
            columns={this.columns}
            options={options}
          />
        </MuiThemeProvider>
        {this.state.editVisible && (
          <FormIPPCompHeader
            type={"update"}
            bizparHeaderComponent={this.props.bizparHeaderComponent}
            headerID={this.state.data.headerID}
            rawData={this.state.rawData[this.state.selectedIndex]}
            onClickSave={this.props.onClickSave.bind(this)}
            onClickClose={this.openEdit.bind(this)}
          />
        )}
      </div>
    );
  }
}
export default TableIppCompHeader;
