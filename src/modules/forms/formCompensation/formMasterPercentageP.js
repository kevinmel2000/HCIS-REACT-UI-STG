import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import PopUp from '../../../components/pages/PopUpAlert'
import PercentageParameterCreate from './percentageParameterCreate'

var ct = require("../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

class FormMasterPercentageP extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formCreateVisible: false,
            formUpdateVisible: false,
            savePopUpVisible: false,
            deletePopUpVisible: false
        }
    }

    openCreateForm = () => {
        let savePopUpVisible = this.state.savePopUpVisible ? !this.state.savePopUpVisible : false
        this.setState({ formCreateVisible: !this.state.formCreateVisible, savePopUpVisible })
    }
    
    openUpdateForm = () => {
        let savePopUpVisible = this.state.savePopUpVisible ? !this.state.savePopUpVisible : false
        this.setState({ formUpdateVisible: !this.state.formUpdateVisible, savePopUpVisible })
    }

    openSavePopUp = () => {
        this.setState({ savePopUpVisible: !this.state.savePopUpVisible })
    }

    openDeletePopUp = () => {
        this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible })
    }

    columns = [
        "No",
        "Component ID",
        "Structure ID",
        "Structure Name",
        "Percentage",
        "Multiplier",
        "Constanta Value",
        {
            name: "Action",
            options: {
                customBodyRender: () => {
                    return (
                        <div>
                            <button
                                className="btn btn-red btn-small-circle"
                                style={{ marginRight: 5 }}
                                onClick={() => this.openUpdateForm()}>
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
        ["1", "BONUS", "ALL", "ALL", "3.00", "GAJI POKOK, POSITION ALLOWANCE", "2.00"],
        ["2", "POT_JHT_KARYAWAN", "ALL", "ALL", "2.00", "GAJI POKOK", "0.00"],
    ]

    render() {
        let { formCreateVisible, formUpdateVisible, savePopUpVisible, deletePopUpVisible } = this.state
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
                        title='Percentage Parameter'
                        data={this.data}
                        columns={this.columns}
                        options={options}
                    />
                </MuiThemeProvider>

                {formCreateVisible && (
                    <PercentageParameterCreate 
                        type={"create"}
                        onClickSave={this.openSavePopUp.bind(this)}
                        onClickClose={this.openCreateForm.bind(this)}
                    />
                )}

                {formUpdateVisible && (
                    <PercentageParameterCreate 
                        type={"update"}
                        onClickSave={this.openSavePopUp.bind(this)}
                        onClickClose={this.openUpdateForm.bind(this)}
                    />
                )}

                {savePopUpVisible && (
                    <PopUp 
                        type={"save"}
                        class={"app-popup app-popup-show"}
                        onClick={ formCreateVisible ? this.openCreateForm.bind(this) : this.openUpdateForm.bind(this)}
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

export default FormMasterPercentageP