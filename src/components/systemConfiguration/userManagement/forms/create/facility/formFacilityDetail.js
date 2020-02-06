import React, { Component } from 'react'
import ReactTooltip from 'react-tooltip'
import DropDown from '../../../../../../modules/popup/DropDown'
import Api from '../../../../../../Services/Api'
import * as R from 'ramda'
import M from 'moment'

const defaultPayloadDetail = {
    "facilityCategory": "",
    "facilityDetailID": "",
    "facilityDetailNotes": "",
    "facilityDetailQty": "",
    "facilityType": ""
}

class formFacilityDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataFacilityDetail: props.payloadFacility ? {
                ...props.payloadFacility,
                facilityCategory: props.payloadFacility.facilitycategory 
             } : defaultPayloadDetail,
            bizparFacilityCategory: props.bizparFacilityCategory
        }
    }

    // componentWillMount() {
    //     if (this.props.type === "update") {
    //         this.getBizparByParent(this.state.dataFacilityDetail.facilityType.bizparKey)
    //     }

    // }

    async getBizparByParent(data) {
        let payload = {
            "params": {
                "bizparKey": data
            },
            "offset": 0,
            "limit": 5
        }
        let response = await Api.create("BIZPAR").getAllBizparByParentKey(payload)
        if (response.data && response.data.status === "S") {
            this.setState({ bizparFacilityCategory: response.data.data })
        } else {
            alert("Failed: " + response.data.message)
        }
    }

    render() {
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px" />
                <div className="popup-content-mikro background-white border-radius">

                    <div className="popup-panel grid grid-2x">
                        <div className="col-1" style={{ width: "140%"}}>
                            <div className="popup-title">
                                Facility Template Detail - {this.props.type === "create" ? "Create Form" : "Edit Form"}
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
                        let payloadDetail = this.state.dataFacilityDetail
                        payloadDetail = {
                            ...payloadDetail,
                            facilityType: typeof payloadDetail.facilityType === "object" && !R.isNil(payloadDetail.facilityType.bizparKey) ? payloadDetail.facilityType.bizparKey : payloadDetail.facilityType,
                            facilityCategory: typeof payloadDetail.facilityCategory === "object" && !R.isNil(payloadDetail.facilityCategory.bizparKey) ? payloadDetail.facilityCategory.bizparKey : payloadDetail.facilityCategory,
                            facilityDetailID: !R.isEmpty(payloadDetail.facilityDetailID) ? payloadDetail.facilityDetailID : 'FACDET-' + M()
                        }
                        if (R.isEmpty(payloadDetail.facilityType)) return alert('Facility Type is Required.')
                        if (R.isEmpty(payloadDetail.facilityCategory)) return alert('Facility Category is Required.')
                        this.props.onClickSave(payloadDetail, this.props.type === 'create' ? 'create-detail' : 'update-detail')
                    }}>
                        <div>
                            <div className="padding-15px">
                                <div className="margin-bottom-20px">
                                    <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                        <h4>Facility Type <span style={{ color: "red" }}>*</span></h4>
                                    </div>
                                    <div className="margin-5px">
                                        <DropDown
                                            title="-- please select facility type --"
                                            onChange={(dt) => {
                                                this.setState({
                                                    dataFacilityDetail: {
                                                        ...this.state.dataFacilityDetail,
                                                        facilityType: {
                                                            ...this.state.dataFacilityDetail.facilityType,
                                                            bizparKey: dt
                                                        }
                                                    }
                                                }, () => {
                                                    this.getBizparByParent(dt)
                                                })
                                            }}
                                            type="bizpar"
                                            data={this.props.bizparFacilityType} 
                                            value={this.state.dataFacilityDetail.facilityType ? this.state.dataFacilityDetail.facilityType.bizparKey : ""}/>
                                    </div>
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                        <h4>Facility Category <span style={{ color: "red" }}>*</span></h4>
                                    </div>
                                    <div className="margin-5px">
                                        <DropDown
                                            title="-- please select facility category --"
                                            onChange={(dt) => this.setState({
                                                dataFacilityDetail: {
                                                    ...this.state.dataFacilityDetail,
                                                    facilityCategory: {
                                                        ...this.state.dataFacilityDetail.facilityCategory,
                                                        bizparKey: dt
                                                    }
                                                }
                                            })}
                                            type="bizpar"
                                            data={this.state.bizparFacilityCategory} 
                                            value={this.state.dataFacilityDetail.facilityCategory ? this.state.dataFacilityDetail.facilityCategory.bizparKey : ""} />
                                    </div>
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                        <h4>Quantity <span style={{ color: "red" }}>*</span></h4>
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
                                                            dataFacilityDetail: {
                                                                ...this.state.dataFacilityDetail,
                                                                facilityDetailQty: e.target.value
                                                            }
                                                        })
                                                    }}
                                                    value={this.state.dataFacilityDetail.facilityDetailQty}
                                                />
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
                                <button
                                    type="submit"
                                    className="btn btn-blue">
                                    SAVE
                                </button>
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

export default formFacilityDetail