import React, { Component } from 'react'
import M from 'moment'
import DropDown from '../../../modules/popup/DropDown'

class FormMonitoringGeneral extends Component {
    constructor(props) {
        super(props)
        this.state = {
            monitoringData: props.monitoringData
        }
    }

    render() {
        let { monitoringData } = this.state
        let x = ""
        x = M(monitoringData.recruitmentRequestBy.employeeRegistrationDate, 'DD-MM-YYYY')
        x = x.fromNow().split(" ")[0] + (x.fromNow().split(" ")[1] === "months" ? " Months Ago" : x.fromNow().split(" ")[1] === "hours" ? " Hours Ago" : x.fromNow().split(" ")[1] === "days" ? " Days Ago" : " Years Ago");

        return (
            <div className="vertical-tab-content active">
                <form action="#">
                    <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-20px">
                        <div className="column-1">
                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>No Request</h4>
                                    </div>
                                </div>
                                <input
                                    value={monitoringData ? monitoringData.recruitmentRequestID : ""}
                                    type="text"
                                    readOnly
                                    style={{ backgroundColor: "#E6E6E6" }}
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                />
                            </div>

                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>Requestor</h4>
                                    </div>
                                </div>
                                <input
                                    value={monitoringData ? monitoringData.recruitmentRequestBy.employeeName : ""}
                                    type="text"
                                    readOnly
                                    style={{ backgroundColor: "#E6E6E6" }}
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                />
                            </div>

                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>Join Date</h4>
                                    </div>
                                </div>
                                <input
                                    value={monitoringData ? monitoringData.recruitmentRequestBy.employeeRegistrationDate : ""}
                                    readOnly
                                    style={{ backgroundColor: "#E6E6E6" }}
                                    type="text"
                                    className="txt txt-sekunder-color"
                                    required
                                />
                            </div>

                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>Year of Service</h4>
                                    </div>
                                </div>
                                <input
                                    value={monitoringData ? x : ""}
                                    type="text"
                                    readOnly
                                    style={{ backgroundColor: "#E6E6E6" }}
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                />
                            </div>

                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>Publish Date</h4>
                                    </div>
                                </div>
                                <input
                                    value={monitoringData ? monitoringData.recruitmentPublishStartDate + " - " + monitoringData.recruitmentPublishEndDate : ""}
                                    type="text"
                                    readOnly
                                    style={{ backgroundColor: "#E6E6E6" }}
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                />
                            </div>
                        </div>

                        <div className="column-2">
                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>Recruitment Type</h4>
                                    </div>
                                </div>
                                <DropDown title={monitoringData && monitoringData.recruitmentType ? monitoringData.recruitmentType.bizparValue : ""} disabled />
                            </div>

                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>Recruitment Category</h4>
                                    </div>
                                </div>
                                <DropDown title={monitoringData && monitoringData.recruitmentCategory ? monitoringData.recruitmentCategory.bizparValue : ""} disabled />
                            </div>

                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>Request Type</h4>
                                    </div>
                                </div>
                                <DropDown title={monitoringData && monitoringData.recruitmentRequestType ? monitoringData.recruitmentRequestType.bizparValue : ""} disabled />
                            </div>

                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>Employee Status</h4>
                                    </div>
                                </div>
                                <DropDown title={monitoringData && monitoringData.recruitmentEmployeeStatus ? monitoringData.recruitmentEmployeeStatus.bizparValue : ""} disabled />
                            </div>

                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>Employee Status Category</h4>
                                    </div>
                                </div>
                                <DropDown title={monitoringData && monitoringData.recruitmentEmployeeStatusCategoryType ? monitoringData.recruitmentEmployeeStatusCategoryType.bizparValue : ""} disabled />
                            </div>
                        </div>
                    </div>
                    <div className="padding-15px">
                        <div className="grid grid-2x">
                            <div className="col-1" />
                            <div className="col-2 content-right">
                                <button
                                    style={{ marginLeft: "15px" }}
                                    className="btn btn-primary"
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

export default FormMonitoringGeneral