import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"

let ct = require("../../custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

class FormMovementHistory extends Component {

    columns = [
        "No",
        "Approval Status",
        "Status",
        "Approver",
        "Comment"
    ]

    render() {
        const data = [
            [
                "1",
                <div>
                    <div>2019-05-01 10:14</div>
                    <div>
                        Telah disetujui oleh atasan (1000018 - Liyana Tan)
                    </div>
                </div>,
                <div className="content-center">
                    <button type="button" className="btn btn-small btn-green btn-radius">
                        Disetujui
                    </button>
                </div>,
                <div>
                    <div>1000018</div>
                    <div>
                        Liyana Tan
                    </div>
                </div>,
                "ACC"
            ],
            [
                "2",
                <div>
                    <div>2019-05-01 10:14</div>
                    <div>
                        Telah disetujui oleh atasan (1000018 - Liyana Tan)
                    </div>
                </div>,
                <div className="content-center">
                    <button type="button" className="btn btn-small btn-orange btn-radius">
                        Mengajukan
                    </button>
                </div>,
                <div>
                    <div>1000018</div>
                    <div>
                        Liyana Tan
                    </div>
                </div>,
                "REJECT"
            ],
            [
                "3",
                <div>
                    <div>2019-05-01 10:14</div>
                    <div>
                        Telah disetujui oleh atasan (1000018 - Liyana Tan)
                    </div>
                </div>,
                <div className="content-center">
                    <button type="button" className="btn btn-small btn-primary btn-radius">
                        Rencana
                    </button>
                </div>,
                <div>
                    <div>1000018</div>
                    <div>
                        Liyana Tan
                    </div>
                </div>,
                "ACC"
            ]
        ]

        return (
            <div className="vertical-tab-content active">
                <form action="#">
                    <div className="border-bottom padding-15px grid-mobile-none gap-10px">
                        <div className="column-1">
                            <div>
                                <div>
                                    <MuiThemeProvider theme={getMuiTheme()}>
                                        <MUIDataTable
                                            data={data}
                                            columns={this.columns}
                                            options={options}
                                        />
                                    </MuiThemeProvider>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default FormMovementHistory;