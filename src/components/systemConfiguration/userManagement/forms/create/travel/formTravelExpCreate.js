import React, { Component } from 'react'
import DropDown from '../../../../../../modules/popup/DropDown'
import * as R from 'ramda'
import M from 'moment'
import NumberFormat from 'react-number-format'

const defaultPayload = {
    "corporateTravelExpenseDetailID": "",
    "budgetCategory": "",
    "budgetClass": "",
    "budgetCurrency": "",
    "budgetType": "",
    "budgetValue": ""
}


class FormTravelExpCreate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            travelData: props.rawData ? props.rawData : defaultPayload
        }
    }

    handleBudget = (e) => {
        if (isNaN(e.target.value)) return true
        this.setState({
            travelData: {
                ...this.state.travelData,
                budgetValue: e.target.value
            }
        })
    }

    render() {
        let { bizparSppdCostCategory, bizparCurrency, bizparSppdCostClass, bizparSppdCostType } = this.props
        let { travelData } = this.state
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px" />
                <div className="popup-content background-white border-radius">

                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="popup-title">
                                Travel Expense Template Detail - {this.props.type === "create" ? "Create Form" : "Edit Form"}
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
                        let payload = this.state.travelData
                        payload = {
                            ...payload,
                            budgetCategory: typeof travelData.budgetCategory === "object" && !R.isNil(payload.budgetCategory.bizparKey) ? payload.budgetCategory.bizparKey : payload.budgetCategory,
                            budgetCurrency: typeof travelData.budgetCurrency === "object" && !R.isNil(payload.budgetCurrency.bizparKey) ? payload.budgetCurrency.bizparKey : payload.budgetCurrency,
                            budgetClass: typeof travelData.budgetClass === "object" && !R.isNil(payload.budgetClass.bizparKey) ? payload.budgetClass.bizparKey : "",
                            budgetType: typeof travelData.budgetType === "object" && !R.isNil(payload.budgetType.bizparKey) ? payload.budgetType.bizparKey : payload.budgetType,
                            budgetValue:(!R.isEmpty(payload.budgetValue) || !R.isNil(payload.budgetValue)) ? String(payload.budgetValue).split(",").join("") : payload.budgetValue,
                            corporateTravelExpenseDetailID: !R.isEmpty(payload.corporateTravelExpenseDetailID) ? payload.corporateTravelExpenseDetailID : 'CTE-DTL-' + M()
                        }
                        if (R.isEmpty(payload.budgetType)) return alert('Budget Type is Required.')
                        if (R.isEmpty(payload.budgetCategory)) return alert('Budget Category is Required.')
                        if (R.isEmpty(payload.budgetCurrency)) return alert('Budget Currency is Required.')
                        if ((payload.budgetType === "CT-PN" || payload.budgetType === "CT-TR") && (R.isEmpty(payload.budgetClass) && R.isNil(payload.budgetClass.bizparKey))) return alert('Budget Class is Required.')
                        console.log('travel exp detail', payload)
                        this.props.onClickSave(payload, this.props.type === 'create' ? 'create-detail' : 'update-detail')
                    }}>
                        <div className="display-flex-normal">
                            <div style={{ width: '45%' }}>
                                <div className="padding-15px">
                                    <div className="margin-bottom-30px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h3>Budget Type <span style={{ color: "red" }}>*</span></h3>
                                        </div>
                                        <div className="margin-15px">
                                            <DropDown
                                                title="-- please select budget type --"
                                                onChange={(e) => this.setState({
                                                    travelData: {
                                                        ...travelData,
                                                        budgetType: e
                                                    }
                                                })}
                                                value={travelData.budgetType ? travelData.budgetType.bizparKey : travelData.budgetType.bizparKey}
                                                data={bizparSppdCostType}
                                                type="bizpar" />
                                        </div>
                                    </div>
                                    <div className="margin-bottom-30px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h3>Budget Category <span style={{ color: "red" }}>*</span></h3>
                                        </div>
                                        <div className="margin-15px">
                                            <DropDown
                                                title="-- please select budget category --"
                                                onChange={(e) => this.setState({
                                                    travelData: {
                                                        ...travelData,
                                                        budgetCategory: e
                                                    }
                                                })}
                                                value={travelData.budgetCategory ? travelData.budgetCategory.bizparKey : travelData.budgetCategory}
                                                data={bizparSppdCostCategory}
                                                type="bizpar" />
                                        </div>
                                    </div>
                                    <div className="margin-bottom-30px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h3>Budget Class</h3>
                                        </div>
                                        <div className="margin-15px">
                                            <DropDown
                                                title="-- please select budget class --"
                                                onChange={(e) => this.setState({
                                                    travelData: {
                                                        ...travelData,
                                                        budgetClass: {
                                                            ...travelData.budgetClass,
                                                            bizparKey: e
                                                        }
                                                    }
                                                })}
                                                value={travelData.budgetClass ? travelData.budgetClass.bizparKey : travelData.budgetClass}
                                                data={bizparSppdCostClass}
                                                type="bizpar" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ width: '45%' }}>
                                <div className="padding-15px">
                                    <div className="margin-bottom-30px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h3>Budget Value  <span style={{ color: "red" }}>*</span></h3>
                                        </div>
                                        <div className="margin-15px">
                                            <div className="card-date-picker">
                                                <div className="double">
                                                    <NumberFormat
                                                        className="txt txt-sekunder-color"
                                                        required
                                                        thousandSeparator={true}
                                                        value={travelData.budgetValue}
                                                        onValueChange={(e) => {
                                                            this.setState({
                                                                travelData: {
                                                                    ...this.state.travelData,
                                                                    budgetValue: e.formattedValue
                                                                }
                                                            })
                                                        }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="margin-bottom-30px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h3>Currency <span style={{ color: "red" }}>*</span></h3>
                                        </div>
                                        <div className="margin-15px">
                                            <DropDown
                                                title="-- please select currency --"
                                                onChange={(e) => this.setState({
                                                    travelData: {
                                                        ...travelData,
                                                        budgetCurrency: e
                                                    }
                                                })}
                                                value={travelData.budgetCurrency ? travelData.budgetCurrency.bizparKey : travelData.budgetCurrency}
                                                data={bizparCurrency}
                                                type="bizpar" />
                                        </div>
                                    </div>
                                    <div className="margin-bottom-30px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h3>Activation <span style={{ color: "red" }}>*</span></h3>
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

export default FormTravelExpCreate