import React, { Component } from 'react'

class FormMasterParameterSingleCreate extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px"></div>
                <div className="popup-content background-white border-radius">
                    <div className="padding-15px background-blue grid grid-2x">
                        <div className="col-1">
                            <div className="txt-site txt-12 txt-bold post-center">
                                SINGLE VALUE - EDIT FORM
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
                                            Parameter ID
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
                                            Parameter Code
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
                                            Parameter Name
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                    ></input>
                                </div>
                            </div>
                            <div className="column-2">
                            <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <span className="txt-site txt-11 txt-main txt-bold">
                                            Number
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
                                            Value
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
                                            Description
                                        </span>
                                    </div>
                                    <textarea
                                        row={5}
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                    ></textarea>
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

export default FormMasterParameterSingleCreate