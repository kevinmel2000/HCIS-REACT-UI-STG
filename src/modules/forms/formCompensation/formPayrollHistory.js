import React, { Component } from 'react'

import DropDown from '../../../modules/popup/DropDown'

class FormPayrollHistory extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        let { type, title } = this.props
        if (type === "create") title = "Create Form"
        if (type === "update") title = "Edit Form"
        if (type === "view") title = "View Form"

        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px"></div>
                <div className="popup-content background-white border-radius">
                    <div className="padding-15px background-blue grid grid-2x">
                        <div className="col-1">
                            <div className="txt-site txt-12 txt-bold post-center">
                                Payroll Structure - History - {title}
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
                            <div className="txt-site txt-12 txt-bold post-center">
                                Employee Name
                            </div>
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
                            </div>
                            <div className="column-2">
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <span className="txt-site txt-11 txt-main txt-bold">
                                            Employee Name
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
                            </div>
                            <div className="txt-site txt-12 txt-bold post-center">
                                History Payroll Component
                            </div>
                            <div className="column-1">
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <span className="txt-site txt-11 txt-main txt-bold">
                                            Payroll Component
                                        </span>
                                    </div>
                                    <DropDown
                                        title="-- please select position --"
                                        onChange={(dt) => console.log(dt)}
                                        // type="bizpar"
                                        disabled={this.props.type === "view" ? true : false}
                                        data={[{id: '1', title: 'Basic Salay - Gross Up', value: 'bs-1'}]} />
                                    {/*<select
                                        className="cf-select slc slc-sekunder"
                                        disabled={type === 'view'}
                                        style={type === 'view' ? { backgroundColor: '#E6E6E6' } : null}>
                                        <option value="">-- please select payroll component --</option>
                                        <option value="">Basic Salary - Gross Up</option>
                                    </select>*/}
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <span className="txt-site txt-11 txt-main txt-bold">
                                            Nominal
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        readOnly={type === "view"}
                                        style={type === "view" ? { backgroundColor: '#E6E6E6' } : null}
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                    ></input>
                                </div>
                            </div>
                            <div className="column-2">
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <span className="txt-site txt-11 txt-main txt-bold">
                                            Efective Date
                                        </span>
                                    </div>
                                    <input
                                        type="date"
                                        readOnly={type === "view"}
                                        style={type === "view" ? { backgroundColor: '#E6E6E6' } : null}
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                    ></input>
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <span className="txt-site txt-11 txt-main txt-bold">
                                            End Date
                                        </span>
                                    </div>
                                    <input
                                        type="date"
                                        readOnly={type === "view"}
                                        style={type === "view" ? { backgroundColor: '#E6E6E6' } : null}
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
                                {type !== "view" ?
                                    <button
                                        className="btn btn-blue"
                                        type="button"
                                        onClick={this.props.onClickSave}>
                                        <span>SAVE</span>
                                    </button> : null}
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

export default FormPayrollHistory