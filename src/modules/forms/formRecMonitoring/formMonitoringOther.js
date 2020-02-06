import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import MUIDataTable from "mui-datatables-bitozen"

var ct = require("../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class FormMonitoringOther extends Component {
    constructor(props) {
        super(props)
        this.state = {
            monitoringData: props.monitoringData
        }
    }

    columnsOther = ["No", "Others Rule"];

    render() {
        let { monitoringData } = this.state
        let dataTableOther = monitoringData.recruitmentRequestOtherClauses.map((value, index) => {
            return [
                index +=1,
                value
            ]
        })
        return (
            <div className="vertical-tab-content active">
                <form action="#">
                    <div className="border-bottom padding-30px  grid-mobile-none gap-20px">
                        <MuiThemeProvider theme={getMuiTheme()}>
                            <MUIDataTable
                                title='Other'
                                data={dataTableOther}
                                columns={this.columnsOther}
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

export default FormMonitoringOther