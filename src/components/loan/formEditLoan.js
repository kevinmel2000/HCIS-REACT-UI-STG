import React, { Component } from "react";

import DropDown from '../../modules/popup/DropDown';
import CalendarPicker from '../../modules/popup/Calendar'
import NumberFormat from 'react-number-format'

class formEditLoan extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentWillMount() {
    }

    componentDidUpdate() {
        console.log('masuk edit')
    }

    render() {
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px" />
                <div className="popup-content background-white border-radius">
                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="popup-title">
                                {this.props.type === "update"
                                    ? "Loan - Edit Form"
                                    : "Loan - View Form"}
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button
                                type="button"
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
                        }}>
                        <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-15px">
                            <div className="column-1">
                                {this.props.type !== "create" ? (
                                    <div className="margin-bottom-20px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>Employee ID</h4>
                                            </div>
                                        </div>
                                        <input
                                            readOnly
                                            style={{ backgroundColor: "#E6E6E6" }}
                                            type="text"
                                            className="txt txt-sekunder-color"
                                            placeholder=""
                                            required
                                            value={'test'}
                                        />
                                    </div>
                                ) : null}
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Employee Name</h4>
                                        </div>
                                    </div>
                                    <input
                                        readOnly
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                        required
                                        value={'test'}
                                    />
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Loan Request Date</h4>
                                        </div>
                                    </div>
                                    <CalendarPicker
                                        date={'11-10-2019'}
                                        disabled={this.props.type === 'view' ? true : false}
                                        onChange={e => console.log(e)} />
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>DSR</h4>
                                        </div>
                                    </div>
                                    <NumberFormat
                                        readOnly
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        className="txt txt-sekunder-color"
                                        thousandSeparator={true}
                                        value={this.props.data[6]}
                                        required
                                        onValueChange={(e) =>
                                            e.formattedValue
                                        } />
                                </div>

                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Total Commitment</h4>
                                        </div>
                                    </div>
                                    <NumberFormat
                                        readOnly
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        className="txt txt-sekunder-color"
                                        thousandSeparator={true}
                                        value={this.props.data[6]}
                                        required
                                        onValueChange={(e) =>
                                            e.formattedValue
                                        } />
                                </div>
                            </div>

                            <div className="column-2">
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Current Commitment</h4>
                                        </div>
                                    </div>
                                    <NumberFormat
                                        readOnly
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        className="txt txt-sekunder-color"
                                        thousandSeparator={true}
                                        value={this.props.data[6]}
                                        required
                                        onValueChange={(e) =>
                                            e.formattedValue
                                        } />
                                </div>

                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Current Installment/Month</h4>
                                        </div>
                                    </div>
                                    <NumberFormat
                                        readOnly
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        className="txt txt-sekunder-color"
                                        thousandSeparator={true}
                                        value={this.props.data[6]}
                                        required
                                        onValueChange={(e) =>
                                            e.formattedValue
                                        } />
                                </div>

                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Status <span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                    </div>
                                    <DropDown
                                        title="-- INITIATE--"
                                        disabled={this.props.type === "view" ? true : false}
                                    />
                                </div>

                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Loan Type</h4>
                                        </div>
                                    </div>
                                    <NumberFormat
                                        readOnly={this.props.type !== 'view' ? false : true}
                                        style={{ backgroundColor: this.props.type === 'update' ? null : "#E6E6E6" }}
                                        className="txt txt-sekunder-color"
                                        thousandSeparator={true}
                                        value={this.props.data[6]}
                                        required
                                        onValueChange={(e) =>
                                            e.formattedValue
                                        } />
                                </div>

                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Loan Ammount</h4>
                                        </div>
                                    </div>
                                    <NumberFormat
                                        readOnly={this.props.type !== 'view' ? false : true}
                                        style={{ backgroundColor: this.props.type === 'update' ? null : "#E6E6E6" }}
                                        className="txt txt-sekunder-color"
                                        thousandSeparator={true}
                                        value={this.props.data[6]}
                                        required
                                        onValueChange={(e) =>
                                            e.formattedValue
                                        } />
                                </div>

                            </div>
                        </div>

                        <div className="padding-15px">
                            <div className="grid grid-2x">
                                <div className="col-1" />
                                <div className="col-2 content-right">
                                    {this.props.type !== "view" ? (
                                        <button
                                            style={{ marginLeft: "15px" }}
                                            className="btn btn-blue"
                                            type="submit"
                                        >
                                            <span>SAVE</span>
                                        </button>
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
export default formEditLoan;
