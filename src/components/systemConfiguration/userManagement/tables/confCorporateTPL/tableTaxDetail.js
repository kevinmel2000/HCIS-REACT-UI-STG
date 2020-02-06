import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import EditTaxDetail from '../../forms/edit/tax/editTaxDetail'
import PopUp from '../../../../pages/PopUpAlert'
import Api from '../../../../../Services/Api'

var ct = require("../../../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions5()

class TableTaxDetail extends Component {
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
        "Component Item",
        "Item Name",
        "Type",
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
        this.getDetail(this.state.data)
    }

    getDetail(data) {
        let dataTableDetails = Object.assign([], data.taxTPLDetails)
        dataTableDetails = dataTableDetails.map((value) => {
            const { taxTPLDetailID, isDefault, taxComponentType, taxComponent, taxComponentItem, taxSegment, taxTPLDetailStatus } = value
            let defaultStatus = isDefault ? 'YES' : 'NO'
            let status = taxTPLDetailStatus === 'ACTIVE' ? 'YES' : 'NO'
            return [
                taxTPLDetailID,
                taxSegment.bizparValue,
                taxComponent.bizparValue,
                taxComponent.bizparValue,
                defaultStatus,
                taxComponentItem.bizparKey,
                taxComponentItem.bizparValue,
                taxComponentType.bizparValue,
                status
            ]
        })
        this.setState({ dataTableDetails })
    }

    componentDidUpdate(prevProps) {
        if (this.props.data !== prevProps.data) {
            let data = this.props.data
            this.setState({ data })
            this.getDetail(data)
        }
    }

    async openEdit(index) {
        let bizparTaxTplComponentDetail, payload = ''
        payload = {
            "params": {
                "parentKey": this.state.data.taxTPLDetails[index].taxComponent ? this.state.data.taxTPLDetails[index].taxComponent.bizparKey : '',
                "bizparCategory": "TAX_TPL_COMPONENT_ITEM"
            },
            "offset": 0,
            "limit": 5
        }
        let res = await Api.create('BIZPAR').getBizparByParentKeyAndCategory(payload)
        console.log(res)
        if (res.data && res.data.status === 'S') {
            bizparTaxTplComponentDetail = res.data.data
        } else { bizparTaxTplComponentDetail = null }

        this.setState({
            bizparTaxTplComponentDetail, selectedIndex: index, editVisible: !this.state.editVisible
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
                            title='Tax Template Detail'
                            subtitle={"lorem ipsum dolor"}
                            data={this.state.dataTableDetails}
                            columns={this.columns}
                            options={options} />
                    </MuiThemeProvider>
                </div>
                <div>
                    {this.state.editVisible && (
                        <EditTaxDetail
                            onClickSave={this.props.onClickSave.bind(this)}
                            bizparTaxTplComponent={this.props.bizparTaxTplComponent}
                            bizparTaxTplComponentItem={this.props.bizparTaxTplComponentItem}
                            bizparTaxTplComponentType={this.props.bizparTaxTplComponentType}
                            bizparTaxTplSegment={this.props.bizparTaxTplSegment}
                            bizparTaxTplComponentDetail={this.state.bizparTaxTplComponentDetail}
                            onClickClose={this.close.bind(this)}
                            data={this.state.data.taxTPLDetails[this.state.selectedIndex]}
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
export default TableTaxDetail