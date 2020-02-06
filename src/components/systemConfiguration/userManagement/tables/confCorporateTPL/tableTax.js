import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import FlexView from 'react-flexview'
import API from '../../../../../Services/Api'

var ct = require("../../../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

class TableTax extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataTableTax: [],
            rawData: []
        }
    }

    columns = [
        {
            name: "Tax Template ID",
            options: {
                customBodyRender: (val) => {
                    return (
                        <FlexView vAlignContent="center">
                            <FlexView>
                                {this.state.imageUrl ? (
                                    <img src={this.state.imageUrl} width="50" style={{ borderRadius: 30 }} alt="" />
                                ) : (
                                        // <i className="far fa-lw fa-user-circle" style={{ color: 'blue', marginRight: 10, fontSize: 44 }} />
                                        <div className="image image-50px image-circle background-white border-all" style={{ marginRight: 25 }}>
                                            <i className="icn fa fa-1x fa-user" style={{ textAlign: 'center' }} />
                                        </div>
                                    )}
                            </FlexView>
                            <div style={{ marginLeft: 10 }}>
                                {val}
                            </div>
                        </FlexView>
                    )
                }
            }
        },
        "Tax Template Name",
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
                                style={{marginRight: 15}}
                                type='button'
                                onClick={this.props.openSlide('slide-tax', this.props.rawDataTax[tableMeta.rowIndex])}
                            >
                                <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                            </button>
                            <button
                                className="btnAct"
                                type='button'
                                onClick={() => this.props.onClickDelete(this.props.rawDataTax, tableMeta.rowIndex, 'tax', false)}
                            >
                                <i className="fa fa-lw fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                            </button>
                        </div>
                    )
                }
            }
        }
    ]

    async getAllTax() {
        let payload = {
            "limit": 5,
            "offset": 0,
            "params": {}
        }
        let res = await API.create('CFG').getAllTax(payload)
        if (res.data && res.data.status === 'S') {
            let dataTableTax = res.data.data.map((value) => {
                const {
                    taxTPLID, taxTPLName, taxTPLStatus
                } = value

                let status = taxTPLStatus === 'ACTIVE' ? 'YES' : 'NO'

                return [
                    taxTPLID,
                    taxTPLName,
                    status
                ]
            })
            this.setState({
                dataTableTax,
                rawDataTax: res.data.data
            })
        }
    }

    componentDidMount() {
        // this.getAllTax()
    }

    render() {
        return (
            <div>
                <MuiThemeProvider theme={getMuiTheme()}>
                    <MUIDataTable
                        title={"Tax Template"}
                        subtitle={"lorem ipsum dolor"}
                        data={this.props.dataTableTax}
                        columns={this.columns}
                        options={options} />
                </MuiThemeProvider>
            </div>
        )
    }
}
export default TableTax