import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import PayrollCurrent from '../../modules/forms/formCompensation/payrollCurrent'
import PayrollHistory from '../../modules/forms/formCompensation/payrollHistory'

var ct = require("../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

class CnbPayroll extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentVisible: false,
            historyVisible: false
        }
    }

    openCurrentForm = () => {
        this.setState({ currentVisible: !this.state.currentVisible })
    }
    
    openHistoryForm = () => {
        this.setState({ historyVisible: !this.state.historyVisible })
    }

    columns = [
        "No",
        "NIK",
        "Employee Name",
        "ID Card",
        "NPWP",
        "Join Date",
        {
            name: "History",
            options: {
                customBodyRender: () => {
                    return (
                        <button
                            className="btn btn-blue btn-small-circle"
                            style={{ marginRight: 5 }}
                            onClick={this.openHistoryForm}>
                            <i className="fa fa-lw fa-history" />
                        </button>
                    )
                }
            }
        },
        {
            name: "Current",
            options: {
                customBodyRender: () => {
                    return (
                        <button
                            className="btn btn-blue btn-small-circle"
                            style={{ marginRight: 5 }}
                            onClick={this.openCurrentForm}>
                            <i className="fas fa-lw fa-ellipsis-h" />
                        </button>
                    )
                }
            }
        }
    ]

    data = [
        ["1", "1000001", "TONY", "3173333333", "477777777", "12-09-2019"],
        ["2", "1000002", "ADITYA", "3174444444", "4888888888", "24-09-2019"],
    ]

    render() {
        let { currentVisible, historyVisible } = this.state
        return (
            <div className="main-content">
                <div className="padding-15px">
                    <div className="txt-site txt-18 txt-bold txt-main padding-top-5px">
                        {/* COMPENSATION - PAYROLL STRUCTURE */}
                    </div>
                </div>

                <div className="padding-5px">
                    <MuiThemeProvider theme={getMuiTheme()}>
                        <MUIDataTable
                            title='Payroll Structure'
                            subtitle={"lorem ipsum dolor"}
                            data={this.data}
                            columns={this.columns}
                            options={options}
                        />
                    </MuiThemeProvider>
                </div>
                
                {historyVisible && (
                    <PayrollHistory 
                        onClickClose={this.openHistoryForm.bind(this)}
                    />
                )}

                {currentVisible && (
                    <PayrollCurrent 
                        onClickClose={this.openCurrentForm.bind(this)}
                    />
                )}

            </div>
        )
    }
}

export default CnbPayroll