import React, { Component } from 'react'
import DropDown from '../../../modules/popup/DropDown'
import M from 'moment'
import Api from '../../../Services/Api'
import { connect } from "react-redux";

const defaultDetail = {
    "outaxTPLID": '',
    "children": [],
    "ougrade": "",
    "hasChild": false,
    "ouid": "",
    "oujobDesc": "",
    "oulevel": "",
    "oupayrollTPLID": "",
    "ouparentID": "NULL",
    "ouposition": "",
    "oUSalaryStartFrom": '',
    "oUSalaryStartTo": ''
}

class FormCorporateOrgTpl extends Component {
    constructor(props) {
        super(props)
        // console.log(this.props.rawData)
        this.state = {
            data: this.props.dataTable !== [] && this.props.type !== 'update' ? { ...defaultDetail, hasChild: true, ouid: 'OU-' + M() } : this.props.dataTable,
            rawDataTax: this.props.rawDataTax,
            rawDataPayroll: this.props.rawDataPayroll,
            position: '',
            auth: props.auth
        }
    }

    async getPositionByLevel(value) {
        let esid = this.state.auth.user.companyID
        let payload = {
            "limit": 5,
            "offset": 0,
            "params": {
                "eSID": esid,
                "level": value
            }
        }
        let res = await Api.create('ES').getEsByLevel(payload)
        if (res.data && res.data.status === 'S') {
            console.log('get position', res)
            this.setState({
                position: res.data.data.ouposition
            })
        }
    }
    

    handleChange(value) {
        this.getPositionByLevel(value)
        this.setState({
            data: {
                ...this.state.data,
                oulevel: value
            }
        })

    }

    render() {
        // console.log('raw data', this.props.rawData)
        let { bizparTaxTPL, bizparPayTPL, bizparParent } = []
        let {
            ougrade,
            oulevel,
            ouid,
            ouparentID,
            ouposition,
            outaxTPLID,
            oupayrollTPLID,
            oujobDesc,
            oUSalaryStartFrom,
            oUSalaryStartTo
        } = this.state.data

        bizparTaxTPL = Object.assign([], this.state.rawDataTax)
        bizparTaxTPL = bizparTaxTPL.map((value) => {
            if (value === null) {
                return ['', '']
            }
            return {
                'bizparKey': value.taxTPLID,
                'bizparValue': value.taxTPLName
            }
        })
        bizparPayTPL = Object.assign([], this.state.rawDataPayroll)
        bizparPayTPL = bizparPayTPL.map((value) => {
            if (value === null) {
                return ['', '']
            }
            return {
                'bizparKey': value.payrollTPLID,
                'bizparValue': value.payrollTPLName
            }
        })
        bizparParent = Object.assign([], this.props.rawDataTableDetail)
        bizparParent = bizparParent.map((value) => {
            if (value === null) {
                return ['', '']
            }
            return {
                'bizparKey': value.ouid,
                'bizparValue': value.ouid
            }
        })
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px" />
                <div className="popup-content background-white border-radius">

                    <div className="padding-15px background-blue grid grid-2x">
                        <div className="col-1">
                            <div className="txt-site txt-12 txt-bold post-center">
                                Org Structure TPL Detail
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button
                                type="button"
                                className="btn btn-circle background-blue"
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
                                            <h3>Node ID</h3>
                                        </div>
                                        <div className="margin-15px">
                                            <div className="card-date-picker">
                                                <div className="double">
                                                    <input
                                                        style={{ backgroundColor: "#E6E6E6" }}
                                                        type="text"
                                                        className="txt txt-sekunder-color"
                                                        placeholder="AUTO-GENERATED-00001"
                                                        onChange={(dt) => this.setState({
                                                            data: {
                                                                ...this.state.data,
                                                                ouid: dt.target.value
                                                            }
                                                        })}
                                                        readOnly
                                                        value={ouid}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="margin-bottom-30px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h3>Parent Node</h3>
                                        </div>
                                        <div className="margin-15px">
                                            {/* <input
                                                type="text"
                                                className="txt txt-sekunder-color"
                                                placeholder
                                                readOnly
                                                value={ouparentID}
                                            /> */}
                                            <DropDown
                                                title={"-- NULL --"}
                                                disabled
                                                onChange={(dt) => this.setState({
                                                    data: {
                                                        ...this.state.data,
                                                        ouparentID: dt
                                                    }
                                                })}
                                                type='bizpar'
                                                value={ouparentID ? ouparentID : ''}
                                                data={bizparParent} />
                                        </div>
                                    </div>
                                    <div className="margin-bottom-30px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h3>Level</h3>
                                        </div>
                                        <div className="margin-15px">
                                            <DropDown
                                                disabled
                                                title="-- please select level type --"
                                                // onChange={(dt) => {
                                                //     this.setState({
                                                //         data: {
                                                //             ...this.state.data,
                                                //             oulevel: dt
                                                //         }
                                                //     })
                                                //     this.getPositionByLevel(dt)
                                                // }
                                                // }
                                                onChange={(dt) =>
                                                    this.handleChange(dt)
                                                }
                                                type='bizpar'
                                                value={oulevel ? oulevel.bizparKey : ''}
                                                data={this.props.bizparCorporateLevel} />
                                        </div>
                                    </div>
                                    <div className="margin-bottom-30px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h3>Position</h3>
                                        </div>
                                        <div className="margin-15px">
                                            {/* <DropDown
                                                title="-- please select tax type --"
                                                onChange={(dt) => this.setState({
                                                    data: {
                                                        ...this.state.data,
                                                        ouposition: dt
                                                    }
                                                })}
                                                type='bizpar'
                                                value={ouposition}
                                                data={this.props.bizparCorporatePosition} /> */}
                                            <select
                                                disabled
                                                style={{ backgroundColor: "#E6E6E6" }}
                                                value={ouposition ? ouposition.bizparKey : ''}
                                                onChange={(e) => this.setState({
                                                    data: {
                                                        ...this.state.data,
                                                        ouposition: e.target.value
                                                    }
                                                })}
                                                className="cf-select slc slc-sekunder"
                                            >
                                                <option value="">-- Please select position  --</option>
                                                <option value={this.state.position && this.state.position.bizparKey}>{this.state.position && this.state.position.bizparValue}</option>
                                                {this.state.position ? null : this.props.bizparCorporatePosition && this.props.bizparCorporatePosition.map((data, index) => {
                                                    return (<option key={index} value={data.bizparKey}>{data.bizparValue}</option>)
                                                })}

                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ width: '50%' }}>
                                <div className="padding-15px">
                                    <div className="margin-bottom-30px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h3>Grade</h3>
                                        </div>
                                        <div className="margin-15px">
                                            <DropDown
                                                title="-- please select payroll tpl component --"
                                                onChange={(dt) => this.setState({
                                                    data: {
                                                        ...this.state.data,
                                                        ougrade: dt
                                                    }
                                                })}
                                                type='bizpar'
                                                value={ougrade ? ougrade.bizparKey : ''}
                                                data={this.props.bizparCorporateGrade} />
                                        </div>
                                    </div>
                                    <div className="margin-bottom-30px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h3>Tax TPL</h3>
                                        </div>
                                        <div className="margin-15px">
                                            <DropDown
                                                title="-- please select payroll tpl component type --"
                                                onChange={(dt) => this.setState({
                                                    data: {
                                                        ...this.state.data,
                                                        outaxTPLID: dt
                                                    }
                                                })}
                                                type='bizpar'
                                                value={outaxTPLID && outaxTPLID.taxTPLID}
                                                data={bizparTaxTPL} />
                                        </div>
                                    </div>
                                    <div className="margin-bottom-30px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h3>Payroll TPL</h3>
                                        </div>
                                        <div className="margin-15px">
                                            <DropDown
                                                title="-- please select payroll tpl component type --"
                                                onChange={(dt) => this.setState({
                                                    data: {
                                                        ...this.state.data,
                                                        oupayrollTPLID: dt
                                                    }
                                                })}
                                                value={oupayrollTPLID ? oupayrollTPLID.payrollTPLID : ''}
                                                type='bizpar'
                                                data={bizparPayTPL} />
                                        </div>
                                    </div>
                                    <div className="margin-bottom-30px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h3>Range of Salary</h3>
                                        </div>
                                        <div className="margin-15px">
                                            <div className="card-date-picker">
                                                <div className="double">
                                                    <input
                                                        type="number"
                                                        className="txt txt-sekunder-color"
                                                        placeholder
                                                        value={oUSalaryStartFrom ? oUSalaryStartFrom : 0}
                                                        onChange={(dt) => this.setState({
                                                            data: {
                                                                ...this.state.data,
                                                                oUSalaryStartFrom: dt.target.value
                                                            }
                                                        })}
                                                    />
                                                    To
                                                    <input
                                                        type="number"
                                                        className="txt txt-sekunder-color"
                                                        placeholder
                                                        value={oUSalaryStartTo ? oUSalaryStartTo : 0}
                                                        onChange={(dt) => this.setState({
                                                            data: {
                                                                ...this.state.data,
                                                                oUSalaryStartTo: dt.target.value
                                                            }
                                                        })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="margin-bottom-30px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h3>Activation</h3>
                                        </div>
                                        <div className="margin-15px">
                                            <label className="radio">
                                                <input type="checkbox" name="all-day" checked disabled />
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

                        <div className="padding-15px margin-bottom-30px">
                            <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                <h3>Job Description</h3>
                            </div>
                            <div className="margin-15px">
                                <div className="card-date-picker">
                                    <textarea
                                        row={10}
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder="Jln. Satrio"
                                        value={oujobDesc}
                                        onChange={(e) => this.setState({
                                            data: {
                                                ...this.state.data,
                                                oujobDesc: e.target.value
                                            }
                                        })}
                                    />
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
                                // onClick={() => console.log('data sumbit', JSON.stringify(this.state.data))}
                                onClick={() => this.props.onClickSave(this.state.data, 'edit-detail')}
                            >
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

// export default FormCorporateOrgTpl
const mapStateToProps = state => {
    return {
        auth: state.auth
    };
};

export default connect(mapStateToProps)(FormCorporateOrgTpl);
