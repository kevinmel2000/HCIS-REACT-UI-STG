import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import FormChallenge from "../../forms/create/cnc/formChallenge";
import M from 'moment'

var ct = require("../../../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions5();

class TableChallenge extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editVisible: false,
      dataTableDetails: [],
      data: props.dataCnc
    }
  }

  componentDidMount = () => this.getDataTable()

  getDataTable() {
    let { data } = this.state
    let dataTableDetails = data.cncTPLData.contentSection.feebackSection.challengeItems.map((value) => {
      return ["CNCCI-" + M(), value]
    })
    this.setState({ dataTableDetails })
  }

  openEdit = selectedIndex => this.setState({ editVisible: !this.state.editVisible, selectedIndex })

  columns = [
    "Challenge ID",
    "Description",
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
            title={"Challenge Item"}
            data={this.state.dataTableDetails}
            columns={this.columns}
            options={options}
          />
        </MuiThemeProvider>
        {this.state.editVisible && (
          <FormChallenge
            type={"update"}
            onClickSave={this.props.onClickSave.bind(this)}
            onClickClose={this.openEdit.bind(this)}
            onClick={this.props.onDeletePopUp}
          />
        )}
      </div>
    );
  }
}
export default TableChallenge;
