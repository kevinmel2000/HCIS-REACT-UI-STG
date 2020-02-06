import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
// import EditTaxDetail from '../../forms/edit/payroll/editTaxDetail'
import PopUp from '../../../../../pages/PopUpAlert'
import EditPayrollDetail from './EditPayrollDetail'

var ct = require("../../../../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions5()

class TablePayrollDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: this.props.data,
            editVisible: false,
            deletePopUpVisible: false,
            dataTableDetails: []
        }
    }

    columns = [
        "TID",
        "Segment",
        "Component",
        "Name",
        "Default",
        "Tax Type",
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
                                    <i className="fa fa-lw fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                                </button>
                            </div>
                        </div>
                    )
                }
            }
        }
    ]

    componentDidMount() {
        this.getData(this.state.data)
    }

    getData(data) {
        let dataTableDetails = Object.assign([], data.payrollTPLDetails)
        dataTableDetails = dataTableDetails.map((value) => {
            if (value === null) {
                return ['', '', '', '', '', '', '']
            }
            const { payrollTPLDetailID, isDefault, payrollComponent, payrollTaxtype, payrollSegment, payrollDetailStatus } = value
            let defaultStatus = isDefault ? 'YES' : 'NO'
            let status = payrollDetailStatus === 'ACTIVE' ? 'YES' : 'NO'
            let component = payrollComponent !== null ? payrollComponent.bizparKey : ' - '
            let componentName = payrollComponent !== null ? payrollComponent.bizparValue : ' - '
            return [
                payrollTPLDetailID,
                payrollSegment.bizparValue,
                component,
                componentName,
                defaultStatus,
                payrollTaxtype.bizparValue,
                status
            ]
        })
        this.setState({ dataTableDetails })
    }

    componentDidUpdate(prevProps) {
        if (this.props.data !== prevProps.data) {
            let data = this.props.data
            this.setState({ data })
            this.getData(data)
        }
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
        this.props.onClickSave(this.state.selectedIndex, 'delete-detail')
    }

    close() {
        this.setState({
            editVisible: !this.state.editVisible
        })
    }

    render() {
        return (
            <div>
                <div>
                    <MuiThemeProvider theme={getMuiTheme()}>
                        <MUIDataTable
                            title='Payroll Template Detail'
                            subtitle={"lorem ipsum dolor"}
                            data={this.state.dataTableDetails}
                            columns={this.columns}
                            options={options} />
                    </MuiThemeProvider>
                </div>
                <div>
                    {this.state.editVisible && (
                        <EditPayrollDetail
                            onClickSave={this.props.onClickSave.bind(this)}
                            bizparPayrollTplComponent={this.props.bizparPayrollTplComponent}
                            bizparPayrollTplComponentType={this.props.bizparPayrollTplComponentType}
                            bizparPayrollTplSegment={this.props.bizparPayrollTplSegment}
                            bizparTax1721A1Type={this.props.bizparTax1721A1Type}
                            bizparTaxType={this.props.bizparTaxType}
                            coaCategory={this.props.coaCategory}
                            onClickClose={this.close.bind(this)}
                            data={this.state.data.payrollTPLDetails[this.state.selectedIndex]}
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
export default TablePayrollDetail