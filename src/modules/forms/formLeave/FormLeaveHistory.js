import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import MUIDataTable from "mui-datatables-bitozen"

var ct = require("../../../modules/custom/customTable");

class FormLeaveHistory extends Component {

    getMuiTheme = () => createMuiTheme(ct.customTable());
    options = ct.customOptions();

    columnsHistory = [
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
    dataHistory = [["DATA DUMMY", "DATA DUMMY", "DATA DUMMY", "DATA DUMMY"], ["1", "2019-05-23 10:14 Telah disetujui oleh Atasan terakhir (10000018 - LILYANA TAN)", "10000018 LILYANA TAN", "ACC."]]

    render() {
        return (
            <div className="vertical-tab-content active">
                <form action="#">
                    <div className="border-bottom padding-30px grid-mobile-none gap-20px">
                        <MuiThemeProvider theme={this.getMuiTheme()}>
                            <MUIDataTable
                                title='History'
                                data={this.dataHistory}
                                columns={this.columnsHistory}
                                options={this.options}
                            />
                        </MuiThemeProvider>
                    </div>
                    <div className="padding-15px">
                        <div className="grid grid-2x">
                            <div className="col-1" />
                            <div className="col-2 content-right">
                                <button
                                    style={{ marginLeft: "15px" }}
                                    className="btn btn-blue"
                                    type="button"
                                    onClick={this.props.onClickClose}
                                >
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

export default FormLeaveHistory