import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import MUIDataTable from "mui-datatables-bitozen"
import FormSearchEmployee from '../../../../modules/forms/formEmployee/formSearchEmployee';

var ct = require("../../../../modules/custom/customTable");

class FormBudget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            printClass: "app-popup",
            formSearchVisible : false,
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

    openSearch= () => {
        this.setState({ formSearchVisible: !this.state.formSearchVisible });
    }

    dataTableSearch = [
        ["1800", "Pelatihan Pemrograman", "Sertifikasi", "IT", "Basic 2", "Basic 3", "Basic 4", "Basic 5"]
    ]

    //Data table untuk Search Form
    columnsSearch = [
        "Employee",
        "Branch",
        "Position",
        {
            name: "Action",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        <div>
                            <button
                                className="btn btn-blue btn-small-circle fa fa-plus"
                                style={{ marginRight: 5 }}
                                onClick={this.openSearch()}
                            >
                                <i className="fa fa-lw fa-Plus" />
                            </button>
                        </div>
                    );
                }
            }
        }
    ];

    columns = [
        "No",
        "Budget Name",
        "Total Planning Cost",
        "Total Realization Cost",
        {
            name: "Action",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        <div>
                            <button
                                type="button"
                                className="btn btn-blue btn-small-circle"
                                style={{ marginRight: 5 }}
                                onClick={this.openPrint}>
                                <i className="fa fa-lw fa-print" />
                            </button>
                        </div>
                    );
                }
            }
        }
    ]

    dataTable = [
        ["1", "203710371031", "LILYANA TAN", "saada.", "Leader", "nothing"]
    ]

    render() {
        return (
            <div className="vertical-tab-content active">
                <form action="#">
                    <div className="border-bottom padding-10px grid-mobile-none gap-20px">
                        <MuiThemeProvider theme={this.getMuiTheme()}>
                            <MUIDataTable
                                title='Budget'
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
                                    type="button"
                                    onClick={this.props.onClickConfirm}>
                                    <span>OVER BUDGET</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Popup Print */}
                    <div className={this.state.printClass}>
                    <div className="padding-top-20px" />
                        <div className="popup-content background-white border-radius">
                            <div className="padding-15px background-white border-bottom grid grid-2x">
                                <div className="col-1">
                                    <div className="txt-site txt-12 txt-bold post-center">
                                        Generate Routing Slip
                                    </div>
                                </div>
                            </div>

                            <div className="padding-20px grid grid-2x grid-mobile-none gap-20px">
                                <div className="col-1">
                                    <div className="margin-bottom-15px">
                                        <div className="margin-5px">
                                            <span className="txt-site txt-11 txt-main txt-bold">
                                                Information <span style={{ color: "red" }}>*</span>
                                            </span>
                                        </div>
                                        <input
                                            type="text"
                                            className="txt txt-sekunder-color"
                                            placeholder=""
                                            required
                                        />
                                    </div>
                                    <div className="margin-bottom-15px">
                                        <div className="margin-5px">
                                            <span className="txt-site txt-11 txt-main txt-bold">
                                                PPN <span style={{ color: "red" }}>*</span>
                                            </span>
                                        </div>
                                        <input
                                            type="text"
                                            className="txt txt-sekunder-color"
                                            placeholder=""
                                            required
                                        />
                                    </div>
                                    <div className="margin-bottom-15px">
                                        <div className="margin-5px">
                                            <span className="txt-site txt-11 txt-main txt-bold">
                                                Account Number <span style={{ color: "red" }}>*</span>
                                            </span>
                                        </div>
                                        <input
                                            type="text"
                                            className="txt txt-sekunder-color"
                                            placeholder=""
                                            required
                                        />
                                    </div>
                                    <div className="margin-bottom-15px">
                                        <div className="margin-5px">
                                            <span className="txt-site txt-11 txt-main txt-bold">
                                                Account Name <span style={{ color: "red" }}>*</span>
                                            </span>
                                        </div>
                                        <input
                                            type="text"
                                            className="txt txt-sekunder-color"
                                            placeholder=""
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-2">
                                    <div className="margin-bottom-15px">
                                        <div className="margin-5px">
                                            <span className="txt-site txt-11 txt-main txt-bold">
                                                Checker
                    </span>
                                        </div>
                                        <div class="input-group input-border">
                                            <input
                                                class="txt txt-transparant text-no-radius text-no-shadow"
                                                name="search"></input>
                                            <button
                                                className="btn btn-blue fa fa-search"
                                                type="button"
                                                disabled={this.props.type === 'view' ? true : false}
                                                onClick={this.openSearch}
                                            >
                                            </button>
                                        </div>
                                    </div>
                                    <div className="margin-bottom-15px">
                                        <div className="margin-5px">
                                            <span className="txt-site txt-11 txt-main txt-bold">
                                                Checker Position
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
                                    <div className="margin-bottom-15px">
                                        <div className="margin-5px">
                                            <span className="txt-site txt-11 txt-main txt-bold">
                                                Approval <span style={{ color: "red" }}>*</span>
                                            </span>
                                        </div>
                                        <div class="input-group input-border">
                                            <input
                                                class="txt txt-transparant text-no-radius text-no-shadow"
                                                name="search"
                                                placeholder=""></input>
                                            <button
                                                className="btn btn-blue fa fa-search"
                                                type="button"
                                                disabled={this.props.type === 'view' ? true : false}
                                                onClick={this.openSearch}
                                            >
                                            </button>
                                        </div>
                                    </div>
                                    <div className="margin-bottom-15px">
                                        <div className="margin-5px">
                                            <span className="txt-site txt-11 txt-main txt-bold">
                                                Approval Position
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
                            <div className="padding-15px background-grey">
                                <div className="grid margin-top-15px">
                                    <div className="content-right">
                                        <button
                                            style={{ marginRight: "15px" }}
                                            className="btn btn-blue"
                                            type="button"
                                            onClick={() => this.props.onClickSave()}
                                        >
                                            <span>SAVE</span>
                                        </button>
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

                    {this.state.formSearchVisible && (
                        <FormSearchEmployee
                            onClickConfirm={this.openConfirmPopUp}
                            onClickDelete={this.openDeletePopup}
                            onClickClose={this.openSearch}
                        />
                    )}

                </form>
            </div>
        )
    }
}

export default FormBudget