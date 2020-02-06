import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import FormMiniPaymentCreate from '../../modules/forms/formCompensation/formMiniPaymentCreate'
import FormMiniRepaymentDetail from '../../modules/forms/formCompensation/formMiniPaymentDetail'
import PopUp from '../pages/PopUpAlert';

var ct = require("../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

class CnbMiniRepayment extends Component {
    constructor(props) {
        super(props)
        this.state = {
            createVisible: false,
            editVisible: false,
            detailVisible: false,
            savePopUpVisible: false,
            deletePopUpVisible: false
        }
    }

    openCreateForm = () => {
        let savePopUpVisible = this.state.savePopUpVisible ? !this.state.savePopUpVisible : false
        this.setState({ createVisible: !this.state.createVisible, savePopUpVisible })
    }

    openUpdateForm = () => {
        let savePopUpVisible = this.state.savePopUpVisible ? !this.state.savePopUpVisible : false
        this.setState({ editVisible: !this.state.editVisible, savePopUpVisible })
    }

    openDetailForm = () => {
        this.setState({ detailVisible: !this.state.detailVisible })
    }

    openSavePopUp = () => {
        this.setState({ savePopUpVisible: !this.state.savePopUpVisible })
    }

    openDeletePopUp = () => {
        this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible })
    }

    columns = [
        "No",
        "NIK",
        "Employee Name",
        "Component Name",
        "Join Date",
        "End Date",
        "Monthly Nominal",
        "Information",
        {
            name: "Detail",
            options: {
                customBodyRender: () => {
                    return (
                        <button
                            className="btn btn-blue btn-small-circle"
                            style={{ marginRight: 5 }}
                            onClick={this.openDetailForm}>
                            <i className="fas fa-lw fa-ellipsis-h" />
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
        ["1", "20000005", "AGUS SUTARDI", "Allocation Allowance", "14/03/2019", "12/03/2019", "200,000,00", "Pajak Perusahaan"],
        ["2", "20000005", "AGUS SUTARDI", "Bonus", "12/03/2019", "29/03/2019", "3,000,000,00", "Remark"]
    ]

    render() {
        let { createVisible, editVisible, detailVisible, savePopUpVisible, deletePopUpVisible } = this.state
        return (
            <div className="main-content">
                <div className="padding-15px grid grid-2x">
                    <div className="col-1">
                        <div className="txt-site txt-18 txt-bold txt-main padding-top-5px">
                            {/* COMPENSATION - MINI REPAYMENT */}
                        </div>
                    </div>
                    <div className="col-2 content-right">
                        <button type="button" className="btn btn-circle background-blue" style={{ marginRight: 5 }} onClick={this.openCreateForm}>
                            <i className='fa fa-1x fa-plus'></i>
                        </button>
                    </div>
                </div>

                <div className="padding-5px">
                    <MuiThemeProvider theme={getMuiTheme()}>
                        <MUIDataTable
                            title='Mini Repayment'
                            data={this.data}
                            columns={this.columns}
                            options={options}
                        />
                    </MuiThemeProvider>
                </div>

                {createVisible && (
                    <FormMiniPaymentCreate
                        type={"create"}
                        onClickSave={this.openSavePopUp.bind(this)}
                        onClickClose={this.openCreateForm.bind(this)}
                    />
                )}

                {editVisible && (
                    <FormMiniPaymentCreate
                        type={"update"}
                        onClickSave={this.openSavePopUp.bind(this)}
                        onClickClose={this.openUpdateForm.bind(this)}
                    />
                )}

                {detailVisible && (
                    <FormMiniRepaymentDetail
                        type={"detail"}
                        onClickClose={this.openDetailForm.bind(this)}
                    />
                )}

                {savePopUpVisible && (
                    <PopUp
                        type={"save"}
                        class={"app-popup app-popup-show"}
                        onClick={createVisible ? this.openCreateForm.bind(this) : this.openUpdateForm.bind(this)}
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

export default CnbMiniRepayment