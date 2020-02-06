import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import FormArea from "../../forms/create/cnc/formArea";

var ct = require("../../../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions5();

class TableCncArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editVisible: false,
      dataTableDetails: [],
      dataCnc: props.dataCnc
    }
  }

  componentDidMount = () => this.getDataArea()

  getDataArea() {
    let { dataCnc } = this.state
    let dataTableDetails = dataCnc.cncTPLData.contentSection.areaDevelopmentSection.items.map((value) => {
      return [value.areaDevelopmentSectionItemID, value.areaDevelopmentSectionItemCategory ? value.areaDevelopmentSectionItemCategory : "-"]
    })
    this.setState({ dataTableDetails })
  }

  openEdit = selectedIndex => this.setState({ editVisible: !this.state.editVisible, selectedIndex })

  columns = [
    "Component ID",
    "Component Type",
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
            title={"Area Development"}
            data={dataTableDetails}
            columns={this.columns}
            options={options}
          />
        </MuiThemeProvider>
        {this.state.editVisible && (
          <FormArea
            type={"edit"}
            data={dataCnc.cncTPLData.contentSection.areaDevelopmentSection.items[selectedIndex]}
            onClickSave={this.props.onClickSave.bind(this)}
            onClickClose={this.openEdit.bind(this)}
          />
        )}
      </div>
    );
  }
}
export default TableCncArea;
