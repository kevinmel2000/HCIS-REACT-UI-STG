import React, { Component } from 'react'

import DropDown from '../../../modules/popup/DropDown'

class PercentageParameterMaxCreate extends Component {
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
                                PERCENTAGE PARAMETER -  {title}
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
                                            Component ID <span style={{color: "red"}}>*</span>
                                        </span>
                                    </div>
                                    <DropDown
                                        title="-- please select component id --"
                                        onChange={(dt) => console.log(dt)}
                                        // type="bizpar"
                                        disabled={this.props.type === "update" ? true : false}
                                        data={[{id: '1', title: 'All', value: 'bs-1'}]} />
                                    {/*<select
                                        className="cf-select slc slc-sekunder"
                                        style={{ backgroundColor: type === "update" ? "#E6E6E6" : "" }}
                                        disabled={ type === "update"}>
                                        <option value="">-- please select id structure --</option>
                                        <option value="">BONUS</option>
                                    </select>*/}
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <span className="txt-site txt-11 txt-main txt-bold">
                                            Structure ID <span style={{color: "red"}}>*</span>
                                        </span>
                                    </div>
                                    <DropDown
                                        title="-- please select structure id --"
                                        onChange={(dt) => console.log(dt)}
                                        // type="bizpar"
                                        disabled={this.props.type === "update" ? true : false}
                                        data={[{id: '1', title: 'All', value: 'bs-1'}]} />
                                    {/*<select
                                        className="cf-select slc slc-sekunder"
                                        style={{ backgroundColor: type === "update" ? "#E6E6E6" : "" }}
                                        disabled={ type === "update"}>
                                        <option value="">-- please select structure code --</option>
                                        <option value="">ALL</option>
                                    </select>*/}
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <span className="txt-site txt-11 txt-main txt-bold">
                                            Structure Name <span style={{color: "red"}}>*</span>
                                        </span>
                                    </div>
                                    <DropDown
                                        title="-- please select structure name --"
                                        onChange={(dt) => console.log(dt)}
                                        // type="bizpar"
                                        disabled={this.props.type === "update" ? true : false}
                                        data={[{id: '1', title: 'All', value: 'bs-1'}]} />
                                    {/*<select
                                        className="cf-select slc slc-sekunder"
                                        style={{ backgroundColor: type === "update" ? "#E6E6E6" : "" }}
                                        disabled={ type === "update"}>
                                        <option value="">-- please select id structure 2 --</option>
                                        <option value="">ALL</option>
                                    </select>*/}
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <span className="txt-site txt-11 txt-main txt-bold">
                                            Percentage <span style={{color: "red"}}>*</span>
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
                                            Multiplier <span style={{color: "red"}}>*</span>
                                        </span>
                                    </div>
                                    <DropDown
                                        title="-- please select period --"
                                        onChange={(dt) => console.log(dt)}
                                        // type="bizpar"
                                        disabled={this.props.type === "update" ? true : false}
                                        data={[{id: '1', title: 'All', value: 'bs-1'}]} />
                                    {/*<select
                                        className="cf-select slc slc-sekunder">
                                        <option value="">-- please select period --</option>
                                        <option value="">ALL</option>
                                    </select>*/}
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <span className="txt-site txt-11 txt-main txt-bold">
                                            Constanta Value <span style={{color: "red"}}>*</span>
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
                                            Maximum Value* <span style={{color: "red"}}>*</span>
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                    ></input>
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

export default PercentageParameterMaxCreate