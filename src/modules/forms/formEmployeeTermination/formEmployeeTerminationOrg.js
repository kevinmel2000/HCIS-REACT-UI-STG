import React, { Component } from 'react'
import Api from '../../../Services/Api'
// import DDL from '../../popup/DDLMenu'
import DropDown from '../../popup/DropDown'
import * as R from 'ramda'
// import M from 'moment'
// import uuid from "uuid"

class FormEmployeeTerminationOrg extends Component {

    constructor(props) {
        super(props)
        this.state = {
            formSimulate: false,
            imageUrl: "",
            data: [],
            terminationData: props.rawData
        }
    }

    componentWillMount() {
        this.getDataDiagram()
        this.getDataEmployee()
    }

    componentDidUpdate(prevProps) {
        if (this.props.rawData !== prevProps.rawData) {
            this.setState({ terminationData: this.props.rawData })
            this.getDataEmployee()
        } 
    }

    openFormSimulate = () => {
        this.setState({ formSimulate: !this.state.formSimulate })
    }

    getDataDiagram = async () => {
        let res = await Api.create('ES').getEsById(this.state.terminationData.employee.companyID)
        if (res.data && res.data.status === "S") {
            this.setState({ esData: res.data.data && res.data.data.orgStructureTPL[0] && res.data.data.orgStructureTPL[0].referenceOrgStructureTPLID.orgStructureTPLDetails ? res.data.data.orgStructureTPL[0].referenceOrgStructureTPLID.orgStructureTPLDetails[0] : [] })
        } else {
            alert(res.data && res.data.message ? res.data.message : res.problem)
        }
    }

    async getDataEmployee() {
        let payload = {
            "employeeID": this.props.rawData.employee.employeeID
        }
        let response = await Api.create("EMPLOYEE_QUERY").getEmployeeById(payload)
        if (response.data && response.data.status === "S") {
            this.setState({ employeeData: response.data.data })
        }

        let res = await fetch(process.env.REACT_APP_HCIS_BE_API + 'emcmd/api/employee.photo.get/' + this.props.rawData.employee.employeeID, {
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
                                            <h4>SPK Date</h4>
                                        </div>
                                    </div>
                                    <input
                                        value={this.state.terminationData.terminationSPKDate}
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
                                            <h4>Request Date</h4>
                                        </div>
                                    </div>
                                    <input
                                        value={this.state.terminationData.terminationRequestDate}
                                        type="text"
                                        disabled
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        className="txt txt-sekunder-color"
                                        placeholder="Request Date"
                                    />
                                </div>
                            </div>
                            <div className="column-3">
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Out Date</h4>
                                        </div>
                                    </div>
                                    <input
                                        value={this.state.terminationData.terminationEffectiveDate}
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
                                            <h4>PPH End Date</h4>
                                        </div>
                                    </div>
                                    <input
                                        value={this.state.terminationData.terminationPPHEndDate}
                                        type="text"
                                        disabled
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        className="txt txt-sekunder-color"
                                        placeholder="Effective Date"
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
                        <DropDown disabled title={!R.isNil(this.state.terminationData.employee) ? this.state.terminationData.employee.positionName : ""} />
                    </div>
                </div>
                <div className="margin-bottom-20px">
                    <div className="margin-5px">
                        <h4>After</h4>
                        <input
                            value={"TERMINATE"}
                            type="text"
                            disabled
                            style={{ backgroundColor: "#E6E6E6", fontWeight: 600 }}
                            className="txt txt-sekunder-color"
                        />
                    </div>
                </div>
            </div >
        )
    }

}

export default FormEmployeeTerminationOrg