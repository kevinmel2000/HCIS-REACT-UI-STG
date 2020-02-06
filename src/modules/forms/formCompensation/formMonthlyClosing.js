import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"

var ct = require("../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

class FormMonthlyClosing extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    columns = ["Closing ID", "Employee ID", "Kode Cabang", "Nama Cabang", "Kode Lokasi", "Nama Lokasi", "KPP Area", "Period", "Masa Pajak", "Tahun Pajak", "Pembetul", "Npwp", "Nama Karyawan", "Kode Pajak", "Bruto", "PPh", "Kode Negara"]
    data = [["20190828", "1009", "1", "KANTOR PUSAT", "1", "KANTOR PUSAT", "KANTOR PUSAT", "201907", "7", "2019", "0", "888888888888888", "VIKA MANDASARI", "20-100-01", "1060142", "0", ""]]

    render() {
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px"></div>
                <div className="popup-content background-white border-radius">
                    <div className="padding-15px background-blue grid grid-2x">
                        <div className="col-1">
                            <div className="txt-site txt-12 txt-bold post-center">
                                MONTHLY CLOSING - DETAIL
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button className="btn btn-circle background-blue" onClick={this.props.onClickClose}>
                                <i className="fa fa-lg fa-times"></i>
                            </button>
                        </div>
                    </div>

                    <div className="padding-15px">
                        <div className="col-2 content-right">
                            <button className="btn btn-blue" onClick={this.props.onClickSave}>
                                <span>CLOSING</span>
                            </button>
                        </div>
                    </div>

                    <div className="padding-5px">
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
                                    className="btn btn-blue"
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

export default FormMonthlyClosing