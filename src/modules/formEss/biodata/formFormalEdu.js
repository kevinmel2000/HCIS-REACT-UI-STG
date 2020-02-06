import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import LoadingBar from "react-top-loading-bar";
var ct = require("../../custom/customTable");

class FormFormalEdu extends Component {
  constructor(props) {
    super(props);
    let { biodata } = this.props
    this.state = {
      detailVisible: false,
      selectedIndex: null,
      rawData: [],
      dataTableFormal: [],
      biodata 
    };
  }

  componentDidMount() {
    this.onFinishFetch()
  }

  startFetch = () => {
    this.LoadingBar.continousStart();
  };

  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
  };

  getMuiTheme = () => createMuiTheme(ct.customTable());

  options = ct.customOptions();

  columns = [

    "Start Date",
    "End Date",
    "Education Level",
    "Institution Name",
    "Major",
    "District",
    "GPA"
  ];

  render() {
    let dataTableFormal = this.state.biodata.map(value => {
      const {
        formalEducationStartDate,
        formalEducationEndDate,
        formalEducationLevel,
        formalEducationInstitute,
        formalEducationDepartment,
        formalEducationCity,
        formalEducationIPK
      } = value;
      return [
        formalEducationStartDate,
        formalEducationEndDate,
        formalEducationLevel.bizparValue,
        formalEducationInstitute.instituteName,
        formalEducationDepartment.bizparValue,
        formalEducationCity,
        formalEducationIPK
      ];
    });
    return (
      <div className="main-content">
        <LoadingBar onRef={ref => (this.LoadingBar = ref)} />


        <div className="padding-5px">
          <MuiThemeProvider theme={this.getMuiTheme()}>
            <MUIDataTable
              title={"Formal Education"}
              data={dataTableFormal}
              columns={this.columns}
              options={this.options}
            />
          </MuiThemeProvider>
        </div>
      </div>

    );
  }
}


export default FormFormalEdu