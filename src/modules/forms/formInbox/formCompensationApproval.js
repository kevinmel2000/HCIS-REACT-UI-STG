import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import MUIDataTable from "mui-datatables-bitozen"
import PopUp from '../../../components/pages/PopUpAlert'
import Api from '../../../Services/Api'
import { convertMonths } from '../../../Services/Utils'

var ct = require("../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions4()

class FormCompensationApproval extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: this.props.data,
            title: this.props.data.taskName,
            statusDistribution: 'DISTRIBUTE',
            dataTable: this.getTable(this.props.dataByID),
            notes: '',
            user: this.props.user,
            confirmationVisible: false
        }
    }

    getDataByID() {
        Api.create('CNB_QUERY').getBatchPayrollById(this.state.data.variables.TASK_REFNO)
            .then((res) => {
                if (res.data && res.data.status === 'S') {
                    let dataTable = this.getTable(res.data.data)
                    this.setState({
                        dataTable
                    })
                }
            })
    }

    componentWillMount() {
        this.getDataByID()
    }

    componentWillUpdate(prevProps) {
        if (this.props.data !== prevProps.data) {
            this.getDataByID()
            this.setState({
                data: this.props.data
            })
        }
    }

    getTable(value) {
        let rawData = value
        let dataTable = []
        if (rawData) {
            dataTable = Object.assign([], rawData.batchPayrollDetail)
            dataTable = dataTable.map((value, index) => {
                const { employeeID, salaryMonthBefore, salaryCurrentMonth } = value
                return [
                    index += 1,
                    employeeID ? employeeID.employeeID : '',
                    employeeID ? employeeID.employeeName : '',
                    `${convertMonths(rawData.batchPayrollMonth)}  ${rawData.batchPayrollYear}`,
                    salaryMonthBefore,
                    salaryCurrentMonth,
                    salaryCurrentMonth - salaryMonthBefore,
                    'DISTRIBUTE',
                ]
            })
        }
        return dataTable
    }

    handleApproval() {
        let notes = this.state.notes
        let { taskID } = this.state.data
        let recID = this.state.data.variables.TASK_REFNO
        let { userID, employeeID } = this.state.user
        // let data = this.props.dataByID
        let payload = {
            "taskID": taskID,
            "senderUserID": userID,
            "senderEmpID": employeeID,
            "senderNotes": notes,
            "senderBPMStatus": "APPROVE",
            "data": {
                "batchPayrollID": recID
            }
        }

        // return console.log(JSON.stringify(payload))
        this.setState({
            confirmationVisible: true,
            payload
        })
    }

    renderHeader = () => (
        <div className="padding-15px background-blue grid grid-2x">
            <div className="col-1">
                <div className="txt-site txt-12 txt-bold post-center">
                    {this.state.title}
                </div>
            </div>
            <div className="col-2 content-right">
                <button
                    className="btn btn-circle background-blue"
                    onClick={this.props.onClickClose}
                >
                    <i className="fa fa-lg fa-times" />
                </button>
            </div>
        </div>
    )

    renderFooter = () => {
        let buttons = [
            {
                label: "PROCESS BATCH DISTRIBUTE",
                cb: () => this.handleApproval()
            },
            {
                label: "CLOSE",
                cb: this.props.onClickClose
            }
        ]

        return (
            <div className="padding-15px">
                <div className="content-right">
                    {buttons.map((data, index) => {
                        return (
                            <button
                                style={{ marginLeft: "15px" }}
                                className={data.label === "PROCESS BATCH DISTRIBUTE" ? "btn btn-blue" : "btn btn-primary"}
                                type="button"
                                onClick={data.cb}
                            >
                                <span>{data.label}</span>
                            </button>
                        )
                    })
                    }
                </div>
            </div>
        )
    }

    columns = [
        "No",
        "Employee ID",
        "Employee Name",
        "Month",
        "N-1",
        "N",
        "Delta",
        {
            name: "Action",
            options: {
                customBodyRender: (val) => {
                    return (
                        <div>
                            <label
                                style={{
                                    backgroundColor: val === "DISTRIBUTE" ? "brown" : "gray",
                                    color: "white",
                                    padding: "5px",
                                    borderRadius: 4,
                                    fontSize: "14px",
                                    border: "4px white",
                                    cursor: "pointer",
                                }}
                            // onClick={() => this.state.statusDistribution === 'DISTRIBUTE' ? this.setState({ statusDistribution: 'DISTRIBUTED' }) : this.setState({ statusDistribution: 'DISTRIBUTE' })}
                            >
                                {val}
                            </label>
                        </div>
                    )
                }
            }
        }
    ]

    render() {
        return (
            <div className={"a-s-p-place active"}>
                {/* <div className="padding-top-20px" /> */}
                <div>
                    <div className="a-s-p-top">
                        <div className="grid grid-2x">
                            <div className="col-1" style={{ width: "140%" }}>
                                <div className="display-flex-normal margin-top-10px">
                                    <i className="fa fa-1x fa-envelope"></i>
                                    <span className="txt-site txt-11 txt-main margin-left-10px">
                                        {this.state.title}
                                    </span>
                                </div>
                            </div>
                            <div className="col-2 content-right">
                                <button
                                    onClick={this.props.closeSlide}
                                    className="btn btn-circle btn-grey">
                                    <i className="fa fa-lg fa-arrow-right" />
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* {this.renderHeader()} */}
                    <form>
                        <div className="padding-15px">
                            <MuiThemeProvider theme={getMuiTheme()}>
                                <MUIDataTable
                                    title='Compensation Detail'
                                    data={this.state.dataTable}
                                    columns={this.columns}
                                    options={options}
                                />
                            </MuiThemeProvider>
                        </div>
                    </form>
                    {this.renderFooter()}
                </div>
                {this.state.confirmationVisible && (
                    <PopUp
                        type={"simpan"}
                        class={"app-popup app-popup-show"}
                        onClick={() => {
                            this.setState({
                                confirmationVisible: false
                            })
                        }}
                        onClickSimpan={() => {
                            this.setState({
                                confirmationVisible: false
                            })
                            this.props.handleSubmit(this.state.payload)
                        }}
                    />
                )}
                <div className="padding-bottom-20px" />
            </div >
        )
    }
}

export default FormCompensationApproval