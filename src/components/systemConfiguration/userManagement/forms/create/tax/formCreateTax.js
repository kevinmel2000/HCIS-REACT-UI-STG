import React, { Component } from 'react'
import DropDown from '../../../../../../modules/popup/DropDown'
import API from '../../../../../../Services/Api'
import M from 'moment'
import * as R from 'ramda'

const defaultDetail = {
    "taxTPLDetailID": "",
    "isDefault": false,
    "taxTPLDetailNotes": "",
    "taxComponent": "",
    "taxComponentType": "",
    "taxComponentItem": "",
    "taxSegment": "",
    "taxTPLDetailStatus": true
}

class FormCreateTax extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: { ...defaultDetail, taxTPLDetailID: 'TAX-TPL-DETAIL-' + M() },
            bizparTaxTplComponentDetail: []
        }
    }

    async getBizparComponentDetail(value) {
        console.log('masuk')
        let bizparTaxTplComponentDetail, payload = ''
        payload = {
            "params": {
                "parentKey": value,
                "bizparCategory": "TAX_TPL_COMPONENT_ITEM"
            },
            "offset": 0,
            "limit": 10
        }
        let res = await API.create('BIZPAR').getBizparByParentKeyAndCategory(payload)
        console.log(res)
        if (res.data && res.data.status === 'S') {
            bizparTaxTplComponentDetail = res.data.data
        }
        this.setState({
            bizparTaxTplComponentDetail
        })
    }

    handleChange(value) {
        this.getBizparComponentDetail(value)
        this.setState({
            data: {
                ...this.state.data,
                taxComponent: value
            }
        })

    }

    render() {
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px" />
                <div className="popup-content background-white border-radius">

                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="popup-title">
                                Tax Template Detail - Create Form
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

                    <form action="#"
                        onSubmit={(e) => {
                            e.preventDefault()
                            if (R.isEmpty(this.state.data.taxSegment)) return alert('Tax Template Segment is Required')
                            if (R.isEmpty(this.state.data.taxComponentType)) return alert('Tax Template Component Type is Required')
                            if (R.isEmpty(this.state.data.taxComponent)) return alert('Tax Template Component is Required')
                            this.props.onClickSave({
                                ...this.state.data,
                                taxTPLDetailStatus: this.state.data.taxTPLDetailStatus ? 'ACTIVE' : 'INACTIVE'
                            }, 'detail')
                        }}
                    >
                        <div className="display-flex-normal">
                            <div style={{ width: '50%' }}>
                                <div className="padding-15px">
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Tax Template ID <span style={{ color: 'red' }}>*</span></h4>
                                        </div>
                                        <div className="margin-5px">
                                            <div className="card-date-picker">
                                                <div className="double">
                                                    <input
                                                        readOnly
                                                        type="text"
                                                        className="txt txt-sekunder-color"
                                                        placeholder=''
                                                        value={this.state.data.taxTPLDetailID}
                                                        style={{ backgroundColor: '#E6E6E6' }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Tax Template Segment <span style={{ color: 'red' }}>*</span></h4>
                                        </div>
                                        <div className="margin-5px">
                                            <DropDown
                                                title="-- please select tax template segment --"
                                                onChange={(dt) => this.setState({
                                                    data: {
                                                        ...this.state.data,
                                                        taxSegment: dt
                                                    }
                                                })}
                                                type='bizpar'
                                                data={this.props.bizparTaxTplSegment} />
                                        </div>
                                    </div>
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Tax Template Component Type <span style={{ color: 'red' }}>*</span></h4>
                                        </div>
                                        <div className="margin-5px">
                                            <DropDown
                                                title="-- please select tax template component type --"
                                                onChange={(dt) => this.setState({
                                                    data: {
                                                        ...this.state.data,
                                                        taxComponentType: dt
                                                    }
                                                })}
                                                type='bizpar'
                                                data={this.props.bizparTaxTplComponentType} />
                                        </div>
                                    </div>
                                    <div className="padding-5px grid grid-2x">
                                        <div className="col-1">
                                            <div className="margin-bottom-20px">
                                                <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                                    <h4>Default</h4>
                                                </div>
                                                <div className="margin-15px">
                                                    <label className="radio">
                                                        <input type="checkbox" name="all-day" checked={this.state.data.isDefault}
                                                            onChange={(e) => this.setState({
                                                                data: {
                                                                    ...this.state.data,
                                                                    isDefault: e.target.checked
                                                                }
                                                            })} />
                                                        <span className="checkmark" />
                                                        <span className="txt-site txt-11 txt-bold txt-main">
                                                            Activate Now
                                                </span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-2">
                                            <div className="margin-bottom-20px">
                                                <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                                    <h4>Activation</h4>
                                                </div>
                                                <div className="margin-15px">
                                                    <label className="radio">
                                                        <input type="checkbox" name="all-day" checked={this.state.data.taxTPLDetailStatus}
                                                            onChange={(e) => this.setState({
                                                                data: {
                                                                    ...this.state.data,
                                                                    taxTPLDetailStatus: e.target.checked
                                                                }
                                                            })} />
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
                            </div>

                            <div style={{ width: '50%' }}>
                                <div className="padding-15px">
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Tax Template Component <span style={{ color: 'red' }}>*</span></h4>
                                        </div>
                                        <div className="margin-5px">
                                            <DropDown
                                                title="-- please select tax template component --"
                                                onChange={(dt) =>
                                                    this.handleChange(dt)
                                                }
                                                type='bizpar'
                                                data={this.props.bizparTaxTplComponent} />
                                        </div>
                                    </div>
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Tax Template Component Detail </h4>
                                        </div>
                                        <div className="margin-5px">
                                            <DropDown
                                                title="-- please select tax template component detail --"
                                                onChange={(dt) => {
                                                    this.setState({
                                                        data: {
                                                            ...this.state.data,
                                                            taxComponentItem: dt
                                                        }
                                                    })
                                                }}
                                                taxComponentItem={this.state.bizparTaxTplComponentDetail}
                                                type='bizpar'
                                                data={this.state.bizparTaxTplComponentDetail} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="padding-15px margin-bottom-30px">
                            <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                <h4>Note </h4>
                            </div>
                            <div className="margin-5px">
                                <div className="card-date-picker">
                                    <textarea
                                        row={10}
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                        onChange={(e) => this.setState({
                                            data: {
                                                ...this.state.data,
                                                taxTPLDetailNotes: e.target.value
                                            }
                                        })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="border-top padding-15px content-right">
                            <button
                                type="button"
                                onClick={this.props.onClickClose}
                                className="btn btn-primary margin-right-10px">
                                BACK
                             </button>
                            <button
                                className="btn btn-blue"
                                type='submit'
                            >
                                SAVE
                              </button>
                        </div>
                    </form>

                </div>
                <div className="padding-top-20px" />
            </div>
        )
    }
}

export default FormCreateTax