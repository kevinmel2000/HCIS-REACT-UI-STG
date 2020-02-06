import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"

var ct = require("../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

class FormTransactionImporMDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    columns = ["NIP Karyawan", "Nama Karyawan", "Komponent ID", "Nama Komponen", "Amount", "Create Date", "Modified By", "Modified ID", "Modified Name", "Modified Date"]
    data = [
        ["1000001", "TONY", "TONY_CUTI", "", "2,000,000", "20/05/2019", "1015", "1000001", "TONY", "20/05/19"]
    ]

    render() {
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px"></div>
                <div className="popup-content background-white border-radius">
                    <div className="padding-15px background-blue grid grid-2x">
                        <div className="col-1">
                            <div className="txt-site txt-12 txt-bold post-center">
                                TRANSACTION - IMPOR MULTIPLE - DETAIL
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button className="btn btn-circle background-blue" onClick={this.props.onClickClose}>
                                <i className="fa fa-lg fa-times"></i>
                            </button>
                        </div>
                    </div>
                    <div className="padding-15px">
                        <MuiThemeProvider theme={getMuiTheme()}>
                            <MUIDataTable
                                title='Detail'
                                data={this.data}
                                columns={this.columns}
                                options={options}
                            />
                        </MuiThemeProvider>
                    </div>

                    <div className="padding-15px">
                        <div className="grid grid-2x">
                            <div className="col-1"></div>
                            <div className="col-2 content-right">
                                <button
                                    style={{ marginLeft: "15px" }}
                                    className="btn btn-primary"
                                    type="button"
                                    onClick={this.props.onClickClose}>
                                    <span>CLOSE</span>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

export default FormTransactionImporMDetail