import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import PopUp from '../../../components/pages/PopUpAlert'
import FormMasterWorkingDetail from './formMasterWorkingDetail'

var ct = require("../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions()

class FormMasterWorking extends Component {
    constructor(props) {
        super(props)
        this.state = {
            detailVisible: false,
            deletePopUpVisible: false
        }
    }

    openDetailForm = () => {
        this.setState({ detailVisible: !this.state.detailVisible })
    }

    openDeletePopUp = () => {
        this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible })
    }

    columns = [
        "NIK",
        "Working Type",
        {
            name: "Description",
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
                            onClick={this.openDeletePopUp}>
                            <i className="fa fa-lw fa-trash-alt" />
                        </button>
                    )
                }
            }
        }
    ]

    data = [["1", "TETAP"], ["2", "KONTRAK"]]

    render() {
        let { detailVisible, deletePopUpVisible } = this.state
        return (
            <div>
                <MuiThemeProvider theme={getMuiTheme()}>
                    <MUIDataTable
                        title='Working Type'
                        data={this.data}
                        columns={this.columns}
                        options={options}
                    />
                </MuiThemeProvider>

                {detailVisible && (
                    <FormMasterWorkingDetail
                        onClickClose={this.openDetailForm.bind(this)}
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

export default FormMasterWorking