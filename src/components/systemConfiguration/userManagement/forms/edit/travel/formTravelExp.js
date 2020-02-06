import React, { Component } from 'react'
import DropDown from '../../../../../../modules/popup/DropDown'
import M from 'moment'
import * as R from 'ramda'
import { connect } from 'react-redux'

const defaultPayload = {
    "corporateTravelExpenseID": "",
    "travelType": "",
    "travelCategory": "",
    "tripType": "",
    "corporateTravelExpenseDetails": [],
    "corporateTravelExpenseStatus": true,
    "corporateTravelExpenseCreational": {
        "createdBy": "SYSTEM",
        "createdDate": M().format("DD-MM-YYYY HH:mm:ss"),
        "modifiedBy": null,
        "modifiedDate": null
    },
    "esid": "",
    "ouid": ""
}

class FormTravelExp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            auth: props.auth,
            payloadTravel: props.travelData ? {
                ...props.travelData,
                corporateTravelExpenseStatus: props.travelData.corporateTravelExpenseStatus === "ACTIVE" ? true : false
            } : {
                    ...defaultPayload,
                    corporateTravelExpenseCreational: {
                        ...defaultPayload.corporateTravelExpenseCreational,
                        createdBy: this.props.auth.user.employeeID,
                        modifiedBy: this.props.auth.user.employeeID,
                    }
                }
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.type === "update") {
            if (this.props.travelData !== prevProps.travelData) {
                this.setState({ payloadTravel: { ...this.props.travelData, corporateTravelExpenseStatus: this.props.travelData.corporateTravelExpenseStatus === "ACTIVE" ? true : false } })
            }
        }
    }

    renderFormCreate = () => {
        let { bizparCorporateLevel, bizparSppdCostCategory, bizparSppdTripType, bizparSppdType, bizparCorporatePosition } = this.props
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px" />
                <div className="popup-content background-white border-radius">

                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="popup-title">
                                Travel Expense Template - Create Form
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button
                                type="button"
                                className="btn btn-circle btn-grey"
                                onClick={() => this.props.onClickClose("create", true)}>
                                <i className="fa fa-lg fa-times" />
                            </button>
                        </div>
                    </div>

                    <form action="#" onSubmit={(e) => {
                        e.preventDefault()
                        if (R.isEmpty(this.state.payloadTravel.ouid)) return alert('Position is Required.')
                        if (R.isEmpty(this.state.payloadTravel.tripType) || R.isEmpty(this.state.payloadTravel.tripType.bizparKey)) return alert('Trip Type is Required.')
                        if (R.isEmpty(this.state.payloadTravel.travelType) || R.isEmpty(this.state.payloadTravel.travelType.bizparKey)) return alert('Travel Type is Required.')
                        if (R.isEmpty(this.state.payloadTravel.travelCategory) || R.isEmpty(this.state.payloadTravel.travelCategory.bizparKey)) return alert('Travel Category is Required.')
                        let payload = this.state.payloadTravel
                        payload = {
                            ...payload,
                            corporateTravelExpenseID: "CTE-" + M(),
                            travelCategory: payload.travelCategory.bizparKey,
                            travelType: payload.travelType.bizparKey,
                            tripType: payload.tripType.bizparKey,
                            corporateTravelExpenseStatus: payload.corporateTravelExpenseStatus === true ? "ACTIVE" : "INACTIVE",
                            esid: this.state.auth.user.companyID
                        }
                        console.log('payload travel exp', payload)
                        this.props.onClickSave(payload)
                    }}>
                        <div className="display-flex-normal">
                            <div style={{ width: '50%' }}>
                                <div className="padding-15px">
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Company <span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                        <div className="margin-5px">
                                            <div className="card-date-picker">
                                                <div className="double">
                                                    <input
                                                        type="text"
                                                        readOnly
                                                        style={{ backgroundColor: "#E6E6E6" }}
                                                        className="txt txt-sekunder-color"
                                                        value={this.state.auth.user.companyName}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Level</h4>
                                        </div>
                                        <div className="margin-5px">
                                            <DropDown
                                                title="-- please select level --"
                                                onChange={(e) => {
                                                    this.props.handleChange(e)
                                                }}
                                                data={bizparCorporateLevel}
                                                type="bizpar" />
                                        </div>
                                    </div>
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Position <span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                        <div className="margin-5px">
                                            <DropDown
                                                title="-- please select position --"
                                                onChange={(e) => this.setState({
                                                    payloadTravel: {
                                                        ...this.state.payloadTravel,
                                                        ouid: e
                                                    }
                                                })}
                                                travelExpPosition={bizparCorporatePosition}
                                                data={bizparCorporatePosition}
                                                type="bizpar" />
                                        </div>
                                    </div>
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Activation</h4>
                                        </div>
                                        <div className="margin-15px">
                                            <label className="radio">
                                                <input type="checkbox" name="all-day"
                                                    onChange={(e) => this.setState({
                                                        payloadTravel: {
                                                            ...this.state.payloadTravel,
                                                            corporateTravelExpenseStatus: e.target.checked
                                                        }
                                                    })}
                                                    checked={this.state.payloadTravel.corporateTravelExpenseStatus} />
                                                <span className="checkmark" />
                                                <span className="txt-site txt-11 txt-bold txt-main">
                                                    Activate Now
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ width: '50%' }}>
                                <div className="padding-15px">
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Trip Type <span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                        <div className="margin-5px">
                                            <DropDown
                                                title="-- please select trip type --"
                                                onChange={(e) => {
                                                    this.setState({
                                                        payloadTravel: {
                                                            ...this.state.payloadTravel,
                                                            tripType: {
                                                                ...this.state.payloadTravel.tripType,
                                                                bizparKey: e
                                                            }
                                                        }
                                                    })
                                                }}
                                                data={bizparSppdTripType}
                                                type="bizpar" />
                                        </div>
                                    </div>
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Travel Type <span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                        <div className="margin-5px">
                                            <DropDown
                                                title="-- please select travel type --"
                                                onChange={(e) => {
                                                    this.setState({
                                                        payloadTravel: {
                                                            ...this.state.payloadTravel,
                                                            travelType: {
                                                                ...this.state.payloadTravel.travelType,
                                                                bizparKey: e
                                                            }
                                                        }
                                                    })
                                                }}
                                                data={bizparSppdType}
                                                type="bizpar" />
                                        </div>
                                    </div>
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Travel Category <span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                        <div className="margin-5px">
                                            <DropDown
                                                title="-- please select travel category --"
                                                onChange={(e) => {
                                                    this.setState({
                                                        payloadTravel: {
                                                            ...this.state.payloadTravel,
                                                            travelCategory: {
                                                                ...this.state.payloadTravel.travelCategory,
                                                                bizparKey: e
                                                            }
                                                        }
                                                    })
                                                }}
                                                data={bizparSppdCostCategory}
                                                type="bizpar" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-bottom padding-15px content-right">
                            <button
                                className="btn btn-primary margin-right-10px"
                                type='button'
                                onClick={() => this.props.onClickClose("create", true)}>
                                BACK
                            </button>
                            <button className="btn btn-blue" type='submit'> SAVE </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

    renderFormEdit = () => {
        let { bizparCorporateLevel, bizparCorporatePosition, bizparSppdTripType, bizparSppdType, bizparSppdCostCategory } = this.props
        let { payloadTravel } = this.state
        return (
            <form action="#" onSubmit={(e) => {
                e.preventDefault()
                let payload = this.state.payloadTravel
                payload = {
                    ...payload,
                    travelCategory: payload.travelCategory.bizparKey,
                    travelType: payload.travelType.bizparKey,
                    tripType: payload.tripType.bizparKey,
                    corporateTravelExpenseStatus: payload.corporateTravelExpenseStatus === true ? "ACTIVE" : "INACTIVE",
                    ouid: !R.isNil(payloadTravel.ouid) ? payloadTravel.ouid.ouid : "",
                    esid: payload.esid.esid,
                    corporateTravelExpenseCreational: {
                        ...payload.corporateTravelExpenseCreational,
                        modifiedBy: "SYSTEM",
                        modifiedDate: M().format("DD-MM-YYYY HH:mm:ss")
                    }
                }
                if (R.isEmpty(payload.ouid) || R.isNil(payload.ouid)) return alert('Position is Required.')
                if (R.isEmpty(payload.tripType) || R.isNil(payload.tripType)) return alert('Trip Type is Required.')
                if (R.isEmpty(payload.travelType) || R.isNil(payload.travelType)) return alert('Travel Type is Required.')
                if (R.isEmpty(payload.travelCategory) || R.isNil(payload.travelCategory)) return alert('Travel Category is Required.')
                console.log('update travel exp', payload)
                this.props.onClickSave(payload)
            }}>
                <div>
                    <div className="margin-bottom-20px">
                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                            <h4>Company <span style={{ color: "red" }}>*</span></h4>
                        </div>
                        <div className="margin-5px">
                            <div className="card-date-picker">
                                <div className="double">
                                    <input
                                        type="text"
                                        readOnly
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        className="txt txt-sekunder-color"
                                        value={this.state.auth.user.companyName}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="margin-bottom-20px">
                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                            <h4>Level</h4>
                        </div>
                        <div className="margin-5px">
                            <DropDown
                                title="-- please select level --"
                                onChange={(e) => {
                                    this.props.handleChange(e)
                                }}
                                value={payloadTravel.ouid && payloadTravel.ouid.oulevel ? payloadTravel.ouid.oulevel.bizparKey : "-- pelase select level --"}
                                travelExp={payloadTravel.ouid && payloadTravel.ouid.oulevel ? payloadTravel.ouid.oulevel.bizparValue : "-- pelase select level --"}
                                data={bizparCorporateLevel}
                                type="bizpar" />
                        </div>
                    </div>
                    <div className="margin-bottom-20px">
                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                            <h4>Position <span style={{ color: "red" }}>*</span></h4>
                        </div>
                        <div className="margin-5px">
                            <DropDown
                                title="-- please select position --"
                                onChange={(e) => this.setState({
                                    payloadTravel: {
                                        ...this.state.payloadTravel,
                                        ouid: {
                                            ...this.state.payloadTravel.ouid,
                                            ouid: e
                                        }
                                    }
                                })}
                                value={payloadTravel.ouid ? payloadTravel.ouid.ouid : ""}
                                travelExpPosition={bizparCorporatePosition}
                                travelExpPositionEdit={this.props.travelDataPosition}
                                data={bizparCorporatePosition}
                                type="bizpar" />
                        </div>
                    </div>
                    <div className="margin-bottom-20px">
                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                            <h4>Trip Type <span style={{ color: "red" }}>*</span></h4>
                        </div>
                        <div className="margin-5px">
                            <DropDown
                                title="-- please select trip type --"
                                onChange={(e) => {
                                    this.setState({
                                        payloadTravel: {
                                            ...this.state.payloadTravel,
                                            tripType: {
                                                ...this.state.payloadTravel.tripType,
                                                bizparKey: e
                                            }
                                        }
                                    })
                                }}
                                data={bizparSppdTripType}
                                value={payloadTravel.tripType && payloadTravel.tripType.bizparKey}
                                travelExp={payloadTravel.tripType.bizparValue}
                                type="bizpar" />
                        </div>
                    </div>
                    <div className="margin-bottom-20px">
                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                            <h4>Travel Type <span style={{ color: "red" }}>*</span></h4>
                        </div>
                        <div className="margin-5px">
                            <DropDown
                                title="-- please select travel type --"
                                onChange={(e) => {
                                    this.setState({
                                        payloadTravel: {
                                            ...this.state.payloadTravel,
                                            travelType: {
                                                ...this.state.payloadTravel.travelType,
                                                bizparKey: e
                                            }
                                        }
                                    })
                                }}
                                data={bizparSppdType}
                                value={payloadTravel.travelType && payloadTravel.travelType.bizparKey}
                                travelExp={payloadTravel.travelType.bizparValue}
                                type="bizpar" />
                        </div>
                    </div>
                    <div className="margin-bottom-20px">
                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                            <h4>Travel Category <span style={{ color: "red" }}>*</span></h4>
                        </div>
                        <div className="margin-5px">
                            <DropDown
                                title="-- please select travel category --"
                                onChange={(e) => {
                                    this.setState({
                                        payloadTravel: {
                                            ...this.state.payloadTravel,
                                            travelCategory: {
                                                ...this.state.payloadTravel.travelCategory,
                                                bizparKey: e
                                            }
                                        }
                                    })
                                }}
                                data={bizparSppdCostCategory}
                                value={payloadTravel.travelCategory && payloadTravel.travelCategory.bizparKey}
                                travelExp={payloadTravel.travelCategory.bizparValue}
                                type="bizpar" />
                        </div>
                    </div>
                    <div className="margin-bottom-20px">
                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                            <h4>Activation</h4>
                        </div>
                        <div className="margin-15px">
                            <label className="radio">
                                <input type="checkbox" name="all-day"
                                    onChange={(e) => this.setState({
                                        payloadTravel: {
                                            ...this.state.payloadTravel,
                                            corporateTravelExpenseStatus: e.target.checked
                                        }
                                    })}
                                    checked={payloadTravel.corporateTravelExpenseStatus} />
                                <span className="checkmark" />
                                <span className="txt-site txt-11 txt-bold txt-main">
                                    Activate Now
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="border-bottom padding-15px content-right">
                    <button className="btn btn-blue" type='submit'> SAVE </button>
                </div>
            </form>
        )
    }

    render() {
        let { type } = this.props
        return (
            <div>
                {type === "create" ? this.renderFormCreate() : this.renderFormEdit()}
            </div >
        )
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    };
};

export default connect(mapStateToProps, null)(FormTravelExp)