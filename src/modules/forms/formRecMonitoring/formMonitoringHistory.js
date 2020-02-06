import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import MUIDataTable from "mui-datatables-bitozen"

var ct = require("../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class FormMonitoringHistory extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    columnsHistory = ["No", "Approval Status", "", "Approver", "Comment"];

    dataHistory = [
        [
            "1",
            "2019-05-23 10:14 Telah disetujui oleh Atasan terakhir (10000018 - LILYANA TAN)",
            <label
                style={{
                    backgroundColor: "brown",
                    color: "white",
                    padding: "5px",
                    borderRadius: 4,
                    fontSize: "14px",
                    border: "4px brown"
                }}
            >
                Disetujui
            </label>,
            "10000018 LILYANA TAN",
            "ACC."
        ]
    ];

    render() {
        return (
            <div className="vertical-tab-content active">
                <form action="#">
                    <div className="border-bottom padding-30px grid-mobile-none gap-20px">
                        <MuiThemeProvider theme={getMuiTheme()}>
                            <MUIDataTable
                                title='History'
                                data={this.dataHistory}
                                columns={this.columnsHistory}
                                options={options}
                            />
                        </MuiThemeProvider>
                    </div>
                    <div className="padding-15px">
                        <div className="grid grid-2x">
                            <div className="col-1" />
                            <div className="col-2 content-right">
                                <button
                                    style={{ marginLeft: "15px" }}
                                    className="btn btn-primary"
                                    type="button"
                                    onClick={this.props.onClickClose}
                                >
                                    <span>CLOSE</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default FormMonitoringHistory