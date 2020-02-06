import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import LoadingBar from "react-top-loading-bar";
var ct = require("../../custom/customTable");

class FormWorkExp extends Component {
    constructor(props) {
        super(props);
        let {biodata} = this.props;
        this.state = {
          detailVisible: false,
            selectedIndex: null,
            rawData: [],
            dataTableWorkExp:[],
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
    columns = ["Star Date", "End Date", "Position", "Company Name", "District"];
    render() {
        let dataTableWorkExp = this.state.biodata.map(value => {
            const {
              workExperienceStartDate,
              workExperienceEndDate,
              workExperiencePosition,
              workExperienceCompany,
              workExperienceCity
            } = value;
            return [
              workExperienceStartDate,
              workExperienceEndDate,
              workExperiencePosition,
              workExperienceCompany,
              workExperienceCity
            ];
          });
        return (
            <div className="main-content">
                <LoadingBar onRef={ref => (this.LoadingBar = ref)} />


                <div className="padding-5px">
                    <MuiThemeProvider theme={this.getMuiTheme()}>
                        <MUIDataTable
                            title={"Work Experience"}
                            data={dataTableWorkExp}
                            columns={this.columns}
                            options={this.options}
                        />
                    </MuiThemeProvider>
                </div>
            </div>

        );
    }
}


export default FormWorkExp