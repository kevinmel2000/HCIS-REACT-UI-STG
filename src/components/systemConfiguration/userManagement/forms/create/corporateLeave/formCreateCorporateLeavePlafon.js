import React, { Component } from 'react'
import { connect } from 'react-redux'
import DropDown from '../../../../../../modules/popup/DropDown'
import M from 'moment'
import * as R from 'ramda'

const defaultPayload = {
    "corporateLeavePlafonID": "",
    "leavePlafon": 0,
    "esID": "",
    "ouID": "",
    "corporateLeavePlafonStatus": "ACTIVE",
    "corporateLeavePlafonCreationalDTO": {
        "createdBy": "SYSTEM",
        "createdDate": M().format("DD-MM-YYYY HH:mm:ss"),
        "modifiedBy": null,
        "modifiedDate": null
    }
}

class FormCreateCorporateLeavePlafon extends Component {
    constructor(props) {
        super(props)
        this.state = {
            leavePlafon: {
                ...defaultPayload,
                corporateLeavePlafonCreationalDTO: {
                    ...defaultPayload.corporateLeavePlafonCreationalDTO,
                    createdBy: this.props.auth.user.employeeID,
                    modifiedBy: this.props.auth.user.employeeID,
                }
            }
        }
    }

    handlePlafon = (e) => {
        if (isNaN(e.target.value)) return true
        this.setState({
            leavePlafon: {
                ...this.state.leavePlafon,
                leavePlafon: e.target.value
            }
        })
    }

    render() {
        let { leavePlafon } = this.state
        let { bizparCorporateLevel, bizparCorporatePosition, auth } = this.props
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px" />
                <div className="popup-content-small background-white border-radius">

                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="popup-title">
                                Leave Plafon - Create Form
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
                        let payload = this.state.leavePlafon
                        payload = {
                            ...payload,
                            corporateLeavePlafonID: "CORPLEAPLAF-" + M(),
                            esID: this.props.auth.user.companyID,
                            ouID: payload.ouID
                        }
                        if (R.isEmpty(this.state.leavePlafon.ouID)) return alert('Position is Required.')
                        if (this.state.leavePlafon.leavePlafon === 0) return alert('Plafon is Required')
                        console.log('payload leave plafon', payload)
                        this.props.onClickSave(payload, "leave-plafon")
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
                                                        placeholder=""
                                                        value={auth.user.companyID}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Level</h4>
                                            {/* <i
                                                data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                                                className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i> */}
                                        </div>
                                        <div className="margin-5px">
                                            <DropDown
                                                title="-- please select level type --"
                                                onChange={(e) => {
                                                    this.props.handleChange(e)
                                                }}
                                                data={bizparCorporateLevel}
                                                type="bizpar" />
                                        </div>
                                    </div>
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Position <span style={{ color: 'red' }}>*</span></h4>
                                            {/* <i
                                                data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                                                className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i> */}
                                        </div>
                                        <div className="margin-5px">
                                            <DropDown
                                                title="-- please select position type --"
                                                onChange={(e) => this.setState({
                                                    leavePlafon: {
                                                        ...leavePlafon,
                                                        ouID: e
                                                    }
                                                })}
                                                travelExpPosition={bizparCorporatePosition}
                                                data={bizparCorporatePosition}
                                                type="bizpar" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ width: '49.99%' }}>
                                <div className="padding-15px">
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Plafon <span style={{ color: 'red' }}>*</span></h4>
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
                                                        onChange={this.handlePlafon.bind(this)}
                                                        value={leavePlafon.leavePlafon}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Activation</h4>
                                            {/* <i
                                                data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                                                className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i> */}
                                        </div>
                                        <div className="margin-15px">
                                            <label className="radio">
                                                <input type="checkbox" disabled checked />
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
            </div >
        )
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    };
};

export default connect(mapStateToProps, null)(FormCreateCorporateLeavePlafon)