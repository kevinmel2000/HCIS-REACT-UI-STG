import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import MUIDataTable from "mui-datatables-bitozen"

var ct = require("../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class FormSppdCost extends Component {
    constructor(props) {
        super(props)
        this.state = {
            sppdData: props.sppdData
        }
    }

    columnsCost = [
        "No",
        "Implementor Status",
        "NIK",
        "Employee Name",
        "Position",
        "Email",
        "Total Cost",
        {
            name: "Document Status",
            options: {
                customBodyRender: () => {
                    return (
                        <div>
                            <input type="checkbox" disabled />
                        </div>
                    );
                }
            }
        }
    ];

    dataCost = [
        [
            "DATA DUMMY",
            "DATA DUMMY",
            "DATA DUMMY",
            "DATA DUMMY",
            "DATA DUMMY",
            "DATA DUMMY",
            "DATA DUMMY"
        ]
    ];

    render() {
        return (
            <div className="vertical-tab-content active">
                <form action="#">
                    <div className="padding-5px app-main-helped">
                        <MuiThemeProvider theme={getMuiTheme()}>
                            <MUIDataTable
                                title='Cost'
                                data={this.dataCost}
                                columns={this.columnsCost}
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
                                    className="btn btn-blue"
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

export default FormSppdCost