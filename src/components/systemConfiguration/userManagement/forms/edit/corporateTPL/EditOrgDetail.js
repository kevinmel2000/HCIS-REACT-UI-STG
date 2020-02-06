import React, { Component } from 'react'
import DropDown from '../../../../../../modules/popup/DropDown'
import Api from '../../../../../../Services/Api'
import { connect } from 'react-redux';
import * as R from 'ramda'
import NumberFormat from 'react-number-format'
import { Multiselect } from 'multiselect-react-dropdown';

class EditOrgDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: this.props.data,
            rawDataOrg: this.props.rawDataOrg,
            rawDataTax: this.props.rawDataTax,
            rawDataPayroll: this.props.rawDataPayroll,
            position: '',
            auth: props.auth,
            gradeData: []
        }
    }

    componentDidMount() {
        // this.getPayroll() 
        if (this.props.bizparCorporateGrade !== undefined) {
            let gradeData = []
            this.props.bizparCorporateGrade.map((item) => {
                gradeData.push({
                    name: item.bizparValue,
                    key: item.bizparKey
                })
            })
            this.setState({
                gradeData
            })
        }
    }

    onSelect = (data) => {
        let key = []
        data.map((item) => {
            key.push(item.key)
        })
        this.setState({
            data: {
                ...this.state.data,
                ougrade: key
            }
        }, ()=> console.log(this.state.data))
    }

    onRemove(data) {
        let key = []
        if (data === []) {
            this.setState({
                data: {
                    ...this.state.data,
                    ougrade: []
                }
            })
        } else {
            data.map((item) => {
                key.push(item.key)
            })
            this.setState({
                data: {
                    ...this.state.data,
                    ougrade: key
                }
            }, ()=> console.log(this.state.data))
        } 
    }

    // getPayroll = async() => {
    //     let payload = {
    //         "params": {
    //             "payrollTPLStatus": "ACTIVE"
    //         },
    //         "offset": 0,
    //         "limit": 20
    //     }
    //     let res = await Api.create('CFG').getAllPayroll(payload)
    //     if (res.data && res.data.status === 'S') {
    //         console.log('res', res.data.data)
    //         let dataTablePayroll = res.data.data.map((value) => {
    //             if (value === null) {
    //                 return ['', '', '']
    //             } else {
    //                 const {
    //                     payrollTPLID, payrollTPLName, payrollTPLStatus
    //                 } = value

    //                 let status = payrollTPLStatus === 'ACTIVE' ? 'YES' : 'NO'

    //                 return [
    //                     payrollTPLID,
    //                     payrollTPLName,
    //                     status
    //                 ]
    //             }
    //         })
    //         this.setState({
    //             rawDataPayroll: res.data.data
    //         })
    //     }
    // }

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
            this.setState({
                position: res.data.data[0].ouposition
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

    // async fillParent(value) {
    //     let parent = ''
    //     let res = await Api.create('CFG').getParentOrgStruct(value)

    //     if (res.data && res.data.status === 'S') {
    //         parent = res.data.data
    //         console.log('res parent', parent[0].ouid)
    //         this.setState({
    //             data: {
    //                 ...this.state.data,
    //                 ouparentID: parent[0].ouid
    //             }
    //         })
    //     }

    // }

    // componentDidMount() {
    //     if (this.props.rawData.orgStructureTPLDetails[0]) {
    //         let id = this.props.rawData.orgStructureTPLId
    //         console.log('this.props.rawData.orgStructureTPLID', id)
    //         this.fillParent(id)
    //     }
    // }

    render() {
        console.log('facility', this.state.data.ouFacilityTPLID)
        console.log('cnb', this.state.data.ouCNBTPLID)
        let { bizparTaxTPL, bizparPayTPL, bizparParent, bizparCNB, bizparFacility } = []
        let {
            ouTaxTPLID,
            ougrade,
            ouid,
            oujobDescription,
            oulevel,
            ouposition,
            oupayrollTaxTPLID,
            ouparentID,
            salaryStartFrom,
            salaryStartTo
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
        bizparParent = Object.assign([], this.props.dataTableDetail)
        bizparParent = bizparParent.map((value) => {
            if (value === null) {
                return ['', '']
            }
            return {
                'bizparKey': value.ouid,
                'bizparValue': (value.ouid + ' - ' + (value.ouposition && value.ouposition.bizparValue))
            }
        })
        bizparCNB = Object.assign([], this.props.rawDataCNB)
        bizparCNB = bizparCNB.map((value) => {
            if (value === null) {
                return ['', '']
            }
            return {
                'bizparKey': value.cnbtplid,
                'bizparValue': value.cnbtplname
            }
        })
        bizparFacility = Object.assign([], this.props.rawDataFacility)
        bizparFacility = bizparFacility.map((value) => {
            if (value === null) {
                return ['', '']
            }
            return {
                'bizparKey': value.facilityID,
                'bizparValue': value.facilityName
            }
        })
        // console.log(' position', this.state.data.ouposition)
        // console.log('create pertama', this.props.rawData.orgStructureTPLDetails[0] ? false : true)
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px" />
                <div className="popup-content background-white border-radius">

                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="popup-title">
                                Organization Structure Template Detail - Edit Form
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
                            // if (bizparParent.length !== 0) {
                            //     if (this.state.data.ouparentID === 'NULL' || R.isEmpty(this.state.data.ouparentID)) return alert('Please Select Parent.')
                            //     // return console.log('')
                            //     return this.props.onClickSave(this.state.data, 'detail')
                            // }
                            if (R.isEmpty(this.state.data.oulevel) || R.isEmpty(this.state.data.oulevel)) return alert('Level is Required')
                            if (R.isEmpty(this.state.data.ouposition) || R.isEmpty(this.state.data.ouposition)) return alert('Position is Required')
                            if (R.isEmpty(this.state.data.ougrade) || R.isEmpty(this.state.data.ougrade)) return alert('Grade is Required')
                            if (R.isEmpty(this.state.data.ouTaxTPLID) || R.isEmpty(this.state.data.ouTaxTPLID)) return alert('Tax Template is Required')
                            if (R.isEmpty(this.state.data.oupayrollTaxTPLID) || R.isEmpty(this.state.data.oupayrollTaxTPLID)) return alert('Payroll Template Required')
                            if (R.isNil(this.state.data.ouFacilityTPLID) || R.isEmpty(this.state.data.ouFacilityTPLID)) return alert('Facility Template Required')
                            if (R.isNil(this.state.data.ouCNBTPLID) || R.isEmpty(this.state.data.ouCNBTPLID)) return alert('CNB Template Required')
                            // return console.log(this.state.data)
                            // this.props.onClickSave(this.state.data, 'edit-detail')
                            let data = {
                                ...this.state.data,
                                salaryStartFrom: String(salaryStartFrom).split(",").join(""),
                                salaryStartTo: String(salaryStartTo).split(",").join("")
                            }
                            this.props.onClickSave(data, 'edit-detail')
                        }}>
                        <div className="display-flex-normal">
                            <div style={{ width: '50%' }}>
                                <div className="padding-15px">
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Node ID <span style={{ color: 'red' }}>*</span></h4>
                                        </div>
                                        <div className="margin-5px">
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
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Parent Node</h4>
                                        </div>
                                        <div className="margin-5px">
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
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Level <span style={{ color: 'red' }}>*</span></h4>
                                        </div>
                                        <div className="margin-5px">
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
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Position <span style={{ color: 'red' }}>*</span></h4>
                                        </div>
                                        <div className="margin-5px">
                                            <DropDown
                                                title="-- please select position --"
                                                disabled
                                                onChange={(dt) => this.setState({
                                                    data: {
                                                        ...this.state.data,
                                                        ouposition: dt
                                                    }
                                                })}
                                                bizValue={ouposition.bizparKey}
                                                type='bizpar'
                                                value={ouposition ? ouposition.bizparKey : ''}
                                                data={this.props.bizparCorporatePosition}
                                            />
                                            {/* <select
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

                                            </select> */}
                                        </div>
                                    </div>
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Facility Template  <span style={{ color: 'red' }}>*</span></h4>
                                        </div>
                                        <div className="margin-5px">
                                            <DropDown
                                                title="-- please select facility template --"
                                                onChange={(dt) => {
                                                    this.setState({
                                                        data: {
                                                            ...this.state.data,
                                                            ouFacilityTPLID: dt
                                                        }
                                                    })
                                                }}
                                                type='bizpar'
                                                value={R.isNil(this.state.data.ouFacilityTPLID) ? '' : this.state.data.ouFacilityTPLID.facilityID}
                                                data={bizparFacility} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ width: '50%' }}>
                                <div className="padding-15px">
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Grade <span style={{ color: 'red' }}>*</span></h4>
                                        </div>
                                        <div className="margin-5px">
                                            {/* <DropDown
                                                title="-- please select grade --"
                                                onChange={(dt) => this.setState({
                                                    data: {
                                                        ...this.state.data,
                                                        ougrade: dt
                                                    }
                                                })}
                                                type='bizpar'
                                                value={ougrade ? ougrade.bizparKey : ''}
                                                data={this.props.bizparCorporateGrade} /> */}
                                            <Multiselect
                                                options={this.state.gradeData} // Options to display in the dropdown 
                                                selectedvalues={this.state.selectedValue} // Preselected value to persist in dropdown
                                                onSelect={this.onSelect} // Function will trigger on select event
                                                onRemove={(e) => this.onRemove(e)} // Function will trigger on remove event
                                                displayValue="name" // Property name to display in the dropdown options
                                            />
                                        </div>
                                    </div>
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Range of Salary <span style={{ color: 'red' }}>*</span></h4>
                                        </div>
                                        <div className="margin-5px">
                                            <div className="card-date-picker">
                                                <div className="double">
                                                    <NumberFormat
                                                        className="txt txt-sekunder-color"
                                                        thousandSeparator={true}
                                                        value={salaryStartFrom}
                                                        required
                                                        onValueChange={(e) => {
                                                            this.setState({
                                                                data: {
                                                                    ...this.state.data,
                                                                    salaryStartFrom: e.formattedValue
                                                                }
                                                            })
                                                        }} />
                                                    <div className="txt-site txt-11 txt-primary txt-center margin-10px margin-left-10px margin-right-10px">
                                                        To
                                                    </div>
                                                    <NumberFormat
                                                        className="txt txt-sekunder-color"
                                                        thousandSeparator={true}
                                                        value={salaryStartTo}
                                                        required
                                                        onValueChange={(e) => {
                                                            this.setState({
                                                                data: {
                                                                    ...this.state.data,
                                                                    salaryStartTo: e.formattedValue
                                                                }
                                                            })
                                                        }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Tax Template <span style={{ color: 'red' }}>*</span></h4>
                                        </div>
                                        <div className="margin-5px">
                                            <DropDown
                                                title="-- please select tax template --"
                                                onChange={(dt) => this.setState({
                                                    data: {
                                                        ...this.state.data,
                                                        ouTaxTPLID: dt
                                                    }
                                                })}
                                                type='bizpar'
                                                value={ouTaxTPLID && ouTaxTPLID.taxTPLID}
                                                data={bizparTaxTPL} />
                                        </div>
                                    </div>
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Payroll Template <span style={{ color: 'red' }}>*</span></h4>
                                        </div>
                                        <div className="margin-5px">
                                            <DropDown
                                                title="-- please select payroll template --"
                                                onChange={(dt) => this.setState({
                                                    data: {
                                                        ...this.state.data,
                                                        oupayrollTaxTPLID: dt
                                                    }
                                                })}
                                                value={oupayrollTaxTPLID ? oupayrollTaxTPLID.payrollTPLID : ''}
                                                type='bizpar'
                                                data={bizparPayTPL} />
                                        </div>
                                    </div>
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>CNB Template <span style={{ color: 'red' }}>*</span></h4>
                                        </div>
                                        <div className="margin-5px">
                                            <DropDown
                                                title="-- please select CNB template --"
                                                onChange={(dt) => {
                                                    this.setState({
                                                        data: {
                                                            ...this.state.data,
                                                            ouCNBTPLID: dt
                                                        }
                                                    })
                                                }}
                                                type='bizpar'
                                                value={this.state.data.ouCNBTPLID ? this.state.data.ouCNBTPLID.cnbtplid : ''}
                                                data={bizparCNB} />
                                        </div>
                                    </div>
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Activation <span style={{ color: 'red' }}>*</span></h4>
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

                        <div className="padding-15px">
                            <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                <h4>Job Description <span style={{ color: 'red' }}>*</span></h4>
                            </div>
                            <div className="margin-5px">
                                <div className="card-date-picker">
                                    <textarea
                                        row={10}
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder="Jln. Satrio"
                                        value={oujobDescription}
                                        onChange={(e) => this.setState({
                                            data: {
                                                ...this.state.data,
                                                oujobDescription: e.target.value
                                            }
                                        })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="border-top padding-15px content-right">
                            <button
                                onClick={this.props.onClickClose}
                                type="button"
                                className="btn btn-primary margin-right-10px">
                                BACK
                             </button>
                            <button
                                className="btn btn-blue"
                                type='submit'
                            // onClick={() => console.log('data sumbit', JSON.stringify(this.state.data))}
                            // onClick={() => this.props.onClickSave(this.state.data, 'edit-detail')}
                            >
                                SAVE
                              </button>
                        </div>
                    </form>

                </div>
                <div className="padding-top-20px" />
            </div >
        )
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    };
};

export default connect(mapStateToProps)(EditOrgDetail)