import React, { Component } from 'react'
import DropDown from '../../../../../../modules/popup/DropDown'
import M from 'moment'
import API from '../../../../../../Services/Api'
import Select from 'react-select';
import { connect } from 'react-redux';
import * as R from 'ramda'
import NumberFormat from 'react-number-format'
import Api from '../../../../../../Services/Api';
import { Multiselect } from 'multiselect-react-dropdown';

const defaultDetail = {
    "ouTaxTPLID": '',
    "ouchildren": [],
    "ougrade": "",
    "ouhashChild": false,
    "ouid": "",
    "oujobDescription": "",
    "oulevel": "",
    "oupayrollTaxTPLID": "",
    "ouparentID": "NULL",
    "ouposition": "",
    "salaryStartFrom": '',
    "salaryStartTo": '',
    "ouFacilityTPLID": '',
    "ouCNBTPLID": ''
}

class FormCreateOrg extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: this.props.rawData.orgStructureTPLDetails[0] ? { ...defaultDetail, ouhashChild: true, ouid: 'OU-' + M() } : { ...defaultDetail, ouid: 'OU-' + M() },
            rawDataOrg: this.props.rawDataOrg,
            rawDataTax: this.props.rawDataTax,
            rawDataPayroll: [],
            rawDataCNB: this.props.rawDataCNB,
            rawDataFacility: this.props.rawDataFacility,
            bizparCorporatePosition: [],
            position: '',
            auth: props.auth,
            positionValue: [],
            selectedValue: [],
            gradeData: []
        }
    }

    componentDidMount() {
        console.log(this.props.bizparCorporateGrade)
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
        this.getDataPayroll()
        if (this.props.bizparCorporatePosition !== undefined) {
            let array = []
            this.props.bizparCorporatePosition.map((value) => {
                array.push({
                    value: value.bizparKey,
                    label: value.bizparValue
                })
            })
            setTimeout(() => {
                this.setState({
                    bizparCorporatePosition: array
                })
            }, 200);
        }
    }

    onSelect(data) {
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

    async getDataPayroll() {
        let payload = {
            "params": {
                "payrollTPLStatus": "ACTIVE"
            },
            "offset": 0,
            "limit": 20
        }
        let res = await Api.create('CFG').getAllPayroll(payload)
        if (res.data && res.data.status === 'S') {
            console.log('res', res.data.data)
            let dataTablePayroll = res.data.data.map((value) => {
                if (value === null) {
                    return ['', '', '']
                } else {
                    const {
                        payrollTPLID, payrollTPLName, payrollTPLStatus
                    } = value

                    let status = payrollTPLStatus === 'ACTIVE' ? 'YES' : 'NO'

                    return [
                        payrollTPLID,
                        payrollTPLName,
                        status
                    ]
                }
            })
            this.setState({
                rawDataPayroll: res.data.data
            })
        }
    }


    async getBizparPosition(value) {
        if (value !== "") {
            Api.create("BIZPAR").getCountBizparByParentKey(value).then((res) => {
                let payload = {
                    params: {
                        parentKey: value,
                        bizparCategory: "CORPORATE_POSITION"
                    },
                    offset: 0,
                    limit: res.data.data
                }
                API.create("BIZPAR")
                    .getBizparByParentKey(payload)
                    .then(res => {
                        console.log(res.data)
                        if (res.status === 200) {
                            console.log('masuk', res.data);
                            if (res.data.status === "S") {
                                let array = []
                                res.data.data.map((value) => {
                                    array.push({
                                        value: value.bizparKey,
                                        label: value.bizparValue
                                    })
                                })

                                setTimeout(() => {
                                    this.setState({
                                        data: {
                                            ...this.state.data,
                                            ouposition: ''
                                        },
                                        bizparCorporatePosition: array
                                    })
                                }, 200);
                            }
                        }
                    });
            })
        } else {
            Api.create("BIZPAR").getCountBizparByStatus("ACTIVE").then((res) => {
                let payload = {
                    params: {
                        parentKey: value,
                        bizparCategory: "CORPORATE_POSITION"
                    },
                    offset: 0,
                    limit: res.data.data
                }
                API.create("BIZPAR")
                    .getBizparByParentKey(payload)
                    .then(res => {
                        console.log(res.data)
                        if (res.status === 200) {
                            console.log(res.data);
                            if (res.data.status === "S") {
                                let array = []
                                res.data.data.map((value) => {
                                    array.push({
                                        value: value.bizparKey,
                                        label: value.bizparValue
                                    })
                                })

                                setTimeout(() => {
                                    this.setState({
                                        data: {
                                            ...this.state.data,
                                            ouposition: ''
                                        },
                                        bizparCorporatePosition: array
                                    })
                                }, 200);
                            }
                        }
                    });
            })

        }
    }

    handleChange(value) {
        this.getBizparPosition(value)
        this.setState({
            data: {
                ...this.state.data,
                oulevel: value
            }
        })
    }

    render() {
        let { bizparTaxTPL, bizparPayTPL, bizparParent, bizparCNB, bizparFacility } = []
        let {
            ougrade,
            ouid,
            oulevel,
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
        bizparCNB = Object.assign([], this.state.rawDataCNB)
        bizparCNB = bizparCNB.map((value) => {
            if (value === null) {
                return ['', '']
            }
            return {
                'bizparKey': value.cnbtplid,
                'bizparValue': value.cnbtplname
            }
        })
        bizparFacility = Object.assign([], this.state.rawDataFacility)
        bizparFacility = bizparFacility.map((value) => {
            if (value === null) {
                return ['', '']
            }
            return {
                'bizparKey': value.facilityID,
                'bizparValue': value.facilityName
            }
        })

        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px" />
                <div className="popup-content background-white border-radius">

                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="popup-title">
                                Organization Structure Template Detail - Create Form
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
                            console.log(this.state.data)
                            e.preventDefault()
                            if (R.isEmpty(this.state.data.oulevel)) return alert('Level is Required')
                            if (R.isEmpty(this.state.data.ouposition)) return alert('Position is Required')
                            if (R.isEmpty(this.state.data.ougrade)) return alert('Grade is Required')
                            if (R.isEmpty(this.state.data.ouTaxTPLID)) return alert('Tax Template is Required')
                            if (R.isEmpty(this.state.data.oupayrollTaxTPLID)) return alert('Payroll Template Required')
                            if (R.isEmpty(this.state.data.ouFacilityTPLID) || R.isNil(this.state.data.ouFacilityTPLID)) return alert('Facility Template Required')
                            if (R.isEmpty(this.state.data.ouCNBTPLID)) return alert('CNB Template Required')
                            let data = {
                                ...this.state.data,
                                salaryStartFrom: String(this.state.data.salaryStartFrom).split(",").join(""),
                                salaryStartTo: String(this.state.data.salaryStartTo).split(",").join("")
                            }
                            this.props.onClickSave(data, 'detail')
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
                                                        type="text"
                                                        className="txt txt-sekunder-color"
                                                        // placeholder="AUTO-GENERATED-00001"
                                                        value={ouid}
                                                        onChange={(dt) => this.setState({
                                                            data: {
                                                                ...this.state.data,
                                                                ouid: dt.target.value
                                                            }
                                                        })}
                                                        readOnly
                                                        required
                                                        style={{ backgroundColor: "#E6E6E6" }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Parent Node </h4>
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
                                                title={this.props.rawData.orgStructureTPLDetails[0] ? "-- please select parent --" : "-- NULL --"}
                                                onChange={(dt) => this.setState({
                                                    data: {
                                                        ...this.state.data,
                                                        ouparentID: dt
                                                    }
                                                })}
                                                type='bizpar'
                                                data={bizparParent} />
                                        </div>
                                    </div>
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Level <span style={{ color: 'red' }}>*</span></h4>
                                        </div>
                                        <div className="margin-5px">
                                            <DropDown
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
                                                value={oulevel}
                                                data={this.props.bizparCorporateLevel} />
                                        </div>
                                    </div>
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Position <span style={{ color: 'red' }}>*</span></h4>
                                        </div>
                                        <div className="margin-5px">
                                            <Select
                                                value={this.state.positionValue}
                                                onChange={(dt) => this.setState({
                                                    positionValue: dt
                                                }, () => console.log(dt.value))}
                                                options={this.state.bizparCorporatePosition}
                                            />
                                            {/* <DropDown
                                                title="-- please select position --"
                                                travelExpPosition={this.state.bizparCorporatePosition}
                                                onChange={(dt) => this.setState({
                                                    data: {
                                                        ...this.state.data,
                                                        ouposition: dt
                                                    }
                                                })}
                                                type='bizpar'
                                                // value={ouposition}
                                                data={R.isEmpty(oulevel) ? this.props.bizparCorporatePosition : this.state.bizparCorporatePosition} /> */}

                                        </div>
                                    </div>
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Facility Template <span style={{ color: 'red' }}>*</span></h4>
                                        </div>
                                        <div className="margin-5px">
                                            <DropDown
                                                title="-- please select facility template --"
                                                onChange={(dt) => {
                                                    this.setState({
                                                        data: {
                                                            ...this.state.data,
                                                            ouFacilityTPLID: dt,
                                                            ouposition: this.state.positionValue.value
                                                        }
                                                    })
                                                }}
                                                type='bizpar'
                                                // value={ouFacilityTPLID}
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
                                            <Multiselect
                                                options={this.state.gradeData} // Options to display in the dropdown
                                                selectedvalues={this.state.selectedValue} // Preselected value to persist in dropdown
                                                onSelect={(e) => this.onSelect(e)} // Function will trigger on select event
                                                onRemove={(e) => this.onRemove(e)} // Function will trigger on remove event
                                                displayValue="name" // Property name to display in the dropdown options
                                            />
                                            {/* <DropDown
                                                title="-- please select grade --"
                                                onChange={(dt) => this.setState({
                                                    data: {
                                                        ...this.state.data,
                                                        ougrade: dt
                                                    }
                                                })}
                                                type='bizpar'
                                                value={ougrade}
                                                data={this.props.bizparCorporateGrade} /> */}
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
                                                // value={ouFacilityTPLID}
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
                                        required
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
                                type="button"
                                onClick={this.props.onClickClose}
                                className="btn btn-primary margin-right-10px">
                                BACK
                             </button>
                            <button
                                className="btn btn-blue"
                                type='submit'
                            // onClick={() => this.props.onClickSave(this.state.data, 'detail')}
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

// export default FormCreateOrg
const mapStateToProps = state => {
    return {
        auth: state.auth
    };
};

export default connect(mapStateToProps)(FormCreateOrg)