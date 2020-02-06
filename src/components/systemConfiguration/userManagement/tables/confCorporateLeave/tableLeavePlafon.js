import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen" 
import * as R from 'ramda'
import { connect } from 'react-redux'
import Api from '../../../../../Services/Api'

var ct = require("../../../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

class TableLeavePlafon extends Component {
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
                "corporateLeavePlafonStatus": "ACTIVE"
            }
        }
        let body = {
            limit: limit,
            offset: page,
            params: {
                esID: this.props.companyID,
                positionName: this.state.table_query
            }
        }
        if (!R.isEmpty(this.state.table_query)) {
            let res = await Api.create('CFG').getCountLeavePlafonByIdAndName(this.props.auth.user.companyID + "/" + this.state.table_query)
            let response = await Api.create('CFG').getAllLeavePlafonByIdAndName(body)
            if (response.ok && response.data.status === 'S') {
                console.log(response)
                if (response.data.code === '201') {
                    let dataTablePlafon = response.data.data.map((value, index) => {
                        const { position, leavePlafon, corporateLeavePlafonStatus } = value
                        return [
                            position && position.oulevel ? position.oulevel.bizparValue : "",
                            (position && position.ouposition ? position.ouposition.bizparKey : "") + "|" + (position && position.ouposition ? position.ouposition.bizparValue : ""),
                            leavePlafon,
                            corporateLeavePlafonStatus
                        ]
                    })
                    this.setState({ rawData: response.data.data, data: dataTablePlafon, leaveCount: res.data.data })
                }
            } else {
                alert("Failed: " + response.data.message)
            }
        } else {
            let res = await Api.create('CFG').getCountLeavePlafonByStatus("ACTIVE")
            let response = await Api.create('CFG').getCorporateLeavePlafonByStatus(payload)
            if (response.ok && response.data.status === 'S') {
                console.log(response)
                if (response.data.code === '201') {
                    let dataTablePlafon = response.data.data.map((value, index) => {
                        const { position, leavePlafon, corporateLeavePlafonStatus } = value
                        return [
                            position && position.oulevel ? position.oulevel.bizparValue : "",
                            (position && position.ouposition ? position.ouposition.bizparKey : "") + "|" + (position && position.ouposition ? position.ouposition.bizparValue : ""),
                            leavePlafon,
                            corporateLeavePlafonStatus
                        ]
                    })
                    this.setState({ rawData: response.data.data, data: dataTablePlafon, leaveCount: res.data.data })
                }
            } else {
                alert("Failed: " + response.data.message)
            }
        }
    }

    columns = [
        "Level",
        {
            name: "Position",
            options: {
                customBodyRender: (val) => (
                    <div className="grid">
                        <div className='col-1'>{val && val.split("|")[0]}</div>
                        <div className='col-1'>{val && val.split("|")[1]}</div>
                    </div>
                )
            }
        },
        "Plafon",
        {
            name: "Activation",
            options: {
                customBodyRender: (val) => {
                    return (
                        <div>
                            <i
                                className="fa fa-lw fa-circle"
                                style={{
                                    color:
                                        val === "ACTIVE"
                                            ? "green"
                                            : "brown",
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
                                onClick={this.props.openSlide("slide-leave-plafon", this.state.rawData[tableMeta.rowIndex])}
                            >
                                <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                            </button>
                            <button
                                className="btnAct"
                                type='button'
                                onClick={() => this.props.onDeletePopup(this.state.rawData[tableMeta.rowIndex], "delete-plafon")}
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
                        title={"Leave Plafon Template"}
                        subtitle={"lorem ipsum dolor"}
                        data={this.state.data}
                        columns={this.columns}
                        options={tableOptions} />
                </MuiThemeProvider>
            </div>
        )
    }
}


export default TableLeavePlafon;