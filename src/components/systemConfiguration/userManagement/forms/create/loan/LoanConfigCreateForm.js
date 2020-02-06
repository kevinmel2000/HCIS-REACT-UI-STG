import React, { Component } from 'react'

// import { connect } from 'react-redux'
import M from 'moment'
// import Loader from 'react-loader-spinner'
// import * as R from 'ramda'
// import Api from '../../../../../../Services/Api'

import CalendarPicker from '../../../../../../modules/popup/Calendar'

const defaultPayload = {
    "laonRuleStatus": "ACTIVE",
    "loanRuleCreational": {
      "createdBy": "SYSTEM",
      "createdDate": M().format("DD-MM-YYYY HH:mm:ss"),
      "modifiedBy": null,
      "modifiedDate": null
    },
    "loanRuleDescription": "",
    "loanRuleEffectiveDate": "",
    "loanRuleID": "",
    "loanRuleName": "",
    "loanRuleType": ""
}

class LoanConfigCreateForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            dataLoan: props.payload ? {
                ...props.payload,
                loanRuleEffectiveDate: M(props.payload.loanRuleEffectiveDate, "DD-MM-YYYY").format("YYYY-MM-DD")
            } : {
                    ...defaultPayload,
                    loanRuleID: 'LR-' + M(),
                    loanRuleCreational: {
                        ...defaultPayload.loanRuleCreational,
                        createdBy: this.props.loginEmployeeID,
                        modifiedBy: this.props.loginEmployeeID,
                    }
                },
        }
    }

    componentDidUpdate(prevProps) {
        // console.log(this.props.payload)

        if (this.props.type === "edit") {
            if (this.props.payload !== prevProps.payload) {
                this.setState({
                    dataLoan: {
                        ...this.props.payload,
                        loanRuleEffectiveDate: M(this.props.payload.loanRuleEffectiveDate, "DD-MM-YYYY").format("YYYY-MM-DD")
                    }
                })
            }
        }
    }

    renderCreate = () => {
        let data = []
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px" />
                <div className="popup-content-small background-white border-radius">
                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="popup-title">
                                {'Loan Configuration'}
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
                    <div className="padding-15px">
                        <form action="#" onSubmit={(e) => {
                            e.preventDefault()
                            this.props.onClickSave(this.state.dataLoan)
                            // console.log('Loan', this.state.dataLoan)
                        }}>
                            <div className="display-flex-normals">
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Loan Rule ID</h4>
                                        </div>
                                    </div>
                                    <input
                                        className="txt txt-sekunder-color"
                                        type="text"
                                        readOnly
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        required
                                        onChange={(e) => this.setState({
                                            dataLoan: {
                                                ...this.state.dataLoan,
                                                loanRuleID: e.target.value
                                            }
                                        })}
                                        value={this.state.dataLoan.loanRuleID}
                                    ></input>
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Loan Rule Name</h4>
                                        </div>
                                    </div>
                                    <input
                                        className="txt txt-sekunder-color"
                                        type="text"
                                        required
                                        onChange={(e) => this.setState({
                                            dataLoan: {
                                                ...this.state.dataLoan,
                                                loanRuleName: e.target.value
                                            }
                                        })}
                                    ></input>
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Loan Rule Effective Date</h4>
                                        </div>
                                    </div>

                                    <CalendarPicker
                                        // date={data[3]}
                                        onChange={(e) => this.setState({
                                            dataLoan: {
                                                ...this.state.dataLoan,
                                                loanRuleEffectiveDate: e
                                            }
                                        })}
                                    />
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Loan Rule Description</h4>
                                        </div>
                                    </div>
                                    <input
                                        className="txt txt-sekunder-color"
                                        type="text"
                                        required
                                        onChange={(e) => this.setState({
                                            dataLoan: {
                                                ...this.state.dataLoan,
                                                loanRuleDescription: e.target.value
                                            }
                                        })}
                                    ></input>
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Loan Rule Status</h4>
                                        </div>
                                    </div>
                                    {/* <input
                                        className="txt txt-sekunder-color"
                                        type="text"
                                        required
                                        placeholder="ACTIVE/INACTIVE"
                                        onChange={(e) => this.setState({
                                            dataLoan: {
                                                ...this.state.dataLoan,
                                                laonRuleStatus: e.target.value
                                            }
                                        })}
                                    ></input> */}

                                    <div className="margin-15px">
                                        <label className="radio">
                                            <input type="checkbox"
                                                onChange={(e) => this.setState({
                                                    dataLoan: {
                                                        ...this.state.dataLoan,
                                                        laonRuleStatus: e.target.checked ? 'ACTIVE': 'INACTIVE'
                                                    }
                                                })}
                                                checked={true} />
                                            <span className="checkmark" />
                                            <span className="txt-site txt-11 txt-bold txt-main">
                                                ACTIVE
                                            </span>
                                        </label>
                                    </div>
                                </div>
                                <div className="padding-top-15px">
                                    <div className="grid">
                                        <div className="content-right">
                                            <button
                                                className="btn btn-blue"
                                                type="submit"
                                                // onClick={this.props.onClickSave}
                                            >
                                                <span>SUBMIT</span>
                                            </button>
                                            <button
                                                style={{ marginLeft: "15px" }}
                                                className="btn btn-primary"
                                                type="button"
                                                onClick={this.props.onClickClose}
                                            >
                                                <span>CLOSE</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="padding-bottom-20px" />
            </div>
        )
    }

    renderEdit = () => {
        return (
            <div className="a-s-p-place active">
                <div className="a-s-p-top">
                    <div className="grid grid-2x">
                        <div className="col-1" style={{ width: '140%' }}>
                            <div className="display-flex-normal margin-top-10px">
                                <i className="fa fa-1x fa-file-invoice-dollar"></i>
                                <span className="txt-site txt-11 txt-main margin-left-10px">
                                    Loan Configuration - {this.props.type !== "edit" ? "Detail Form" : "Edit Form"}
                                </span>
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button
                                className="btn btn-circle btn-grey"
                                onClick={this.props.closeSlide}
                            >
                                <i className="fa fa-lg fa-arrow-right" />
                            </button>
                        </div>
                    </div>
                </div>
                <form action="#" onSubmit={(e) => {
                        e.preventDefault()
                        this.props.onClickSave(this.state.dataLoan)
                        // this.handleSubmit()
                    }}>
                    <div className="a-s-p-mid a-s-p-pad border-top">
                        <div className="display-flex-normals margin-bottom-10px">
                            <div className="padding-top-15px padding-bottom-15px">
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Loan Rule ID</h4>
                                        </div>
                                    </div>
                                    <input
                                        // style={{ backgroundColor: this.props.type === 'edit' ? null : "#E6E6E6" }}
                                        readOnly={this.props.type !== 'edit'}
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        readOnly
                                        className="txt txt-sekunder-color"
                                        type="text"
                                        required
                                        onChange={e => this.setState({
                                            dataLoan: {
                                                ...this.state.dataLoan,
                                                loanRuleName: e.target.value
                                            }
                                        })}
                                        value={this.state.dataLoan.loanRuleID}
                                    ></input>
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Loan Rule Name</h4>
                                        </div>
                                    </div>
                                    <input
                                        style={{ backgroundColor: this.props.type === 'edit' ? null : "#E6E6E6" }}
                                        // readOnly={this.props.type !== 'edit'}
                                        className="txt txt-sekunder-color"
                                        type="text"
                                        required
                                        onChange={(e) => this.setState({
                                            dataLoan: {
                                                ...this.state.dataLoan,
                                                loanRuleName: e.target.value
                                            }
                                        })}
                                        value={this.state.dataLoan.loanRuleName}
                                    ></input>
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Loan Rule Effective Date</h4>
                                        </div>
                                    </div>
                                    
                                    <CalendarPicker
                                        date={this.state.dataLoan.loanRuleEffectiveDate}
                                        disabled={this.props.type !== 'edit'}
                                        onChange={(e) => this.setState({
                                            dataLoan: {
                                                ...this.state.dataLoan,
                                                loanRuleEffectiveDate: e
                                            }
                                        })}
                                    />
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Loan Rule Description</h4>
                                        </div>
                                    </div>
                                    <input
                                        style={{ backgroundColor: this.props.type === 'edit' ? null : "#E6E6E6" }}
                                        // readOnly={this.props.type !== 'edit'}
                                        className="txt txt-sekunder-color"
                                        type="text"
                                        required
                                        onChange={(e) => this.setState({
                                            dataLoan: {
                                                ...this.state.dataLoan,
                                                loanRuleDescription: e.target.value
                                            }
                                        })}
                                        value={this.state.dataLoan.loanRuleDescription}
                                    ></input>
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Loan Rule Status</h4>
                                        </div>
                                    </div>
                                    {/* <input
                                        className="txt txt-sekunder-color"
                                        style={{ backgroundColor: this.props.type === 'edit' ? null : "#E6E6E6" }}
                                        // readOnly={this.props.type !== 'edit'}
                                        type="text"
                                        required
                                        placeholder="ACTIVE/INACTIVE"
                                        onChange={(e) => this.setState({
                                            dataLoan: {
                                                ...this.state.dataLoan,
                                                laonRuleStatus: e.target.value
                                            }
                                        })}
                                        value={this.state.dataLoan.laonRuleStatus}
                                    ></input> */}

                                    <div className="margin-15px">
                                        <label className="radio" style={{cursor: this.props.type === 'edit' ? 'pointer' : 'default'}}>
                                            { this.props.type === 'edit' ?
                                                <input type="checkbox"
                                                    onChange={(e) => this.setState({
                                                        dataLoan: {
                                                            ...this.state.dataLoan,
                                                            laonRuleStatus: e.target.checked ? 'ACTIVE': 'INACTIVE'
                                                        }
                                                    })}
                                                    checked={this.state.dataLoan.laonRuleStatus === 'ACTIVE' ? true : false } />
                                                : <input 
                                                    type="checkbox" 
                                                    disabled 
                                                    checked={this.state.dataLoan.laonRuleStatus === 'ACTIVE' ? true : false } /> 
                                            }
                                            <span className="checkmark" />
                                            <span className="txt-site txt-11 txt-bold txt-main">
                                                ACTIVE
                                            </span>
                                        </label>
                                    </div>
                                </div>
                                <div className="padding-15px">
                                    <div className="grid">
                                        <div className="content-right">
                                            {this.props.type === 'edit' && (
                                                <button
                                                    className="btn btn-blue"
                                                    type="submit"
                                                    // onClick={() => this.openPopUp("save")}
                                                >
                                                    <span>SUBMIT</span>
                                                </button>
                                            )}
                                            <button
                                                style={{ marginLeft: "15px" }}
                                                className="btn btn-primary"
                                                type="button"
                                                onClick={this.props.closeSlide}
                                            >
                                                <span>CLOSE</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div >
        )
    }

    render() {
        return (
            <div>
                {this.props.type === "create" ? this.renderCreate() : <div className="a-s-p-side"> {this.renderEdit()} </div>}
            </div>
        )
    }
}

export default LoanConfigCreateForm