import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"

import DropDown from '../../../modules/popup/DropDown'

var ct = require("../../custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

class FormCnbCalculation extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    columns = [
        "No",
        "NIK",
        "Employee Name",
        "Income",
        "Deduction",
        "Take Home Pay",
        {
            name: "Payroll Data",
            options: {
                customHeadRender: (columnMeta) => (
                    <th style={{ cursor: 'pointer', backgroundColor: '#F6F6F6', color: '#555555', fontSize: 13, fontWeight: 1 }}>
                        <div style={{ borderBottom: "1px rgba(0,0,0,0.1) solid" }}>{columnMeta.name}</div>
                        <div className="grid grid-4x" style={{ backgroundColor: '#F6F6F6', color: '#555555', fontSize: 13, fontWeight: 1 }}>
                            <div className="col-1">
                                Branch
                            </div>
                            <div className="col-2">
                                Location
                            </div>
                            <div className="col-3">
                                Salary
                            </div>
                            <div className="col-4">
                                PTKP
                            </div>
                        </div>
                    </th>
                ),
                customBodyRender: (val) => {
                    return (
                        <div className="grid grid-4x content-center">
                            <div className="col-1">
                                {val && val.split("|")[0]}
                            </div>
                            <div className="col-2">
                                {val && val.split("|")[1]}
                            </div>
                            <div className="col-3">
                                {val && val.split("|")[2]}
                            </div>
                            <div className="col-4">
                                {val && val.split("|")[3]}
                            </div>
                        </div>
                    )
                }
            }
        },
        {
            name: "Employee Data",
            options: {
                customHeadRender: (columnMeta) => (
                    <th style={{ cursor: 'pointer', backgroundColor: '#F6F6F6', color: '#555555', fontSize: 13, fontWeight: 1 }}>
                        <div style={{ borderBottom: "1px rgba(0,0,0,0.1) solid" }}>{columnMeta.name}</div>
                        <div className="grid grid-5x" style={{ backgroundColor: '#F6F6F6', color: '#555555', fontSize: 13, fontWeight: 1 }}>
                            <div className="col-1">
                                Type
                            </div>
                            <div className="col-2">
                                Category
                            </div>
                            <div className="col-3">
                                Join Date
                            </div>
                            <div className="col-4">
                                NPWP
                            </div>
                            <div className="col-5">
                                End Date
                            </div>
                        </div>
                    </th>
                ),
                customBodyRender: (val) => {
                    return (
                        <div className="grid grid-5x content-center">
                            <div className="col-1">
                                {val && val.split("|")[0]}
                            </div>
                            <div className="col-2">
                                {val && val.split("|")[1]}
                            </div>
                            <div className="col-3">
                                {val && val.split("|")[2]}
                            </div>
                            <div className="col-4">
                                {val && val.split("|")[3]}
                            </div>
                            <div className="col-5">
                                {val && val.split("|")[4]}
                            </div>
                        </div>
                    )
                }
            }
        },
        {
            name: "Bank Data",
            options: {
                customHeadRender: (columnMeta) => (
                    <th style={{ cursor: 'pointer', backgroundColor: '#F6F6F6', color: '#555555', fontSize: 13, fontWeight: 1 }}>
                        <div style={{ borderBottom: "1px rgba(0,0,0,0.1) solid" }}>{columnMeta.name}</div>
                        <div className="grid grid-4x" style={{ backgroundColor: '#F6F6F6', color: '#555555', fontSize: 13, fontWeight: 1 }}>
                            <div className="col-1">
                                Bank
                            </div>
                            <div className="col-2">
                                Account Number
                            </div>
                            <div className="col-3">
                                Branch
                            </div>
                            <div className="col-4">
                                Currency
                            </div>
                        </div>
                    </th>
                ),
                customBodyRender: (val) => {
                    return (
                        <div className="grid grid-4x content-center">
                            <div className="col-1">
                                {val && val.split("|")[0]}
                            </div>
                            <div className="col-2">
                                {val && val.split("|")[1]}
                            </div>
                            <div className="col-3">
                                {val && val.split("|")[2]}
                            </div>
                            <div className="col-4">
                                {val && val.split("|")[3]}
                            </div>
                        </div>
                    )
                }
            }
        },
        {
            name: "Structure Organization Data",
            options: {
                customHeadRender: (columnMeta) => (
                    <th style={{ cursor: 'pointer', backgroundColor: '#F6F6F6', color: '#555555', fontSize: 13, fontWeight: 1 }}>
                        <div style={{ borderBottom: "1px rgba(0,0,0,0.1) solid" }}>{columnMeta.name}</div>
                        <div className="grid grid-5x" style={{ backgroundColor: '#F6F6F6', color: '#555555', fontSize: 13, fontWeight: 1 }}>
                            <div className="col-1">
                                Unit
                            </div>
                            <div className="col-2">
                                Branch
                            </div>
                            <div className="col-3">
                                Location
                            </div>
                            <div className="col-4">
                                Level
                            </div>
                            <div className="col-5">
                                Position
                            </div>
                        </div>
                    </th>
                ),
                customBodyRender: (val) => {
                    return (
                        <div className="grid grid-5x content-center">
                            <div className="col-1">
                                {val && val.split("|")[0]}
                            </div>
                            <div className="col-2">
                                {val && val.split("|")[1]}
                            </div>
                            <div className="col-3">
                                {val && val.split("|")[2]}
                            </div>
                            <div className="col-4">
                                {val && val.split("|")[3]}
                            </div>
                            <div className="col-5">
                                {val && val.split("|")[4]}
                            </div>
                        </div>
                    )
                }
            }
        },
        {
            name: "Attendance Data",
            options: {
                customHeadRender: (columnMeta) => (
                    <th style={{ cursor: 'pointer', backgroundColor: '#F6F6F6', color: '#555555', fontSize: 13, fontWeight: 1 }}>
                        <div style={{ borderBottom: "1px rgba(0,0,0,0.1) solid" }}>{columnMeta.name}</div>
                        <div className="grid grid-2x" style={{ backgroundColor: '#F6F6F6', color: '#555555', fontSize: 13, fontWeight: 1 }}>
                            <div className="col-1">
                                Calendar
                            </div>
                            <div className="col-2">
                                Work
                            </div>
                        </div>
                    </th>
                ),
                customBodyRender: (val) => {
                    return (
                        <div className="grid grid-2x content-center">
                            <div className="col-1">
                                {val && val.split("|")[0]}
                            </div>
                            <div className="col-2">
                                {val && val.split("|")[1]}
                            </div>
                        </div>
                    )
                }
            }
        }
    ]
    data = [["1", "EMP-205", "data", "data", "data", "data", "data", "data", "data", "data", "data", "data", "data"]]

    render() {
        return (
            <div>
                <div className="padding-15px grid grid-2x">
                    <div className="col-1">
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
                    <div className="col-2">
                    </div>
                </div>
                <div className="padding-5px" style={{ width: "64%" }}>
                    <MuiThemeProvider theme={getMuiTheme()}>
                        <MUIDataTable
                            data={this.data}
                            columns={this.columns}
                            options={options}
                        />
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
                    </MuiThemeProvider>
                </div>
            </div>
        )
    }
}

export default FormCnbCalculation