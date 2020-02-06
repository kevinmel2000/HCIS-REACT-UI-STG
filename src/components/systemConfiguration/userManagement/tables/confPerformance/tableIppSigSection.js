import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import FormIPPSigSection from "../../forms/create/performance/formIppSigSection";

var ct = require("../../../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions5();

class TableIppComSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editVisible: false,
      dataTableDetails: [],
      data: props.rawData
    };
  }

  componentDidMount() {
    this.getDataTable()
  }

  getDataTable() {
    let { signs } = this.state.data[0]
    let dataTableDetails = !signs ? [] : signs.map((value, index) => {
      const { signageID, signType } = value
      return [
        index += 1,
        signageID,
        signType ? signType.bizparValue : 'Component Name'
      ]
    })
    this.setState({ dataTableDetails, rawData: signs })
  }

  openEdit = selectedIndex => {
    this.setState({ editVisible: !this.state.editVisible, selectedIndex });
  };

  data = [
    ["1", "ID-9292", "PERFORMANCE PLAN"],
    ["2", "ID-9292", "PERFORMANCE APPRAISAL FULL YEAR"]
  ];
  columns = [
    "No",
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
    return (
      <div>
        <MuiThemeProvider theme={getMuiTheme()}>
          <MUIDataTable
            title={"IPP Signage Section"}
            data={this.state.dataTableDetails}
            columns={this.columns}
            options={options}
          />
        </MuiThemeProvider>
        {this.state.editVisible && (
          <FormIPPSigSection
            type={"update"}
            rawData={this.state.rawData[this.state.selectedIndex]}
            bizparSignType={this.props.bizparSignType}
            bizparSignPersonType={this.props.bizparSignPersonType}
            bizparSignPersonTypeItem={this.props.bizparSignPersonTypeItem}
            onClickSave={this.props.onClickSave.bind(this)}
            onClickClose={this.openEdit.bind(this)}
          />
        )}
      </div>
    );
  }
}
export default TableIppComSection;
