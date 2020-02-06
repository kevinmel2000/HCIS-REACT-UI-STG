import React, { Component } from 'react'
import ReactTooltip from 'react-tooltip'
import DropDown from '../../../../../../modules/popup/DropDown'
import * as R from 'ramda'
import M from 'moment'

class FormEditCorporateLeaveTypes extends Component {
    constructor(props) {
        super(props)
        this.state = {
            leaveType: props.leaveType,
            genderVisible: false,
            religionVisible: false
        }
    }

    componentWillMount() {
        let { isAllGender, isAllReligion } = this.state.leaveType
        if (!isAllGender) this.setState({ genderVisible: true })
        if (!isAllReligion) this.setState({ religionVisible: true })
    }

    componentDidUpdate(prevProps) {
        if (this.props.leaveType !== prevProps.leaveType) {
            let { isAllGender, isAllReligion } = this.props.leaveType
            if (!isAllGender) {
                this.setState({ genderVisible: true })
            } else {
                this.setState({ genderVisible: false })
            }

            if (!isAllReligion) {
                this.setState({ religionVisible: true })
            } else {
                this.setState({ religionVisible: false })
            }

            this.setState({ leaveType: this.props.leaveType })
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
            <div className="a-s-p-place active">
                <div className="a-s-p-top">
                    <div className="grid grid-2x">
                        <div className="col-1">
                            <div className="display-flex-normal margin-top-10px">
                                <i className="fa fa-1x fa-sign-out-alt"></i>
                                <span className="txt-site txt-11 txt-main margin-left-10px">
                                    Leave Types
								</span>
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button
                                onClick={this.props.closeSlide}
                                className="btn btn-circle btn-grey">
                                <i className="fa fa-lg fa-arrow-right" />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="a-s-p-mid a-s-p-pad border-top">
                    {/* <div className="padding-top-20px margin-bottom-20px display-flex-normal">
                        <i className="fa fa-lg fa-sign-out-alt margin-right-10px margin-top-5px"></i>
                        <h1 className="txt-site txt-18 txt-main ">Payroll Template Detail</h1>
                    </div> */}
                    <form action="#" onSubmit={(e) => {
                        e.preventDefault()
                        let payload = this.state.leaveType
                        payload = {
                            ...payload,
                            leaveType: !R.isNil(payload.leaveType.bizparKey) ? payload.leaveType.bizparKey : payload.leaveType,
                            leaveCategory: !R.isNil(payload.leaveCategory.bizparKey) ? payload.leaveCategory.bizparKey : payload.leaveCategory,
                            leaveGender: typeof payload.leaveGender === "object" && !R.isNil(payload.leaveGender.bizparKey) ? payload.leaveGender.bizparKey : "",
                            leaveReligion: typeof payload.leaveReligion === "object" && !R.isNil(payload.leaveReligion.bizparKey) ? payload.leaveReligion.bizparKey : "",
                            esID: payload.esID.esid,
                            corporateLeaveTypeCreationalDTO: {
                                ...payload.corporateLeaveTypeCreationalDTO,
                                modifiedBy: "SYSTEM",
                                modifiedDate: M().format("DD-MM-YYYY HH:mm:ss")
                            }
                        }

                        if (R.isEmpty(payload.leaveType)) return alert('Leave Type is Required.')
                        if (R.isEmpty(payload.leaveCategory)) return alert('Leave Category is Required.')
                        if (!payload.isAllGender && R.isEmpty(payload.leaveGender)) return alert('Gender is Required.')
                        if (!payload.isAllReligion && R.isEmpty(payload.leaveReligion)) return alert('Religion is Required.')
                        console.log('update leave type', payload)
                        this.props.onClickUpdate(payload, "update-type")
                    }}>
                        <div className="display-flex-normals margin-bottom-10px">
                            <div className="padding-top-15px padding-bottom-15px">
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
                                                    placeholder=""
                                                    value={leaveType.esID.esid}
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
                                            title="-- please select type --"
                                            onChange={(e) => this.setState({
                                                leaveType: {
                                                    ...leaveType,
                                                    leaveType: {
                                                        ...leaveType.leaveType,
                                                        bizparKey: e
                                                    }
                                                }
                                            })}
                                            value={leaveType.leaveType ? leaveType.leaveType.bizparKey : ""}
                                            data={bizparLeaveType}
                                            leaveType={leaveType.leaveType.bizparValue}
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
                                            title="-- please select type --"
                                            onChange={(e) => this.setState({
                                                leaveType: {
                                                    ...leaveType,
                                                    leaveCategory: {
                                                        ...leaveType.leaveCategory,
                                                        bizparKey: e
                                                    }
                                                }
                                            })}
                                            value={leaveType.leaveCategory ? leaveType.leaveCategory.bizparKey : ""}
                                            data={bizparLeaveCategory}
                                            leaveType={leaveType.leaveCategory.bizparValue}
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
                                                    onChange={this.handleDuration.bind(this)}
                                                    value={leaveType.leaveDuration}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
                                                checked={leaveType.isAllGender}
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
                                        <div className="margin-5px">
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
                                                value={leaveType.leaveGender ? leaveType.leaveGender.bizparKey : ""}
                                                data={bizparGender}
                                                leaveType={leaveType.leaveGender.bizparValue}
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
                                                checked={leaveType.isAllReligion}
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
                                                value={leaveType.leaveReligion ? leaveType.leaveReligion.bizparKey : ""}
                                                data={bizparReligion}
                                                leaveType={leaveType.leaveReligion.bizparValue}
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
                                    <div className="margin-15px">
                                        <label className="radio">
                                            <input type="checkbox" checked disabled />
                                            <span className="checkmark" />
                                            <span className="txt-site txt-11 txt-bold txt-main">
                                                Active
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                <div className="border-top padding-top-20px">
                                    <div className="grid grid-2x">
                                        <div className="col-1 content-left">
                                            <button
                                                type="button"
                                                onClick={this.props.closeSlide}
                                                className="btn btn-primary margin-right-10px">
                                                BACK
                                            </button>
                                        </div>
                                        <div className="col-2 content-right">
                                            <button type="submit" className="btn btn-blue"> SAVE </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div >

                <ReactTooltip />

            </div >
        )

    }
}

export default FormEditCorporateLeaveTypes