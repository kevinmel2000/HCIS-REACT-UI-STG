import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import PopUp from '../../../components/pages/PopUpAlert'
import ComponentVariable from './componentVariable'

var ct = require("../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

class FormMasterComponentVariable extends Component {
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
        "ID Structure",
        "Structure Code",
        "Amount",
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
        ["1", "DIVISI", "E FULFILLMENT", "200,000.00"]
    ]

    render() {
        let { formCreateVisible, formUpdateVisible, savePopUpVisible, deletePopUpVisible } = this.state
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px"></div>
                <div className="popup-content background-white border-radius">
                    <div className="padding-15px background-blue grid grid-2x">
                        <div className="col-1">
                            <div className="txt-site txt-12 txt-bold post-center">
                                COMPENSATION - COMPONENT VARIABLE
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button className="btn btn-circle background-blue" onClick={this.props.onClickClose}>
                                <i className="fa fa-lg fa-times"></i>
                            </button>
                        </div>
                    </div>
                    <div className="padding-15px grid grid-2x">
                        <div className="col-1"></div>
                        <div className="col-2 content-right">
                            <button type="button" className="btn btn-circle background-blue margin-right-5px" onClick={this.openCreateForm}>
                                <i className='fa fa-1x fa-plus'></i>
                            </button>
                        </div>
                    </div>
                    <div className="padding-15px">
                        <MuiThemeProvider theme={getMuiTheme()}>
                            <MUIDataTable
                                title='Component Variable'
                                data={this.data}
                                columns={this.columns}
                                options={options}
                            />
                        </MuiThemeProvider>
                    </div>

                    {formCreateVisible && (
                        <ComponentVariable 
                            type={"create"}
                            onClickSave={this.openSavePopUp.bind(this)}
                            onClickClose={this.openCreateForm.bind(this)}
                        />
                    )}

                    {formUpdateVisible && (
                        <ComponentVariable 
                            type={"update"}
                            onClickSave={this.openSavePopUp.bind(this)}
                            onClickClose={this.openUpdateForm.bind(this)}
                        />
                    )}

                    <div className="padding-15px">
                        <div className="grid grid-2x">
                            <div className="col-1"></div>
                            <div className="col-2 content-right">
                                <button
                                    style={{ marginLeft: "15px" }}
                                    className="btn btn-primary"
                                    type="button"
                                    onClick={this.props.onClickClose}>
                                    <span>CLOSE</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {savePopUpVisible && (
                        <PopUp
                            type={"save"}
                            class={"app-popup app-popup-show"}
                            onClick={formCreateVisible ? this.openCreateForm.bind(this) : this.openUpdateForm.bind(this)}
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
            </div>
        )
    }
}

export default FormMasterComponentVariable