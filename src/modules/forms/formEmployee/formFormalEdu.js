import React, { Component } from 'react'
import M from 'moment'
import * as R from 'ramda'
import DropDown from '../../../modules/popup/DropDown'
import CalendarPicker from '../../../modules/popup/Calendar'
import NumberFormat from 'react-number-format'
import Api from '../../../Services/Api'
import { Rabbit as Button } from 'react-button-loaders'

const defaultPayloadFormEdu = {
    "employeeFormalEducationID": "FEDU-" + Date.now(),
    "formalEducationStartDate": "",
    "formalEducationEndDate": "",
    "formalEducationCertificationNumber": "",
    "formalEducationCertificationDate": "",
    "formalEducationIPK": "",
    "formalEducationCity": "",
    "formalEducationNotes": "",
    "formalEducationDegree": "",
    "formalEducationDepartment": "",
    "formalEducationDegreePosition": "",
    "formalEducationInstitute": "",
    "formalEducationCostSource": "",
    "formalEducationType": "",
    "formalEducationLevel": ""
}

class FormFormalEdu extends Component {
    constructor(props) {
        super(props)
        let { employeeDataFormEdu, bizparEduDegree, bizparEduDegreePosition,
            bizparEduDepartment, bizparEduLevel, institute, bizparCostSource } = this.props

        this.state = {
            employeeDataFormEdu: employeeDataFormEdu ?
                {
                    ...employeeDataFormEdu,
                    formalEducationStartDate: M(employeeDataFormEdu.formalEducationStartDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
                    formalEducationEndDate: M(employeeDataFormEdu.formalEducationEndDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
                    formalEducationIPK: !R.isEmpty(employeeDataFormEdu.formalEducationIPK) || !R.isNil(employeeDataFormEdu.formalEducationIPK) ? String(employeeDataFormEdu.formalEducationIPK).split(".").join("") : employeeDataFormEdu.formalEducationIPK,
                    formalEducationCertificationDate: R.isNil(employeeDataFormEdu.formalEducationCertificationDate) || R.isEmpty(employeeDataFormEdu.formalEducationCertificationDate) ? '' : M(employeeDataFormEdu.formalEducationCertificationDate, 'DD-MM-YYYY').format('YYYY-MM-DD')
                } : defaultPayloadFormEdu,
            bizparEduDegree, bizparEduDegreePosition,
            bizparEduDepartment, bizparEduLevel, institute, bizparCostSource,
            level: this.props.employeeDataFormEdu ? this.props.employeeDataFormEdu.formalEducationLevel.bizparKey : ''
        };
    }

    componentWillMount() {
        let { employeeDataFormEdu } = this.state
        if (this.props.type !== 'create') this.getBizpar(employeeDataFormEdu.formalEducationLevel.bizparKey, employeeDataFormEdu.formalEducationType.bizparKey)
    }

    async getBizpar(level, type) {
        let payload = {
            "limit": 100,
            "offset": 0,
            "params": {
                "educationConfigurationType": type,
                "educationConfigurationLevel": level
            }
        }
        let res = await Api.create('MASTERDATA').getInstituteByTypeAndLevel(payload)
        let resDep = await Api.create('MASTERDATA').getDepartmentByTypeAndLevel(payload)
        this.setState({
            institute: res.data.data,
            bizparEduDepartment: resDep.data.data
        })
    }

    renderForm = () => (
        <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-15px">
            <div className="column-1">
                {this.props.type !== "create" ? (
                    <div className="margin-bottom-20px">
                        <div className="margin-5px">
                            <div className="txt-site txt-11 txt-main txt-bold">
                                <h4>Formal Education Number</h4>
                            </div>
                        </div>
                        <input
                            readOnly
                            style={{ backgroundColor: "#E6E6E6" }}
                            type="text"
                            className="txt txt-sekunder-color"
                            placeholder=""
                            required
                            value={this.state.employeeDataFormEdu.employeeFormalEducationID}
                        />
                    </div>
                ) : null}

                <div className="margin-bottom-20px">
                    <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>Date <span style={{ color: "red" }}>*</span></h4>
                        </div>
                    </div>
                    <div className="display-flex-normal">
                        <CalendarPicker
                            disabled={this.props.type === "view" ? true : false}
                            date={this.state.employeeDataFormEdu && this.state.employeeDataFormEdu.formalEducationStartDate}
                            onChange={(e) => this.setState({
                                employeeDataFormEdu: {
                                    ...this.state.employeeDataFormEdu,
                                    formalEducationStartDate: M(e).format('YYYY-MM-DD')
                                }
                            })} />
                        <div className="txt-site txt-11 txt-primary txt-center margin-10px margin-left-10px margin-right-10px">
                            To
										</div>
                        <CalendarPicker
                            disabled={this.props.type === "view" ? true : false}
                            date={this.state.employeeDataFormEdu && this.state.employeeDataFormEdu.formalEducationEndDate}
                            onChange={(e) => this.setState({
                                employeeDataFormEdu: {
                                    ...this.state.employeeDataFormEdu,
                                    formalEducationEndDate: M(e).format('YYYY-MM-DD')
                                }
                            })} />
                    </div>
                </div>

                <div className="margin-bottom-20px">
                    <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>Education Type <span style={{ color: "red" }}>*</span></h4>
                        </div>
                    </div>
                    <DropDown
                        title="-- please select education --"
                        onChange={(dt) => {
                            this.getBizpar(this.state.employeeDataFormEdu.formalEducationLevel.bizparKey, dt)
                            this.setState({
                                employeeDataFormEdu: {
                                    ...this.state.employeeDataFormEdu,
                                    formalEducationType: {
                                        ...this.state.employeeDataFormEdu.formalEducationType,
                                        bizparKey: dt
                                    },
                                    formalEducationInstitute: {
                                        ...this.state.employeeDataFormEdu.formalEducationInstitute,
                                        instituteID: ''
                                    },
                                    formalEducationDepartement: {
                                        ...this.state.employeeDataFormEdu.formalEducationDepartement,
                                        bizparKey: ''
                                    }
                                }
                            })
                        }
                        }
                        type="bizpar"
                        disabled={this.props.type === "view" ? true : false}
                        data={this.props.bizparEduType}
                        value={this.state.employeeDataFormEdu.formalEducationType && this.state.employeeDataFormEdu.formalEducationType.bizparKey} />

                </div>

                <div className="margin-bottom-20px">
                    <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>Education Level <span style={{ color: "red" }}>*</span></h4>
                        </div>
                    </div>
                    <DropDown
                        title="-- please select education level --"
                        onChange={(dt) => {
                            this.getBizpar(dt, this.state.employeeDataFormEdu.formalEducationType.bizparKey)
                            this.setState({
                                employeeDataFormEdu: {
                                    ...this.state.employeeDataFormEdu,
                                    formalEducationLevel: {
                                        ...this.state.employeeDataFormEdu.formalEducationLevel,
                                        bizparKey: dt
                                    },
                                    formalEducationInstitute: {
                                        ...this.state.employeeDataFormEdu.formalEducationInstitute,
                                        instituteID: ''
                                    },
                                    formalEducationDepartment: {
                                        ...this.state.employeeDataFormEdu.formalEducationDepartment,
                                        bizparKey: ''
                                    }
                                },
                                level: dt,
                            })
                        }}
                        type="bizpar"
                        disabled={this.props.type === "view" ? true : false}
                        data={this.props.bizparEduLevel}
                        value={this.state.employeeDataFormEdu.formalEducationLevel && this.state.employeeDataFormEdu.formalEducationLevel.bizparKey} />

                </div>

                <div className="margin-bottom-20px">
                    <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>Institution <span style={{ color: "red" }}>*</span></h4>
                        </div>
                    </div>
                    <DropDown
                        title="-- please select institution --"
                        onChange={(dt) => this.setState({
                            employeeDataFormEdu: {
                                ...this.state.employeeDataFormEdu,
                                formalEducationInstitute: {
                                    ...this.state.employeeDataFormEdu.formalEducationInstitute,
                                    instituteID: dt
                                }
                            }
                        })}
                        type="institute"
                        eduType={this.state.employeeDataFormEdu.formalEducationType}
                        eduLevel={this.state.employeeDataFormEdu.formalEducationLevel}
                        disabled={this.props.type === "view" ? true : false}
                        data={this.state.institute}
                        value={this.state.employeeDataFormEdu &&
                            this.state.employeeDataFormEdu.formalEducationInstitute ?
                            this.state.employeeDataFormEdu.formalEducationInstitute.instituteID :
                            ""} />

                </div>

                {!(this.state.level === 'EDULVL-001' || this.state.level === 'EDULVL-002') && (
                    <div>
                        <div className="margin-bottom-20px">
                            <div className="margin-5px">
                                <div className="txt-site txt-11 txt-main txt-bold">
                                    <h4>Major <span style={{ color: "red" }}>*</span></h4>
                                </div>
                            </div>

                            <DropDown
                                title="-- please select major --"
                                onChange={(dt) => this.setState({
                                    employeeDataFormEdu: {
                                        ...this.state.employeeDataFormEdu,
                                        formalEducationDepartment: {
                                            ...this.state.employeeDataFormEdu.formalEducationDepartment,
                                            bizparKey: dt
                                        }
                                    }
                                })}
                                type="bizpar"
                                disabled={this.props.type === "view" ? true : false}
                                DdType={'major'}
                                eduType={this.state.employeeDataFormEdu.formalEducationType}
                                eduLevel={this.state.employeeDataFormEdu.formalEducationLevel}
                                data={this.state.bizparEduDepartment}
                                value={this.state.employeeDataFormEdu && this.state.employeeDataFormEdu.formalEducationDepartment ? this.state.employeeDataFormEdu.formalEducationDepartment.bizparKey : ''} />
                        </div>
                        {!(this.state.level === 'EDULVL-003' || this.state.level === 'EDULVL-004') && (
                            <div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Degree</h4>
                                        </div>
                                    </div>

                                    <DropDown
                                        title="-- please select degree --"
                                        onChange={(dt) => this.setState({
                                            employeeDataFormEdu: {
                                                ...this.state.employeeDataFormEdu,
                                                formalEducationDegree: {
                                                    ...this.state.employeeDataFormEdu.formalEducationDegree,
                                                    bizparKey: dt
                                                }
                                            }
                                        })}
                                        type="bizpar"
                                        disabled={this.props.type === "view" ? true : false}
                                        data={this.props.bizparEduDegree}
                                        value={this.state.employeeDataFormEdu && this.state.employeeDataFormEdu.formalEducationDegree.bizparKey} />
                                </div>

                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Position of Degree</h4>
                                        </div>
                                    </div>

                                    <DropDown
                                        title="-- please select degree position --"
                                        onChange={(dt) => this.setState({
                                            employeeDataFormEdu: {
                                                ...this.state.employeeDataFormEdu,
                                                formalEducationDegreePosition: {
                                                    ...this.state.employeeDataFormEdu.formalEducationDegreePosition,
                                                    bizparKey: dt
                                                }
                                            }
                                        })}
                                        type="bizpar"
                                        disabled={this.props.type === "view" ? true : false}
                                        data={this.props.bizparEduDegreePosition}
                                        value={this.state.employeeDataFormEdu && this.state.employeeDataFormEdu.formalEducationDegreePosition.bizparKey} />
                                </div>
                            </div>
                        )}
                    </div>
                )}

            </div>

            <div className="column-2">

                <div className="margin-bottom-20px">
                    <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>Cost Type</h4>
                        </div>
                    </div>

                    <DropDown
                        title="-- please select degree position --"
                        onChange={(dt) => this.setState({
                            employeeDataFormEdu: {
                                ...this.state.employeeDataFormEdu,
                                formalEducationCostSource: {
                                    ...this.state.employeeDataFormEdu.formalEducationCostSource,
                                    bizparKey: dt
                                }
                            }
                        })}
                        type="bizpar"
                        disabled={this.props.type === "view" ? true : false}
                        data={this.props.bizparCostSource}
                        value={this.state.employeeDataFormEdu && this.state.employeeDataFormEdu.formalEducationCostSource.bizparKey} />
                </div>

                <div className="margin-bottom-20px">
                    <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>Certificate Number</h4>
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
                        value={this.state.employeeDataFormEdu.formalEducationCertificationNumber}
                        onChange={(e) => this.setState({
                            employeeDataFormEdu: {
                                ...this.state.employeeDataFormEdu,
                                formalEducationCertificationNumber: e.target.value
                            }
                        })}
                    />
                </div>

                <div className="margin-bottom-20px">
                    <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>Certificate Date</h4>
                        </div>
                    </div>

                    <CalendarPicker
                        disabled={this.props.type === "view" ? true : false}
                        date={this.state.employeeDataFormEdu && this.state.employeeDataFormEdu.formalEducationCertificationDate}
                        onChange={(e) => this.setState({
                            employeeDataFormEdu: {
                                ...this.state.employeeDataFormEdu,
                                formalEducationCertificationDate: e
                            }
                        })} />
                </div>
                {!(this.state.level === 'EDULVL-001' || this.state.level === 'EDULVL-002' || this.state.level === 'EDULVL-003' || this.state.level === 'EDULVL-004') && (
                    <div className="margin-bottom-20px">
                        <div className="margin-5px">
                            <div className="txt-site txt-11 txt-main txt-bold">
                                <h4>GPA <span style={{ color: "red" }}>*</span></h4>
                            </div>
                        </div>
                        <NumberFormat
                            required
                            className="txt txt-sekunder-color"
                            style={this.props.type === "view" ? { backgroundColor: "#E6E6E6" } : null}
                            readOnly={this.props.type === "view" ? true : false}
                            decimalSeparator={"."}
                            placeholder={"4.0"}
                            format={"#.##"}
                            decimalScale={2}
                            value={this.state.employeeDataFormEdu.formalEducationIPK}
                            onValueChange={(e) => {
                                this.setState({
                                    employeeDataFormEdu: {
                                        ...this.state.employeeDataFormEdu,
                                        formalEducationIPK: e.formattedValue
                                    }
                                })
                            }} />
                    </div>
                )}

                <div className="margin-bottom-20px">
                    <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>City</h4>
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
                        value={this.state.employeeDataFormEdu.formalEducationCity}
                        onChange={(e) => this.setState({
                            employeeDataFormEdu: {
                                ...this.state.employeeDataFormEdu,
                                formalEducationCity: e.target.value
                            }
                        })}
                    />
                </div>

                <div className="margin-bottom-20px">
                    <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>Information</h4>
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
                        value={this.state.employeeDataFormEdu.formalEducationNotes}
                        onChange={(e) => this.setState({
                            employeeDataFormEdu: {
                                ...this.state.employeeDataFormEdu,
                                formalEducationNotes: e.target.value
                            }
                        })}
                    />
                </div>
            </div>
        </div>
    )
    renderFooter = () => (
        <div className="padding-15px">
            <div className="grid grid-2x">
                <div className="col-1" />
                <div className="col-2 content-right">
                    {this.props.type !== "view" ? (
                        <Button
                            state={this.props.sendState}
                            style={{ position: 'absolute', padding: '0 14px', height: 40, borderRadius: 3, fontSize: 10, textAlign: 'center', width: 90, marginLeft: 365 }}
                            className="btn btn-blue"
                            type="submit"
                        >
                            <span>SAVE</span>
                        </Button>
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
    )

    render() {
        return (
            <div className={"app-popup app-popup-show"}>
                <div className="padding-top-20px" />
                <div className="popup-content background-white border-radius">
                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="popup-title">
                                {this.props.type === "create"
                                    ? "Employee Detail - Formal Education - Create Form"
                                    : this.props.type === "update"
                                        ? "Employee Detail - Formal Education - Edit Form"
                                        : "Employee Detail - Formal Education - View Form"}
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button
                                type="button"
                                className="btn btn-circle btn-grey"
                                onClick={this.props.onClickClose}
                            >
                                <i className="fa fa-lg fa-times" />
                            </button>
                        </div>
                    </div>
                    <form action="#"
                        onSubmit={(e) => {
                            e.preventDefault()
                            if (this.state.level === 'EDULVL-001' || this.state.level === 'EDULVL-002') {
                                let data = this.state.employeeDataFormEdu
                                data = {
                                    ...data,
                                    formalEducationDepartment: '',
                                    formalEducationDegree: '',
                                    formalEducationDegreePosition: '',
                                    formalEducationIPK: ''
                                }
                                if (!R.isEmpty(this.state.employeeDataFormEdu.formalEducationStartDate) && !R.isEmpty(this.state.employeeDataFormEdu.formalEducationEndDate) && (this.state.employeeDataFormEdu.formalEducationEndDate < this.state.employeeDataFormEdu.formalEducationStartDate)) return alert('End Date Should be Greater Than Start Date.')
                                if (R.isEmpty(this.state.employeeDataFormEdu.formalEducationInstitute) || R.isEmpty(this.state.employeeDataFormEdu.formalEducationInstitute.instituteID)) return alert('Institution is Required.')
                                if (R.isEmpty(this.state.employeeDataFormEdu.formalEducationStartDate) || R.isEmpty(this.state.employeeDataFormEdu.formalEducationEndDate)) return alert('Date is Required.')
                                if (R.isEmpty(this.state.employeeDataFormEdu.formalEducationType) || R.isEmpty(this.state.employeeDataFormEdu.formalEducationType.bizparKey)) return alert('Education Type is Required.')
                                return this.props.onClickSave(data)
                            }
                            if (this.state.level === 'EDULVL-003' || this.state.level === 'EDULVL-004') {
                                let data = this.state.employeeDataFormEdu
                                data = {
                                    ...data,
                                    formalEducationDegree: '',
                                    formalEducationDegreePosition: '',
                                    formalEducationIPK: ''
                                }
                                if (!R.isEmpty(this.state.employeeDataFormEdu.formalEducationStartDate) && !R.isEmpty(this.state.employeeDataFormEdu.formalEducationEndDate) && (this.state.employeeDataFormEdu.formalEducationEndDate < this.state.employeeDataFormEdu.formalEducationStartDate)) return alert('End Date Should be Greater Than Start Date.')
                                if (R.isEmpty(this.state.employeeDataFormEdu.formalEducationInstitute) || R.isEmpty(this.state.employeeDataFormEdu.formalEducationInstitute.instituteID)) return alert('Institution is Required.')
                                if (R.isEmpty(this.state.employeeDataFormEdu.formalEducationDepartment) || R.isEmpty(this.state.employeeDataFormEdu.formalEducationDepartment.bizparKey)) return alert('Major is Required.')
                                if (R.isEmpty(this.state.employeeDataFormEdu.formalEducationStartDate) || R.isEmpty(this.state.employeeDataFormEdu.formalEducationEndDate)) return alert('Date is Required.')
                                if (R.isEmpty(this.state.employeeDataFormEdu.formalEducationType) || R.isEmpty(this.state.employeeDataFormEdu.formalEducationType.bizparKey)) return alert('Education Type is Required.')
                                return this.props.onClickSave(data)
                            }
                            if (!R.isEmpty(this.state.employeeDataFormEdu.formalEducationStartDate) && !R.isEmpty(this.state.employeeDataFormEdu.formalEducationEndDate) && (this.state.employeeDataFormEdu.formalEducationEndDate < this.state.employeeDataFormEdu.formalEducationStartDate)) return alert('End Date Should be Greater Than Start Date.')
                            if (R.isEmpty(this.state.employeeDataFormEdu.formalEducationStartDate) || R.isEmpty(this.state.employeeDataFormEdu.formalEducationEndDate)) return alert('Date is Required.')
                            if (R.isEmpty(this.state.employeeDataFormEdu.formalEducationType) || R.isEmpty(this.state.employeeDataFormEdu.formalEducationType.bizparKey)) return alert('Education Type is Required.')
                            if (R.isEmpty(this.state.employeeDataFormEdu.formalEducationLevel) || R.isEmpty(this.state.employeeDataFormEdu.formalEducationLevel.bizparKey)) return alert('Education Level is Required.')
                            if (R.isEmpty(this.state.employeeDataFormEdu.formalEducationInstitute) || R.isEmpty(this.state.employeeDataFormEdu.formalEducationInstitute.instituteID)) return alert('Institution is Required.')
                            if (R.isEmpty(this.state.employeeDataFormEdu.formalEducationDepartment) || R.isEmpty(this.state.employeeDataFormEdu.formalEducationDepartment.bizparKey)) return alert('Major is Required.')
                            this.props.onClickSave(this.state.employeeDataFormEdu)
                        }}>
                        {this.renderForm()}
                        {this.renderFooter()}
                    </form>
                </div>
                <div className="padding-bottom-20px" />
            </div>
        )
    }
}
export default FormFormalEdu