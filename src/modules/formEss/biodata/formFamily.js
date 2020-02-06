import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import LoadingBar from "react-top-loading-bar";
var ct = require("../../custom/customTable");

class FormFamily extends Component {
  constructor(props) {
    super(props);
    let { biodata } = this.props;
    this.state = {
      detailVisible: false,
      selectedIndex: null,
      rawData: [],
      dataTableFamily: [],
      biodata
    };
  }

  componentDidMount() {
    this.onFinishFetch();
  }

  startFetch = () => {
    this.LoadingBar.continousStart();
  };

  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
  };

  getMuiTheme = () => createMuiTheme(ct.customTable());

  options = ct.customOptions();

  columns = ["Family Name", "Relationship", "Gender", "Education", "Insurance"];

  dataFamily = [["TANYONO", "AYAH KANDUNG", "MALE", "-", "TIDAK"]];

  render() {
    let dataTableFamily = this.state.biodata.map(value => {
      const {
        familyName,
        familyRelationshipType,
        familyGenderType,
        familyEducationLevel
      } = value;
      return [
        familyName,
        familyRelationshipType.bizparValue,
        familyGenderType.bizparValue,
        familyEducationLevel.bizparValue,
      ];
    });
    return (
      <div className="main-content">
        <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
        <div className="padding-5px">
          <MuiThemeProvider theme={this.getMuiTheme()}>
            <MUIDataTable
              title={"Family"}
              data={dataTableFamily}
              columns={this.columns}
              options={this.options}
            />
          </MuiThemeProvider>
        </div>
      </div>
    );
  }
}

export default FormFamily;
