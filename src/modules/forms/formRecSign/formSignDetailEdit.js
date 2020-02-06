import React, { Component } from "react";

import CalendarPicker from '../../../modules/popup/Calendar';

class FormSignDetailEdit extends Component {
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
                                            <h4>Applicant Name</h4>
                                        </div>
                                    </div>
                                    <input
                                        style={{
                                            width: "80%",
                                            marginRight: 5
                                        }
                                        }
                                        readOnly
                                        className="txt txt-sekunder-color"
                                        type="text"
                                        placeholder=""
                                    ></input>
                                    <button
                                        className="btn btn-blue fa fa-search"
                                        type="button"
                                    >
                                    </button>
                                </div>
                            
                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>Applicant ID</h4>
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    readOnly={this.props.type === 'create' ? true : false}
                                    style={{ backgroundColor: "#E6E6E6" }}
                                    className="txt txt-sekunder-color"
                                    required
                                />
                            </div>
                            
                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>Birth Place</h4>
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    readOnly={this.props.type === 'create' ? true : false}
                                    style={ { backgroundColor: "#E6E6E6" }}
                                    className="txt txt-sekunder-color"
                                    required
                                />
                            </div>
                            
                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>Date of Birth</h4>
                                    </div>
                                </div>
                                <CalendarPicker 
                                    // disabled={true}
                                    onChange={(e) => {
                                        console.log('date', e)
                                    }} />
                                {/* <input
                                    type="date"
                                    readOnly={this.props.type === 'create' ? true : false}
                                    style={ { backgroundColor: "#E6E6E6" }}
                                            
                                    className="txt txt-sekunder-color"
                                    required
                                /> */}
                            </div>

                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>Type of Work Status</h4>
                                    </div>
                                </div>
                                <select
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
                                </select>
                            </div>
                        </div>


                        <div className="column-2">
                            <div className="margin-bottom-20px">

                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>Category of Work Status</h4>
                                    </div>
                                </div>
                                <select
                                    className="cf-select slc slc-sekunder"
                                    disabled={this.props.type === "view" ? true : false}
                                    style={
                                        this.props.type === "view"
                                            ? { backgroundColor: "#E6E6E6" }
                                            : null
                                    }
                                    required
                                >
                                    <option value="1">-- please select category --</option>
                                    <option value="1">1</option>
                                </select>
                            </div>

                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Date of Work Status</h4>
                                        </div>
                                    </div>
                                    <div className="display-flex-normal width width-full">
                                        <CalendarPicker 
                                            // disabled={isReadOnly}
                                            // date={payloadOrgExp.orgExperienceStartDate}
                                            onChange={(e) => {
                                                console.log('date', e)
                                            }} />
                                        <div className="txt-site txt-11 txt-primary txt-center margin-10px margin-left-10px margin-right-10px">
                                            To
                                        </div>
                                        <CalendarPicker 
                                            // disabled={isReadOnly}
                                            // date={payloadOrgExp.orgExperienceEndDate}
                                            onChange={(e) => {
                                                console.log('date', e)
                                            }} />
                                    </div>

                                    {/* <div className="grid grid-3x grid-mobile-none gap-20px">
                                        <div className="column-1">
                                            <input
                                                type="date"
                                                className="txt txt-sekunder-color"
                                                placeholder=""
                                                required
                                            />
                                        </div>
                                        <div className="column-2">
                                            <p align="center" className="padding-5px">
                                                To
                                            </p>
                                        </div>
                                        <div className="column-3">
                                            <input
                                                type="date"
                                                className="txt txt-sekunder-color"
                                                placeholder=""
                                                required
                                            />
                                        </div>
                                    </div> */}
                                </div>


                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Grade</h4>
                                        </div>
                                    </div>
                                    <select
                                        className="cf-select slc slc-sekunder"
                                        disabled={this.props.type === "view" ? true : false}
                                        style={
                                            this.props.type === "view"
                                                ? { backgroundColor: "#E6E6E6" }
                                                : null
                                        }
                                        required
                                    >
                                        <option value="1">-- please select grade --</option>
                                        <option value="1">1</option>
                                    </select>
                                </div>


                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>SPK Date</h4>
                                    </div>
                                </div>
                                <CalendarPicker 
                                    // disabled={true}
                                    onChange={(e) => {
                                        console.log('date', e)
                                    }} />
                                {/* <input
                                    type="date"
                                    className="txt txt-sekunder-color"
                                    required
                                /> */}
                            </div>

                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Description</h4>
                                        </div>
                                    </div>
                                    <div class="input-border form-group">
                                        <textarea
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
                    <div className="padding-15px">
                        <div className="grid grid-2x">
                            <div className="col-1" />
                            <div className="col-2 content-right">
                                {this.props.type !== "view" ?
                                    <button
                                        style={{ marginLeft: "15px" }}
                                        onClick={this.props.onSave}
                                        className="btn btn-blue"
                                        type="button">
                                        <span>SAVE</span>
                                    </button> : null}
                                {this.props.type === "edit" ?
                                    <button
                                        style={{ marginLeft: "15px" }}
                                        onClick={this.props.onSave}
                                        className="btn btn-blue"
                                        type="button">
                                        <span>PROCESS</span>
                                    </button> : null}
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

export default FormSignDetailEdit;