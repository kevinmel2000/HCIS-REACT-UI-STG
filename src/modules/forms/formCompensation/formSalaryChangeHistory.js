import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"

var ct = require("../../custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

class FormSalaryChangeHistory extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    columns = [
        "No",
        {
            name: "Approval Status",
            options: {
                customBodyRender: (val) => {
                    return (
                        <div className="grid grid-2x">
                            <div className="column-1"> {val} </div>
                            <div className="column-2 content-right">
                                <i className="fas fa-lw fa-check-square" style={{ marginRight: 10 }} />
                                <label
                                    style={{
                                        backgroundColor: "brown",
                                        color: "white",
                                        padding: "5px",
                                        borderRadius: 4,
                                        fontSize: "14px",
                                        border: "4px brown"
                                    }}
                                >
                                    Disetujui
                                </label>
                            </div>
                        </div>
                    );
                }
            }
        },
        "Approver",
        "Comment"
    ]
    data = [["1", "2019-05-23 10:14 Telah disetujui oleh Atasan terakhir (10000018 - LILYANA TAN)", "10000018 LILYANA TAN", "ACC."]]

    render() {
        return (
            <div className="vertical-tab-content active">
                <div className="padding-5px" />
                <MuiThemeProvider theme={getMuiTheme()}>
                    <MUIDataTable
                        title='History'
                        data={this.data}
                        columns={this.columns}
                        options={options}
                    />
                </MuiThemeProvider>
            </div>
        )
    }
}

export default FormSalaryChangeHistory