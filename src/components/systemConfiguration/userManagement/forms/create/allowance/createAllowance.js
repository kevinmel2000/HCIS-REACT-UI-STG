import React, { Component } from "react";
import DropDown from '../../../../../../modules/popup/DropDown'
import M from "moment";
import NumberFormat from "react-number-format";
// import * as R from 'ramda'

const dateNow = M().format("DD-MM-YYYY HH:mm:ss");

const payload = {
    "cnbcomponentAllowanceID": "CNBCA-" + M(),
    "cnbcomponentAllowanceName": "",
    "cnbcomponentAllowanceStatus": "ACTIVE",
    "cnbcomponentAllowanceDescription": "",
    "cnbcomponentAllowanceType": "",
    "cnbcomponentAmount": null,
    "cnbcomponentGrade": "",
    "cnbcomponentKey": "",
    "cnbcomponentName": "",
    "creationalSpecificationDTO": {
        "createdBy": "SYSTEM",
        "createdDate": dateNow,
        "modifiedBy": null,
        "modifiedDate": null
    }
}

class CreateAllowance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                ...payload
            }
        };
    }

    render() {
        return (
            <div>
                <div className="app-popup app-popup-show">
                    <div className="padding-top-20px" />
                    <div className="popup-content background-white border-radius">
                        <div className="popup-panel grid grid-2x">
                            <div className="col-1">
                                <div className="popup-title">
                                    {"C&B Component Allowance - Create Form"}
                                </div>
                            </div>
                            <div className="col-2 content-right">
                                <button
                                    className="btn btn-circle btn-grey"
                                    onClick={this.props.onClickClose}
                                >
                                    <i className="fa fa-lg fa-times" />
                                </button>
                            </div>
                        </div>
                        <form
                            action="#"
                            onSubmit={e => {
                                e.preventDefault();
                                console.log(this.state.data)
                                this.props.onClickSave(this.state.data)
                            }}
                        >
                            <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-15px">
                                <div className="column-1">
                                    <div className="margin-bottom-15px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>
                                                    C&B Component ID<span style={{ color: "red" }}>*</span>
                                                </h4>
                                            </div>
                                        </div>
                                        <input
                                            type="text"
                                            className="txt txt-sekunder-color"
                                            readOnly
                                            value={this.state.data.cnbcomponentAllowanceID}
                                            style={{ backgroundColor: "#E6E6E6" }}
                                            placeholder={"C&B Component ID"}
                                        />
                                    </div>
                                    <div className="margin-bottom-15px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>
                                                    Name <span style={{ color: "red" }}>*</span>
                                                </h4>
                                            </div>
                                        </div>
                                        <input
                                            type="text"
                                            onChange={(e) => this.setState({
                                                data: {
                                                    ...this.state.data,
                                                    cnbcomponentAllowanceName: e.target.value
                                                }
                                            })}
                                            required
                                            value={this.state.data.cnbcomponentAllowanceName}
                                            className="txt txt-sekunder-color"
                                            placeholder={"Name"}
                                        />
                                    </div>
                                    <div className="margin-bottom-15px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>
                                                    Component Type <span style={{ color: "red" }}>*</span>
                                                </h4>
                                            </div>
                                        </div>
                                        <DropDown
                                            type='bizpar'
                                            data={this.props.cnbType}
                                            title="-- please select Type --"
                                            onChange={(dt) => this.setState({
                                                data: {
                                                    ...this.state.data,
                                                    cnbcomponentAllowanceType: dt
                                                }
                                            })}
                                            value={this.state.data.cnbcomponentAllowanceType}
                                        />
                                    </div>
                                    <div className="margin-bottom-15px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>
                                                    Component Name <span style={{ color: "red" }}>*</span>
                                                </h4>
                                            </div>
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            onChange={(e) => this.setState({
                                                data: {
                                                    ...this.state.data,
                                                    cnbcomponentName: e.target.value
                                                }
                                            })}
                                            className="txt txt-sekunder-color"
                                            placeholder={"Component Name"}
                                            value={this.state.data.cnbcomponentName}
                                        />
                                    </div>
                                    <div className="margin-bottom-15px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>
                                                    Component Key <span style={{ color: "red" }}>*</span>
                                                </h4>
                                            </div>
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            onChange={(e) => this.setState({
                                                data: {
                                                    ...this.state.data,
                                                    cnbcomponentKey: e.target.value
                                                }
                                            })}
                                            className="txt txt-sekunder-color"
                                            placeholder={"Component Key"}
                                            value={this.state.data.cnbcomponentKey}
                                        />
                                    </div>
                                </div>
                                <div className="column-2">
                                    <div className="margin-bottom-15px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>
                                                    Grade <span style={{ color: "red" }}>*</span>
                                                </h4>
                                            </div>
                                        </div>
                                        <DropDown
                                            data={this.props.bizparGrade}
                                            title="-- please select Grade --"
                                            type='bizpar'
                                            onChange={(dt) => this.setState({
                                                data: {
                                                    ...this.state.data,
                                                    cnbcomponentGrade: dt
                                                }
                                            })}
                                            value={this.state.data.cnbcomponentGrade}
                                        />
                                    </div>
                                    <div className="margin-bottom-15px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>
                                                    Amount <span style={{ color: "red" }}>*</span>
                                                </h4>
                                            </div>
                                        </div>
                                        <div className="card-date-picker">
                                            <div className="double">
                                                <NumberFormat
                                                    thousandSeparator={true}
                                                    value={this.state.data.cnbcomponentAmount}
                                                    className="txt txt-sekunder-color"
                                                    placeholder="0"
                                                    onValueChange={(e) => this.setState({
                                                        data: {
                                                            ...this.state.data,
                                                            cnbcomponentAmount: e.formattedValue
                                                        }
                                                    })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="margin-bottom-15px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>
                                                    Description<span style={{ color: "red" }}>*</span>
                                                </h4>
                                            </div>
                                        </div>
                                        <textarea
                                            type="text"
                                            className="txt txt-sekunder-color"
                                            onChange={(e) => this.setState({
                                                data: {
                                                    ...this.state.data,
                                                    cnbcomponentAllowanceDescription: e.target.value
                                                }
                                            })}
                                            required
                                            placeholder="Description"
                                            cols="80"
                                            rows="5"
                                            value={this.state.data.cnbcomponentAllowanceDescription}
                                        />
                                    </div>
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Activation</h4>
                                        </div>
                                        <div className="margin-15px">
                                            <label className="radio">
                                                <input type="checkbox" name="status" checked={this.state.data.cnbcomponentAllowanceStatus === "ACTIVE" ? true : false} onClick={() => this.setState({ data: { ...this.state.data, cnbcomponentAllowanceStatus: this.state.data.cnbcomponentAllowanceStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE" } })} />
                                                <span className="checkmark" />
                                                <span className="txt-site txt-11 txt-bold txt-main">
                                                    is Active
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="padding-15px">
                                        <div className="grid grid-2x">
                                            <div className="col-1"></div>
                                            <div className="col-2 content-right">
                                                <button className="btn btn-blue" type='submit'>SAVE</button>
                                                <button
                                                    style={{ marginLeft: "15px" }}
                                                    className="btn btn-primary"
                                                    type="button"
                                                    onClick={this.props.onClickClose.bind(this)}
                                                >
                                                    <span>CLOSE</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default CreateAllowance;
