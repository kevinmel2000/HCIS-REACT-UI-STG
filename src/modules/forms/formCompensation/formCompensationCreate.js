import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import DropDown from '../../../modules/popup/DropDown'
import EmployeeSearchForm from '../formInbox/employeeSearchForm'
import M from 'moment'
import uuid from 'uuid'
import * as R from 'ramda'
import PopUp from '../../../components/pages/PopUpAlert'

var ct = require("../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions5()
const monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"]

const defaultPayload = {
    "batchPayrollID": "",
    "batchPayrollMonth": "",
    "batchPayrollYear": "",
    "batchPayrollStatus": "INITIATE",
    "batchPayrollDetail": [],
    "createdBy": "SYSTEM",
    "createdDate": M().format("DD-MM-YYYY HH:mm:ss"),
    "updatedBy": "",
    "updatedDate": "",
    "recordID": uuid.v4(),
    "esid": ""
}

class formCompensationCreate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataTable: [],
            data: props.data ? {
                ...props.data,
                esid: props.data.esid ? props.data.esid.esID : ""
            } : {
                    ...defaultPayload,
                    batchPayrollID: "BP-" + M(),
                    esid: props.companyID
                },
            searchVisible: false,
            deletePopUpVisible: false,
            index: null,
            dataEmployee: props.data ? props.data.batchPayrollDetail : [],
            dataTableEmp: []
        }
    }

    componentDidMount() {
        if (this.props.type === "edit") this.getData()
    }

    componentDidUpdate(prevProps) {
        if (this.props.data !== prevProps.data) {
            this.setState({ data: { ...this.props.data, esid: this.props.data && this.props.data.esid ? this.props.data.esid.esID : "" } })
            this.getData()
        }
    }

    openSearchForm = () => {
        this.setState({ searchVisible: !this.state.searchVisible })
    }

    openDeletePopUp = (index) => {
        this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible, index })
    }

    getData() {
        let dataTable = this.props.data && this.props.data.batchPayrollDetail.map((value) => {
            const { employeeID } = value
            return [
                employeeID.employeeName,
                employeeID.employeeID
            ]
        })
        this.setState({ dataTable })
    }

    handleChooseEmployee = (value, type) => {
        let tableEmp = this.state.dataTable.map((value) => {
            return {
                "employeeID": value[1]
            }
        })
        let isExist = R.findIndex(R.propEq('employeeID', value.employeeID))(tableEmp)
        if (isExist < 0) {
            if (type === "single") {
                let dataEmployee = Object.assign([], this.state.dataEmployee)
                dataEmployee.push(
                    {
                        "batchPayrollDetailID": "BPD-" + M(),
                        "batchPayrollItemStatus": "NOT_CALCULATE",
                        "employeeID": value.employeeID,
                        "salaryCurrentMonth": 0,
                        "salaryMonthBefore": 0
                    });
                console.log("payload", dataEmployee)
                let dataTable = Object.assign([], this.state.dataTable)
                dataTable.push([
                    value.employeeName,
                    value.employeeID
                ])
                this.setState({
                    searchVisible: false,
                    dataEmployee,
                    dataTable
                })
            } else {
                let dataEmployee = Object.assign([], this.state.dataEmployee)
                dataEmployee = value.map((data) => {
                    return {
                        "batchPayrollDetailID": "BPD-" + M(),
                        "batchPayrollItemStatus": "NOT_CALCULATE",
                        "employeeID": data.employeeID,
                        "salaryCurrentMonth": 0,
                        "salaryMonthBefore": 0
                    }
                })
                console.log("payload", dataEmployee)
                let dataTable = Object.assign([], this.state.dataTable)
                dataTable = value.map((data) => {
                    return [
                        data.employeeName,
                        data.employeeID
                    ]
                })

                this.setState({
                    searchVisible: false,
                    dataEmployee,
                    dataTable
                })
            }
        } else {
            alert("Employee Already Exist.")
        }
    }

    deleteEmployee = (index) => {
        let dataEmployee = Object.assign([], this.state.dataEmployee)
        dataEmployee.splice(index, 1)
        let dataTable = Object.assign([], this.state.dataTable)
        dataTable.splice(index, 1)
        this.setState({ dataEmployee, dataTable, deletePopUpVisible: false })
    }

    columns = [
        "Employee",
        "NIK",
        {
            name: "Action",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        <div>
                            <button
                                type="button"
                                className="btnAct"
                                style={{ marginRight: 15 }}
                                onClick={this.openDeletePopUp.bind(this, tableMeta.rowIndex)}
                            >
                                <i className="fa fa-lw fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                            </button>
                        </div>
                    )
                }
            }
        }
    ]

    renderEdit = () => {
        let { searchVisible, data } = this.state
        return (
            <div className="a-s-p-place active">
                <div className="a-s-p-top">
                    <div className="grid grid-2x">
                        <div className="col-1">
                            <div className="display-flex-normal margin-top-10px">
                                <i className="fa fa-1x fa-user-times"></i>
                                <span className="txt-site txt-11 txt-main margin-left-10px">
                                    {this.props.type === "create" ? "Payroll - Create Form" : "Payroll - Edit Form"}
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
                <form action="#" onSubmit={(e) => {
                    e.preventDefault()
                    let payload = this.state.data
                    payload = {
                        ...payload,
                        batchPayrollDetail: this.state.dataEmployee
                    }
                    if (R.isEmpty(payload.batchPayrollMonth)) return alert('Month is Required.')
                    if (payload.batchPayrollDetail.length === 0) return alert('Employee is Required.')
                    console.log('save', payload)
                    this.props.onClickSave(payload)
                }}>
                    <div className="a-s-p-mid a-s-p-pad border-top">
                        <div className="display-flex-normals margin-bottom-10px">
                            <div className="padding-top-15px padding-bottom-15px">
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Payroll Batch ID</h4>
                                        </div>
                                    </div>
                                    <input
                                        value={data.batchPayrollID}
                                        type="text"
                                        disabled
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        className="txt txt-sekunder-color"
                                    />
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Period <span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                    </div>
                                    <input
                                        required
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        onChange={(e) => {
                                            if (isNaN(e.target.value)) return true
                                            this.setState({
                                                data: {
                                                    ...data,
                                                    batchPayrollYear: e.target.value
                                                }
                                            })
                                        }}
                                        value={data.batchPayrollYear}
                                    />
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Month <span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                    </div>
                                    <DropDown
                                        title="-- please select month --"
                                        onChange={(e) => {
                                            this.setState({
                                                data: {
                                                    ...data,
                                                    batchPayrollMonth: e
                                                }
                                            })
                                        }}
                                        type="bizpar"
                                        value={data.batchPayrollMonth}
                                        bizValue={monthNames[data.batchPayrollMonth - 1]}
                                        data={this.props.dataMonths} />
                                </div>

                                <div className="padding-5px grid grid-2x">
                                    <div className="col-1">
                                        <div className="txt-site txt-18 txt-bold txt-main padding-top-5px"></div>
                                    </div>
                                    <div className="col-2 content-right">
                                        <button type="button"
                                            className="btn btn-circle background-blue"
                                            style={{ marginRight: 5 }}
                                            onClick={this.openSearchForm}>
                                            <i className='fa fa-1x fa-plus'></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="padding-5px">
                                    <MuiThemeProvider theme={getMuiTheme()}>
                                        <MUIDataTable
                                            title={<span> Employee List <span style={{ color: "red" }}>*</span></span>}
                                            subtitle={"lorem ipsum dolor"}
                                            data={this.state.dataTable}
                                            columns={this.columns}
                                            options={options}
                                        />
                                    </MuiThemeProvider>
                                </div>

                                <div className="padding-15px">
                                    <div className="grid grid-2x">
                                        <div className="col-1"></div>
                                        <div className="col-2 content-right">
                                            <button className="btn btn-blue" type="submit">
                                                <span>SAVE</span>
                                            </button>
                                            <button
                                                style={{ marginLeft: "15px" }}
                                                className="btn btn-primary"
                                                type="button"
                                                onClick={this.props.closeSlide}>
                                                <span>CLOSE</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {searchVisible &&
                                    <EmployeeSearchForm
                                        form={"select"}
                                        onChoose={this.handleChooseEmployee.bind(this)}
                                        onClickClose={this.openSearchForm.bind(this)}
                                    />
                                }
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }

    render() {
        let { searchVisible, deletePopUpVisible, data } = this.state
        return (
            <div>
                {this.props.type === "edit" ? this.renderEdit() :
                    <div className="app-popup app-popup-show ">
                        <div className="padding-top-20px" />
                        <div className="popup-content-small background-white border-radius">
                            <div className="popup-panel grid grid-2x">
                                <div className="col-1">
                                    <div className="popup-title">
                                        {this.props.type === "create" ? "Payroll - Create Form" : "Payroll - Edit Form"}
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
                            <form action="#" onSubmit={(e) => {
                                e.preventDefault()
                                let payload = this.state.data
                                payload = {
                                    ...payload,
                                    batchPayrollDetail: this.state.dataEmployee
                                }
                                if (R.isEmpty(payload.batchPayrollMonth)) return alert('Month is Required.')
                                if (payload.batchPayrollDetail.length === 0) return alert('Employee is Required.')
                                console.log('save', payload)
                                this.props.onClickSave(payload)
                            }}>
                                <div className="border-bottom padding-15px grid grid-mobile-none gap-20px">
                                    <div className="margin-bottom-20px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>Payroll Batch ID</h4>
                                            </div>
                                        </div>
                                        <input
                                            value={data.batchPayrollID}
                                            type="text"
                                            disabled
                                            style={{ backgroundColor: "#E6E6E6" }}
                                            className="txt txt-sekunder-color"
                                        />
                                    </div>
                                    <div className="margin-bottom-20px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>Period <span style={{ color: "red" }}>*</span></h4>
                                            </div>
                                        </div>
                                        <input
                                            required
                                            type="text"
                                            className="txt txt-sekunder-color"
                                            onChange={(e) => {
                                                if (isNaN(e.target.value)) return true
                                                this.setState({
                                                    data: {
                                                        ...data,
                                                        batchPayrollYear: e.target.value
                                                    }
                                                })
                                            }}
                                            value={data.batchPayrollYear}
                                        />
                                    </div>
                                    <div className="margin-bottom-20px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>Month <span style={{ color: "red" }}>*</span></h4>
                                            </div>
                                        </div>
                                        <DropDown
                                            title="-- please select month --"
                                            onChange={(e) => {
                                                this.setState({
                                                    data: {
                                                        ...data,
                                                        batchPayrollMonth: e
                                                    }
                                                })
                                            }}
                                            type="bizpar"
                                            value={data.batchPayrollMonth}
                                            data={this.props.dataMonths} />
                                    </div>

                                    <div className="padding-5px grid grid-2x">
                                        <div className="col-1">
                                            <div className="txt-site txt-18 txt-bold txt-main padding-top-5px"></div>
                                        </div>
                                        <div className="col-2 content-right">
                                            <button type="button"
                                                className="btn btn-circle background-blue"
                                                style={{ marginRight: 5 }}
                                                onClick={this.openSearchForm}>
                                                <i className='fa fa-1x fa-plus'></i>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="padding-5px">
                                        <MuiThemeProvider theme={getMuiTheme()}>
                                            <MUIDataTable
                                                title={<span> Employee List <span style={{ color: "red" }}>*</span></span>}
                                                subtitle={"lorem ipsum dolor"}
                                                data={this.state.dataTable}
                                                columns={this.columns}
                                                options={options}
                                            />
                                        </MuiThemeProvider>
                                    </div>

                                    <div className="padding-15px">
                                        <div className="grid grid-2x">
                                            <div className="col-1"></div>
                                            <div className="col-2 content-right">
                                                <button className="btn btn-blue" type="submit">
                                                    <span>SAVE</span>
                                                </button>
                                                <button
                                                    style={{ marginLeft: "15px" }}
                                                    className="btn btn-primary"
                                                    type="button"
                                                    onClick={this.props.onClickClose}>
                                                    <span>CLOSE</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    {searchVisible &&
                                        <EmployeeSearchForm
                                            form={"select"}
                                            onChoose={this.handleChooseEmployee.bind(this)}
                                            onClickClose={this.openSearchForm.bind(this)}
                                        />}
                                </div>
                            </form>
                        </div>
                        <div className="margin-bottom-20px"></div>
                    </div>}
                {deletePopUpVisible &&
                    <PopUp
                        type={"delete"}
                        class={"app-popup app-popup-show"}
                        onClick={this.openDeletePopUp.bind(this)}
                        onClickDelete={this.deleteEmployee.bind(this, this.state.index)}
                    />}
            </div>
        )
    }
}

export default formCompensationCreate