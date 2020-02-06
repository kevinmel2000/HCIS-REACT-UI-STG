import React, { Component } from "react";

class FormSigntobeGeneral extends Component {
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
                                        <h4>NIK</h4>
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    readOnly
                                    style={{ backgroundColor: "#E6E6E6" }}

                                    className="txt txt-sekunder-color"
                                    required
                                />
                            </div>

                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>Employee Name</h4>
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    readOnly
                                    style={{ backgroundColor: "#E6E6E6" }}
                                    className="txt txt-sekunder-color"
                                    required
                                />
                            </div>

                        </div>
                        <div className="column-2">
                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>BRANCH</h4>
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    readOnly
                                    style={{ backgroundColor: "#E6E6E6" }}
                                    className="txt txt-sekunder-color"
                                    required
                                />
                            </div>

                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>POSITION</h4>
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    readOnly
                                    style={{ backgroundColor: "#E6E6E6" }}
                                    className="txt txt-sekunder-color"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="padding-15px">
                        <div className="grid grid-2x">
                            <div className="col-1" />
                            <div className="col-2 content-right">
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

export default FormSigntobeGeneral;