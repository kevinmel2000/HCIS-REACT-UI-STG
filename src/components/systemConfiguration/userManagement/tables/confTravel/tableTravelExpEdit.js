import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import FormTravelExpCreate from '../../forms/create/travel/formTravelExpCreate'
import NumberFormat from 'react-number-format'

var ct = require("../../../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions5()

class TableTravelExpenseEdit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            editVisible: false,
            travelData: props.rawData,
            dataTableDetails: []
        }
    }

    openEdit = (selectedIndex) => {
        this.setState({ editVisible: !this.state.editVisible, selectedIndex })
    }

    componentDidMount() {
        this.getData(this.props.rawData)
    }

    getData(travelData) {
        let dataTableDetails = Object.assign([], travelData.corporateTravelExpenseDetails)
        dataTableDetails = dataTableDetails.map((value) => {
            const { budgetType, budgetCategory, budgetClass, budgetValue, budgetCurrency } = value
            return [
                budgetType ? budgetType.bizparValue : "-",
                budgetCategory ? budgetCategory.bizparValue : "-",
                budgetClass ? budgetClass.bizparValue : "-",
                <NumberFormat thousandSeparator={true} value={budgetValue} readOnly type="text" style={{ backgroundColor: "transparent" }} />,
                budgetCurrency ? budgetCurrency.bizparValue : "-",
                "YES"
            ]
        })
        this.setState({ dataTableDetails })
    }

    columns = [
        "Budget Type",
        "Budget Category",
        "Budget Class",
        "Budget Value",
        "Currency",
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
                                        val==="YES"
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
                        <div className='grid grid-2x'>
                            <div className='column-1'>
                                <button
                                    className="btnAct"
                                    style={{ marginRight: 15 }}
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

    componentDidUpdate(prevProps) {
        if (this.props.rawData !== prevProps.rawData) {
            let travelData = this.props.rawData
            this.getData(travelData)
            this.setState({ travelData })
        }
    }

    render() {
        return (
            <div>
                <MuiThemeProvider theme={getMuiTheme()}>
                    <MUIDataTable
                        title={"Travel Expense Detail"}
                        data={this.state.dataTableDetails}
                        columns={this.columns}
                        options={options} />
                </MuiThemeProvider>
                {this.state.editVisible &&
                    <FormTravelExpCreate
                        type={"update"}
                        bizparSppdCostType={this.props.bizparSppdCostType}
                        bizparSppdTripType={this.props.bizparSppdTripType}
                        bizparSppdCostCategory={this.props.bizparSppdCostCategory}
                        bizparSppdCostClass={this.props.bizparSppdCostClass}
                        bizparCurrency={this.props.bizparCurrency}
                        rawData={this.state.travelData.corporateTravelExpenseDetails[this.state.selectedIndex]}
                        onClickSave={this.props.onClickSave.bind(this)}
                        onClickClose={this.openEdit.bind(this)}
                    />}
            </div>
        )
    }
}
export default TableTravelExpenseEdit