import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";

import CalendarPicker from '../../../../modules/popup/Calendar';

var ct = require("../../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class FormUploadEdit extends Component {
    constructor() {
        super();
        this.state = {
            file: null
        }
    }

    dataTable = [
        ["Materi.pdf"]
    ]

    columns = [
        "No",
        "NIK",
        "Employee Name",
        "Cost",
        "Certificate Number",
        "University",
        "Major",
        "IPK"
    ]

    render() {
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-10px"></div>
                <div className="popup-content background-white border-radius">
                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="popup-title">
                                {this.props.type === "edit"
                                    ? "Training Upload - Edit Form"
                                    : "Training Upload - Detail Form"}
                            </div>
                        </div>
                        <div className="content-right">
                        </div>
                    </div>
                    <form>
                        <div className="padding-15px border-bottom">
                            <div className="grid grid-2x grid-mobile-none gap-15px">
                                <div className="col-1">
                                    <div className="margin-bottom-20px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>Training Name</h4>
                                            </div>
                                        </div>
                                        <input
                                            readOnly={this.props.type === "detail"}
                                            style={this.props.type === "detail"?
                                            { backgroundColor: "#E6E6E6" }
                                            :null}
                                            type="text"
                                            className="txt txt-sekunder-color"
                                            placeholder=""
                                            required
                                        />
                                    </div>

                                    <div className="margin-bottom-20px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>Training Type</h4>
                                            </div>
                                        </div>
                                        <input
                                        readOnly={this.props.type === "detail"}
                                        style={this.props.type === "detail"?
                                        { backgroundColor: "#E6E6E6" }
                                        :null}
                                            type="text"
                                            className="txt txt-sekunder-color"
                                            placeholder=""
                                            required
                                        />
                                    </div>

                                    <div className="margin-bottom-20px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>Date (dd:mm:yyyy)<span style={{ color: "red" }}>*</span></h4>
                                            </div>
                                        </div>
                                        <div className="display-flex-normal width width-full">
                                            <CalendarPicker
                                            // disabled={this.props.type === 'view' ? true : false}
                                            // date={this.state.employeeDataWorkExp.workExperienceStartDate}
                                            onChange={(e) => {
                                                console.log(e)
                                            }} />
                                            <div className="txt-site txt-11 txt-primary txt-center margin-10px margin-left-10px margin-right-10px">
                                            To
                                                                </div>
                                            <CalendarPicker
                                            // disabled={this.props.type === 'view' ? true : false}
                                            // date={this.state.employeeDataWorkExp.workExperienceEndDate}
                                            onChange={(e) => {
                                                console.log(e)
                                            }} />
                                        </div>
                                    </div>

                                    <div className="margin-bottom-20px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>Place</h4>
                                            </div>
                                        </div>
                                        <input
                                        readOnly={this.props.type === "detail"}
                                        style={this.props.type === "detail"?
                                        { backgroundColor: "#E6E6E6" }
                                        :null}
                                            type="text"
                                            className="txt txt-sekunder-color"
                                            placeholder=""
                                            required
                                        />
                                    </div>

                                </div>
                                <div className="col-2">
                                    <div className="margin-bottom-10px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>Training Name <span style={{ color: "red" }}>*</span></h4>
                                            </div>
                                        </div>
                                        <div class="input-border form-group">
                                            <textarea
                                            readOnly={this.props.type === "detail"}
                                            style={this.props.type === "detail"?
                                            { backgroundColor: "#E6E6E6" }
                                            :null}
                                                class="form-control rounded-0"
                                                type="text"
                                                required
                                                placeholder=""
                                                cols="80"
                                                rows="5"
                                            />
                                        </div>
                                    </div>

                                    <div className="margin-bottom-20px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>Provider</h4>
                                            </div>
                                        </div>
                                        <input
                                        readOnly={this.props.type === "detail"}
                                        style={this.props.type === "detail"?
                                        { backgroundColor: "#E6E6E6" }
                                        :null}
                                            type="text"
                                            className="txt txt-sekunder-color"
                                            placeholder=""
                                            required
                                        />
                                    </div>

                                </div>
                            </div>
                        </div>
                    </form>
                    {this.props.type === "detail"?(
                    <div className="padding-15px border-bottom">
                            <MuiThemeProvider theme={getMuiTheme()}>
                                <MUIDataTable
                                    data={this.dataTable}
                                    columns={this.columns}
                                    options={options}
                                />
                            </MuiThemeProvider>
                        </div>
                    ):null}
                    <div className="padding-15px background-grey">
                        <div className="grid">
                            <div className="content-right">
                                {this.props.type === "edit"?(
                                <button
                                    style={{ marginLeft: "15px" }}
                                    className="btn btn-blue"
                                    type="button"
                                    onClick={() => this.props.onClickSave()}
                                >
                                    <span>SAVE</span>
                                </button>
                                ):null }
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

                <div className="padding-10px"></div>
            </div>
        );
    }
}

export default FormUploadEdit;
