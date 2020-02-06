import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import LoadingBar from "react-top-loading-bar";
var ct = require("../../custom/customTable");

class FormWorkingHistory extends Component {
    constructor(props) {
        super(props);
        let {biodata} = this.props;
        this.state = {
          detailVisible: false,
            selectedIndex: null,
            rawData: [],
            dataTableWS:[],
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
        "Position",
        "Branch"
    ];

    dataWorkingHistory = [
        ["13 MEI 2017", "17 MEI 2019", "MANAGER", "JAKARTA SELATAN"]
    ]

    

    render() {
        let dataTableWS = this.state.biodata.map(value => {
            const {
              workExperienceStartDate,
              workExperienceEndDate,
              workExperiencePosition,
              workExperienceCompany
            } = value;
            return [
                workExperienceStartDate,
                workExperienceEndDate,
                workExperiencePosition,
                workExperienceCompany
            ];
          });
        return (
            <div className="main-content">
                <LoadingBar onRef={ref => (this.LoadingBar = ref)} />


                <div className="padding-5px">
                    <MuiThemeProvider theme={this.getMuiTheme()}>
                        <MUIDataTable
                            title={"History Position"}
                            data={dataTableWS}
                            columns={this.columns}
                            options={this.options}
                        />
                    </MuiThemeProvider>
                </div>
            </div>

        );
    }
}


export default FormWorkingHistory