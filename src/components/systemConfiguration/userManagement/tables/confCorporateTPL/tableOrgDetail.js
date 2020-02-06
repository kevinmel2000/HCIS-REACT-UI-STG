import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import EditOrgDetail from '../../forms/edit/corporateTPL/EditOrgDetail'
import PopUp from '../../../../pages/PopUpAlert'
import Api from '../../../../../Services/Api'

var ct = require("../../../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions5()

class TableOrgDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: this.props.data,
            dataTableDetails: [],
            rawDataPayroll:[]
        }
    }

    componentDidMount() {
        this.getDetail()
        this.getPayroll()
    }

    getPayroll = async() => {
        let payload = {
            "params": {
                "payrollTPLStatus": "ACTIVE"
            },
            "offset": 0,
            "limit": 20
        }
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
                rawDataPayroll: res.data.data
            })
        }
    }

    getDetail() {
        let dataTableDetails = Object.assign([], this.props.dataTableDetail)
        dataTableDetails = dataTableDetails.map((value) => {
            const {
                ouTaxTPLID,
                oulevel,
                oupayrollTaxTPLID,
                ouparentID,
                ouposition,
                ouid
            } = value
            return [
                ouid,
                oulevel ? oulevel.bizparValue : '',
                ouparentID,
                <div className='grid txt-primary'>
                    <div className='col-1'>
                        {ouposition ? ouposition.bizparKey : ''}
                    </div>
                    <div className='col-2 txt-bold'>
                        {ouposition ? ouposition.bizparValue : ''}
                    </div>
                </div>,
                ouTaxTPLID ? ouTaxTPLID.taxTPLID : '',
                oupayrollTaxTPLID ? oupayrollTaxTPLID.payrollTPLID : '',
                'YES'
            ]
        })
        this.setState({ dataTableDetails })
    }

    componentDidUpdate(prevProps) {
        if (this.props.data !== prevProps.data) {
            let data = this.props.data
            this.setState({ data })
        }
        if (this.props.dataTableDetail !== prevProps.dataTableDetail) return this.getDetail()

    }

    openEdit(index) {
        this.setState({
            selectedIndex: index, editVisible: !this.state.editVisible
        })
    }

    openDeletePopUp = (index) => {
        this.setState({
            deletePopUpVisible: !this.state.deletePopUpVisible, selectedIndex: index
        })
    }

    handleDelete() {
        this.setState({
            deletePopUpVisible: !this.state.deletePopUpVisible
        })
        this.props.onClickSave(this.props.dataTableDetail[this.state.selectedIndex], 'delete-detail')
    }

    close() {
        this.setState({
            editVisible: !this.state.editVisible
        })
    }

    columns = [
        "Node ID",
        "Level",
        "Parent",
        "Position",
        "Tax Template",
        "Pay Template",
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
                        <div className='grid grid-2x'>
                            <div className='column-1'>
                                <button
                                    className="btnAct"
                                    style={{marginRight: 15}}
                                    type='button'
                                    onClick={() => this.openEdit(tableMeta.rowIndex)}
                                >
                                    <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                                </button>
                            </div>
                            <div className='column-2'>
                                <button
                                    className="btnAct"
                                    type='button'
                                    onClick={() => this.openDeletePopUp(tableMeta.rowIndex)}
                                >
                                    <i className="fa fa-lw fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }}/>
                                </button>
                            </div>
                        </div>
                    )
                }
            }
        }
    ]

    render() {
        return (
            <div>
                <div>
                    <MuiThemeProvider theme={getMuiTheme()}>
                        <MUIDataTable
                            title='Org Structure Template Detail'
                            subtitle={"lorem ipsum dolor"}
                            data={this.state.dataTableDetails}
                            columns={this.columns}
                            options={options} />
                    </MuiThemeProvider>
                </div>
                <div>
                    {this.state.editVisible && (
                        <EditOrgDetail
                            onClickSave={this.props.onClickSave.bind(this)}
                            bizparCorporateLevel={this.props.bizparCorporateLevel}
                            bizparCorporateGrade={this.props.bizparCorporateGrade}
                            bizparCorporatePosition={this.props.bizparCorporatePosition}
                            rawDataPayroll={this.state.rawDataPayroll}
                            rawDataTax={this.props.rawDataTax}
                            rawDataCNB={this.props.rawDataCNB}
                            rawDataFacility={this.props.rawDataFacility}
                            dataTableDetail={this.props.dataTableDetail}
                            onClickClose={this.close.bind(this)}
                            data={this.props.dataTableDetail[this.state.selectedIndex]}
                        />
                    )}
                </div>
                {this.state.deletePopUpVisible && (
                    <PopUp
                        type={"delete"}
                        class={"app-popup app-popup-show"}
                        onClick={this.openDeletePopUp}
                        onClickDelete={this.handleDelete.bind(this)}
                    />
                )}
            </div>
        )
    }
}
export default TableOrgDetail