import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import LoadingBar from "react-top-loading-bar";

var ct = require("../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();


class FormSearchTrainingName extends Component {
    constructor() {
        super();
        this.state = {};
    }

    columns = [
        "No",
        "Training Name",
        "Type",
        "Sub Type 1",
        "Sub Type 2",
        "Sub Type 3",
        "Sub Type 4",
        "Sub Type 5",
        {
            name: "Action",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        <div>
                            <button
                                className="btn btn-blue btn-small-circle"
                                type="button"
                                // onClick={() => this.openCreateForm(tableMeta.rowIndex)}
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
        ["1","Pelatihan Pemrograman", "S1", "IT", "BASIC 2", "BASIC 3", "BASIC 4", "BASIC 5",""]
    ];

    render() {
        return (
            <div className={"app-popup app-popup-show"}>
                <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
                <div className="padding-top-20px" />
                <div className="popup-content background-white border-radius">
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
                        <div className="padding-15px ">
                            <div className="padding-bottom-15px border-bottom">
                                <MuiThemeProvider theme={getMuiTheme()}>
                                    <MUIDataTable
                                        data={this.data}
                                        columns={this.columns}
                                        options={options}
                                    />
                                </MuiThemeProvider>
                            </div>
                            <div className="padding-top-15px">
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

export default FormSearchTrainingName;