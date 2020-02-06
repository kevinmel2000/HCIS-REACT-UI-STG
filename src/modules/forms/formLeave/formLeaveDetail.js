import React, { Component } from 'react'
import Form from '../../../components/pages/FieldForm'
import M from 'moment'


class FormLeaveDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            leaveData: props.leaveData
        }
    }

    render() {
        let { leaveData } = this.state
        let x = ""
        x = M(leaveData.employee.employeeRegistrationDate, 'DD-MM-YYYY')
        x = x.fromNow() 
        return (
            <div className="vertical-tab-content active">
                <form action="#">
                    <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-20px">
                        <div className="column-1">
                            <Form label={'Request Number'} field={'input'} style={{ backgroundColor: '#E6E6E6' }} readOnly={true} value={leaveData ? leaveData.leaveID : ''} />
                            <Form label={'Join Date'} field={'input'} style={{ backgroundColor: '#E6E6E6' }} readOnly={true} value={leaveData ? leaveData.employee.employeeRegistrationDate : ''} />
                            <Form label={'Years of Service'} field={'input'} style={{ backgroundColor: '#E6E6E6' }} readOnly={true} value={ leaveData ? x :'' } />
                            <Form label={'Leave Type'} field={'select'} style={{ backgroundColor: '#E6E6E6' }} disabled={true} placeholder={leaveData ? leaveData.leaveType.bizparValue : ''} />
                            <Form label={'Leave Category'} field={'select'} style={{ backgroundColor: '#E6E6E6' }} disabled={true} placeholder={leaveData ? leaveData.leaveCategory.bizparValue : ''} />
                            <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                    <span className="txt-site txt-11 txt-main txt-bold">
                                        Date
                                </span>
                                </div>
                                <input
                                    value={leaveData ? M(leaveData.leaveStartDate, "DD/MM/YYYY").format("YYYY-MM-DD") : ''}
                                    type="date"
                                    readOnly
                                    style={{ backgroundColor: '#E6E6E6', width: '35%', marginRight: 10 }}
                                    className="txt txt-sekunder-color"
                                    placeholder="" />
                                to
                              <input
                                    value={leaveData ? M(leaveData.leaveEndDate, "DD/MM/YYYY").format("YYYY-MM-DD") : ''}
                                    type="date"
                                    readOnly
                                    style={{ backgroundColor: "#E6E6E6", width: '35%', marginLeft: 10 }}
                                    className="txt txt-sekunder-color"
                                    placeholder="" />
                            </div>
                        </div>
                        <div className="column-2">
                            <Form label={'Number of Calendar (Day)'} field={'input'} style={{ backgroundColor: '#E6E6E6' }} readOnly={true} />
                            <Form label={'Number of Leave (Day)'} field={'input'} style={{ backgroundColor: '#E6E6E6' }} readOnly={true} />
                            <Form label={'Reason for Leave'} field={'textarea'} style={{ backgroundColor: '#E6E6E6', height: 95 }} readOnly={true} value={leaveData ? leaveData.leaveReason : ''} />
                            <Form label={'Address for Leave'} field={'input'} style={{ backgroundColor: '#E6E6E6' }} readOnly={true} value={leaveData ? leaveData.leaveAddress : ''} />
                        </div>
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

export default FormLeaveDetail

