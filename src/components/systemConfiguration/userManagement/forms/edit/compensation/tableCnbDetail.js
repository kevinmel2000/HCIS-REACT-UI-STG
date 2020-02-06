import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import FormCnbDetail from '../../create/compensation/formCnbDetail'
import PopUp from '../../../../../pages/PopUpAlert'
import NumberFormat from 'react-number-format'

var ct = require("../../../../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions5()

class tableCnbDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            editVisible: false,
            savePopUpVisible: false,
            dataTable: []
        }
    }

    openEdit = (selectedIndex) => {
        let savePopUpVisible = this.state.savePopUpVisible ? !this.state.savePopUpVisible : false
        this.setState({ editVisible: !this.state.editVisible, selectedIndex, savePopUpVisible })
    }

    componentDidMount() {
        this.getData()
    }

    getData() {
        let dataTable = this.props.payloadCnb.cnbdetails.map((value) => {
            const { cNBDetaiID, cNBType, cNBComponent, cNBValueType, cNBValue } = value
            return [
                cNBDetaiID,
                cNBType,
                cNBComponent ? cNBComponent.bizparValue : "-",
                cNBValueType ? cNBValueType.bizparValue : "-",
                <NumberFormat thousandSeparator={true} value={cNBValue} readOnly type="text" style={{ backgroundColor: "transparent"}} />,
                "YES"
            ]
        })
        this.setState({ dataTable })
    }

    componentDidUpdate(prevProps) {
        if (this.props.payloadCnb !== prevProps.payloadCnb) return this.getData()
    }

    columns = [
        "CNB Detail ID",
        "CNB Type",
        "CNB Component",
        "CNB Value Type",
        "CNB Value",
        {
            name: "Activation",
            options: {
              customBodyRender: val => {
                return (
                  <div>
                    <i
                      className="fa fa-lw fa-circle"
                      style={{
                        color: val === "YES" ? "green" : "brown",
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
                                    <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }}/>
                                </button>
                            </div>
                            <div className='column-2'>
                                <button
                                    className="btnAct"
                                    type='button'
                                    onClick={() => this.props.onDeletePopUp(tableMeta.rowIndex, "delete-detail")}
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

    openSavePopUp = () => {
        this.setState({
            savePopUpVisible: !this.state.savePopUpVisible
        })
    }

    render() {
        return (
            <div>
                <MuiThemeProvider theme={getMuiTheme()}>
                    <MUIDataTable
                        title={"CNB Template Detail"}
                        subtitle={"lorem ipsum dolor"}
                        data={this.state.dataTable}
                        columns={this.columns}
                        options={options} />
                </MuiThemeProvider>
                {this.state.editVisible &&
                    <FormCnbDetail
                        type={"update"}
                        bizparCompensationType={this.props.bizparCompensationType}
                        bizparPayrollTplComponentType={this.props.bizparPayrollTplComponentType}
                        payloadCnb={this.props.payloadCnb.cnbdetails[this.state.selectedIndex]}
                        onClickSave={this.props.onClickSave.bind(this)}
                        onClickClose={this.openEdit.bind(this)}
                    />}

                {this.state.savePopUpVisible && (
                    <PopUp
                        type={"save"}
                        class={"app-popup app-popup-show"}
                        onClick={() => this.openEdit()}
                    />
                )}
            </div>
        )
    }
}
export default tableCnbDetail