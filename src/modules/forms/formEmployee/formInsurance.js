import React, { Component } from 'react'
import * as R from 'ramda'
import DropDown from '../../../modules/popup/DropDown'
import { Rabbit as Button } from 'react-button-loaders'

const defaultPayload = {
    "employeeInsuranceID": '',
    "insuranceCardNumber": '',
    "insuranceCardHolderName": '',
    "isInsuranceActive": '',
    "insuranceCategory": '',
    "insuranceType": '',
    "insuranceFaskesClass": '',
    "insuranceFaskesType": '',
}

class formInsurance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            insuranceData: this.props.insuranceData ? this.props.insuranceData : defaultPayload,
            kesehatanStateVisible: false
        }
    }

    handleCardNumber = (e) => {
        if (isNaN(e.target.value)) return true
        this.setState({
            insuranceData: {
                ...this.state.insuranceData,
                insuranceCardNumber: e.target.value
            }
        })
    }

    render() {
        let {
            insuranceCardNumber,
            insuranceCardHolderName,
            isInsuranceActive,
            insuranceCategory,
            insuranceType,
            insuranceFaskesClass,
            insuranceFaskesType
        } = this.state.insuranceData
        let kesehatanStateVisible = this.state.kesehatanStateVisible
        if (insuranceCategory.bizparKey === "INSUR-001-INSCAT-001") {
            kesehatanStateVisible = true
        } else { kesehatanStateVisible = false }
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px" />
                <div className="popup-content-small background-white border-radius">
                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="popup-title">
                                {this.props.type === "create"
                                    ? "Employee Detail - Insurance/BPJS - Create Form"
                                    : this.props.type === "update"
                                        ? "Employee Detail - Insurance/BPJS - Edit Form"
                                        : "Employee Detail - Insurance/BPJS - View Form"}
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
                    <form action="#"
                        onSubmit={(e) => {
                            e.preventDefault()
                            if (R.isEmpty(this.state.insuranceData.insuranceType) || R.isEmpty(this.state.insuranceData.insuranceType.bizparKey)) {
                                return alert('Insurance Type is Required.')
                            }
                            if (R.isEmpty(this.state.insuranceData.insuranceCategory) || R.isEmpty(this.state.insuranceData.insuranceCategory.bizparKey)) {
                                return alert('Insurance Category is Required.')
                            }
                            else
                                this.props.onClickSave(this.state.insuranceData)
                        }
                        }
                    >
                        <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-15px">
                            <div className="coloumn-1">
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Insurance type <span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                    </div>
                                    <DropDown
                                        title="-- please select insurance --"
                                        onChange={(dt) => this.setState({
                                            insuranceData: {
                                                ...this.state.insuranceData,
                                                insuranceType: {
                                                    ...this.state.insuranceData.insuranceType,
                                                    bizparKey: dt
                                                }
                                            }
                                        })}
                                        type="bizpar"
                                        disabled={this.props.type === "view" ? true : false}
                                        data={this.props.bizparInsuranceType}
                                        value={insuranceType.bizparKey} />
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Insurance Category <span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                    </div>
                                    <DropDown
                                        title="-- please select insurance category--"
                                        onChange={(dt) => this.setState({
                                            insuranceData: {
                                                ...this.state.insuranceData,
                                                insuranceCategory: {
                                                    ...this.state.insuranceData.insuranceCategory,
                                                    bizparKey: dt
                                                }
                                            }
                                        })}
                                        type="bizpar"
                                        disabled={this.props.type === "view" ? true : false}
                                        data={this.props.bizparInsuranceCategory}
                                        value={insuranceCategory.bizparKey} />
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Card Number <span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                    </div>
                                    <input
                                        readOnly={this.props.type === "view" ? true : false}
                                        style={this.props.type === "view" ? { backgroundColor: "#E6E6E6" } : null}
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                        required
                                        value={insuranceCardNumber}
                                        onChange={this.handleCardNumber.bind(this)}
                                    />
                                </div>
                                {kesehatanStateVisible && (
                                    <div className="margin-bottom-20px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>Health Faskes</h4>
                                            </div>
                                        </div>
                                        <DropDown
                                            title="-- please select insurance category--"
                                            onChange={(dt) => this.setState({
                                                insuranceData: {
                                                    ...this.state.insuranceData,
                                                    insuranceFaskesType: {
                                                        ...this.state.insuranceData.insuranceFaskesType,
                                                        bizparKey: dt
                                                    }
                                                }
                                            })}
                                            type="bizpar"
                                            disabled={this.props.type === "view" ? true : false}
                                            data={this.props.bizparFamilyFaskes}
                                            value={insuranceFaskesType.bizparKey} />
                                    </div>
                                )}
                            </div>
                            <div className="coloumn-2">
                                {kesehatanStateVisible && (
                                    <div className="margin-bottom-20px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>Faskes Type</h4>
                                            </div>
                                        </div>
                                        <DropDown
                                            title="-- please select insurance category--"
                                            onChange={(dt) => this.setState({
                                                insuranceData: {
                                                    ...this.state.insuranceData,
                                                    insuranceFaskesClass: {
                                                        ...this.state.insuranceData.insuranceFaskesClass,
                                                        bizparKey: dt
                                                    }
                                                }
                                            })}
                                            type="bizpar"
                                            disabled={this.props.type === "view" ? true : false}
                                            data={this.props.bizparFamilyFaskesClass}
                                            value={insuranceFaskesClass.bizparKey} />
                                    </div>
                                )}
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Participant Number</h4>
                                        </div>
                                    </div>
                                    <input
                                        readOnly={this.props.type === "view" ? true : false}
                                        style={this.props.type === "view" ? { backgroundColor: "#E6E6E6" } : null}
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                        value={insuranceCardHolderName}
                                        onChange={(e) => {
                                            if (isNaN(e.target.value)) return true
                                            this.setState({
                                                insuranceData: {
                                                    ...this.state.insuranceData,
                                                    insuranceCardHolderName: e.target.value
                                                }
                                            })
                                        }}
                                    />
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Status</h4>
                                        </div>
                                    </div>
                                    <div className="margin-15px">
                                        <label className="radio">
                                            <input type="checkbox"
                                                checked={isInsuranceActive} disabled={this.props.type === "view"}
                                                onChange={(e) => this.setState({
                                                    insuranceData: {
                                                        ...this.state.insuranceData,
                                                        isInsuranceActive: e.target.checked
                                                    }
                                                })} />
                                            <span className="checkmark" />
                                            <div className="txt-site txt-11 txt-bold txt-main">
                                                <h4>Active</h4>
                                            </div>
                                        </label>
                                    </div>
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
                    </form>
                </div>
                <div className="padding-bottom-20px" />
            </div>
        );
    }
}

export default formInsurance;