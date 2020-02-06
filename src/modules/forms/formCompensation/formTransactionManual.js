import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import FormTransactionManualCreate from './formTransactionManualCreate'
import PopUp from '../../../components/pages/PopUpAlert'

var ct = require("../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

class FormTransactionManual extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formCreateVisible: false,
            savePopUpVisible: false,
            deletePopUpVisible: false
        }
    }

    openCreateForm = () => {
        let savePopUpVisible = this.state.savePopUpVisible ? !this.state.savePopUpVisible : false
        this.setState({ formCreateVisible: !this.state.formCreateVisible, savePopUpVisible })
    }

    openSavePopUp = () => {
        this.setState({ savePopUpVisible: !this.state.savePopUpVisible })
    }

    openDeletePopUp = () => {
        this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible })
    }

    columns = [
        "No",
        "Date",
        "Request By",
        "NIK",
        "Employee Name",
        "Period",
        "Component Name",
        "Basic Gross Salary",
        {
            name: "Process Status",
            options: {
                customBodyRender: () => {
                    return (
                        <div className="content-center">
                            <input type="checkbox" disabled />
                        </div>
                    )
                }
            }
        },
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
                                onClick={this.openDeletePopUp}>
                                <i className="fa fa-lw fa-trash-alt" />
                            </button>
                        </div>
                    )
                }
            }
        }
    ]

    data = [
        ["1", "20/03/2019", "LILYANA TAN", "1000001", "TONY", "201903", "Other Allowance", "1,000,000"],
        ["2", "14/03/2019", "LILYANA TAN", "1000017", "ARIEF FADHILLAH", "201902","Basic Salary", "3,000,000"]
    ]

    render() {
        let { formCreateVisible, savePopUpVisible, deletePopUpVisible } = this.state
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
                        title='Manual'
                        data={this.data}
                        columns={this.columns}
                        options={options}
                    />
                </MuiThemeProvider>

                {formCreateVisible && (
                    <FormTransactionManualCreate 
                        onClickSave={this.openSavePopUp.bind(this)}
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
                        onClick={this.openDeletePopUp.bind(this)}
                        onClickDelete={this.openDeletePopUp.bind(this)}
                    />
                )}

            </div>
        )
    }
}

export default FormTransactionManual