import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import FormCalculationSalaryDetail from './formCalculationSalaryDetail'

var ct = require("../../custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

class FormCalculationSalary extends Component {
    constructor(props) {
        super(props)
        this.state = {
            detailVisible: false
        }
    }

    openDetailForm = () => {
        this.setState({ detailVisible: !this.state.detailVisible })
    }

    columns = [
        "No", 
        {
            name: "NIK",
            options: {
                customBodyRender: (val) => {
                    return (
                        <div style={{ cursor: "pointer" }} onClick={() => this.openDetailForm()}>
                            {val}
                        </div>
                    )
                }
            }
        },
        "Employee Name", "Join Date", "Gender", "End Date", "Employee Type", "PTKP Status"]
    data = [
        ["1", "100001", "TJOENG SUYANTO", "01/08/19", "MALE", "", "DIREKTUR", "TK2"],
        ["2", "100010", "VIKA MANDASARI", "01/09/19", "FEMALE", "", "PERCOBAAN", "TK0"]
    ]

    render() {
        let { detailVisible } = this.state
        return (
            <div>
                <MuiThemeProvider theme={getMuiTheme()}>
                    <MUIDataTable
                        data={this.data}
                        columns={this.columns}
                        options={options}
                    />
                </MuiThemeProvider>

                {detailVisible && (
                    <FormCalculationSalaryDetail 
                        type={"salary"}
                        onClickClose={this.openDetailForm.bind(this)}
                    />
                )}
            </div>
        )
    }
}

export default FormCalculationSalary