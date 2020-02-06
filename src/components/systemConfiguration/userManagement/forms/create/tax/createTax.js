import React, { Component } from 'react'
import M from 'moment'

const defaultPayload = {
    "taxTPLID": "",
    "taxTPLName": "",
    "taxTPLType": "",
    "taxTPLPhotoURL": "",
    "taxTPLStatus": true,
}

class CreateTax extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: { ...defaultPayload, taxTPLID: 'TAX-TPL-' + M() }
        }
    }

    save() {
        return console.log(this.state.data)
    }

    render() {
        let { taxTPLID, taxTPLStatus } = this.state.data
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px" />
                <div className="popup-content-small background-white border-radius">
                    <form action="#"
                        onSubmit={(e) => {
                            e.preventDefault()
                            this.props.onClickSave(this.state.data)
                        }}>
                        
                        <div className="popup-panel grid grid-2x">
                            <div className="col-1">
                                <div className="popup-title">
                                    {'Tax Template - Create Form'}
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

                        <div className="display-flex-normal">
                            <div style={{ width: '35%' }}>
                                <div className="padding-15px">
                                    <div>
                                        <div className="margin-30px">
                                            <div className="image image-100px image-circle background-white border-all" style={{ margin: 'auto' }}>
                                                <i className="icn fa fa-2x fa-image"></i>
                                            </div>
                                        </div>

                                        {/* <div className="txt-site txt-13 txt-bold txt-main content-center">
                                            <input
                                                type="file"
                                                id="pick-image"
                                                style={{ display: "none" }}
                                                onChange={this.handleChange} />
                                            <label htmlFor="pick-image">
                                                <div className="btn btn-div btn-grey-dark">
                                                    <i className="fa fa-1x fa-upload margin-right-10px"></i>
                                                    Pick Image
                                            </div>
                                            </label>
                                        </div> */}
                                    </div>
                                </div>
                            </div>

                            <div style={{ width: '65%' }}>
                                <div className="padding-15px">
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Template ID: {taxTPLID}</h4>
                                        </div>
                                        <div className="margin-5px">
                                            <p className="txt-site txt-11 txt-primary">
                                                The Tax template menu is to be used to create Tax calculation template.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Template Name <span style={{ color: 'red' }}>*</span></h4>
                                        </div>
                                        <div className="margin-5px">
                                            <div className="card-date-picker">
                                                <div className="double">
                                                    <input
                                                        type="text"
                                                        required
                                                        className="txt txt-sekunder-color"
                                                        placeholder=""
                                                        onChange={(e) => this.setState({
                                                            data: {
                                                                ...this.state.data,
                                                                taxTPLName: e.target.value
                                                            }
                                                        })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Activation</h4>
                                        </div>
                                        <div className="margin-15px">
                                            <label className="radio">
                                                <input type="checkbox" name="all-day" checked={taxTPLStatus} disabled
                                                    onChange={(e) => this.setState({
                                                        data: {
                                                            ...this.state.data,
                                                            taxTPLStatus: e.target.checked
                                                        }
                                                    })}
                                                />
                                                <span className="checkmark" />
                                                <span className="txt-site txt-11 txt-bold txt-main">
                                                    Activate Now
                                            </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-bottom padding-15px content-right">
                            <button
                                className="btn btn-blue"
                                type='submit'
                            >
                                SAVE
                        </button>
                        </div>
                    </form>
                </div>
                <div className="padding-bottom-20px" />
            </div>
        )
    }
}
export default CreateTax