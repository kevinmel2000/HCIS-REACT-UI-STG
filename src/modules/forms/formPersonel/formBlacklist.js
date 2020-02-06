import React, { Component } from "react"
import M from 'moment'
import { Checkbox } from "@material-ui/core"
import EmployeeSearchForm from "../formInbox/employeeSearchForm"
import DropDown from '../../../modules/popup/DropDown'
import CalendarPicker from '../../../modules/popup/Calendar'
import * as R from 'ramda'
import ReactTooltip from 'react-tooltip'
import Loader from 'react-loader-spinner'

const payloadBlacklistDefault = {
    "blacklistID": '',
    "blacklistSPKNumber": "",
    "blacklistName": "",
    "blacklistStartDate": "",
    "blacklistEndDate": "",
    "blacklistNotes": "",
    "blacklistType": "",
    "blacklistCategory": "",
    "blacklistStatus": "INITIATE",
    "employeeID": "",
    "employeeName": "",
    "isPermanent": false,
    "blacklistCreationalDTO": {
        "createdBy": "SYSTEM",
        "createdDate": M().format("DD-MM-YYYY HH:mm:ss"),
        "modifiedBy": null,
        "modifiedDate": null

    }
}

class FormBlacklist extends Component {
    constructor(props) {
        super(props)
        this.state = {
            employeeSearchFormVisible: false,
            searchClass: "app-popup",
            dataBlacklist: props.data ? {
                ...props.data,
                blacklistStartDate: props.data.blacklistStartDate === "Invalid date" ? "" : M(props.data.blacklistStartDate).format("YYYY-MM-DD"),
                blacklistEndDate: props.data.blacklistEndDate === "Invalid date" ? "" : M(props.data.blacklistEndDate).format("YYYY-MM-DD")
            } : {...payloadBlacklistDefault,
                blacklistID: 'BLAC-' + M() },
            bizparBlacklistCategory: props.bizparBlacklistCategory,
            bizparBlacklistType: props.bizparBlacklistType,
            bizparEmployeeType: props.bizparEmployeeType,
            imageUrl: "",
            loading:false,
            buttonType: ""
        }
    }

    openSearch = () => {
        if (this.state.searchClass === "app-popup app-popup-show") {
            this.setState({ searchClass: "app-popup" });
        } else {
            this.setState({ searchClass: "app-popup app-popup-show" });
        }
    };

    openSearchEmployee = () => this.setState({ employeeSearchFormVisible: !this.state.employeeSearchFormVisible })

    async getImage(employeeID) {
        this.setState({ loading: true, imageUrl: '' })
        let response = await fetch(process.env.REACT_APP_HCIS_BE_API + 'emcmd/api/employee.photo.get/' + employeeID, {
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4'
            }
        })
        response = await response.blob()
        if (response.size > 0) {
            setTimeout(()=> {
                response = URL.createObjectURL(response);
                this.setState({ imageUrl: response, loading: false })
            }, 500)
        } else {
            setTimeout(() => {
                this.setState({ imageUrl:'', loading: false })
            }, 500)
        }
    }

    handleChooseEmployee = (value) => {
        let { employeeName, employeeID, employeeType } = value
        this.setState({
            employeeSearchFormVisible: false,
            dataBlacklist: {
                ...this.state.dataBlacklist,
                employeeID,
                employeeName,
                employeeType: employeeType.bizparKey
            },
            employeeTypeEmp: employeeType.bizparValue
        })
        this.getImage(employeeID)
    }

    componentDidMount() {
        if (this.props.type !== "create") this.getImage(this.state.dataBlacklist.employeeID)
    }

    componentDidUpdate(prevProps) {
        if (this.props.type !== "create" && this.props.data !== undefined) {
            if (this.props.data !== prevProps.data) {
                this.getImage(this.props.data.employeeID)
                this.setState({
                    dataBlacklist: {
                        ...this.props.data,
                        blacklistStartDate: this.props.data.blacklistStartDate === "Invalid date" ? "" : M(this.props.data.blacklistStartDate).format("YYYY-MM-DD"),
                        blacklistEndDate: this.props.data.blacklistEndDate === "Invalid date" ? "" : M(this.props.data.blacklistEndDate).format("YYYY-MM-DD")
                    }
                })
            }
        }
    }

    renderEditBlacklist = () => {
        let {
            employeeID,
            employeeName,
            employeeType,
            isPermanent,
        } = this.state.dataBlacklist
        return (
            <div className="a-s-p-place active">
                <div className="a-s-p-top">
                    <div className="grid grid-2x">
                        <div className="col-1">
                            <div className="display-flex-normal margin-top-10px">
                                <i className="fa fa-1x fa-user-times"></i>
                                <span className="txt-site txt-11 txt-main margin-left-10px">
                                    Blacklist - {this.props.type === "edit" ? "Edit" : "View"} Form
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
                {this.state.employeeSearchFormVisible && (
                    <EmployeeSearchForm
                        onClickClose={this.openSearchEmployee.bind(this)}
                        onChoose={this.handleChooseEmployee.bind(this)}
                    />
                )}
                <form action="#" onSubmit={(e) => {
                    e.preventDefault()
                    if (!R.isEmpty(this.state.dataBlacklist.blacklistStartDate) && !R.isEmpty(this.state.dataBlacklist.blacklistEndDate) && (this.state.dataBlacklist.blacklistEndDate < this.state.dataBlacklist.blacklistStartDate)) return alert('End Date Should be Greater Than Start Date.')
                    if (R.isEmpty(employeeName)) return alert("Employee is Required.")
                    if (R.isEmpty(this.state.dataBlacklist.blacklistType)) return alert("Blacklist Type is Required.")
                    if (R.isEmpty(this.state.dataBlacklist.blacklistCategory)) return alert("Blacklist Category is Required.")
                    if (!isPermanent && R.isEmpty(this.state.dataBlacklist.blacklistStartDate)) return alert("Start Date is Required.")
                    if (!isPermanent && R.isEmpty(this.state.dataBlacklist.blacklistEndDate)) return alert("End Date is Required.")
                    if (this.state.buttonType === "save") {
                        this.props.onClickSave(this.state.dataBlacklist)
                    } else {
                        this.props.onClickSubmit(this.state.dataBlacklist)
                    }
                }}>
                    <div className="a-s-p-mid a-s-p-pad border-top">
                        <div className="display-flex-normals margin-bottom-10px">
                            <div className="padding-top-15px padding-bottom-15px">
                                <div className="image image-200px image-circle background-white border-all" style={{ margin: 'auto' }}>
                                    {this.state.loading && (
                                        <Loader
                                            type="ThreeDots"
                                            style={{display:'flex', justifyContent:'center',marginTop:60}}
                                            color={"#somecolor"}
                                            height={80}
                                            width={80}
                                            loading={this.state.loading}
                                        />
                                    )}
                                    {this.state.imageUrl ? (
                                        <img width="100%" height="100%" src={this.state.imageUrl} alt="" />
                                    ) : this.state.loading === true ? <i/> : <i className="icn fa fa-2x fa-user"></i>}
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>NIK <span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                    </div>
                                    <input
                                        value={employeeID}
                                        type="text"
                                        disabled
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        className="txt txt-sekunder-color"
                                        placeholder="NIK"
                                    />
                                </div>
                                <div className="card-date-picker margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Employee Name <span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                    </div>
                                    <div className="double">
                                        <input
                                            style={{ backgroundColor: "#E6E6E6",padding:15 }}
                                            value={employeeName}
                                            className="input"
                                            name="search"
                                            disabled
                                            placeholder="Employee Name ">
                                            </input>
                                        <button
                                            className="btn btn-grey border-left btn-no-radius"                                            
                                            type="button"
                                            disabled={this.props.type !== 'create' ? true : false}
                                            onClick={this.openSearchEmployee.bind(this)}
                                        >
                                            <i className="fa fa-lg fa-search"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Employee Type <span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                    </div>
                                    <DropDown
                                        title="-- please select employee type --"
                                        onChange={(dt) => console.log(dt)}
                                        type="bizpar"
                                        disabled={true}
                                        data={this.props.bizparEmployeeType}
                                        bizValue={this.state.employeeTypeEmp}
                                        value={employeeType} />
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Blacklist Type <span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                    </div>
                                    <DropDown
                                        title="-- please select blacklist type --"
                                        onChange={(dt) => this.setState({
                                            dataBlacklist: {
                                                ...this.state.dataBlacklist,
                                                blacklistType: dt
                                            }
                                        })}
                                        type="bizpar"
                                        disabled={this.props.type === "view" ? true : false}
                                        data={this.state.bizparBlacklistType}
                                        bizValue={this.state.dataBlacklist.type}
                                        value={this.state.dataBlacklist.blacklistType} />
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Blacklist Category <span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                    </div>
                                    <DropDown
                                        title="-- please select blacklist category --"
                                        onChange={(dt) => this.setState({
                                            dataBlacklist: {
                                                ...this.state.dataBlacklist,
                                                blacklistCategory: dt
                                            }
                                        })}
                                        type="bizpar"
                                        disabled={this.props.type === "view" ? true : false}
                                        data={this.state.bizparBlacklistCategory}
                                        bizValue={this.state.dataBlacklist.category}
                                        value={this.state.dataBlacklist.blacklistCategory} />
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Reason <span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                    </div>
                                    <div>
                                        <textarea
                                            value={this.state.dataBlacklist.blacklistNotes}
                                            onChange={(e) => this.setState({
                                                dataBlacklist: {
                                                    ...this.state.dataBlacklist,
                                                    blacklistNotes: e.target.value
                                                }
                                            })}
                                            className="form-control rounded-0"
                                            type="text"
                                            readOnly={this.props.type === "view" ? true : false}
                                            style={this.props.type === "view" ? { backgroundColor: "#E6E6E6" } : null}
                                            required
                                            placeholder=""
                                            cols="80"
                                            rows="5"
                                        />
                                    </div>
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Blacklist Status</h4>
                                        </div>
                                    </div>
                                    <label>
                                        <Checkbox
                                            style={{ color: this.props.type !== "view" ? "#2ECC71" : "#E6E6E6" }}
                                            onChange={(e) => this.setState({
                                                dataBlacklist: {
                                                    ...this.state.dataBlacklist,
                                                    isPermanent: e.target.checked,
                                                    blacklistStartDate: e.target.checked === true ? "" : this.state.dataBlacklist.blacklistStartDate,
                                                    blacklistEndDate: e.target.checked === true ? "" : this.state.dataBlacklist.blacklistEndDate
                                                }
                                            })}
                                            disabled={this.props.type === "view" ? true : false}
                                            value={isPermanent}
                                            checked={isPermanent}
                                        /> Permanent
                                    </label>
                                </div>
                                {!isPermanent &&
                                    <div className="margin-bottom-20px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>Effective Date <span style={{ color: "red" }}>*</span></h4>
                                            </div>
                                        </div>
                                        <div className="grid">
                                            <CalendarPicker
                                                style={{ width: '100%' }}
                                                disabled={this.props.type === "view" ? true : false}
                                                date={this.state.dataBlacklist.blacklistStartDate}
                                                onChange={(e) => this.setState({
                                                    dataBlacklist: {
                                                        ...this.state.dataBlacklist,
                                                        blacklistStartDate: M(e).format('YYYY-MM-DD')
                                                    }
                                                })} />
                                            <div style={{ width: '30px', textAlign: 'center', padding: '7.5px' }}>
                                                <span className="txt-site txt-center txt-11">To</span>
                                            </div>
                                            <CalendarPicker
                                                style={{ width: '100%' }}
                                                disabled={this.props.type === "view" ? true : false}
                                                date={this.state.dataBlacklist.blacklistEndDate}
                                                onChange={(e) => this.setState({
                                                    dataBlacklist: {
                                                        ...this.state.dataBlacklist,
                                                        blacklistEndDate: M(e).format('YYYY-MM-DD')
                                                    }
                                                })} />
                                        </div>
                                    </div>}

                                <div className="border-top padding-top-20px content-right">
                                    {this.props.type !== "view" ? (
                                        <button
                                            style={{ marginLeft: "15px" }}
                                            className="btn btn-blue"
                                            type="submit"
                                            onClick={() => this.setState({ buttonType: "save" })}
                                        >
                                            <span>SAVE</span>
                                        </button>
                                    ) : null}
                                    {this.props.type !== "view" ? (
                                        <button
                                            style={{ marginLeft: "15px" }}
                                            className="btn btn-blue"
                                            type="submit"
                                            onClick={() => this.setState({ buttonType: "submit" })}
                                        >
                                            <span>SAVE & SUBMIT</span>
                                        </button>
                                    ) : null}
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
                    </div >
                </form>
                <ReactTooltip />
            </div >
        )
    }

    render() {
        let {
            employeeID,
            employeeName,
            employeeType,
            isPermanent,
        } = this.state.dataBlacklist

        return (
            this.props.type !== "create" ? this.renderEditBlacklist() :
                <div className="app-popup app-popup-show ">
                    <div className="padding-top-20px" />
                    <div className="popup-content background-white border-radius">
                        <div className="popup-panel grid grid-2x">
                            <div className="col-1">
                                <div className="popup-title">
                                    {this.props.type === "create"
                                        ? "Blacklist - Create Form"
                                        : this.props.type === "edit"
                                            ? "Blacklist - Edit Form"
                                            : "Blacklist - View Form"}
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

                        {this.state.employeeSearchFormVisible && (
                            <EmployeeSearchForm
                                onClickClose={this.openSearchEmployee.bind(this)}
                                onChoose={this.handleChooseEmployee.bind(this)}
                            />
                        )}
                        <form action="#" onSubmit={(e) => {
                            e.preventDefault()
                            if (!R.isEmpty(this.state.dataBlacklist.blacklistStartDate) && !R.isEmpty(this.state.dataBlacklist.blacklistEndDate) && (this.state.dataBlacklist.blacklistEndDate < this.state.dataBlacklist.blacklistStartDate)) return alert('End Date Should be Greater Than Start Date.')
                            if (R.isEmpty(employeeName)) return alert("Employee is Required.")
                            if (R.isEmpty(this.state.dataBlacklist.blacklistType)) return alert("Blacklist Type is Required.")
                            if (R.isEmpty(this.state.dataBlacklist.blacklistCategory)) return alert("Blacklist Category is Required.")
                            if (!isPermanent && R.isEmpty(this.state.dataBlacklist.blacklistStartDate)) return alert("Start Date is Required.")
                            if (!isPermanent && R.isEmpty(this.state.dataBlacklist.blacklistEndDate)) return alert("End Date is Required.")
                            if (this.state.buttonType === "save") {
                                this.props.onClickSave(this.state.dataBlacklist)
                            } else {
                                this.props.onClickSubmit(this.state.dataBlacklist)
                            }
                        }}>
                            <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-20px">
                                <div className="column-1 margin-top-20px">
                                    <div className="image image-200px image-circle background-white border-all" style={{ margin: 'auto' }}>
                                        {this.state.loading && (
                                            <Loader
                                                type="ThreeDots"
                                                style={{display:'flex', justifyContent:'center',marginTop:60}}
                                                color={"#somecolor"}
                                                height={80}
                                                width={80}
                                                loading={this.state.loading}
                                        />
                                        )}
                                        {this.state.imageUrl ? (
                                        <img width="100%" height="100%" src={this.state.imageUrl} alt="" />
                                    ) : this.state.loading === true ? <i/> : <i className="icn fa fa-2x fa-user"></i>}
                                    </div>
                                    <br></br>
                                    <div className="margin-bottom-20px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>NIK <span style={{ color: "red" }}>*</span></h4>
                                            </div>
                                        </div>
                                        <input
                                            value={employeeID}
                                            type="text"
                                            disabled
                                            style={{ backgroundColor: "#E6E6E6" }}
                                            className="txt txt-sekunder-color"
                                            placeholder="NIK"
                                        />
                                    </div>
                                    <div className="card-date-picker margin-bottom-20px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>Employee Name <span style={{ color: "red" }}>*</span></h4>
                                            </div>
                                        </div>
                                        <div className="double">
                                            <input
                                                style={{ backgroundColor: "#E6E6E6",padding:15 }}
                                                value={employeeName}
                                                className="input"
                                                name="search"
                                                disabled
                                                placeholder="Employee Name "></input>
                                            <button
                                                className="btn btn-grey border-left btn-no-radius"                                                
                                                type="button"
                                                disabled={this.props.type !== 'create' ? true : false}
                                                onClick={this.openSearchEmployee.bind(this)}
                                            >
                                                <i className="fa fa-lg fa-search"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="margin-bottom-20px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>Employee Type <span style={{ color: "red" }}>*</span></h4>
                                            </div>
                                        </div>
                                        <DropDown
                                            title="-- please select employee type --"
                                            onChange={(dt) => console.log(dt)}
                                            type="bizpar"
                                            disabled={true}
                                            data={this.props.bizparEmployeeType}
                                            bizValue={this.state.employeeTypeEmp}
                                            value={employeeType} />
                                    </div>
                                </div>

                                <div className="column-2">
                                    <div className="margin-bottom-20px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>Blacklist Type <span style={{ color: "red" }}>*</span></h4>
                                            </div>
                                        </div>
                                        <DropDown
                                            title="-- please select blacklist type --"
                                            onChange={(dt) => this.setState({
                                                dataBlacklist: {
                                                    ...this.state.dataBlacklist,
                                                    blacklistType: dt
                                                }
                                            })}
                                            type="bizpar"
                                            disabled={this.props.type === "view" ? true : false}
                                            data={this.state.bizparBlacklistType}
                                            value={this.state.dataBlacklist.blacklistType} />
                                    </div>

                                    <div className="margin-bottom-20px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>Blacklist Category <span style={{ color: "red" }}>*</span></h4>
                                            </div>
                                        </div>
                                        <DropDown
                                            title="-- please select blacklist category --"
                                            onChange={(dt) => this.setState({
                                                dataBlacklist: {
                                                    ...this.state.dataBlacklist,
                                                    blacklistCategory: dt
                                                }
                                            })}
                                            type="bizpar"
                                            disabled={this.props.type === "view" ? true : false}
                                            data={this.state.bizparBlacklistCategory}
                                            value={this.state.dataBlacklist.blacklistCategory} />
                                    </div>

                                    <div className="margin-bottom-20px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>Reason <span style={{ color: "red" }}>*</span></h4>
                                            </div>
                                        </div>
                                        <div>
                                            <textarea
                                                value={this.state.dataBlacklist.blacklistNotes}
                                                onChange={(e) => this.setState({
                                                    dataBlacklist: {
                                                        ...this.state.dataBlacklist,
                                                        blacklistNotes: e.target.value
                                                    }
                                                })}
                                                className="form-control rounded-0"
                                                type="text"
                                                readOnly={this.props.type === "view" ? true : false}
                                                style={this.props.type === "view" ?
                                                    { backgroundColor: "#E6E6E6" }
                                                    : null}
                                                required
                                                placeholder=""
                                                cols="80"
                                                rows="5"
                                            />
                                        </div>
                                    </div>
                                    <div className="margin-bottom-20px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>Blacklist Status</h4>
                                            </div>
                                        </div>
                                        <label>
                                            <Checkbox
                                                style={{ color: this.props.type !== "view" ? "#2ECC71" : "#E6E6E6" }}
                                                onChange={(e) => this.setState({
                                                    dataBlacklist: {
                                                        ...this.state.dataBlacklist,
                                                        isPermanent: e.target.checked,
                                                        blacklistStartDate: e.target.checked === true ? "" : this.state.dataBlacklist.blacklistStartDate,
                                                        blacklistEndDate: e.target.checked === true ? "" : this.state.dataBlacklist.blacklistEndDate
                                                    }
                                                })}
                                                disabled={this.props.type === "view" ? true : false}
                                                value={isPermanent}
                                                checked={isPermanent}
                                            /> Permanent
                                    </label>
                                    </div>
                                    {!isPermanent &&
                                        <div className="margin-bottom-20px">
                                            <div className="margin-5px">
                                                <div className="txt-site txt-11 txt-main txt-bold">
                                                    <h4>Effective Date <span style={{ color: "red" }}>*</span></h4>
                                                </div>
                                            </div>
                                            <div className="display-flex-normal">
                                                <CalendarPicker
                                                    style={{ width: '100%' }}
                                                    disabled={this.props.type === "view" ? true : false}
                                                    date={this.state.dataBlacklist.blacklistStartDate}
                                                    onChange={(e) => this.setState({
                                                        dataBlacklist: {
                                                            ...this.state.dataBlacklist,
                                                            blacklistStartDate: e
                                                        }
                                                    })} />
                                                <div className="column-2" style={{ width: '30px', textAlign: 'center', paddingTop: '7.5px' }}>
                                                    <span className="txt-site txt-center txt-11">To</span>
                                                </div>
                                                <CalendarPicker
                                                    style={{ width: '100%' }}
                                                    disabled={this.props.type === "view" ? true : false}
                                                    date={this.state.dataBlacklist.blacklistEndDate}
                                                    onChange={(e) => this.setState({
                                                        dataBlacklist: {
                                                            ...this.state.dataBlacklist,
                                                            blacklistEndDate: e
                                                        }
                                                    })} />
                                            </div>
                                        </div>}
                                </div>
                            </div>

                            <div className="padding-15px">
                                <div className="grid grid-2x">
                                    <div className="col-1" />
                                    <div className="col-2 content-right">
                                        {this.props.type !== "view" ? (
                                            <button
                                                style={{ marginLeft: "15px" }}
                                                className="btn btn-blue"
                                                type="submit"
                                                onClick={() => this.setState({ buttonType: "save" })}
                                            >
                                                <span>SAVE</span>
                                            </button>
                                        ) : null}
                                        {this.props.type !== "view" ? (
                                            <button
                                                style={{ marginLeft: "15px" }}
                                                className="btn btn-blue"
                                                type="submit"
                                                onClick={() => this.setState({ buttonType: "submit" })}
                                            >
                                                <span>SAVE & SUBMIT</span>
                                            </button>
                                        ) : null}
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
                        </form>
                    </div>
                    <div className="padding-bottom-20px" />
                </div>
        );
    }
}

export default FormBlacklist;
