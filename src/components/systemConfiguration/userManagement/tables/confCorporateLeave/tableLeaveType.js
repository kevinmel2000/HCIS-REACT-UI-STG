import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import * as R from 'ramda'
import { connect } from 'react-redux'
import Api from '../../../../../Services/Api'

var ct = require("../../../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

class TableLeaveType extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            rawData: [],
            leaveCount: 0,
            table_limit: 5,
            table_page: 0,
            table_query: "",
        }
    }

    componentDidMount() {
        this.getData(this.state.table_page, this.state.table_limit)
    }

    componentDidUpdate(prevProps) {
        if (this.props.data !== prevProps.data) this.setState({ data: this.props.data })
    }

    async getData(page, limit) {
        let payload = {
            "limit": limit,
            "offset": page,
            "params": {
                "esID": this.props.companyID
            }
        }
        let body = {
            limit: limit,
            offset: page,
            params: {
                esID: this.props.companyID,
                leaveTypeName: this.state.table_query
            }
        }
        if (!R.isEmpty(this.state.table_query)) {
            let res = await Api.create('CFG').getCountLeaveTypeByIdAndName(this.props.auth.user.companyID + "/" + this.state.table_query)
            let response = await Api.create('CFG').getAllLeaveTypeByIdAndName(body)
            if (response.ok && response.data.status === 'S') {
                if(response.data.code === "201") {
                    let dataTableType = response.data.data.map((value, index) => {
                        const { leaveType, leaveCategory, leaveDuration, isAllGender, isAllReligion } = value
                        return [
                            leaveType ? leaveType.bizparValue : "",
                            leaveCategory ? leaveCategory.bizparValue : "",
                            leaveDuration,
                            isAllGender,
                            isAllReligion
                        ]
                    })
                    this.setState({ rawData: response.data.data, data: dataTableType, leaveCount: res.data.data })
                }
            } else {
                alert("Failed: "+response.data.message)
            }
        } else {
            let res = await Api.create('CFG').getCountLeaveTypeByStatus("ACTIVE")
            let response = await Api.create('CFG').getCorporateLeaveTypeByEsid(payload)
            if (response.ok && response.data.status === 'S') {
                if(response.data.code === "201") {
                    let dataTableType = response.data.data.map((value, index) => {
                        const { leaveType, leaveCategory, leaveDuration, isAllGender, isAllReligion } = value
                        return [
                            leaveType ? leaveType.bizparValue : "",
                            leaveCategory ? leaveCategory.bizparValue : "",
                            leaveDuration,
                            isAllGender,
                            isAllReligion
                        ]
                    })
                    this.setState({ rawData: response.data.data, data: dataTableType, leaveCount: res.data.data })
                }
            } else {
                alert("Failed: "+response.data.message)
            }
        }
    }

    columns = [
        "Leave Type",
        "Leave Category",
        "Duration",
        {
            name: "Is All Gender ?",
            options: {
                customBodyRender: (val) => {
                    return (
                        <div>
                            <i
                                className="fa fa-lw fa-circle"
                                style={{
                                    color:
                                        val === true
                                            ? "green"
                                            : "brown",
                                    marginRight: 10,
                                    padding: "5px"
                                }}
                            />
                            {val === true ? "YES" : "NO"}
                        </div>
                    );
                }
            }
        },
        {
            name: "Is All Religion",
            options: {
                customBodyRender: (val) => {
                    return (
                        <div>
                            <i
                                className="fa fa-lw fa-circle"
                                style={{
                                    color:
                                        val === true
                                            ? "green"
                                            : "brown",
                                    marginRight: 10,
                                    padding: "5px"
                                }}
                            />
                            {val === true ? "YES" : "NO"}
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
                                className="btnAct"
                                style={{ marginRight: 15 }}
                                type='button'
                                onClick={this.props.openSlide("slide-leave-type", this.state.rawData[tableMeta.rowIndex])}
                            >
                                <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                            </button>
                            <button
                                className="btnAct"
                                type='button'
                                onClick={() => this.props.onDeletePopup(this.state.rawData[tableMeta.rowIndex], "delete-type")}
                            >
                                <i className="fa fa-lw fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                            </button>
                        </div>
                    )
                }
            }
        }
    ]

    render() {
        let { leaveCount, table_query } = this.state
        let tableOptions = {
            ...options,
            serverSide: true,
            count: leaveCount,
            searchText: table_query,
            onTableChange: (action, tableState) => {
                switch (action) {
                    case 'changePage':
                        this.setState({ table_page: tableState.page })
                        this.getData(tableState.page, tableState.rowsPerPage);
                        break;
                    case 'changeRowsPerPage':
                        this.setState({ table_limit: tableState.rowsPerPage })
                        this.getData(tableState.page, tableState.rowsPerPage);
                        break;
                    case 'search':
                        let searchText = tableState.searchText ? tableState.searchText : ""
                        this.setState({ table_query: searchText }, () => {
                            this.getData(tableState.page, tableState.rowsPerPage)
                        })
                        break;
                    default:
                        break;
                }
            }
        }
        return (
            <div>
                <MuiThemeProvider theme={getMuiTheme()}>
                    <MUIDataTable
                        title={"Leave Types Template"}
                        subtitle={"lorem ipsum dolor"}
                        data={this.state.data}
                        columns={this.columns}
                        options={tableOptions} />
                </MuiThemeProvider>
            </div>
        )
    }
}

export default TableLeaveType;