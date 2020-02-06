import React, { Component } from 'react'
import M from 'moment'
import DropDown from '../../../../../../modules/popup/DropDown'
import * as R from 'ramda'

const defaultPayload = {
    "orgStructureTPLID": "",
    "orgStructureTPLName": "",
    "orgStructureTPLPhotoURL": "",
    "orgStructureTPLStatus": true,
}

class CreateOrg extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: { ...defaultPayload, orgStructureTPLID: 'STR-' + M() },
            referenceID: ''
        }
    }

    render() {
        let { orgStructureTPLID, orgStructureTPLStatus } = this.state.data
        let bizparOrg = Object.assign([], this.props.rawDataOrg)
        bizparOrg = bizparOrg.map((value) => {
            if (value === null) {
                return ['', '']
            }
            return {
                'bizparKey': value.orgStructureTPLId,
                'bizparValue': value.orgStructureTPLName
            }
        })
        // console.log(bizparOrg)
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px" />
                <div className="popup-content-small background-white border-radius">
                    <form action="#"
                        onSubmit={(e) => {
                            e.preventDefault()
                            let data = this.state.data
                            let index = R.findIndex(R.propEq('orgStructureTPLId', this.state.referenceID))(this.props.rawDataOrg)
                            data = {
                                ...data,
                                orgStructureTPLDetails: R.isEmpty(this.state.referenceID) ? [] : this.props.rawDataOrg[index].orgStructureTPLDetails
                            }
                            this.props.onClickSave(data)
                        }}
                    >
                        <div className="popup-panel grid grid-2x">
                            <div className="col-1" style={{ width: "140%" }}>
                                <div className="popup-title">
                                    {'Organization Structure Template - Create Form'}
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
                                            <h4>Template ID: {orgStructureTPLID}</h4>
                                        </div>
                                        <div className="margin-5px">
                                            <p className="txt-site txt-11 txt-primary">
                                                The Organization Strcuture template menu is to be used to create Organization Strcuture template.
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
                                                                orgStructureTPLName: e.target.value
                                                            }
                                                        })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Reference Org Structure Template </h4>
                                            {/* <i
                                                data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                                                className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i> */}
                                        </div>
                                        <div className="margin-5px">
                                            <DropDown
                                                title="-- please select reference --"
                                                onChange={(dt) => this.setState({
                                                    referenceID: dt,
                                                    // data: { ...this.state.data, orgStructureTPL : this.props.rawDataOrg[] }
                                                })}
                                                data={bizparOrg}
                                                type="bizpar" />
                                        </div>
                                    </div>
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Activation</h4>
                                        </div>
                                        <div className="margin-15px">
                                            <label className="radio">
                                                <input type="checkbox" name="all-day" checked={orgStructureTPLStatus} disabled
                                                    onChange={(e) => this.setState({
                                                        data: {
                                                            ...this.state.data,
                                                            orgStructureTPLStatus: e.target.checked
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
                            <button className="btn btn-blue" type='submit'> SAVE </button>
                        </div>
                    </form>
                </div>
                <div className="padding-bottom-20px" />
            </div>
        )
    }
}
export default CreateOrg