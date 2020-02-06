import React, { Component } from 'react'
import M from 'moment'
import DropDown from '../../../../../../modules/popup/DropDown'
import NumberFormat from "react-number-format";
import * as R from "ramda";

const defaultPayload = {
    "governmentPolicyID": "",
    "governmentPolicyItem": "",
    "governmentPolicyType": "",
    "governmentPolicyStatus": true,
    "value": 0,
    "maxValue": 0,
    "years": 0,
}

class CreateTax extends Component {
    constructor(props) {
        super(props)
        let { bizparGovPolicyType, bizparInsuranceCat, bizparPTKP } = this.props
        this.state = {
            data: { ...defaultPayload, governmentPolicyID: 'STR-' + M() },
            bizparGovPolicyType,
            bizparInsuranceCat,
            bizparPTKP,
            visibleBPJS: false,
            visiblePTKP: false,

        }
    }

    save() {
        return console.log(this.state.data)
    }

    componentDidMount() {
        console.log(JSON.stringify(this.props.bizparGovPolicyType))
    }

    selectType(type) {
        if (type === 'GOV-002') {
            this.setState({ visibleBPJS: true, visiblePTKP: false })
        } else if (type === 'GOV-001') {
            this.setState({ visibleBPJS: false, visiblePTKP: true })
        }
    }

    render() {
        let { governmentPolicyID, governmentPolicyStatus, years } = this.state.data

        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px" />
                <div className="popup-content-mikro background-white border-radius">
                    <form action="#"
                        onSubmit={(e) => {
                            e.preventDefault()
                            console.log(this.state.data)
                            if (
                                R.isEmpty(this.state.data.governmentPolicyType) ||
                                R.isNil(this.state.data.governmentPolicyType) ||
                                R.isEmpty(
                                    this.state.data.governmentPolicyType.bizparKey
                                )
                            )
                                return alert("Template Type is Required");
                            if (
                                (R.isEmpty(this.state.data.governmentPolicyItem) && this.state.visibleBPJS === true) ||
                                (R.isNil(this.state.data.governmentPolicyItem) && this.state.visibleBPJS === true) ||
                                (R.isEmpty(
                                    this.state.data.governmentPolicyItem.bizparKey
                                ) && this.state.visibleBPJS === true)
                            )
                                return alert("BPJS Type is Required");
                            if (
                                (R.isEmpty(this.state.data.governmentPolicyItem) && this.state.visiblePTKP === true) ||
                                (R.isNil(this.state.data.governmentPolicyItem) && this.state.visiblePTKP === true) ||
                                (R.isEmpty(
                                    this.state.data.governmentPolicyItem.bizparKey
                                ) && this.state.visiblePTKP === true)
                            )
                                return alert("PTKP Type is Required");
                            if (
                                !R.isEmpty(this.state.data.value) &&
                                !R.isEmpty(this.state.data.maxValue) &&
                                (String(this.state.data.maxValue).replace(',','') <= String(this.state.data.value).replace(',',''))
                            )
                                return alert(
                                    "Max Value Should be Greater Than Value."
                                );
                            this.props.onClickSave(this.state.data)
                        }}>

                        <div className="popup-panel grid grid-2x">
                            <div className="col-1">
                                <div className="popup-title">
                                    {'Goverment Policy - Create Form'}
                                </div>
                            </div>
                            <div className="col-2 content-right">
                                <button
                                    className="btn btn-circle btn-grey"
                                    onClick={this.props.onClickClose}
                                >
                                    <i className="fa fa-lg fa-times" />
                                </button>
                            </div>
                        </div>

                        <div className="display-flex-normal">
                            <div className="padding-15px">
                                <div className="margin-bottom-20px">
                                    <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                        <h4>Goverment Policy ID</h4>
                                    </div>
                                    <div className="margin-5px">
                                        <div className="card-date-picker">
                                            <div className="double">
                                                <input
                                                    style={{ backgroundColor: "#E6E6E6", }}
                                                    type="text"
                                                    readOnly
                                                    className="txt txt-sekunder-color"
                                                    placeholder={governmentPolicyID}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                        <h4>Years <span style={{ color: 'red' }}>*</span></h4>
                                    </div>
                                    <div className="margin-5px">
                                        <div className="card-date-picker">
                                            <div className="double">
                                                <input
                                                    type="text"
                                                    required
                                                    className="txt txt-sekunder-color"
                                                    placeholder=""
                                                    value={years ? years : ""}
                                                    onChange={e => {
                                                     if (isNaN(e.target.value)) return true
                                                     this.setState({
                                                        data: {
                                                            ...this.state.data,
                                                            years: Number(e.target.value)
                                                        }
                                                    })
                                                }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                        <h4>Template Type <span style={{ color: 'red' }}>*</span></h4>
                                        {/* <i
                                                data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                                                className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i> */}
                                    </div>
                                    <div className="margin-5px">
                                        <DropDown
                                            title="-- please select template type --"
                                            onChange={(dt) => this.setState({
                                                data: {
                                                    ...this.state.data,
                                                    governmentPolicyType: dt,
                                                }
                                                // data: { ...this.state.data, orgStructureTPL : this.props.rawDataOrg[] }
                                            }, () => this.selectType(dt))}
                                            data={this.state.bizparGovPolicyType}
                                            type="bizpar" />
                                    </div>
                                </div>

                                {this.state.visibleBPJS && (
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>BPJS Type <span style={{ color: 'red' }}>*</span></h4>
                                        </div>
                                        <div className="margin-5px">
                                            <DropDown
                                                title="-- please select template type --"
                                                onChange={(dt) => this.setState({
                                                    data: {
                                                        ...this.state.data,
                                                        governmentPolicyItem: dt,
                                                    }
                                                }, console.log(dt))}
                                                data={this.state.bizparInsuranceCat}
                                                type="bizpar" />
                                        </div>
                                    </div>
                                )}

                                {this.state.visibleBPJS && (
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Min Value <span style={{ color: 'red' }}>*</span></h4>
                                        </div>
                                        <div className="margin-5px">
                                            <div className="card-date-picker">
                                                <div className="double">
                                                    <NumberFormat
                                                        thousandSeparator={true}
                                                        required
                                                        className="txt txt-sekunder-color"
                                                        placeholder=""
                                                        onChange={(e) => this.setState({
                                                            data: {
                                                                ...this.state.data,
                                                                value: e.target.value
                                                            }
                                                        })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.state.visibleBPJS && (
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Max Value <span style={{ color: 'red' }}>*</span></h4>
                                        </div>
                                        <div className="margin-5px">
                                            <div className="card-date-picker">
                                                <div className="double">
                                                    <NumberFormat
                                                        thousandSeparator={true}
                                                        required
                                                        className="txt txt-sekunder-color"
                                                        placeholder=""
                                                        onChange={(e) => this.setState({
                                                            data: {
                                                                ...this.state.data,
                                                                maxValue: e.target.value
                                                            }
                                                        })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {this.state.visiblePTKP && (
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>PTKP Type <span style={{color: 'red'}}>*</span></h4>
                                        </div>
                                        <div className="margin-5px">
                                            <DropDown
                                                title="-- please select template type --"
                                                onChange={(dt) => this.setState({
                                                    data: {
                                                        ...this.state.data,
                                                        governmentPolicyItem: dt,
                                                    }
                                                })}
                                                data={this.state.bizparPTKP}
                                                type="bizpar" />
                                        </div>
                                    </div>
                                )}

                                {this.state.visiblePTKP && (
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Value <span style={{ color: 'red' }}>*</span></h4>
                                        </div>
                                        <div className="margin-5px">
                                            <div className="card-date-picker">
                                                <div className="double">
                                                    <NumberFormat
                                                        thousandSeparator={true}
                                                        required
                                                        className="txt txt-sekunder-color"
                                                        placeholder=""
                                                        onChange={(e) => this.setState({
                                                            data: {
                                                                ...this.state.data,
                                                                value: e.target.value
                                                            }
                                                        })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="margin-bottom-20px">
                                    <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                        <h4>Activation</h4>
                                    </div>
                                    <div className="margin-15px">
                                        <label className="radio">
                                            <input type="checkbox" name="all-day" checked={governmentPolicyStatus} disabled
                                                onChange={(e) => this.setState({
                                                    data: {
                                                        ...this.state.data,
                                                        governmentPolicyStatus: e.target.checked
                                                    }
                                                })}
                                            />
                                            <span className="checkmark" />
                                            <span className="txt-site txt-11 txt-bold txt-main">
                                                Activate Now
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-bottom padding-15px content-right">
                            <button
                                className="btn btn-blue"
                                type='submit'
                            >
                                SAVE
                        </button>
                        </div>
                    </form>
                </div>
                <div className="padding-bottom-20px" />
            </div>
        )
    }
}
export default CreateTax