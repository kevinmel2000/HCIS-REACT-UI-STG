import React, { Component } from "react";

import CalendarPicker from '../../../modules/popup/Calendar';
import DropDown from '../../../modules/popup/DropDown';

class FormSignSalary extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }


    render() {
        return (
            <div className="vertical-tab-content active">

                <form action="#">
                    <div className="padding-15px grid grid-2x grid-mobile-none gap-15px">
                        <div className="column-1">
                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>PIC</h4>
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    readOnly={this.props.type === 'view' ? true :
                                        this.props.type === 'edit' ? true : false}
                                    style={
                                        this.props.type === "view"
                                            ? { backgroundColor: "#E6E6E6" }
                                            :
                                            this.props.type === "edit"
                                                ? { backgroundColor: "#E6E6E6" }
                                                : null
                                    }
                                    className="txt txt-sekunder-color"
                                    required
                                />
                            </div>
                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>Date of Selection</h4>
                                    </div>
                                </div>
                                <CalendarPicker 
                                    // disabled={true}
                                    onChange={(e) => {
                                        console.log('date', e)
                                    }} />
                                {/* <input
                                    type="date"
                                    readOnly={this.props.type === 'view' ? true :
                                        this.props.type === 'edit' ? true : false}
                                    style={
                                        this.props.type === "view"
                                            ? { backgroundColor: "#E6E6E6" }
                                            :
                                            this.props.type === "edit"
                                                ? { backgroundColor: "#E6E6E6" }
                                                : null
                                    }
                                    className="txt txt-sekunder-color"
                                    required
                                /> */}
                            </div>
                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>Test Location</h4>
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    readOnly={this.props.type === 'view' ? true :
                                        this.props.type === 'edit' ? true : false}
                                    style={
                                        this.props.type === "view"
                                            ? { backgroundColor: "#E6E6E6" }
                                            :
                                            this.props.type === "edit"
                                                ? { backgroundColor: "#E6E6E6" }
                                                : null
                                    }
                                    className="txt txt-sekunder-color"
                                    required
                                />

                            </div>

                        </div>
                        <div className="column-2">
                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>Salary</h4>
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    readOnly={this.props.type === 'view' ? true : false}
                                    style={
                                        this.props.type === "view"
                                            ? { backgroundColor: "#E6E6E6" }
                                            : null
                                    }
                                    className="txt txt-sekunder-color"
                                    required
                                />
                            </div>

                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>Selection Result <span style={{ color: "red" }}>*</span></h4>
                                    </div>
                                </div>
                                <DropDown
                                    title="-- please select result --"
                                    onChange={(dt) => {
                                        console.log('data', dt)
                                    }}
                                    disabled={this.props.type !== "create1" ? true : false}
                                    data={[
                                        {id: '1', title: 'satu', value: 'satu'}
                                    ]} />
                                {/* <select
                                    className="cf-select slc slc-sekunder"
                                    disabled={this.props.type === "view" ? true : false}
                                    style={
                                        this.props.type === "view"
                                            ? { backgroundColor: "#E6E6E6" }
                                            : null
                                    }
                                    required
                                >
                                    <option value="1">-- please select type --</option>
                                    <option value="1">1</option>
                                </select> */}
                            </div>

                            <div className="margin-bottom-20px">
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Description</h4>
                                        </div>
                                    </div>
                                    <div class="input-border form-group">
                                        <textarea
                                            style={
                                                this.props.type === "view"
                                                    ? { backgroundColor: "#E6E6E6" }
                                                    : null
                                            }
                                            readOnly
                                            class="form-control rounded-0"
                                            type="text"
                                            required
                                            placeholder=""
                                            cols="80"
                                            rows="5"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="padding-15px">
                        <div className="grid grid-2x">
                            <div className="col-1" />
                            <div className="col-2 content-right">

                                <button
                                    style={{ marginLeft: "15px" }}
                                    onClick={this.props.onSave}
                                    className="btn btn-blue"
                                    type="button">
                                    <span>SAVE</span>
                                </button>


                                <button
                                    style={{ marginLeft: "15px" }}
                                    onClick={this.props.onClickClose}
                                    className="btn btn-blue"
                                    type="button">
                                    <span>CLOSE</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default FormSignSalary;