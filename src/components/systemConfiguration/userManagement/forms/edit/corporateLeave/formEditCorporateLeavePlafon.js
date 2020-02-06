import React, { Component } from 'react'
import ReactTooltip from 'react-tooltip'
import M from 'moment'
import * as R from 'ramda'
import DropDown from '../../../../../../modules/popup/DropDown'

class FormEditCorporateLeavePlafon extends Component {
    constructor(props) {
        super(props)
        this.state = {
            leavePlafon: this.props.leavePlafon
        }
    }
    componentDidMount(){
        console.log(this.props.leavePlafon)
    }

    componentDidUpdate(prevProps) {
        if (this.props.leavePlafon !== prevProps.leavePlafon) this.setState({ leavePlafon: this.props.leavePlafon })
    }

    handlePlafon = (e) => {
        if (isNaN(e.target.value)) return true
        this.setState({
            leavePlafon: {
                ...this.state.leavePlafon,
                leavePlafon: e.target.value
            }
        })
    }

    render() {
        let { leavePlafon } = this.state
        let { bizparCorporateLevel } = this.props
        return (
            <div className="a-s-p-place active">
                <div className="a-s-p-top">
                    <div className="grid grid-2x">
                        <div className="col-1">
                            <div className="display-flex-normal margin-top-10px">
                                <i className="fa fa-1x fa-sign-out-alt"></i>
                                <span className="txt-site txt-11 txt-main margin-left-10px">
                                    Leave Plafon
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
                    {/* <div className="padding-top-20px margin-bottom-20px display-flex-normal">
                        <i className="fa fa-lg fa-sign-out-alt margin-right-10px margin-top-5px"></i>
                        <h1 className="txt-site txt-18 txt-main ">Payroll Template Detail</h1>
                    </div> */}
                    <form action="#" onSubmit={(e) => {
                        e.preventDefault()
                        let payload = this.state.leavePlafon
                        payload = {
                            ...payload,
                            esID: payload.es.esid,
                            ouID: !R.isNil(payload.position) ? payload.position.ouid : "",
                            corporateLeavePlafonCreationalDTO: {
                                ...payload.corporateLeavePlafonCreationalDTO,
                                modifiedBy: "SYSTEM",
                                modifiedDate: M().format("DD-MM-YYYY HH:mm:ss")
                            },
                        }
                        delete payload.position
                        delete payload.es
                        if (R.isEmpty(payload.ouID)) return alert('Position is Required.')
                        if (payload.leavePlafon === 0 || payload.leavePlafon === "0") return alert('Plafon is Required')
                        console.log('update leave plafon', payload)
                        this.props.onClickUpdate(payload, "update-plafon")
                    }}>
                        <div className="display-flex-normals margin-bottom-10px">
                            <div className="padding-top-15px padding-bottom-15px">
                                <div className="margin-bottom-20px">
                                    <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                        <h4>Company <span style={{ color: 'red' }}>*</span></h4>
                                        {/* <i
                                            data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                                            className="margin-left-15px margin-top-5px fa fa-1x fa-star"></i> */}
                                    </div>
                                    <div className="margin-5px">
                                        <div className="card-date-picker">
                                            <div className="double">
                                                <input
                                                    readOnly
                                                    style={{ backgroundColor: "#E6E6E6" }}
                                                    type="text"
                                                    className="txt txt-sekunder-color"
                                                    placeholder=""
                                                    // value={leavePlafon.es.esid}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                        <h4>Level</h4>
                                        {/* <i
                                            data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                                            className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i> */}
                                    </div>
                                    <div className="margin-5px">
                                        <DropDown
                                            title="-- please select level type --"
                                            onChange={(e) => {
                                                this.props.handleChange(e)
                                            }}
                                            data={bizparCorporateLevel}
                                            value={leavePlafon.position && leavePlafon.position.oulevel ? leavePlafon.position.oulevel.bizparKey : ""}
                                            leaveType={leavePlafon.position.oulevel && leavePlafon.position.oulevel.bizparValue}
                                            type="bizpar" />
                                    </div>
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                        <h4>Position <span style={{ color: 'red' }}>*</span></h4>
                                        {/* <i
                                            data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                                            className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i> */}
                                    </div>
                                    <div className="margin-5px">
                                        <DropDown
                                            title="-- please select position type --"
                                            onChange={(e) => this.setState({
                                                leavePlafon: {
                                                    ...leavePlafon,
                                                    position: {
                                                        ...leavePlafon.position,
                                                        ouid: e
                                                    }
                                                }
                                            })}
                                            data={this.props.bizparCorporatePosition}
                                            value={leavePlafon.position ? leavePlafon.position.ouid : ""}
                                            travelExpPosition={this.props.bizparCorporatePosition}
                                            travelExpPositionEdit={this.props.leavePlafonPosition}
                                            type="bizpar" />
                                    </div>
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                        <h4>Plafon <span style={{ color: 'red' }}>*</span></h4>
                                        {/* <i
                                            data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                                            className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i> */}
                                    </div>
                                    <div className="margin-5px">
                                        <div className="card-date-picker">
                                            <div className="double">
                                                <input
                                                    type="text"
                                                    className="txt txt-sekunder-color"
                                                    placeholder=""
                                                    required
                                                    onChange={this.handlePlafon.bind(this)}
                                                    value={leavePlafon.leavePlafon}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="txt-site txt-13 txt-bold txt-main display-flex-normal">
                                        <h4>Activation</h4>
                                        {/* <i
                                            data-tip="Lorem ipsum dolor, sit amet consectetur adipisicing elit."
                                            className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i> */}
                                    </div>
                                    <div className="margin-15px">
                                        <label className="radio">
                                            <input type="checkbox" disabled checked />
                                            <span className="checkmark" />
                                            <span className="txt-site txt-11 txt-bold txt-main">
                                                Active
                                        </span>
                                        </label>
                                    </div>
                                </div>

                                <div className="border-top padding-top-20px">
                                    <div className="grid grid-2x">
                                        <div className="col-1 content-left">
                                            <button
                                                type="button"
                                                onClick={this.props.closeSlide}
                                                className="btn btn-primary margin-right-10px">
                                                BACK
                                            </button>
                                        </div>
                                        <div className="col-2 content-right">
                                            <button type="submit" className="btn btn-blue"> SAVE </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div >
                <ReactTooltip />
            </div >
        )
    }
}

export default FormEditCorporateLeavePlafon