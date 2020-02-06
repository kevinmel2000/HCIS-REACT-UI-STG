import React, { Component } from 'react'
import DropDown from '../../../../../../modules/popup/DropDown'
import M from 'moment'
import { connect } from 'react-redux'
import * as R from 'ramda'

const defaultPayload = {
    "corporateLeaveID": "",
    "leaveDuration": "",
    "isAllGender": true,
    "isAllReligion": true,
    "leaveType": "",
    "leaveCategory": "",
    "leaveGender": "",
    "leaveReligion": "",
    "esID": "",
    "corporateLeaveTypeStatus": "ACTIVE",
    "corporateLeaveTypeCreationalDTO": {
        "createdBy": "SYSTEM",
        "createdDate": M().format("DD-MM-YYYY HH:mm:ss"),
        "modifiedBy": null,
        "modifiedDate": null
    }
}

class FormCreateCorporateLeaveTypes extends Component {
    constructor(props) {
        super(props)
        this.state = {
            leaveType: {
                ...defaultPayload,
                esID: props.auth.user.companyID,
                corporateLeaveTypeCreationalDTO: {
                    ...defaultPayload.corporateLeaveTypeCreationalDTO,
                    createdBy: props.auth.user.employeeID,
                    modifiedBy: props.auth.user.employeeID,
                }
            },
            genderVisible: false,
            religionVisible: false
        }
    }

    handleDuration = (e) => {
        if (isNaN(e.target.value)) return true
        this.setState({
            leaveType: {
                ...this.state.leaveType,
                leaveDuration: e.target.value
            }
        })
    }

    render() {
        let { leaveType } = this.state
        let { bizparLeaveType, bizparLeaveCategory, bizparGender, bizparReligion } = this.props
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px" />
                <div className="popup-content-small background-white border-radius">

                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="popup-title">
                                Leave Types - Create Form
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button
                                type="button"
                                className="btn btn-circle btn-grey"
                                onClick={this.props.onClickClose}>
                                <i className="fa fa-lg fa-times" />
                            </button>
                        </div>
                    </div>

                    <form action="#" onSubmit={(e) => {
                        e.preventDefault()
                        let payload = this.state.leaveType
                        payload = {
                            ...payload,
                            corporateLeaveID: "CORPLEATYP-" + M(),
                            leaveCategory: typeof payload.leaveCategory === "object" ? payload.leaveCategory.bizparKey : payload.leaveCategory,
                            leaveType: typeof payload.leaveType === "object" ? payload.leaveType.bizparKey : payload.leaveType,
                            leaveGender: typeof payload.leaveGender === "object" ? payload.leaveGender.bizparKey : payload.leaveGender,
                            leaveReligion: typeof payload.leaveReligion === "object" ? payload.leaveReligion.bizparKey : payload.leaveReligion
                        }
                        if (R.isEmpty(this.state.leaveType.leaveType)) return alert('Leave Type is Required.')
                        if (R.isEmpty(this.state.leaveType.leaveCategory)) return alert('Leave Category is Required.')
                        if (!this.state.leaveType.isAllGender && R.isEmpty(payload.leaveGender)) return alert('Gender is Required.')
                        if (!this.state.leaveType.isAllReligion && R.isEmpty(payload.leaveReligion)) return alert('Religion is Required.')
                        console.log('payload leave type', payload)
                        this.props.onClickSave(payload, "leave-type")
                    }}>
                        <div className="display-flex-normal">
                            <div style={{ width: '49.99%' }}>
                                <div className="padding-15px">
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Company <span style={{ color: 'red' }}>*</span></h4>
                                            {/* <i
                                                data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                                                className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i> */}
                                        </div>
                                        <div className="margin-5px">
                                            <div className="card-date-picker">
                                                <div className="double">
                                                    <input
                                                        readOnly
                                                        style={{ backgroundColor: "#E6E6E6" }}
                                                        type="text"
                                                        className="txt txt-sekunder-color"
                                                        value={leaveType.esID}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Leave Type <span style={{ color: 'red' }}>*</span></h4>
                                            {/* <i
                                                data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                                                className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i> */}
                                        </div>
                                        <div className="margin-5px">
                                            <DropDown
                                                title="-- please select leave type --"
                                                onChange={(e) => this.setState({
                                                    leaveType: {
                                                        ...leaveType,
                                                        leaveType: {
                                                            ...leaveType.leaveType,
                                                            bizparKey: e
                                                        }
                                                    }
                                                })}
                                                data={bizparLeaveType}
                                                type="bizpar" />
                                        </div>
                                    </div>
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Leave Category <span style={{ color: 'red' }}>*</span></h4>
                                            {/* <i
                                                data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                                                className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i> */}
                                        </div>
                                        <div className="margin-5px">
                                            <DropDown
                                                title="-- please select leave category --"
                                                onChange={(e) => this.setState({
                                                    leaveType: {
                                                        ...leaveType,
                                                        leaveCategory: {
                                                            ...leaveType.leaveCategory,
                                                            bizparKey: e
                                                        }
                                                    }
                                                })}
                                                data={bizparLeaveCategory}
                                                type="bizpar" />
                                        </div>
                                    </div>
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Duration <span style={{ color: 'red' }}>*</span></h4>
                                            {/* <i
                                                data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                                                className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i> */}
                                        </div>
                                        <div className="margin-5px">
                                            <div className="card-date-picker">
                                                <div className="double">
                                                    <input
                                                        type="text"
                                                        className="txt txt-sekunder-color"
                                                        placeholder=""
                                                        required
                                                        value={leaveType.leaveDuration}
                                                        onChange={this.handleDuration.bind(this)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ width: '49.99%' }}>
                                <div className="padding-15px">
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>All Gender <span style={{ color: 'red' }}>*</span></h4>
                                            {/* <i
                                                data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                                                className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i> */}
                                        </div>
                                        <div className="margin-15px">
                                            <label className="radio">
                                                <input type="checkbox"
                                                    checked={!this.state.genderVisible}
                                                    onChange={(e) => this.setState({
                                                        genderVisible: !this.state.genderVisible,
                                                        leaveType: {
                                                            ...leaveType,
                                                            isAllGender: e.target.checked,
                                                            leaveGender: this.state.genderVisible ? "" : leaveType.leaveGender
                                                        }
                                                    })} />
                                                <span className="checkmark" />
                                                <span className="txt-site txt-11 txt-bold txt-main">
                                                    Active
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                    {this.state.genderVisible && (
                                        <div className="margin-bottom-20px">
                                            <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                                <h4>Gender</h4>
                                                {/* <i
                                                    data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                                                    className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i> */}
                                            </div>
                                            <div className="margin-15px">
                                                <DropDown
                                                    title="-- please select gender type --"
                                                    onChange={(e) => this.setState({
                                                        leaveType: {
                                                            ...leaveType,
                                                            leaveGender: {
                                                                ...leaveType.leaveGender,
                                                                bizparKey: e
                                                            }
                                                        }
                                                    })}
                                                    data={bizparGender}
                                                    type="bizpar" />
                                            </div>
                                        </div>
                                    )}
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>All Religion <span style={{ color: 'red' }}>*</span></h4>
                                            {/* <i
                                                data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                                                className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i> */}
                                        </div>
                                        <div className="margin-15px">
                                            <label className="radio">
                                                <input type="checkbox"
                                                    checked={!this.state.religionVisible}
                                                    onChange={(e) => this.setState({
                                                        religionVisible: !this.state.religionVisible,
                                                        leaveType: {
                                                            ...leaveType,
                                                            isAllReligion: e.target.checked,
                                                            leaveReligion: this.state.religionVisible ? "" : leaveType.leaveReligion
                                                        }
                                                    })} />
                                                <span className="checkmark" />
                                                <span className="txt-site txt-11 txt-bold txt-main">
                                                    Active
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                    {this.state.religionVisible && (
                                        <div className="margin-bottom-20px">
                                            <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                                <h4>Religion</h4>
                                                {/* <i
                                                    data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                                                    className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i> */}
                                            </div>
                                            <div className="margin-5px">
                                                <DropDown
                                                    title="-- please select religion type --"
                                                    onChange={(e) => this.setState({
                                                        leaveType: {
                                                            ...leaveType,
                                                            leaveReligion: {
                                                                ...leaveType.leaveReligion,
                                                                bizparKey: e
                                                            }
                                                        }
                                                    })}
                                                    data={bizparReligion}
                                                    type="bizpar" />
                                            </div>
                                        </div>
                                    )}
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Activation</h4>
                                            {/* <i
                                                data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                                                className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i> */}
                                        </div>
                                        <div className="margin-5px">
                                            <label className="radio">
                                                <input type="checkbox"
                                                    checked
                                                    disabled />
                                                <span className="checkmark" />
                                                <span className="txt-site txt-11 txt-bold txt-main">
                                                    Active
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-top padding-15px content-right">
                            <button
                                type="button"
                                onClick={this.props.onClickClose}
                                className="btn btn-primary margin-right-10px">
                                BACK
                             </button>
                            <button className="btn btn-blue" type='submit'> SAVE </button>
                        </div>
                    </form>

                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    };
};

export default connect(mapStateToProps, null)(FormCreateCorporateLeaveTypes)