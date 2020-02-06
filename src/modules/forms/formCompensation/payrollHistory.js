import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import FormPayrollHistory from './formPayrollHistory'
import PopUp from '../../../components/pages/PopUpAlert'

var ct = require("../../custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

class PayrollHistory extends Component {
    constructor(props) {
        super(props)
        this.state = {
            createVisible: false,
            editVisible: false,
            viewVisible: false,
            savePopUpVisible: false,
            deletePopUpVisible: false
        }
    }

    openCreateForm = () => {
        let savePopUpVisible = this.state.savePopUpVisible ? !this.state.savePopUpVisible : false;
        this.setState({ createVisible: !this.state.createVisible, savePopUpVisible })
    }

    openUpdateForm = () => {
        let savePopUpVisible = this.state.savePopUpVisible ? !this.state.savePopUpVisible : false;
        this.setState({ editVisible: !this.state.editVisible, savePopUpVisible })
    }

    openViewForm = () => {
        this.setState({ viewVisible: !this.state.viewVisible })
    }

    openSavePopUp = () => {
        this.setState({ savePopUpVisible: !this.state.savePopUpVisible })
    }

    openDeletePopUp = () => {
        this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible })
    }
    columns = [
        {
            name: "No",
            options: {
                customBodyRender: (val) => {
                    return (
                        <div>
                            <div
                                style={{ cursor: "pointer" }}
                                onClick={() => this.openViewForm()}
                            >
                                {val}
                            </div>
                        </div>
                    );
                }
            }
        },
        "Component",
        "Basic Salary",
        "Efective Date",
        "End Date",
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
        ["1", "Basic Salary", "6,000,000", "12-08-2017", "02-01-2019"],
        ["2", "Basic Salary", "10,000,000", "04-01-2018", "06-10-2019"]
    ]

    render() {
        let { createVisible, editVisible, viewVisible, savePopUpVisible, deletePopUpVisible } = this.state
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px"></div>
                <div className="popup-content background-white border-radius">
                    <div className="padding-15px background-blue grid grid-2x">
                        <div className="col-1">
                            <div className="txt-site txt-12 txt-bold post-center">
                                Payroll Structure - History
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button className="btn btn-circle background-blue" onClick={this.props.onClickClose}>
                                <i className="fa fa-lg fa-times"></i>
                            </button>
                        </div>
                    </div>
                    <div className="padding-15px">
                        <div className="col-2 content-right">
                            <button type="button" className="btn btn-circle background-blue" style={{ marginRight: 5 }} onClick={this.openCreateForm}>
                                <i className='fa fa-1x fa-plus'></i>
                            </button>
                        </div>
                    </div>

                    <div className="padding-5px">
                        <MuiThemeProvider theme={getMuiTheme()}>
                            <MUIDataTable
                                title='History'
                                data={this.data}
                                columns={this.columns}
                                options={options}
                            />
                        </MuiThemeProvider>
                    </div>

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

                    {createVisible && (
                        <FormPayrollHistory
                            type={"create"}
                            onClickSave={this.openSavePopUp.bind(this)}
                            onClickClose={this.openCreateForm.bind(this)}
                        />
                    )}

                    {editVisible && (
                        <FormPayrollHistory
                            type={"update"}
                            onClickSave={this.openSavePopUp.bind(this)}
                            onClickClose={this.openUpdateForm.bind(this)}
                        />
                    )}

                    {viewVisible && (
                        <FormPayrollHistory
                            type={"view"}
                            onClickClose={this.openViewForm.bind(this)}
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
            </div>
        )
    }
}

export default PayrollHistory