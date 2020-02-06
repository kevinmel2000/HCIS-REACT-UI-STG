import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import LoadingBar from "react-top-loading-bar";
var ct = require("../../custom/customTable");

class FormInformalEdu extends Component {
  constructor(props) {
    super(props);
    let { biodata } = this.props;
    this.state = {
      detailVisible: false,
      selectedIndex: null,
      rawData: [],
      dataTableInformal: [],
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
    "Training Name",
    "Certificate Number",
    "Intitution Name"
  ];

  render() {
    let dataTableInformal = this.state.biodata.map(value => {
      const {
        informalEducationStartDate,
        informalEducationEndDate,
        informalEducationName,
        informalEducationCertificateNumber,
        informalEducationInstituteName
      } = value;
      return [
        informalEducationStartDate,
        informalEducationEndDate,
        informalEducationName,
        informalEducationCertificateNumber,
        informalEducationInstituteName
      ];
    });
    return (
      <div className="main-content">
        <LoadingBar onRef={ref => (this.LoadingBar = ref)} />


        <div className="padding-5px">
          <MuiThemeProvider theme={this.getMuiTheme()}>
            <MUIDataTable
              title={"Informal Education"}
              data={dataTableInformal}
              columns={this.columns}
              options={this.options}
            />
          </MuiThemeProvider>
        </div>
      </div>

    );
  }
}


export default FormInformalEdu