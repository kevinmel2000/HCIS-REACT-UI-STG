import React, { Component } from 'react'
import ReactTooltip from 'react-tooltip'
import M from 'moment'
import * as R from 'ramda'
import CalendarPicker from '../../../../../../modules/popup/Calendar'

const defaultPayload = {
    "corporateOvertimeID": "",
    "corporateOvertimeName": "",
    "corporateOvertimeMaxValue": "",
    "corporateOvertimeStartDate": "",
    "corporateOvertimeEndDate": "",
    "corporateOvertimeNotes": "",
    "company": "",
    "corporateOvertimeStatus": "ACTIVE",
    "corporateOvertimeCreational": {
        "createdBy": "SYSTEM",
        "createdDate": M().format("DD-MM-YYYY HH:mm:ss"),
        "modifiedBy": null,
        "modifiedDate": null
    }
}

class formOvertimeCreate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            payloadOvertime: props.payload ? {
                ...props.payload,
                corporateOvertimeStartDate: M(props.payload.corporateOvertimeStartDate, "DD-MM-YYYY").format("YYYY-MM-DD"),
                corporateOvertimeEndDate: M(props.payload.corporateOvertimeEndDate, "DD-MM-YYYY").format("YYYY-MM-DD")
            } : {
                    ...defaultPayload,
                    corporateOvertimeID: "CORPOVERTYP-" + M(),
                    company: this.props.auth,
                    corporateOvertimeCreational: {
                        ...defaultPayload.corporateOvertimeCreational,
                        createdBy: this.props.loginEmployeeID,
                        modifiedBy: this.props.loginEmployeeID,
                    }
                }
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.type === "update") {
            if (this.props.payload !== prevProps.payload) {
                this.setState({
                    payloadOvertime: {
                        ...this.props.payload,
                        corporateOvertimeStartDate: M(this.props.payload.corporateOvertimeStartDate, "DD-MM-YYYY").format("YYYY-MM-DD"),
                        corporateOvertimeEndDate: M(this.props.payload.corporateOvertimeEndDate, "DD-MM-YYYY").format("YYYY-MM-DD")
                    }
                })
            }
        }
    }

    renderCreate = () => {
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px" />
                <div className="popup-content-small background-white border-radius">

                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="popup-title">
                                Overtime Template - Create Form
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
                        if (R.isEmpty(this.state.payloadOvertime.corporateOvertimeStartDate)) return alert("Start Date is Required.")
                        if (R.isEmpty(this.state.payloadOvertime.corporateOvertimeEndDate)) return alert("End Date is Required.")
                        if (!R.isEmpty(this.state.payloadOvertime.corporateOvertimeStartDate) && !R.isEmpty(this.state.payloadOvertime.corporateOvertimeEndDate) && (this.state.payloadOvertime.corporateOvertimeEndDate < this.state.payloadOvertime.corporateOvertimeStartDate)) return alert("End Date Should be Greater Than Start Date.")
                        this.props.onClickSave(this.state.payloadOvertime)
                    }}>
                        <div className="display-flex-normal">
                            <div style={{ width: '49.9%' }}>
                                <div className="padding-15px">
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>ES_ID</h4>
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
                                                        value={this.state.payloadOvertime.company}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Overtime Code</h4>
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
                                                        value={this.state.payloadOvertime.corporateOvertimeID}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Overtime Type <span style={{ color: 'red' }}>*</span></h4>
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
                                                        placeholder="Overtime Type"
                                                        required
                                                        onChange={(e) => this.setState({
                                                            payloadOvertime: {
                                                                ...this.state.payloadOvertime,
                                                                corporateOvertimeName: e.target.value
                                                            }
                                                        })}
                                                        value={this.state.payloadOvertime.corporateOvertimeName}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ width: '49.9%' }}>
                                <div className="padding-15px">
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Start Date <span style={{ color: 'red' }}>*</span></h4>
                                            {/* <i
                                                data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                                                className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i> */}
                                        </div>
                                        <CalendarPicker
                                            date={this.state.payloadOvertime.corporateOvertimeStartDate}
                                            onChange={(e) => this.setState({
                                                payloadOvertime: {
                                                    ...this.state.payloadOvertime,
                                                    corporateOvertimeStartDate: e
                                                }
                                            })}
                                        />
                                    </div>
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>End Date <span style={{ color: 'red' }}>*</span></h4>
                                            {/* <i
                                                data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                                                className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i> */}
                                        </div>
                                        <CalendarPicker
                                            date={this.state.payloadOvertime.corporateOvertimeEndDate}
                                            onChange={(e) => this.setState({
                                                payloadOvertime: {
                                                    ...this.state.payloadOvertime,
                                                    corporateOvertimeEndDate: e
                                                }
                                            })}
                                        />
                                    </div>
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Value (Hour) <span style={{ color: 'red' }}>*</span></h4>
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
                                                        onChange={(e) => {
                                                            if (isNaN(e.target.value)) return true
                                                            this.setState({
                                                                payloadOvertime: {
                                                                    ...this.state.payloadOvertime,
                                                                    corporateOvertimeMaxValue: e.target.value
                                                                }
                                                            })
                                                        }}
                                                        value={this.state.payloadOvertime.corporateOvertimeMaxValue}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Activation</h4>
                                        </div>
                                        <div className="margin-15px">
                                            <label className="radio">
                                                <input type="checkbox" name="status" checked disabled />
                                                <span className="checkmark" />
                                                <span className="txt-site txt-11 txt-bold txt-main">
                                                    is Active
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
                            <button className="btn btn-blue" type='submit'> SUBMIT </button>
                        </div>
                    </form>

                </div>
            </div>
        )
    }

    renderEdit = () => {
        return (
            <div className="a-s-p-place active">
                <div className="a-s-p-top">
                    <div className="grid grid-2x">
                        <div className="col-1">
                            <div className="display-flex-normal margin-top-10px">
                                <i className="fa fa-1x fa-clock"></i>
                                <span className="txt-site txt-11 txt-main margin-left-10px">
                                    Overtime
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
                    <form action="#" onSubmit={(e) => {
                        e.preventDefault()
                        if (!R.isEmpty(this.state.payloadOvertime.corporateOvertimeStartDate) && !R.isEmpty(this.state.payloadOvertime.corporateOvertimeEndDate) && (M(this.state.payloadOvertime.corporateOvertimeEndDate).format("YYYY-MM-DD") < M(this.state.payloadOvertime.corporateOvertimeStartDate).format("YYYY-MM-DD"))) return alert("End Date Should be Greater Than Start Date.")
                        this.props.onClickSave(this.state.payloadOvertime)
                    }}>
                        <div className="display-flex-normals margin-bottom-10px">
                            <div className="padding-top-15px padding-bottom-15px">
                                <div className="margin-bottom-20px">
                                    <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                        <h4>ES_ID</h4>
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
                                                    value={this.state.payloadOvertime.company.esID}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                        <h4>Overtime Code</h4>
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
                                                    value={this.state.payloadOvertime.corporateOvertimeID}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                        <h4>Overtime Type <span style={{ color: 'red' }}>*</span></h4>
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
                                                    readOnly
                                                    style={{ backgroundColor: "#E6E6E6" }}
                                                    value={this.state.payloadOvertime.corporateOvertimeName}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                        <h4>Start Date <span style={{ color: 'red' }}>*</span></h4>
                                        {/* <i
                                            data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                                            className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i> */}
                                    </div>
                                    <CalendarPicker
                                        date={this.state.payloadOvertime.corporateOvertimeStartDate}
                                        onChange={(e) => this.setState({
                                            payloadOvertime: {
                                                ...this.state.payloadOvertime,
                                                corporateOvertimeStartDate: e
                                            }
                                        })}
                                    />
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                        <h4>End Date <span style={{ color: 'red' }}>*</span></h4>
                                        {/* <i
                                            data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                                            className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i> */}
                                    </div>
                                    <CalendarPicker
                                        date={this.state.payloadOvertime.corporateOvertimeEndDate}
                                        onChange={(e) => this.setState({
                                            payloadOvertime: {
                                                ...this.state.payloadOvertime,
                                                corporateOvertimeEndDate: e
                                            }
                                        })}
                                    />
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                        <h4>Value (Hour) <span style={{ color: 'red' }}>*</span></h4>
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
                                                    onChange={(e) => {
                                                        if (isNaN(e.target.value)) return true
                                                        this.setState({
                                                            payloadOvertime: {
                                                                ...this.state.payloadOvertime,
                                                                corporateOvertimeMaxValue: e.target.value
                                                            }
                                                        })
                                                    }}
                                                    value={this.state.payloadOvertime.corporateOvertimeMaxValue}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                        <h4>Activation</h4>
                                    </div>
                                    <div className="margin-15px">
                                        <label className="radio">
                                            <input type="checkbox" name="status" checked disabled />
                                            <span className="checkmark" />
                                            <span className="txt-site txt-11 txt-bold txt-main">
                                                is Active
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
                                            <button type="submit" className="btn btn-blue"> SUBMIT </button>
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

    render() {
        return (
            <div>
                {this.props.type === "create" ? this.renderCreate() : <div className="a-s-p-side"> {this.renderEdit()} </div>}
            </div>
        )
    }
}

export default formOvertimeCreate