import React, { Component } from 'react'
import ReactTooltip from 'react-tooltip'
import DropDown from '../../../../../../modules/popup/DropDown'
import * as R from 'ramda'
import M from 'moment'
import NumberFormat from 'react-number-format'

const defaulPayloadDetail = {
    "cnbdetaiID": "",
    "cnbdetailNotes": "",
    "cnbtype": "",
    "cnbvalue": "",
    "cnbcomponent": "",
    "cnbvalueType": ""
}

class formCnbDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            payloadCnbDetail: props.payloadCnb ? {
                "cnbdetaiID": props.payloadCnb.cNBDetaiID,
                "cnbdetailNotes": props.payloadCnb.cNBDetailNotes,
                "cnbtype": props.payloadCnb.cNBType,
                "cnbvalue": props.payloadCnb.cNBValue,
                "cnbcomponent": props.payloadCnb.cNBComponent,
                "cnbvalueType": props.payloadCnb.cNBValueType
            } : defaulPayloadDetail
        }
    }

    render() {
        let { payloadCnbDetail } = this.state
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px" />
                <div className="popup-content-mikro background-white border-radius">

                    <div className="popup-panel grid grid-2x">
                        <div className="col-1" style={{ width: "140%" }}>
                            <div className="popup-title">
                                CNB Template Detail - {this.props.type === "create" ? "Create Form" : "Edit Form"}
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
                        let payloadCnbDetail = this.state.payloadCnbDetail
                        payloadCnbDetail = {
                            ...payloadCnbDetail,
                            cnbcomponent: typeof payloadCnbDetail.cnbcomponent === "object" && !R.isNil(payloadCnbDetail.cnbcomponent.bizparKey) ? payloadCnbDetail.cnbcomponent.bizparKey : payloadCnbDetail.cnbcomponent,
                            cnbvalueType: typeof payloadCnbDetail.cnbvalueType === "object" && !R.isNil(payloadCnbDetail.cnbvalueType.bizparKey) ? payloadCnbDetail.cnbvalueType.bizparKey : payloadCnbDetail.cnbvalueType,
                            cnbvalue:(!R.isEmpty(payloadCnbDetail.cnbvalue) || !R.isNil(payloadCnbDetail.cnbvalue)) ? String(payloadCnbDetail.cnbvalue).split(",").join("") : payloadCnbDetail.cnbvalue,
                            cnbdetaiID: !R.isEmpty(payloadCnbDetail.cnbdetaiID) ? payloadCnbDetail.cnbdetaiID : 'CNBCOM-' + M()
                        }
                        if (R.isEmpty(payloadCnbDetail.cnbtype)) return alert('CNB Type is Required.')
                        if (R.isEmpty(payloadCnbDetail.cnbcomponent)) return alert('CNB Component is Required.')
                        if (R.isEmpty(payloadCnbDetail.cnbvalueType)) return alert('CNB Value Type is Required.')
                        this.props.onClickSave(payloadCnbDetail, this.props.type === 'create' ? 'create-detail' : 'update-detail')
                    }}>
                        <div>
                            <div className="padding-15px">
                                <div className="margin-bottom-20px">
                                    <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                        <h4>CNB Type <span style={{ color: "red" }}>*</span></h4>
                                    </div>
                                    <div className="margin-5px">
                                        <DropDown
                                            title="-- please select cnb type --"
                                            onChange={(dt) => this.setState({
                                                payloadCnbDetail: {
                                                    ...payloadCnbDetail,
                                                    cnbtype: dt
                                                }
                                            })}
                                            data={[
                                                { id: '1', bizparValue: 'COMPENSATION', bizparKey: 'COMPENSATION' },
                                                { id: '2', bizparValue: 'BENEFIT', bizparKey: 'BENEFIT' }
                                            ]}
                                            type="bizpar"
                                            value={payloadCnbDetail.cnbtype} />
                                    </div>
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                        <h4>CNB Component <span style={{ color: "red" }}>*</span></h4>
                                    </div>
                                    <div className="margin-5px">
                                        <DropDown
                                            title="-- please select cnb component --"
                                            onChange={(dt) => this.setState({
                                                payloadCnbDetail: {
                                                    ...payloadCnbDetail,
                                                    cnbcomponent: {
                                                        ...payloadCnbDetail.cnbcomponent,
                                                        bizparKey: dt
                                                    }
                                                }
                                            })}
                                            type="bizpar"
                                            data={this.props.bizparCompensationType}
                                            value={payloadCnbDetail.cnbcomponent ? payloadCnbDetail.cnbcomponent.bizparKey : payloadCnbDetail.cnbcomponent} />
                                    </div>
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                        <h4>CNB Value Type <span style={{ color: "red" }}>*</span></h4>
                                    </div>
                                    <div className="margin-5px">
                                        <DropDown
                                            title="-- please select cnb value type --"
                                            onChange={(dt) => this.setState({
                                                payloadCnbDetail: {
                                                    ...payloadCnbDetail,
                                                    cnbvalueType: {
                                                        ...payloadCnbDetail.cnbvalueType,
                                                        bizparKey: dt
                                                    }
                                                }
                                            })}
                                            type="bizpar"
                                            data={this.props.bizparPayrollTplComponentType}
                                            value={payloadCnbDetail.cnbvalueType ? payloadCnbDetail.cnbvalueType.bizparKey : payloadCnbDetail.cnbvalueType} />
                                    </div>
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                        <h4>CNB Value <span style={{ color: "red" }}>*</span> (Nominal)</h4>
                                    </div>
                                    <div className="margin-5px">
                                        <div className="card-date-picker">
                                            <div className="double">
                                                <NumberFormat
                                                    className="txt txt-sekunder-color"
                                                    required
                                                    thousandSeparator={true}
                                                    value={payloadCnbDetail.cnbvalue}
                                                    onValueChange={(e) => {
                                                        this.setState({
                                                            payloadCnbDetail: {
                                                                ...payloadCnbDetail,
                                                                cnbvalue: e.formattedValue
                                                            }
                                                        })
                                                    }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                        <h4>Activation <span style={{ color: "red" }}>*</span></h4>
                                    </div>
                                    <div className="margin-15px">
                                        <label className="radio">
                                            <input type="checkbox" checked disabled />
                                            <span className="checkmark" />
                                            <span className="txt-site txt-11 txt-bold txt-main">
                                                Activate
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="border-top padding-15px content-right">
                                <button type="submit" className="btn btn-blue"> SAVE </button>
                            </div>
                        </div>

                        <ReactTooltip />

                    </form>

                </div>
                <div className="padding-bottom-20px" />
            </div>
        )
    }
}

export default formCnbDetail