import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import FlexView from 'react-flexview'

var ct = require("../../../../../modules/custom/customTable")

class TableCorporateStruct extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [
                [
                    'OSL-1032193131',
                    'Org Structure Template for IT Industry',
                    'YES'
                ],
                [
                    'OSL-2312381921',
                    'Org Structure Template for Hospital Industry',
                    'YES'
                ]
            ]
        }
    }

    getMuiTheme = () => createMuiTheme(ct.customTable());

    options = ct.customOptions()

    columns = [
        {
            name: "Org Structure Template ID",
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
        "Org Structure Template Name",
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
                                onClick={this.props.openSlide('slide-org', this.props.rawDataOrg[tableMeta.rowIndex])}
                            >
                                <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                            </button>
                            <button
                                className="btnAct"
                                type='button'
                                onClick={() => this.props.onClickDelete(this.props.rawDataOrg, tableMeta.rowIndex, 'org', false)}
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
        return (
            <div>
                <MuiThemeProvider theme={this.getMuiTheme()}>
                    <MUIDataTable
                        title={"Organization Structure Template"}
                        subtitle={"lorem ipsum dolor"}
                        data={this.props.dataTableOrg}
                        columns={this.columns}
                        options={this.options} />
                </MuiThemeProvider>
            </div>
        )
    }
}
export default TableCorporateStruct