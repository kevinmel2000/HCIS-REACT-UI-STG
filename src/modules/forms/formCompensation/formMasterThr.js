import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import PopUp from '../../../components/pages/PopUpAlert';

var ct = require("../../custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions()

class FormMasterThrDate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            deletePopUpVisible: false,
            savePopUpVisible: false
        }
    }

    openPopUp = (type) => {
        switch (type) {
            case "delete":
                this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible })
                break;
            case "save":
                this.setState({ savePopUpVisible: !this.state.savePopUpVisible })
                break;
            default:
                break;
        }
    }

    columns = [
        "No",
        "THR Name",
        "Date",
        {
            name: "Action",
            options: {
                customBodyRender: () => {
                    return (
                        <div>
                            <button
                                className="btn btn-red btn-small-circle"
                                style={{ marginRight: 5 }}>
                                <i className="fa fa-lw fa-pencil-alt" />
                            </button>
                            <button
                                className="btn btn-red btn-small-circle"
                                onClick={() => this.openPopUp("delete")}>
                                <i className="fa fa-lw fa-trash-alt" />
                            </button>
                        </div>
                    )
                }
            }
        }
    ]

    data = [["1", "Lebaran", "12-09-2019"]]

    render() {
        let { deletePopUpVisible } = this.state
        return (
            <div>
                <MuiThemeProvider theme={getMuiTheme()}>
                    <MUIDataTable
                        title='THR Date'
                        data={this.data}
                        columns={this.columns}
                        options={options}
                    />
                </MuiThemeProvider>

                {deletePopUpVisible && (
                    <PopUp
                        type={"delete"}
                        class={"app-popup app-popup-show"}
                        onClick={() => this.openPopUp("delete")}
                        onClickDelete={() => this.openPopUp("delete")}
                    />
                )}
            </div>
        )
    }
}

export default FormMasterThrDate