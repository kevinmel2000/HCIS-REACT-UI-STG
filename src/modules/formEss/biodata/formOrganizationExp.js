import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import LoadingBar from "react-top-loading-bar";
var ct = require("../../custom/customTable");

class FormOrganizationExp extends Component {
    constructor(props) {
        super(props);
        let {biodata} = this.props;
        this.state = {
            detailVisible: false,
            selectedIndex: null,
            rawData: [],
            dataTableOrgExp: [],
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

    columns = ["Star Date", "End Date", "Organization Name", "Position"];

    render() {
        let dataTableOrgExp = this.state.biodata.map(value => {
            const {
              orgExperienceStartDate,
              orgExperienceEndDate,
              orgExperienceName,
              orgExperiencePosition
            } = value;
            return [
              orgExperienceStartDate,
              orgExperienceEndDate,
              orgExperienceName,
              orgExperiencePosition
            ];
          });
        return (
            <div className="main-content">
                <LoadingBar onRef={ref => (this.LoadingBar = ref)} />


                <div className="padding-5px">
                    <MuiThemeProvider theme={this.getMuiTheme()}>
                        <MUIDataTable
                            title={"Organization Experience"}
                            data={dataTableOrgExp}
                            columns={this.columns}
                            options={this.options}
                        />
                    </MuiThemeProvider>
                </div>
            </div>

        );
    }
}


export default FormOrganizationExp