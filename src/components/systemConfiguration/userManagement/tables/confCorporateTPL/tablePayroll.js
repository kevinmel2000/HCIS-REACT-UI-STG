import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import FlexView from 'react-flexview'
import M from 'moment'
import * as R from 'ramda'
import Api from '../../../../../Services/Api'

var ct = require("../../../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

class TablePayroll extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            rawData: [],
            corpCount: 0,
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
            "params": {
                "payrollTPLStatus": "ACTIVE"
            },
            "offset": page,
            "limit": limit
        }
        let name = {
            params: {
                payrolTPLName: this.state.table_query
            },
            offset: page,
            limit: limit
        }
        if (!R.isEmpty(this.state.table_query)) {
            let response = await Api.create('CFG').getCountCorpPayrollByStatusAndName(this.state.table_query)
            let res = await Api.create('CFG').getAllCorpPayrollByStatusAndName(name)
            if (res.data && res.data.status === 'S') {
                console.log('res', res.data.data)
                let dataTablePayroll = res.data.data.map((value) => {
                    if (value === null) {
                        return ['', '', '']
                    } else {
                        const {
                            payrollTPLID, payrollTPLName, payrollTPLStatus
                        } = value

                        let status = payrollTPLStatus === 'ACTIVE' ? 'YES' : 'NO'

                        return [
                            payrollTPLID,
                            payrollTPLName,
                            status
                        ]
                    }
                })
                this.setState({
                    data: dataTablePayroll,
                    rawData: res.data.data,
                    corpCount: response.data.data
                })
            }
        } else {
            let response = await Api.create('CFG').getCountCorpPayrollByStatus("ACTIVE")
            let res = await Api.create('CFG').getAllPayroll(payload)
            if (res.data && res.data.status === 'S') {
                console.log('res', res.data.data)
                let dataTablePayroll = res.data.data.map((value) => {
                    if (value === null) {
                        return ['', '', '']
                    } else {
                        const {
                            payrollTPLID, payrollTPLName, payrollTPLStatus
                        } = value

                        let status = payrollTPLStatus === 'ACTIVE' ? 'YES' : 'NO'

                        return [
                            payrollTPLID,
                            payrollTPLName,
                            status
                        ]
                    }
                })
                this.setState({
                    data: dataTablePayroll,
                    rawData: res.data.data,
                    corpCount: response.data.data
                })
            }
        }
    }


    columns = [
        {
            name: "Payroll Template ID",
            options: {
                customBodyRender: (val) => {
                    return (
                        <FlexView vAlignContent="center">
                            <FlexView>
                                {/* <i className="far fa-lw fa-user-circle" style={{color: 'blue', marginRight: 10, fontSize: 44}} /> */}
                                <div className="image image-50px image-circle background-white border-all" style={{ marginRight: 25 }}>
                                    <i className="icn fa fa-1x fa-user" style={{ textAlign: 'center' }} />
                                </div>
                            </FlexView>
                            <div style={{ marginLeft: 10 }}>
                                {val}
                            </div>
                        </FlexView>
                    )
                }
            }
        },
        "Payroll Template Name",
        {
            name: "Activation",
            options: {
                customBodyRender: val => {
                    return (
                        <div>
                            <i
                                className="fa fa-lw fa-circle"
                                style={{
                                    color:
                                        val === "YES" ? "green" : "brown",
                                    marginRight: 10,
                                    padding: "5px"
                                }}
                            />
                            {val}
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
                                onClick={this.props.openSlide('slide-payroll', this.state.rawData[tableMeta.rowIndex])}
                            >
                                <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                            </button>
                            <button
                                className="btnAct"
                                type='button'
                                onClick={() => this.props.onClickDelete(this.state.rawData, tableMeta.rowIndex, 'payroll', false)}
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
        let { corpCount, table_query } = this.state
        let tableOptions = {
            ...options,
            serverSide: true,
            count: corpCount,
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
                        key={corpCount}
                        title={"Payroll Template"}
                        subtitle={"lorem ipsum dolor"}
                        data={this.state.data}
                        columns={this.columns}
                        options={tableOptions} />
                </MuiThemeProvider>
            </div>
        )
    }
}
export default TablePayroll