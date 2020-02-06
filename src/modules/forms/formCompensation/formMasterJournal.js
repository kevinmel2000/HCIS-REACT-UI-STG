import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import PopUp from '../../../components/pages/PopUpAlert'
import FormMasterJournalCreate from './formMasterJournalCreate'
import FormMasterJournalUpload from './formMasterJournalUpload'

var ct = require("../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

class FormMasterJournal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formCreateVisible: false,
            formUpdateVisible: false,
            formUploadVisible: false,
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

    openUploadForm = () => {
        let savePopUpVisible = this.state.savePopUpVisible ? !this.state.savePopUpVisible : false
        this.setState({ formUploadVisible: !this.state.formUploadVisible, savePopUpVisible })
    }

    openSavePopUp = () => {
        this.setState({ savePopUpVisible: !this.state.savePopUpVisible })
    }

    openDeletePopUp = () => {
        this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible })
    }

    columns = [
        "No",
        "Sequence",
        "ROW",
        "Component Name",
        {
            name: "Debit",
            options: {
                customHeadRender: (columnMeta) => (
                    <th style={{ cursor: 'pointer', backgroundColor: '#F6F6F6', color: '#555555', fontSize: 13, fontWeight: 1 }}>
                        <div style={{ borderBottom: "1px rgba(0,0,0,0.1) solid" }}>{columnMeta.name}</div>
                        <div className="grid grid-3x" style={{ backgroundColor: '#F6F6F6', color: '#555555', fontSize: 13, fontWeight: 1 }}>
                            <div className="col-1">
                                COA Code
                            </div>
                            <div className="col-2">
                                COA Name
                            </div>
                            <div className="col-3">
                                Branch Type
                            </div>
                        </div>
                    </th>
                ),
                customBodyRender: (val) => (
                    <div className="grid grid-3x content-center">
                        <div className="col-1">
                            {val.split("|")[0]}
                        </div>
                        <div className="col-2">
                            {val.split("|")[1]}
                        </div>
                        <div className="col-3">
                            {val.split("|")[2]}
                        </div>
                    </div>
                )
            }
        },
        {
            name: "Credit",
            options: {
                customHeadRender: (columnMeta) => (
                    <th style={{ cursor: 'pointer', backgroundColor: '#F6F6F6', color: '#555555', fontSize: 13, fontWeight: 1 }}>
                        <div style={{ borderBottom: "1px rgba(0,0,0,0.1) solid" }}>{columnMeta.name}</div>
                        <div className="grid grid-3x" style={{ backgroundColor: '#F6F6F6', color: '#555555', fontSize: 13, fontWeight: 1 }}>
                            <div className="col-1">
                                COA Code
                            </div>
                            <div className="col-2">
                                COA Name
                            </div>
                            <div className="col-3">
                                Branch Type
                            </div>
                        </div>
                    </th>
                ),
                customBodyRender: (val) => (
                    <div className="grid grid-3x content-center">
                        <div className="col-1">
                            {val.split("|")[0]}
                        </div>
                        <div className="col-2">
                            {val.split("|")[1]}
                        </div>
                        <div className="col-3">
                            {val.split("|")[2]}
                        </div>
                    </div>
                )
            }
        },
        "Description",
        "Creditor Debit",
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
        ["1", "1", "1", "Basic Salary", "660001| |KANTOR_PUSAT", "660002| |KANTOR_PUSAT", "Basic Salary", "DEBIT"],
        ["2", "1", "2", "Bonus", "660001| |KANTOR_PUSAT", "660002| |KANTOR_PUSAT", "Bonus", "DEBIT"]
    ]

    render() {
        let { formCreateVisible, formUpdateVisible, formUploadVisible, savePopUpVisible, deletePopUpVisible } = this.state
        return (
            <div>
                <div className="margin-bottom-10px grid grid-2x">
                    <div className="col-1"></div>
                    <div className="col-2 content-right">
                        <button type="button" className="btn btn-circle background-blue margin-right-5px" onClick={this.openUploadForm}>
                            <i className='fa fa-1x fa-upload'></i>
                        </button>
                        <button type="button" className="btn btn-circle background-blue margin-right-5px" onClick={this.openCreateForm}>
                            <i className='fa fa-1x fa-plus'></i>
                        </button>
                    </div>
                </div>
                <MuiThemeProvider theme={getMuiTheme()}>
                    <MUIDataTable
                        title='Journal'
                        data={this.data}
                        columns={this.columns}
                        options={options}
                    />
                </MuiThemeProvider>

                {formCreateVisible && (
                    <FormMasterJournalCreate
                        type={"create"}
                        onClickSave={this.openSavePopUp.bind(this)}
                        onClickClose={this.openCreateForm.bind(this)}
                    />
                )}

                {formUpdateVisible && (
                    <FormMasterJournalCreate
                        type={"update"}
                        onClickSave={this.openSavePopUp.bind(this)}
                        onClickClose={this.openUpdateForm.bind(this)}
                    />
                )}

                {formUploadVisible && (
                    <FormMasterJournalUpload
                        onClickSave={this.openSavePopUp.bind(this)}
                        onClickClose={this.openUploadForm.bind(this)}
                    />
                )}

                {savePopUpVisible && (
                    <PopUp
                        type={"save"}
                        class={"app-popup app-popup-show"}
                        onClick={formCreateVisible ? this.openCreateForm.bind(this) : formUpdateVisible ? this.openUpdateForm.bind(this) : this.openUploadForm.bind(this)}
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

export default FormMasterJournal