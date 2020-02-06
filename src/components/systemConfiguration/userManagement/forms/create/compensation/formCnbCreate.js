import React, { Component } from 'react'
import { connect } from 'react-redux'
import M from 'moment'
import * as R from 'ramda'
import Loader from 'react-loader-spinner'
import Api from '../../../../../../Services/Api'

const defaultPayload = {
    "cnbtplid": "",
    "cnbtplname": "",
    "cnbphotoURL": "",
    "company": "",
    "cnbstatus": true,
    "cnbdetails": [],
    "cnbcreational": {
        "createdBy": "SYSTEM",
        "createdDate": M().format("DD-MM-YYYY HH:mm:ss"),
        "modifiedBy": null,
        "modifiedDate": null
    },
    "cnbnotes": ""
}

class formCnbCreate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            payloadCnb: props.payloadCnb ? {
                ...props.payloadCnb,
                cnbstatus: props.payloadCnb.cnbstatus === "ACTIVE" ? true : false
            } : {
                    ...defaultPayload, cnbtplid: 'CNBTPL-' + M(),
                    cnbcreational: { ...defaultPayload.cnbcreational, createdBy: props.auth.user.employeeID, modifiedBy: props.auth.user.employeeID }
                },
            imageUrl: "",
            loading: false
        }
        console.log(this.state.payloadCnb)
    }

    componentDidMount() {
        if (this.props.type === "update") {
            this.getImage()
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.type === "update") {
            if (this.props.payloadCnb !== prevProps.payloadCnb) {
                this.setState({ payloadCnb: { ...this.props.payloadCnb, cnbstatus: this.props.payloadCnb.cnbstatus === "ACTIVE" ? true : false } })
                this.getImage()
                console.log('prooooo', this.state.payloadCnb)
            }
        }
    }

    async handleChange(event) {
        let { payloadCnb } = this.state
        const formData = new FormData();
        let length = event.target.files[0].name.split(".").length
        let fileType = event.target.files[0].name.split(".")[length - 1]
        formData.append('file', event.target.files[0])
        formData.append('cNBTPLID', payloadCnb.cnbtplid)
        if (fileType === "jpg" || fileType === "jpeg" || fileType === "png") {
            let response = await Api.create('CFG').postPhotoCorporateCnb(formData)
            if (!response.ok && response.status === 413) alert("Your Image Too Large, Please Select Another Image")
            if (!response.ok && R.isNil(response.status)) alert(response.problem)
            switch (response.data.status) {
                case "S":
                    let res = await Api.create('CFG').getCNBbyID(payloadCnb.cnbtplid)
                    payloadCnb = {
                        ...payloadCnb,
                        cnbphotoURL: res.data.data.cnbphotoURL
                    }
                    this.setState({ imageUrl: "", payloadCnb }, () => {
                        this.getImage()
                    })
                    break;
                default:
                    break;
            }
        } else {
            alert("Unsupported Media Type")
        }
    }

    async getImage() {
        this.setState({ loading: true, imageUrl: '' })
        let { payloadCnb } = this.props
        let response = await fetch(process.env.REACT_APP_HCIS_BE_API + 'cfg/api/corporate.cnb.tpl.photo.get/' + payloadCnb.cnbtplid, {
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4'
            }
        })
        if (response.ok) {
            response = await response.blob()
            if (response.size > 0) {
                setTimeout(() => {
                    response = URL.createObjectURL(response);
                    this.setState({ imageUrl: response, loading: false })
                }, 500)
            } else {
                setTimeout(() => {
                    this.setState({
                        payloadCnb: {
                            ...payloadCnb,
                            cnbstatus: payloadCnb.cnbstatus === "ACTIVE" ? true : false,
                            cnbphotoURL: ""
                        },
                        loading: false
                    })
                }, 500)
            }
        }
    }

    renderFormCreate = () => {
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px" />
                <div className="popup-content-small background-white border-radius">
                    <form action="#" onSubmit={(e) => {
                        e.preventDefault()
                        this.props.onClickSave(this.state.payloadCnb)
                    }}>
                        <div className="popup-panel grid grid-2x">
                            <div className="col-1">
                                <div className="popup-title">
                                    {'CNB Template - Create Form'}
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
                        <div className="display-flex-normal">
                            <div style={{ width: '35%' }}>
                                <div className="padding-15px">
                                    <div>
                                        <div className="margin-30px">
                                            <div className="image image-100px image-circle background-white border-all" style={{ margin: 'auto' }}>
                                                <i className="icn fa fa-2x fa-image"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ width: '65%' }}>
                                <div className="padding-15px">
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Template ID: {this.state.payloadCnb.cnbtplid}</h4>
                                        </div>
                                        <div className="margin-15px">
                                            <p className="txt-site txt-11 txt-primary">
                                                The Compensation and Benefit menu is to be used to create Compensation and Benefit template for employee.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Template Name <span style={{ color: 'red' }}>*</span></h4>
                                        </div>
                                        <div className="margin-15px">
                                            <div className="card-date-picker">
                                                <div className="double">
                                                    <input
                                                        type="text"
                                                        required
                                                        className="txt txt-sekunder-color"
                                                        placeholder=""
                                                        onChange={(e) => this.setState({
                                                            payloadCnb: {
                                                                ...this.state.payloadCnb,
                                                                cnbtplname: e.target.value
                                                            }
                                                        })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Activation</h4>
                                        </div>
                                        <div className="margin-15px">
                                            <label className="radio">
                                                <input type="checkbox"
                                                    onChange={(e) => this.setState({
                                                        payloadCnb: {
                                                            ...this.state.payloadCnb,
                                                            cnbstatus: e.target.checked
                                                        }
                                                    })}
                                                    checked={this.state.payloadCnb.cnbstatus} />
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

                        <div className="border-bottom padding-15px content-right">
                            <button className="btn btn-blue" type='submit'> SAVE </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

    renderFormEdit = () => {
        let { payloadCnb } = this.state
        return (
            <form action="#" onSubmit={(e) => {
                e.preventDefault()
                this.props.onClickSave(payloadCnb)
            }}>
                <div>
                    <div>
                        <div className="margin-30px">
                            <div className="image image-100px image-circle background-white border-all" style={{ margin: 'auto' }}>
                                {this.state.loading && (
                                    <Loader
                                    type="ThreeDots"
                                    style={{ display: 'flex', justifyContent: 'center', marginTop: 45 }}
                                    color={"#somecolor"}
                                    height={30}
                                    width={30}
                                    loading={this.state.loading} />
                                )}
                                {!R.isNil(payloadCnb.cnbphotoURL) && !R.isEmpty(payloadCnb.cnbphotoURL) ? (
                                    <img width="100%" height="100%" src={this.state.imageUrl} alt="" />
                                ) : this.state.loading === true ? <i /> : <i className="icn fa fa-2x fa-image"></i>}
                            </div>
                        </div>

                        <div className="txt-site txt-13 txt-bold txt-main content-center">
                            <input
                                type="file"
                                id="pick-image"
                                style={{ display: "none" }}
                                onChange={this.handleChange.bind(this)} />
                            <label htmlFor="pick-image">
                                <div className="btn btn-div btn-grey-dark">
                                    <i className="fa fa-1x fa-upload margin-right-10px"></i>
                                    Pick Image
                                </div>
                            </label>
                        </div>
                        <div className="margin-15px">
                            <div className="margin-bottom-20px">
                                <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                    <h4>Template ID: {this.props.payloadCnb.cnbtplid}</h4>
                                </div>
                                <div className="margin-5px">
                                    <p className="txt-site txt-11 txt-primary">
                                        The Compensation and Benefit menu is to be used to create Compensation and Benefit template for employee.
                                    </p>
                                </div>
                            </div>
                            <div className="margin-bottom-20px">
                                <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                    <h4>Template Name <span style={{ color: "red" }}>*</span></h4>
                                </div>
                                <div className="margin-5px">
                                    <div className="card-date-picker">
                                        <div className="double">
                                            <input
                                                type="text"
                                                className="txt txt-sekunder-color"
                                                placeholder=""
                                                required
                                                value={payloadCnb.cnbtplname}
                                                onChange={(e) => this.setState({
                                                    payloadCnb: {
                                                        ...this.state.payloadCnb,
                                                        cnbtplname: e.target.value
                                                    }
                                                })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="margin-bottom-20px">
                                <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                    <h4>Activation</h4>
                                </div>
                                <div className="margin-15px">
                                    <label className="radio">
                                        <input type="checkbox"
                                            checked={payloadCnb.cnbstatus}
                                            onChange={(e) => this.setState({
                                                payloadCnb: {
                                                    ...this.state.payloadCnb,
                                                    cnbstatus: e.target.checked
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

                <div className="margin-15px content-right">
                    <button className="btn btn-blue" type='submit'> SAVE </button>
                </div>

                <div className="border-bottom"></div>
            </form>
        )
    }

    render() {
        let { type } = this.props
        return (
            <div>
                {type === "create" ? this.renderFormCreate() : this.renderFormEdit()}
            </div >
        )
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    };
};

export default connect(mapStateToProps, null)(formCnbCreate)