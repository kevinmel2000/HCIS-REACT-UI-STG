import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"

var ct = require("../../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

class tablePresence extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    
    columns = [
        "Presence Point Name",
        "Is Active",
        "Is Default",
        "Latitude",
        "Longitude",
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
                                onClick={this.props.openSlide('slide-presence', tableMeta.rowIndex)}
                            >
                                <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                            </button>
                            <button
                                className="btnAct"
                                style={{marginRight: 15}}
                                type='button'
                                onClick={() => this.props.onDeletePopup(tableMeta.rowIndex)}
                            >
                                <i className="fa fa-lw fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                            </button>
                            <button
                                className="btnAct"
                                type='button'
                                onClick={() => this.props.openMaps("maps", tableMeta.rowIndex)}
                            >
                                <i className="fa fa-lw fa-map-marked-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
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
                <MuiThemeProvider theme={getMuiTheme()}>
                    <MUIDataTable
                        title={"Presence Point"}
                        subtitle={"lorem ipsum dolor"}
                        data={this.props.dataTable}
                        columns={this.columns}
                        options={options} />
                </MuiThemeProvider>
            </div>
        )
    }
}
export default tablePresence