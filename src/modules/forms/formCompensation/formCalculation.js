import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"

import DropDown from '../../../modules/popup/DropDown'

var ct = require("../../custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

class Calculation extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    columns = ["NO", "NIP", "NAMA", "PENDAPATAN", "POTONGAN", "THP", "PAJAK", "NO REKENING", "NPWP"]
    data = []

    render() {
        return (
            <div>
                <form action="#">
                    <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-20px">
                        <div className="column-1">
                            <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                    <span className="txt-site txt-11 txt-main txt-bold">
                                        Payroll Type
                                    </span>
                                </div>
                                <DropDown
                                    title="-- please select payroll type --"
                                    onChange={(dt) => console.log(dt)}
                                    // type="bizpar"
                                    // disabled={this.props.type === "update" ? true : false}
                                    data={[{id: '1', title: 'Payroll', value: 'bs-1'}]} />
                                {/*<select className="cf-select slc slc-sekunder">
                                    <option value="">-- please select payroll type --</option>
                                    <option value="">Payroll</option>
                                </select>*/}
                            </div>
                            <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                    <span className="txt-site txt-11 txt-main txt-bold">
                                        Period
                                    </span>
                                </div>
                                <DropDown
                                    title="-- please select period --"
                                    onChange={(dt) => console.log(dt)}
                                    // type="bizpar"
                                    // disabled={this.props.type === "update" ? true : false}
                                    data={[{id: '1', title: 'Juni 2019', value: 'bs-1'}]} />
                                {/*<select className="cf-select slc slc-sekunder">
                                    <option value="">-- please select period --</option>
                                    <option value="">Juni 2019</option>
                                </select>*/}
                            </div>
                        </div>
                    </div>
                    <MuiThemeProvider theme={getMuiTheme()}>
                        <MUIDataTable
                            data={this.data}
                            columns={this.columns}
                            options={options}
                        />
                    </MuiThemeProvider>

                    <div className="padding-15px">
                        <div className="grid grid-2x">
                            <div className="col-1"></div>
                            <div className="col-2 content-right">
                                <button
                                    style={{ marginLeft: "15px" }}
                                    className="btn btn-blue"
                                    type="button">
                                    <span>CALCULATE</span>
                                </button>
                                <button
                                    style={{ marginLeft: "15px" }}
                                    className="btn btn-blue"
                                    type="button">
                                    <span>CLOSING</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default Calculation