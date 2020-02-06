import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";

var ct = require("../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class formApprovalDetail extends Component {

    columns = [
        "Row Id",
        "Batch Code",
        "Coa",
        "Core Branch",
        "Core Location",
        "Cabang",
        "Lokasi",
        "Jenis",
        "Coa",
        "Core Branch",
        "Core Location",
        "Cabang",
        "Lokasi",
        "Jenis",
        "Str Total",
        "Str Amount",
        "Deskripsi",
        "Status",
        "Replay Code",
        "Replay Trx",
        "Replay Info",
        "File Source",
        "File Replay"
    ]

    dataTable = [
        ["1", "11", "1212","1", "11", "1212","1", "11", "1212","1", "11", "1212","1", "11", "1212"]
    ]

    render() {
        return (
            <div>
                <div className="padding-15px">
                    <div>
                        <div className="content-left">
                            <button
                                className="btn btn-blue"
                                type="button"
                            >
                                <span>GET</span>
                            </button>
                            <button
                                style={{ marginLeft: "15px" }}
                                className="btn btn-blue"
                                type="button"
                            >
                                <span>APPROVE</span>
                            </button>
                        </div>
                        <div className="padding-top-15px">
                            <MuiThemeProvider theme={getMuiTheme()}>
                                <MUIDataTable
                                    data={this.dataTable}
                                    columns={this.columns}
                                    options={options}
                                />
                            </MuiThemeProvider>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default formApprovalDetail;
