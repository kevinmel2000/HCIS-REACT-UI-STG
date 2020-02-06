import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import FormOutCriteria from "../../forms/create/performance/formOutCriteria";

var ct = require("../../../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions5();

class TableOutputCri extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editVisible: false,
      dataTableDetails: [],
      data: props.rawData,
    };
  }

  componentDidMount() {
    this.getDataTable()
  }

  getDataTable() {
    let { ippOCVItems } = this.state.data
    let dataTableDetails = []
    if (ippOCVItems) {
      dataTableDetails = ippOCVItems.map((value, index) => {
        const { outputCriteriaValuationID, activityPlanCategory, activityPlanWeight, activityPlanUOM } = value
        return [
          index += 1,
          // 'Criteria Name',
          activityPlanCategory ? activityPlanCategory.bizparValue : 'Component Category',
          activityPlanWeight,
          activityPlanUOM
        ]
      })
    }
    this.setState({ dataTableDetails, rawData: ippOCVItems })
  }

  openEdit = selectedIndex => {
    this.setState({ editVisible: !this.state.editVisible, selectedIndex });
  };

  data = [
    ["1", "A. Hasil Kerja", "Project Improvement", "10", "10"],
    ["2", "A. Hasil Kerja", "Project management", "10", "10"]
  ];
  columns = [
    "No",
    // "Criteria Name",
    "Component Category",
    "Weight",
    "UoM",
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
                onClick={() => this.props.openDeletePopUp(tableMeta.rowIndex, 'outputCriteria')}
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
        <div className="display-flex-normal margin-bottom-5px">
          <div style={{ marginRight: "10px", width: "200px" }}>
            <div className="txt-site txt-bold txt-main txt-11 margin-bottom-5px">
              <h4>Weight</h4>
            </div>
            <input
              type="text"
              className="txt txt-sekunder-color"
              placeholder=""
              value={this.state.data.totalWeight}
              onChange={e => this.setState({ data: { ...this.state.data, totalWeight: e.target.value } })}
            />
          </div>
          <div style={{ marginTop: 22 }}>
            <button className="btn btn-blue" type="button">
              SAVE
            </button>
          </div>
        </div>
        <MuiThemeProvider theme={getMuiTheme()}>
          <MUIDataTable
            title={"Output Criteria"}
            data={this.state.dataTableDetails}
            columns={this.columns}
            options={options}
          />
        </MuiThemeProvider>
        {this.state.editVisible && (
          <FormOutCriteria
            type={"update"}
            bizparPerformancePlanComponent={this.props.bizparPerformancePlanComponent}
            bizparAppaItemComponent={this.props.bizparAppaItemComponent}
            bizparAchievement={this.props.bizparAchievement}
            bizparAppraisalType={this.props.bizparAppraisalType}
            bizparActivityPlanCategory={this.props.bizparActivityPlanCategory}
            bizparActivityPlanSection={this.props.bizparActivityPlanSection}
            rawData={this.state.rawData[this.state.selectedIndex]}
            onClickSave={this.props.onClickSave.bind(this)}
            onClickClose={this.openEdit.bind(this)}
          />
        )}
      </div>
    );
  }
}
export default TableOutputCri;
