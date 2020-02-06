import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import MUIDataTable from "mui-datatables-bitozen"

var ct = require("../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class FormMonitoringPosition extends Component {
    constructor(props) {
        super(props)
        this.state = {
            monitoringData: props.monitoringData
        }
    }

    columnsPosition = [
        "No",
        "Position",
        "Position Name",
        "Quota"
    ];

    render() {
        let { monitoringData } = this.state
        let dataTablePosition = monitoringData.recruitmentRequestPositionDTOs.map((value, key) => {
            const { positionID, positionName, positionQuota } = value;
            return [
                key += 1,
                positionID,
                positionName,
                positionQuota,
            ]
        })
        return (
            <div className="vertical-tab-content active">
                <form action="#">
                    <div className="border-bottom padding-30px  grid-mobile-none gap-20px">
                        <MuiThemeProvider theme={getMuiTheme()}>
                            <MUIDataTable
                                data={dataTablePosition}
                                columns={this.columnsPosition}
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

export default FormMonitoringPosition