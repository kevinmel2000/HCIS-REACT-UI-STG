import React, { Component } from 'react'
import ReactTooltip from 'react-tooltip'
import M from 'moment'

class SlideInstitute extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {
                ...props.data,
                instituteCreationalDTO: {
                    ...props.data.instituteCreationalDTO,
                    modifiedBy: props.user.employeeID,
                    modifiedDate: M().format("DD-MM-YYYY HH:mm:ss")
                }
            }
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.data !== prevProps.data) {
            this.setState({
                data: {
                    ...this.props.data,
                    instituteCreationalDTO: {
                        ...this.props.data.instituteCreationalDTO,
                        modifiedBy: this.props.user.employeeID,
                        modifiedDate: M().format("DD-MM-YYYY HH:mm:ss")
                    }
                }
            })
        }
    }

    render() {
        let { instituteID, instituteName, instituteAddress, instituteStatus } = this.state.data
        return (
            <div>
                <div className="a-s-p-place active">
                    <div className="a-s-p-top">
                        <div className="grid grid-2x">
                            <div className="col-1">
                                <div className="display-flex-normal margin-top-10px">
                                    <i className="fa fa-1x fa-graduation-cap"></i>
                                    <span className="txt-site txt-11 txt-main margin-left-10px">
                                        Institute - {this.props.type === 'update' ? 'Edit' : 'View'} Form
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
                        this.props.onClickSave(this.state.data)
                    }}>
                        <div className="a-s-p-mid a-s-p-pad border-top">
                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>Institute ID</h4>
                                    </div>
                                </div>
                                <input
                                    readOnly
                                    style={{ backgroundColor: "#E6E6E6" }}
                                    type="text"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                    value={instituteID}
                                />
                            </div>

                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>Institute Name <span style={{ color: "red" }}>*</span></h4>
                                    </div>
                                </div>
                                <input
                                    readOnly={this.props.type === "view" ? true : false}
                                    style={
                                        this.props.type === "view"
                                            ? { backgroundColor: "#E6E6E6" }
                                            : null
                                    }
                                    type="text"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                    value={instituteName}
                                    onChange={(e) => {
                                        this.setState({
                                            data: {
                                                ...this.state.data,
                                                instituteName: e.target.value
                                            }
                                        })
                                    }}
                                />
                            </div>
                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>Address <span style={{ color: "red" }}>*</span></h4>
                                    </div>
                                </div>
                                <textarea
                                    readOnly={this.props.type === "view" ? true : false}
                                    style={
                                        this.props.type === "view"
                                            ? { backgroundColor: "#E6E6E6" }
                                            : null
                                    }
                                    rows={5}
                                    type="text"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                    value={instituteAddress}
                                    onChange={(e) => {
                                        this.setState({
                                            data: {
                                                ...this.state.data,
                                                instituteAddress: e.target.value
                                            }
                                        })
                                    }}
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
                                        <input type="checkbox" checked={instituteStatus} disabled />
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
                                                <button type="submit" className="btn btn-blue">
                                                    SAVE
                                                  </button>
                                            </div>
                                        )}
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

export default SlideInstitute