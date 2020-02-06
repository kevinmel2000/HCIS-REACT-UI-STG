import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import FormMonthlyClosing from '../../modules/forms/formCompensation/formMonthlyClosing';
import PopUp from '../pages/PopUpAlert';

var ct = require("../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions()

class MonthlyClosing extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formVisible: false,
            savePopUpVisible: false
        }
    }

    openDetailForm = () => {
        let savePopUpVisible = this.state.savePopUpVisible ? !this.state.savePopUpVisible : false
        this.setState({ formVisible: !this.state.formVisible, savePopUpVisible })
    }

    openSavePopUp = () => {
        this.setState({ savePopUpVisible: !this.state.savePopUpVisible })
    }

    columns = [
        "Period",
        {
            name: "Tax Closing",
            options: {
                customHeadRender: (columnMeta) => (
                    <th style={{ cursor: 'pointer', backgroundColor: '#F6F6F6', color: '#555555', fontSize: 13, fontWeight: 1 }}>
                        <div style={{ borderBottom: "1px rgba(0,0,0,0.1) solid" }}>{columnMeta.name}</div>
                        <div className="grid grid-4x" style={{ backgroundColor: '#F6F6F6', color: '#555555', fontSize: 13, fontWeight: 1 }}>
                            <div className="col-1">
                                Employee
                            </div>
                            <div className="col-2">
                                Amount
                            </div>
                            <div className="col-3">
                                Closing Date
                            </div>
                            <div className="col-4">
                                Status
                            </div>
                        </div>
                    </th>
                ),
                customBodyRender: (val) => {
                    return (
                        <div className="grid grid-4x content-center">
                            <div className="col-1">
                                {val.split("|")[0]}
                            </div>
                            <div className="col-2">
                                {val.split("|")[1]}
                            </div>
                            <div className="col-3">
                                {val.split("|")[2]}
                            </div>
                            <div className="col-4">
                                <label
                                    style={{
                                        backgroundColor: val !== "UNCLOSED" ? "orange" : "brown",
                                        color: "white",
                                        padding: "5px",
                                        borderRadius: 4,
                                        fontSize: "14px",
                                        border: val !== "UNCLOSED" ? "4px orange" : "4px brown",
                                        cursor: "pointer"
                                    }}
                                    onClick={this.openSavePopUp.bind(this)}
                                >
                                    {val.split("|")[3]}
                                </label>
                            </div>
                        </div>
                    )
                }
            }
        },
        {
            name: "Action",
            options: {
                customBodyRender: () => {
                    return (
                        <button
                            className="btn btn-blue btn-small-circle"
                            style={{ marginRight: 5 }}
                            onClick={this.openDetailForm}>
                            <i className="fas fa-lw fa-ellipsis-h" />
                        </button>
                    )
                }
            }
        }
    ]

    data = [["200917", "164 | 0.00 | | UNCLOSED"]]

    render() {
        let { formVisible, savePopUpVisible } = this.state
        return (
            <div className="main-content">
                <div className="padding-15px">
                    <div className="txt-site txt-18 txt-bold txt-main padding-top-5px">
                        {/* COMPENSATION - MONTHLY CLOSING */}
                    </div>
                </div>

                <div className="padding-5px">
                    <MuiThemeProvider theme={getMuiTheme()}>
                        <MUIDataTable
                            title='Monthly Closing'
                            data={this.data}
                            columns={this.columns}
                            options={options}
                        />
                    </MuiThemeProvider>
                </div>

                {formVisible && (
                    <FormMonthlyClosing 
                        onClickSave={this.openSavePopUp.bind(this)}
                        onClickClose={this.openDetailForm.bind(this)}
                    />
                )}

                {savePopUpVisible && (
                    <PopUp 
                        type={"save"}
                        class={"app-popup app-popup-show"}
                        onClick={formVisible ? this.openDetailForm.bind(this) : this.openSavePopUp.bind(this)}
                    />
                )}

            </div>
        )
    }
}

export default MonthlyClosing