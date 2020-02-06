import React, { Component } from 'react'
import DropDown from '../../../../../../modules/popup/DropDown'
import * as R from 'ramda'
import NumberFormat from 'react-number-format'

class EditPayrollDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data:
            {
                ...this.props.data,
                payrollDetailStatus: this.props.data.payrollDetailStatus === 'ACTIVE' ? true : false
            }
        }
    }

    render() {
        let coaCategory = Object.assign([], this.props.coaCategory)
        coaCategory = coaCategory.map((value) => {
            return {
                bizparKey: value.coaCategoryID,
                bizparValue: value.coaCategoryID
            }
        })
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px" />
                <div className="popup-content background-white border-radius">

                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="popup-title">
                                Payroll Template Detail - Edit Form
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button
                                type="button"
                                className="btn btn-circle btn-grey"
                                onClick={this.props.onClickClose.bind(this)}>
                                <i className="fa fa-lg fa-times" />
                            </button>
                        </div>
                    </div>

                    <form action="#"
                        onSubmit={(e) => {
                            e.preventDefault()
                            if (R.isEmpty(this.state.data.payrollSegment)) return alert('Payroll Template Segment is Required')
                            if (R.isEmpty(this.state.data.payrollTaxtype)) return alert('Tax Type is Required')
                            if (R.isEmpty(this.state.data.payrollTax1721A1Type)) return alert('Tax 1721A1 Type is Required')
                            if (R.isEmpty(this.state.data.payrollCoaType)) return alert('COA Type is Required')
                            if (R.isEmpty(this.state.data.payrollComponent)) return alert('Payroll Template Component is Required')
                            if (R.isEmpty(this.state.data.payrollComponentType)) return alert('Payroll Template Component Type is Required')
                            this.props.onClickSave({
                                ...this.state.data,
                                payrollCoaType: typeof this.state.data.payrollCoaType === "object" ? this.state.data.payrollCoaType.coaCategoryID : this.state.data.payrollCoaType,
                                payrollDetailStatus: this.state.data.payrollDetailStatus ? 'ACTIVE' : 'INACTIVE',
                                payrollComponentValue: String(this.state.data.payrollComponentValue).split(",").join("")
                            }, 'edit-detail')
                        }}>
                        <div className="display-flex-normal">
                            <div style={{ width: '50%' }}>
                                <div className="padding-15px">
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Payroll Template ID <span style={{ color: 'red' }}>*</span></h4>
                                        </div>
                                        <div className="margin-5px">
                                            <div className="card-date-picker">
                                                <div className="double">
                                                    <input
                                                        readOnly
                                                        type="text"
                                                        className="txt txt-sekunder-color"
                                                        placeholder=''
                                                        value={this.state.data.payrollTPLDetailID}
                                                        style={{ backgroundColor: '#E6E6E6' }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Payroll Template Segment <span style={{ color: 'red' }}>*</span></h4>
                                        </div>
                                        <div className="margin-5px">
                                            <DropDown
                                                title="-- please select payroll template segment --"
                                                onChange={(dt) => this.setState({
                                                    data: {
                                                        ...this.state.data,
                                                        payrollSegment: dt
                                                    }
                                                })}
                                                type='bizpar'
                                                value={this.state.data.payrollSegment.bizparKey}
                                                data={this.props.bizparPayrollTplSegment} />
                                        </div>
                                    </div>
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Tax Type <span style={{ color: 'red' }}>*</span></h4>
                                        </div>
                                        <div className="margin-5px">
                                            <DropDown
                                                title="-- please select tax type --"
                                                onChange={(dt) => this.setState({
                                                    data: {
                                                        ...this.state.data,
                                                        payrollTaxtype: dt
                                                    }
                                                })}
                                                type='bizpar'
                                                value={this.state.data.payrollTaxtype.bizparKey}
                                                data={this.props.bizparTaxType} />
                                        </div>
                                    </div>
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Tax 1721A1 Type <span style={{ color: 'red' }}>*</span></h4>
                                        </div>
                                        <div className="margin-5px">
                                            <DropDown
                                                title="-- please select tax 1721A1 type --"
                                                onChange={(dt) => this.setState({
                                                    data: {
                                                        ...this.state.data,
                                                        payrollTax1721A1Type: dt
                                                    }
                                                })}
                                                type='bizpar'
                                                value={this.state.data.payrollTax1721A1Type && this.state.data.payrollTax1721A1Type.bizparKey}
                                                data={this.props.bizparTax1721A1Type} />
                                        </div>
                                    </div>
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>COA Type <span style={{ color: 'red' }}>*</span></h4>
                                        </div>
                                        <div className="margin-5px">
                                            <DropDown
                                                title="-- please select COA type --"
                                                onChange={(dt) => this.setState({
                                                    data: {
                                                        ...this.state.data,
                                                        payrollCoaType: dt
                                                    }
                                                })}
                                                type='bizpar'
                                                value={this.state.data.payrollCoaType && this.state.data.payrollCoaType.coaCategoryID}
                                                data={coaCategory} />
                                            {/* <select
                                                onChange={(e) => this.setState({
                                                    data: {
                                                        ...this.state.data,
                                                        payrollCoaType: e.target.value
                                                    }
                                                })}
                                                className="cf-select slc slc-sekunder"
                                                style={
                                                    this.props.type === "view"
                                                        ? { backgroundColor: "#E6E6E6" }
                                                        : null
                                                }
                                                value={this.state.data.payrollCoaType && this.state.data.payrollCoaType.coaCategoryID}
                                            >
                                                <option value="">--  payroll tpl coa type  --</option>
                                                {this.props.coaCategory && this.props.coaCategory.map((data, index) => {
                                                    return (<option key={index} value={data.coaCategoryID}>{data.coaCategory.bizparValue}</option>)
                                                })}
                                            </select> */}
                                        </div>
                                    </div>
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Special Calculation </h4>
                                        </div>
                                        <div className="margin-15px">
                                            <label className="radio">
                                                <input type="checkbox" name="all-day" checked={this.state.data.isSpecialCalculation}
                                                    onChange={(e) => this.setState({
                                                        data: {
                                                            ...this.state.data,
                                                            isSpecialCalculation: e.target.checked
                                                        }
                                                    })} />
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
                                            <h4>Payroll Template Component <span style={{ color: 'red' }}>*</span></h4>
                                        </div>
                                        <div className="margin-5px">
                                            <DropDown
                                                title="-- please select payroll template component --"
                                                onChange={(dt) => this.setState({
                                                    data: {
                                                        ...this.state.data,
                                                        payrollComponent: dt
                                                    }
                                                })}
                                                type='bizpar'
                                                value={this.state.data.payrollComponent && this.state.data.payrollComponent.bizparKey}
                                                data={this.props.bizparPayrollTplComponent} />
                                        </div>
                                    </div>
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Payroll Template Component Type <span style={{ color: 'red' }}>*</span></h4>
                                        </div>
                                        <div className="margin-5px">
                                            <DropDown
                                                title="-- please select payroll template component type --"
                                                onChange={(dt) => this.setState({
                                                    data: {
                                                        ...this.state.data,
                                                        payrollComponentType: dt
                                                    }
                                                })}
                                                type='bizpar'
                                                value={this.state.data.payrollComponentType && this.state.data.payrollComponentType.bizparKey}
                                                data={this.props.bizparPayrollTplComponentType} />
                                        </div>
                                    </div>
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Sequence <span style={{ color: 'red' }}>*</span></h4>
                                        </div>
                                        <div className="margin-5px">
                                            <div className="card-date-picker">
                                                <div className="double">
                                                    <input
                                                        required
                                                        type="number"
                                                        className="txt txt-sekunder-color"
                                                        placeholder=''
                                                        value={this.state.data.sequence}
                                                        onChange={(e) => this.setState({
                                                            data: {
                                                                ...this.state.data,
                                                                sequence: e.target.value
                                                            }
                                                        })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="padding-5px grid grid-2x">
                                        <div className="col-1">
                                            <div className="margin-bottom-20px">
                                                <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                                    <h4>Default </h4>
                                                </div>
                                                <div className="margin-15px">
                                                    <label className="radio">
                                                        <input type="checkbox" name="all-day" checked={this.state.data.isDefault}
                                                            onChange={(e) => this.setState({
                                                                data: {
                                                                    ...this.state.data,
                                                                    isDefault: e.target.checked
                                                                }
                                                            })} />
                                                        <span className="checkmark" />
                                                        <span className="txt-site txt-11 txt-bold txt-main">
                                                            Activate Now
                                                </span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="margin-bottom-20px">
                                                <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                                    <h4>Is Fix </h4>
                                                </div>
                                                <div className="margin-15px">
                                                    <label className="radio">
                                                        <input type="checkbox" name="all-day" checked={this.state.data.isFix}
                                                            onChange={(e) => this.setState({
                                                                data: {
                                                                    ...this.state.data,
                                                                    isFix: e.target.checked
                                                                }
                                                            })} />
                                                        <span className="checkmark" />
                                                        <span className="txt-site txt-11 txt-bold txt-main">
                                                            Activate Now
                                                </span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-2">
                                            <div className="margin-bottom-20px">
                                                <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                                    <h4>Activation </h4>
                                                </div>
                                                <div className="margin-15px">
                                                    <label className="radio">
                                                        <input type="checkbox" name="all-day" checked={this.state.data.payrollDetailStatus}
                                                            onChange={(e) => this.setState({
                                                                data: {
                                                                    ...this.state.data,
                                                                    payrollDetailStatus: e.target.checked
                                                                }
                                                            })} />
                                                        <span className="checkmark" />
                                                        <span className="txt-site txt-11 txt-bold txt-main">
                                                            Activate Now
                                                </span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="margin-bottom-20px">
                                                <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                                    <h4>Is Regular</h4>
                                                </div>
                                                <div className="margin-15px">
                                                    <label className="radio">
                                                        <input type="checkbox" name="all-day" checked={this.state.data.isRegular}
                                                            onChange={(e) => this.setState({
                                                                data: {
                                                                    ...this.state.data,
                                                                    isRegular: e.target.checked
                                                                }
                                                            })} />
                                                        <span className="checkmark" />
                                                        <span className="txt-site txt-11 txt-bold txt-main">
                                                            Activate Now
                                                </span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Component Value (nominal) <span style={{ color: 'red' }}>*</span></h4>
                                        </div>
                                        <div className="margin-5px">
                                            <div className="card-date-picker">
                                                <div className="double">
                                                    <NumberFormat
                                                        className="txt txt-sekunder-color"
                                                        thousandSeparator={true}
                                                        value={this.state.data.payrollComponentValue}
                                                        required
                                                        onValueChange={(e) => {
                                                            this.setState({
                                                                data: {
                                                                    ...this.state.data,
                                                                    payrollComponentValue: e.formattedValue
                                                                }
                                                            })
                                                        }} />
                                                    {/* <input
                                                        required
                                                        type="text"
                                                        className="txt txt-sekunder-color"
                                                        placeholder=''
                                                        value={this.state.data.payrollComponentValue}
                                                        // onChange={(e) => this.setState({
                                                        // data: {
                                                        //     ...this.state.data,
                                                        //     payrollComponentValue: e.target.value
                                                        // }
                                                        // })}
                                                        onChange={(e) => {
                                                            if (isNaN(e.target.value)) return true
                                                            this.setState({
                                                                data: {
                                                                    ...this.state.data,
                                                                    payrollComponentValue: e.target.value
                                                                }
                                                            })
                                                        }}
                                                    /> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="padding-15px margin-bottom-30px">
                            <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                <h4>Note</h4>
                            </div>
                            <div className="margin-5px">
                                <div className="card-date-picker">
                                    <textarea
                                        row={10}
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                        value={this.state.data.notes}
                                        onChange={(e) => this.setState({
                                            data: {
                                                ...this.state.data,
                                                notes: e.target.value
                                            }
                                        })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="border-top padding-15px content-right">
                            <button
                                type="button"
                                onClick={this.props.onClickClose.bind(this)}
                                className="btn btn-primary margin-right-10px">
                                BACK
                             </button>
                            <button
                                className="btn btn-blue"
                                type='submit'
                            >
                                SAVE
                              </button>
                        </div>
                    </form>

                </div>
                <div className="padding-top-20px" />
            </div>
        )
    }
}

export default EditPayrollDetail