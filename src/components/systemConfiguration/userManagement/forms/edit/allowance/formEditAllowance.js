import React, { Component } from 'react'
import DropDown from '../../../../../../modules/popup/DropDown'
import NumberFormat from "react-number-format";
import M from 'moment'
import * as R from 'ramda'
 
class formEditAllowance extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: this.props.data
        }
    }

    componentDidUpdate(prevProps){
        if(this.props.data !== prevProps.data){
            this.setState({
                data: this.props.data
            })
        }
    }

    componentDidMount(){
        console.log(this.props.cnbType)
    }

    render() {
        return (
            <div className="a-s-p-place active">
                <div className="a-s-p-top">
                    <div className="grid grid-2x">
                        <div className="col-1">
                            <div className="display-flex-normal margin-top-10px">
                                <i className="fa fa-1x fa-clipboard-list"></i>
                                <span className="txt-site txt-11 txt-main margin-left-10px">
                                    C&B Component Allowance
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
                    <form action="#" onSubmit={(e) => {
                        e.preventDefault()
                        this.props.onClickSave(this.state.data)
                    }}>
                        <div className="margin-15px">
                            <div className="margin-bottom-20px">
                                <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                    <h4>C&B Price ID <span style={{ color: "red" }}>*</span></h4>
                                </div>
                                <div className="margin-5px">
                                    <input
                                        type="text"
                                        style={{ backgroundColor: '#E6E6E6' }}
                                        required
                                        value={this.state.data.cnbcomponentAllowanceID}
                                        className="txt txt-sekunder-color"
                                    />
                                </div>
                            </div>
                            <div className="margin-bottom-20px">
                                <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                    <h4>Name <span style={{ color: "red" }}>*</span></h4>
                                </div>
                                <div className="margin-5px">
                                    <input
                                        onChange={(e) => this.setState({
                                            data: {
                                                ...this.state.data,
                                                cnbcomponentAllowanceName: e.target.value
                                            }
                                        })}
                                        type="text"
                                        required
                                        value={this.state.data.cnbcomponentAllowanceName}
                                        className="txt txt-sekunder-color"
                                    />
                                </div>
                            </div>
                            <div className="margin-bottom-20px">
                                <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                    <h4>Component Type <span style={{ color: "red" }}>*</span></h4>
                                </div>
                                <div className="margin-5px">
                                    {/* <input
                                        readOnly
                                        style={{ backgroundColor: '#E6E6E6' }}
                                        type="text"
                                        required
                                        value={'CNB'}
                                        className="txt txt-sekunder-color"
                                    /> */}
                                    <DropDown
                                        type='bizpar'
                                        data={this.props.cnbType}
                                        title="-- please select Type --" 
                                        onChange={(dt) => this.setState({
                                            data: {
                                                ...this.state.data,
                                                cnbcomponentAllowanceType: dt
                                            }
                                        })} 
                                        value={this.state.data.cnbcomponentAllowanceType}
                                    />
                                </div>
                            </div>
                            <div className="margin-bottom-20px">
                                <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                    <h4>Component Name<span style={{ color: "red" }}>*</span></h4>
                                </div>
                                <div className="margin-5px">
                                    <input
                                        type="text"
                                        required
                                        onChange={(e) => this.setState({
                                            data: {
                                                ...this.state.data,
                                                cnbcomponentName: e.target.value
                                            }
                                        })}
                                        value={this.state.data.cnbcomponentName}
                                        className="txt txt-sekunder-color"
                                    />
                                </div>
                            </div>
                            <div className="margin-bottom-20px">
                                <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                    <h4>Component Key</h4>
                                </div>
                                <div className="margin-5px">
                                    <input
                                        type="text"
                                        required
                                        onChange={(e) => this.setState({
                                            data: {
                                                ...this.state.data,
                                                cnbcomponentKey: e.target.value
                                            }
                                        })}
                                        value={this.state.data.cnbcomponentKey}
                                        className="txt txt-sekunder-color"
                                    />
                                </div>
                            </div>

                            <div className="margin-bottom-20px">
                                <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                    <h4>Grade</h4>
                                </div>
                                <div className="margin-5px">
                                    <DropDown
                                        data={this.props.bizparGrade}
                                        title="-- please select Grade --"
                                        type='bizpar'
                                        onChange={(dt) => this.setState({
                                            data: {
                                                ...this.state.data,
                                                cnbcomponentGrade: dt
                                            }
                                        })}
                                        bizValue={this.props.data ? this.props.data.cnbcomponentGrade.bizparValue : this.state.data.cnbcomponentGrade}
                                        value={this.props.data ? this.state.data.cnbcomponentGrade.bizparKey : this.state.data.cnbcomponentGrade}
                                    />
                                </div>
                            </div>
                            <div className="margin-bottom-20px">
                                <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                    <h4>Amount</h4>
                                </div>
                                <div className="margin-5px">
                                    {/* <input
                                        type="text"
                                        required
                                        onChange={(e)=> this.setState({
                                            data: {
                                                ...this.state.data,
                                                cnbcomponentAmount: e.target.value
                                            }
                                        })}
                                        value={this.state.data.cnbcomponentAmount}
                                        className="txt txt-sekunder-color"
                                    /> */}
                                    <div className="card-date-picker">
                                        <div className="double">
                                            <NumberFormat
                                                thousandSeparator={true}
                                                value={this.state.data.cnbcomponentAmount}
                                                className="txt txt-sekunder-color"
                                                placeholder=""
                                                onValueChange={(e)=> this.setState({
                                                    data: {
                                                        ...this.state.data,
                                                        cnbcomponentAmount: e.formattedValue
                                                    }
                                                })}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="margin-bottom-20px">
                                <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                    <h4>Description</h4>
                                </div>
                                <div className="margin-5px">
                                    <textarea
                                        class="form-control rounded-0"
                                        type="text"
                                        onChange={(e) => this.setState({
                                            data: {
                                                ...this.state.data,
                                                cnbcomponentAllowanceDescription: e.target.value
                                            }
                                        })}
                                        required
                                        placeholder=""
                                        cols="80"
                                        rows="5"
                                        value={this.state.data.cnbcomponentAllowanceDescription}
                                    />
                                </div>
                            </div>
                            <div className="margin-bottom-20px">
                                <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                    <h4>Activation</h4>
                                </div>
                                <div className="margin-15px">
                                    <label className="radio">
                                        <input type="checkbox" name="status" checked={this.state.data.cnbcomponentAllowanceStatus === "ACTIVE" ? true : false} onClick={() => this.setState({ data: { ...this.state.data, cnbcomponentAllowanceStatus: this.state.data.cnbcomponentAllowanceStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE" } })} />
                                        <span className="checkmark" />
                                        <span className="txt-site txt-11 txt-bold txt-main">
                                            is Active
                                                </span>
                                    </label>
                                </div>
                            </div>

                            <div className="border-bottom padding-15px content-right">
                                <button
                                    className="btn btn-blue"
                                    type='submit'>
                                    SUBMIT
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default formEditAllowance