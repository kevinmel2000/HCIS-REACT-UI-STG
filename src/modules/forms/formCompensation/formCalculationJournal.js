import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"

var ct = require("../../custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

class FormCalculationJournal extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    columns = ["No", "Component Debit", "Coa Debit", "Branch", "Location", "Transaction Type", "Component Credit", "Coa Creadit", "Branch", "Location", "Transaction Type", "Total Amount", "Description"]
    data = [
        ["1", "BASIC_SALARY", "6600001", "01", "01", "", "", "60002", "01", "01", "", "1826667", "0519 KANTOR PUSAT Basic Salary"],
        ["2", "POT_JHT_KARYAWAN", "6600001", "01", "01", "", "", "60002", "01", "01", "", "326667", "0519 KANTOR PUSAT Potongan BPJS TK JHT 2%"]
    ]

    render() {
        return (
            <div>
                <div className="padding-5px" style={{ width: "73%" }}>
                    <div className="padding-15px content-right">
                        <button type="button" className="btn btn-circle background-blue">
                            <i className='fa fa-1x fa-print'></i>
                        </button>
                    </div>
                    <MuiThemeProvider theme={getMuiTheme()}>
                        <MUIDataTable
                            data={this.data}
                            columns={this.columns}
                            options={options}
                        />
                    </MuiThemeProvider>
                </div>
            </div>
        )
    }
}

export default FormCalculationJournal