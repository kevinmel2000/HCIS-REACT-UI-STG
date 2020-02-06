import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import MUIDataTable from "mui-datatables-bitozen"

var ct = require("../../../../modules/custom/customTable");

class FormFacilitator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            printClass: "app-popup",
        }
    }

    getMuiTheme = () => createMuiTheme(ct.customTable());
    options = ct.customOptions();

    openPrint = () => {
        if (this.state.printClass === "app-popup app-popup-show") {
            this.setState({ printClass: "app-popup" });
        } else {
            this.setState({ printClass: "app-popup app-popup-show" });
        }
    };

    columns = [
        "No",
        "Facilitator Name",
        "Facilitator Type",
        "Trainer Name",
        "Trainer Specialist",
        "Address",
        "Phone Number",
        "Session",
        "Cost per Session",
        "Total Cost Session"

    ]

    dataTable = [
        ["1", "PT Training", "eksternal", "faza.", "training", "Jakarata,dasdad,sad", "23131231", "2", "20.000", "50.000"]
    ]

    render() {
        return (
            <div className="vertical-tab-content active">
                <form action="#">
                    <div className="content-right margin-right-15px margin-top-15px">
                        <button
                            type="button"
                            className="btn btn-blue btn-small-circle"
                            onClick={this.openPrint}
                        >
                            <i class="fa fa-download" />
                        </button>
                    </div>
                    <div className="border-bottom padding-10px grid-mobile-none gap-20px">
                        <MuiThemeProvider theme={this.getMuiTheme()}>
                            <MUIDataTable
                                title='Facilitator'
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
                                    className="btn btn-blue"
                                    type="button" >
                                    <span>SAVE</span>
                                </button>
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

                    {/* Popup Print */}
                    <div className={this.state.printClass}>
                        <div className="popup-content-mikro background-white border-radius post-center">
                            <div className="popup-panel grid grid-2x">
                                <div className="col-1">
                                    <div className="popup-title">
                                        Report Viewer
                </div>
                                </div>
                                <div className="col-2 content-right" style={{marginTop:10}}>
                                    <i 
                                      className="fa fa-download" 
                                      style={{cursor : "pointer"}}
                                    />
                                </div>
                            </div>

                            <div className="padding-15px">
                                <div className="grid margin-top-15px">
                                    <div className="content-right">
                                        <button
                                            style={{ marginLeft: "15px" }}
                                            className="btn btn-primary"
                                            type="button"
                                            onClick={this.openPrint}
                                        >
                                            <span>CLOSE</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* End Popup Print */}
                </form>
            </div>
        )
    }
}

export default FormFacilitator