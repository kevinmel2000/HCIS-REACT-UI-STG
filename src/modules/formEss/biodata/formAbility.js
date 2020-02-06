import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import LoadingBar from "react-top-loading-bar";
var ct = require("../../custom/customTable");

class FormAbility extends Component {
  constructor(props) {
    super(props);
    let{biodata} = this.props;
    this.state = {
      detailVisible: false,
      selectedIndex: null,
      rawData: [],
      dataTableAbility: [],
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

  columns = ["Ability", "Competence"];

  handlePopUp = () => {
    this.setState({
      savePopUpVisible: false

    })
  }

  render() {
    let dataTableAbility = this.state.biodata.map(value => {
      const {
        specialAbilityDescription,
        specialAbilityCompetencyType
      } = value;
      return [
        specialAbilityDescription,
        specialAbilityCompetencyType.bizparValue
      ];
    });
    return (
      <div className="main-content">
        <LoadingBar onRef={ref => (this.LoadingBar = ref)} />


        <div className="padding-5px">
          <MuiThemeProvider theme={this.getMuiTheme()}>
            <MUIDataTable
              title={"Professional Ability"}
              data={dataTableAbility}
              columns={this.columns}
              options={this.options}
            />
          </MuiThemeProvider>
        </div>
      </div>

    );
  }
}


export default FormAbility