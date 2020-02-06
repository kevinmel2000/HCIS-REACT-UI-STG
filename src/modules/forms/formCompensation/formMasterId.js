import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import PopUp from '../../../components/pages/PopUpAlert'
import FormMasterIdDetail from './formMasterIdDetail'
import FormMasterIdCreate from './formMasterIdCreate'

var ct = require("../../custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions()

class FormMasterId extends Component {
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
        "Process Name",
        {
            name: "Payroll Component",
            options: {
                customBodyRender: () => {
                    return (
                        <button
                            className="btn btn-blue btn-small-circle"
                            onClick={this.openDetailForm}>
                            <i className="fa fa-lw fa-ellipsis-h" />
                        </button>
                    )
                }
            }
        },
        {
            name: "Action",
            options: {
                customBodyRender: () => {
                    return (
                        <button
                            className="btn btn-red btn-small-circle"
                            onClick={() => this.openPopUp("delete")}>
                            <i className="fa fa-lw fa-trash-alt" />
                        </button>
                    )
                }
            }
        }
    ]

    data = [["1", "PAYROLL"],["2", "THR"]]

    render() {
        let { createVisible, detailVisible, savePopUpVisible, deletePopUpVisible } = this.state
        return (
            <div>
                <div className="padding-5px grid grid-2x">
                    <div className="col-1"></div>
                    <div className="col-2 content-right">
                        <button type="button" className="btn btn-circle background-blue margin-right-5px" onClick={this.openCreateForm}>
                            <i className='fa fa-1x fa-plus'></i>
                        </button>
                    </div>
                </div>
                <MuiThemeProvider theme={getMuiTheme()}>
                    <MUIDataTable
                        title='ID Process'
                        data={this.data}
                        columns={this.columns}
                        options={options}
                    />
                </MuiThemeProvider>

                {createVisible && (
                    <FormMasterIdCreate
                        type={"create"}
                        onClickSave={() => this.openPopUp("save")}
                        onClickClose={this.openCreateForm.bind(this)}
                    />
                )}

                {detailVisible && (
                    <FormMasterIdDetail
                        onClickClose={this.openDetailForm.bind(this)}
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

export default FormMasterId