import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import PopUp from '../../../components/pages/PopUpAlert'
import FormMasterParameterSingleCreate from './formMasterParameterSingleCreate'

var ct = require("../../custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions()

class FormMasterParameterSingle extends Component {
    constructor(props) {
        super(props)
        this.state = {
            createVisible: false,
            detailVisible: false,
            savePopUpVisible: false,
            deletePopUpVisible: false
        }
    }

    openCreateForm = () => {
        let savePopUpVisible = this.state.savePopUpVisible ? !this.state.savePopUpVisible : false
        this.setState({ createVisible: !this.state.createVisible, savePopUpVisible })
    }

    openDetailForm = () => {
        this.setState({ detailVisible: !this.state.detailVisible })
    }

    openPopUp = (type) => {
        switch (type) {
            case "save":
                this.setState({ savePopUpVisible: !this.state.savePopUpVisible })
                break;
            case "delete":
                this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible })
                break;
            default:
                break;
        }
    }

    columns = [
        "No",
        "Parameter ID",
        "Parameter Code",
        "Parameter Name",
        "Number",
        "Value",
        "Description",
        {
            name: "Action",
            options: {
                customBodyRender: () => {
                    return (
                        <button
                            className="btn btn-red btn-small-circle"
                            onClick={this.openCreateForm}>
                            <i className="fa fa-lw fa-pencil-alt" />
                        </button>
                    )
                }
            }
        }
    ]

    data = [["1", "TAX_PTKP", "K0", "K0", "5", "58,500,000.00", "Kawin Anak 0"], ["2", "TAX_PTKP", "K1", "K1", "6", "63,000,000.00", "Kawin Anak 1"]]

    render() {
        let { createVisible, savePopUpVisible, deletePopUpVisible } = this.state
        return (
            <div>
                <MuiThemeProvider theme={getMuiTheme()}>
                    <MUIDataTable
                        title='Single Value'
                        data={this.data}
                        columns={this.columns}
                        options={options}
                    />
                </MuiThemeProvider>

                {createVisible && (
                    <FormMasterParameterSingleCreate
                        onClickSave={() => this.openPopUp("save")}
                        onClickClose={this.openCreateForm.bind(this)}
                    />
                )}

                {savePopUpVisible && (
                    <PopUp
                        type={"save"}
                        class={"app-popup app-popup-show"}
                        onClick={this.openCreateForm.bind(this)}
                    />
                )}

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

export default FormMasterParameterSingle