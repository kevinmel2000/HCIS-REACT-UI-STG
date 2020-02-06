import React, { Component } from "react";
import M from 'moment';
import * as R from 'ramda'
import DropDown from '../../../modules/popup/DropDown'
import CalendarPicker from '../../../modules/popup/Calendar'
import { Rabbit as Button } from 'react-button-loaders'

const defaultPayloadInfromEdu = {
    "employeeInformalEducationID": "",
    "informalEducationCity": "",
    "informalEducationContactPerson": "",
    "informalEducationCostSource": "",
    "informalEducationEndDate": "",
    "informalEducationGeneration": "",
    "informalEducationInstituteName": "",
    "informalEducationName": "",
    "informalEducationNotes": "",
    "informalEducationStartDate": "",
    "informalEducationTelpNumber": "",
    "informalEducationTrainingType": "",
    "informalEducationCertificateNumber": "",
    "informalEducationCertificateDate": ""
}

class formInformalEdu extends Component {
    constructor(props) {
        super(props);
        let { employeeDataInformEdu, bizparTrainingType, bizparCostType } = this.props;

        this.state = {
            employeeDataInformEdu: employeeDataInformEdu ? {
                ...employeeDataInformEdu,
                informalEducationStartDate: M(employeeDataInformEdu.informalEducationStartDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
                informalEducationEndDate: M(employeeDataInformEdu.informalEducationEndDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
                informalEducationCertificateDate: R.isEmpty(employeeDataInformEdu.informalEducationCertificateDate) || R.isNil(employeeDataInformEdu.informalEducationCertificateDate) ? '' : M(employeeDataInformEdu.informalEducationCertificateDate, 'DD-MM-YYYY').format('YYYY-MM-DD')
            } : defaultPayloadInfromEdu,
            bizparTrainingType, bizparCostType,
            certificateStateVisible: false,
            dataGeneration: [
                { id: '1', bizparKey: '1', bizparValue: '1' },
                { id: '2', bizparKey: '2', bizparValue: '2' },
                { id: '3', bizparKey: '3', bizparValue: '3' },
                { id: '4', bizparKey: '4', bizparValue: '4' }
            ]
        };
    }

    handlePhoneNumber = (e) => {
        if (isNaN(e.target.value)) return true
        this.setState({
            employeeDataInformEdu: {
                ...this.state.employeeDataInformEdu,
                informalEducationTelpNumber: e.target.value
            }
        })
    }

    handleChange(e) {
        this.setState({
            certificateStateVisible: e.target.value === "TRATYP-002" ? true : false,
            employeeDataInformEdu: {
                ...this.state.employeeDataInformEdu,
                informalEducationTrainingType: {
                    ...this.state.employeeDataInformEdu.informalEducationTrainingType,
                    bizparKey: e.target.value
                }
            }
        });
    }

    renderForm = () => (
        <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-20px">
            <div className="column-1">
                {this.props.type !== "create" ? (
                    <div className="margin-bottom-20px">
                        <div className="margin-5px">
                            <div className="txt-site txt-11 txt-main txt-bold">
                                <h4>Informal Education Number</h4>
                            </div>
                        </div>
                        <input
                            readOnly
                            style={{ backgroundColor: "#E6E6E6" }}
                            type="text"
                            className="txt txt-sekunder-color"
                            placeholder=""
                            required
                            value={
                                this.state.employeeDataInformEdu && this.state.employeeDataInformEdu.employeeInformalEducationID
                            }
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
                            date={this.state.employeeDataInformEdu && this.state.employeeDataInformEdu.informalEducationStartDate}
                            onChange={(e) => this.setState({
                                employeeDataInformEdu: {
                                    ...this.state.employeeDataInformEdu,
                                    informalEducationStartDate: M(e).format('YYYY-MM-DD')
                                }
                            })} />
                        <div className="txt-site txt-11 txt-primary txt-center margin-10px margin-left-10px margin-right-10px">
                            To
										</div>
                        <CalendarPicker
                            disabled={this.props.type === "view" ? true : false}
                            date={this.state.employeeDataInformEdu && this.state.employeeDataInformEdu.informalEducationEndDate}
                            onChange={(e) => this.setState({
                                employeeDataInformEdu: {
                                    ...this.state.employeeDataInformEdu,
                                    informalEducationEndDate: M(e).format('YYYY-MM-DD')
                                }
                            })} />
                    </div>
                </div>

                <div className="margin-bottom-20px">
                    <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>Training Type <span style={{ color: "red" }}>*</span></h4>
                        </div>
                    </div>
                    <DropDown
                        title="-- please select training type --"
                        onChange={(dt) => this.setState({
                            employeeDataInformEdu: {
                                ...this.state.employeeDataInformEdu,
                                informalEducationTrainingType: {
                                    ...this.state.employeeDataInformEdu.informalEducationTrainingType,
                                    bizparKey: dt
                                }
                            },
                            certificateStateVisible: dt === "TRATYP-002" ? true : false
                        })
                        }
                        type="bizpar"
                        disabled={this.props.type === "view" ? true : false}
                        data={this.props.bizparTrainingType}
                        value={this.state.employeeDataInformEdu.informalEducationTrainingType && this.state.employeeDataInformEdu.informalEducationTrainingType.bizparKey} />
                </div>

                <div className="margin-bottom-20px">
                    <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>Training Name <span style={{ color: "red" }}>*</span></h4>
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
                        value={
                            this.state.employeeDataInformEdu && this.state.employeeDataInformEdu.informalEducationName
                        }
                        onChange={(e) => this.setState({
                            employeeDataInformEdu: {
                                ...this.state.employeeDataInformEdu,
                                informalEducationName: e.target.value
                            }
                        })}
                    />
                </div>

                <div className="margin-bottom-20px">
                    <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>Generation</h4>
                        </div>
                    </div>
                    <DropDown
                        title="-- please select education generation --"
                        onChange={(dt) => this.setState({
                            employeeDataInformEdu: {
                                ...this.state.employeeDataInformEdu,
                                informalEducationGeneration: dt
                            }
                        })}
                        disabled={this.props.type === "view" ? true : false}
                        data={this.state.dataGeneration}
                        type="bizpar"
                        value={this.state.employeeDataInformEdu && String(this.state.employeeDataInformEdu.informalEducationGeneration)} />
                </div>

                {this.state.certificateStateVisible && (
                    <div className="margin-bottom-20px">
                        <div className="margin-5px">
                            <div className="txt-site txt-11 txt-main txt-bold">
                                <h4>Certificate Number <span style={{ color: "red" }}>*</span></h4>
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
                            value={
                                this.state.employeeDataInformEdu && this.state.employeeDataInformEdu.informalEducationCertificateNumber
                            }
                            onChange={(e) => this.setState({
                                employeeDataInformEdu: {
                                    ...this.state.employeeDataInformEdu,
                                    informalEducationCertificateNumber: e.target.value
                                }
                            })}
                        />
                    </div>
                )}

                {this.state.certificateStateVisible && (
                    <div className="margin-bottom-20px">
                        <div className="margin-5px">
                            <div className="txt-site txt-11 txt-main txt-bold">
                                <h4>Date of Certificate <span style={{ color: "red" }}>*</span></h4>
                            </div>
                        </div>
                        <CalendarPicker
                            disabled={this.props.type === "view" ? true : false}
                            date={this.state.employeeDataInformEdu && this.state.employeeDataInformEdu.informalEducationCertificateDate}
                            onChange={(e) => this.setState({
                                employeeDataInformEdu: {
                                    ...this.state.employeeDataInformEdu,
                                    informalEducationCertificateDate: e
                                }
                            })} />
                    </div>
                )}

                {this.state.certificateStateVisible && (
                    <div className="margin-bottom-20px">
                        <div className="margin-5px">
                            <div className="txt-site txt-11 txt-main txt-bold">
                                <h4>Cost of Education <span style={{ color: "red" }}>*</span></h4>
                            </div>
                        </div>
                        <DropDown
                            title="-- please select cost type --"
                            onChange={(dt) => this.setState({
                                employeeDataInformEdu: {
                                    ...this.state.employeeDataInformEdu,
                                    informalEducationCostSource: {
                                        ...this.state.employeeDataInformEdu.informalEducationCostSource,
                                        bizparKey: dt
                                    }
                                }
                            })
                            }
                            type="bizpar"
                            disabled={this.props.type === "view" ? true : false}
                            data={this.props.bizparCostType}
                            value={this.state.employeeDataInformEdu.informalEducationCostSource && this.state.employeeDataInformEdu.informalEducationCostSource.bizparKey} />
                    </div>
                )}
                {!this.state.certificateStateVisible && (
                    <div className="margin-bottom-20px">
                        <div className="margin-5px">
                            <div className="txt-site txt-11 txt-main txt-bold">
                                <h4>Institution Name</h4>
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
                            value={
                                this.state.employeeDataInformEdu && this.state.employeeDataInformEdu.informalEducationInstituteName
                            }
                            onChange={(e) => this.setState({
                                employeeDataInformEdu: {
                                    ...this.state.employeeDataInformEdu,
                                    informalEducationInstituteName: e.target.value
                                }
                            })}
                        />
                    </div>
                )}
            </div>

            <div className="column-2">
                {this.state.certificateStateVisible && (
                    <div className="margin-bottom-20px">
                        <div className="margin-5px">
                            <div className="txt-site txt-11 txt-main txt-bold">
                                <h4>Institution Name</h4>
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
                            value={
                                this.state.employeeDataInformEdu && this.state.employeeDataInformEdu.informalEducationInstituteName
                            }
                            onChange={(e) => this.setState({
                                employeeDataInformEdu: {
                                    ...this.state.employeeDataInformEdu,
                                    informalEducationInstituteName: e.target.value
                                }
                            })}
                        />
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
                        value={
                            this.state.employeeDataInformEdu && this.state.employeeDataInformEdu.informalEducationCity
                        }
                        onChange={(e) => this.setState({
                            employeeDataInformEdu: {
                                ...this.state.employeeDataInformEdu,
                                informalEducationCity: e.target.value
                            }
                        })}
                    />
                </div>

                <div className="margin-bottom-20px">
                    <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>Contact Person</h4>
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
                        value={
                            this.state.employeeDataInformEdu && this.state.employeeDataInformEdu.informalEducationContactPerson
                        }
                        onChange={(e) => this.setState({
                            employeeDataInformEdu: {
                                ...this.state.employeeDataInformEdu,
                                informalEducationContactPerson: e.target.value
                            }
                        })}
                    />
                </div>

                <div className="margin-bottom-20px">
                    <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>Phone Number</h4>
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
                        value={
                            this.state.employeeDataInformEdu && this.state.employeeDataInformEdu.informalEducationTelpNumber
                        }
                        onChange={this.handlePhoneNumber.bind(this)}
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
                        value={
                            this.state.employeeDataInformEdu && this.state.employeeDataInformEdu.informalEducationNotes
                        }
                        onChange={(e) => this.setState({
                            employeeDataInformEdu: {
                                ...this.state.employeeDataInformEdu,
                                informalEducationNotes: e.target.value
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
        const trainingType = this.state.employeeDataInformEdu.informalEducationTrainingType.bizparKey
        if (trainingType === "TRATYP-002") {
            this.state.certificateStateVisible = true
        }
        return (
            <div className={"app-popup app-popup-show"}>
                <div className="padding-top-20px" />
                <div className="popup-content background-white border-radius">
                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="popup-title">
                                    {this.props.type === "create"
                                        ? "Employee Detail - Informal Education - Create Form"
                                        : this.props.type === "update"
                                            ? "Employee Detail - Informal Education - Edit Form"
                                            : "Employee Detail - Informal Education - View Form"}
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
                            if (!R.isEmpty(this.state.employeeDataInformEdu.informalEducationStartDate) && !R.isEmpty(this.state.employeeDataInformEdu.informalEducationEndDate) && (this.state.employeeDataInformEdu.informalEducationEndDate < this.state.employeeDataInformEdu.informalEducationStartDate)) return alert('End Date Should be Greater Than Start Date.')
                            if (R.isEmpty(this.state.employeeDataInformEdu.informalEducationStartDate) || R.isEmpty(this.state.employeeDataInformEdu.informalEducationEndDate)) return alert('Date is Required.')
                            if (R.isEmpty(this.state.employeeDataInformEdu.informalEducationTrainingType) || R.isEmpty(this.state.employeeDataInformEdu.informalEducationTrainingType.bizparKey)) {
                                return alert('Training Type is Required.')
                            }
                            if (this.state.employeeDataInformEdu.informalEducationTrainingType.bizparKey === "TRATYP-002") {
                                if (R.isEmpty(this.state.employeeDataInformEdu.informalEducationCertificateDate)) return alert('Date of Certificate is Required.')
                                if (
                                    R.isNil(this.state.employeeDataInformEdu.informalEducationCostSource) || R.isNil(this.state.employeeDataInformEdu.informalEducationCostSource.bizparKey) ||
                                    R.isEmpty(this.state.employeeDataInformEdu.informalEducationCostSource) || R.isEmpty(this.state.employeeDataInformEdu.informalEducationCostSource.bizparKey)) {
                                    return alert('Cost of Education is Required.')
                                }
                                this.props.onClickSave(this.state.employeeDataInformEdu)
                            }

                            else
                                this.props.onClickSave(this.state.employeeDataInformEdu)
                        }}
                    >
                        {this.renderForm()}
                        {this.renderFooter()}
                    </form>
                </div>
                <div className="padding-bottom-20px" />
            </div>
        );
    }
}

export default formInformalEdu