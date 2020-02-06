import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import MUIDataTable from "mui-datatables-bitozen"

var ct = require("../../../../modules/custom/customTable");

class FormPTRU extends Component {

    getMuiTheme = () => createMuiTheme(ct.customTable());
    options = ct.customOptions();

    columns = [
        "No",
        "Transaction Number",
        "Upload Date",
        "Total",
        "Download",
        "Detail"
    ]

    dataTable = [
        ["1", "3123131", "12/2/2019", "test","","Pass"]
    ]

    render() {
        return (
            <div className="vertical-tab-content active">
                <form action="#">
                    <div className="border-bottom padding-10px grid-mobile-none gap-20px">
                        <MuiThemeProvider theme={this.getMuiTheme()}>
                            <MUIDataTable
                                title='Pre Test Result Upload'
                                data={this.dataTable}
                                columns={this.columns}
                                options={this.options}
                            />
                        </MuiThemeProvider>
                    </div>
                    <div className="padding-15px">
                        <div className="grid grid-2x">
                            <div className="col-1" />
                            <div className="col-2 content-right">
                                <button style={{
                                    marginLeft: "15px"
                                }}
                                    className="btn btn-primary"
                                    type="button"
                                    onClick={this.props.onClickClose}>
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

export default FormPTRU