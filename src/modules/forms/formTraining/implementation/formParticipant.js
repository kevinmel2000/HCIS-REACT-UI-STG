import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import MUIDataTable from "mui-datatables-bitozen"

var ct = require("../../../../modules/custom/customTable");

class FormParticipant extends Component {

    getMuiTheme = () => createMuiTheme(ct.customTable());
    options = ct.customOptions();

    columns = [
        "No",
        "NIK",
        "Employee Name",
        "Branch",
        "Position",
        "Information"
    ]

    dataTable = [
        ["1", "203710371031", "LILYANA TAN", "saada.", "Leader", "nothing"]
    ]

    render() {
        return (
            <div className="vertical-tab-content active">
                <form action="#">
                    <div className="padding-20px grid grid-2x grid-mobile-none gap-20px">
                        <div className="col-1">
                            <div className="margin-5px">
                                <span className="txt-site txt-11 txt-main txt-bold">
                                    Remain Quota per Activity
                  </span>
                            </div>
                            <input
                                readOnly
                                style={{ backgroundColor: "#E6E6E6" }}
                                type="text"
                                className="txt txt-sekunder-color"
                                placeholder=""
                                required
                            />
                        </div>
                        <div className="col-2">
                            <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                    <span className="txt-site txt-11 txt-main txt-bold">
                                        Remain Annual Quota
                  </span>
                                </div>
                                <input
                                    readOnly
                                    style={{ backgroundColor: "#E6E6E6" }}
                                    type="text"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="border-bottom padding-10px grid-mobile-none gap-20px">
                        <MuiThemeProvider theme={this.getMuiTheme()}>
                            <MUIDataTable
                                title='Participant'
                                data={this.dataTable}
                                columns={this.columns}
                                options={this.options}
                            />
                        </MuiThemeProvider>
                    </div>
                    <div className="padding-15px">
                        <div className="grid grid-2x">
                            <div className="col-1" />
                            <div className="col-2 content-right">
                                <button style={{
                                    marginLeft: "15px"
                                }}
                                    className="btn btn-primary"
                                    type="button"
                                    onClick={this.props.onClickClose}>
                                    <span>CLOSE</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default FormParticipant