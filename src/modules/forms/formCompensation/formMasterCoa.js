import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import PopUp from '../../../components/pages/PopUpAlert';
import FormMasterCoaCreate from './formMasterCoaCreate';

var ct = require("../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions()

class FormMasterCoa extends Component {
    constructor(props) {
        super(props)
        this.state = {
            createVisible: false,
            editVisible: false,
            savePopUpVisible: false,
            deletePopUpVisible: false
        }
    }

    openCreateForm = () => {
        let savePopUpVisible = this.state.savePopUpVisible ? !this.state.savePopUpVisible : false;
        this.setState({ createVisible: !this.state.createVisible, savePopUpVisible })
    }

    openEditForm = () => {
        let savePopUpVisible = this.state.savePopUpVisible ? !this.state.savePopUpVisible : false;
        this.setState({ editVisible: !this.state.editVisible, savePopUpVisible })
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
        "COA Code",
        "COA Name",
        {
            name: "Action",
            options: {
                customBodyRender: () => {
                    return (
                        <div>
                            <button
                                className="btn btn-red btn-small-circle"
                                style={{ marginRight: 5 }}
                                onClick={() => this.openEditForm()}>
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

    data = [
        ["1", "207010000", "PPH21"],
        ["2", "10230300A", "CICILAN COP"]
    ]

    render() {
        let { createVisible, editVisible, savePopUpVisible, deletePopUpVisible } = this.state
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
                <div className="padding-10px">
                    <MuiThemeProvider theme={getMuiTheme()}>
                        <MUIDataTable
                            title='COA'
                            data={this.data}
                            columns={this.columns}
                            options={options}
                        />
                    </MuiThemeProvider>
                </div>

                {createVisible && (
                    <FormMasterCoaCreate
                        type={"create"}
                        onClickSave={() => this.openPopUp("save")}
                        onClickClose={this.openCreateForm.bind(this)}
                    />
                )}

                {editVisible && (
                    <FormMasterCoaCreate
                        type={"update"}
                        onClickSave={() => this.openPopUp("save")}
                        onClickClose={this.openEditForm.bind(this)}
                    />
                )}

                {savePopUpVisible && (
                    <PopUp
                        type={"save"}
                        class={"app-popup app-popup-show"}
                        onClick={createVisible ? this.openCreateForm.bind(this) : this.openEditForm.bind(this)}
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

export default FormMasterCoa