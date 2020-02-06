import React, { Component } from "react";

import DropDown from '../../../../modules/popup/DropDown';
import CalendarPicker from '../../../../modules/popup/Calendar';

class FormUploadCreate extends Component {
    constructor() {
        super();
        this.state = {
            file: null
        }
    }

    render() {
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-10px"></div>
                <div className="popup-content-small background-white border-radius">
                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="popup-title">
                                Training Upload - Create Form
                            </div>
                        </div>
                        <div className="content-right">
                            <button
                                    style={{ marginLeft: "15px" }}
                                    className="btn btn-circle btn-grey"
                                    type="button"
                                    onClick={this.props.onClickClose} >
                                    <i className="fa fa-lg fa-times"></i>
                            </button>
                        </div>
                    </div>
                    <form>
                        <div className="padding-15px">
                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>Training Type</h4>
                                    </div>
                                </div>
                                <DropDown
                                  title="-- please select training type --"
                                  onChange={(dt) => console.log(dt)}
                                  // type="bizpar"
                                  // disabled={this.props.type === "update" ? true : false}
                                  data={[
                                    {id: '1', title: 'Beginner', value: 'Beginner'}, 
                                    {id: '2', title: 'Intermediete', value: 'Intermediete'}]} />
                                {/*<select
                                    className="cf-select slc slc-sekunder"
                                    required
                                >
                                    <option value="1">-- Select Training Type --</option>
                                    <option value="1">Beginner</option>
                                </select>*/}
                            </div>
                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>Date (dd:mm:yyyy)<span style={{ color: "red" }}>*</span></h4>
                                    </div>
                                </div>
                                <div className="display-flex-normal width width-full">
                                    <CalendarPicker
                                    // disabled={this.props.type === 'view' ? true : false}
                                    // date={this.state.employeeDataWorkExp.workExperienceStartDate}
                                    onChange={(e) => {
                                        console.log(e)
                                    }} />
                                    <div className="txt-site txt-11 txt-primary txt-center margin-10px margin-left-10px margin-right-10px">
                                    To
                                                        </div>
                                    <CalendarPicker
                                    // disabled={this.props.type === 'view' ? true : false}
                                    // date={this.state.employeeDataWorkExp.workExperienceEndDate}
                                    onChange={(e) => {
                                        console.log(e)
                                    }} />
                                </div>
                            </div>

                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>Training Name <span style={{ color: "red" }}>*</span></h4>
                                    </div>
                                </div>
                                <div>
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

                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>Place</h4>
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                />
                            </div>
                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>Provider</h4>
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                />
                            </div>

                            <div className="margin-15px">
                                <input
                                    type="file"
                                    id="upload-image"
                                    style={{ display: "none" }}
                                    onChange={this.handleChange}
                                />

                                <input
                                    type="file"
                                    id="upload-image"
                                    style={{ display: "none" }}
                                    onChange={this.handleChange}
                                />

                                <div className="upload-image">
                                    <div className="u-i-info">
                                        <div className="u-i-icon">
                                            <i className="fa fa-lg fa-images" />
                                        </div>
                                        <div className="u-i-label">Upload a file</div>
                                    </div>

                                    <div
                                        className="u-i-image image image-all"
                                        style={{ backgroundImage: "url(" + this.state.file + ")" }}
                                    >
                                        <div className="u-i-btn">
                                            <label htmlFor="upload-image">
                                                <div className="btn btn-circle-div btn-green border-all">
                                                    <i className="fa fa-lg fa-plus" />
                                                </div>
                                            </label>
                                            <button
                                                onClick={this.removeChange}
                                                type="button"
                                                className="btn btn-circle btn-red border-all"
                                            >
                                                <i className="fa fa-lg fa-trash-alt" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>

                    <div className="padding-15px border-top">
                        <div className="grid">
                            <div className="content-right">
                                <button
                                    style={{ marginLeft: "15px" }}
                                    className="btn btn-blue"
                                    type="button"
                                    onClick={() => this.props.onClickSave()}
                                >
                                    <span>DO IMPORT</span>
                                </button>
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
                </div>

                <div className="padding-10px"></div>
            </div>
        );
    }
}

export default FormUploadCreate;
