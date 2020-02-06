import React, { Component } from 'react'
import { connect } from "react-redux"
import M from "moment"
import FormSearchEmp from "../formEmployee/formSearchEmployee"
import * as R from 'ramda'
import CalendarPicker from '../../../modules/popup/Calendar'
import { Rabbit as Button } from 'react-button-loaders'

import DropDown from '../../../modules/popup/DropDown'

const defaultPayloaMv = {
    "movementID": "",
    "movementSPKNumber": "",
    "movementSPKDate": "",
    "movementNotes": "",
    "movementEffectiveDate": "",
    "movementDocumentURL": "",
    "movementCategory": "",
    "movementType": "",
    "employeeID": "",
    "movementPosition": {
        "positionAfterEffectiveStartDate": "",
        "positionAfterEffectiveEndDate": "",
        "companyIDAfter": "",
        "companyIDBefore": "",
        "positionIDBefore": "",
        "positionIDAfter": ""
    },
    "movementPayroll": {
        "basicSalaryValue": "",
        "effectiveStartDate": "",
        "effectiveEndDate": ""
    },
    "movementStatus": "INITIATE",
    "requestBy": "",
    "createdBy": "",
    "createdDate": M().format("DD-MM-YYYY HH:mm:ss"),
    "updatedBy": "",
    "updatedDate": "",
    "recordID": "",
    "esid": ""
}

class FormMovementCreate extends Component {
    constructor(props) {
        super(props)
        let {
            movementData,
            type
        } = this.props;
        this.state = {
            movementData: movementData ? movementData : defaultPayloaMv,
            auth: props.auth,
            formGeneral: true,
            formGeneralVisible: false,
            formDetail: false,
            type,
            activeTab: "General",
            tabMenuCreate: ["General", "Detail"]
        }
    }

    openSearch() {
        this.setState({ formSearchEmpVisible: !this.state.formSearchEmpVisible });
    }

    addEmployeeHandler(value, rawDataEmployee) {
        let selectedEmployee = rawDataEmployee[value];
        this.setState({
            dataEmployeeName: selectedEmployee.employeeName,
            dataEmployeeKk: selectedEmployee.employeeID,
            dataEmployeeReg: selectedEmployee.employeeRegistrationDate,
            dataEmployeeContractExit: selectedEmployee.employeeExitDate,
            dataEmployeeType: selectedEmployee.employeeType && selectedEmployee.employeeType.bizparValue,
            record: selectedEmployee.recordID,
            dataEmployeeGrade: selectedEmployee.employeeGrade,
            formSearchEmpVisible: !this.state.formSearchEmpVisible
        });
    }

    opNavigator = title => {
        let cl = title === this.state.activeTab ? "c-n-link active" : "c-n-link";
        return (
            <li key={title} className={cl} onClick={this.opContent(title)}>
                {title}
            </li>
        );
    };

    opContent = title => e => {
        e.preventDefault();

        let allStateVisibleFalse = {
            ...this.state,
            formGeneral: false,
            formDetail: false,
            activeTab: title
        };

        switch (title) {
            case "General":
                allStateVisibleFalse = {
                    ...allStateVisibleFalse,
                    formGeneral: true
                };
                break;
            case "Detail":
                allStateVisibleFalse = {
                    ...allStateVisibleFalse,
                    formDetail: true
                };
                break;
            default:
                break;
        }
        this.setState(allStateVisibleFalse);
    };

    renderForm = () => {
        console.log(this.state.dataEmployeeReg)
        let { movementData, auth, dataEmployeeReg } = this.state;
        let x = "";
        x = M(dataEmployeeReg, "DD-MM-YYYY");
        x = x.fromNow().split(" ")[0] + (x.fromNow().split(" ")[1] === "months" ? " Months Ago" : x.fromNow().split(" ")[1] === "hours" ? " Hours Ago" : x.fromNow().split(" ")[1] === "days" ? " Days Ago" : " Years Ago");
        return (
            <div className="popup-content-grid">
                <div className="popup-scroll popup-col-1">
                    <ul className="vertical-tab">
                        {this.state.tabMenuCreate.map((data, index) => {
                            return this.opNavigator(data, index);
                        })}
                    </ul>
                </div>
                <div className="popup-col-2">
                    {/* Movement General*/}
                    {this.state.formGeneral && (
                        <div className="vertical-tab-content active">
                            <form action="#">
                                <div className="padding-15px grid grid-2x grid-mobile-none gap-15px">
                                    <div className="column-1">
                                        <div className="margin-bottom-20px">REQUESTOR</div>
                                        <div className="margin-bottom-20px">
                                            <div className="margin-5px">
                                                <div className="txt-site txt-11 txt-main txt-bold">
                                                    <h4>NIK</h4>
                                                </div>
                                            </div>
                                            <input
                                                value={auth.user.employeeID}
                                                type="text"
                                                readOnly
                                                style={{ backgroundColor: "#E6E6E6" }}
                                                className="txt txt-sekunder-color"
                                                placeholder="NIK"
                                                required
                                            />
                                        </div>
                                        <div className="margin-bottom-20px">
                                            <div className="margin-5px">
                                                <div className="txt-site txt-11 txt-main txt-bold">
                                                    <h4>Employee Name</h4>
                                                </div>
                                            </div>
                                            <input
                                                value={auth.user.employeeName}
                                                type="text"
                                                readOnly
                                                style={{ backgroundColor: "#E6E6E6" }}
                                                className="txt txt-sekunder-color"
                                                placeholder="Employee Name"
                                                required
                                            />
                                            &nbsp;
                                            <div className="margin-bottom-20px"></div>
                                            <div className="margin-bottom-20px">HEADER</div>
                                            <div className="margin-bottom-20px">
                                                <div className="margin-5px">
                                                    <div className="txt-site txt-11 txt-main txt-bold">
                                                        <h4>Request Number</h4>
                                                    </div>
                                                </div>
                                                <input
                                                    value={movementData.movementID}
                                                    type="text"
                                                    readOnly
                                                    style={{ backgroundColor: "#E6E6E6" }}
                                                    className="txt txt-sekunder-color"
                                                    placeholder="Request Number"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <div>
                                                    <div className="txt-site txt-11 txt-main txt-bold margin-5px">
                                                        <h4>Movement Type <span style={{ color: "red" }}>*</span></h4>
                                                    </div>
                                                    <DropDown
                                                        title="-- please select movement type --"
                                                        onChange={(dt) => this.setState({
                                                            movementData: {
                                                                ...this.state.movementData,
                                                                movementType: {
                                                                    ...this.state.movementData.movementType,
                                                                    bizparKey: dt
                                                                }
                                                            }
                                                        })}
                                                        type="bizpar"
                                                        disabled={this.props.type !== "create" ? true : false}
                                                        data={this.props.bizparMovementType}
                                                        value={movementData.movementType && movementData.movementType.bizparKey} />
                                                    {/*<select
                                                            className="cf-select slc slc-sekunder"
                                                            onChange={(e) => this.setState({
                                                                movementData: {
                                                                    ...this.state.movementData,
                                                                    movementType: {
                                                                        ...this.state.movementData.movementType,
                                                                        bizparKey: e.target.value
                                                                    }
                                                                }
                                                            })}
                                                        >
                                                            <option value="">-- please movement type --</option>
                                                            {this.props.bizparMovementType.map((data, index) => {
                                                                return (
                                                                    <option key={index} value={data.bizparKey}>
                                                                        {data.bizparValue}
                                                                    </option>
                                                                );
                                                            })}
                                                        </select>*/}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="column-2">
                                        &nbsp;
                                    <div className="margin-bottom-20px"></div>
                                        <div className="margin-bottom-20px">
                                            <div className="margin-5px">
                                                <div className="txt-site txt-11 txt-main txt-bold">
                                                    <h4>Division</h4>
                                                </div>
                                            </div>
                                            <input
                                                type="text"
                                                readOnly
                                                style={{ backgroundColor: "#E6E6E6" }}
                                                className="txt txt-sekunder-color"
                                                placeholder="Division"
                                                required
                                                value={auth.user.positionID}
                                            />
                                        </div>
                                        <div className="margin-bottom-20px">
                                            <div className="margin-5px">
                                                <div className="txt-site txt-11 txt-main txt-bold">
                                                    <h4>Position</h4>
                                                </div>
                                            </div>
                                            <input
                                                value={auth.user.positionName}
                                                type="text"
                                                readOnly
                                                style={{ backgroundColor: "#E6E6E6" }}
                                                className="txt txt-sekunder-color"
                                                placeholder="Position"
                                                required
                                            />
                                        </div>
                                        <div className="margin-bottom-20px">
                                            &nbsp;
                                            <div className="margin-bottom-20px" style={{ marginBottom: "40px" }}></div>
                                            <div className="margin-bottom-20px">
                                                <div className="txt-site txt-11 txt-main txt-bold margin-5px">
                                                    <h4>Movement Category <span style={{ color: "red" }}>*</span></h4>
                                                </div>
                                                <DropDown
                                                    title="-- please select movement category --"
                                                    onChange={(dt) => this.setState({
                                                        movementData: {
                                                            ...this.state.movementData,
                                                            movementCategory: {
                                                                ...this.state.movementData.movementCategory,
                                                                bizparKey: dt
                                                            }
                                                        }
                                                    })}
                                                    type="bizpar"
                                                    disabled={this.props.type !== "create" ? true : false}
                                                    data={this.props.bizparMovementCategory}
                                                    value={movementData.movementCategory && movementData.movementCategory.bizparKey} />
                                                {/*<select
                                                    className="cf-select slc slc-sekunder"
                                                    onChange={(e) => this.setState({
                                                        movementData: {
                                                            ...this.state.movementData,
                                                            movementCategory: {
                                                                ...this.state.movementData.movementCategory,
                                                                bizparKey: e.target.value
                                                            }
                                                        }
                                                    })}
                                                >
                                                    <option value="">-- please movement category --</option>
                                                    {this.props.bizparMovementCategory.map((data, index) => {
                                                        return (
                                                            <option key={index} value={data.bizparKey}>
                                                                {data.bizparValue}
                                                            </option>
                                                        );
                                                    })}
                                                </select>*/}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}
                    {/* Movement Detail*/}
                    {this.state.formDetail && (
                        <div className="vertical-tab-content active">
                            {this.state.formSearchEmpVisible && (
                                <FormSearchEmp
                                    onClickClose={this.openSearch.bind(this)}
                                    onClickEmp={this.addEmployeeHandler.bind(this)}
                                />
                            )}
                            <form action="#">
                                <div className="padding-15px grid grid-2x grid-mobile-none gap-15px">
                                    <div className="column-1">
                                        <div className="card-date-picker margin-bottom-15px">
                                            <div className="margin-5px">
                                                <div className="txt-site txt-11 txt-main txt-bold">
                                                    <h4>Employee Name <span style={{ color: "red" }}>*</span></h4>
                                                </div>
                                            </div>
                                            <div className='double'>
                                                <input
                                                    value={this.state.dataEmployeeName}
                                                    type="text"
                                                    readOnly
                                                    style={{ backgroundColor: "#E6E6E6", padding: 15 }}
                                                    className="input"
                                                    placeholder="Employee Name"
                                                    required
                                                />
                                                <button
                                                    className="btn btn-grey border-left btn-no-radius"
                                                    type="button"
                                                    onClick={() => this.openSearch()}
                                                >
                                                    <i className="fas fa-search" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="margin-bottom-20px">
                                            <div className="margin-5px">
                                                <div className="txt-site txt-11 txt-main txt-bold">
                                                    <h4>NIK</h4>
                                                </div>
                                            </div>
                                            <input
                                                value={this.state.dataEmployeeKk}
                                                type="text"
                                                readOnly
                                                style={{ backgroundColor: "#E6E6E6" }}
                                                className="txt txt-sekunder-color"
                                                placeholder="NIK"
                                                required
                                            />
                                        </div>
                                        <div className="margin-bottom-20px">
                                            <div className="margin-5px">
                                                <div className="txt-site txt-11 txt-main txt-bold">
                                                    <h4>Join Date</h4>
                                                </div>
                                            </div>
                                            <CalendarPicker
                                                date={this.state.dataEmployeeReg && M(this.state.dataEmployeeReg, "DD-MM-YYYY").format(
                                                    "YYYY-MM-DD"
                                                )}
                                                disabled
                                                onChange />
                                            {/* <input
                                                value={M(this.state.dataEmployeeReg, "DD/MM/YYYY").format(
                                                    "YYYY-MM-DD"
                                                )}
                                                type="date"
                                                disabled
                                                style={{ backgroundColor: "#E6E6E6" }}
                                                className="txt txt-sekunder-color"
                                                placeholder=""
                                                required
                                            /> */}
                                        </div>
                                        <div className="margin-bottom-20px">
                                            <div className="margin-5px">
                                                <div className="txt-site txt-11 txt-main txt-bold">
                                                    <h4>Years of service</h4>
                                                </div>
                                            </div>
                                            <input
                                                value={dataEmployeeReg ? x : ""}
                                                type="text"
                                                disabled
                                                style={{ backgroundColor: "#E6E6E6" }}
                                                className="txt txt-sekunder-color"
                                                placeholder="Years of service"
                                                required
                                            />
                                        </div>
                                        <div className="margin-bottom-20px">
                                            <div className="margin-5px">
                                                <div className="txt-site txt-11 txt-main txt-bold">
                                                    <h4>Employee Type</h4>
                                                </div>
                                            </div>
                                            <input
                                                value={this.state.dataEmployeeType}
                                                type="text"
                                                disabled
                                                style={{ backgroundColor: "#E6E6E6" }}
                                                className="txt txt-sekunder-color"
                                                placeholder="Employee Type"
                                            />
                                        </div>

                                        <div className="margin-bottom-20px">
                                            <div className="margin-5px">
                                                <div className="txt-site txt-11 txt-main txt-bold">
                                                    <h4>Employee Contract Date</h4>
                                                </div>
                                            </div>
                                            <div className="display-flex-normal width width-full">
                                                <div>
                                                    {/* <input
                                                        value={M(this.state.dataEmployeeReg, "DD-MM-YYYY").format(
                                                            "YYYY-MM-DD"
                                                        )}
                                                        readOnly
                                                        style={{ backgroundColor: "#E6E6E6" }}
                                                        type="date"
                                                        className="txt txt-sekunder-color"
                                                        placeholder=""
                                                        required
                                                    /> */}
                                                    <CalendarPicker
                                                        date={this.state.dataEmployeeReg && M(this.state.dataEmployeeReg, "DD-MM-YYYY").format(
                                                            "YYYY-MM-DD"
                                                        )}
                                                        disabled
                                                        onChange
                                                    />
                                                </div>
                                                <div className="txt-site txt-11 txt-primary txt-center margin-10px margin-left-10px margin-right-10px">
                                                    <p align="center" className="padding-5px">
                                                        To
                                                    </p>
                                                </div>
                                                <div>
                                                    <CalendarPicker
                                                        date={this.state.dataEmployeeContractExit && M(this.state.dataEmployeeContractExit, "DD-MM-YYYY").format(
                                                            "YYYY-MM-DD"
                                                        )}
                                                        disabled
                                                        onChange
                                                    />
                                                    {/* <input
                                                        value={M(
                                                            this.state.dataEmployeeContractExit,
                                                            "DD-MM-YYYY"
                                                        ).format("YYYY-MM-DD")}
                                                        readOnly
                                                        style={{ backgroundColor: "#E6E6E6" }}
                                                        type="date"
                                                        className="txt txt-sekunder-color"
                                                        placeholder=""
                                                        required
                                                    /> */}

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="column-2">
                                        <div className="margin-bottom-20px">
                                            <div className="margin-5px">
                                                <div className="txt-site txt-11 txt-main txt-bold">
                                                    <h4>Grade Before</h4>
                                                </div>
                                            </div>
                                                <input
                                                    value={this.state.dataEmployeeGrade}
                                                    type="text"
                                                    disabled
                                                    style={{ backgroundColor: "#E6E6E6" }}
                                                    className="txt txt-sekunder-color"
                                                    placeholder="Grade Before"
                                                />
                                        </div>
                                        <div className="margin-bottom-20px">
                                            <div className="margin-5px">
                                                <div className="txt-site txt-11 txt-main txt-bold">
                                                    <h4>SPK Number <span style={{ color: "red" }}>*</span></h4>
                                                </div>
                                            </div>
                                            <input
                                                type="text"
                                                className="txt txt-sekunder-color"
                                                placeholder="SPK Number"
                                                required
                                                onChange={(e) => this.setState({
                                                    movementData: {
                                                        ...this.state.movementData,
                                                        movementSPKNumber: e.target.value
                                                    }
                                                })}
                                            />
                                        </div>
                                        <div className="margin-bottom-20px">
                                            <div className="margin-5px">
                                                <div className="txt-site txt-11 txt-main txt-bold">
                                                    <h4>SPK Date <span style={{ color: "red" }}>*</span></h4>
                                                </div>
                                            </div>
                                            <CalendarPicker
                                                // date={this.state.movementData.movementSPKDate && M(this.state.movementData.movementSPKDate, "DD-MM-YYYY").format(
                                                //     "YYYY-MM-DD"
                                                // )}
                                                onChange={(e) => this.setState({
                                                    movementData: {
                                                        ...this.state.movementData,
                                                        movementSPKDate: M(e).format("YYYY-MM-DD")
                                                    }
                                                })}
                                            />
                                            {/* <input
                                                type="date"
                                                className="txt txt-sekunder-color"
                                                placeholder=""
                                                required
                                                onChange={(e) => this.setState({
                                                    movementData: {
                                                        ...this.state.movementData,
                                                        movementSPKDate: e.target.value
                                                    }
                                                })}
                                            /> */}
                                        </div>
                                        <div className="margin-bottom-20px">
                                            <div className="margin-5px">
                                                <div className="txt-site txt-11 txt-main txt-bold">
                                                    <h4>Information <span style={{ color: "red" }}>*</span></h4>
                                                </div>
                                            </div>
                                            <textarea
                                                rows={5}
                                                type="text"
                                                className="txt txt-sekunder-color"
                                                placeholder=""
                                                required
                                                onChange={(e) => this.setState({
                                                    movementData: {
                                                        ...this.state.movementData,
                                                        movementNotes: e.target.value
                                                    }
                                                })}
                                            />
                                        </div>
                                        <div className="margin-bottom-20px">
                                            <div className="margin-5px">
                                                <div className="txt-site txt-11 txt-main txt-bold">
                                                    <h4>Effective Date <span style={{ color: "red" }}>*</span></h4>
                                                </div>
                                            </div>
                                            <CalendarPicker
                                                // date={this.state.movementData.movementEffectiveDate
                                                // )}
                                                onChange={(e) => this.setState({
                                                    movementData: {
                                                        ...this.state.movementData,
                                                        movementEffectiveDate: M(e).format("YYYY-MM-DD")
                                                    }
                                                })}
                                            />
                                            {/* <input
                                                type="date"
                                                className="txt txt-sekunder-color"
                                                placeholder=""
                                                required
                                                onChange={(e) => this.setState({
                                                    movementData: {
                                                        ...this.state.movementData,
                                                        movementEffectiveDate: e.target.value
                                                    }
                                                })}
                                            /> */}
                                        </div>
                                        <div className="margin-bottom-20px">
                                            <div className="margin-5px">
                                                <div className="txt-site txt-11 txt-main txt-bold">
                                                    <h4>Active Status <span style={{ color: "red" }}>*</span></h4>
                                                </div>
                                            </div>
                                            <div className="margin-15px">
                                                <label className="radio">
                                                    <input type="checkbox" checked disabled />
                                                    <span className="checkmark" />
                                                    <div className="txt-site txt-11 txt-bold txt-main">
                                                        <h4>Active</h4>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    renderFooter = () => {
        return (
            <div className="padding-15px">
                <div className="grid grid-2x">
                    <div className="col-1" />
                    <div className="col-2 content-right">
                    <Button
                        state={this.props.sendState}
                        style={{ position: 'absolute', padding: '0 14px', height: 40, borderRadius: 3, fontSize: 10, textAlign: 'center', width: 90, marginLeft: '355px'}}
                        className="btn btn-blue"
                        type="submit"
                    >
                        <span>SAVE</span>
                    </Button>
                        {/* <button
                            style={{ marginLeft: "15px" }}
                            className="btn btn-blue"
                            type="submit"
                        onClick={() => {
                        let payload = this.state.movementData;
                        payload = {
                            ...payload,
                            movementID: payload.movementID === "" ? "MV-" + M() : payload.movementID,
                            movementSPKDate: !R.isEmpty(payload.movementSPKDate) ? M(payload.movementSPKDate, 'YYYY-MM-DD').format('DD-MM-YYYY') : "",
                            movementEffectiveDate: !R.isEmpty(payload.movementSPKDate) ? M(payload.movementEffectiveDate, 'YYYY-MM-DD').format('DD-MM-YYYY') : "",
                            movementCategory: payload.movementCategory.bizparKey,
                            movementType: payload.movementType.bizparKey,
                            employeeID: this.state.dataEmployeeKk !== undefined ? this.state.dataEmployeeKk : "",
                            requestBy: this.state.auth.user.employeeID,
                            esid: this.state.auth.user.companyID
                        };
                        this.props.onSave(payload)
                        }}
                        >
                            <span>SAVE</span>
                        </button> */}
                        <button
                            style={{ marginLeft: "15px" }}
                            onClick={this.props.onClickClose}
                            className="btn btn-primary"
                            type="button"
                        >
                            <span>CLOSE</span>
                        </button>
                    </div>
                </div>
            </div >
        )
    }

    render() {
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px" />
                <div className="popup-content background-white border-radius">
                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="popup-title">
                                Movement - Create Form
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button
                                className="btn btn-circle btn-grey"
                                onClick={this.props.onClickClose}
                            >
                                <i className="fa fa-lg fa-times" />
                            </button>
                        </div>
                    </div>
                    <form action='#' onSubmit={(e) => {
                        e.preventDefault()
                        let payload = this.state.movementData;
                        payload = {
                            ...payload,
                            movementID: payload.movementID === "" ? "MV-" + M() : payload.movementID,
                            movementSPKDate: !R.isEmpty(payload.movementSPKDate) ? M(payload.movementSPKDate, 'YYYY-MM-DD').format('DD-MM-YYYY') : "",
                            movementEffectiveDate: !R.isEmpty(payload.movementEffectiveDate) ? M(payload.movementEffectiveDate, 'YYYY-MM-DD').format('DD-MM-YYYY') : "",
                            movementCategory: payload.movementCategory.bizparKey,
                            movementType: payload.movementType.bizparKey,
                            employeeID: this.state.dataEmployeeKk !== undefined ? this.state.dataEmployeeKk : "",
                            requestBy: this.state.auth.user.employeeID,
                            esid: this.state.auth.user.companyID,
                            createdBy:this.props.auth.user.employeeID,
                            updatedBy: this.props.auth.user.employeeID,
                        };
                        if (R.isEmpty(payload.movementSPKDate) || R.isNil(R.isEmpty(payload.movementSPKDate))) return alert('SPK Date is Required.')
                        if (R.isEmpty(payload.movementEffectiveDate) || R.isNil(R.isEmpty(payload.movementEffectiveDate))) return alert('Effective Date is Required.')
                        if (R.isEmpty(payload.employeeID)) {
                            return alert('Employee Name is Required.')
                        }
                        if (R.isEmpty(payload.movementType) || R.isNil(payload.movementType)) {
                            return alert('Movement Type is Required.')
                        }
                        if (R.isEmpty(payload.movementCategory) || R.isNil(payload.movementCategory)) {
                            return alert('Movement Category is Required.')
                        }
                        if (R.isEmpty(payload.movementSPKDate) || R.isNil(payload.movementSPKDate)) {
                            return alert('SPK Date is Required.')
                        }
                        if (R.isEmpty(payload.movementEffectiveDate) || R.isNil(payload.movementEffectiveDate)) {
                            return alert('Effective Date is Required.')
                        }
                        if (R.isEmpty(payload.movementSPKNumber) || R.isNil(payload.movementSPKNumber)) {
                            return alert('SPK Number is Required.')
                        }
                        if (R.isEmpty(payload.movementNotes) || R.isNil(payload.movementNotes)) {
                            return alert('Information is Required.')
                        }
                        else
                            this.props.onSave(payload)
                    }}
                    >
                        {this.renderForm()}
                        {this.renderFooter()}
                    </form>
                </div>
                <div className="padding-bottom-20px"></div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    };
};

export default connect(mapStateToProps)(FormMovementCreate)