import React, { Component } from "react"

import DropDown from '../../modules/popup/DropDown'

class FormDetEdPerformance extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    render() {
        return (
            <div className="vertical-tab-content active">
                    <form action="#">
                        <div className="border-bottom padding-15px grid-mobile-none gap-20px">
                            <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                    <span className="txt-site txt-11 txt-main txt-bold">
                                        No Request
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
                                        Subject
                                     </span>
                                </div>
                                <input
                                    readOnly
                                    style={
                                        { backgroundColor: "#E6E6E6" }
                                    }
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
                                <textarea
                                    readOnly
                                    style={
                                        { backgroundColor: "#E6E6E6" }
                                    }
                                    type="text"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                />
                            </div>

                            <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                    <span className="txt-site txt-11 txt-main txt-bold">
                                        Assessment Period
                                    </span>
                                </div>
                                <DropDown
                                    title="-- please select assessment period --"
                                    onChange={(dt) => console.log(dt)}
                                    // type="bizpar"
                                    disabled={this.props.type === "create" ? true : false}
                                    value={'bs-1'}
                                    data={[{id: '1', title: '1', value: 'bs-1'}]} />
                                {/*<select
                                    className="cf-select slc slc-sekunder"
                                    disabled={true}
                                    style={
                                        { backgroundColor: "#E6E6E6" }
                                    }
                                    required
                                >
                                    <option value="1">-- please select type --</option>
                                    <option value="1">1</option>
                                </select>*/}
                            </div>

                            <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                    <span className="txt-site txt-11 txt-main txt-bold">
                                        Score (1-50) <span style={{ color: "red" }}>*</span>
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                />
                            </div>
                        </div>

                        <div className="padding-15px">
                            <div className="grid grid-2x">
                                <div className="col-1" />
                                <div className="col-2 content-right">
                                    <button
                                        style={{ marginLeft: "15px" }}
                                        className="btn btn-blue"
                                        type="button"
                                        onClick={this.props.onClickSave2}
                                    >
                                        <span>SAVE</span>
                                    </button>
                                    <button
                                        style={{ marginLeft: "15px" }}
                                        className="btn btn-blue"
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
        );
    }
}

export default FormDetEdPerformance;
