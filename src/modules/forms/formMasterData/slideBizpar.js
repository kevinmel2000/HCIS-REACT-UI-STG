import React, { Component } from "react"
import * as R from 'ramda'
import DropDown from '../../../modules/popup/DropDown'
import ReactTooltip from 'react-tooltip'
import M from 'moment'

class SlideBizpar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            bizparData: {
                ...props.bizparData,
                bizparCreationalDTO: {
                    ...props.bizparData,
                    modifiedDate: M().format("DD-MM-YYYY HH:mm:ss"),
                    modifiedBy: props.user.employeeID,
                }
            }
        }
    }

    componentDidUpdate(prevProps) {
        let index, bizVal = ''
        if (this.props.bizparData !== prevProps.bizparData) {
            if (this.props.bizparData) {
                index = R.findIndex(R.propEq('bizparKey', this.props.bizparData.bizparCategory))(this.props.dataBizpar)
                bizVal = index >= 0 ? this.props.dataBizpar[index].bizparValue : ''
                this.setState({
                    bizparData: {
                        ...this.props.bizparData,
                        bizparCreationalDTO: {
                            ...this.props.bizparData,
                            modifiedDate: M().format("DD-MM-YYYY HH:mm:ss"),
                            modifiedBy: this.props.user.employeeID,
                        }
                    },
                    bizVal
                })
            }
        }
    }

    render() {
        return (
            <div>
                <div className="a-s-p-place active">
                    <div className="a-s-p-top">
                        <div className="grid grid-2x">
                            <div className="col-1" style={{ width: "140%" }}>
                                <div className="display-flex-normal margin-top-10px">
                                    <i className="fa fa-1x fa-industry"></i>
                                    <span className="txt-site txt-11 txt-main margin-left-10px">
                                        Bussiness Parameter - {this.props.type === 'update' ? 'Edit' : 'View'} Form
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
                    <form action="#" onSubmit={(e) => {
                        e.preventDefault()
                        this.props.onClickSave(this.state.bizparData)
                    }}>
                        <div className="a-s-p-mid a-s-p-pad border-top">
                            <div className="column-1">
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Bizpar Category <span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                    </div>
                                    <DropDown
                                        title="-- please select category --"
                                        onChange={(dt) => this.setState({
                                            bizparData: {
                                                ...this.state.bizparData,
                                                bizparCategory: dt
                                            }
                                        })}
                                        bizValue={this.state.bizVal}
                                        disabled={this.props.type !== 'create'}
                                        data={this.props.dataBizpar}
                                        value={this.state.bizparData.bizparCategory}
                                        type="bizpar"
                                    />
                                </div>

                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Key <span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                    </div>
                                    <input
                                        readOnly={this.props.type !== "create" ? true : false}
                                        style={this.props.type !== "create" ? { backgroundColor: "#E6E6E6" } : null}
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                        required
                                        value={this.state.bizparData.bizparKey}
                                        onChange={e =>
                                            this.setState({
                                                bizparData: {
                                                    ...this.state.bizparData,
                                                    bizparKey: e.target.value
                                                }
                                            })}
                                    />
                                </div>
                            </div>

                            <div className="column-2">
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Value <span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                    </div>
                                    <input
                                        readOnly={this.props.type === "view" ? true : false}
                                        style={this.props.type === "view" ? { backgroundColor: "#E6E6E6" } : null}
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                        required
                                        value={this.state.bizparData.bizparValue}
                                        onChange={e =>
                                            this.setState({
                                                bizparData: {
                                                    ...this.state.bizparData,
                                                    bizparValue: e.target.value
                                                }
                                            })}
                                    />
                                </div>

                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Status</h4>
                                        </div>
                                    </div>
                                    <div className="margin-15px">
                                        <label className="radio">
                                            <input type="checkbox" checked disabled />
                                            <span className="checkmark" />
                                            <div className="txt-site txt-11 txt-bold txt-main">
                                                <h4>Active</h4>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                                <div className="padding-top-15px padding-bottom-15px border-top">
                                    <div className="padding-top-20px">
                                        <div className="grid grid-2x">
                                            <div className="col-1 content-left">
                                                <button
                                                    onClick={this.props.closeSlide}
                                                    type='button'
                                                    className="btn btn-primary margin-right-10px content-left">
                                                    BACK
                                                   </button>
                                            </div>
                                            {this.props.type === 'update' && (
                                                <div className="col-2 content-right">
                                                    <button
                                                        type="submit"
                                                        className="btn btn-blue"
                                                    >
                                                        SAVE
                                                </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                    <ReactTooltip />
                </div>
            </div>
        )
    }
}

export default SlideBizpar