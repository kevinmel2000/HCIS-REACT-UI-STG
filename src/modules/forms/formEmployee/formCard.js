import React, { Component } from 'react'
import M from 'moment'
import * as R from 'ramda'
import DropDown from '../../../modules/popup/DropDown'
import CalendarPicker from '../../../modules/popup/Calendar'
import { Rabbit as Button } from 'react-button-loaders'

const payloadCardDefault = {
    "employeeLicenseID": "",
    "employeeLicenseType": "",
    "employeeLicenseNumber": "",
    "employeeLicenseStartDate": "",
    "employeeLicenseEndDate": "",
    "employeeLicenseNotes": ""
}

class FormCard extends Component {
    constructor(props) {
        super(props)
        let { payloadLincense, bizparLicense } = this.props
        this.state = {
            payloadLincense: payloadLincense ? {
                ...payloadLincense,
                employeeLicenseStartDate: M(
                    payloadLincense.employeeLicenseStartDate,
                    'DD-MM-YYYY'
                ).format('YYYY-MM-DD'),
                employeeLicenseEndDate: M(
                    payloadLincense.employeeLicenseEndDate,
                    'DD-MM-YYYY'
                ).format('YYYY-MM-DD')
            }
                : payloadCardDefault,
            bizparLicense,
            placeDate: false,
            placeDateEx: false
        }
    }

    handleCardNumber = (e) => {
        if (isNaN(e.target.value)) return true
        this.setState({
            ...this.state.payloadLincense,
            payloadLincense: {
                ...this.state.payloadLincense,
                employeeLicenseNumber: e.target.value
            }
        })
    }

    render() {
        return (
            <div className={'app-popup app-popup-show'}>
                <div className="padding-top-20px" />
                <div className="popup-content-small background-white border-radius">
                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="popup-title">
                                {this.props.type === "create"
                                    ? "Employee Detail – Card –  Create Form"
                                    : this.props.type === "edit"
                                        ? "Employee Detail – Card –  Edit Form"
                                        : "Employee Detail – Card –  View Form"}
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
                            if (!R.isEmpty(this.state.payloadLincense.employeeLicenseStartDate) && !R.isEmpty(this.state.payloadLincense.employeeLicenseEndDate) && (this.state.payloadLincense.employeeLicenseEndDate < this.state.payloadLincense.employeeLicenseStartDate)) return alert('Expired Date Should be Greater Than Renewal Date.')
                            if (R.isEmpty(this.state.payloadLincense.employeeLicenseType) || R.isEmpty(this.state.payloadLincense.employeeLicenseType.bizparKey)) {
                                return alert('Card Type is Required.')
                            }
                            if (R.isEmpty(this.state.payloadLincense.employeeLicenseStartDate)) {
                                return alert('Renewal Date is Required.')
                            }
                            if (R.isEmpty(this.state.payloadLincense.employeeLicenseEndDate)) {
                                return alert('Expired Date is Required.')
                            }
                            else
                                this.props.onClickSave(this.state.payloadLincense)
                        }}
                    >
                        <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-15px">
                            <div className="column-1">
                                {this.props.type !== "create" ? (
                                    <div className="margin-bottom-20px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>Number</h4>
                                            </div>
                                        </div>
                                        <input
                                            readOnly
                                            style={{ backgroundColor: "#E6E6E6" }}
                                            type="text"
                                            className="txt txt-sekunder-color"
                                            placeholder=""
                                            required
                                            value={this.state.payloadLincense.employeeLicenseID}
                                        />
                                    </div>
                                ) : null}

                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Card Type <span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                    </div>
                                    <DropDown
                                        title="-- please select card type --"
                                        onChange={(dt) => this.setState({
                                            payloadLincense: {
                                                ...this.state.payloadLincense,
                                                employeeLicenseType: {
                                                    ...this.state.payloadLincense.employeeLicenseType,
                                                    bizparKey: dt
                                                }
                                            }
                                        })}
                                        type="bizpar"
                                        disabled={this.props.type === "view" ? true : false}
                                        data={this.props.bizparLicense}
                                        value={this.state.payloadLincense.employeeLicenseType.bizparKey} />
                                </div>

                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Card Number <span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                    </div>
                                    <input
                                        onChange={this.handleCardNumber.bind(this)}
                                        value={this.state.payloadLincense.employeeLicenseNumber}
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
                                    />
                                </div>

                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Renewal Date <span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                    </div>
                                    <CalendarPicker
                                        date={this.state.payloadLincense.employeeLicenseStartDate}
                                        disabled={this.props.type === "view" ? true : false}
                                        onChange={(e) => this.setState({
                                            payloadLincense: {
                                                ...this.state.payloadLincense,
                                                employeeLicenseStartDate: M(e).format("YYYY-MM-DD")
                                            }
                                        })}
                                    />
                                </div>
                            </div>

                            <div className="column-2">
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Expired Date <span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                    </div>
                                    <CalendarPicker
                                        date={this.state.payloadLincense.employeeLicenseEndDate}
                                        disabled={this.props.type === "view" ? true : false}
                                        onChange={(e) => this.setState({
                                            payloadLincense: {
                                                ...this.state.payloadLincense,
                                                employeeLicenseEndDate: M(e).format("YYYY-MM-DD")
                                            }
                                        })}
                                    /> </div>

                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Information</h4>
                                        </div>
                                    </div>
                                    <textarea
                                        rows={5}
                                        onChange={(e) => this.setState({
                                            ...this.state.payloadLincense,
                                            payloadLincense: {
                                                ...this.state.payloadLincense,
                                                employeeLicenseNotes: e.target.value
                                            }
                                        })}
                                        value={this.state.payloadLincense.employeeLicenseNotes}
                                        readOnly={this.props.type === "view" ? true : false}
                                        style={
                                            this.props.type === "view"
                                                ? { backgroundColor: "#E6E6E6" }
                                                : null
                                        }
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="padding-15px">
                            <div className="grid grid-2x">
                                <div className="col-1" />
                                <div className="col-2 content-right">
                                    {this.props.type !== "view" ? (
                                        <Button
                                        state={this.props.sendState}
                                        style={{ position: 'absolute', padding: '0 14px', height: 40, borderRadius: 3, fontSize: 10, textAlign: 'center', width: 90, marginLeft: 165 }}
                                            className="btn btn-blue"
                                            type="sumbit"
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
                    </form>
                </div>
                <div className="padding-bottom-20px" />
            </div>
        )
    }
}

export default FormCard


