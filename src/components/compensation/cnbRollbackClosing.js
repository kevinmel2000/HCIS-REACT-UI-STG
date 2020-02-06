import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import PopUp from '../pages/PopUpAlert'

var ct = require("../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

class RollbackClosing extends Component {
    constructor(props) {
        super(props)
        this.state = {
            savePopUpVisible: false
        }
    }

    openSavePopUp = () => {
        this.setState({ savePopUpVisible: !this.state.savePopUpVisible })
    }

    columns = [
        "ID Calculation",
        "Period",
        "Transaction Date",
        "Process Type",
        "Employee",
        "Transaction",
        "Amount",
        {
            name: "Rollback",
            options: {
                customBodyRender: () => {
                    return (
                        <button
                            className="btn btn-blue btn-small-circle"
                            style={{ marginRight: 5 }}
                            onClick={this.openSavePopUp}>
                            <i className="fa fa-lw fa-undo" />
                        </button>
                    )
                }
            }
        }
    ]

    data = [["1908271351", "201907", "27 Juli 2019 13:51", "PAYROLL", "164", "0", "191,866,667"]]

    render() {
        let { savePopUpVisible } = this.state
        return (
            <div className="main-content">
                <div className="padding-15px">
                    <div className="txt-site txt-18 txt-bold txt-main padding-top-5px">
                        {/* COMPENSATION - ROLLBACK CLOSING */}
                    </div>
                </div>

                <div className="padding-5px">
                    <MuiThemeProvider theme={getMuiTheme()}>
                        <MUIDataTable
                            title='Rollback Closing'
                            data={this.data}
                            columns={this.columns}
                            options={options}
                        />
                    </MuiThemeProvider>
                </div>

                {savePopUpVisible && (
                    <PopUp
                        type={"save"}
                        class={"app-popup app-popup-show"}
                        onClick={this.openSavePopUp.bind(this)}
                    />
                )}
            </div>
        )
    }
}

export default RollbackClosing