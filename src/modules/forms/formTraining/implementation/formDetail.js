import React, { Component } from 'react'

import DropDown from '../../../../modules/popup/DropDown';

class FormDetail extends Component {


    render() {
        return (
            <div className="vertical-tab-content active">
                <form action="#">
                    <div className="padding-20px grid grid-2x grid-mobile-none gap-30px">
                        <div className="col-1">
                            <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                    <span className="txt-site txt-11 txt-main txt-bold">
                                        Training Name
                                </span>
                                </div>
                                <input
                                    readOnly
                                    style={{ backgroundColor: "#E6E6E6" }}
                                    type="text"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                />
                            </div>

                            <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                    <span className="txt-site txt-11 txt-main txt-bold">
                                        Type
                                </span>
                                </div>
                                <input
                                    readOnly
                                    style={{ backgroundColor: "#E6E6E6" }}
                                    type="text"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                />
                            </div>

                            <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                    <span className="txt-site txt-11 txt-main txt-bold">
                                        Sub Type 1
                                </span>
                                </div>
                                <input
                                    readOnly
                                    style={{ backgroundColor: "#E6E6E6" }}
                                    type="text"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                />
                            </div>

                            <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                    <span className="txt-site txt-11 txt-main txt-bold">
                                        Sub Type 2
                                </span>
                                </div>
                                <input
                                    readOnly
                                    style={{ backgroundColor: "#E6E6E6" }}
                                    type="text"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                />
                            </div>

                            <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                    <span className="txt-site txt-11 txt-main txt-bold">
                                        Sub Type 3
                                </span>
                                </div>
                                <input
                                    readOnly
                                    style={{ backgroundColor: "#E6E6E6" }}
                                    type="text"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                />
                            </div>

                            <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                    <span className="txt-site txt-11 txt-main txt-bold">
                                        Sub Type 4
                                </span>
                                </div>
                                <input
                                    readOnly
                                    style={{ backgroundColor: "#E6E6E6" }}
                                    type="text"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                />
                            </div>

                            <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                    <span className="txt-site txt-11 txt-main txt-bold">
                                        Sub Type 5
                                </span>
                                </div>
                                <input
                                    readOnly
                                    style={{ backgroundColor: "#E6E6E6" }}
                                    type="text"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                />
                            </div>

                            <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                    <span className="txt-site txt-11 txt-main txt-bold">
                                        Period
                                </span>
                                </div>
                                <input
                                    readOnly
                                    style={{ backgroundColor: "#E6E6E6" }}
                                    type="text"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                />
                            </div>

                            <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                    <span className="txt-site txt-11 txt-main txt-bold">
                                        Participant
                    </span>
                                </div>
                                <div class="input-border form-group">
                                    <textarea
                                        class="form-control rounded-0"
                                        type="text"
                                        readOnly
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        required
                                        placeholder=""
                                        cols="80"
                                        rows="5"
                                    />
                                </div>
                            </div>

                            <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                    <span className="txt-site txt-11 txt-main txt-bold">
                                        PIC<span style={{ color: "red" }}>*</span>
                                    </span>
                                </div>
                                <input
                                    readOnly
                                    style={{ backgroundColor: "#E6E6E6" }}
                                    type="text"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                />
                            </div>
                            <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                    <span className="txt-site txt-11 txt-main txt-bold">
                                        Extention<span style={{ color: "red" }}>*</span>
                                    </span>
                                </div>
                                <input
                                    readOnly
                                    style={{ backgroundColor: "#E6E6E6" }}
                                    type="text"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                />
                            </div>
                        </div>
                        {/** column 2 */}
                        <div className="col-2">
                            <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                    <span className="txt-site txt-11 txt-main txt-bold">
                                        Date (dd:mm:yyyy)<span style={{ color: "red" }}>*</span>
                                    </span>
                                </div>
                                <div className="grid grid-3x grid-mobile-none gap-20px">
                                    <div className="column-1">
                                        <input
                                            type="date"
                                            className="txt txt-sekunder-color"
                                            style={{ backgroundColor: "#E6E6E6" }}
                                            readOnly
                                        />
                                    </div>
                                    <div className="column-2">
                                        <p align="center" className="padding-5px">
                                            -
                    </p>
                                    </div>
                                    <div className="column-3">
                                        <input
                                            type="date"
                                            className="txt txt-sekunder-color"
                                            style={{ backgroundColor: "#E6E6E6" }}
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                    <span className="txt-site txt-11 txt-main txt-bold">
                                        Day Amount
                  </span>
                                </div>
                                <input
                                    readOnly
                                    style={{ backgroundColor: "#E6E6E6" }}
                                    type="text"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                />
                            </div>

                            <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                    <span className="txt-site txt-11 txt-main txt-bold">
                                        Time (hh:mm)<span style={{ color: "red" }}>*</span>
                                    </span>
                                </div>
                                <div className="grid grid-7x grid-mobile-none gap-20px">
                                    <div className="column-1">
                                        <select
                                            className="cf-select slc slc-sekunder"
                                            disabled
                                            style={{ backgroundColor: "#E6E6E6", width: "100%" }}
                                            required
                                        >
                                            <option value="1">-- --</option>
                                            <option value="1">1</option>
                                        </select>
                                    </div>
                                    <div className="column-2">
                                        <p align="center" className="padding-5px">
                                            :
                    </p>
                                    </div>
                                    <div className="column-3">
                                        <select
                                            className="cf-select slc slc-sekunder"
                                            disabled
                                            style={{ backgroundColor: "#E6E6E6", width: "100%" }}
                                            required
                                        >
                                            <option value="1">-- --</option>
                                            <option value="1">1</option>
                                        </select>
                                    </div>
                                    <div className="column-4">
                                        <p align="center" className="padding-5px">
                                            to
                    </p>
                                    </div>
                                    <div className="column-5">
                                        <select
                                            className="cf-select slc slc-sekunder"
                                            disabled
                                            style={{ backgroundColor: "#E6E6E6", width: "100%" }}
                                            required
                                        >
                                            <option value="1">-- --</option>
                                            <option value="1">1</option>
                                        </select>
                                    </div>

                                    <div className="column-6">
                                        <p align="center" className="padding-5px">
                                            :
                    </p>
                                    </div>
                                    <div className="column-7">
                                        <select
                                            className="cf-select slc slc-sekunder"
                                            disabled
                                            style={{ backgroundColor: "#E6E6E6", width: "100%" }}
                                            required
                                        >
                                            <option value="1">-- --</option>
                                            <option value="1">1</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                    <span className="txt-site txt-11 txt-main txt-bold">
                                        Modul<span style={{ color: "red" }}>*</span>
                                    </span>
                                </div>
                                <input
                                    readOnly
                                    style={{ backgroundColor: "#E6E6E6" }}
                                    type="text"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                />
                            </div>

                            <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                    <span className="txt-site txt-11 txt-main txt-bold">
                                        Purpose<span style={{ color: "red" }}>*</span>
                                    </span>
                                </div>
                                <input
                                    readOnly
                                    style={{ backgroundColor: "#E6E6E6" }}
                                    type="text"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                />
                            </div>

                            <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                    <span className="txt-site txt-11 txt-main txt-bold">
                                        Goal<span style={{ color: "red" }}>*</span>
                                    </span>
                                </div>
                                <input
                                    readOnly
                                    style={{ backgroundColor: "#E6E6E6" }}
                                    type="text"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                />
                            </div>

                            <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                    <span className="txt-site txt-11 txt-main txt-bold">
                                        Destination Area
                                    </span>
                                </div>
                                <DropDown
                                  title="-- please select destination area --"
                                  onChange={(dt) => console.log(dt)}
                                  // type="bizpar"
                                  disabled={true}
                                  data={[
                                    {id: '1', title: 'jakarta', value: 'jakarta'}, 
                                    {id: '1', title: 'bogor', value: 'bogor'}]} />
                                {/*<select
                                    className="cf-select slc slc-sekunder"
                                    disabled
                                    style={{ backgroundColor: "#E6E6E6" }}
                                    required
                                >
                                    <option value="1">Jakarta</option>
                                    <option value="1">Bogor</option>
                                </select>*/}
                            </div>

                            <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                    <span className="txt-site txt-11 txt-main txt-bold">
                                        Location<span style={{ color: "red" }}>*</span>
                                    </span>
                                </div>
                                <input
                                    readOnly
                                    style={{ backgroundColor: "#E6E6E6" }}
                                    type="text"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                />
                            </div>

                            <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                    <span className="txt-site txt-11 txt-main txt-bold">
                                        Participant Description<span style={{ color: "red" }}>*</span>
                                    </span>
                                </div>
                                <input
                                    readOnly
                                    style={{ backgroundColor: "#E6E6E6" }}
                                    type="text"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                />
                            </div>

                            <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                    <span className="txt-site txt-11 txt-main txt-bold">
                                        Cost Description<span style={{ color: "red" }}>*</span>
                                    </span>
                                </div>
                                <input
                                    readOnly
                                    style={{ backgroundColor: "#E6E6E6" }}
                                    type="text"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                />
                            </div>

                            <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                    <span className="txt-site txt-11 txt-main txt-bold">
                                        Header Editor<span style={{ color: "red" }}>*</span>
                                    </span>
                                </div>
                                <input
                                    readOnly
                                    style={{ backgroundColor: "#E6E6E6" }}
                                    type="text"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                />
                            </div>

                        </div>
                    </div>
                    <div className="border-bottom padding-30px grid-mobile-none gap-20px">
                    </div>
                    <div className="padding-15px">
                        <div className="grid grid-2x">
                            <div className="col-1" />
                            <div className="col-2 content-right">
                                <button style={{
                                    marginLeft: "15px"
                                }}
                                    className="btn btn-primary"
                                    type="button"
                                    onClick={this.props.onClickClose}>
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

export default FormDetail