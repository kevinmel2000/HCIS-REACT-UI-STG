import React, { Component } from 'react'

import DropDown from '../../../modules/popup/DropDown'

class FormMiniPaymentCreate extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        let { type, title } = this.props
        if (type === "create") title = "CREATE FORM"
        if (type === "update") title = "EDIT FORM"

        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px"></div>
                <div className="popup-content background-white border-radius">
                    <div className="padding-15px background-blue grid grid-2x">
                        <div className="col-1">
                            <div className="txt-site txt-12 txt-bold post-center">
                                MINI REPAYMENT - {title}
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button className="btn btn-circle background-blue" onClick={this.props.onClickClose}>
                                <i className="fa fa-lg fa-times"></i>
                            </button>
                        </div>
                    </div>

                    <form action="#">
                        <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-20px">
                            <div className="column-1">
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <span className="txt-site txt-11 txt-main txt-bold">
                                            NIK
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        readOnly
                                        style={{ backgroundColor: '#E6E6E6' }}
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                    ></input>
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <span className="txt-site txt-11 txt-main txt-bold">
                                            Employee Name
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        readOnly
                                        style={{ 
                                            backgroundColor: '#E6E6E6',
                                            width: "85%",
                                            marginRight: 5
                                        }}
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                    ></input>
                                    <button
                                        className="btn btn-blue fa fa-search"
                                        type="button"
                                        >
                                    </button>
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <span className="txt-site txt-11 txt-main txt-bold">
                                            Payroll Component
                                        </span>
                                    </div>
                                    <DropDown
                                        title="-- please select payroll component --"
                                        onChange={(dt) => console.log(dt)}
                                        // type="bizpar"
                                        disabled={this.props.type === "update" ? true : false}
                                        data={[{id: '1', title: 'Basic Salary - Gross Up', value: 'bs-1'}]} />
                                    {/*<select
                                        className="cf-select slc slc-sekunder"
                                        disabled={type === 'update'}
                                        style={type === 'update' ? { backgroundColor: '#E6E6E6' } : null}>
                                        <option value="">-- please select position --</option>
                                        <option value="">Basic Salary - Gross Up</option>
                                    </select>*/}
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <span className="txt-site txt-11 txt-main txt-bold">
                                            Join Date
                                        </span>
                                    </div>
                                    <input
                                        type="date"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                    ></input>
                                </div>
                            </div>
                            <div className="column-2">
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <span className="txt-site txt-11 txt-main txt-bold">
                                            End Date
                                        </span>
                                    </div>
                                    <input
                                        type="date"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                    ></input>
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <span className="txt-site txt-11 txt-main txt-bold">
                                            Amount
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                    ></input>
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <span className="txt-site txt-11 txt-main txt-bold">
                                            Information
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                    ></input>
                                </div>
                            </div>
                        </div>
                    </form>

                    <div className="padding-15px">
                        <div className="grid grid-2x">
                            <div className="col-1"></div>
                            <div className="col-2 content-right">
                                <button
                                    className="btn btn-blue"
                                    type="button"
                                    onClick={this.props.onClickSave}>
                                    <span>SAVE</span>
                                </button>
                                <button
                                    style={{ marginLeft: "15px" }}
                                    className="btn btn-primary"
                                    type="button"
                                    onClick={this.props.onClickClose}>
                                    <span>CLOSE</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default FormMiniPaymentCreate