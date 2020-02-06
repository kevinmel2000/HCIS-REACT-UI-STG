import React, { Component } from 'react'

class FormMasterCoaCreate extends Component {
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
                                COA - {title}
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button className="btn btn-circle background-blue">
                                <i className="fa fa-lg fa-times"></i>
                            </button>
                        </div>
                    </div>

                    <form action="#">
                        <div className="padding-15px grid-mobile-none gap-20px">
                            <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                    <span className="txt-site txt-11 txt-main txt-bold">
                                        COA Code <span style={{ color: "red" }}>*</span>
                                    </span>
                                    <input
                                        type="text"
                                        readOnly={type !== "create"}
                                        style={{ backgroundColor: type !== "create" ? "#E6E6E6" : "" }}
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                    ></input>
                                </div>
                            </div>
                            <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                    <span className="txt-site txt-11 txt-main txt-bold">
                                        COA Name <span style={{ color: "red" }}>*</span>
                                    </span>
                                    <input
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                    ></input>
                                </div>
                            </div>
                            <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                    <span className="txt-site txt-11 txt-main txt-bold">
                                        STATUS
                                    </span>
                                </div>
                                <label className="switch green">
                                    <input type="checkbox" />
                                    <span className="slider round status-on-off" />
                                </label>
                            </div>
                        </div>
                    </form>

                    <div className="padding-15px">
                        <div className="grid grid-2x">
                            <div className="col-1"></div>
                            <div className="col-2 content-right">
                                <button
                                    style={{ marginLeft: "15px" }}
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
                <div className="padding-bottom-20px"></div>
            </div>
        )
    }
}

export default FormMasterCoaCreate