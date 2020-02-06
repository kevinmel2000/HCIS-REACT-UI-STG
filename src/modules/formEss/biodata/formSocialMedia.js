import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import LoadingBar from "react-top-loading-bar";
var ct = require("../../custom/customTable");

class FormSocialMedia extends Component {
    constructor(props) {
        super(props);
        let {biodata} = this.props;
        this.state = {
          detailVisible: false,
            selectedIndex: null,
            rawData: [],
            dataTableSocialMedia:[],
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

        "Social Media Type",
        "Username"
    ];

    dataSocialMedia = [
        ["Instagram", "lilly"]
    ]

    render() {
        let dataTableSocialMedia = this.state.biodata.map(value => {
            const {
            socialMediaType,
            username
            } = value;
            return [
                socialMediaType.bizparValue,
                username            ];
          });
        return (
            <div className="main-content">
                <LoadingBar onRef={ref => (this.LoadingBar = ref)} />


                <div className="padding-5px">
                    <MuiThemeProvider theme={this.getMuiTheme()}>
                        <MUIDataTable
                            title={"Social Media"}
                            data={dataTableSocialMedia}
                            columns={this.columns}
                            options={this.options}
                        />
                    </MuiThemeProvider>
                </div>
            </div>

        );
    }
}


export default FormSocialMedia