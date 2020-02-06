import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"

var ct = require("../../../../../modules/custom/customTable")

class PayrollTemplateDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [
                [
                    '0001',
                    'YES',
                    'NPWP Pemotong',
                    'A',
                    'ID-WP',
                    'GROSSUP',
                    'YES',
                    'YES'
                ],
                [
                    '0002',
                    'YES',
                    'NPWP Pemotong',
                    'A',
                    'ID-WP',
                    'GROSSUP',
                    'YES',
                    'YES'
                ]
            ]
        }
    }

    getMuiTheme = () => createMuiTheme(ct.customTable());

    options = ct.customOptions()

    columns = [
        "TID",
        "Segment",
        "Component",
        "Name",
        "Default",
        "Tax Type",
        {
            name: "Activation",
            options: {
                customBodyRender: (val) => {
                    return (
                        <label
                            style={{
                                backgroundColor: val === "YES" ? "green" : "brown",
                                color: "white",
                                padding: "5px",
                                borderRadius: 4,
                                fontSize: "14px",
                                border: val === "YES" ? "4px green" : "4px brown"
                            }}
                        >
                            {val}
                        </label>
                    );
                }
            }
        },
        {
            name: "Action",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        <div>
                            <button
                                className="btn btn-blue btn-small-circle margin-right-5px"
                                type='button'
                                onClick={this.props.openSlide}
                            >
                                <i className="fa fa-lw fa-pencil-alt" />
                            </button>
                            <button
                                className="btn btn-red btn-small-circle"
                                type='button'
                                onClick={this.props.onDeletePopup}
                            >
                                <i className="fa fa-lw fa-trash-alt" />
                            </button>
                        </div>
                    )
                }
            }
        }
    ]

    render() {
        return (
            <div>
                <MuiThemeProvider theme={this.getMuiTheme()}>
                    <MUIDataTable
                        title={"Payroll Template Detail"}
                        data={this.state.data}
                        columns={this.columns}
                        options={this.options} />
                </MuiThemeProvider>
            </div>
        )
    }
}
export default PayrollTemplateDetail