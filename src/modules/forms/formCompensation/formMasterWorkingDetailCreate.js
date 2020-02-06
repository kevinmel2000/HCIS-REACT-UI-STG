import React, { Component } from 'react'

import DropDown from '../../../modules/popup/DropDown'

class FormMasterWorkingDetailCreate extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px"></div>
                <div className="popup-content-small background-white border-radius">
                    <div className="padding-15px background-blue grid grid-2x">
                        <div className="col-1">
                            <div className="txt-site txt-12 txt-bold post-center">
                                MASTER - WORKING TYPE - DETAIL - CREATE FORM
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button className="btn btn-circle background-blue" onClick={this.props.onClickClose}>
                                <i className="fa fa-lg fa-times"></i>
                            </button>
                        </div>
                    </div>

                    <form action="#">
                        <div className="padding-15px grid-mobile-none gap-20px">
                            <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                    <span className="txt-site txt-11 txt-main txt-bold">
                                        Working Type
                                    </span>
                                </div>
                                <DropDown
                                        title="-- please select working type --"
                                        onChange={(dt) => console.log(dt)}
                                        // type="bizpar"
                                        disabled={true}
                                        data={[{id: '1', title: 'Gaji Pokok', value: 'bs-1'}]}
                                        value={'bs-1'} />
                                {/*<select className="cf-select slc slc-sekunder" disabled style={{ backgroundColor: '#E6E6E6' }}>
                                    <option value="">-- please select working type --</option>
                                    <option value="">Gaji Pokok</option>
                                </select>*/}
                            </div>
                            <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                    <span className="txt-site txt-11 txt-main txt-bold">
                                        Component ID
                                    </span>
                                </div>
                                <DropDown
                                        title="-- please select Component ID --"
                                        onChange={(dt) => console.log(dt)}
                                        // type="bizpar"
                                        // disabled={true}
                                        data={[{id: '1', title: 'All', value: 'bs-1'}]} />
                                {/*<select className="cf-select slc slc-sekunder">
                                    <option value="">-- please select componnent id --</option>
                                    <option value="">Basic Salary</option>
                                </select>*/}
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

export default FormMasterWorkingDetailCreate