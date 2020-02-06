import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";

import FormProCriteria from "../../forms/create/performance/formProCriteria";

var ct = require("../../../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions5();

class TableProcessCri extends Component {
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
    let { ippOCVItems } = this.props.rawData
    let dataTableDetails = !ippOCVItems ? [] : ippOCVItems.map((value, index) => {
      const { activityPlanSection, activityPlanWeightPerformance, subCriteria } = value
      return [
        index += 1,
        activityPlanSection ? activityPlanSection.bizparValue : '',
        subCriteria.criteriaCategory ? subCriteria.criteriaCategory.bizparValue : '',
        subCriteria.criteriaExplanation,
        activityPlanWeightPerformance
      ]
    })
    this.setState({ dataTableDetails, rawData: ippOCVItems })
  }

  openEdit = selectedIndex => {
    this.setState({ editVisible: !this.state.editVisible, selectedIndex });
  };

  data = [
    [
      "1",
      "B. Hasil Kerja",
      "Project Improvement",
      "Membangun pola pikir yang baik",
      "10"
    ],
    [
      "2",
      "B. Hasil Kerja",
      "Project management",
      "Membangun pola pikir yang baik",
      "10"
    ]
  ];
  columns = [
    "No",
    "Criteria Name",
    "Component Category",
    "Category Description",
    "Weight",
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
                onClick={() => this.props.openDeletePopUp(tableMeta.rowIndex, 'processCriteria')}
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
            <button className="btn btn-blue" type="button" onClick={() => this.props.onClickSave('weightProcess', this.state.data)}>
              SAVE
            </button>
          </div>
        </div>
        <MuiThemeProvider theme={getMuiTheme()}>
          <MUIDataTable
            title={"Process Criteria"}
            data={this.state.dataTableDetails}
            columns={this.columns}
            options={options}
          />
        </MuiThemeProvider>
        {this.state.editVisible && (
          <FormProCriteria
            type={"update"}
            bizparActivityPlanSection={this.props.bizparActivityPlanSection}
            bizparCriteriaCategory={this.props.bizparCriteriaCategory}
            bizparPerformaceValue={this.props.bizparPerformaceValue}
            bizparPerformaceType={this.props.bizparPerformaceType}
            rawData={this.state.rawData[this.state.selectedIndex]}
            onClickSave={this.props.onClickSave.bind(this)}
            onClickClose={this.openEdit.bind(this)}
          />
        )}
      </div>
    );
  }
}
export default TableProcessCri;
