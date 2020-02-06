import React, { Component } from "react";
import M from 'moment'
import FormSearchEmp from '../formEmployee/formSearchEmployee'
import * as R from "ramda";
import CalendarPicker from '../../../modules/popup/Calendar'
import { connect } from 'react-redux';
import { Rabbit as Button } from 'react-button-loaders'

class formEmployeeTerminationDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {
                ...this.props.rawData,
                terminationSPKDate: M(this.props.rawData.terminationSPKDate, "DD-MM-YYYY").format("YYYY-MM-DD"),
                terminationDocumentDate: M(this.props.rawData.terminationDocumentDate, "DD-MM-YYYY").format("YYYY-MM-DD"),
                terminationRequestDate: M(this.props.rawData.terminationRequestDate, "DD-MM-YYYY").format("YYYY-MM-DD"),
                terminationPPHEndDate: M(this.props.rawData.terminationPPHEndDate, "DD-MM-YYYY").format("YYYY-MM-DD"),
                terminationEffectiveDate: M(this.props.rawData.terminationEffectiveDate, "DD-MM-YYYY").format("YYYY-MM-DD")
            },
            formSearchEmpVisible: false,
            dataEmployee: '',
            auth: props.auth
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.rawData !== prevProps.rawData) {
            let { rawData } = this.props
            this.setState({
                data: {
                    ...rawData,
                    terminationSPKDate: M(rawData.terminationSPKDate, "DD-MM-YYYY").format("YYYY-MM-DD"),
                    terminationDocumentDate: M(rawData.terminationDocumentDate, "DD-MM-YYYY").format("YYYY-MM-DD"),
                    terminationRequestDate: M(rawData.terminationRequestDate, "DD-MM-YYYY").format("YYYY-MM-DD"),
                    terminationPPHEndDate: M(rawData.terminationPPHEndDate, "DD-MM-YYYY").format("YYYY-MM-DD"),
                    terminationEffectiveDate: M(rawData.terminationEffectiveDate, "DD-MM-YYYY").format("YYYY-MM-DD")
                },
                dataEmployeeName: rawData.employee ? rawData.employee.employeeName : "",
                dataEmployeeKk: rawData.employee ? rawData.employee.employeeID : "",
                dataEmployeeReg: rawData.employee ? rawData.employee.employeeRegistrationDate : "",
                dataEmployeeContractExit: rawData.employee ? rawData.employee.employeeExitDate : "",
                dataEmployeeType: rawData.employee && rawData.employee.employeeType ? rawData.employee.employeeType.bizparValue : "",
                dataEmployeeGrade: rawData.employee ? rawData.employee.employeeGrade : "",

            })
        }
    }

    componentDidMount() {
        let { rawData } = this.props
        this.setState({
            dataEmployeeName: rawData.employee ? rawData.employee.employeeName : "",
            dataEmployeeKk: rawData.employee ? rawData.employee.employeeID : "",
            dataEmployeeReg: rawData.employee ? rawData.employee.employeeRegistrationDate : "",
            dataEmployeeContractExit: rawData.employee ? rawData.employee.employeeExitDate : "",
            dataEmployeeType: rawData.employee && rawData.employee.employeeType ? rawData.employee.employeeType.bizparValue : "",
            dataEmployeeGrade: rawData.employee ? rawData.employee.employeeGrade : "",
        })
    }

    addEmployeeHandler(value, rawDataEmployee) {
        let selectedEmployee = rawDataEmployee[value];
        this.setState({
            dataEmployeeName: selectedEmployee.employeeName,
            dataEmployeeKk: selectedEmployee.employeeID,
            dataEmployeeReg: selectedEmployee.employeeRegistrationDate,
            dataEmployeeContractExit: selectedEmployee.employeeExitDate,
            dataEmployeeType: selectedEmployee.employeeType.bizparValue,
            record: selectedEmployee.recordID,
            dataEmployeeGrade: selectedEmployee.employeeGrade,
            formSearchEmpVisible: !this.state.formSearchEmpVisible
        });
    }

    openSearch() {
        this.setState({ formSearchEmpVisible: !this.state.formSearchEmpVisible })
    }
    render() {
        let data = this.state.data
        let { dataEmployeeReg } = this.state;
        let x = "";
        x = M(dataEmployeeReg, "DD-MM-YYYY");
        x = x.fromNow();
        return (
            <div className='vertical-tab-content active'>
                {this.state.formSearchEmpVisible && (
                    <FormSearchEmp
                        onClickClose={this.openSearch.bind(this)}
                        onClickEmp={this.addEmployeeHandler.bind(this)}
                    />
                )}
                <form action="#">
                    <div className={this.props.type !== 'create' ? "border-bottom padding-15px grid grid-mobile-none gap-15px" : "border-bottom padding-15px grid grid-2x grid-mobile-none gap-15px"}>
                        <div className="column-1">
                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>NIK </h4>
                                    </div>
                                </div>
                                <input
                                    readOnly
                                    style={{ backgroundColor: this.props.type !== 'create' ? "#E6E6E6" : null }}
                                    type="text"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                    value={this.state.dataEmployeeKk}
                                />
                            </div>

                            <div className="card-date-picker margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>Employee Name <span style={{ color: "red" }}>*</span></h4>
                                    </div>
                                </div>
                                <div className='double'>
                                    <input
                                        readOnly
                                        style={
                                            { backgroundColor: "#E6E6E6", padding: 15 }
                                        }
                                        type="text"
                                        className="input"
                                        placeholder=""
                                        required
                                        value={this.state.dataEmployeeName}
                                    />
                                    <button
                                        className="btn btn-grey border-left btn-no-radius"
                                        type="button"
                                        onClick={this.props.type !== "view" ? () => this.openSearch() : null}
                                    >
                                        <i class="fas fa-search" />
                                    </button>
                                </div>
                            </div>

                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>Join Date </h4>
                                    </div>
                                </div>
                                <CalendarPicker
                                    date={this.state.dataEmployeeReg && M(this.state.dataEmployeeReg, "DD-MM-YYYY").format(
                                        "YYYY-MM-DD"
                                    )}
                                    disabled
                                    onChange />
                                {/* <input
                                    readOnly
                                    style={
                                        this.props.type !== "create"
                                            ? { backgroundColor: "#E6E6E6" }
                                            : null
                                    }
                                    type="date"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                    value={M(this.state.dataEmployeeReg, "DD/MM/YYYY").format(
                                        "YYYY-MM-DD"
                                    )}
                                /> */}
                            </div>

                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>Years of service </h4>
                                    </div>
                                </div>
                                <input
                                    readOnly
                                    style={
                                        this.props.type !== "create"
                                            ? { backgroundColor: "#E6E6E6" }
                                            : null
                                    }
                                    type="text"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                    value={dataEmployeeReg ? x : ""}
                                />
                            </div>

                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>Employee Type</h4>
                                    </div>
                                </div>
                                <input
                                    readOnly
                                    style={
                                        this.props.type !== "create"
                                            ? { backgroundColor: "#E6E6E6" }
                                            : null
                                    }
                                    type="text"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                    value={this.state.dataEmployeeType}
                                />
                                {/*<select
                                    className="cf-select slc slc-sekunder"
                                    disabled={this.props.type !== "create" ? true : false}
                                    style={
                                        this.props.type !== "create"
                                            ? { backgroundColor: "#E6E6E6" }
                                            : null
                                    }
                                >
                                    <option value="">{this.state.dataEmployeeType}</option>
                                </select>*/}
                            </div>

                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>Employee Contract Date </h4>
                                    </div>
                                </div>
                                <div className="display-flex-normal width width-full">
                                    <div>
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
                                    </div>
                                </div>
                            </div>

                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>SPK Number <span style={{ color: "red" }}>*</span></h4>
                                    </div>
                                </div>
                                <input
                                    readOnly={this.props.type === "view" ? true : false}
                                    style={
                                        this.props.type === "view"
                                            ? { backgroundColor: "#E6E6E6" }
                                            : null
                                    }
                                    type="text"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                    value={data.terminationSPKNumber}
                                    onChange={e => this.setState({ data: { ...this.state.data, terminationSPKNumber: e.target.value } })}
                                />
                            </div>

                        </div>

                        <div className="column-2">
                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>Letter Number <span style={{ color: "red" }}>*</span></h4>
                                    </div>
                                </div>
                                <input
                                    readOnly={this.props.type === "view" ? true : false}
                                    style={
                                        this.props.type === "view"
                                            ? { backgroundColor: "#E6E6E6" }
                                            : null
                                    }
                                    type="text"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                    value={data.terminationDocumentNumber}
                                    onChange={e => this.setState({ data: { ...this.state.data, terminationDocumentNumber: e.target.value } })}
                                />
                            </div>

                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>SPK Date <span style={{ color: "red" }}>*</span></h4>
                                    </div>
                                </div>
                                <CalendarPicker
                                    date={this.state.data.terminationSPKDate}
                                    disabled={this.props.type === "view" ? true : false}
                                    onChange={(e) => this.setState({
                                        data: {
                                            ...this.state.data,
                                            terminationSPKDate: M(e).format("YYYY-MM-DD")
                                        }
                                    })}
                                />
                                {/* <input
                                    readOnly={this.props.type === "view" ? true : false}
                                    style={
                                        this.props.type === "view"
                                            ? { backgroundColor: "#E6E6E6" }
                                            : null
                                    }
                                    type="date"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                    value={data.terminationSPKDate}
                                    onChange={e => this.setState({ data: { ...this.state.data, terminationSPKDate: e.target.value } })}
                                /> */}
                            </div>

                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>Letter Date <span style={{ color: "red" }}>*</span></h4>
                                    </div>
                                </div>
                                <CalendarPicker
                                    date={this.state.data.terminationDocumentDate}
                                    disabled={this.props.type === "view" ? true : false}
                                    onChange={(e) => this.setState({
                                        data: {
                                            ...this.state.data,
                                            terminationDocumentDate: M(e).format("YYYY-MM-DD")
                                        }
                                    })}
                                />
                                {/* <input
                                    readOnly={this.props.type === "view" ? true : false}
                                    style={
                                        this.props.type === "view"
                                            ? { backgroundColor: "#E6E6E6" }
                                            : null
                                    }
                                    type="date"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                    value={data.terminationDocumentDate}
                                    onChange={e => this.setState({ data: { ...this.state.data, terminationDocumentDate: e.target.value } })}
                                /> */}
                            </div>

                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>Request Date <span style={{ color: "red" }}>*</span></h4>
                                    </div>
                                </div>
                                <CalendarPicker
                                    date={this.state.data.terminationRequestDate}
                                    disabled={this.props.type === "view" ? true : false}
                                    onChange={(e) => this.setState({
                                        data: {
                                            ...this.state.data,
                                            terminationRequestDate: M(e).format("YYYY-MM-DD")
                                        }
                                    })}
                                />
                                {/* <input
                                    readOnly={this.props.type === "view" ? true : false}
                                    style={
                                        this.props.type === "view"
                                            ? { backgroundColor: "#E6E6E6" }
                                            : null
                                    }
                                    type="date"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                    value={data.terminationRequestDate}
                                    onChange={e => this.setState({ data: { ...this.state.data, terminationRequestDate: e.target.value } })}
                                /> */}
                            </div>

                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>Out Date <span style={{ color: "red" }}>*</span></h4>
                                    </div>
                                </div>
                                <CalendarPicker
                                    date={this.state.data.terminationEffectiveDate}
                                    disabled={this.props.type === "view" ? true : false}
                                    onChange={(e) => this.setState({
                                        data: {
                                            ...this.state.data,
                                            terminationEffectiveDate: M(e).format("YYYY-MM-DD")
                                        }
                                    })}
                                />
                                {/* <input
                                    readOnly={this.props.type === "view" ? true : false}
                                    style={
                                        this.props.type === "view"
                                            ? { backgroundColor: "#E6E6E6" }
                                            : null
                                    }
                                    type="date"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                    value={data.terminationEffectiveDate}
                                    onChange={e => this.setState({ data: { ...this.state.data, terminationEffectiveDate: e.target.value } })}
                                /> */}
                            </div>

                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>PPH End Date <span style={{ color: "red" }}>*</span></h4>
                                    </div>
                                </div>
                                <CalendarPicker
                                    date={this.state.data.terminationPPHEndDate}
                                    disabled={this.props.type === "view" ? true : false}
                                    onChange={(e) => this.setState({
                                        data: {
                                            ...this.state.data,
                                            terminationPPHEndDate: M(e).format("YYYY-MM-DD")
                                        }
                                    })}
                                />
                                {/* <input
                                    readOnly={this.props.type === "view" ? true : false}
                                    style={
                                        this.props.type === "view"
                                            ? { backgroundColor: "#E6E6E6" }
                                            : null
                                    }
                                    type="date"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                    value={data.terminationPPHEndDate}
                                    onChange={e => this.setState({ data: { ...this.state.data, terminationPPHEndDate: e.target.value } })}
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
                                    readOnly={this.props.type === "view" ? true : false}
                                    style={
                                        this.props.type === "view"
                                            ? { backgroundColor: "#E6E6E6" }
                                            : null
                                    }
                                    type="text"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                    value={data.terminationNotes}
                                    onChange={e => this.setState({ data: { ...this.state.data, terminationNotes: e.target.value } })}
                                />
                            </div>

                        </div>

                    </div>

                    <div className="padding-15px">
                        <div className="grid">
                            {/* <div className="col-1" /> */}
                            <div className="col-2 content-right">
                                {this.props.type !== "view" ? (
                                    <Button
                                        type='button'
                                        state={this.props.sendState}
                                        style={{ position: 'absolute', padding: '0 14px', height: 40, borderRadius: 3, fontSize: 10, textAlign: 'center', width: 70 }}
                                        className="btn btn-blue"
                                        onClick={() => {
                                            let payload = this.state.data;
                                            payload = {
                                                terminationID: payload.terminationID,
                                                terminationDocumentNumber: payload.terminationDocumentNumber,
                                                terminationSPKNumber: !R.isNil(payload.terminationSPKNumber) ? payload.terminationSPKNumber : "",
                                                terminationSPKDate: payload.terminationSPKDate !== "Invalid date" ? M(payload.terminationSPKDate, 'YYYY-MM-DD').format('DD-MM-YYYY') : "",
                                                terminationDocumentDate: payload.terminationDocumentDate !== "Invalid date" ? M(payload.terminationDocumentDate, 'YYYY-MM-DD').format('DD-MM-YYYY') : "",
                                                terminationRequestDate: payload.terminationRequestDate !== "Invalid date" ? M(payload.terminationRequestDate, 'YYYY-MM-DD').format('DD-MM-YYYY') : "",
                                                terminationEffectiveDate: payload.terminationEffectiveDate !== "Invalid date" ? M(payload.terminationEffectiveDate, 'YYYY-MM-DD').format('DD-MM-YYYY') : "",
                                                terminationPPHEndDate: payload.terminationPPHEndDate !== "Invalid date" ? M(payload.terminationPPHEndDate, 'YYYY-MM-DD').format('DD-MM-YYYY') : "",
                                                terminationNotes: payload.terminationNotes,
                                                terminationDocumentURL: payload.terminationDocumentURL,
                                                terminationStatus: payload.terminationStatus,
                                                employeeID: !R.isNil(this.state.dataEmployeeKk) ? this.state.dataEmployeeKk : "",
                                                requestBy: payload.requestBy.employeeID,
                                                terminationType: payload.terminationType.bizparKey,
                                                terminationCategory: payload.terminationCategory.bizparKey,
                                                terminationReason: payload.terminationReason.bizparKey,
                                                updatedBy: this.props.auth.user.employeeID,
                                                updatedDate: M().format("DD-MM-YYYY HH:mm:ss")
                                            };
                                            this.props.onSave(payload)
                                        }}
                                  >
                                    <span>SAVE</span>
                                  </Button>
                                    // <button
                                    //     style={{ marginLeft: "15px" }}
                                    //     className="btn btn-blue"
                                    //     type="button"
                                    //     onClick={() => {
                                    //         let payload = this.state.data;
                                    //         payload = {
                                    //             terminationID: payload.terminationID,
                                    //             terminationDocumentNumber: payload.terminationDocumentNumber,
                                    //             terminationSPKNumber: !R.isNil(payload.terminationSPKNumber) ? payload.terminationSPKNumber : "",
                                    //             terminationSPKDate: payload.terminationSPKDate !== "Invalid date" ? M(payload.terminationSPKDate, 'YYYY-MM-DD').format('DD-MM-YYYY') : "",
                                    //             terminationDocumentDate: payload.terminationDocumentDate !== "Invalid date" ? M(payload.terminationDocumentDate, 'YYYY-MM-DD').format('DD-MM-YYYY') : "",
                                    //             terminationRequestDate: payload.terminationRequestDate !== "Invalid date" ? M(payload.terminationRequestDate, 'YYYY-MM-DD').format('DD-MM-YYYY') : "",
                                    //             terminationEffectiveDate: payload.terminationEffectiveDate !== "Invalid date" ? M(payload.terminationEffectiveDate, 'YYYY-MM-DD').format('DD-MM-YYYY') : "",
                                    //             terminationPPHEndDate: payload.terminationPPHEndDate !== "Invalid date" ? M(payload.terminationPPHEndDate, 'YYYY-MM-DD').format('DD-MM-YYYY') : "",
                                    //             terminationNotes: payload.terminationNotes,
                                    //             terminationDocumentURL: payload.terminationDocumentURL,
                                    //             terminationStatus: payload.terminationStatus,
                                    //             employeeID: !R.isNil(this.state.dataEmployeeKk) ? this.state.dataEmployeeKk : "",
                                    //             requestBy: payload.requestBy.employeeID,
                                    //             terminationType: payload.terminationType.bizparKey,
                                    //             terminationCategory: payload.terminationCategory.bizparKey,
                                    //             terminationReason: payload.terminationReason.bizparKey,
                                    //             updatedBy: this.props.auth.user.employeeID,
                                    //             updatedDate: M().format("DD-MM-YYYY HH:mm:ss")
                                    //         };
                                    //         this.props.onSave(payload)
                                    //     }}
                                    // >
                                    //     <span>SAVE</span>
                                    // </button>
                                ) : null}
                                {this.props.type === "update" ? (
                                    <button
                                        style={{ marginLeft: "15px" }}
                                        // onClick={this.props.onProcess}
                                        className="btn btn-blue"
                                        type="button"
                                        onClick={() => {
                                            let payload = this.state.data
                                            payload = {
                                                "taskID": "",
                                                "senderUserID": this.state.auth.user.userID,
                                                "senderEmpID": this.state.auth.user.employeeID,
                                                "senderNotes": "",
                                                "senderBPMStatus": "INITIATE",
                                                "data": {
                                                    terminationID: payload.terminationID,
                                                    terminationDocumentNumber: payload.terminationDocumentNumber,
                                                    terminationSPKNumber: !R.isNil(payload.terminationSPKNumber) ? payload.terminationSPKNumber : "",
                                                    terminationSPKDate: payload.terminationSPKDate !== "Invalid date" ? M(payload.terminationSPKDate, 'YYYY-MM-DD').format('DD-MM-YYYY') : "",
                                                    terminationDocumentDate: payload.terminationDocumentDate !== "Invalid date" ? M(payload.terminationDocumentDate, 'YYYY-MM-DD').format('DD-MM-YYYY') : "",
                                                    terminationRequestDate: payload.terminationRequestDate !== "Invalid date" ? M(payload.terminationRequestDate, 'YYYY-MM-DD').format('DD-MM-YYYY') : "",
                                                    terminationEffectiveDate: payload.terminationEffectiveDate !== "Invalid date" ? M(payload.terminationEffectiveDate, 'YYYY-MM-DD').format('DD-MM-YYYY') : "",
                                                    terminationPPHEndDate: payload.terminationPPHEndDate !== "Invalid date" ? M(payload.terminationPPHEndDate, 'YYYY-MM-DD').format('DD-MM-YYYY') : "",
                                                    terminationNotes: payload.terminationNotes,
                                                    terminationDocumentURL: payload.terminationDocumentURL,
                                                    terminationStatus: payload.terminationStatus,
                                                    employeeID: !R.isNil(this.state.dataEmployeeKk) ? this.state.dataEmployeeKk : "",
                                                    requestBy: payload.requestBy.employeeID,
                                                    terminationType: payload.terminationType.bizparKey,
                                                    terminationCategory: payload.terminationCategory.bizparKey,
                                                    terminationReason: payload.terminationReason.bizparKey,
                                                    updatedBy: "SYSTEM",
                                                    updatedDate: M().format("DD-MM-YYYY HH:mm:ss"),
                                                }
                                            }
                                            // return console.log(JSON.stringify(payload))
                                            this.props.onSubmit(payload)
                                        }}
                                    >
                                        <span>SAVE & SUBMIT</span>
                                    </button>
                                ) : null}
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
                <div className="padding-bottom-20px" />
            </div >
        );
    }
}

// export default formEmployeeTerminationDetail;
const mapStateToProps = state => {
    return {
        auth: state.auth,
    };
};

export default connect(mapStateToProps)(formEmployeeTerminationDetail)
