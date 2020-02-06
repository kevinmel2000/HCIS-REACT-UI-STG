import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import LoadingBar from "react-top-loading-bar";

var ct = require("../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class FormSearchUploadScore extends Component {
    constructor() {
        super();
        this.state = {};
    }

    columns = [
        "Training Name",
        "Start Date",
        "End Date",
        {
            name: "Training Detail",
            options: {
                filter: false,
                customHeadRender: (columnMeta) => (
                    <th key={3} style={{ cursor: 'pointer', backgroundColor: '#F6F6F6', color: '#555555', fontSize: 13, fontWeight: 1 }}>
                        <div style={{ borderBottom: "1px rgba(0,0,0,0.1) solid" }}>{columnMeta.name}</div>
                        <div className="grid grid-6x" style={{ backgroundColor: '#F6F6F6', color: '#555555', fontSize: 13, fontWeight: 1 }}>
                            <div className="col-1">
                                {"Type"}
                            </div>
                            <div className="col-2">
                                {"Category 1"}
                            </div>
                            <div className="col-3">
                                {"Category 2"}
                            </div>
                            <div className="col-4">
                                {"Category 3"}
                            </div>
                            <div className="col-5">
                                {"Category 4"}
                            </div>
                            <div className="col-6">
                                {"Category 5"}
                            </div>
                        </div>
                    </th>
                ),
                customBodyRender: (val) => {
                    return (
                        <div>
                            <div className="grid grid-6x content-center">
                                <div className="col-1">
                                    {val}
                                </div>
                                <div className="col-2">
                                    {val}
                                </div>
                                <div className="col-3">
                                    {val}
                                </div>
                                <div className="col-4">
                                    {val}
                                </div>
                                <div className="col-5">
                                    {val}
                                </div>
                                <div className="col-6">
                                    {val}
                                </div>
                            </div>
                        </div>
                    );
                }
            }
        },
        {
            name: "Action",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        <div>
                            <button
                                className="btn btn-blue btn-small-circle"
                                type="button"
                                onClick={() => this.openCreateForm(tableMeta.rowIndex)}
                            >
                                <i className="fa fa-lx fa-plus" />
                            </button>
                        </div>
                    );
                }
            }
        }
    ];

    data = [
        ["Pelatihan Pemrograman", "06/05/2019", "10/05/2019", "Sertifikasi", "IT", "BASIC 2", "BASIC 3", "BASIC 4", "BASIC 5",""]
    ];

    render() {
        return (
            <div className={"app-popup app-popup-show"}>
                <div className="padding-top-20px" />
                <div className="popup-content background-white border-radius">
                    <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="popup-title">
                                Training Name - Search Form
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button
                                type="button"
                                className="btn btn-circle btn-grey"
                                onClick={this.props.onClickClose}
                            >
                                <i className="fa fa-lg fa-times" />
                            </button>
                        </div>
                    </div>
                    <form action="#">
                        <div className="border-bottom padding-15px ">
                            <div className="padding-5px">
                                <MuiThemeProvider theme={getMuiTheme()}>
                                    <MUIDataTable
                                        data={this.data}
                                        columns={this.columns}
                                        options={options}
                                    />
                                </MuiThemeProvider>
                            </div>
                            <div className="padding-15px">
                                <div className="grid grid-2x">
                                    <div className="col-1" />
                                    <div className="col-2 content-right">
                                        <button
                                            style={{ marginLeft: "15px" }}
                                            className="btn btn-primary"
                                            type="button"
                                            onClick={this.props.onClickClose}
                                        >
                                            <span>CLOSE</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="padding-bottom-20px" />
            </div>
        );
    }
}

export default FormSearchUploadScore;