import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import MUIDataTable from "mui-datatables-bitozen"
import CalendarPicker from '../../../modules/popup/Calendar';

var ct = require("../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class FormOvertimeHistory extends Component {
    constructor(props) {
        super(props)
        this.state = {
            detailVisible: true
        }
    }

    openDetailForm = (index) => {
        this.setState({ detailVisible: !this.state.detailVisible, selectedIndex: index })
    };

    columns = [
        "No",
        "Modul",
        "NIK",
        "Employee Name",
        "Position",
        "Location",
        "Unit",
        "Score"
    ];

    data = [
        ["1", "Materi","1007","ROBERT JULIUS", "VP PROJECT MANAGEMENT", "KUNINGAN CITY","OPERATION", "100"] ];

    render() {
        return (
            <div className="vertical-tab-content active">
                <form action="#">
                    <div className="border-bottom padding-15px">
                        <div className="column-1">
                            <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>Training Name<span style={{ color: "red" }}>*</span></h4>
                                    </div>
                                </div>
                                <textarea
                                    readOnly={this.props.type === "view" ? true : false}
                                    style={{ backgroundColor: "#E6E6E6", height: 95 }}
                                    type="text"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                />
                            </div>

                            <div className="margin-bottom-5px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>Date <span style={{ color: "red" }}>*</span></h4>
                                    </div>
                                </div>
                                <div className="display-flex-normal width width-all">
                                    <CalendarPicker
                                        style={{width: "100%"}}
                                        // disabled={this.props.type === 'view' ? true : false}
                                        // date={this.state.employeeDataWorkExp.workExperienceStartDate}
                                        onChange={(e) => {
                                            console.log(e)
                                        }} />
                                        <div className="txt-site txt-11 txt-primary txt-center margin-10px margin-left-10px margin-right-10px">
                                            To
                                        </div>
                                    <CalendarPicker
                                        style={{width: "100%"}}
                                        // disabled={this.props.type === 'view' ? true : false}
                                        // date={this.state.employeeDataWorkExp.workExperienceEndDate}
                                        onChange={(e) => {
                                            console.log(e)
                                        }} />
                                </div>
                            </div>
                        </div>
                        <div className='column-2' />
                    </div>

                    <div className="padding-15px border-bottom">
                        <MuiThemeProvider theme={getMuiTheme()}>
                            <MUIDataTable
                                title='Detail'
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
                </form>
            </div >

        )
    }
}

export default FormOvertimeHistory