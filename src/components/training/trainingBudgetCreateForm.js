import React, { Component } from 'react'
import NumberFormat from 'react-number-format'
import M from 'moment'

const timeNow = M().format('DD-MM-YYYY HH:mm:ss')

class TrainingBudgetCreateForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {
                "createdBy": "SYSTEM",
                'createdDate': timeNow,
                "updatedBy": "SYSTEM",
                "updatedDate": timeNow,
                "trainingBudgetStatus": "ACTIVE",
            }
        }
    }
    render() {
        let data = this.state
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px" />
                <div className="popup-content-small background-white border-radius">
                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="popup-title">
                                {'Training Budget'}
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
                        <form action="#"
                            onSubmit={(e) => {
                                e.preventDefault()
                                this.props.onClickSave(this.state.data)
                            }}
                        >
                            <div className="display-flex-normals">
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Training Budget Name <span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                    </div>
                                    <input
                                        className="txt txt-sekunder-color"
                                        type="text"
                                        required
                                        onChange={(e) => {
                                            if (isNaN(e.target.value)) return true
                                            this.setState({
                                                data: {
                                                    ...this.state.data,
                                                    trainingBudgetName: e.target.value
                                                }
                                            })
                                        }}
                                        value={data.trainingBudgetName}
                                    ></input>
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Period <span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                    </div>
                                    <input
                                        className="txt txt-sekunder-color"
                                        type="text"
                                        required
                                        onChange={(e) => {
                                            if (isNaN(e.target.value)) return true
                                            this.setState({ data: { ...this.state.data, trainingBudgetPeriod: e.target.value } })
                                        }}
                                        value={data.trainingBudgetPeriod}
                                    ></input>
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Training Budget <span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                    </div>
                                    <input
                                        className="txt txt-sekunder-color"
                                        type="text"
                                        required
                                        onChange={(e) => {
                                            if (isNaN(e.target.value)) return true
                                            this.setState({
                                                data: {
                                                    ...this.state.data,
                                                    trainingBudget: e.target.value
                                                }
                                            })
                                        }}
                                        value={data.trainingBudget}
                                    ></input>
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Remaining Budget <span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                    </div>
                                    <input
                                            className="txt txt-sekunder-color"
                                            type="text"
                                            required
                                            onChange={(e) => {
                                                if (isNaN(e.target.value)) return true
                                                this.setState({ data: { ...this.state.data, trainingBudgetRemainingBudget: e.target.value } })
                                            }}
                                            value={data.trainingBudgetRemainingBudget}
                                        ></input>
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Training Budget Type <span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                    </div>
                                    <input
                                        className="txt txt-sekunder-color"
                                        type="text"
                                        required
                                        onChange={(e) => {
                                            if (isNaN(e.target.value)) return true
                                            this.setState({ data: { ...this.state.data, trainingBudgetType: e.target.value } })
                                        }}
                                        value={data.trainingBudgetType}
                                    ></input>
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Description</h4>
                                        </div>
                                    </div>
                                    <textarea
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                        rows={4}
                                        onChange={e => this.setState({ data: { ...this.state.data, trainingBudgetDescription: e.target.value } })}
                                        value={data.trainingBudgetDescription}
                                    />
                                </div>
                                <div className="padding-top-15px">
                                    <div className="grid">
                                        <div className="content-right">
                                            <button
                                                className="btn btn-blue"
                                                type="submit"
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
}

export default TrainingBudgetCreateForm 