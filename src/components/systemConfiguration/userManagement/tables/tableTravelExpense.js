import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"

var ct = require("../../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

class TableTravelExpense extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    columns = [
        "Level",
        "Position",
        "Trip Type",
        "Travel Type",
        "Travel Category",
        {
            name: "Activation",
            options: {
                customHeadRender: (columnMeta) => (
                    <th key={columnMeta.index} style={{ cursor: 'pointer', borderBottom: "1px rgba(0,0,0,0.1) solid", fontSize: 13, fontWeight: 1, textAlign: "center", top: 0, position: "sticky", backgroundColor: "#fff", zIndex: 100 }} scope="col">
                        {columnMeta.name}
                    </th>
                ),
                customBodyRender: (val) => {
                    return (
                        <div className="grid grid-2x">
                            <div className="column-1">
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
                                </div>
                                <div className="column-2">
                                {val}
                                </div>
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
                        <div className="grid grid-2x">
                            <div className="column-1">
                                <button
                                    className="btnAct"
                                    style={{ marginRight: 10 }}
                                    type='button'
                                    onClick={this.props.openSlide('slide-travel', tableMeta.rowIndex)}
                                >
                                    <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                                </button>
                            </div>
                            <div className="column-2">
                                <button
                                    className="btnAct"
                                    type='button'
                                    onClick={() => this.props.onDeletePopup(tableMeta.rowIndex)}
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

    render() {
        return (
            <div>
                <MuiThemeProvider theme={getMuiTheme()}>
                    <MUIDataTable
                        title={"Travel Expense Template"}
                        subtitle={"lorem ipsum dolor"}
                        data={this.props.dataTable}
                        columns={this.columns}
                        options={options} />
                </MuiThemeProvider>
            </div>
        )
    }
}
export default TableTravelExpense