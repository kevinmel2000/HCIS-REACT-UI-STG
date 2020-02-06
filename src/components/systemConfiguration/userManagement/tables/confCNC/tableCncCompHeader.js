import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import FormCncCompHead from "../../forms/create/cnc/formCncCompHead";

var ct = require("../../../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions5();

class TableCncCompHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editVisible: false,
      dataTableDetails: [],
      dataCnc: props.dataCnc
    };
  }

  componentDidMount = () => this.getData()

  getData = () => {
    let { dataCnc } = this.state
    let dataTableDetails = dataCnc.cncTPLData.header.components.map((value) => {
      const { cncHeaderSectionItemID, cncHeaderSectionItemValue } = value
      return [ cncHeaderSectionItemID, cncHeaderSectionItemValue ]
    })
    this.setState({ dataTableDetails })
  }

  openEdit = selectedIndex => this.setState({ editVisible: !this.state.editVisible, selectedIndex })

  data = [
    ["1", "ID-9292", "DIVISI"],
    ["2", "ID-9292", "NAMA"]
  ];
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
                onClick={this.props.onDeletePopup}
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
    let { dataCnc, dataTableDetails, selectedIndex } = this.state
    return (
      <div>
        <MuiThemeProvider theme={getMuiTheme()}>
          <MUIDataTable
            title={"CNC Component Header"}
            subtitle={"CNC Component Header"}
            data={dataTableDetails}
            columns={this.columns}
            options={options}
          />
        </MuiThemeProvider>
        {this.state.editVisible && (
          <FormCncCompHead
            type={"edit"}
            data={dataCnc.cncTPLData.header.components[selectedIndex]}
            onClickSave={this.props.onClickSave.bind(this)}
            onClickClose={this.openEdit.bind(this)}
          />
        )}
      </div>
    );
  }
}
export default TableCncCompHeader;
