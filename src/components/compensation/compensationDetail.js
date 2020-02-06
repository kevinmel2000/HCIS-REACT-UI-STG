import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import Api from '../../Services/Api'
import PopUp from '../pages/PopUpAlert'
import NumberFormat from 'react-number-format'
import LoadingBar from 'react-top-loading-bar'

var ct = require("../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

class compensationDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formVisible: false,
            savePopUpVisible: false,
            saveOk: false,
            selectedIndex: null,
            type: props.type,
            dataTableBatch: [],
            dataTableApproval: []
        }
    }

    openForm = (index) => {
        this.setState({ formVisible: !this.state.formVisible, selectedIndex: index })
    }

    startFetch = () => {
        this.LoadingBar.continousStart()
    }

    onFinishFetch = () => {
        if (typeof this.LoadingBar === "object") this.LoadingBar.complete()
    }

    componentDidMount() {
        this.getDataById()
    }

    async getDataById() {
        let response = await Api.create("CNB_QUERY").getBatchPayrollById(this.props.data.batchPayrollID)
        if (response.data && response.data.status === "S") {
            let dataTableBatch = response.data.data.batchPayrollDetail.map((value, index) => {
                const { employeeID, salaryCurrentMonth, salaryMonthBefore, batchPayrollItemStatus } = value
                return [
                    index += 1,
                    employeeID.employeeID,
                    employeeID.employeeName,
                    salaryMonthBefore,
                    batchPayrollItemStatus === "CALCULATED" ? salaryCurrentMonth : "-",
                    batchPayrollItemStatus === "CALCULATED" ? salaryCurrentMonth - salaryMonthBefore : "-",
                    batchPayrollItemStatus
                ]
            })
            this.setState({ dataTableBatch, rawData: response.data.data.batchPayrollDetail })
        }
    }

    async calculateBatch(index, type) {
        this.startFetch()
        let employeeID
        if (type === "single") employeeID = [this.state.rawData[index].employeeID.employeeID]
        else employeeID = index.map((value) => {
            return value.employeeID.employeeID
        })
        let payload = {
            "batchPayrollID": this.props.data.batchPayrollID,
            "employees": employeeID
        }
        let response = await Api.create("CNB").calculateBatchPayroll(payload)
        if (response.data && response.data.status === "S") {
            this.onFinishFetch()
            this.getDataById()
            if (type === "all") this.setState({ type: "approval" })
        } else {
            this.onFinishFetch()
            alert("Failed: " + response.data.message)
        }
    }

    async submitPayroll() {
        let employeeID = this.state.rawData.map((value) => {
            return value.employeeID.employeeID
        })
        let payload = {
            "taskID": "",
            "senderUserID": this.props.user.userID,
            "senderEmpID": this.props.user.employeeID,
            "senderNotes": "",
            "senderBPMStatus": "INITIATE",
            "data": {
                "batchPayrollID": this.props.data.batchPayrollID,
                "employees": employeeID
            }
        }
        let response = await Api.create("BPM").submitPayrollBatch(payload)
        if (response.data && response.data.status === "S") {
            this.openSaveOk()
            this.props.getData()
        }
    }

    columns = [
        "No",
        "Employee ID",
        "Employee Name",
        {
            name: "N-1",
            options: {
                customBodyRender: (val) => {
                    return (
                        <NumberFormat
                            displayType={"text"}
                            thousandSeparator={true}
                            prefix={"Rp "}
                            value={val}
                            renderText={value => <div>{value}</div>}
                        />
                    )
                }
            }
        },
        {
            name: "N",
            options: {
                customBodyRender: (val) => {
                    return (
                        <NumberFormat
                            displayType={"text"}
                            thousandSeparator={true}
                            prefix={"Rp "}
                            value={val}
                            renderText={value => <div>{value}</div>}
                        />
                    )
                }
            }
        },
        {
            name: "Delta",
            options: {
                customBodyRender: (val) => {
                    return (
                        <NumberFormat
                            displayType={"text"}
                            thousandSeparator={true}
                            prefix={"Rp "}
                            value={val}
                            renderText={value => <div>{value}</div>}
                        />
                    )
                }
            }
        },
        {
            name: "Action",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        <div>
                            {this.props.data.batchPayrollStatus === "INITIATE" ?
                                <label
                                    style={{
                                        backgroundColor: this.state.type === "batch" ? (val === "CALCULATED" ? "gray" : "brown") : "brown",
                                        color: "white",
                                        padding: "5px",
                                        borderRadius: 4,
                                        fontSize: "14px",
                                        border: "4px white",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => this.calculateBatch(tableMeta.rowIndex, "single")}>
                                    {this.state.type === "batch" ? (val === "CALCULATED" ? "PROCESSED" : "PROCESS") : "RE CALCULATE"}
                                </label> : null}
                        </div>
                    )
                }
            }
        }
    ]

    openForm = (type) => {
        this.setState({ type })
    }

    openSavePopUp = (payload) => {
        this.setState({ savePopUpVisible: !this.state.savePopUpVisible, payload })
    }

    openSaveOk = () => {
        this.setState({ saveOk: !this.state.saveOk, savePopUpVisible: false, detailVisible: false, createVisible: false, editVisible: false })
    }

    render() {
        let { type, savePopUpVisible, saveOk } = this.state
        return (
            <div className="app-popup app-popup-show">
                <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
                <div className="padding-top-20px" />
                <div className="popup-content background-white border-radius" style={{ marginBottom: 10 }}>
                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="popup-title">
                                Payroll Detail
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button
                                className="btn btn-circle btn-grey"
                                onClick={this.props.onClickClose}
                            >
                                <i className="fa fa-lg fa-times" />
                            </button>
                        </div>
                    </div>
                    <div className="padding-15px">
                        <MuiThemeProvider theme={getMuiTheme()}>
                            <MUIDataTable
                                title='Payroll Detail'
                                data={this.state.dataTableBatch}
                                columns={this.columns}
                                options={options}
                            />
                        </MuiThemeProvider>
                    </div>

                    <div className="padding-15px">
                        <div className="grid grid-2x">
                            <div className="col-1" />
                            <div className="col-2 content-right">
                                {this.props.data.batchPayrollStatus === "INITIATE" ?
                                    <button
                                        style={{ marginLeft: "15px" }}
                                        className="btn btn-blue"
                                        type="button"
                                        onClick={type === "batch" ? () => this.calculateBatch(this.props.data.batchPayrollDetail, "all") : this.openSavePopUp.bind(this)}
                                    >
                                        <span>PROCESS {type === "batch" ? "BATCH" : type === "approval" ? "APPROVAL" : "BATCH DISTRIBUTE"} </span>
                                    </button> : null}
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
                {savePopUpVisible && (
                    <PopUp
                        type={"simpan"}
                        class={"app-popup app-popup-show"}
                        onClick={this.openSavePopUp.bind(this)}
                        onClickSimpan={this.submitPayroll.bind(this)}
                    />
                )}

                {saveOk && (
                    <PopUp
                        type={"save"}
                        class={"app-popup app-popup-show"}
                        onClick={this.props.onClickClose}
                    />
                )}
            </div>
        )
    }
}

export default compensationDetail