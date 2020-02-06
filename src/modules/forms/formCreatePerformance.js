import React, { Component } from "react";
import FormSearchPerform from "./formSearchPerform";

import DropDown from '../../modules/popup/DropDown';

class FormInsGeneralEd extends Component {
    constructor(props) {
        super(props)
        this.state = {
            //leaveData: props.leaveData,
            searchVisible: false
        }
    }

    openSearchForm = () => {
        this.setState({ searchVisible: !this.state.searchVisible })
    };

    render() {
        return (
            <div className="vertical-tab-content active">
                <form action="#">
                    <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-20px">
                        
                        <div className="column-1">
                            <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                    <span className="txt-site txt-11 txt-main txt-bold">
                                        No Request <span style={{ color: "red" }}>*</span>
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
                                        Employee Name
                                </span>
                                </div>
                                <input
                                    style={this.props.type === "view" ? {
                                        backgroundColor: '#E6E6E6', width: "81%",
                                        marginRight: 10
                                    }:{width: "84%"}}
                                    className="txt txt-sekunder-color"
                                    type="text"
                                    readOnly={this.props.type === "view" ? true : false}
                                    placeholder=""
                                ></input>
                                <button
                                    disabled={this.props.type === "create" ? false : true}
                                    className={"btn btn-circle background-primary"}
                                    type="button"
                                    style={{marginLeft:10}}
                                    onClick={this.openSearchForm}
                                >
                                    <i className="fa fa-lg fa-search"></i>
                                </button>
                            </div>

                            <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                    <span className="txt-site txt-11 txt-main txt-bold">
                                        Division
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
                                        Assessment Format <span style={{ color: "red" }}>*</span>
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

                        <div className="column-2">
                            <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                    <span className="txt-site txt-11 txt-main txt-bold">
                                        Assessment Period <span style={{ color: "red" }}>*</span>
                                    </span>
                                </div>
                                <DropDown
                                    title="-- please select assessment period --"
                                    onChange={(dt) => console.log(dt)}
                                    // type="bizpar"
                                    disabled={this.props.type === "create" ? false : true}
                                    data={[{id: '1', title: '1', value: 'bs-1'}]} />
                                {/*<select
                                    className="cf-select slc slc-sekunder"
                                    disabled={this.props.type === "create" ? false : true}
                                    style={
                                        this.props.type === "create"
                                            ? null
                                            : { backgroundColor: "#E6E6E6" }
                                    }
                                    required
                                >
                                    <option value="1">-- please select assessment period --</option>
                                    <option value="1">1</option>
                                </select>*/}
                            </div>


                            <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                    <span className="txt-site txt-11 txt-main txt-bold">
                                        Year <span style={{ color: "red" }}>*</span>
                                    </span>
                                </div>
                                <input
                                    readOnly={this.props.type === "view" ? true : false}
                                    style={this.props.type === "view" ? { backgroundColor: "#E6E6E6" } : null}
                                    type="text"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                />
                            </div>

                            <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                    <span className="txt-site txt-11 txt-main txt-bold">
                                        Assessment Date <span style={{ color: "red" }}>*</span>
                                    </span>
                                </div>
                                <input
                                    readOnly={this.props.type === "view" ? true : false}
                                    style={this.props.type === "view" ? { backgroundColor: '#E6E6E6' } : null}
                                    type="date"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                />
                            </div>

                            <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                    <span className="txt-site txt-11 txt-main txt-bold">
                                        Description
                                        </span>
                                </div>
                                <textarea
                                    readOnly={this.props.type === "view" ? true : false}
                                    style={this.props.type === "view" ? { backgroundColor: "#E6E6E6", height: 95 } : { height: 95 }}
                                    type="text"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="padding-15px">
                        <div className="grid grid-2x">
                            <div className="col-1" />
                            <div className="col-2 content-right">
                                {this.props.type === "create" ? (
                                    <button
                                        style={{ marginLeft: "15px" }}
                                        className="btn btn-blue"
                                        type="button"
                                        onClick={() => this.props.onClickSave()}
                                    >
                                        <span>SAVE</span>
                                    </button>) : null}
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
                    {this.state.searchVisible && (
                        < FormSearchPerform
                            onClickClose={this.openSearchForm}
                        />
                    )}
                </form>
            </div>
        );
    }
}

export default FormInsGeneralEd;
