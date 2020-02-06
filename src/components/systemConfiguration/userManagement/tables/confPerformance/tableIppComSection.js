import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import FormIPPComSection from "../../forms/create/performance/formIppComSection";

var ct = require("../../../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions5();

class TableIppComSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editVisible: false,
      data: props.rawData,
      dataTableDetails: []
    };
  }

  componentDidMount() {
    this.getDataTable()
  }

  getDataTable() {
    let { computeItems } = this.state.data
    let dataTableDetails = !computeItems ? [] : computeItems.map((value, index) => {
      const { computeID, computeType } = value
      return [
        index += 1,
        computeID,
        computeType ? computeType.bizparValue : 'Component Name'
      ]
    })
    this.setState({ dataTableDetails, rawData: computeItems })
  }

  openEdit = selectedIndex => {
    this.setState({ editVisible: !this.state.editVisible, selectedIndex });
  };

  data = [
    ["1", "ID-9292", "PERFORMANCE APPRAISAL MID YEAR"],
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
                onClick={() => this.props.openDeletePopUp(tableMeta.rowIndex, 'compute')}
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
            title={"IPP Compute Section"}
            data={this.state.dataTableDetails}
            columns={this.columns}
            options={options}
          />
        </MuiThemeProvider>
        {this.state.editVisible && (
          <FormIPPComSection
            type={"update"}
            bizparActivityPlanSection={this.props.bizparActivityPlanSection}
            rawData={this.state.rawData[this.state.selectedIndex]}
            bizparComputeType={this.props.bizparComputeType}
            bizparCorporateGrade={this.props.bizparCorporateGrade}
            onClickSave={this.props.onClickSave.bind(this)}
            onClickClose={this.openEdit.bind(this)}
          />
        )}
      </div>
    );
  }
}
export default TableIppComSection;
