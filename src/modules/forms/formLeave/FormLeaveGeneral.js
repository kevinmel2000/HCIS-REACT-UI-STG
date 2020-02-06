import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import MUIDataTable from "mui-datatables-bitozen"
import Form from '../../../components/pages/FieldForm'

var ct = require("../../../modules/custom/customTable");

class FormLeaveGeneral extends Component {
    constructor(props) {
        super(props)
        this.state = {
            leaveData: props.leaveData
        }
    }

    getMuiTheme = () => createMuiTheme(ct.customTable());
    options = ct.customOptions();

    columnsGeneral = ["Period", "Plafond Type", "Plafond", "Taken", "Leftover", "Plan", "Expired Date"]
    dataGeneral = [["DATA DUMMY", "DATA DUMMY", "DATA DUMMY", "DATA DUMMY", "DATA DUMMY", "DATA DUMMY", "DATA DUMMY"], ["2020", "ANNUAL", "12", "0", "12", "0", "31/12/2020"]]

    render() {
        let { leaveData } = this.state
        return (
            <div className="vertical-tab-content active">
                <form action="#">
                    <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-20px">
                        <div className="column-1">
                            <Form label={'NIK'} field={'input'} style={{ backgroundColor: '#E6E6E6' }} readOnly={true} value={leaveData ? leaveData.employee.employeeID : ''} />
                            <Form label={'Employee Name'} field={'input'} style={{ backgroundColor: '#E6E6E6' }} readOnly={true} value={leaveData ? leaveData.employee.employeeName : ''} />
                        </div>
                        <div className="column-2">
                            <Form label={'Branch'} field={'input'} style={{ backgroundColor: '#E6E6E6' }} readOnly={true} value={leaveData && leaveData.employee.company ? leaveData.employee.company.esname : ''} />
                            <Form label={'Position'} field={'input'} style={{ backgroundColor: '#E6E6E6' }} readOnly={true} value={leaveData && leaveData.employee.position ? leaveData.employee.position.ouposition.bizparValue : ''} />
                        </div>
                    </div>
                    <div className="border-bottom padding-15px grid grid grid-mobile-none gap-20px">
                        <div className="padding-5px">
                            <MuiThemeProvider theme={this.getMuiTheme()}>
                                <MUIDataTable
                                    title={""}
                                    data={this.dataGeneral}
                                    columns={this.columnsGeneral}
                                    options={this.options}
                                />
                            </MuiThemeProvider>
                        </div>
                        <Form label={'Information'} field={'textarea'} style={{ backgroundColor: '#E6E6E6' }} readOnly={true} />
                    </div>
                    <div className="padding-15px">
                        <div className="grid grid-2x">
                            <div className="col-1" />
                            <div className="col-2 content-right">
                                <button
                                    style={{ marginLeft: "15px" }}
                                    className="btn btn-blue"
                                    type="button"
                                    onClick={this.props.onClickClose}
                                >
                                    <span>CLOSE</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default FormLeaveGeneral
