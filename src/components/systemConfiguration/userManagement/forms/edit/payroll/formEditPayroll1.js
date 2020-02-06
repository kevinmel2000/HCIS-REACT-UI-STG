import React, { Component } from 'react'
import ReactTooltip from 'react-tooltip'
import DropDown from '../../../../../../modules/popup/DropDown'

class FormEditPayroll1 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: this.props.rawData
        }
    }

    render() {
        return (
            <div className="a-s-p-place active">
                <div className="a-s-p-top">
                    <div className="grid grid-2x">
                        <div className="col-1">
                            <div className="display-flex-normal margin-top-10px">
                                <i className="fa fa-1x fa-mail-bulk"></i>
                                <span className="txt-site txt-11 txt-main margin-left-10px">
                                    Payroll Header Detail
									</span>
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button
                                onClick={this.props.closeSlide}
                                className="btn btn-circle btn-grey">
                                <i className="fa fa-lg fa-arrow-right" />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="a-s-p-mid a-s-p-pad border-top">
                    <div className="padding-top-20px margin-bottom-20px display-flex-normal">
                        <i className="fa fa-lg fa-mail-bulk margin-right-10px margin-top-5px"></i>
                        <h1 className="txt-site txt-18 txt-main ">Payroll Template Detail</h1>
                    </div>

                    <div className="display-flex-normals margin-bottom-10px">
                        <div className="padding-top-15px padding-bottom-15px">
                            <div className="margin-bottom-30px">
                                <div className="txt-site txt-13 txt-bold txt-main display-flex-normal">
                                    <h3>TID</h3>
                                    <i
                                        data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                                        className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i>
                                </div>
                                <div className="txt-site txt-11 txt-primary margin-10px">
                                    The ID of Corporate Organisation Template
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
                                <div className="txt-site txt-13 txt-bold txt-main display-flex-normal">
                                    <h3>Name</h3>
                                    <i
                                        data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                                        className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i>
                                </div>
                                <div className="txt-site txt-11 txt-primary margin-10px">
                                    The ID of Corporate Organisation Template
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
                                <div className="txt-site txt-13 txt-bold txt-main display-flex-normal">
                                    <h3>Segment</h3>
                                    <i
                                        data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                                        className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i>
                                </div>
                                <div className="txt-site txt-11 txt-primary margin-10px">
                                    The ID of Corporate Organisation Template
                                            </div>
                                <div className="margin-15px">
                                    {/* untuk contoh lihat configuration corporate time */}
                                    <DropDown 
                                        title="-- please select holiday type --" 
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
                                    {/* <select className="slc slc-sekunder">
                                        <option value="">-- please select type --</option>
                                        <option>TYPE_HOLDING</option>
                                    </select> */}
                                </div>
                            </div>
                            <div className="margin-bottom-30px">
                                <div className="txt-site txt-13 txt-bold txt-main display-flex-normal">
                                    <h3>Component</h3>
                                    <i
                                        data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                                        className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i>
                                </div>
                                <div className="txt-site txt-11 txt-primary margin-10px">
                                    The ID of Corporate Organisation Template
                                </div>
                                <div className="margin-15px">
                                    {/* untuk contoh lihat configuration corporate time */}
                                    <DropDown 
                                        title="-- please select holiday type --" 
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
                                    {/* <select className="slc slc-sekunder">
                                        <option value="">-- please select type --</option>
                                        <option>COMPONENT_A</option>
                                    </select> */}
                                </div>
                            </div>
                            <div className="margin-bottom-30px">
                                <div className="txt-site txt-13 txt-bold txt-main display-flex-normal">
                                    <h3>Activation</h3>
                                    <i
                                        data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                                        className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i>
                                </div>
                                <div className="txt-site txt-11 txt-primary margin-10px">
                                    The ID of Corporate Organisation Template
                                            </div>
                                <div className="margin-15px">
                                    <label className="radio">
                                        <input type="checkbox" name="all-day"
                                        />
                                        <span className="checkmark" />
                                        <span className="txt-site txt-11 txt-bold txt-main">
                                            Activate Now
                                        </span>
                                    </label>
                                </div>
                            </div>
                            <div className="margin-bottom-30px">
                                <div className="txt-site txt-13 txt-bold txt-main display-flex-normal">
                                    <h3>Default</h3>
                                    <i
                                        data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                                        className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i>
                                </div>
                                <div className="txt-site txt-11 txt-primary margin-10px">
                                    The ID of Corporate Organisation Template
                                            </div>
                                <div className="margin-15px">
                                    <label className="radio">
                                        <input type="checkbox" name="all-day"
                                        />
                                        <span className="checkmark" />
                                        <span className="txt-site txt-11 txt-bold txt-main">
                                            Activate Now
                                        </span>
                                    </label>
                                </div>
                            </div>
                            <div className="margin-bottom-30px">
                                <div className="txt-site txt-13 txt-bold txt-main display-flex-normal">
                                    <h3>Special Calc</h3>
                                    <i
                                        data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                                        className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i>
                                </div>
                                <div className="txt-site txt-11 txt-primary margin-10px">
                                    Time when the is activate
                                </div>
                                <div className="margin-15px">
                                    <label className="radio">
                                        <input type="checkbox" name="status"
                                        />
                                        <span className="checkmark" />
                                        <span className="txt-site txt-11 txt-bold txt-main">
                                            Activate now
                                        </span>
                                    </label>
                                </div>
                            </div>
                            <div className="margin-bottom-30px">
                                <div className="txt-site txt-13 txt-bold txt-main display-flex-normal">
                                    <h3>Tax Type</h3>
                                    <i
                                        data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                                        className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i>
                                </div>
                                <div className="txt-site txt-11 txt-primary margin-10px">
                                    The date of current status
                                </div>
                                <div className="margin-15px">
                                    {/* untuk contoh lihat configuration corporate time */}
                                    <DropDown 
                                        title="-- please select holiday type --" 
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
                                    {/* <select className="slc slc-sekunder">
                                        <option value="">-- please select type --</option>
                                        <option>GROSSUP</option>
                                    </select> */}
                                </div>
                            </div>
                            <div className="margin-bottom-30px">
                                <div className="txt-site txt-13 txt-bold txt-main display-flex-normal">
                                    <h3>COA Type</h3>
                                    <i
                                        data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                                        className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i>
                                </div>
                                <div className="txt-site txt-11 txt-primary margin-10px">
                                    The date of current status
                                </div>
                                <div className="margin-15px">
                                    {/* untuk contoh lihat configuration corporate time */}
                                    <DropDown 
                                        title="-- please select holiday type --" 
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
                                    {/* <select className="slc slc-sekunder">
                                        <option value="">-- please select type --</option>
                                        <option>GROSSUP</option>
                                    </select> */}
                                </div>
                            </div>
                            <div className="margin-bottom-30px">
                                <div className="txt-site txt-13 txt-bold txt-main display-flex-normal">
                                    <h3>Note</h3>
                                    <i
                                        data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                                        className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i>
                                </div>
                                <div className="txt-site txt-11 txt-primary margin-10px">
                                    The ID of Corporate Organisation Template
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

                            <div className="border-top padding-top-20px">
                                <div className="grid grid-2x">
                                    <div className="col-1 content-left">
                                        <button
                                            onClick={this.props.closeSlide}
                                            className="btn btn-sekunder margin-right-10px content-left">
                                            Back
                                            </button>
                                    </div>
                                    <div className="col-2 content-right">
                                        <button
                                            type="button"
                                            className="btn btn-green"
                                            onClick={this.props.onClickSave}>
                                            Save
                                            </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div >

                <ReactTooltip />

            </div >
        )

    }
}

export default FormEditPayroll1