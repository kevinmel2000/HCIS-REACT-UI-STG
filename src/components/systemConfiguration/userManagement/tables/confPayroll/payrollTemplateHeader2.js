import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"

var ct = require("../../../../../modules/custom/customTable")

class PayrollTemplateHeader2 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [
                [
                    '0001',
                    'Holding',
                    'YES',
                    'HO-Payslip-Tpl',
                    'NULL',
                    '22-08-19/22-08-24',
                    'YES'
                ],
                [
                    '0002',
                    'Branch',
                    'YES',
                    'BO-Payslip-Tpl',
                    '0001',
                    '22-08-19/22-08-24',
                    'YES'
                ]
            ]
        }
    }

    getMuiTheme = () => createMuiTheme(ct.customTable());

    options = ct.customOptions()

    columns = [
        "TID",
        "Type",
        "Default",
        "Name",
        "Parent",
        "Periode",
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
                                className="btn btn-green btn-small-circle margin-right-5px"
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
                        title={"Payroll Template Header"}
                        data={this.state.data}
                        columns={this.columns}
                        options={this.options} />
                </MuiThemeProvider>
            </div>
        )
    }
}
export default PayrollTemplateHeader2