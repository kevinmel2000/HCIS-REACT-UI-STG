import React, { Component } from 'react'
import DropDown from '../../../../../../modules/popup/DropDown'

class FormCreatePayroll1 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: this.props.rawData
        }
    }

    render() {
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px" />
                <div className="popup-content background-white border-radius">

                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="popup-title">
                                Payroll TPL Detail
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button
                                type="button"
                                className="btn btn-circle btn-grey"
                                onClick={this.props.onClickClose}>
                                <i className="fa fa-lg fa-times" />
                            </button>
                        </div>
                    </div>

                    <form action="#">
                        <div className="display-flex-normal">
                            <div style={{ width: '50%' }}>
                                <div className="padding-15px">
                                    <div className="margin-bottom-30px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h3>Payroll TPL ID</h3>
                                        </div>
                                        <div className="margin-15px">
                                            <div className="card-date-picker">
                                                <div className="double">
                                                    <input
                                                        type="text"
                                                        className="txt txt-sekunder-color"
                                                        placeholder="AUTO-GENERATED-00001"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="margin-bottom-30px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h3>Payroll TPL Segment</h3>
                                        </div>
                                        <div className="margin-15px">
                                            <DropDown
                                                title="-- please select payroll tpl segment --"
                                                onChange={(dt) => {
                                                    console.log(dt)
                                                }}
                                                data={[
                                                    { id: '1', title: 'Drop Down 1', value: 'DD-1' },
                                                    { id: '2', title: 'Drop Down 2', value: 'DD-2' },
                                                    { id: '3', title: 'Drop Down 3', value: 'DD-3' },
                                                    { id: '4', title: 'Drop Down 4', value: 'DD-4' },
                                                    { id: '5', title: 'Drop Down 5', value: 'DD-5' },
                                                    { id: '6', title: 'Drop Down 6', value: 'DD-6' }
                                                ]} />
                                        </div>
                                    </div>
                                    <div className="margin-bottom-30px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h3>Tax Type</h3>
                                        </div>
                                        <div className="margin-15px">
                                            <DropDown
                                                title="-- please select tax type --"
                                                onChange={(dt) => {
                                                    console.log(dt)
                                                }}
                                                data={[
                                                    { id: '1', title: 'Drop Down 1', value: 'DD-1' },
                                                    { id: '2', title: 'Drop Down 2', value: 'DD-2' },
                                                    { id: '3', title: 'Drop Down 3', value: 'DD-3' },
                                                    { id: '4', title: 'Drop Down 4', value: 'DD-4' },
                                                    { id: '5', title: 'Drop Down 5', value: 'DD-5' },
                                                    { id: '6', title: 'Drop Down 6', value: 'DD-6' }
                                                ]} />
                                        </div>
                                    </div>
                                    <div className="margin-bottom-30px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h3>Tax 1721A1 Type</h3>
                                        </div>
                                        <div className="margin-15px">
                                            <DropDown
                                                title="-- please select tax type --"
                                                onChange={(dt) => {
                                                    console.log(dt)
                                                }}
                                                data={[
                                                    { id: '1', title: 'Drop Down 1', value: 'DD-1' },
                                                    { id: '2', title: 'Drop Down 2', value: 'DD-2' },
                                                    { id: '3', title: 'Drop Down 3', value: 'DD-3' },
                                                    { id: '4', title: 'Drop Down 4', value: 'DD-4' },
                                                    { id: '5', title: 'Drop Down 5', value: 'DD-5' },
                                                    { id: '6', title: 'Drop Down 6', value: 'DD-6' }
                                                ]} />
                                        </div>
                                    </div>
                                    <div className="margin-bottom-30px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h3>COA Type</h3>
                                        </div>
                                        <div className="margin-15px">
                                            <DropDown
                                                title="-- please select coa type --"
                                                onChange={(dt) => {
                                                    console.log(dt)
                                                }}
                                                data={[
                                                    { id: '1', title: 'Drop Down 1', value: 'DD-1' },
                                                    { id: '2', title: 'Drop Down 2', value: 'DD-2' },
                                                    { id: '3', title: 'Drop Down 3', value: 'DD-3' },
                                                    { id: '4', title: 'Drop Down 4', value: 'DD-4' },
                                                    { id: '5', title: 'Drop Down 5', value: 'DD-5' },
                                                    { id: '6', title: 'Drop Down 6', value: 'DD-6' }
                                                ]} />
                                        </div>
                                    </div>
                                    <div className="margin-bottom-30px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h3>Special Calc</h3>
                                        </div>
                                        <div className="margin-15px">
                                            <label className="radio">
                                                <input type="checkbox" name="all-day" />
                                                <span className="checkmark" />
                                                <span className="txt-site txt-11 txt-bold txt-main">
                                                    Activate Now
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ width: '50%' }}>
                                <div className="padding-15px">
                                    <div className="margin-bottom-30px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h3>Payroll TPL Component</h3>
                                        </div>
                                        <div className="margin-15px">
                                            <DropDown
                                                title="-- please select payroll tpl component --"
                                                onChange={(dt) => {
                                                    console.log(dt)
                                                }}
                                                data={[
                                                    { id: '1', title: 'Drop Down 1', value: 'DD-1' },
                                                    { id: '2', title: 'Drop Down 2', value: 'DD-2' },
                                                    { id: '3', title: 'Drop Down 3', value: 'DD-3' },
                                                    { id: '4', title: 'Drop Down 4', value: 'DD-4' },
                                                    { id: '5', title: 'Drop Down 5', value: 'DD-5' },
                                                    { id: '6', title: 'Drop Down 6', value: 'DD-6' }
                                                ]} />
                                        </div>
                                    </div>
                                    <div className="margin-bottom-30px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h3>Payroll TPL Component Type</h3>
                                        </div>
                                        <div className="margin-15px">
                                            <DropDown
                                                title="-- please select payroll tpl component type --"
                                                onChange={(dt) => {
                                                    console.log(dt)
                                                }}
                                                data={[
                                                    { id: '1', title: 'Drop Down 1', value: 'DD-1' },
                                                    { id: '2', title: 'Drop Down 2', value: 'DD-2' },
                                                    { id: '3', title: 'Drop Down 3', value: 'DD-3' },
                                                    { id: '4', title: 'Drop Down 4', value: 'DD-4' },
                                                    { id: '5', title: 'Drop Down 5', value: 'DD-5' },
                                                    { id: '6', title: 'Drop Down 6', value: 'DD-6' }
                                                ]} />
                                        </div>
                                    </div>
                                    <div className="margin-bottom-30px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h3>Sequence</h3>
                                        </div>
                                        <div className="margin-15px">
                                            <div className="card-date-picker">
                                                <div className="double">
                                                    <input
                                                        type="text"
                                                        className="txt txt-sekunder-color"
                                                        placeholder="AUTO-GENERATED-00001"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="padding-15px grid grid-2x">
                                        <div className="col-1">
                                            <div className="margin-bottom-30px">
                                                <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                                    <h3>Default</h3>
                                                </div>
                                                <div className="margin-15px">
                                                    <label className="radio">
                                                        <input type="checkbox" name="all-day" />
                                                        <span className="checkmark" />
                                                        <span className="txt-site txt-11 txt-bold txt-main">
                                                            Activate Now
                                                    </span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="margin-bottom-30px">
                                                <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                                    <h3>Is Fix</h3>
                                                </div>
                                                <div className="margin-15px">
                                                    <label className="radio">
                                                        <input type="checkbox" name="status" />
                                                        <span className="checkmark" />
                                                        <span className="txt-site txt-11 txt-bold txt-main">
                                                            Activate now
                                                </span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-2">
                                            <div className="margin-bottom-30px">
                                                <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                                    <h3>Activation</h3>
                                                </div>
                                                <div className="margin-15px">
                                                    <label className="radio">
                                                        <input type="checkbox" name="all-day" />
                                                        <span className="checkmark" />
                                                        <span className="txt-site txt-11 txt-bold txt-main">
                                                            Activate Now
                                                    </span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="margin-bottom-30px">
                                                <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                                    <h3>Is Regular</h3>
                                                </div>
                                                <div className="margin-15px">
                                                    <label className="radio">
                                                        <input type="checkbox" name="status" />
                                                        <span className="checkmark" />
                                                        <span className="txt-site txt-11 txt-bold txt-main">
                                                            Activate now
                                                </span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="margin-bottom-30px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h3>Note</h3>
                                        </div>
                                        <div className="margin-15px">
                                            <div className="card-date-picker">
                                                <textarea
                                                    row={10}
                                                    type="text"
                                                    className="txt txt-sekunder-color"
                                                    placeholder="Jln. Satrio"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-top padding-15px content-right">
                            <button
                                onClick={this.props.onClickClose}
                                className="btn btn-sekunder margin-right-10px">
                                Back
                             </button>
                            <button
                                className="btn btn-blue"
                                type='button'
                                onClick={this.props.onClickSave}>
                                Save
                            </button>
                        </div>
                    </form>

                </div>
                <div className="padding-top-20px" />
            </div>
        )
    }
}

export default FormCreatePayroll1