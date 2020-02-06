import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"

var ct = require("../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

class FormSalaryChangeDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    columns = ["Import ID", "NIP Karyawan", "Nama Karyawan", "Component", "Efektif Date"]
    data = [["27", "10000016", "IKHLAS IKA PUTRA", "20,000,000", "13/06/2018"]]

    render() {
        return (
            <div className="vertical-tab-content active">
                <div className="padding-5px" />
                <MuiThemeProvider theme={getMuiTheme()}>
                    <MUIDataTable
                        title='Detail'
                        data={this.data}
                        columns={this.columns}
                        options={options}
                    />
                </MuiThemeProvider>
            </div>
        )
    }
}

export default FormSalaryChangeDetail