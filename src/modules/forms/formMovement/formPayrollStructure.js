import React, { Component } from "react";

class FormPayrollStructure extends Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

   
    render () {

        return (
            <div className={'app-popup app-popup-show'}>
                <div className="padding-top-20px" />
                <div className="popup-content-small background-white border-radius">
                    <div className="padding-15px background-blue grid grid-2x">
                        <div className="col-1">
                            <div className="txt-site txt-12 txt-bold post-center">
                                {this.props.label}
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button
                                type="button"
                                className="btn btn-circle background-blue"
                                onClick={this.props.onClose}
                            >
                                <i className="fa fa-lg fa-times" />
                            </button>
                        </div>
                    </div>
                    <form action="#">
                        <div className="padding-15px grid-mobile-none gap-20px">
                            {this.props.type !== "create" ? (
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <span className="txt-site txt-11 txt-main txt-bold">
                                            Value
                                        </span>
                                    </div>
                                    <input
                                        readOnly={this.props.type === "view" ? true : false}
                                        width="100%"
                                        style={
                                            
                                            this.props.type === "view"
                                                ? { backgroundColor: "#E6E6E6" }
                                                : null
                                        }
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                        required
                                    />
                                    <div className="margin-5px">
                                        <span className="txt-site txt-11 txt-main txt-bold">
                                            Start Date
                                        </span>
                                    </div>
                                    <input
                                        readOnly={this.props.type === "view" ? true : false}
                                        width="100%"
                                        style={
                                            this.props.type === "view"
                                                ? { backgroundColor: "#E6E6E6" }
                                                : null
                                        }
                                        type="date"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                        required
                                    />
                                </div>
                            ) : null}
                        </div>

                        <div className="padding-15px">
                            <div className="grid grid-2x">
                                <div className="col-1" />
                                <div className="col-2 content-right">
                                    {this.props.type !== "view" ? (
                                        <button
                                            style={{ marginLeft: "15px" }}
                                            className="btn btn-blue"
                                            type="button"
                                            onClick={this.props.onSave}
                                            
                                        >
                                            <span>SAVE</span>
                                        </button>
                                    ) : null}
                                    <button
                                        style={{ marginLeft: "15px" }}
                                        className="btn btn-blue"
                                        type="button"
                                        onClick={this.props.onClose}
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
        )
    }
    

}

export default FormPayrollStructure;