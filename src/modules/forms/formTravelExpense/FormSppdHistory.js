import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import MUIDataTable from "mui-datatables-bitozen"

var ct = require("../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class FormSppdHistory extends Component {
    constructor(props) {
        super(props)
        this.state = {
            sppdData: props.sppdData,
            formHistoryDetail: false,
            selectedIndex: null
        }
    }

    openDetailForm = (index) => {
        this.setState({ formHistoryDetail: !this.state.formHistoryDetail, selectedIndex: index })
    }

    componentDidUpdate(prevProps) {
        if (this.props.sppdData !== prevProps.sppdData) return this.setState({ sppdData: this.props.sppdData })
    }

    columnsHistory = [
        "NIK",
        "Employee Name",
        "Destination",
        "Start Date",
        "End Date",
        "Number of Days",
        {
            name: "Status",
            options: {
                customBodyRender: val => {
                    return (
                        <div className="grid grid-2x content-center">
                            <div className="column-1">
                                <i
                                    className="fa fa-lw fa-circle"
                                    style={{
                                        color:
                                            val === "WAITING APPROVAL"
                                                ? "orange"
                                                : val === "APPROVED"
                                                    ? "brown"
                                                    : val === "" || val === null
                                                        ? null
                                                        : "gray",
                                        marginRight: 10,
                                        padding: "5px"
                                    }}
                                />
                            </div>
                            <div className="column-2">
                                {val}
                            </div>
                        </div>
                    );
                }
            }
        },
        {
            name: "Detail",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        <div>
                            <button
                                type="button"
                                className="btnAct"
                                onClick={() => this.openDetailForm(tableMeta.rowIndex)}
                            >
                                <i className="fas fa-lw fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                            </button>
                        </div>
                    );
                }
            }
        }
    ];

    columnsDetail = ["No", "Item ID", "Item", "Allowance"]
    data = [["1", "001", "PENGINAPAN", "Rp 1.000.000"]]

    renderDetail = () => {
        let { sppdData } = this.state
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px" />
                <div className="popup-content background-white border-radius" style={{ marginBottom: 20, width: '90%' }}>
                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="popup-title">
                                History - Detail
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button className="btn btn-circle btn-grey" onClick={this.openDetailForm}>
                                <i className="fa fa-lg fa-times" />
                            </button>
                        </div>
                    </div>
                    <form action="#">
                        <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-15px">
                            <div className="column-1">
                                <div>
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold margin-bottom-5px">
                                            <h4>{"Employee Name"}</h4>
                                        </div>
                                        <input
                                            type="text"
                                            readOnly
                                            style={{ backgroundColor: "#E6E6E6" }}
                                            className="txt txt-sekunder-color"
                                            value={sppdData && sppdData.employee ? sppdData.employee.employeeName : "-"}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="column-2">
                                <div>
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold margin-bottom-5px">
                                            <h4>{"NIK"}</h4>
                                        </div>
                                        <input
                                            type="text"
                                            readOnly
                                            style={{ backgroundColor: "#E6E6E6" }}
                                            className="txt txt-sekunder-color"
                                            value={sppdData && sppdData.employee ? sppdData.employee.employeeID : "-"}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="padding-15px">
                            <MuiThemeProvider theme={getMuiTheme()}>
                                <MUIDataTable
                                    data={this.data}
                                    columns={this.columnsDetail}
                                    options={options}
                                />
                            </MuiThemeProvider>
                            <div className="margin-top-15px grid grid-2x">
                                <div className="col-1" />
                                <div className="col-2 content-right">
                                    <button style={{ marginLeft: "15px" }} className="btn btn-grey" type="button" onClick={this.openDetailForm.bind(this)}>
                                        <span>CLOSE</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

    render() {
        let { sppdData, formHistoryDetail } = this.state
        let dataHistory = []
        dataHistory.push([
            sppdData && sppdData.employee ? sppdData.employee.employeeID : "-",
            sppdData && sppdData.employee ? sppdData.employee.employeeName : "-",
            sppdData.sppdDestinationPlace,
            sppdData.sppdStartDate,
            sppdData.sppdEndDate,
            "-",
            sppdData.sppdStatus.replace(/_/g, " ")
        ])

        return (
            <div className="vertical-tab-content active">
                <form action="#">
                    <div className="margin-15px">
                        <MuiThemeProvider theme={getMuiTheme()}>
                            <MUIDataTable
                                title='History'
                                subtitle={"lorem ipsum dolor"}
                                data={dataHistory}
                                columns={this.columnsHistory}
                                options={options}
                            />
                        </MuiThemeProvider>
                    </div>
                    {formHistoryDetail ? this.renderDetail() : null}
                </form>
            </div>
        )
    }
}

export default FormSppdHistory