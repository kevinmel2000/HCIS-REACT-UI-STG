import React, { Component } from 'react'

import DropDown from '../../../modules/popup/DropDown'

class FormMasterJournalCreate extends Component {
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
                                MASTER - JOURNAL - {title}
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
                                            ID Process <span style={{ color: "red" }}>*</span>
                                        </span>
                                    </div>
                                    <DropDown
                                        title="-- please select process id --"
                                        onChange={(dt) => console.log(dt)}
                                        // type="bizpar"
                                        disabled={this.props.type !== "create" ? true : false}
                                        data={[{id: '1', title: 'All', value: 'bs-1'}]} />
                                    {/*<select
                                        className="cf-select slc slc-sekunder"
                                        style={{ backgroundColor: type !== "create" ? "#E6E6E6" : "" }}
                                        disabled={type !== "create"}>
                                        <option value="">-- please select id process --</option>
                                        <option value="">ID Process</option>
                                    </select>*/}
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <span className="txt-site txt-11 txt-main txt-bold">
                                            Sequence <span style={{ color: "red" }}>*</span>
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        readOnly={type !== "create"}
                                        style={type !== "create" ? { backgroundColor: '#E6E6E6' } : {}}
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                    ></input>
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <span className="txt-site txt-11 txt-main txt-bold">
                                            Component <span style={{ color: "red" }}>*</span>
                                        </span>
                                    </div>
                                    <DropDown
                                        title="-- please select component --"
                                        onChange={(dt) => console.log(dt)}
                                        // type="bizpar"
                                        // disabled={this.props.type === "update" ? true : false}
                                        data={[{id: '1', title: 'Basic Salary', value: 'bs-1'}]} />
                                    {/*<select className="cf-select slc slc-sekunder">
                                        <option value="">-- please select component --</option>
                                        <option value="">Basic Salary - GROSS UP</option>
                                    </select>*/}
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <span className="txt-site txt-11 txt-main txt-bold">
                                            Debit Coa Code <span style={{ color: "red" }}>*</span>
                                        </span>
                                    </div>
                                    <DropDown
                                        title="-- please select debit coa code --"
                                        onChange={(dt) => console.log(dt)}
                                        // type="bizpar"
                                        // disabled={this.props.type === "update" ? true : false}
                                        data={[{id: '1', title: '207010000 - PPH21', value: 'bs-1'}]} />
                                    {/*<select className="cf-select slc slc-sekunder">
                                        <option value="">-- please select debit coa code --</option>
                                        <option value="">207010000 - PPH21</option>
                                    </select>*/}
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <span className="txt-site txt-11 txt-main txt-bold">
                                            Debit Branch Type <span style={{ color: "red" }}>*</span>
                                        </span>
                                    </div>
                                    <DropDown
                                        title="-- please select debit branch type --"
                                        onChange={(dt) => console.log(dt)}
                                        // type="bizpar"
                                        // disabled={this.props.type === "update" ? true : false}
                                        data={[{id: '1', title: 'Kantor Pusat', value: 'bs-1'}]} />
                                    {/*<select className="cf-select slc slc-sekunder">
                                        <option value="">-- please select debit branch type --</option>
                                        <option value="">Kantor Pusat</option>
                                    </select>*/}
                                </div>
                            </div>
                            <div className="column-2">
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <span className="txt-site txt-11 txt-main txt-bold">
                                            Credit Coa Code <span style={{ color: "red" }}>*</span>
                                        </span>
                                    </div>
                                    <DropDown
                                        title="-- please select credit coa code --"
                                        onChange={(dt) => console.log(dt)}
                                        // type="bizpar"
                                        // disabled={this.props.type === "update" ? true : false}
                                        data={[{id: '1', title: '207010000', value: 'bs-1'}]} />
                                    {/*<select className="cf-select slc slc-sekunder">
                                        <option value="">-- please select credit coa code --</option>
                                        <option value="">207010000 - PPH21</option>
                                    </select>*/}
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <span className="txt-site txt-11 txt-main txt-bold">
                                            Credit Branch Type <span style={{ color: "red" }}>*</span>
                                        </span>
                                    </div>
                                    <DropDown
                                        title="-- please select credit branch type --"
                                        onChange={(dt) => console.log(dt)}
                                        // type="bizpar"
                                        // disabled={this.props.type === "update" ? true : false}
                                        data={[{id: '1', title: 'Kantor Pusat', value: 'bs-1'}]} />
                                    {/*<select className="cf-select slc slc-sekunder">
                                        <option value="">-- please select credit branch type --</option>
                                        <option value="">Kantor Pusat</option>
                                    </select>*/}
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <span className="txt-site txt-11 txt-main txt-bold">
                                            Credit Debit <span style={{ color: "red" }}>*</span>
                                        </span>
                                    </div>
                                    <DropDown
                                        title="-- please select credit debit --"
                                        onChange={(dt) => console.log(dt)}
                                        // type="bizpar"
                                        // disabled={this.props.type === "update" ? true : false}
                                        data={[{id: '1', title: 'Debit', value: 'bs-1'}]} />
                                    {/*<select className="cf-select slc slc-sekunder">
                                        <option value="">-- please select credit debit --</option>
                                        <option value="">Debit</option>
                                    </select>*/}
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <span className="txt-site txt-11 txt-main txt-bold">
                                            Description
                                        </span>
                                    </div>
                                    <DropDown
                                        title="-- please select description --"
                                        onChange={(dt) => console.log(dt)}
                                        // type="bizpar"
                                        // disabled={this.props.type === "update" ? true : false}
                                        data={[{id: '1', title: 'Basic Salary - Gross Up', value: 'bs-1'}]} />
                                    {/*<select className="cf-select slc slc-sekunder">
                                        <option value="">-- please select description --</option>
                                        <option value="">Basic Salary - GROSS UP</option>
                                    </select>*/}
                                </div>
                            </div>
                        </div>
                    </form>

                    <div className="padding-15px">
                        <div className="grid grid-2x">
                            <div className="col-1"></div>
                            <div className="col-2 content-right">
                                {type !== "detail" ?
                                    <button
                                        className="btn btn-blue"
                                        type="button"
                                        onClick={this.props.onClickSave}>
                                        <span>SAVE</span>
                                    </button> : null}
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

export default FormMasterJournalCreate