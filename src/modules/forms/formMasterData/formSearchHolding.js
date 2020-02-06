import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import MUIDataTable from "mui-datatables-bitozen"
import Api from '../../../Services/Api'

var ct = require("../../custom/customTable")

class FormSearchHolding extends Component {
    constructor() {
        super()
        this.state = {
            rawData: [],
            dataTable: [],
            refreshing: false,
            fetching: false
        }
    }

    async getCompanyByStatus() {
        let payload = {
            "limit": 300,
            "offset": 0,
            "params": {
                "esStatus": "ACTIVE"
            }
        }
        let res = await Api.create('ES').getCompanyByStatus(payload)
        if (res.data && res.data.status === 'S') {
            let dataTable = res.data.data.map((value) => {
                const { esid, esname } = value
                return [
                    esid,
                    esname
                ]
            })
            this.setState({
                dataTable,
                rawData: res.data.data
            })
        }
    }

    componentDidMount() {
        this.getCompanyByStatus()
    }

    getMuiTheme = () => createMuiTheme(ct.customTable());
    options = ct.customOptions()

    columns = [
        'Holding ID',
        'Holding Name',
        {
            name: "Action",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        <div>
                            <button
                                type="button"
                                onClick={() => {
                                    if (this.state.rawData[tableMeta.rowIndex].esid === this.props.esid) return alert('Please Select a Different Holding.')
                                    this.props.onClick(this.state.rawData[tableMeta.rowIndex])
                                }}
                                className={"btn btn-blue btn-small-circle"}>
                                <i className={"fa fa-lw fa-plus"}/>
                            </button>
                        </div>
                    )
                }
            }
        }
    ]

    data = [
        ["Employee Name1",
            "Branch Position1",
            "Employee Position1"],

        ["Employee Name2",
            "Branch Position2",
            "Employee Position2"]
    ]

    render() {
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px"></div>
                <div className="popup-content background-white border-radius">
                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="margin-bottom-5px display-flex-normal padding-15px ">
                                <i className="fa fa-lg fa-users margin-right-10px margin-top-5px"></i>
                                <h1 className="txt-site txt-18 txt-main ">Holding</h1>
                            </div>
                        </div>
                    </div>
                    <div className="padding-10px">
                        <MuiThemeProvider theme={this.getMuiTheme()}>
                            <MUIDataTable
                                title='Holding List'
                                data={this.state.dataTable}
                                columns={this.columns}
                                options={this.options}
                            />
                        </MuiThemeProvider>
                    </div>
                    <div className="padding-15px">
                        <div className="grid grid-2x">
                            <div className="col-1"></div>
                            <div className="col-2 content-right">
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
                </div>
                <div className="padding-bottom-20px"></div>
            </div>
        )
    }
}

export default FormSearchHolding;