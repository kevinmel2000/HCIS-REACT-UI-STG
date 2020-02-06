import React, { Component } from 'react'
import ReactTooltip from 'react-tooltip'
import FormSearchHolding from './formSearchHolding'
import FormSearchEmployee from './formSearchEmployee'
import DropDown from '../../../modules/popup/DropDown'
import * as R from 'ramda'

class FormCorporateGeneral extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: this.props.data,
            bizparCorporateType: this.props.bizparCorporateType,
            formSearchEmpVisible: false,
            formSearchHoldingVisible: false,
            dataEmp: '',
            dataHolding: '',
            imageUrl: ''
        }
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        this.getImageInit()
    }

    openSearchEmp() {
        this.setState({ formSearchEmpVisible: !this.state.formSearchEmpVisible })
    }

    openSearchHolding() {
        this.setState({ formSearchHoldingVisible: !this.state.formSearchHoldingVisible })
    }

    pickEmployee(value) {
        let dataEmp = value
        console.log('dataEmp', dataEmp)
        this.setState({ dataEmp, formSearchEmpVisible: !this.state.formSearchEmpVisible })
        this.getImage(dataEmp)
    }

    pickHolding(value) {
        let dataHolding = value
        console.log('dataHolding', dataHolding)
        this.setState({ dataHolding, formSearchHoldingVisible: !this.state.formSearchHoldingVisible })
    }

    async getImage(dataEmp) {
        let response = await fetch(process.env.REACT_APP_HCIS_BE_API + 'emcmd/api/employee.photo.get/' + dataEmp.employeeID, {
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4'
            }
        })
        response = await response.blob()
        if (response.size > 0) {
            response = URL.createObjectURL(response);
            this.setState({ imageUrl: response })
        }
        else { this.setState({ imageUrl: null }) }
    }

    async getImageInit() {
        let pic = this.props.data.pic ? this.props.data.pic : ''
        console.log('init', pic)
        let response = await fetch(process.env.REACT_APP_HCIS_BE_API + 'emcmd/api/employee.photo.get/' + pic.employeeID, {
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4'
            }
        })
        response = await response.blob()
        if (response.size > 0) {
            response = URL.createObjectURL(response);
            this.setState({ imageUrl: response })
        }
        else { this.setState({ imageUrl: null }) }
    }

    handleChange(event) {
        this.setState({
            file: URL.createObjectURL(event.target.files[0])
        })
    }

    removeChange = () => {
        this.setState({
            file: null
        })
    }

    componentDidUpdate(prevProps) {
        if (this.props.data) {
            if (this.props.data !== prevProps.data) {
                this.getImageInit()
                this.setState({
                    data: this.props.data
                })
            }
        }
    }

    render() {
        // console.log('img', this.state.imageUrl)
        let { type } = this.props
        let bizparCorporateType = this.state.bizparCorporateType
        let { esname, esemail, essubcoID, estelpNumber, estype, eswebsite, pic, parent } = this.state.data
        return (
            <div className="vertical-tab-content active">
                {this.state.formSearchEmpVisible && (
                    <FormSearchEmployee
                        onClickClose={this.openSearchEmp.bind(this)}
                        onClick={this.pickEmployee.bind(this)}
                    />
                )}
                {this.state.formSearchHoldingVisible && (
                    <FormSearchHolding
                        esid={this.state.data.esid}
                        onClickClose={this.openSearchHolding.bind(this)}
                        onClick={this.pickHolding.bind(this)}
                    />
                )}
                {/*<div className="padding-top-20px" />*/}
                <form action="#" onSubmit={(e) => {
                    e.preventDefault()
                    let dataParent = this.state.data.estype === 'CORPTYP-002' ? '' : this.state.dataHolding.esid
                    if (R.isEmpty(this.state.data.estype)) return alert('Corporate Type is Required.')
                    if (this.state.data.estype === 'CORPTYP-001') {
                        if (R.isNil(dataParent)) return alert('Holding is Required.')

                        return this.props.onClickSave({
                            ...this.state.data,
                            pic: this.state.dataEmp.employeeID ? this.state.dataEmp.employeeID : pic ? pic.employeeID : '',
                            parent: this.state.data.estype === 'CORPTYP-002' ? '' : this.state.dataHolding.esid ? this.state.dataHolding.esid : parent ? parent.esid : ''
                        })
                    }
                    this.props.onClickSave({
                        ...this.state.data,
                        pic: this.state.dataEmp.employeeID ? this.state.dataEmp.employeeID : pic ? pic.employeeID : '',
                        parent: this.state.data.estype === 'CORPTYP-002' ? '' : this.state.dataHolding.esid ? this.state.dataHolding.esid : parent ? parent.esid : ''
                    })

                }}>
                    <div className="a-s-p-mid a-s-p-pad">
                        <div>
                            <div className="margin-30px">
                                <div className="image image-150px image-circle background-white border-all" style={{ margin: 'auto' }}>
                                    {this.state.imageUrl ? (
                                        <img width="100%" height="100%" src={this.state.imageUrl} alt="img" />
                                    ) : <i className="icn fa fa-2x fa-user"></i>}
                                </div>
                                <div className="padding-5px content-center txt-site txt-13 txt-main txt-bold margin-top-15px">
                                    {(this.state.dataEmp.employeeID ? this.state.dataEmp.employeeID : !pic ? '' : pic.employeeID ? pic.employeeID : '') + ' - ' + (this.state.dataEmp.employeeName ? this.state.dataEmp.employeeName : !pic ? '' : pic.employeeName ? pic.employeeName : '')}
                                </div>
                            </div>
                        </div>

                        <div className="card-date-picker margin-bottom-20px">
                            <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                <h4>{"PIC"}</h4>
                                <i className="margin-left-15px margin-top-5px fa fa-1x fa-question-circle"></i>
                            </div>
                            <div className="txt-site txt-11 txt-primary margin-10px">
                                Person In Charge
                          </div>
                            <div className="double">
                                <input
                                    style={{ backgroundColor: "#E6E6E6", padding: 15 }}
                                    className="input"
                                    type="text"
                                    placeholder=""
                                    required
                                    value={
                                        (this.state.dataEmp.employeeID
                                            ? this.state.dataEmp.employeeID
                                            : !pic
                                                ? ""
                                                : pic.employeeID
                                                    ? pic.employeeID
                                                    : "") +
                                        " - " +
                                        (this.state.dataEmp.employeeName
                                            ? this.state.dataEmp.employeeName
                                            : !pic
                                                ? ""
                                                : pic.employeeName
                                                    ? pic.employeeName
                                                    : "")
                                    }
                                />
                                <button
                                    disabled={type === "detail"}
                                    type="button"
                                    className="btn btn-grey border-left btn-no-radius"
                                    onClick={() => this.openSearchEmp()}
                                >
                                    <i className="fa fa-lg fa-search"></i>
                                </button>
                            </div>
                        </div>

                        <div>
                            <div className="margin-bottom-20px">
                                <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                    <h4>Corporate ID <span style={{ color: "red" }}>*</span></h4>
                                </div>

                                <div className="margin-5px">
                                    <input
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        readOnly
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        value={essubcoID}
                                        onChange={(e) => {
                                            this.setState({
                                                data: {
                                                    ...this.state.data,
                                                    essubcoID: e.target.value
                                                }
                                            })
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="margin-bottom-20px">
                                <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                    <h4>Corporate Name <span style={{ color: "red" }}>*</span></h4>
                                </div>

                                <div className="margin-5px">
                                    <input
                                        required
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        readOnly={type === "detail"}
                                        style={type === "detail" ? { backgroundColor: "#E6E6E6" } : null}
                                        value={esname}
                                        onChange={(e) => {
                                            this.setState({
                                                data: {
                                                    ...this.state.data,
                                                    esname: e.target.value
                                                }
                                            })
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="margin-bottom-20px">
                                <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                    <h4>Corporate Type <span style={{ color: "red" }}>*</span></h4>
                                </div>
                                <div className="margin-5px">
                                    <DropDown
                                        bizValue={estype.bizparValue}
                                        title="-- please select corporate type --"
                                        onChange={dt =>
                                            this.setState({
                                                data: {
                                                    ...this.state.data,
                                                    estype: dt
                                                }
                                            })}
                                        disabled={type === "detail"}
                                        data={bizparCorporateType}
                                        value={estype.bizparKey}
                                        type="bizpar"
                                    />
                                    {/*<select className="slc slc-sekunder"
                                                disabled={type === "detail"}
                                                style={type === "detail" ? { backgroundColor: "#E6E6E6" } : null}
                                                value={estype.bizparKey}
                                                onChange={(e) => {
                                                    this.setState({
                                                        data: {
                                                            ...this.state.data,
                                                            estype: e.target.value
                                                        }
                                                    })
                                                }}
                                            >
                                                <option value="1">-- please select corporate type --</option>
                                                {bizparCorporateType && bizparCorporateType.map((data, index) => {
                                                    return (<option key={index} value={data.bizparKey}>{data.bizparValue}</option>)
                                                })}
                                            </select>*/}
                                </div>
                            </div>
                            <div className="card-date-picker margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>
                                            Holding Name <span style={{ color: "red" }}>*</span>
                                        </h4>
                                    </div>
                                </div>
                                <div className="double">
                                    <input
                                        style={{ backgroundColor: "#E6E6E6", padding: 15 }}
                                        className="input"
                                        type="text"
                                        placeholder=""
                                        required={
                                            this.state.data.estype === "CORPTYP-002" ? false : true
                                        }
                                        readOnly
                                        value={
                                            this.state.data.estype === "CORPTYP-002"
                                                ? ""
                                                : this.state.data.estype.bizparKey === "CORPTYP-002"
                                                    ? ""
                                                    : this.state.dataHolding.esname
                                                        ? this.state.dataHolding.esname
                                                        : parent && parent.esname
                                        }
                                    />
                                    <button
                                        disabled={type === "detail"}
                                        type="button"
                                        className="btn btn-grey border-left btn-no-radius"
                                        onClick={
                                            this.state.data.estype === "CORPTYP-002"
                                                ? null
                                                : this.state.data.estype.bizparKey === "CORPTYP-002"
                                                    ? null
                                                    : () => this.openSearchHolding()
                                        }
                                    >
                                        <i className="fa fa-lg fa-search"></i>
                                    </button>
                                </div>
                            </div>
                            <div className="margin-bottom-20px">
                                <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                    <h4>Email <span style={{ color: "red" }}>*</span></h4>
                                </div>

                                <div className="margin-5px">
                                    <input
                                        type="text"
                                        required
                                        className="txt txt-sekunder-color"
                                        readOnly={type === "detail"}
                                        style={type === "detail" ? { backgroundColor: "#E6E6E6" } : null}
                                        value={esemail}
                                        onChange={(e) => {
                                            this.setState({
                                                data: {
                                                    ...this.state.data,
                                                    esemail: e.target.value
                                                }
                                            })
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="margin-bottom-20px">
                                <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                    <h4>Phone Number <span style={{ color: "red" }}>*</span></h4>
                                </div>

                                <div className="margin-5px">
                                    <input
                                        type="text"
                                        required
                                        className="txt txt-sekunder-color"
                                        readOnly={type === "detail"}
                                        style={type === "detail" ? { backgroundColor: "#E6E6E6" } : null}
                                        value={estelpNumber}
                                        onChange={(e) => {
                                            if (isNaN(e.target.value)) return null
                                            if (e.target.value.length > 13) {
                                                return null
                                            }
                                            this.setState({
                                                data: {
                                                    ...this.state.data,
                                                    estelpNumber: e.target.value
                                                }
                                            })
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="margin-bottom-20px">
                                <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                    <h4>Website</h4>
                                </div>

                                <div className="margin-5px">
                                    <input
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        readOnly={type === "detail"}
                                        style={type === "detail" ? { backgroundColor: "#E6E6E6" } : null}
                                        value={eswebsite}
                                        onChange={(e) => {
                                            this.setState({
                                                data: {
                                                    ...this.state.data,
                                                    eswebsite: e.target.value
                                                }
                                            })
                                        }}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                    <h4>Activation <span style={{ color: "red" }}>*</span></h4>
                                </div>
                                <div className="margin-15px">
                                    <label className="radio">
                                        <input
                                            type="checkbox"
                                            name="status"
                                            disabled
                                            required
                                            style={type === "detail" ? { backgroundColor: "#E6E6E6" } : null}
                                            checked={true}
                                            onChange={(e) => {
                                                this.setState({
                                                    data: {
                                                        ...this.state.data,
                                                        esStatus: e.target.checked
                                                    }
                                                })
                                            }}
                                        />
                                        <span className="checkmark" />
                                        <span className="txt-site txt-11 txt-bold txt-main">
                                            Activate now
                                                    </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-top padding-15px content-right">
                        <button
                            type="button"
                            onClick={this.props.onClickClose}
                            className="btn btn-primary margin-right-10px">
                            CLOSE
                            </button>
                        {type === "update" ?
                            <button
                                type="submit"
                                className="btn btn-blue"
                            // onClick={() => this.props.onClickSave({
                            //     ...this.state.data,
                            //     pic: this.state.dataEmp.employeeID ? this.state.dataEmp.employeeID : pic ? pic.employeeID : '',
                            //     parent: this.state.data.estype === 'CORPTYP-002' ? '' : this.state.dataHolding.esid ? this.state.dataHolding.esid : parent ? parent.esid : ''
                            // })}
                            >
                                SAVE
                            </button> : null}
                    </div>
                    <ReactTooltip />
                </form>
                {/*<div className="padding-bottom-20px" />*/}
            </div>
        )
    }
}

export default FormCorporateGeneral