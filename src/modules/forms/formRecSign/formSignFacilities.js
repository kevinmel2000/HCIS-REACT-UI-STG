import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"

let ct = require("../../custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

class FormSignFacilities extends Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    columns = [
        "Facility Type",
        "Facility Category",
        "Total"
    ]

    render () {
        const data = [
            [
                "Dummy", "Dummy", "Dummy"
            ],
            [
                "Dummy", "Dummy", "Dummy"
            ],
            [
                "Dummy", "Dummy", "Dummy"
            ]
        ]
        return (
            <div className="vertical-tab-content active">
                <form action="#">
                    <div className="padding-15px">

                        <MuiThemeProvider theme={getMuiTheme()}>
                            <MUIDataTable
                                data={data}
                                columns={this.columns}
                                options={options}
                            />
                        </MuiThemeProvider>

                    </div>
                    {this.props.type !== "view" ?
                    <div className="padding-15px">
                        
                    </div> : null}
                    <div className="padding-15px">
                        <div className="grid grid-2x">
                            <div className="col-1" />
                            <div className="col-2 content-right">
                            <button
                                style={{ marginLeft: "15px" }}
                                className="btn btn-blue"
                                onClick={this.props.onClickClose}
                                type="button">
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

export default FormSignFacilities;