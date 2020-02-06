import React, { Component } from 'react'
import Api from '../../../Services/Api'
import DDL from '../../popup/DDLMenu'
import DropDown from '../../popup/DropDown'
import * as R from 'ramda'
import M from 'moment'
import uuid from "uuid"
import { Rabbit as Button } from 'react-button-loaders'

class FormMovementOrgStructure extends Component {

    constructor(props) {
        super(props)
        this.state = {
            formSimulate: false,
            imageUrl: "",
            data: [],
            movementData: props.movementData
        }
    }

    componentWillMount() {
        this.getDataDiagram()
        this.getDataEmployee()
        if (!R.isNil(this.props.movementData.movementPosition.positionIDAfter.ouid)) return this.getPayroll(this.props.movementData.movementPosition.positionIDAfter.ouid)
    }

    componentDidUpdate(prevProps) {
        if (this.props.movementData !== prevProps.movementData) return this.setState({ movementData: this.props.movementData })
    }

    openFormSimulate = () => {
        this.setState({ formSimulate: !this.state.formSimulate })
    }

    getDataDiagram = async () => {
        let res = await Api.create('ES').getEsById(this.state.movementData.employee.companyID)
        if (res.data && res.data.status === "S") {
            this.renderDdlParent(res.data.data && res.data.data.orgStructureTPL[0] && res.data.data.orgStructureTPL[0].referenceOrgStructureTPLID.orgStructureTPLDetails ? res.data.data.orgStructureTPL[0].referenceOrgStructureTPLID.orgStructureTPLDetails[0] : [])
            this.setState({ esData: res.data.data && res.data.data.orgStructureTPL[0] && res.data.data.orgStructureTPL[0].referenceOrgStructureTPLID.orgStructureTPLDetails ? res.data.data.orgStructureTPL[0].referenceOrgStructureTPLID.orgStructureTPLDetails[0] : [] })
        } else {
            alert(res.data && res.data.message ? res.data.message : res.problem)
        }
    }

    renderDdlParent(esData) {
        let data = this.state.data
        if (esData && esData.ouposition) {
            data.push({
                "id": 1,
                "title": esData.ouposition.bizparValue,
                "value": esData.ouposition.bizparKey,
                "ou": esData.ouid,
                "subMenu": this.renderDdlChildren(esData)
            })
            this.setState({ data })
        }
    }

    renderDdlChildren(data) {
        return (
            data.ouchildren.map((data, index) => {
                return {
                    id: uuid.v4(),
                    title: data.ouposition.bizparValue,
                    value: data.ouposition.bizparKey,
                    ou: data.ouid,
                    subMenu: this.renderDdlChildren(data)
                }
            })
        )
    }

    async getDataEmployee() {
        let payload = {
            "employeeID": this.props.movementData.employee.employeeID
        }
        let response = await Api.create("EMPLOYEE_QUERY").getEmployeeById(payload)
        if (response.data && response.data.status === "S") {
            this.setState({ employeeData: response.data.data })
        }

        let res = await fetch(process.env.REACT_APP_HCIS_BE_API + 'emcmd/api/employee.photo.get/' + this.props.movementData.employee.employeeID, {
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4'
            }
        })
        res = await res.blob()
        if (res.size > 0) {
            res = URL.createObjectURL(res);
            this.setState({ imageUrl: res })
        } else {
            this.setState({ imageUrl: "" })
        }
    }

    handlePosition(ouid) {
        this.setState({
            movementData: {
                ...this.state.movementData,
                movementPosition: {
                    ...this.state.movementData.movementPosition,
                    positionIDAfter: {
                        ouid: ouid
                    }
                }
            }
        })
        this.getPayroll(ouid)
    }

    async getPayroll(ouid) {
        let payload = {
            "esid": this.state.movementData.employee.companyID,
            "ouid": ouid
        }
        let response = await Api.create("ES").getEsByOuid(payload)
        if (response.data && response.data.status === "S") {
            let payroll = response.data.data.oupayrollTPLID.payrollTPLDetails.map((value) => {
                return {
                    "payrollComponent": value.payrollComponent.bizparKey,
                    "payrollComponentValue": value.payrollComponentValue
                }
            })
            let isExist = R.findIndex(R.propEq("payrollComponent", "PAYTPLSEG-03-COM-01"))(payroll)
            if (isExist < 0) {
                this.setState({
                    movementData: {
                        ...this.state.movementData,
                        movementPayroll: {
                            ...this.state.movementData.movementPayroll,
                            basicSalaryValue: ""
                        }
                    }
                })
            } else {
                this.setState({
                    movementData: {
                        ...this.state.movementData,
                        movementPayroll: {
                            ...this.state.movementData.movementPayroll,
                            basicSalaryValue: payroll[isExist].payrollComponentValue
                        }
                    }
                })
            }
        } else return alert("Failed: " + (!R.isNil(response.data) ? response.data.message : ""))
    }

    renderSimulate() {
        let { employeeData } = this.state
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px">
                    <div className="popup-content background-white border-radius">
                        <div className="popup-panel grid grid-2x">
                            <div className="col-1">
                                <div className="popup-title">
                                    Employee Information
                                </div>
                            </div>
                            <div className="col-2 content-right">
                                <button className="btn btn-circle btn-grey" onClick={() => this.openFormSimulate()}>
                                    <i className="fa fa-lg fa-times"></i>
                                </button>
                            </div>
                        </div>
                        <div className="border-bottom padding-15px grid grid-3x grid-mobile-none gap-20px">
                            <div className="column-1 margin-top-20px">
                                <div className="image image-200px image-circle background-white border-all" style={{ margin: 'auto' }}>
                                    {this.state.imageUrl ? (
                                        <img width="100%" height="100%" src={this.state.imageUrl} alt="img" />
                                    ) : <i className="icn fa fa-2x fa-user"></i>}
                                </div>
                            </div>
                            <div className="column-2">
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>NIK</h4>
                                        </div>
                                    </div>
                                    <input
                                        value={employeeData && employeeData.employeeID}
                                        type="text"
                                        disabled
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        className="txt txt-sekunder-color"
                                        placeholder="NIK"
                                    />
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Employee Name</h4>
                                        </div>
                                    </div>
                                    <input
                                        value={employeeData && employeeData.employeeName}
                                        type="text"
                                        disabled
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        className="txt txt-sekunder-color"
                                        placeholder="Employee Name"
                                    />
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Birth Place</h4>
                                        </div>
                                    </div>
                                    <input
                                        value={employeeData && employeeData.employeeBirthPlace}
                                        type="text"
                                        disabled
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        className="txt txt-sekunder-color"
                                        placeholder="Birth Place"
                                    />
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Date Of Birth</h4>
                                        </div>
                                    </div>
                                    <input
                                        value={employeeData && employeeData.employeeBirthDate}
                                        type="text"
                                        disabled
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        className="txt txt-sekunder-color"
                                        placeholder="Date Of Birth"
                                    />
                                </div>
                            </div>
                            <div className="column-3">
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Gender</h4>
                                        </div>
                                    </div>
                                    <input
                                        value={employeeData && employeeData.employeeGender && employeeData.employeeGender.bizparValue}
                                        type="text"
                                        disabled
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        className="txt txt-sekunder-color"
                                        placeholder="Gender"
                                    />
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>KTP Number</h4>
                                        </div>
                                    </div>
                                    <input
                                        value={employeeData && employeeData.employeeKTPNumber}
                                        type="text"
                                        disabled
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        className="txt txt-sekunder-color"
                                        placeholder="KTP Number"
                                    />
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Passport Number</h4>
                                        </div>
                                    </div>
                                    <input
                                        value={employeeData && employeeData.employeeGender && employeeData.employeeGender.bizparValue}
                                        type="text"
                                        disabled
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        className="txt txt-sekunder-color"
                                        placeholder="Passport Number"
                                    />
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>NPWP</h4>
                                        </div>
                                    </div>
                                    <input
                                        value={employeeData && employeeData.employeePassportNumber}
                                        type="text"
                                        disabled
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        className="txt txt-sekunder-color"
                                        placeholder="NPWP"
                                    />
                                </div>
                            </div>
                            <div><h4>Company Data</h4></div>
                            <div className="column-1">
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Company</h4>
                                        </div>
                                    </div>
                                    <input
                                        value={employeeData && employeeData.company && employeeData.company.companyName}
                                        type="text"
                                        disabled
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        className="txt txt-sekunder-color"
                                        placeholder="Company"
                                    />
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Position</h4>
                                        </div>
                                    </div>
                                    <input
                                        value={employeeData && employeeData.position && employeeData.position.positionName}
                                        type="text"
                                        disabled
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        className="txt txt-sekunder-color"
                                        placeholder="Position"
                                    />
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Tax Status</h4>
                                        </div>
                                    </div>
                                    <input
                                        value={employeeData && employeeData.employeePTKPType && employeeData.employeePTKPType.bizparValue}
                                        type="text"
                                        disabled
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        className="txt txt-sekunder-color"
                                        placeholder="Tax Status"
                                    />
                                </div>
                            </div>
                            <div className="column-2">
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Grade</h4>
                                        </div>
                                    </div>
                                    <input
                                        value={employeeData && employeeData.position && employeeData.position.positionGrade && employeeData.position.positionGrade.bizparValue}
                                        type="text"
                                        disabled
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        className="txt txt-sekunder-color"
                                        placeholder="Grade"
                                    />
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Join Date</h4>
                                        </div>
                                    </div>
                                    <input
                                        value={employeeData && employeeData.employeeRegistrationDate}
                                        type="text"
                                        disabled
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        className="txt txt-sekunder-color"
                                        placeholder="Join Date"
                                    />
                                </div>
                            </div>
                            <div className="column-3">
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>SPK Date</h4>
                                        </div>
                                    </div>
                                    <input
                                        value={this.state.movementData.movementSPKDate}
                                        type="text"
                                        disabled
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        className="txt txt-sekunder-color"
                                        placeholder="SPK Date"
                                    />
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Effective Date</h4>
                                        </div>
                                    </div>
                                    <input
                                        value={this.state.movementData.movementEffectiveDate}
                                        type="text"
                                        disabled
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        className="txt txt-sekunder-color"
                                        placeholder="Effective Date"
                                    />
                                </div>
                            </div>
                            <div><h4>Payroll Structure</h4></div>
                            <div className="column-1">
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Basic Salary</h4>
                                        </div>
                                    </div>
                                    <input
                                        type="text"
                                        disabled
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        className="txt txt-sekunder-color"
                                        placeholder="Basic Salary"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="margin-bottom-20px"></div>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div>
                <div className="content-right">
                    <button
                        style={{ marginLeft: "15px" }}
                        onClick={() => this.openFormSimulate()}
                        className="btn btn-blue"
                        type="button">
                        <span>SIMULATE</span>
                    </button>
                </div>
                {this.state.formSimulate && this.renderSimulate()}
                <div className="margin-bottom-20px">
                    <div className="margin-5px">
                        <h4>Before</h4>
                        <DropDown disabled title={!R.isNil(this.state.movementData.employee) ? this.state.movementData.employee.positionName : ""} />
                    </div>
                </div>
                <div className="margin-bottom-20px">
                    <div className="margin-5px">
                        <h4>After <span style={{ color: "red" }}>*</span></h4>
                        <DDL
                            title={this.state.movementData.movementPosition.positionIDAfter ? this.state.movementData.movementPosition.positionIDAfter.ouposition : "--- Please Select Position ---"}
                            data={this.state.data}
                            disabled={this.props.type === "view"}
                            onChange={(e) => this.handlePosition(e)}
                        />
                    </div>
                </div>
                <div className="padding-15px">
                    <div className="grid">
                        <div className="col-2 content-right">
                            {this.props.type !== "view" ?
                            <Button
                            type='button'
                            state={this.props.sendState}
                            style={{ position: 'absolute', padding: '0 14px', height: 40, borderRadius: 3, fontSize: 10, textAlign: 'center', width: 70 }}
                            className="btn btn-blue"
                            onClick={() => {
                                let payload = this.state.movementData;
                                payload = {
                                    movementID: payload.movementID,
                                    movementSPKNumber: payload.movementSPKNumber,
                                    movementSPKDate: payload.movementSPKDate,
                                    movementNotes: payload.movementNotes,
                                    movementEffectiveDate: payload.movementEffectiveDate,
                                    movementDocumentURL: payload.movementDocumentURL,
                                    movementCategory: payload.movementCategory.bizparKey,
                                    movementType: payload.movementType.bizparKey,
                                    movementPayroll: {
                                        basicSalaryValue: !R.isNil(payload.movementPayroll.basicSalaryValue) || !R.isEmpty(payload.movementPayroll.basicSalaryValue) ? payload.movementPayroll.basicSalaryValue : "",
                                        effectiveStartDate: payload.movementEffectiveDate,
                                        effectiveEndDate: !R.isNil(payload.movementPayroll.effectiveEndDate) ? payload.movementPayroll.effectiveEndDate : ""
                                    },
                                    movementPosition: {
                                        positionAfterEffectiveStartDate: M().format("DD-MM-YYYY"),
                                        positionAfterEffectiveEndDate: M().format("DD-MM-YYYY"),
                                        companyIDAfter: payload.employee && payload.employee.companyID ? payload.employee.companyID : "",
                                        companyIDBefore: payload.employee && payload.employee.companyID ? payload.employee.companyID : "",
                                        positionIDAfter: payload.movementPosition.positionIDAfter.ouid,
                                        positionIDBefore: payload.employee && payload.employee.positionID ? payload.employee.positionID : "",
                                    },
                                    movementStatus: payload.movementStatus,
                                    employeeID: payload.employee.employeeID,
                                    requestBy: payload.requestBy.employeeID,
                                    esid: payload.esid.esid,
                                    createdBy: payload.movementCreationalDTO.createdBy,
                                    createdDate: payload.movementCreationalDTO.createdDate,
                                    updatedBy: "SYSTEM",
                                    updatedDate: M().format("DD-MM-YYYY HH:mm:ss"),
                                }

                                if (R.isNil(payload.movementPosition) || R.isNil(payload.movementPosition.positionIDAfter)) return alert("Position After is Required.")
                                this.props.onSave(payload)
                            }}>
                                <span>SAVE</span>
                            </Button>
                                // <button
                                //     style={{ marginLeft: "15px" }}
                                //     className="btn btn-blue"
                                //     type="button"
                                //     onClick={() => {
                                //         let payload = this.state.movementData;
                                //         payload = {
                                //             movementID: payload.movementID,
                                //             movementSPKNumber: payload.movementSPKNumber,
                                //             movementSPKDate: payload.movementSPKDate,
                                //             movementNotes: payload.movementNotes,
                                //             movementEffectiveDate: payload.movementEffectiveDate,
                                //             movementDocumentURL: payload.movementDocumentURL,
                                //             movementCategory: payload.movementCategory.bizparKey,
                                //             movementType: payload.movementType.bizparKey,
                                //             movementPayroll: {
                                //                 basicSalaryValue: !R.isNil(payload.movementPayroll.basicSalaryValue) || !R.isEmpty(payload.movementPayroll.basicSalaryValue) ? payload.movementPayroll.basicSalaryValue : "",
                                //                 effectiveStartDate: payload.movementEffectiveDate,
                                //                 effectiveEndDate: !R.isNil(payload.movementPayroll.effectiveEndDate) ? payload.movementPayroll.effectiveEndDate : ""
                                //             },
                                //             movementPosition: {
                                //                 positionAfterEffectiveStartDate: M().format("DD-MM-YYYY"),
                                //                 positionAfterEffectiveEndDate: M().format("DD-MM-YYYY"),
                                //                 companyIDAfter: payload.employee && payload.employee.companyID ? payload.employee.companyID : "",
                                //                 companyIDBefore: payload.employee && payload.employee.companyID ? payload.employee.companyID : "",
                                //                 positionIDAfter: payload.movementPosition.positionIDAfter.ouid,
                                //                 positionIDBefore: payload.employee && payload.employee.positionID ? payload.employee.positionID : "",
                                //             },
                                //             movementStatus: payload.movementStatus,
                                //             employeeID: payload.employee.employeeID,
                                //             requestBy: payload.requestBy.employeeID,
                                //             esid: payload.esid.esid,
                                //             createdBy: payload.movementCreationalDTO.createdBy,
                                //             createdDate: payload.movementCreationalDTO.createdDate,
                                //             updatedBy: "SYSTEM",
                                //             updatedDate: M().format("DD-MM-YYYY HH:mm:ss"),
                                //         }

                                //         if (R.isNil(payload.movementPosition) || R.isNil(payload.movementPosition.positionIDAfter)) return alert("Position After is Required.")
                                //         this.props.onSave(payload)
                                //     }}>
                                //     <span>SAVE</span>
                                // </button> 
                                : null}
                            {this.props.type === "edit" ? (
                                <button
                                    style={{ marginLeft: "15px" }}
                                    className="btn btn-blue"
                                    type="button"
                                    onClick={() => {
                                        let payload = this.state.movementData
                                        payload = {
                                            "taskID": "",
                                            "senderUserID": this.props.auth.user.userID,
                                            "senderEmpID": this.props.auth.user.employeeID,
                                            "senderNotes": "",
                                            "senderBPMStatus": "INITIATE",
                                            "data": {
                                                movementID: payload.movementID,
                                                movementSPKNumber: payload.movementSPKNumber,
                                                movementSPKDate: payload.movementSPKDate,
                                                movementNotes: payload.movementNotes,
                                                movementEffectiveDate: payload.movementEffectiveDate,
                                                movementDocumentURL: payload.movementDocumentURL,
                                                movementCategory: payload.movementCategory.bizparKey,
                                                movementType: payload.movementType.bizparKey,
                                                employeeID: payload.employee.employeeID,
                                                movementPosition: {
                                                    positionAfterEffectiveStartDate: M().format("DD-MM-YYYY"),
                                                    positionAfterEffectiveEndDate: M().format("DD-MM-YYYY"),
                                                    companyIDAfter: payload.employee && payload.employee.companyID ? payload.employee.companyID : "",
                                                    companyIDBefore: payload.employee && payload.employee.companyID ? payload.employee.companyID : "",
                                                    positionIDAfter: payload.movementPosition.positionIDAfter.ouid,
                                                    positionIDBefore: payload.employee && payload.employee.positionID ? payload.employee.positionID : "",
                                                },
                                                movementPayroll: {
                                                    basicSalaryValue: !R.isNil(payload.movementPayroll.basicSalaryValue) || !R.isEmpty(payload.movementPayroll.basicSalaryValue) ? payload.movementPayroll.basicSalaryValue : "",
                                                    effectiveStartDate: payload.movementEffectiveDate,
                                                    effectiveEndDate: !R.isNil(payload.movementPayroll.effectiveEndDate) ? payload.movementPayroll.effectiveEndDate : ""
                                                },
                                                movementStatus: payload.movementStatus,
                                                requestBy: payload.requestBy.employeeID,
                                                esid: payload.esid.esid,
                                                createdBy: payload.movementCreationalDTO.createdBy,
                                                createdDate: payload.movementCreationalDTO.createdDate,
                                                updatedBy: "SYSTEM",
                                                updatedDate: M().format("DD-MM-YYYY HH:mm:ss")
                                            }
                                        }
                                        if (R.isNil(payload.data.movementPosition) || R.isNil(payload.data.movementPosition.positionIDAfter)) return alert("Position After is Required.")
                                        this.props.onClickSave(payload)
                                    }}>
                                    <span>SAVE & SUBMIT</span>
                                </button>
                            ) : null}
                            <button
                                style={{ marginLeft: "15px" }}
                                onClick={this.props.onClickClose}
                                className="btn btn-primary"
                                type="button">
                                <span>CLOSE</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div >
        )
    }

}

export default FormMovementOrgStructure