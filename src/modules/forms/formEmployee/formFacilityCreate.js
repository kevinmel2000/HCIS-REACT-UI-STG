import React, { Component } from 'react'
import M from 'moment'
import * as R from 'ramda'
import DropDown from '../../../modules/popup/DropDown'
import CalendarPicker from '../../../modules/popup/Calendar'
import { Rabbit as Button } from 'react-button-loaders'

const defaultPayload = {
    "employeeFacilityID": '',
    "facilityQuantity": '',
    "facilityDate": '',
    "facilityNotes": '',
    "isFacilityReturn": false,
    "facilityReturnDate": '',
    "facilityCategory": '',
    "facilityType": '',
}

class formFacilityCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            facilityData: this.props.facilityData ? {
                ...this.props.facilityData,
                facilityDate: R.isNil(this.props.facilityData.facilityDate) || R.isEmpty(this.props.facilityData.facilityDate) ? '' : M(this.props.facilityData.facilityDate, 'DD-MM-YYYY').format('YYYY-MM-DD')
            } : {
                    ...defaultPayload,
                    employeeFacilityID: 'EMF-' + M()
                }
        }
    }

    handleSelectDate = (date) => {
        this.setState({
            facilityData: {
                ...this.state.facilityData,
                facilityDate: M(date).format("YYYY-MM-DD")
            }
        })
    }

    render() {
        let {
            facilityQuantity,
            facilityDate,
            facilityNotes,
            isFacilityReturn,
            facilityCategory,
            facilityType
        } = this.state.facilityData
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px" />
                <div className="popup-content-small background-white border-radius">
                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="popup-title">
                                {this.props.type === "create"
                                    ? "Employee Detail - Facilities - Create Form"
                                    : this.props.type === "update"
                                        ? "Employee Detail - Facilities - Edit Form"
                                        : "Employee Detail - Facilities - View Form"}
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
                            if (R.isEmpty(this.state.facilityData.facilityType) || R.isEmpty(this.state.facilityData.facilityType.bizparKey)) {
                                return alert('Facility Type is Required.')
                            }
                            if (R.isEmpty(this.state.facilityData.facilityCategory) || R.isEmpty(this.state.facilityData.facilityCategory.bizparKey)) {
                                return alert('Facility Category is Required.')
                            }
                            else
                                this.props.onClickSave(this.state.facilityData)
                        }}>
                        <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-15px">
                            <div className="coloumn-1">
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Facilities Type <span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                    </div>
                                    <DropDown
                                        title="-- please select facilities type --"
                                        onChange={(e) => this.setState({
                                            facilityData: {
                                                ...this.state.facilityData,
                                                facilityType: {
                                                    ...this.state.facilityData.facilityType,
                                                    bizparKey: e
                                                }
                                            }
                                        })}
                                        type="bizpar"
                                        disabled={this.props.type !== "create" ? true : false}
                                        data={this.props.bizparFacilityType}
                                        value={facilityType.bizparKey} />
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Facilities Category <span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                    </div>
                                    <DropDown
                                        title="-- please select facilities category --"
                                        onChange={(e) => this.setState({
                                            facilityData: {
                                                ...this.state.facilityData,
                                                facilityCategory: {
                                                    ...this.state.facilityData.facilityCategory,
                                                    bizparKey: e
                                                }
                                            }
                                        })}
                                        type="bizpar"
                                        disabled={this.props.type !== "create" ? true : false}
                                        data={this.props.bizparFacilityCategory}
                                        value={facilityCategory.bizparKey} />
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Quantity</h4>
                                        </div>
                                    </div>
                                    <input
                                        readOnly={this.props.type === "view" ? true : false}
                                        style={this.props.type === "view" ? { backgroundColor: "#E6E6E6" } : null}
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                        value={facilityQuantity}
                                        onChange={(e) => {
                                            if (isNaN(e.target.value)) return true
                                            this.setState({
                                                facilityData: {
                                                    ...this.state.facilityData,
                                                    facilityQuantity: e.target.value
                                                }
                                            })
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="coloumn-2">
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Facilities Date</h4>
                                        </div>
                                    </div>
                                    <CalendarPicker disabled={this.props.type === "view" ? true : false} date={facilityDate} onChange={(e) => {
                                        this.handleSelectDate(e)
                                    }} />
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Information</h4>
                                        </div>
                                    </div>
                                    <input
                                        readOnly={this.props.type === "view" ? true : false}
                                        style={this.props.type === "view" ? { backgroundColor: "#E6E6E6" } : null}
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                        value={facilityNotes}
                                        onChange={(e) => this.setState({
                                            facilityData: {
                                                ...this.state.facilityData,
                                                facilityNotes: e.target.value
                                            }
                                        })}
                                    />
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Return Status</h4>
                                        </div>
                                    </div>
                                    <div className="margin-15px">
                                        <label className="radio">
                                            <input
                                                type="checkbox"
                                                onChange={(e) => this.setState({
                                                    facilityData: {
                                                        ...this.state.facilityData,
                                                        isFacilityReturn: e.target.checked
                                                    }
                                                })}
                                                disabled={this.props.type === "view"}
                                                checked={isFacilityReturn} />
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

export default formFacilityCreate;
